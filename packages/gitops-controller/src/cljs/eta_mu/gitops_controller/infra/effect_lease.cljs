(ns eta-mu.gitops-controller.infra.effect-lease
  "Read-only adapter for the Services-owned deployment effect lease."
  (:require [eta-mu.gitops-controller.domain.effect-lease :as effect-lease]
            [eta-mu.gitops-controller.extern.fs :as fs]))

(defn create
  [{:keys [deployment-id active-marker-file canary-delivery-ids]}]
  {:deployment-id deployment-id
   :active-marker-file active-marker-file
   :canary-delivery-ids canary-delivery-ids})

(defn ^:async status!
  [{:keys [deployment-id active-marker-file]}]
  (try
    (effect-lease/status
     deployment-id (await (fs/read-optional-text active-marker-file)))
    (catch :default _
      ;; Filesystem detail is deliberately not retained: the controller needs
      ;; only the fail-closed decision and must not expose host paths/errors.
      (effect-lease/unreadable-status deployment-id))))

(defn ^:async authorize!
  [{:keys [canary-delivery-ids] :as lease} delivery-id]
  ;; Re-read on every decision. A Services rollback revokes ordinary effects
  ;; without restarting this process; only an exact configured delivery GUID
  ;; may bypass a provisional marker during candidate verification.
  (effect-lease/authorization
   (await (status! lease)) canary-delivery-ids delivery-id))

(defn port [config]
  (let [lease (create config)]
    {:status! #(status! lease)
     :authorize! #(authorize! lease %)}))
