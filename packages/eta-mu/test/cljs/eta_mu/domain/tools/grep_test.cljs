(ns eta-mu.domain.tools.grep-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.domain.tools.grep :as grep]))

(def sample-content "alpha\nbeta needle\ngamma\ndelta needle\nepsilon")

(deftest search-file-happy-path-test
  (testing "finds matching lines and formats path:line: text"
    (let [{:keys [blocks match-count]} (grep/search-file "f.txt" sample-content "needle" {})]
      (is (= 2 match-count))
      (is (= ["f.txt:2: beta needle" "f.txt:4: delta needle"] blocks)))))

(deftest search-file-ignore-case-test
  (testing "ignore-case? matches regardless of letter case"
    (let [{:keys [match-count]} (grep/search-file "f.txt" sample-content "NEEDLE" {:ignore-case? true})]
      (is (= 2 match-count)))))

(deftest search-file-literal-test
  (testing "literal? treats regex special chars as plain text"
    (let [content "a.b\nacb"
          {:keys [match-count blocks]} (grep/search-file "f.txt" content "a.b" {:literal? true})]
      (is (= 1 match-count))
      (is (= ["f.txt:1: a.b"] blocks)))))

(deftest search-file-context-test
  (testing "context includes surrounding lines with - markers"
    (let [{:keys [blocks]} (grep/search-file "f.txt" sample-content "needle" {:context 1})]
      (is (= ["f.txt-1- alpha"
              "f.txt:2: beta needle"
              "f.txt-3- gamma"
              "f.txt-3- gamma"
              "f.txt:4: delta needle"
              "f.txt-5- epsilon"]
             blocks)))))

(deftest search-file-limit-test
  (testing "caps matches at the given limit"
    (let [{:keys [match-count]} (grep/search-file "f.txt" sample-content "needle" {:limit 1})]
      (is (= 1 match-count)))))

(deftest search-file-no-matches-test
  (testing "no matches returns an empty result"
    (let [{:keys [blocks match-count]} (grep/search-file "f.txt" sample-content "xyz" {})]
      (is (empty? blocks))
      (is (zero? match-count)))))
