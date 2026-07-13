(ns eta-mu.terminal-ui.component.message-test
  (:require [clojure.string :as str]
            [cljs.test :refer [deftest is testing]]
            [eta-mu.terminal-ui.component.message :as message]))

(deftest user-message-test
  (testing "renders a labeled, wrapped user line"
    (let [rendered (str/join "\n" (message/user-message "hello there" 80))]
      (is (str/includes? rendered "you"))
      (is (str/includes? rendered "hello there")))))

(deftest assistant-message-content-parts-test
  (testing "flattens text content parts and drops non-text parts"
    (let [content [{:type :text :text "part one "}
                   {:type :tool-call :id "1" :name "read" :arguments {}}
                   {:type :text :text "part two"}]
          rendered (str/join "\n" (message/assistant-message content 80))]
      (is (str/includes? rendered "assistant"))
      (is (str/includes? rendered "part one part two")))))

(deftest tool-call-test
  (testing "renders the tool name and its arguments"
    (let [rendered (str/join "\n" (message/tool-call "read" {:path "a.txt"} 80))]
      (is (str/includes? rendered "read"))
      (is (str/includes? rendered "a.txt")))))

(deftest tool-result-success-test
  (testing "renders a success marker, the tool name, and the output body"
    (let [rendered (str/join "\n" (message/tool-result "read" false [{:type :text :text "file contents"}] 80))]
      (is (str/includes? rendered "read"))
      (is (str/includes? rendered "file contents")))))

(deftest tool-result-error-test
  (testing "renders the error body even when marked is-error"
    (let [rendered (str/join "\n" (message/tool-result "bash" true [{:type :text :text "boom"}] 80))]
      (is (str/includes? rendered "boom")))))
