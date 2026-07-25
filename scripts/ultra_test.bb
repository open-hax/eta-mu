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

(let [{:keys [fail error]} (run-tests)]
  (when (pos? (+ fail error))
    (System/exit 1)))
