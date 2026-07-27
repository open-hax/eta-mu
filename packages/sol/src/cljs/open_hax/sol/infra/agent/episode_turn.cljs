(ns open-hax.sol.infra.agent.episode-turn
  "Canonical event-ledger lifecycle wrapper for one Sol turn.

   The wrapped turn remains responsible for Sol's existing EDN run projection,
   session state, provider execution, and realtime broadcasts. This namespace
   adds only the cross-runtime operational envelope owned by event-ledger."
  (:require [open-hax.sol.extern.agent-turn-node :as xturn-node]
            [open-hax.sol.infra.agent.episode-ledger :as episode-ledger]
            [open-hax.sol.infra.agent.turn :as turn]))

(defn- normalized-request
  [request]
  (let [session-id (turn/ensure-session-id (:session-id request))
        conversation-id (or (:conversation-id request)
                            (xturn-node/random-uuid!))
        run-id (or (:run-id request)
                   (xturn-node/random-uuid!))]
    (assoc request
           :session-id session-id
           :conversation-id conversation-id
           :run-id run-id)))

(defn- error-message
  [error]
  (or (some-> error .-message str)
      (str error)))

(defn- lifecycle-payload
  [request status extra]
  (merge {:status status
          :conversation_id (:conversation-id request)}
         (when-let [model (:model request)]
           {:model model})
         (or extra {})))

(defn- ^:async emit-failure-lifecycle!
  [episode request error]
  (let [payload (lifecycle-payload
                 request
                 "failed"
                 {:error (error-message error)})]
    (try
      (await (episode-ledger/emit! episode "sol.turn.failed" payload))
      (await (episode-ledger/emit! episode "sol.run.failed" payload))
      nil
      (catch :default ledger-error
        ledger-error))))

(defn- ^:async execute-or-record-failure!
  [execute! runtime config request episode]
  (try
    (await (execute! runtime config request))
    (catch :default error
      (let [ledger-error (await (emit-failure-lifecycle! episode request error))]
        (if ledger-error
          (throw (ex-info "Sol turn and canonical episode emission failed"
                          {:run-id (:run-id request)
                           :session-id (:session-id request)
                           :turn-error (error-message error)
                           :ledger-error (error-message ledger-error)}
                          ledger-error))
          (throw error))))))

(defn- persistence-failure
  [request event-type error]
  {:failure/kind :canonical-persistence
   :event/type event-type
   :run/id (:run-id request)
   :session/id (:session-id request)
   :conversation/id (:conversation-id request)
   :error/message (error-message error)})

(defn- ^:async report-persistence-failure!
  "Report a canonical terminal append failure without rewriting successful local
   execution as a failed run. Hosts may inject `:event-ledger-report-error!`;
   the default is a structured console error. Reporter failure is itself logged
   but never replaces the already-produced turn result."
  [config request event-type error]
  (let [failure (persistence-failure request event-type error)]
    (try
      (if-let [report! (:event-ledger-report-error! config)]
        (await (report! failure))
        (.error js/console
                "[sol-event-ledger] canonical terminal persistence failed"
                (clj->js failure)))
      (catch :default report-error
        (.error js/console
                "[sol-event-ledger] persistence failure reporter failed"
                (clj->js (assoc failure
                                :report/error (error-message report-error))))))
    failure))

(defn- ^:async emit-completion-lifecycle!
  [config episode request completed]
  (try
    (await (episode-ledger/emit! episode "sol.turn.completed" completed))
    (try
      (await (episode-ledger/emit! episode "sol.run.completed" completed))
      true
      (catch :default error
        (await (report-persistence-failure!
                config request "sol.run.completed" error))
        false))
    (catch :default error
      (await (report-persistence-failure!
              config request "sol.turn.completed" error))
      false)))

(defn ^:async send-agent-turn!
  "Execute one existing Sol turn while emitting a four-event canonical episode.

   With no configured appender the envelopes are still built and validated, so
   current local-only deployments remain compatible. Canonical start failures
   remain blocking because execution has not begun. Execution failures remain
   failures and attempt canonical failure events. Once execution succeeds,
   terminal canonical append failures are reported separately and the produced
   result is returned so Sol's local EDN/realtime projections stay truthful.
   `:turn-executor!` and `:event-ledger-report-error!` are optional infra
   injections used by conformance tests and alternate Sol hosts."
  [runtime config request]
  (let [request (normalized-request request)
        execute! (or (:turn-executor! config) turn/send-agent-turn!)
        episode (episode-ledger/create-episode
                 config
                 {:run-id (:run-id request)
                  :session-id (:session-id request)
                  :conversation-id (:conversation-id request)
                  :agent-spec (:agent-spec request)
                  :auth-context (:auth-context request)})]
    (await (episode-ledger/emit!
            episode
            "sol.run.started"
            (lifecycle-payload request "running" nil)))
    (await (episode-ledger/emit!
            episode
            "sol.turn.started"
            (lifecycle-payload request "running" nil)))
    (let [result (await (execute-or-record-failure!
                         execute! runtime config request episode))
          completed (lifecycle-payload
                     request
                     "completed"
                     (when-let [model (:model result)]
                       {:model model}))]
      (await (emit-completion-lifecycle! config episode request completed))
      result)))
