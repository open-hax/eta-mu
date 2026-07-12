(ns eta-mu.domain.tools.edit-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.domain.tools.edit :as edit]))

(deftest apply-edit-success-test
  (testing "replaces a unique match"
    (let [result (edit/apply-edit "hello world" "world" "there")]
      (is (= "hello there" (:content result))))))

(deftest apply-edit-not-found-test
  (testing "reports :not-found when old-text is absent"
    (let [result (edit/apply-edit "hello world" "missing" "there")]
      (is (= :not-found (:error result))))))

(deftest apply-edit-not-unique-test
  (testing "reports :not-unique when old-text matches more than once"
    (let [result (edit/apply-edit "aa bb aa" "aa" "cc")]
      (is (= :not-unique (:error result)))
      (is (= 2 (:count result))))))

(deftest apply-edit-no-op-test
  (testing "reports :no-op when old-text and new-text are identical"
    (let [result (edit/apply-edit "hello" "hello" "hello")]
      (is (= :no-op (:error result))))))
