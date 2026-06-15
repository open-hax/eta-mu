(ns katamorph.agent.text-delta-test
  (:require [cljs.test :refer [deftest testing is]]
            [katamorph.agent.text-delta :as td]))

(deftest diff-appended-empty-previous
  (testing "Empty previous returns full current"
    (is (= "hello" (td/diff-appended-text "" "hello")))
    (is (= "hello" (td/diff-appended-text nil "hello")))))

(deftest diff-appended-empty-current
  (testing "Empty current returns empty string"
    (is (= "" (td/diff-appended-text "hello" "")))
    (is (= "" (td/diff-appended-text "hello" nil)))))

(deftest diff-appended-identical
  (testing "Identical strings return empty"
    (is (= "" (td/diff-appended-text "hello world" "hello world")))))

(deftest diff-appended-cumulative
  (testing "Returns only the new suffix for cumulative provider chunks"
    (is (= " world" (td/diff-appended-text "hello" "hello world")))
    (is (= "!" (td/diff-appended-text "hello world" "hello world!")))))

(deftest diff-appended-duplicated-prefix
  (testing "Handles provider glitch where prefix is duplicated"
    ;; Provider sends "Hello" then "Hello Hello world" (duplicated prefix)
    (let [result (td/diff-appended-text "Hello" "Hello Hello world")]
      (is (= "Hello world" result)))))

(deftest diff-appended-overlap
  (testing "Handles partial overlap when provider doesn't send cumulative chunks"
    (is (= "rld" (td/diff-appended-text "hello wo" "world")))))

(deftest suppress-replayed-no-replay
  (testing "When no replay offset, delta passes through"
    (let [r (td/suppress-replayed-prefix-delta "hello" nil " world")]
      (is (= " world" (:delta r)))
      (is (nil? (:replay-offset r))))))

(deftest suppress-replayed-active-replay
  (testing "When replay offset is active, matching delta is suppressed"
    (let [r (td/suppress-replayed-prefix-delta "hello" 0 "hel")]
      (is (= "" (:delta r)))
      (is (= 3 (:replay-offset r))))))

(deftest suppress-replayed-replay-complete
  (testing "When delta extends past replayed portion, extra is emitted"
    (let [r (td/suppress-replayed-prefix-delta "hello" 3 "lo world")]
      (is (= " world" (:delta r)))
      (is (nil? (:replay-offset r))))))

(deftest suppress-replayed-blank-delta
  (testing "Blank delta preserves existing offset"
    (let [r (td/suppress-replayed-prefix-delta "hello" 2 "")]
      (is (= "" (:delta r)))
      (is (= 2 (:replay-offset r))))))
