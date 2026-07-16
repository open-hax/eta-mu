(ns eta-mu.domain.tools.find-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.domain.tools.find :as find]))

(def entries
  [{:path "a.ts" :dir? false}
   {:path "b.txt" :dir? false}
   {:path "src" :dir? true}
   {:path "src/c.ts" :dir? false}
   {:path "node_modules/dep.ts" :dir? false}])

(deftest select-matches-happy-path-test
  (testing "matches files by basename glob, excludes directories"
    (let [{:keys [matches limit-reached?]} (find/select-matches entries "*.ts" [] 100)]
      (is (= ["a.ts" "node_modules/dep.ts" "src/c.ts"] matches))
      (is (not limit-reached?)))))

(deftest select-matches-ignored-test
  (testing "excludes entries matching an ignore pattern"
    (let [{:keys [matches]} (find/select-matches entries "*.ts" ["node_modules"] 100)]
      (is (not-any? #(re-find #"node_modules" %) matches)))))

(deftest select-matches-limit-test
  (testing "caps results at limit and reports limit-reached?"
    (let [{:keys [matches limit-reached?]} (find/select-matches entries "*.ts" [] 1)]
      (is (= 1 (count matches)))
      (is limit-reached?))))

(deftest select-matches-no-results-test
  (testing "returns no matches for a pattern that matches nothing"
    (let [{:keys [matches limit-reached?]} (find/select-matches entries "*.md" [] 100)]
      (is (empty? matches))
      (is (not limit-reached?)))))
