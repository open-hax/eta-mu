(ns eta-mu.turn-processor.law.agent-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.turn-processor.law.agent :as agent]))

(deftest valid-context-test
  (testing "accepts a valid agent context"
    (is (agent/valid-context? {:system-prompt "You are a helpful assistant."
                               :messages [{:role :user :content "hi" :timestamp 0}]
                               :tools [{:name "read"
                                        :label "Read"
                                        :description "Read a file"
                                        :parameters [:map]}]}))))

(deftest invalid-context-no-system-prompt-test
  (testing "rejects context without system prompt"
    (is (not (agent/valid-context? {:messages [{:role :user :content "hi" :timestamp 0}]})))))

(deftest valid-config-test
  (testing "accepts a valid loop config"
    (is (agent/valid-config? {:model {:id "test" :provider "test"}}))))
