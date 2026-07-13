(ns eta-mu.terminal-ui.component.text-test
  (:require [cljs.test :refer [deftest is testing]]
            [clojure.string]
            [eta-mu.terminal-ui.component.text :as text]))

(deftest text-basic-test
  (testing "renders text with padding"
    (let [t (text/text "hello")
          lines ((:render t) 20)]
      (is (> (count lines) 0))
      (is (some #(clojure.string/includes? % "hello") lines)))))

(deftest text-empty-test
  (testing "empty text"
    (let [t (text/text "")
          lines ((:render t) 20)]
      (is (every? #(re-find #"^\s*$" %) lines)))))

(deftest text-wrap-test
  (testing "long text wraps"
    (let [t (text/text "this is a very long sentence that should wrap")
          lines ((:render t) 20)]
      (is (> (count lines) 1)))))
