(ns eta-mu.gitops-controller.infra.webhook
  "Ordered webhook admission: authenticate bytes, then decode and persist intent."
  (:require [eta-mu.gitops-controller.domain.admission :as admission]
            [eta-mu.gitops-controller.extern.crypto :as crypto]
            [eta-mu.gitops-controller.extern.json :as json]
            [eta-mu.gitops-controller.infra.store :as store]
            [eta-mu.gitops-controller.law.webhook :as law]
            [eta-mu.gitops-controller.shape.webhook :as shape]))

(defn- delivery-conflict-response [error]
  (when (= :delivery-payload-mismatch (:error/code (ex-data error)))
    {:status 409
     :body {:accepted false :reason "delivery-payload-mismatch"}}))

(defn ^:async handle!
  [config state-store enqueue! headers raw-body]
  (let [signature (:signature headers)
        envelope {:delivery-id (:delivery-id headers)
                  :event (:event headers)}]
    (cond
      (not (js/Buffer.isBuffer raw-body))
      {:status 415 :body {:accepted false :reason "raw-body-required"}}

      (not (law/signature? signature))
      {:status 401 :body {:accepted false :reason "invalid-signature"}}

      (not (crypto/verify-hmac-sha256
            (:webhook-secret config) raw-body signature))
      {:status 401 :body {:accepted false :reason "invalid-signature"}}

      :else
      (let [payload-sha256 (crypto/sha256-bytes raw-body)
            decoded (try
                      {:payload (json/parse-bytes raw-body)}
                      (catch :default _ {:error :invalid-json}))]
        (if (:error decoded)
          {:status 400 :body {:accepted false :reason "invalid-json"}}
          (let [command (assoc
                         (shape/payload->command envelope (:payload decoded))
                         :payload/sha256 payload-sha256)
                decision (admission/decide config command)]
            (cond
              ;; GitHub ping and other non-command envelopes remain effect-free.
              ;; An unsupported event that *does* satisfy the source shape and
              ;; both allowlists flows through the durable ignored branch.
              (and (not (law/managed-event? (:event envelope)))
                   (= :invalid-command (:reason decision)))
              (if (law/delivery-id? (:delivery-id envelope))
                {:status 202
                 :body {:accepted true
                        :ignored true
                        :reason "unmanaged-event"}}
                {:status 422
                 :body {:accepted false :reason "invalid-command"}})

              (:ignored? decision)
              (try
                (let [result (await
                              (store/ignore-delivery!
                               state-store command (:reason decision)))]
                  {:status 202
                   :body {:accepted true
                          :ignored true
                          :delivery-id (:delivery-id command)
                          :duplicate (:duplicate? result)
                          :reason (name (:reason decision))}})
                (catch :default error
                  (or (delivery-conflict-response error)
                      (throw error))))

              (not (:admitted? decision))
              {:status (if (contains? #{:repository-not-allowed
                                       :installation-not-allowed}
                                     (:reason decision))
                         403
                         422)
               :body {:accepted false :reason (name (:reason decision))}}

              :else
              (try
                (let [result (await
                              (store/accept-delivery! state-store
                                                      (:command decision)))]
                  (when (:accepted? result)
                    (enqueue! (:delivery-id command)))
                  {:status 202
                   :body {:accepted true
                          :delivery-id (:delivery-id command)
                          :duplicate (:duplicate? result)}})
                (catch :default error
                  (or (delivery-conflict-response error)
                      (throw error)))))))))))
