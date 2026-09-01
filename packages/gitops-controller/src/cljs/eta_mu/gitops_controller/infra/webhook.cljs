(ns eta-mu.gitops-controller.infra.webhook
  "Ordered webhook admission: authenticate bytes, then decode and persist intent."
  (:require [eta-mu.gitops-controller.domain.admission :as admission]
            [eta-mu.gitops-controller.extern.crypto :as crypto]
            [eta-mu.gitops-controller.extern.json :as json]
            [eta-mu.gitops-controller.infra.store :as store]
            [eta-mu.gitops-controller.law.webhook :as law]
            [eta-mu.gitops-controller.shape.webhook :as shape]))

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
      (let [decoded (try
                      {:payload (json/parse-bytes raw-body)}
                      (catch :default _ {:error :invalid-json}))]
        (if (:error decoded)
          {:status 400 :body {:accepted false :reason "invalid-json"}}
          (if-not (law/managed-event? (:event envelope))
            (if (law/delivery-id? (:delivery-id envelope))
              {:status 202
               :body {:accepted true
                      :ignored true
                      :reason "unmanaged-event"}}
              {:status 422
               :body {:accepted false :reason "invalid-command"}})
            (let [command (shape/payload->command envelope (:payload decoded))
                  decision (admission/decide config command)]
              (cond
                (:ignored? decision)
                {:status 202
                 :body {:accepted true
                        :ignored true
                        :reason (name (:reason decision))}}

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
                    (if (= :delivery-payload-mismatch
                           (:error/code (ex-data error)))
                      {:status 409
                       :body {:accepted false
                              :reason "delivery-payload-mismatch"}}
                      (throw error))))))))))))
