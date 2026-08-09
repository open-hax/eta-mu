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

(deftest evaluate-rejects-a-status-outside-the-state-set
  ;; The `in_review` bug: a status that is not an FSM state at all was written
  ;; to three cards, stranding them where `done` was unreachable. No state may
  ;; reach a target outside `:states`, and no state may offer one.
  (doseq [fsm-def [fsm/default-fsm fsm/promethean-fsm]
          from (:states fsm-def)
          bogus ["in_review" "IN_PROGRESS" "" "done "]]
    (let [result (fsm/evaluate-transition fsm-def from bogus {})]
      (is (not (:allowed? result))
          (str "'" from "' -> '" bogus "' must be refused"))
      (is (re-find #"No transition" (:reason result))))
    (is (not (some #(= bogus %) (fsm/valid-targets fsm-def from)))
        (str "'" bogus "' must never be offered as a target from '" from "'"))))

(deftest evaluate-rejects-a-source-outside-the-state-set
  ;; A card already holding a bogus status must not be able to move anywhere —
  ;; that is what made the three `in_review` cards unrecoverable via the FSM.
  (doseq [to (:states fsm/promethean-fsm)]
    (is (not (:allowed? (fsm/evaluate-transition fsm/promethean-fsm
                                                 "in_review" to {})))
        (str "'in_review' -> '" to "' must be refused")))
  (is (empty? (fsm/valid-targets fsm/promethean-fsm "in_review"))))

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
