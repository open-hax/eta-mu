(ns eta-mu.kanban.fsm-test
  (:require [cljs.test :refer [deftest testing is]]
            [eta-mu.kanban.fsm :as fsm]))

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
