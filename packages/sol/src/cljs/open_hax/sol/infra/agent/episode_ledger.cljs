(ns open-hax.sol.infra.agent.episode-ledger
  "Effect seam from one Sol turn episode to Clio's durable event ledger.

   Environment configuration selects :clio-provider :edn. Hosts may retain the
   :event-ledger-append! injection seam; the obsolete Mongo DB option is refused."
  (:require [open-hax.sol.domain.time :as time]
            [open-hax.sol.infra.agent.clio-store :as clio-store]
            [open-hax.sol.shape.episode-event :as episode-event]))

(defn- default-id-fn
  []
  (str (random-uuid)))

(defn configured-appender
  "Resolve the canonical append capability from Sol config.

   An injected one-argument function remains the explicit custom-provider seam.
   EDN persistence uses packages/clio, including its immutable schema history."
  [config]
  (or (:event-ledger-append! config)
      (do
        (when (some? (:event-ledger-db config))
          (throw (ex-info "The Mongo event-ledger provider is retired; configure :clio-provider :edn or inject :event-ledger-append!"
                          {:sol/error :sol.clio/retired-provider})))
        (case (:clio-provider config)
          nil nil
          :edn (let [store (clio-store/open-store
                            (or (:clio-directory config) ".ημ/sol/clio"))]
                 (fn [envelope] (clio-store/append-envelope! store envelope)))
          (throw (ex-info "Unsupported Sol Clio provider"
                          {:sol/error :sol.clio/unsupported-provider
                           :provider (:clio-provider config)}))))))

(defn create-episode
  "Create process-local sequencing state for one send-agent-turn! invocation."
  [config {:keys [run-id session-id conversation-id agent-spec auth-context]}]
  (let [id-fn (or (:event-ledger-id-fn config) default-id-fn)
        turn-id (id-fn)
        episode-id (id-fn)
        base (episode-event/episode-context
              {:run-id run-id
               :session-id session-id
               :turn-id turn-id
               :episode-id episode-id
               :conversation-id conversation-id
               :node-id (:sol-node-id config)
               :auth-context auth-context
               :agent-spec agent-spec})]
    {:context base
     :id-fn id-fn
     :append! (configured-appender config)
     :root-id* (atom nil)
     :parent-id* (atom nil)}))

(defn configured?
  [episode]
  (some? (:append! episode)))

(defn ^:async emit!
  "Validate and optionally append the next canonical lifecycle event.

   Causal state advances only after the configured appender accepts the event.
   With no appender, validation itself is the acceptance boundary and the
   existing Sol runtime remains operational."
  [episode event-type payload]
  (let [event-id ((:id-fn episode))
        root-id (or @(:root-id* episode) event-id)
        parent-id @(:parent-id* episode)
        context (assoc (:context episode) :causal/root root-id)
        envelope (episode-event/envelope context
                                         event-id
                                         (time/now-iso)
                                         parent-id
                                         event-type
                                         payload)
        result (if-let [append! (:append! episode)]
                 (await (append! envelope))
                 envelope)]
    (compare-and-set! (:root-id* episode) nil root-id)
    (reset! (:parent-id* episode) event-id)
    result))
