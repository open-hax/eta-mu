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

(deftest ^:async completion-append-failure-never-backfills-turn-failed-test
  (let [attempted-types* (atom [])
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
                :turn-executor!
                (fn [_runtime _config _request]
                  (js/Promise.resolve {:answer "done" :model "model-1"}))}]
    (try
      (await (episode-turn/send-agent-turn!
              nil
              config
              {:run-id "run-1"
               :session-id "session-1"
               :conversation-id "conversation-1"}))
      (is false "terminal append should reject")
      (catch :default error
        (is (= "run terminal unavailable" (.-message error)))))
    (is (= ["sol.run.started"
            "sol.turn.started"
            "sol.turn.completed"
            "sol.run.completed"]
           @attempted-types*))
    (is (not-any? #{"sol.turn.failed" "sol.run.failed"}
                  @attempted-types*))))
