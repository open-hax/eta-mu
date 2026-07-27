(ns axxium.auth.session
  "Session management for Axxium.
   Cookie-based sessions for browser clients,
   JWT bearer tokens for API clients."
  (:require [axxium.auth.token :as token]
            [axxium.config :as cfg]
            [axxium.db :as db]
            [clojure.string :as str]
            ["node:crypto" :as crypto]))

(def COOKIE-NAME (cfg/get-in-config [:session/cookie-name]))

(defn- hash-token [token]
  (-> (.createHash crypto "sha256")
      (.update token)
      (.digest "hex")))

(defn ^:async create-session!
  "Create a session for an actor. Returns {:token token :actor actor}."
  [actor]
  (let [token (await (token/create-token actor))
        token-hash (hash-token token)
        actor-id (:actor/id actor)
        expiry-hours (cfg/get-in-config [:jwt/expiry-hours])
        expires-at (js/Date. (+ (.getTime (js/Date.)) (* expiry-hours 3600000)))]
    (await (db/query
            "INSERT INTO sessions (actor_id, token_hash, expires_at) VALUES ($1, $2, $3)"
            [actor-id token-hash expires-at]))
    {:token token
     :actor actor}))

(defn ^:async verify-session
  "Verify a session token. Returns promise of actor or nil."
  [token]
  (try
    (let [claims (await (token/verify-token token))
          actor-id (:sub claims)
          actor (await (db/query-one
                        "SELECT a.* FROM actors a
                         JOIN sessions s ON a.id = s.actor_id
                         WHERE a.id = $1 AND s.token_hash = $2 AND s.expires_at > NOW()"
                        [actor-id (hash-token token)]))]
      (when actor
        (js->clj actor :keywordize-keys true)))
    (catch :default _ nil)))

(defn delete-session!
  "Delete a session by token."
  [token]
  (db/query "DELETE FROM sessions WHERE token_hash = $1"
            [(hash-token token)]))

(defn set-session-cookie
  "Set the session cookie on a Fastify reply."
  [reply token]
  (let [cookie-opts #js {:path "/"
                         :httpOnly true
                         :secure (cfg/get-in-config [:session/cookie-secure])
                         :sameSite (cfg/get-in-config [:session/cookie-same-site])
                         :maxAge (* (cfg/get-in-config [:jwt/expiry-hours]) 3600000)}]
    (.setCookie reply COOKIE-NAME token cookie-opts)))

(defn clear-session-cookie
  "Clear the session cookie."
  [reply]
  (.clearCookie reply COOKIE-NAME #js {:path "/"}))

(defn extract-auth-token
  "Extract bearer token from request headers or cookie."
  [req]
  (let [headers (aget req "headers")
        auth-header (str (or (aget headers "authorization") ""))
        cookie-token (some-> req (aget "cookies") (aget COOKIE-NAME))]
    (or
     (when (str/starts-with? (str/lower-case auth-header) "bearer ")
       (str/trim (subs auth-header 7)))
     cookie-token)))

(defn actor->auth-context
  "Project an authenticated actor row into the canonical request context."
  [actor]
  (cond-> {:auth/actor-id (:id actor)
           :auth/entity-id (:entity_id actor)
           :auth/email (:email actor)
           :auth/capabilities (js->clj (:capabilities actor) :keywordize-keys true)
           :auth/roles (js->clj (:roles actor) :keywordize-keys true)}
    (:org_id actor) (assoc :auth/org-id (:org_id actor))))

(defn ^:async resolve-auth-context
  "Resolve auth context from request. Returns promise of context map or nil."
  [req]
  (when-let [actor (await (verify-session (extract-auth-token req)))]
    (actor->auth-context actor)))
