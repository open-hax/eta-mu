(ns eta-mu.domain.tools.ls-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.domain.tools.ls :as ls]))

(deftest format-entries-happy-path-test
  (testing "sorts case-insensitively and suffixes directories with /"
    (let [entries [{:name "banana.txt" :dir? false}
                   {:name "Apple" :dir? true}
                   {:name "cherry.txt" :dir? false}]
          {:keys [entries limit-reached?]} (ls/format-entries entries 100)]
      (is (= ["Apple/" "banana.txt" "cherry.txt"] entries))
      (is (not limit-reached?)))))

(deftest format-entries-limit-test
  (testing "caps entries at limit and reports limit-reached?"
    (let [entries (mapv (fn [i] {:name (str "file" i) :dir? false}) (range 5))
          {:keys [entries limit-reached?]} (ls/format-entries entries 2)]
      (is (= 2 (count entries)))
      (is limit-reached?))))

(deftest format-entries-empty-test
  (testing "an empty listing produces no entries and no limit-reached"
    (let [{:keys [entries limit-reached?]} (ls/format-entries [] 100)]
      (is (empty? entries))
      (is (not limit-reached?)))))
