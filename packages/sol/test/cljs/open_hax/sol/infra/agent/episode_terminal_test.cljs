(ns open-hax.sol.infra.agent.episode-terminal-test
  (:require [cljs.test :refer [deftest is]]
            [open-hax.sol.infra.agent.episode-turn :as episode-turn]))

(defn- sequential-id-fn
  [ids]
  (let [remaining* (atom (vec ids))]
    (fn []
      (let [id (first @remaining*)]
        (swap! remaining* subvec 1)
        id))))

(def request
  {:run-id "run-1"
   :session-id "session-1"
   :conversation-id "conversation-1"})

(def result
  {:answer "done"
   :model "model-1"})

(deftest ^:async run-completion-failure-is-reported-without-local-failure-test
  (let [attempted-types* (atom [])
        reports* (atom [])
        config {:event-ledger-id-fn
                (sequential-id-fn
                 ["turn-1" "episode-1"
                  "event-1" "event-2" "event-3" "event-4"])
                :event-ledger-append!
                (fn [envelope]
                  (swap! attempted-types* conj (:event/type envelope))
                  (if (= "sol.run.completed" (:event/type envelope))
                    (js/Promise.reject (js/Error. "run terminal unavailable"))
                    (js/Promise.resolve envelope)))
                :event-ledger-report-error!
                (fn [failure]
                  (swap! reports* conj failure)
                  (js/Promise.resolve failure))
                :turn-executor!
                (fn [_runtime _config _request]
                  (js/Promise.resolve result))}
        actual (await (episode-turn/send-agent-turn! nil config request))]
    (is (= result actual))
    (is (= ["sol.run.started"
            "sol.turn.started"
            "sol.turn.completed"
            "sol.run.completed"]
           @attempted-types*))
    (is (not-any? #{"sol.turn.failed" "sol.run.failed"}
                  @attempted-types*))
    (is (= [{:failure/kind :canonical-persistence
             :event/type "sol.run.completed"
             :run/id "run-1"
             :session/id "session-1"
             :conversation/id "conversation-1"
             :error/message "run terminal unavailable"}]
           @reports*))))

(deftest ^:async turn-completion-failure-stops-terminal-chain-test
  (let [attempted-types* (atom [])
        reports* (atom [])
        config {:event-ledger-id-fn
                (sequential-id-fn
                 ["turn-1" "episode-1" "event-1" "event-2" "event-3"])
                :event-ledger-append!
                (fn [envelope]
                  (swap! attempted-types* conj (:event/type envelope))
                  (if (= "sol.turn.completed" (:event/type envelope))
                    (js/Promise.reject (js/Error. "turn terminal unavailable"))
                    (js/Promise.resolve envelope)))
                :event-ledger-report-error!
                (fn [failure]
                  (swap! reports* conj failure)
                  (js/Promise.resolve failure))
                :turn-executor!
                (fn [_runtime _config _request]
                  (js/Promise.resolve result))}
        actual (await (episode-turn/send-agent-turn! nil config request))]
    (is (= result actual))
    (is (= ["sol.run.started"
            "sol.turn.started"
            "sol.turn.completed"]
           @attempted-types*))
    (is (not-any? #{"sol.run.completed" "sol.turn.failed" "sol.run.failed"}
                  @attempted-types*))
    (is (= "sol.turn.completed" (:event/type (first @reports*))))
    (is (= "turn terminal unavailable"
           (:error/message (first @reports*))))))
