(ns axxium.auth.session
  "Session management for Axxium.
   Cookie-based sessions for browser clients,
   JWT bearer tokens for API clients."
  (:require [axxium.auth.token :as token]
            [axxium.config :as cfg]
            [axxium.db :as db]
            [axxium.extern.identity-host :as host]
            [axxium.extern.legacy-http :as http]))

(def COOKIE-NAME (cfg/get-in-config [:session/cookie-name]))

(defn- hash-token [token] (host/sha256 token))

(defn ^:async create-session!
  "Create a session for an actor. Returns {:token token :actor actor}."
  [actor]
  (let [token (await (token/create-token actor))
        token-hash (hash-token token)
        actor-id (or (:actor/id actor) (:id actor))
        expiry-hours (cfg/get-in-config [:jwt/expiry-hours])
        expires-at (http/expiry-iso expiry-hours)]
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
                         WHERE a.id = $1 AND a.status = 'active' AND s.token_hash = $2 AND s.expires_at > NOW()"
                        [actor-id (hash-token token)]))]
      (when actor (http/decode actor)))
    (catch :default _ nil)))

(defn ^:async delete-session!
  "Delete a session by token."
  [token]
  (await (db/query "DELETE FROM sessions WHERE token_hash = $1"
                   [(hash-token token)])))

(def set-session-cookie
  "Set the session cookie on a Fastify reply."
  (http/cookie-setter COOKIE-NAME
                     (fn [] {:path "/"
                         :httpOnly true
                         :secure (cfg/get-in-config [:session/cookie-secure])
                         :sameSite (cfg/get-in-config [:session/cookie-same-site])
                         :maxAge (* (cfg/get-in-config [:jwt/expiry-hours]) 3600)})))

(def clear-session-cookie
  "Clear the session cookie."
  (http/cookie-clearer COOKIE-NAME))

(def extract-auth-token
  "Extract bearer token from request headers or cookie."
  (http/token-reader COOKIE-NAME))

(defn actor->auth-context
  "Project an authenticated actor row into the canonical request context."
  [actor]
  (cond-> {:auth/actor-id (:id actor)
           :auth/entity-id (:entity_id actor)
           :auth/email (:email actor)
           :auth/capabilities (http/decode (:capabilities actor))
           :auth/roles (http/decode (:roles actor))}
    (:org_id actor) (assoc :auth/org-id (:org_id actor))))

(def resolve-auth-context
  "Resolve auth context from request. Returns promise of context map or nil."
  (http/context-resolver extract-auth-token
                         (fn [token] (verify-session token)) actor->auth-context))
