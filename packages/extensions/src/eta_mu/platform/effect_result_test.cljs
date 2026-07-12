(ns eta-mu.platform.effect-result-test
  "Tests for the ημ result algebra."
  (:require
   [cljs.test :refer [deftest is]]
   [eta-mu.platform.effect.result :as r]))

(deftest ok-result
  (let [res (r/ok {:findings [1 2 3]} {:effects [:network/search]})]
    (is (r/result? res))
    (is (r/ok? res))
    (is (not (r/rejected? res)))
    (is (not (r/failed? res)))
    (is (= {:findings [1 2 3]} (r/value res)))
    (is (= [:network/search] (get-in res [:ημ/meta :effects])))))

(deftest rejected-result
  (let [res (r/rejected :policy/denied "Network search not allowed")]
    (is (r/result? res))
    (is (r/rejected? res))
    (is (not (r/ok? res)))
    (is (= :policy/denied (r/kind res)))
    (is (= "Network search not allowed" (get-in res [:ημ/error :reason])))))

(deftest failed-result
  (let [res (r/failed :network/unavailable "service down" :retryable? true)]
    (is (r/result? res))
    (is (r/failed? res))
    (is (= :network/unavailable (r/kind res)))
    (is (true? (get-in res [:ημ/error :retryable?])))))
