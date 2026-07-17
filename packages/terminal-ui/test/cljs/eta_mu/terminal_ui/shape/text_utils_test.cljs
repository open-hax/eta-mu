(ns eta-mu.terminal-ui.shape.text-utils-test
  (:require [cljs.test :refer [deftest is testing]]
            [clojure.string]
            [eta-mu.terminal-ui.shape.text-utils :as tu]))

(deftest visible-width-ascii-test
  (testing "empty string"
    (is (== 0 (tu/visible-width ""))))
  (testing "simple ascii"
    (is (== 5 (tu/visible-width "hello"))))
  (testing "spaces"
    (is (== 3 (tu/visible-width "   ")))))

(deftest visible-width-ansi-test
  (testing "ANSI codes don't count toward width"
    (is (== 3 (tu/visible-width "\u001b[31mabc\u001b[0m"))))
  (testing "bold + color"
    (is (== 4 (tu/visible-width "\u001b[1;32mtest\u001b[0m")))))

(deftest visible-width-tabs-test
  (testing "tabs expand to 3 spaces"
    (is (== 3 (tu/visible-width "\t")))
      (is (== 5 (tu/visible-width "a\tb")))))

(deftest wrap-text-with-ansi-simple-test
  (testing "short text not wrapped"
    (is (= ["hello"] (tu/wrap-text-with-ansi "hello" 80))))
  (testing "empty text"
    (is (= [""] (tu/wrap-text-with-ansi "" 80))))
  (testing "nil text"
    (is (= [""] (tu/wrap-text-with-ansi nil 80))))
  (testing "long text wrapped"
    (let [result (tu/wrap-text-with-ansi "hello world this is long" 10)]
      (is (> (count result) 1))
      (doseq [line result]
        (is (<= (tu/visible-width line) 10))))))

(deftest wrap-text-with-ansi-newlines-test
  (testing "preserves newlines"
    (let [result (tu/wrap-text-with-ansi "line1\nline2" 80)]
      (is (= 2 (count result))))))

(deftest truncate-to-width-simple-test
  (testing "no truncation needed"
    (is (= "hello" (tu/truncate-to-width "hello" 10))))
  (testing "truncation with ellipsis"
    (let [result (tu/truncate-to-width "hello world" 8)]
      (is (<= (tu/visible-width result) 8))
      (is (clojure.string/includes? result "..."))))
  (testing "pad mode"
    (let [result (tu/truncate-to-width "hi" 10 "..." true)]
      (is (== 10 (tu/visible-width result))))))

(deftest truncate-to-width-ansi-test
  (testing "ANSI codes don't count toward width"
    (let [colored "\u001b[31mhello\u001b[0m"
          result (tu/truncate-to-width colored 3)]
      (is (<= (tu/visible-width result) 3)))))

(deftest slice-by-column-test
  (testing "simple slice"
    (is (= "llo" (tu/slice-by-column "hello" 2 3))))
  (testing "slice with ANSI"
    (is (= "lo" (tu/slice-by-column "\u001b[31mhello\u001b[0m" 3 2)))))

(deftest apply-background-to-line-test
  (testing "pads and applies bg-fn"
    (let [result (tu/apply-background-to-line "hi" 5 identity)]
      (is (== 5 (tu/visible-width result))))))
