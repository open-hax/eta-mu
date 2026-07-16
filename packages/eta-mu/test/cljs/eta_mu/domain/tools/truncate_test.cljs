(ns eta-mu.domain.tools.truncate-test
  (:require [clojure.string :as str]
            [cljs.test :refer [deftest is testing]]
            [eta-mu.domain.tools.truncate :as truncate]))

(deftest truncate-head-under-limit-test
  (testing "content under both limits is returned unchanged"
    (let [result (truncate/truncate-head "a\nb\nc")]
      (is (not (:truncated result)))
      (is (= "a\nb\nc" (:content result))))))

(deftest truncate-head-line-limit-test
  (testing "keeps the first N lines when the line limit is hit"
    (let [content (str/join "\n" (map str (range 10)))
          result (truncate/truncate-head content {:max-lines 3})]
      (is (:truncated result))
      (is (= :lines (:truncated-by result)))
      (is (= "0\n1\n2" (:content result))))))

(deftest truncate-tail-line-limit-test
  (testing "keeps the last N lines when the line limit is hit"
    (let [content (str/join "\n" (map str (range 10)))
          result (truncate/truncate-tail content {:max-lines 3})]
      (is (:truncated result))
      (is (= "7\n8\n9" (:content result))))))

(deftest format-size-test
  (testing "formats bytes, kilobytes, and megabytes"
    (is (= "512B" (truncate/format-size 512)))
    (is (= "1.0KB" (truncate/format-size 1024)))))

(deftest truncate-line-under-limit-test
  (testing "a line under the limit is returned unchanged"
    (let [result (truncate/truncate-line "short line")]
      (is (not (:truncated? result)))
      (is (= "short line" (:text result))))))

(deftest truncate-line-over-limit-test
  (testing "a line over the limit is cut and marked truncated"
    (let [long-line (apply str (repeat 20 "0123456789"))
          result (truncate/truncate-line long-line 50)]
      (is (:truncated? result))
      (is (= (str (subs long-line 0 50) "... [truncated]") (:text result))))))
