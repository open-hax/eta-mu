(ns open-hax.sol.infra.agent.episode-ledger
  "Effect seam from one Sol turn episode to the standalone event-ledger.

   Hosts may inject `:event-ledger-append!` or supply `:event-ledger-db`. Without
   either, Sol still builds and validates the canonical envelopes while keeping
   its existing local EDN/realtime projections fully compatible."
  (:require [open-hax.event-ledger :as event-ledger]
            [open-hax.sol.domain.time :as time]
            [open-hax.sol.shape.episode-event :as episode-event]))

(defn- default-id-fn
  []
  (str (random-uuid)))

(defn configured-appender
  "Resolve the canonical append capability from Sol config.

   An injected one-argument function is preferred for tests/non-Mongo hosts.
   A configured Mongo DB delegates directly to event-ledger/append-event."
  [config]
  (or (:event-ledger-append! config)
      (when-let [db (:event-ledger-db config)]
        (fn [envelope]
          (event-ledger/append-event db envelope)))))

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
