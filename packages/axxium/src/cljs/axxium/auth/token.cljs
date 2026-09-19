(ns axxium.auth.token
  "JWT token creation and verification using jose.
   Tokens carry the auth context that downstream services consume."
  (:require [axxium.config :as cfg]
            [axxium.extern.jwt :as jwt]))

(defn- token-config []
  {:secret (cfg/get-in-config [:jwt/secret])
   :issuer (cfg/get-in-config [:jwt/issuer])
   :audience (cfg/get-in-config [:jwt/audience])
   :expiry-hours (cfg/get-in-config [:jwt/expiry-hours])})

(defn ^:async create-token
  "Create a JWT for an actor with their capabilities.
   Returns promise of token string."
  [actor]
  (let [claims {:sub (or (:actor/id actor) (:id actor))
                :entity-id (or (:actor/entity-id actor) (:entity_id actor))
                :email (or (:actor/email actor) (:email actor))
                :capabilities (or (:actor/capabilities actor) (:capabilities actor))
                :roles (or (:actor/roles actor) (:roles actor))
                :status (or (:actor/status actor) (:status actor))}]
    (await (jwt/sign! (token-config) claims))))

(defn ^:async verify-token
  "Verify a JWT and return the claims.
   Returns promise of verified payload or throws."
  [token]
  (await (jwt/verify! (token-config) token)))
