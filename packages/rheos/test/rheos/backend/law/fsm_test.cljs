(ns rheos.backend.law.fsm-test
  (:require [cljs.test :refer [deftest is]]
            [rheos.backend.law.fsm :as fsm]))

(deftest resolve-fsm-default
  (is (= fsm/default-fsm (fsm/resolve-fsm {}))))

(deftest resolve-fsm-promethean
  (let [result (fsm/resolve-fsm {:fsm "promethean"})]
    (is (= fsm/promethean-fsm result))
    (is (= 14 (count (:states result))))))

(deftest resolve-fsm-promethean-edn-keyword
  (is (= fsm/promethean-fsm
         (fsm/resolve-fsm {:fsm :promethean}))))

(deftest resolve-fsm-edn-overlay
  (let [result (fsm/resolve-fsm
                {:fsm {:extends :promethean
                       :build-gate-commands ["clojure -M:test"]
                       :cwd "/workspace/project"}})]
    (is (= ["clojure -M:test"]
           (get-in result [:checks :build-gate :commands])))
    (is (= "/workspace/project"
           (get-in result [:checks :build-gate :cwd])))))

(deftest resolve-fsm-unsupported-map-falls-back
  (is (= fsm/default-fsm
         (fsm/resolve-fsm {:fsm {:states ["not-a-supported-overlay"]}}))))

(deftest evaluate-valid-transition
  (is (:allowed? (fsm/evaluate-transition fsm/default-fsm
                                           "incoming" "breakdown" {}))))

(deftest evaluate-invalid-transition
  (let [result (fsm/evaluate-transition fsm/default-fsm "incoming" "done" {})]
    (is (not (:allowed? result)))))

(deftest evaluate-wip-under-limit
  (is (:allowed? (fsm/evaluate-transition fsm/default-fsm
                                           "ready" "in_progress"
                                           {"in_progress" 3}))))

(deftest evaluate-wip-at-limit
  (let [result (fsm/evaluate-transition fsm/default-fsm
                                        "ready" "in_progress"
                                        {"in_progress" 10})]
    (is (not (:allowed? result)))
    (is (re-find #"WIP" (:reason result)))))

(deftest valid-targets-from-incoming
  (is (some #(= "breakdown" %)
            (fsm/valid-targets fsm/default-fsm "incoming"))))

(deftest default-fsm-has-6-states
  (is (= 6 (count (:states fsm/default-fsm)))))

(deftest promethean-rejects-multi-hop-to-done
  (is (not (:allowed? (fsm/evaluate-transition fsm/promethean-fsm
                                               "incoming" "done" {}))))
  (is (not (:allowed? (fsm/evaluate-transition fsm/promethean-fsm
                                               "accepted" "done" {}))))
  (is (not (:allowed? (fsm/evaluate-transition fsm/promethean-fsm
                                               "todo" "done" {})))))

(deftest promethean-allows-done-reopen
  (is (:allowed? (fsm/evaluate-transition fsm/promethean-fsm
                                           "done" "review" {})))
  (is (:allowed? (fsm/evaluate-transition fsm/promethean-fsm
                                           "done" "icebox" {})))
  (is (not (:allowed? (fsm/evaluate-transition fsm/promethean-fsm
                                               "done" "in_progress" {})))))

(deftest promethean-normal-forward-path
  (is (:allowed? (fsm/evaluate-transition fsm/promethean-fsm
                                           "review" "document" {})))
  (is (:allowed? (fsm/evaluate-transition fsm/promethean-fsm
                                           "document" "done" {}))))

(deftest promethean-in-progress-to-review-is-gated
  (let [result (fsm/evaluate-transition fsm/promethean-fsm
                                        "in_progress" "review" {})]
    (is (:allowed? result))
    (is (= :build-gate (:check result)))
    (is (= :command (get-in result [:check-spec :type]))))
  (let [result (fsm/evaluate-transition fsm/promethean-fsm
                                        "in_progress" "todo" {})]
    (is (:allowed? result))
    (is (= :always-allow (:check result)))))

(deftest ^:async run-gate-passes-through-non-command-checks
  (let [decision (fsm/evaluate-transition fsm/promethean-fsm
                                          "in_progress" "todo" {})
        gate (await (fsm/run-gate decision "."))]
    (is (:allowed? gate))))
