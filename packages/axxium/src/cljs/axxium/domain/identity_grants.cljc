(ns axxium.domain.identity-grants
  "Pure grant admission against the current atomic identity snapshot."
  (:require [axxium.domain.identity :as identity]
            [axxium.law.identity :as law]
            [axxium.law.identity-grants :as grants]))

(defn transition
  "Recheck current administrator authority and describe one principal replacement."
  [state request]
  (let [{:keys [token-hash now principal-id roles capabilities]} (grants/validate! request)
        requester (identity/principal-for-session state token-hash now)]
    (law/require! requester :unauthenticated "Authentication required")
    (law/require! (identity/can-grant? requester) :forbidden
                  "Identity administrator capability required")
    (law/require! (grants/delegated-target? (:principal/id requester) principal-id) :forbidden
                  "Another administrator must update your roles and capabilities")
    (let [target (get-in state [:principals principal-id])]
      (law/require! target :not-found "Principal not found")
      {:operation :grants-updated :actor (:principal/id requester)
       :changes [(identity/put :principals principal-id
                              (law/validate-principal!
                               (assoc target :principal/roles roles :principal/capabilities capabilities)))]
       :result {:ok true}})))
