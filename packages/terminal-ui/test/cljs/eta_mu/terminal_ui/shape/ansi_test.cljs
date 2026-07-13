(ns eta-mu.terminal-ui.shape.ansi-test
  (:require [clojure.string :as str]
            [cljs.test :refer [deftest is testing]]
            [eta-mu.terminal-ui.shape.ansi :as ansi]))

(def ^:private esc (.fromCharCode js/String 27))

(deftest style-wraps-text-test
  (testing "wraps text in an ANSI escape carrying the requested SGR codes"
    (let [result (ansi/style [:bold :green] "hi")]
      (is (str/starts-with? result (str esc "[1;32m")))
      (is (str/includes? result "hi"))
      (is (str/ends-with? result (str esc "[0m"))))))

(deftest style-unknown-code-test
  (testing "returns text unchanged when no style keyword is recognized"
    (is (= "hi" (ansi/style [:not-a-style] "hi")))))

(deftest fg-and-bold-and-dim-test
  (testing "fg, bold, and dim are single-code shorthands"
    (is (= (str esc "[31m" "hi" esc "[0m") (ansi/fg :red "hi")))
    (is (= (str esc "[1m" "hi" esc "[0m") (ansi/bold "hi")))
    (is (= (str esc "[2m" "hi" esc "[0m") (ansi/dim "hi")))))
