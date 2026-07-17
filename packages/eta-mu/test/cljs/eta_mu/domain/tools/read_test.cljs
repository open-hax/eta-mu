(ns eta-mu.domain.tools.read-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.domain.tools.read :as read]))

(deftest select-content-whole-file-test
  (testing "returns the whole file when no offset/limit is given"
    (let [result (read/select-content "a\nb\nc" nil nil)]
      (is (= "a\nb\nc" (:text result)))
      (is (= 1 (:start-line result)))
      (is (= 3 (:total-lines result))))))

(deftest select-content-offset-limit-test
  (testing "honors offset and limit"
    (let [result (read/select-content "a\nb\nc\nd" 2 2)]
      (is (= "b\nc" (:text result)))
      (is (= 2 (:start-line result))))))

(deftest select-content-out-of-bounds-test
  (testing "reports out-of-bounds when offset is past the end of the file"
    (let [result (read/select-content "a\nb" 5 nil)]
      (is (:out-of-bounds? result))
      (is (= 2 (:total-lines result))))))
