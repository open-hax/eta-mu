(ns eta-mu.terminal-ui.component.spacer-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.terminal-ui.component.spacer :as spacer]))

(deftest spacer-default-test
  (testing "default 1 line"
    (let [s (spacer/spacer)]
      (is (= [""] ((:render s) 80))))))

(deftest spacer-custom-lines-test
  (testing "custom number of lines"
    (let [s (spacer/spacer 3)]
      (is (= 3 (count ((:render s) 80)))))))

(deftest spacer-set-lines-test
  (testing "set-lines updates count"
    (let [s (spacer/spacer 1)]
      ((:set-lines s) 5)
      (is (= 5 (count ((:render s) 80)))))))
