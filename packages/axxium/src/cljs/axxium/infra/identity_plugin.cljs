(ns axxium.infra.identity-plugin
  "Authentication route descriptions over defined request and response data."
  (:require [axxium.extern.identity-http :as http]
            [axxium.extern.identity-host :as host]
            [axxium.extern.oauth :as oauth]
            [axxium.infra.identity :as identity]
            [axxium.infra.identity-ceremonies :as ceremonies]
            [axxium.infra.identity-credentials :as credentials]
            [axxium.infra.identity-oauth :as identity-oauth]
            [axxium.law.identity :as law]
            [axxium.law.identity-http :as http-law]))

(defn auth-config
  "One method registry drives provider selection for human and agent clients."
  [service]
  (let [methods (mapv (fn [[id label kind]]
                        (cond-> {:id (name id) :label label :kind kind
                                 :available (if (#{:password :pgp :passkey} id) true (identity-oauth/configured? service id))}
                          (= id :password) (assoc :loginUrl "/api/auth/local/login" :loginMethod "POST")
                          (#{:github :discord :google :atproto} id)
                          (assoc :loginUrl (str "/api/auth/providers/" (name id) "/login") :loginMethod "GET"
                                 :linkUrl (str "/api/auth/providers/" (name id) "/link") :linkMethod "POST")))
                      [[:password "Username or email and password" "password"]
                       [:github "GitHub" "oauth"] [:discord "Discord" "oauth"]
                       [:google "Google" "oauth"] [:atproto "Bluesky / ATProto" "atproto"]
                       [:pgp "PGP key" "pgp"] [:passkey "Passkey" "passkey"]])]
    {:identityProvider "axxium" :methods methods :localPasswordEnabled true
     :credentialListUrl "/api/auth/credentials" :credentialRevokeUrl "/api/auth/credentials/revoke"
     :githubEnabled (identity-oauth/configured? service :github)
     :loginUrl "/api/auth/providers/github/login" :localLoginUrl "/api/auth/local/login"
     :publicBaseUrl (get-in service [:options :public-base-url])}))

(defn- complete-login [result]
  {:body (dissoc result :token) :session-token (:token result)})

(defn- mutation! [service request]
  (http/csrf! request (get-in service [:options :public-base-url])))

(defn- ^:async with-browser [request respond]
  (let [token (or (:browser-token request) (host/random-token))
        response (await (respond token))]
    ;; A new five-minute challenge renews the browser's binding lifetime too.
    (assoc response :browser-token token)))

(defn ^:async routes!
  "Describe handlers without accepting a native server or transport handle."
  [service _options]
  (let [origin (get-in service [:options :public-base-url])
        atproto-client (await (identity-oauth/create-atproto-client! service))
        routes (atom [])
        route! (fn [method path handler]
                 (swap! routes conj {:method method :path path :handler handler}))]
    (route! "GET" "/api/auth/config" (fn [_] {:body (auth-config service)}))
    (route! "GET" "/api/auth/credentials"
            (fn [request] {:body (credentials/inventory service (:token request))}))
    (route! "POST" "/api/auth/credentials/revoke"
            (fn [request]
              (mutation! service request)
              {:body (credentials/revoke! service (:token request) (:body request)) :clear-session? true}))
    (route! "GET" "/api/auth/me"
            (fn [request] {:body {:principal (identity/require-principal! service (:token request))}}))
    (route! "POST" "/api/auth/signup"
            (fn ^:async handle [request]
              (mutation! service request)
              (complete-login
               (await (ceremonies/password-work! (:store service) (:client-key request)
                                                 #(identity/signup! service (:body request)))))))
    (route! "POST" "/api/auth/local/login"
            (fn ^:async handle [request]
              (mutation! service request)
              (complete-login
               (await (ceremonies/password-work! (:store service) (:client-key request)
                                                 #(identity/login! service (:body request)))))))
    (route! "POST" "/api/auth/logout"
            (fn [request]
              (mutation! service request)
              (identity/logout! service (:token request))
              {:body {:ok true} :clear-session? true}))
    (route! "GET" "/api/auth/login"
            (fn ^:async handle [request]
              (law/require! (not= "true" (get-in request [:query :link]))
                            :link-requires-post "Initiate account linking with POST to the provider link route")
              (await (with-browser request
                       (fn ^:async respond [browser]
                         {:redirect (await (identity-oauth/begin! service :github browser
                                                                (:token request) (:query request) atproto-client))})))))
    (route! "GET" "/api/auth/providers/:provider/login"
            (fn ^:async handle [request]
              (law/require! (not= "true" (get-in request [:query :link]))
                            :link-requires-post "Initiate account linking with POST to the provider link route")
              (await (with-browser request
                       (fn ^:async respond [browser]
                         {:redirect (await (identity-oauth/begin! service (keyword (get-in request [:params :provider]))
                                                                browser (:token request) (:query request) atproto-client))})))))
    (route! "POST" "/api/auth/providers/:provider/link"
            (fn ^:async handle [request]
              (mutation! service request)
              (identity/require-principal! service (:token request))
              (await (with-browser request
                       (fn ^:async respond [browser]
                         {:body {:authorizationUrl
                                 (await (identity-oauth/begin! service (keyword (get-in request [:params :provider]))
                                                              browser (:token request)
                                                              (assoc (:body request) :link "true") atproto-client))}})))))
    (route! "GET" "/api/auth/callback/:provider"
            (fn ^:async handle [request]
              (let [provider (keyword (get-in request [:params :provider]))]
                (law/require! (#{:github :discord :google :atproto} provider) :unsupported-provider "Unsupported identity provider")
                (let [result (await (identity-oauth/finish! service provider (:browser-token request)
                                                           (:query request) atproto-client))]
                  {:session-token (:token result) :redirect (:redirect result)}))))
    (route! "GET" "/api/auth/atproto/client-metadata.json"
            (fn [_]
              (law/require! atproto-client :provider-not-configured "ATProto is not configured")
              {:body (oauth/atproto-metadata atproto-client)}))
    (route! "GET" "/api/auth/atproto/jwks.json"
            (fn [_]
              (law/require! atproto-client :provider-not-configured "ATProto is not configured")
              {:body (oauth/atproto-jwks atproto-client)}))
    (route! "POST" "/api/auth/pgp/challenge"
            (fn ^:async handle [request]
              (mutation! service request)
              (await (with-browser request
                       (fn [browser]
                         {:body (identity/pgp-challenge! service (:token request) browser
                                                         (update (:body request) :purpose keyword))})))))
    (route! "POST" "/api/auth/pgp/enroll"
            (fn ^:async handle [request]
              (mutation! service request)
              {:body (await (identity/enroll-pgp! service (:token request) (:browser-token request) (:body request)))}))
    (route! "POST" "/api/auth/pgp/verify"
            (fn ^:async handle [request]
              (mutation! service request)
              (complete-login (await (identity/pgp-login! service (:browser-token request) (:body request))))))
    (route! "POST" "/api/auth/passkey/registration-options"
            (fn ^:async handle [request]
              (mutation! service request)
              (await (with-browser request
                       (fn ^:async respond [browser]
                         {:body (await (identity/passkey-registration-options! service (:token request) browser))})))))
    (route! "POST" "/api/auth/passkey/registration-verify"
            (fn ^:async handle [request]
              (mutation! service request)
              {:body (await (identity/passkey-registration-verify! service (:token request) (:browser-token request) (:body request)))}))
    (route! "POST" "/api/auth/passkey/authentication-options"
            (fn ^:async handle [request]
              (mutation! service request)
              (await (with-browser request
                       (fn ^:async respond [browser]
                         {:body (await (identity/passkey-authentication-options! service browser))})))))
    (route! "POST" "/api/auth/passkey/authentication-verify"
            (fn ^:async handle [request]
              (mutation! service request)
              (complete-login (await (identity/passkey-authentication-verify! service (:browser-token request) (:body request))))))
    (route! "POST" "/api/actors/:id/capabilities"
            (fn [request]
              (mutation! service request)
              {:body (identity/update-grants! service (:token request) (get-in request [:params :id])
                                              (get-in request [:body :roles]) (get-in request [:body :capabilities]))}))
    (http-law/require-routes! {:origin origin :routes @routes})))
