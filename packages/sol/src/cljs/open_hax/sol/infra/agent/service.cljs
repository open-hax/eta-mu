(ns open-hax.sol.infra.agent.service
  "Small consumer-facing facade for Sol agent runtime operations."
  (:require [open-hax.sol.infra.agent.episode-turn :as episode-turn]
            [open-hax.sol.infra.agent.runner :as runner]
            [open-hax.sol.infra.agent.runtime :as runtime]
            [open-hax.sol.infra.agent.session :as session]))

(defprotocol IAgentService
  (-start-turn! [svc turn-request])
  (-queue-turn! [svc turn-request])
  (-control-turn! [svc control-request])
  (-resume-turn! [svc recovery-request])
  (-active-turn [svc conversation-id]))

(defrecord SolAgentService [runtime config delegates]
  IAgentService
  (-start-turn! [_ turn-request]
    ((or (:start-turn! delegates) episode-turn/send-agent-turn!) runtime config turn-request))

  (-queue-turn! [this turn-request]
    (if-let [queue-fn (:queue-turn! delegates)]
      (queue-fn runtime config turn-request)
      (do
        (-start-turn! this turn-request)
        (js/Promise.resolve {:ok true
                             :queued true
                             :run_id (:run-id turn-request)
                             :conversation_id (:conversation-id turn-request)
                             :session_id (:session-id turn-request)}))))

  (-control-turn! [_ control-request]
    ((or (:control-turn! delegates) runtime/queue-agent-control!) runtime config control-request))

  (-resume-turn! [_ recovery-request]
    (let [resume-fn (or (:resume-turn! delegates) (fn [_ _ s _] (js/Promise.resolve s)))
          session (or (:session recovery-request) recovery-request)
          opts (:opts recovery-request)]
      (if opts
        (resume-fn runtime config session opts)
        (resume-fn runtime config session))))

  (-active-turn [_ conversation-id]
    (if-let [active-fn (:active-turn delegates)]
      (active-fn conversation-id)
      (session/active-agent-session conversation-id))))

(defn agent-service
  ([runtime config]
   (agent-service runtime config {}))
  ([runtime config delegates]
   (->SolAgentService runtime config (or delegates {}))))

(defonce default-service* (atom nil))

(defn set-default-service!
  [svc]
  (reset! default-service* svc)
  svc)

(defn default-service
  []
  (or @default-service*
      (throw (js/Error. "No default Sol agent service configured"))))

(defn start-turn-runtime!
  [runtime config turn-request]
  (-start-turn! (agent-service runtime config) turn-request))

(defn queue-turn-runtime!
  [runtime config turn-request]
  (-queue-turn! (agent-service runtime config) turn-request))

(defn control-turn-runtime!
  [runtime config control-request]
  (-control-turn! (agent-service runtime config) control-request))

(defn resume-turn-runtime!
  [runtime config recovery-request]
  (-resume-turn! (agent-service runtime config) recovery-request))

(defn start-turn!
  ([turn-request]
   (-start-turn! (default-service) turn-request))
  ([svc turn-request]
   (-start-turn! svc turn-request))
  ([runtime config turn-request]
   (start-turn-runtime! runtime config turn-request)))

(defn queue-turn!
  ([turn-request]
   (-queue-turn! (default-service) turn-request))
  ([svc turn-request]
   (-queue-turn! svc turn-request))
  ([runtime config turn-request]
   (queue-turn-runtime! runtime config turn-request)))

(defn control-turn!
  ([control-request]
   (-control-turn! (default-service) control-request))
  ([svc control-request]
   (-control-turn! svc control-request))
  ([runtime config control-request]
   (control-turn-runtime! runtime config control-request)))

(defn resume-turn!
  ([recovery-request]
   (-resume-turn! (default-service) recovery-request))
  ([svc recovery-request]
   (-resume-turn! svc recovery-request))
  ([runtime config recovery-request]
   (resume-turn-runtime! runtime config recovery-request)))

(defn active-turn
  ([conversation-id]
   (-active-turn (default-service) conversation-id))
  ([svc conversation-id]
   (-active-turn svc conversation-id))
  ([_runtime _config conversation-id]
   (-active-turn (agent-service _runtime _config) conversation-id)))

(defn send-agent-turn!
  [runtime config turn-request]
  (start-turn-runtime! runtime config turn-request))

(defn queue-agent-control!
  [runtime config control-request]
  (control-turn-runtime! runtime config control-request))

(defn resume-recovered-session!
  ([runtime config recovered-session]
   (resume-turn-runtime! runtime config {:session recovered-session}))
  ([runtime config recovered-session opts]
   (resume-turn-runtime! runtime config {:session recovered-session :opts opts})))

(defn active-agent-session
  [conversation-id]
  (-active-turn (agent-service nil nil) conversation-id))

(defn spawn-direct!
  ([config payload]
   (runner/spawn-direct! config payload))
  ([runtime config payload]
   (runner/spawn-direct! runtime config payload)))
