#!/usr/bin/env bb

(require '[clojure.java.io :as io]
         '[clojure.test :refer [deftest is run-tests testing]])

(load-file "scripts/ultra.bb")

(defn- with-temp-journal
  [f]
  (let [file (java.io.File/createTempFile "eta-mu-ultra-test-" ".jsonl")
        path (.getAbsolutePath file)]
    (.delete file)
    (try
      (f path)
      (finally
        (io/delete-file path true)))))

(deftest implementation-dispatch-failure-skips-gates
  (testing "a missing implementation result cannot pass gates or promote a card"
    (with-temp-journal
      (fn [journal-path]
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
                        {:journal-path journal-path
                         :cache {}}))]
          (is (= :failed-dispatch (:status result)))
          (is (zero? @gate-calls)))))))

(deftest commit-failure-skips-card-promotion
  (testing "a failed declared commit cannot promote the board card"
    (with-temp-journal
      (fn [journal-path]
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
                        {:journal-path journal-path
                         :cache {}}))]
          (is (= :failed-commit (:status result)))
          (is (false? (:committed result)))
          (is (false? (:promoted result)))
          (is (= ["in_progress"] @transitions)))))))

(deftest git-commit-is-path-scoped
  (testing "the commit command excludes unrelated entries already staged"
    (let [calls (atom [])]
      ;; git-commit! uses the 3-arity (deref p timeout-ms default), which needs an
      ;; IBlockingDeref — a delay is not one, so stub with a delivered promise.
      (with-redefs [p/process (fn [argv _opts]
                               (swap! calls conj argv)
                               (doto (promise) (deliver {:exit 0 :out "" :err ""})))]
        (is (true? (git-commit! "." ["src/a.clj" "test/a_test.clj"] "scoped")))
        (is (= ["git" "commit" "--only" "-m" "scoped" "--"
                "src/a.clj" "test/a_test.clj"]
               (second @calls)))))))

(deftest promotion-rejection-fails-stage
  (testing "a rejected FSM hop cannot be reported as a passed implementation"
    (with-temp-journal
      (fn [journal-path]
        (let [transitions (atom [])
              result (with-redefs [dispatch! (constantly {})
                                   run-gate! (constantly {:exit 0})
                                   card-fsm! (fn [_repo _uuid status]
                                               (swap! transitions conj status)
                                               (not= status "document"))]
                       (run-implement-stage
                        {:vars {:repo "."}
                         :run {:model nil :agent-timeout-ms 1}}
                        {:stage/id :promotion-regression
                         :stage/card "missing-card.md"
                         :stage/uuid "card-uuid"
                         :stage/agent "test"
                         :stage/max-attempts 1
                         :stage/gates [{:cmd "passes"}]}
                        {:journal-path journal-path
                         :cache {}}))]
          (is (= :failed-promotion (:status result)))
          (is (false? (:promoted result)))
          (is (= ["in_progress" "review" "document"] @transitions)))))))

(deftest failed-stage-halts-dependent-stages
  (testing "later workflow stages do not run after a prerequisite failure"
    (let [calls (atom [])
          wf {:stages [{:stage/id :foundation :stage/kind :implement}
                       {:stage/id :dependent :stage/kind :implement}]}
          outputs
          (with-redefs [run-stage
                        (fn [_wf stage _outputs _opts]
                          (swap! calls conj (:stage/id stage))
                          (if (= :foundation (:stage/id stage))
                            {:status :failed-gates}
                            {:status :passed}))]
            (run-stages wf {}))]
      (is (= [:foundation] @calls))
      (is (= {:foundation {:status :failed-gates}} outputs)))))

(let [{:keys [fail error]} (run-tests)]
  (when (pos? (+ fail error))
    (System/exit 1)))
