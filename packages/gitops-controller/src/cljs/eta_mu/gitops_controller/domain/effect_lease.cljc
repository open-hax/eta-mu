(ns eta-mu.gitops-controller.domain.effect-lease
  "Pure deployment effect-lease admissibility decisions."
  (:require [eta-mu.gitops-controller.law.webhook :as law]))

(defn unreadable-status
  [deployment-id]
  {:state :provisional
   :effects-allowed? false
   :reason :active-marker-unreadable
   :deployment-id deployment-id})

(defn status
  [deployment-id marker]
  (let [active-deployment (law/active-marker-deployment marker)]
    (cond
      (nil? marker)
      {:state :provisional
       :effects-allowed? false
       :reason :active-marker-missing
       :deployment-id deployment-id}

      (nil? active-deployment)
      {:state :provisional
       :effects-allowed? false
       :reason :active-marker-malformed
       :deployment-id deployment-id}

      (= deployment-id active-deployment)
      {:state :active
       :effects-allowed? true
       :reason :deployment-active
       :deployment-id deployment-id
       :active-deployment-id active-deployment}

      :else
      {:state :provisional
       :effects-allowed? false
       :reason :another-deployment-active
       :deployment-id deployment-id
       :active-deployment-id active-deployment})))

(defn authorization
  [lease-status canary-delivery-ids delivery-id]
  (let [canary? (contains? canary-delivery-ids delivery-id)]
    {:allowed? (or canary? (:effects-allowed? lease-status))
     :basis (cond
              canary? :deployment-canary
              (:effects-allowed? lease-status) :active-deployment
              :else :provisional-deployment)
     :lease lease-status}))
