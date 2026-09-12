(ns axxium.infra.identity-oauth-test
  (:require [axxium.extern.identity-host :as host]
            [axxium.extern.identity-http :as http]
            [axxium.extern.oauth :as oauth]
            [axxium.infra.identity :as identity]
            [axxium.infra.identity-oauth :as identity-oauth]
            [cljs.test :refer [deftest is]]
            ["jose" :as jose]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]))

(deftest ^:async local-issuer-github-flow-test
  (let [issuer (http/create-app)
        token-form (atom nil)]
    (try
      (.addContentTypeParser issuer "application/x-www-form-urlencoded" #js {:parseAs "string"}
                             (fn [_ body done] (done nil body)))
      (.post issuer "/token"
             (fn [request reply]
               (reset! token-form (js/URLSearchParams. (.-body request)))
               (.send reply #js {:access_token "test-issuer-access-token" :token_type "bearer"})))
      (.get issuer "/user" (fn [_ reply] (.send reply #js {:id 42 :login "remote-user"})))
      (.get issuer "/emails" (fn [_ reply] (.send reply #js [#js {:email "spoof@example.test" :primary true :verified false}
                                                             #js {:email "verified@example.test" :primary true :verified true}])))
      (let [origin (await (http/listen! issuer "127.0.0.1" 0))
            service (identity/open! {:provider :memory :public-base-url "http://localhost:8787"
                                      :providers {:github {:client-id "test-client" :client-secret "test-secret"
                                                           :authorize-url (str origin "/authorize") :token-url (str origin "/token")
                                                           :user-url (str origin "/user") :emails-url (str origin "/emails")}}})
            browser (host/random-token)
            url (js/URL. (identity-oauth/begin! service :github browser nil {:redirect "/wiki"} nil))
            state (.get (.-searchParams url) "state")
            result (await (identity-oauth/finish! service :github browser {:state state :code "authorization-code"} nil))]
        (is (= "S256" (.get (.-searchParams url) "code_challenge_method")))
        (is (= "test-client" (.get @token-form "client_id")))
        (is (= "authorization-code" (.get @token-form "code")))
        (is (= "http://localhost:8787/api/auth/callback/github" (.get @token-form "redirect_uri")))
        (is (<= 43 (count (.get @token-form "code_verifier")) 128))
        (is (= "/wiki" (:redirect result)))
        (is (= (:principal result) (identity/resolve-principal service (:token result))))
        (is (nil? (get-in result [:principal :principal/email])) "Even verified provider email is not a local account alias")
        (try
          (await (identity-oauth/finish! service :github browser {:state state :code "authorization-code"} nil))
          (is false "a completed OAuth state cannot be replayed")
          (catch :default error (is (= :invalid-challenge (:code (ex-data error)))))))
      (finally (await (http/close! issuer))))))

(deftest ^:async google-signature-issuer-audience-and-nonce-test
  (let [issuer (http/create-app)
        pair (await (jose/generateKeyPair "RS256"))
        jwk (await (jose/exportJWK (.-publicKey pair)))
        nonce "expected-login-nonce"
        id-token (atom nil)]
    (try
      (aset jwk "kid" "local-test-key")
      (.addContentTypeParser issuer "application/x-www-form-urlencoded" #js {:parseAs "string"}
                             (fn [_ body done] (done nil body)))
      (.get issuer "/jwks" (fn [_ reply] (.send reply #js {:keys #js [jwk]})))
      (.post issuer "/token" (fn [_ reply] (.send reply #js {:access_token "opaque" :id_token @id-token})))
      (let [origin (await (http/listen! issuer "127.0.0.1" 0))
            config {:issuer "https://accounts.google.com" :client-id "local-test-client" :client-secret "local-test-secret"
                    :token-url (str origin "/token") :jwks-url (str origin "/jwks")}
            signer (jose/SignJWT. #js {:sub "google-subject" :nonce nonce :email "verified@example.test" :email_verified true})]
        (.setProtectedHeader signer #js {:alg "RS256" :kid "local-test-key"})
        (.setIssuer signer "https://accounts.google.com")
        (.setAudience signer "local-test-client")
        (.setExpirationTime signer "5m")
        (reset! id-token (await (.sign signer (.-privateKey pair))))
        (is (= "google-subject" (:subject (await (oauth/exchange! :google config {:code "code" :verifier "verifier" :nonce nonce :redirect-uri "http://localhost/callback"})))))
        (try
          (await (oauth/exchange! :google config {:code "code" :verifier "verifier" :nonce "wrong" :redirect-uri "http://localhost/callback"}))
          (is false "nonce mismatch must reject a validly signed ID token")
          (catch :default error (is (= :invalid-provider-response (:code (ex-data error))))))
        (try
          (await (oauth/exchange! :google (assoc config :client-id "different-client") {:code "code" :verifier "verifier" :nonce nonce :redirect-uri "http://localhost/callback"}))
          (is false "audience mismatch must reject a validly signed ID token")
          (catch :default _ (is true))))
      (finally (await (http/close! issuer))))))

(deftest ^:async atproto-client-key-and-metadata-restart-test
  (let [directory (fs/mkdtempSync (path/join (os/tmpdir) "axxium-atproto-"))
        options {:provider :edn :directory directory :public-base-url "https://identity.example.test"
                 :providers {:atproto {:client-id "https://identity.example.test/api/auth/atproto/client-metadata.json"}}}]
    (try
      (let [first-client (await (identity-oauth/create-atproto-client! (identity/open! options)))
            second-client (await (identity-oauth/create-atproto-client! (identity/open! options)))
            metadata (oauth/atproto-metadata first-client)]
        (is (= "private_key_jwt" (:token_endpoint_auth_method metadata)))
        (is (true? (:dpop_bound_access_tokens metadata)))
        (is (= ["https://identity.example.test/api/auth/callback/atproto"] (:redirect_uris metadata)))
        (is (= (oauth/atproto-jwks first-client) (oauth/atproto-jwks second-client))))
      (finally (fs/rmSync directory #js {:recursive true :force true})))))
