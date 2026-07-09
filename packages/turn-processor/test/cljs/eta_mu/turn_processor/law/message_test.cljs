(ns eta-mu.turn-processor.law.message-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.turn-processor.law.message :as msg]))

(deftest valid-user-text-message-test
  (testing "accepts a simple user text message"
    (is (msg/valid-message? {:role :user
                             :content "hello"
                             :timestamp 0}))))

(deftest valid-user-content-vector-test
  (testing "accepts a user message with content vector"
    (is (msg/valid-message? {:role :user
                             :content [{:type :text :text "hello"}]
                             :timestamp 1}))))

(deftest valid-assistant-message-test
  (testing "accepts an assistant message with tool call"
    (is (msg/valid-message? {:role :assistant
                             :content [{:type :tool-call
                                        :id "call-1"
                                        :name "read"
                                        :arguments {:path "file.txt"}}]
                             :api "test"
                             :provider "test"
                             :model "test"
                             :usage {:input 0 :output 0 :cache-read 0 :cache-write 0 :total-tokens 0}
                             :stop-reason :tool-use
                             :timestamp 2}))))

(deftest valid-tool-result-test
  (testing "accepts a tool result message"
    (is (msg/valid-message? {:role :tool-result
                             :tool-call-id "call-1"
                             :tool-name "read"
                             :content [{:type :text :text "contents"}]
                             :is-error false
                             :timestamp 3}))))

(deftest invalid-message-missing-timestamp-test
  (testing "rejects a message without a timestamp"
    (is (not (msg/valid-message? {:role :user :content "hello"})))))

(deftest invalid-assistant-missing-usage-test
  (testing "rejects an assistant message without usage"
    (is (not (msg/valid-message? {:role :assistant
                                  :content [{:type :text :text "hi"}]
                                  :api "x" :provider "x" :model "x"
                                  :stop-reason :stop
                                  :timestamp 1})))))
