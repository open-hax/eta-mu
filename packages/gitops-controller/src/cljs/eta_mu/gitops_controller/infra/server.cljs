(ns eta-mu.gitops-controller.infra.server
  "HTTP composition for the eta-mu GitOps review controller."
  (:require [eta-mu.gitops-controller.extern.fastify :as fastify]
            [eta-mu.gitops-controller.extern.runtime :as runtime]
            [eta-mu.gitops-controller.infra.authority :as authority]
            [eta-mu.gitops-controller.infra.config :as config]
            [eta-mu.gitops-controller.infra.effect-lease :as effect-lease]
            [eta-mu.gitops-controller.infra.github :as github]
            [eta-mu.gitops-controller.infra.store :as store]
            [eta-mu.gitops-controller.infra.webhook :as webhook]
            [eta-mu.gitops-controller.infra.worker :as worker]))

(defonce runtime* (atom nil))

(defn create-app
  [{:keys [config store worker enqueue!]}]
  (let [app (-> (fastify/app)
                (fastify/install-raw-json-parser! (:body-limit config)))]
    (fastify/register-get!
     app "/health/live"
     (fn [_request reply]
       (fastify/send! reply 200 {:live true})))
    (fastify/register-get!
     app "/health/ready"
     (^:async fn [_request reply]
       (let [state-readiness (await (store/readiness store))
             _ (await (worker/refresh-effect-lease! worker))
             worker-status (worker/status worker)
             ready? (and (:ready? state-readiness)
                         (:running? worker-status)
                         (true? (get-in worker-status
                                        [:startup :complete?]))
                         (true? (get-in worker-status
                                        [:startup :recovered?])))]
         (fastify/send!
          reply (if ready? 200 503)
          {:ready ready?
           :deterministic {:mode (:mode worker-status)
                           :state (:state state-readiness)
                           :worker {:running? (:running? worker-status)
                                    :starting? (:starting? worker-status)
                                    :startup (:startup worker-status)}
                           :effect-lease (:effect-lease worker-status)}}))))
    (fastify/register-get!
     app "/health/dependencies"
     (fn [_request reply]
       (fastify/send! reply 200
                      {:dependencies (:dependency (worker/status worker))})))
    (fastify/register-post!
     app "/hooks/eta-mu/github"
     (^:async fn [request reply]
       (let [headers {:signature (fastify/request-header
                                  request "x-hub-signature-256")
                      :delivery-id (fastify/request-header
                                    request "x-github-delivery")
                      :event (fastify/request-header request "x-github-event")}
             result (await
                     (webhook/handle! config store enqueue! headers
                                      (fastify/request-body request)))]
         (fastify/send! reply (:status result) (:body result)))))
    app))

(defn ^:async compose!
  ([controller-config]
   (compose! controller-config {}))
  ([controller-config overrides]
   (let [state-store (or (:store overrides)
                         (store/create (:state-root controller-config)))
         _ (await (store/initialize! state-store))
         github-port (or (:github overrides) (github/port controller-config))
         authority-port (or (:authority overrides)
                            (authority/github-port github-port))
         effect-lease-port
         (when (= :review-dispatch (:mode controller-config))
           (or (:effect-lease overrides)
               (effect-lease/port controller-config)))
         queue-worker (worker/create
                       {:store state-store
                        :github github-port
                        :authority authority-port
                        :effect-lease effect-lease-port
                        :policy controller-config
                        :replay-interval-ms
                        (:replay-interval-ms controller-config)})
         _ (await (worker/start! queue-worker))
         application (create-app
                      {:config controller-config
                       :store state-store
                       :worker queue-worker
                       :enqueue! #(worker/enqueue! queue-worker %)})]
     {:config controller-config
      :store state-store
      :github github-port
      :authority authority-port
      :worker queue-worker
      :app application})))

(defn ^:async stop! []
  (when-let [runtime @runtime*]
    (worker/stop! (:worker runtime))
    (await (fastify/close! (:app runtime)))
    (reset! runtime* nil)))

(defn ^:async start! []
  (let [controller-config (await (config/load!))
        runtime (await (compose! controller-config))
        address (await (fastify/listen! (:app runtime)
                                        (:host controller-config)
                                        (:port controller-config)))]
    (reset! runtime* runtime)
    (runtime/info! (str "eta-mu GitOps controller listening at " address))
    runtime))
