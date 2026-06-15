(ns rheos.backend.law.fsm-test
  (:require [cljs.test :refer [deftest is async]]
            [rheos.backend.law.fsm :as fsm]))

(deftest resolve-fsm-default
  (is (= fsm/default-fsm (fsm/resolve-fsm {}))))

(deftest resolve-fsm-promethean
  (let [result (fsm/resolve-fsm {:fsm "promethean"})]
    (is (= fsm/promethean-fsm result))
    (is (= 14 (count (:states result))))))

(deftest evaluate-valid-transition
  (is (:allowed? (fsm/evaluate-transition fsm/default-fsm "incoming" "breakdown" {}))))

(deftest evaluate-invalid-transition
  (let [r (fsm/evaluate-transition fsm/default-fsm "incoming" "done" {})]
    (is (not (:allowed? r)))))

(deftest evaluate-wip-under-limit
  (is (:allowed? (fsm/evaluate-transition fsm/default-fsm "ready" "in_progress" {"in_progress" 3}))))

(deftest evaluate-wip-at-limit
  (let [r (fsm/evaluate-transition fsm/default-fsm "ready" "in_progress" {"in_progress" 10})]
    (is (not (:allowed? r)))
    (is (re-find #"WIP" (:reason r)))))

(deftest valid-targets-from-incoming
  (is (some #(= "breakdown" %) (fsm/valid-targets fsm/default-fsm "incoming"))))

(deftest default-fsm-has-6-states
  (is (= 6 (count (:states fsm/default-fsm)))))

(deftest promethean-rejects-multi-hop-to-done
  ;; The exact failure this board suffered: agents hand-edited cards from
  ;; incoming/accepted straight to done. A live FSM rejects those jumps.
  (is (not (:allowed? (fsm/evaluate-transition fsm/promethean-fsm "incoming" "done" {}))))
  (is (not (:allowed? (fsm/evaluate-transition fsm/promethean-fsm "accepted" "done" {}))))
  (is (not (:allowed? (fsm/evaluate-transition fsm/promethean-fsm "todo" "done" {})))))

(deftest promethean-allows-done-reopen
  ;; done may be reopened for re-review (or iceboxed), but not arbitrarily.
  (is (:allowed? (fsm/evaluate-transition fsm/promethean-fsm "done" "review" {})))
  (is (:allowed? (fsm/evaluate-transition fsm/promethean-fsm "done" "icebox" {})))
  (is (not (:allowed? (fsm/evaluate-transition fsm/promethean-fsm "done" "in_progress" {})))))

(deftest promethean-normal-forward-path
  (is (:allowed? (fsm/evaluate-transition fsm/promethean-fsm "review" "document" {})))
  (is (:allowed? (fsm/evaluate-transition fsm/promethean-fsm "document" "done" {}))))

(deftest promethean-in-progress-to-review-is-gated
  ;; in_progress -> review is structurally allowed but carries the :build-gate check,
  ;; so the actual move runs build/lint/test via fsm/run-gate (see transition/move-task!).
  (let [r (fsm/evaluate-transition fsm/promethean-fsm "in_progress" "review" {})]
    (is (:allowed? r))
    (is (= :build-gate (:check r)))
    (is (= :command (get-in r [:check-spec :type]))))
  ;; Sending work back stays free (no gate).
  (let [r (fsm/evaluate-transition fsm/promethean-fsm "in_progress" "todo" {})]
    (is (:allowed? r))
    (is (= :always-allow (:check r)))))

(deftest run-gate-passes-through-non-command-checks
  ;; A structurally-allowed transition whose check is not a command gate clears immediately.
  (async done
    (let [decision (fsm/evaluate-transition fsm/promethean-fsm "in_progress" "todo" {})]
      ((fn ^:async []
         (let [gate (await (fsm/run-gate decision "."))]
           (is (:allowed? gate))
           (done)))))))
