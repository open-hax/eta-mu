(ns eta-mu.gitops-controller.infra.effect-lease
  "Read-only adapter for the Services-owned deployment effect lease."
  (:require [eta-mu.gitops-controller.extern.fs :as fs]
            [eta-mu.gitops-controller.law.webhook :as law]))

(defn create
  [{:keys [deployment-id active-marker-file canary-delivery-ids]}]
  {:deployment-id deployment-id
   :active-marker-file active-marker-file
   :canary-delivery-ids canary-delivery-ids})

(defn ^:async status!
  [{:keys [deployment-id active-marker-file]}]
  (try
    (let [marker (await (fs/read-optional-text active-marker-file))
          active-deployment (law/active-marker-deployment marker)]
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
         :active-deployment-id active-deployment}))
    (catch :default _
      ;; Filesystem detail is deliberately not retained: the controller needs
      ;; only the fail-closed decision and must not expose host paths/errors.
      {:state :provisional
       :effects-allowed? false
       :reason :active-marker-unreadable
       :deployment-id deployment-id})))

(defn ^:async authorize!
  [{:keys [canary-delivery-ids] :as lease} delivery-id]
  ;; Re-read on every decision. A Services rollback revokes ordinary effects
  ;; without restarting this process; only an exact configured delivery GUID
  ;; may bypass a provisional marker during candidate verification.
  (let [lease-status (await (status! lease))
        canary? (contains? canary-delivery-ids delivery-id)]
    {:allowed? (or canary? (:effects-allowed? lease-status))
     :basis (cond
              canary? :deployment-canary
              (:effects-allowed? lease-status) :active-deployment
              :else :provisional-deployment)
     :lease lease-status}))

(defn port [config]
  (let [lease (create config)]
    {:status! #(status! lease)
     :authorize! #(authorize! lease %)}))
