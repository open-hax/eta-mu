(ns eta-mu.terminal-ui.domain.undo-stack-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.terminal-ui.domain.undo-stack :as us]))

(deftest undo-stack-basic-test
  (testing "push and pop"
    (let [stack (us/undo-stack)]
      ((:push stack) {:value "hello"})
      (is (== 1 ((:length stack))))
      (let [snapshot ((:pop stack))]
        (is (= "hello" (:value snapshot)))
        (is (== 0 ((:length stack))))))
  (testing "pop empty returns nil"
    (let [stack (us/undo-stack)]
      (is (nil? ((:pop stack))))))
  (testing "clear"
    (let [stack (us/undo-stack)]
      ((:push stack) {:a 1})
      ((:push stack) {:a 2})
      ((:clear stack))
      (is (== 0 ((:length stack))))))))
