(ns eta-mu.gitops-controller.extern.webhook
  "Raw GitHub webhook boundary. Authenticated requests leave this namespace as
  ClojureScript data; Node request objects and buffers do not."
  (:require [eta-mu.gitops-controller.extern.crypto :as crypto]
            [eta-mu.gitops-controller.extern.fastify :as fastify]
            [eta-mu.gitops-controller.extern.json :as json]
            [eta-mu.gitops-controller.law.webhook :as law]))

(defn admit-request
  "Validate and authenticate the exact raw body before decoding it. Returns a
  closed CLJS ingress shape for the infra orchestrator."
  [secret request]
  (let [raw-body (fastify/request-body request)
        signature (fastify/request-header request "x-hub-signature-256")]
    (cond
      (not (js/Buffer.isBuffer raw-body))
      {:webhook/status :raw-body-required}

      (not (law/signature? signature))
      {:webhook/status :invalid-signature}

      (not (crypto/verify-hmac-sha256 secret raw-body signature))
      {:webhook/status :invalid-signature}

      :else
      (let [payload-sha256 (crypto/sha256-bytes raw-body)]
        (try
          {:webhook/status :authenticated
           :delivery-id (fastify/request-header request "x-github-delivery")
           :event (fastify/request-header request "x-github-event")
           :payload (json/parse-bytes raw-body)
           :payload/sha256 payload-sha256}
          (catch :default _
            {:webhook/status :invalid-json}))))))
