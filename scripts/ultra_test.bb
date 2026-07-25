#!/usr/bin/env bb

(require '[clojure.test :refer [deftest is run-tests testing]])

(load-file "scripts/ultra.bb")

(deftest implementation-dispatch-failure-skips-gates
  (testing "a missing implementation result cannot pass gates or promote a card"
    (let [gate-calls (atom 0)
          result (with-redefs [dispatch! (constantly nil)
                               run-gate! (fn [_]
                                           (swap! gate-calls inc)
                                           {:exit 0})]
                   (run-implement-stage
                    {:vars {:repo "."}
                     :run {:model nil :agent-timeout-ms 1}}
                    {:stage/id :dispatch-regression
                     :stage/card "missing-card.md"
                     :stage/agent "test"
                     :stage/max-attempts 1
                     :stage/gates [{:cmd "must-not-run"}]}
                    {:journal-path "/tmp/eta-mu-ultra-test-journal.jsonl"
                     :cache {}}))]
      (is (= :failed-dispatch (:status result)))
      (is (zero? @gate-calls)))))

(deftest commit-failure-skips-card-promotion
  (testing "a failed declared commit cannot promote the board card"
    (let [transitions (atom [])
          result (with-redefs [dispatch! (constantly {})
                               run-gate! (constantly {:exit 0})
                               git-commit! (constantly false)
                               card-fsm! (fn [_repo _uuid status]
                                           (swap! transitions conj status)
                                           true)]
                   (run-implement-stage
                    {:vars {:repo "."}
                     :run {:model nil :agent-timeout-ms 1}}
                    {:stage/id :commit-regression
                     :stage/card "missing-card.md"
                     :stage/uuid "card-uuid"
                     :stage/agent "test"
                     :stage/max-attempts 1
                     :stage/gates [{:cmd "passes"}]
                     :stage/commit {:paths ["src"] :message "test"}}
                    {:journal-path "/tmp/eta-mu-ultra-test-journal.jsonl"
                     :cache {}}))]
      (is (= :failed-commit (:status result)))
      (is (false? (:committed result)))
      (is (false? (:promoted result)))
      (is (= ["in_progress"] @transitions)))))

(let [{:keys [fail error]} (run-tests)]
  (when (pos? (+ fail error))
    (System/exit 1)))
