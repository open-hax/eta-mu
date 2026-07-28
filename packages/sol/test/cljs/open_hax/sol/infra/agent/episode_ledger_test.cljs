(ns open-hax.sol.infra.agent.episode-ledger-test
  (:require [cljs.test :refer [deftest is]]
            [open-hax.event-ledger :as event-ledger]
            [open-hax.sol.infra.agent.episode-ledger :as episode-ledger]))

(defn- sequential-id-fn
  [ids]
  (let [remaining* (atom (vec ids))]
    (fn []
      (let [id (first @remaining*)]
        (swap! remaining* subvec 1)
        id))))

(def episode-input
  {:run-id "run-1"
   :session-id "session-1"
   :conversation-id "conversation-1"
   :agent-spec {:actor-id "actor.agent.research"
                :contract-id "agent/research"
                :contract-revision "git:abc123"}
   :auth-context {:actorId "actor.agent.research"
                  :entityId "entity.agent.research"
                  :orgId "org.open-hax"
                  :principalKind "agent"}})

(deftest ^:async causal-lifecycle-test
  (let [accepted* (atom [])
        id-fn (sequential-id-fn
               ["turn-1" "episode-1"
                "event-1" "event-2" "event-3" "event-4"])
        episode (episode-ledger/create-episode
                 {:event-ledger-id-fn id-fn
                  :sol-node-id "sol.node.local"
                  :event-ledger-append!
                  (fn [envelope]
                    (swap! accepted* conj envelope)
                    (js/Promise.resolve envelope))}
                 episode-input)]
    (doseq [event-type ["sol.run.started"
                        "sol.turn.started"
                        "sol.turn.completed"
                        "sol.run.completed"]]
      (await (episode-ledger/emit! episode event-type {:status "ok"})))
    (let [events @accepted*]
      (is (= ["sol.run.started"
              "sol.turn.started"
              "sol.turn.completed"
              "sol.run.completed"]
             (mapv :event/type events)))
      (is (= ["event-1" "event-2" "event-3" "event-4"]
             (mapv :event/id events)))
      (is (= [nil "event-1" "event-2" "event-3"]
             (mapv :causal/parent events)))
      (is (= #{"event-1"} (set (map :causal/root events))))
      (is (= #{"turn-1"} (set (map :turn/id events))))
      (is (= #{"episode-1"} (set (map :episode/id events))))
      (is (= #{"run-1"} (set (map :run/id events))))
      (is (= #{"org.open-hax"}
             (set (map #(get-in % [:event/from :principal/binding
                                   :principal/org-id])
                       events)))))))

(deftest ^:async no-appender-remains-valid-test
  (let [episode (episode-ledger/create-episode
                 {:event-ledger-id-fn
                  (sequential-id-fn ["turn-1" "episode-1" "event-1"])}
                 (assoc episode-input :auth-context nil))
        envelope (await (episode-ledger/emit!
                         episode
                         "sol.run.started"
                         {:status "running"}))]
    (is (false? (episode-ledger/configured? episode)))
    (is (= "sol.run.started" (:event/type envelope)))
    (is (= "event-1" (:causal/root envelope)))
    (is (= "actor.agent.research" (get-in envelope [:event/from :actor-id])))
    (is (not (contains? (:event/from envelope) :principal/binding)))))

(deftest ^:async configured-db-delegates-to-event-ledger-test
  (let [calls* (atom [])
        db {:name "ledger-db"}
        append! (episode-ledger/configured-appender
                 {:event-ledger-db db})]
    (with-redefs [event-ledger/append-event
                  (fn [actual-db envelope]
                    (swap! calls* conj [actual-db envelope])
                    (js/Promise.resolve envelope))]
      (let [result (await (append! {:event/type "test"}))]
        (is (= {:event/type "test"} result))
        (is (= [[db {:event/type "test"}]] @calls*))))))

(deftest ^:async rejected-append-does-not-advance-causality-test
  (let [attempts* (atom 0)
        episode (episode-ledger/create-episode
                 {:event-ledger-id-fn
                  (sequential-id-fn ["turn-1" "episode-1" "event-1" "event-2"])
                  :event-ledger-append!
                  (fn [envelope]
                    (swap! attempts* inc)
                    (if (= 1 @attempts*)
                      (js/Promise.reject (js/Error. "ledger unavailable"))
                      (js/Promise.resolve envelope)))}
                 episode-input)]
    (try
      (await (episode-ledger/emit! episode "sol.run.started" {}))
      (is false "first append should reject")
      (catch :default error
        (is (= "ledger unavailable" (.-message error)))))
    (let [accepted (await (episode-ledger/emit!
                          episode
                          "sol.run.started"
                          {}))]
      (is (= "event-2" (:event/id accepted)))
      (is (= "event-2" (:causal/root accepted)))
      (is (nil? (:causal/parent accepted))))))
