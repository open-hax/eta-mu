(ns open-hax.sol.infra.agent.runner
  "Sol agent runner entrypoint.

   Runs are durable: each direct/chat start records a run in EDN-backed
   run-state, appends a session-level event, and executes the turn in a
   background promise kept in the active-runs registry so Node cannot exit
   until all in-flight turns settle. Errors are recorded on the run and
   logged; they do not kill the process.

   The consumer-facing flow is:
     POST /api/agent/direct       -> 202 + run_id
     WS   /ws/stream?run_id=...   -> live run/token events
     GET  /api/agent/run/:id      -> current run state
     GET  /api/agent/run/:id/events -> ordered run event ledger"
  (:require [open-hax.sol.infra.agent.run-state :as run-state]
            [open-hax.sol.infra.agent.turn :as agent-turns]
            [open-hax.sol.runtime.state :as runtime-state]
            [open-hax.sol.extern.agent-runner :as xrunner]
            [open-hax.sol.extern.agent-turn-node :as xturn-node]))

(defonce active-runs* (atom {}))

(defn current-runtime
  []
  @runtime-state/runtime*)

(defn active-run-ids
  []
  (vec (keys @active-runs*)))

(defn active-runs-count
  []
  (count @active-runs*))

(defn- accepted-response
  [body]
  {:ok true
   :queued true
   :run_id (:run-id body)
   :conversation_id (:conversation-id body)
   :session_id (:session-id body)
   :model (or (:model body)
              (get-in body [:agent-spec :model]))})

(defn- record-async-spawn-error!
  [body err]
  (let [run-id (:run-id body)]
    (.error js/console "[agent-runner] async direct spawn failed" run-id (.-message err))
    (try
      (run-state/run-patch! run-id
                            {:status "failed"
                             :error (str err)
                             :has_active_stream false
                             :updated_at (.toISOString (js/Date.))})
      (catch :default _ nil))))

(defn- ^:async execute-turn-keepalive!
  [runtime config body]
  (let [run-id (:run-id body)]
    (try
      (await (agent-turns/send-agent-turn! runtime config body))
      (catch :default err
        (record-async-spawn-error! body err))
      (finally
        (swap! active-runs* dissoc run-id)))))

(defn- register-run!
  [body]
  (let [run-id (:run-id body)]
    (run-state/run-put! {:run_id run-id
                         :session_id (:session-id body)
                         :conversation_id (:conversation-id body)
                         :status "queued"
                         :model (or (:model body)
                                    (get-in body [:agent-spec :model]))
                         :created_at (.toISOString (js/Date.))
                         :updated_at (.toISOString (js/Date.))
                         :has_active_stream false})
    body))

(defn- ^:async queue-turn!
  [runtime config body]
  (register-run! body)
  (let [run-id (:run-id body)
        promise (execute-turn-keepalive! runtime config body)]
    (swap! active-runs* assoc run-id promise)
    (accepted-response body)))

(defn- busy-error
  [message]
  (js/Promise.reject (js/Error. message)))

(defn- normalize-body
  [_runtime payload]
  (let [params (xrunner/to-cljs-map payload)
        provided-session-id (:session-id params)
        session-id (agent-turns/ensure-session-id provided-session-id)
        conversation-id (or (:conversation-id params) (xturn-node/random-uuid!))
        run-id (or (:run-id params) (xturn-node/random-uuid!))]
    (assoc params
           :session-id session-id
           :conversation-id conversation-id
           :run-id run-id)))

(defn spawn-direct!
  ([config payload]
   (spawn-direct! (current-runtime) config payload))
  ([runtime config payload]
   (if-not runtime
     (busy-error "Sol runtime unavailable for direct agent spawn")
     (let [payload (xrunner/to-cljs-map payload)
           body (normalize-body runtime payload)]
       (queue-turn! runtime config body)))))
