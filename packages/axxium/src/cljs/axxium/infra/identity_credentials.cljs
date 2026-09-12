(ns axxium.infra.identity-credentials
  "Execute self-service credential decisions through one atomic identity transaction."
  (:require [axxium.domain.identity-credentials :as domain]
            [axxium.extern.identity-host :as host]
            [axxium.infra.identity :as identity]
            [axxium.infra.identity-oauth :as oauth]
            [axxium.infra.identity-store :as store]
            [axxium.law.identity-credentials :as law]))

(defn- available-issuers [service]
  (into #{} (keep (fn [provider]
                   (when (oauth/configured? service provider)
                     (if (= :atproto provider) "atproto"
                         (:issuer (oauth/provider-config service provider))))))
        [:github :discord :google :atproto]))

(defn inventory [service token]
  (identity/require-principal! service token)
  (domain/inventory (store/state (:store service)) (host/sha256 token) (host/now)
                    (available-issuers service)))

(defn revoke! [service token request]
  (law/require-revoke! request)
  (identity/require-principal! service token)
  (store/transact! (:store service)
                   #(domain/revoke-transition % (host/sha256 token) (host/now) (:credentialId request)
                                               (available-issuers service))))
