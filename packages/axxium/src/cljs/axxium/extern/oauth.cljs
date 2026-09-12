(ns axxium.extern.oauth
  "OAuth HTTP/SDK boundary. Provider replies become verified CLJS identity data."
  (:require [axxium.extern.identity-host :as host]
            [axxium.law.identity :as law]
            [axxium.law.identity-oauth :as client-law]
            ["@atproto/oauth-client-node" :refer [NodeOAuthClient]]
            ["@atproto/jwk-jose" :refer [JoseKey]]
            ["jose" :as jose]
            ["node:crypto" :as crypto]))

(def defaults
  "Fixed production issuer endpoints; test replacements are explicit server configuration."
  {:github {:issuer "https://github.com" :authorize-url "https://github.com/login/oauth/authorize"
            :token-url "https://github.com/login/oauth/access_token" :user-url "https://api.github.com/user"
            :emails-url "https://api.github.com/user/emails" :scope "read:user user:email"}
   :discord {:issuer "https://discord.com" :authorize-url "https://discord.com/oauth2/authorize"
             :token-url "https://discord.com/api/oauth2/token" :user-url "https://discord.com/api/users/@me"
             :scope "identify email"}
   :google {:issuer "https://accounts.google.com" :authorize-url "https://accounts.google.com/o/oauth2/v2/auth"
            :token-url "https://oauth2.googleapis.com/token" :jwks-url "https://www.googleapis.com/oauth2/v3/certs"
            :scope "openid email profile"}})

(defn callback-url "Exact server-configured OAuth callback." [origin provider]
  (str origin "/api/auth/callback/" (name provider)))

(defn pkce "Generate an RFC7636 S256 verifier/challenge pair." []
  (let [verifier (host/random-token)]
    {:verifier verifier
     :challenge (.digest (.update (crypto/createHash "sha256") verifier) "base64url")}))

(defn authorize-url
  "Build a redirect with state, PKCE, and OIDC nonce where applicable."
  [provider config state verifier-challenge nonce redirect-uri]
  (let [url (js/URL. (:authorize-url config))]
    (doseq [[key value] {"client_id" (:client-id config) "redirect_uri" redirect-uri
                        "response_type" "code" "state" state "scope" (:scope config)
                        "code_challenge" verifier-challenge "code_challenge_method" "S256"}]
      (.set (.-searchParams url) key value))
    (when (= :google provider) (.set (.-searchParams url) "nonce" nonce))
    (.toString url)))

(defn- ^:async fetch-json [url init]
  (let [response (await (js/fetch url (js/Object.assign #js {:redirect "error" :signal (js/AbortSignal.timeout 15000)} init)))]
    (law/require! (.-ok response) :provider-unavailable "Identity provider request failed")
    (await (.json response))))

(defn- ^:async bearer-profile [url access-token]
  (await (fetch-json url #js {:headers #js {"Authorization" (str "Bearer " access-token)
                                           "Accept" "application/json"
                                           "User-Agent" "Axxium-Identity"}})))

(defn ^:async exchange!
  "Exchange an OAuth code and validate identity using the selected provider's evidence."
  [provider config {:keys [code verifier nonce redirect-uri]}]
  (let [body (js/URLSearchParams.)]
    (doseq [[key value] {"grant_type" "authorization_code" "client_id" (:client-id config)
                        "client_secret" (:client-secret config) "code" code
                        "code_verifier" verifier "redirect_uri" redirect-uri}]
      (.set body key value))
    (let [tokens (await (fetch-json (:token-url config)
                                    #js {:method "POST" :headers #js {"Accept" "application/json"
                                                                      "Content-Type" "application/x-www-form-urlencoded"}
                                         :body (.toString body)}))
          access-token (aget tokens "access_token")]
      (law/require! (and (string? access-token) (seq access-token)) :invalid-provider-response "Provider returned no access token")
      (case provider
        :google
        (let [jwks (jose/createRemoteJWKSet (js/URL. (:jwks-url config)))
              result (await (jose/jwtVerify (aget tokens "id_token") jwks
                                            #js {:issuer (:issuer config) :audience (:client-id config)
                                                 :algorithms #js ["RS256"]}))
              claims (.-payload result)]
          (law/require! (= nonce (aget claims "nonce")) :invalid-provider-response "OIDC nonce mismatch")
          {:issuer (:issuer config) :subject (aget claims "sub")
           :display-name (aget claims "name")
           :email (when (true? (aget claims "email_verified")) (aget claims "email"))})

        :github
        (let [profile (await (bearer-profile (:user-url config) access-token))
              emails (js->clj (await (bearer-profile (:emails-url config) access-token)) :keywordize-keys true)
              email (some :email (filter #(and (:verified %) (:primary %)) emails))]
          (law/require! (some? (aget profile "id")) :invalid-provider-response "GitHub returned no identity")
          {:issuer (:issuer config) :subject (str (aget profile "id"))
           :display-name (or (aget profile "name") (aget profile "login")) :email email})

        :discord
        (let [profile (await (bearer-profile (:user-url config) access-token))]
          {:issuer (:issuer config) :subject (aget profile "id")
           :display-name (or (aget profile "global_name") (aget profile "username"))
           :email (when (true? (aget profile "verified")) (aget profile "email"))})))))

(defn generate-client-key
  "Generate a server client-signing key; callers persist it in the private vault."
  []
  (let [pair (crypto/generateKeyPairSync "ec" #js {:namedCurve "prime256v1"
                                                   :privateKeyEncoding #js {:type "pkcs8" :format "pem"}
                                                   :publicKeyEncoding #js {:type "spki" :format "pem"}})]
    {:private-key (.-privateKey pair)}))

(defn sdk-store
  "Adapt named local storage operations into the reference SDK's asynchronous store."
  [{:keys [get! put! delete!]}]
  #js {:get (fn ^:async read-sdk [key] (some-> (await (get! key)) clj->js))
       :set (fn ^:async write-sdk [key value] (await (put! key (js->clj value :keywordize-keys true))))
       :del (fn ^:async delete-sdk [key] (await (delete! key)))})

(defn- request-lock
  "Serialize refreshes per session locally and across processes sharing the EDN vault."
  [directory]
  (let [pending (atom {})]
    (fn ^:async with-lock [key run]
      (let [previous (get @pending key (js/Promise.resolve))
            release (atom nil)
            current (js/Promise. (fn [resolve] (reset! release resolve)))]
        (swap! pending assoc key current)
        (try
          (await previous)
          (await (if directory (host/with-private-lock! directory key run) (run)))
          (finally
            (@release)
            (when (identical? current (get @pending key)) (swap! pending dissoc key))))))))

(defn ^:async atproto-client!
  "Expose defined operations; the reference SDK stays closed inside this adapter."
  [{:keys [client-id origin private-key state-store session-store lock-directory]}]
  (let [key (await (JoseKey.fromImportable private-key "axxium-client-1"))
        client (NodeOAuthClient.
     #js {:clientMetadata #js {:client_id client-id :client_name "Axxium"
                               :client_uri origin :redirect_uris #js [(callback-url origin :atproto)]
                               :grant_types #js ["authorization_code" "refresh_token"]
                               :scope "atproto" :response_types #js ["code"] :application_type "web"
                               :token_endpoint_auth_method "private_key_jwt"
                               :token_endpoint_auth_signing_alg "ES256" :dpop_bound_access_tokens true
                               :jwks_uri (str origin "/api/auth/atproto/jwks.json")}
          :keyset #js [key] :requestLock (request-lock lock-directory)
          :stateStore (sdk-store state-store) :sessionStore (sdk-store session-store)})]
    (client-law/require-client!
     {:authorize! (fn ^:async authorize [handle state]
                    (.toString (await (.authorize client handle #js {:state state :scope "atproto"}))))
      :callback! (fn ^:async callback [query]
                   (let [params (js/URLSearchParams. (clj->js query))
                         result (await (.callback client params))]
                     {:state (.-state result)
                      :identity {:issuer "atproto" :subject (.. result -session -did)
                                 :display-name (.. result -session -did)}}))
      :metadata (js->clj (.-clientMetadata client) :keywordize-keys true)
      :jwks (js->clj (.-jwks client) :keywordize-keys true)})))

(defn ^:async atproto-authorize! "Start a handle/DID flow using SDK security mechanisms." [client handle state]
  (await ((:authorize! (client-law/require-client! client)) handle state)))

(defn ^:async atproto-callback! "Verify the SDK callback and return its stable DID identity." [client query]
  (await ((:callback! (client-law/require-client! client)) query)))

(defn atproto-metadata "Expose public SDK metadata only." [client]
  (:metadata (client-law/require-client! client)))
(defn atproto-jwks "Expose public client verification keys only." [client]
  (:jwks (client-law/require-client! client)))
