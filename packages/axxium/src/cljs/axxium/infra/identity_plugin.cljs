(ns axxium.infra.identity-plugin
  "Axxium-owned Fastify authentication plugin for Knoxx and standalone consumers."
  (:require [axxium.extern.identity-http :as http]
            [axxium.extern.oauth :as oauth]
            [axxium.infra.identity :as identity]
            [axxium.infra.identity-oauth :as identity-oauth]
            [axxium.law.identity :as law]))

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
     :githubEnabled (identity-oauth/configured? service :github)
     :loginUrl "/api/auth/providers/github/login" :localLoginUrl "/api/auth/local/login"
     :publicBaseUrl (get-in service [:options :public-base-url])}))

(defn- complete-login! [service reply result]
  (http/set-session! reply (:token result) (get-in service [:options :public-base-url]))
  (http/send! reply 200 (dissoc result :token)))

(defn- mutation! [service request]
  (http/csrf! request (get-in service [:options :public-base-url])))

(defn ^:async register!
  "Register authentication routes; business consumers retain their own content authorization."
  [app service _options]
  (await (http/ensure-cookies! app))
  (let [origin (get-in service [:options :public-base-url])
        atproto-client (await (identity-oauth/create-atproto-client! service))
        browser! (fn [request reply] (http/ensure-browser! request reply origin))]
    (http/register! app "GET" "/api/auth/config" (fn [_ reply] (http/send! reply 200 (auth-config service))))
    (http/register! app "GET" "/api/auth/me"
                    (fn [request reply]
                      (http/send! reply 200 {:principal (identity/require-principal! service (:token request))})))
    (http/register! app "POST" "/api/auth/signup"
                    (fn ^:async handle [request reply]
                      (mutation! service request)
                      (complete-login! service reply (await (identity/signup! service (:body request))))))
    (http/register! app "POST" "/api/auth/local/login"
                    (fn ^:async handle [request reply]
                      (mutation! service request)
                      (complete-login! service reply (await (identity/login! service (:body request))))))
    (http/register! app "POST" "/api/auth/logout"
                    (fn [request reply]
                      (mutation! service request)
                      (identity/logout! service (:token request))
                      (http/clear-session! reply)
                      (http/send! reply 200 {:ok true})))
    (http/register! app "GET" "/api/auth/login"
                    (fn ^:async handle [request reply]
                      (law/require! (not= "true" (get-in request [:query :link]))
                                    :link-requires-post "Initiate account linking with POST to the provider link route")
                      (http/redirect! reply (await (identity-oauth/begin! service :github (browser! request reply)
                                                                         (:token request) (:query request) atproto-client)))))
    (http/register! app "GET" "/api/auth/providers/:provider/login"
                    (fn ^:async handle [request reply]
                      (law/require! (not= "true" (get-in request [:query :link]))
                                    :link-requires-post "Initiate account linking with POST to the provider link route")
                      (http/redirect! reply
                                      (await (identity-oauth/begin! service (keyword (get-in request [:params :provider]))
                                                                    (browser! request reply) (:token request)
                                                                    (:query request) atproto-client)))))
    (http/register! app "POST" "/api/auth/providers/:provider/link"
                    (fn ^:async handle [request reply]
                      (mutation! service request)
                      (identity/require-principal! service (:token request))
                      (http/send! reply 200
                                  {:authorizationUrl
                                   (await (identity-oauth/begin!
                                           service (keyword (get-in request [:params :provider]))
                                           (browser! request reply) (:token request)
                                           (assoc (:body request) :link "true") atproto-client))})))
    (http/register! app "GET" "/api/auth/callback/:provider"
                    (fn ^:async handle [request reply]
                      (let [provider (keyword (get-in request [:params :provider]))]
                        (law/require! (#{:github :discord :google :atproto} provider) :unsupported-provider "Unsupported identity provider")
                        (let [result (await (identity-oauth/finish! service provider (:browser-token request)
                                                                   (:query request) atproto-client))]
                          (http/set-session! reply (:token result) origin)
                          (http/redirect! reply (:redirect result))))))
    (http/register! app "GET" "/api/auth/atproto/client-metadata.json"
                    (fn [_ reply]
                      (law/require! atproto-client :provider-not-configured "ATProto is not configured")
                      (http/send! reply 200 (oauth/atproto-metadata atproto-client))))
    (http/register! app "GET" "/api/auth/atproto/jwks.json"
                    (fn [_ reply]
                      (law/require! atproto-client :provider-not-configured "ATProto is not configured")
                      (http/send! reply 200 (oauth/atproto-jwks atproto-client))))
    (http/register! app "POST" "/api/auth/pgp/challenge"
                    (fn [request reply]
                      (mutation! service request)
                      (http/send! reply 200 (identity/pgp-challenge! service (:token request) (browser! request reply)
                                                                     (update (:body request) :purpose keyword)))))
    (http/register! app "POST" "/api/auth/pgp/enroll"
                    (fn ^:async handle [request reply]
                      (mutation! service request)
                      (http/send! reply 200 (await (identity/enroll-pgp! service (:token request) (:browser-token request) (:body request))))))
    (http/register! app "POST" "/api/auth/pgp/verify"
                    (fn ^:async handle [request reply]
                      (mutation! service request)
                      (complete-login! service reply (await (identity/pgp-login! service (:browser-token request) (:body request))))))
    (http/register! app "POST" "/api/auth/passkey/registration-options"
                    (fn ^:async handle [request reply]
                      (mutation! service request)
                      (http/send! reply 200 (await (identity/passkey-registration-options! service (:token request) (browser! request reply))))))
    (http/register! app "POST" "/api/auth/passkey/registration-verify"
                    (fn ^:async handle [request reply]
                      (mutation! service request)
                      (http/send! reply 200 (await (identity/passkey-registration-verify! service (:token request) (:browser-token request) (:body request))))))
    (http/register! app "POST" "/api/auth/passkey/authentication-options"
                    (fn ^:async handle [request reply]
                      (mutation! service request)
                      (http/send! reply 200 (await (identity/passkey-authentication-options! service (browser! request reply))))))
    (http/register! app "POST" "/api/auth/passkey/authentication-verify"
                    (fn ^:async handle [request reply]
                      (mutation! service request)
                      (complete-login! service reply (await (identity/passkey-authentication-verify! service (:browser-token request) (:body request))))))
    (http/register! app "POST" "/api/actors/:id/capabilities"
                    (fn [request reply]
                      (mutation! service request)
                      (http/send! reply 200 (identity/update-grants! service (:token request) (get-in request [:params :id])
                                                                     (get-in request [:body :roles]) (get-in request [:body :capabilities])))))
    service))
