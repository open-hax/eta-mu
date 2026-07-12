(ns eta-mu.terminal-ui.domain.kill-ring-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.terminal-ui.domain.kill-ring :as kr]))

(deftest kill-ring-basic-test
  (testing "push and peek"
    (let [ring (kr/kill-ring)]
      ((:push ring) "hello" {:prepend false})
      (is (= "hello" ((:peek ring))))
      (is (== 1 ((:length ring))))))
  (testing "push empty string does nothing"
    (let [ring (kr/kill-ring)]
      ((:push ring) "" {:prepend false})
      (is (== 0 ((:length ring))))))
  (testing "rotate"
    (let [ring (kr/kill-ring)]
      ((:push ring) "a" {:prepend false})
      ((:push ring) "b" {:prepend false})
      ((:rotate ring))
      (is (= "a" ((:peek ring)))))))

(deftest kill-ring-accumulate-test
  (testing "accumulate appends"
    (let [ring (kr/kill-ring)]
      ((:push ring) "hello" {:prepend false :accumulate false})
      ((:push ring) " world" {:prepend false :accumulate true})
      (is (= "hello world" ((:peek ring))))
      (is (== 1 ((:length ring))))))
  (testing "accumulate prepends"
    (let [ring (kr/kill-ring)]
      ((:push ring) "world" {:prepend false :accumulate false})
      ((:push ring) "hello " {:prepend true :accumulate true})
      (is (= "hello world" ((:peek ring)))))))
