(ns eta-mu.terminal-ui.domain.fuzzy-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.terminal-ui.domain.fuzzy :as fuzzy]))

(deftest fuzzy-match-test
  (testing "exact match"
    (let [result (fuzzy/fuzzy-match "hello" "hello")]
      (is (:matches result))
      (is (< (:score result) 0))))
  (testing "substring match"
    (let [result (fuzzy/fuzzy-match "ell" "hello")]
      (is (:matches result))))
  (testing "no match"
    (let [result (fuzzy/fuzzy-match "xyz" "hello")]
      (is (not (:matches result)))))
  (testing "empty query"
    (let [result (fuzzy/fuzzy-match "" "hello")]
      (is (:matches result))
      (is (== 0 (:score result)))))
  (testing "word boundary bonus"
    (let [m1 (fuzzy/fuzzy-match "h" "hello")
          m2 (fuzzy/fuzzy-match "h" "ahello")]
      (is (< (:score m1) (:score m2))))))

(deftest fuzzy-filter-test
  (testing "filters and sorts by score"
    (let [items ["apple" "banana" "avocado" "apricot"]
          result (fuzzy/fuzzy-filter items "ap" identity)]
      (is (= "apple" (first result)))
      (is (some #(= "apricot" %) result))))
  (testing "empty query returns all"
    (let [items ["a" "b" "c"]]
      (is (= items (fuzzy/fuzzy-filter items "" identity)))))
  (testing "space-separated tokens"
    (let [items ["hello world" "hello" "world" "foo bar"]
          result (fuzzy/fuzzy-filter items "hello world" identity)]
      (is (some #(= "hello world" %) result)))))
