(ns eta-mu.gitops-controller.domain.authority
  "Axxium-shaped authority requests and pure permission interpretation."
  (:require [eta-mu.gitops-controller.law.webhook :as law]))

(defn request
  [{:keys [sender-id sender-login repository repository-id installation-id
           capability]}]
  {:authority/version 1
   :actor {:actor/provider :github
           :actor/id sender-id
           :actor/login sender-login}
   :capability (law/capability capability)
   :resource {:repository/full-name repository
              :repository/id repository-id
              :github/installation-id installation-id}})

(def collaborator-capabilities
  #{:gitops/review :gitops/probe})

(defn decision [request {:keys [permission user-id user-login]}]
  (let [identity-matches? (= (get-in request [:actor :actor/id]) user-id)]
    {:authorized? (and (contains? collaborator-capabilities
                                  (:capability request))
                       identity-matches?
                       (law/review-permission? permission))
     :request request
     :evidence {:github/permission permission
                :github/user-id user-id
                :github/user-login user-login
                :identity-matches? identity-matches?}}))

(defn defensive-gate-reconciliation?
  [request]
  (contains? #{:gitops/reconcile-review-gate :gitops/invalidate-review-gate
               :gitops/complete-review-gate}
             (:capability request)))

(defn signed-review-event-decision
  "Authorize only the bounded defensive gate recomputation capability. The
  caller may use this after HMAC verification, installation/repository
  allowlisting, and durable admission. It never authorizes model execution."
  [request]
  {:authorized? (defensive-gate-reconciliation? request)
   :request request
   :evidence {:github/provenance :signed-allowlisted-review-event
              :bounded-capability (:capability request)}})
