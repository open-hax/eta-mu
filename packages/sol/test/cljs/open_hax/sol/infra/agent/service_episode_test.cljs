(ns open-hax.sol.infra.agent.service-episode-test
  (:require [cljs.test :refer [deftest is]]
            [open-hax.sol.infra.agent.service :as service]))

(defn- sequential-id-fn
  [ids]
  (let [remaining* (atom (vec ids))]
    (fn []
      (let [id (first @remaining*)]
        (swap! remaining* subvec 1)
        id))))

(deftest ^:async service-default-routes-through-episode-wrapper-test
  (let [events* (atom [])
        result (await
                (service/send-agent-turn!
                 {:runtime true}
                 {:event-ledger-id-fn
                  (sequential-id-fn
                   ["turn-1" "episode-1"
                    "event-1" "event-2" "event-3" "event-4"])
                  :event-ledger-append!
                  (fn [envelope]
                    (swap! events* conj envelope)
                    (js/Promise.resolve envelope))
                  :turn-executor!
                  (fn [_runtime _config request]
                    (js/Promise.resolve
                     {:answer "ok"
                      :run_id (:run-id request)
                      :session_id (:session-id request)
                      :conversation_id (:conversation-id request)
                      :model "model-1"}))}
                 {:run-id "run-1"
                  :session-id "session-1"
                  :conversation-id "conversation-1"
                  :model "model-1"}))]
    (is (= "ok" (:answer result)))
    (is (= ["sol.run.started"
            "sol.turn.started"
            "sol.turn.completed"
            "sol.run.completed"]
           (mapv :event/type @events*)))))
