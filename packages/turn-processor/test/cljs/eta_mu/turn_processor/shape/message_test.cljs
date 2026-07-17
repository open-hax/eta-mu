(ns eta-mu.turn-processor.shape.message-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.turn-processor.shape.message :as shape]))

(deftest user-message->openai-test
  (testing "string user message converts to OpenAI user message"
    (is (= {:role "user" :content "hello"}
           (shape/message->openai {:role :user :content "hello" :timestamp 1}))))
  (testing "user message with content vector converts to string"
    (is (= {:role "user" :content "hello world"}
           (shape/message->openai {:role :user :content [{:type :text :text "hello world"}] :timestamp 1})))))

(deftest assistant-message->openai-test
  (testing "text assistant message converts to string content"
    (is (= {:role "assistant" :content "done"}
           (shape/message->openai {:role :assistant
                                       :content [{:type :text :text "done"}]
                                       :api "test" :provider "test" :model "test"
                                       :usage {:input 0 :output 0 :cache-read 0 :cache-write 0 :total-tokens 0}
                                       :stop-reason :stop
                                       :timestamp 1}))))
  (testing "assistant with tool calls converts to tool_calls"
    (let [msg {:role :assistant
               :content [{:type :tool-call :id "call-1" :name "read" :arguments {:path "a.txt"}}]
               :api "test" :provider "test" :model "test"
               :usage {:input 0 :output 0 :cache-read 0 :cache-write 0 :total-tokens 0}
               :stop-reason :tool-use
               :timestamp 1}
          dto (shape/message->openai msg)]
      (is (= "assistant" (:role dto)))
      (is (= 1 (count (:tool_calls dto))))
      (is (= "call-1" (get-in dto [:tool_calls 0 :id])))
      (is (= "read" (get-in dto [:tool_calls 0 :function :name])))
      (is (= "{\"path\":\"a.txt\"}" (get-in dto [:tool_calls 0 :function :arguments])))))
  (testing "assistant with text and tool calls keeps both"
    (let [msg {:role :assistant
               :content [{:type :text :text "I'll read"}
                         {:type :tool-call :id "call-1" :name "read" :arguments {}}]
               :api "test" :provider "test" :model "test"
               :usage {:input 0 :output 0 :cache-read 0 :cache-write 0 :total-tokens 0}
               :stop-reason :tool-use
               :timestamp 1}
          dto (shape/message->openai msg)]
      (is (= "I'll read" (:content dto)))
      (is (= 1 (count (:tool_calls dto)))))))

(deftest tool-result-message->openai-test
  (testing "tool result converts to OpenAI tool message"
    (is (= {:role "tool" :tool_call_id "call-1" :content "result"}
           (shape/message->openai {:role :tool-result
                                       :tool-call-id "call-1"
                                       :tool-name "read"
                                       :content [{:type :text :text "result"}]
                                       :is-error false
                                       :timestamp 1})))))

(deftest openai->user-message-test
  (testing "OpenAI user message converts to canonical user message"
    (let [msg (shape/openai->message {:role "user" :content "hi"} {:timestamp 2})]
      (is (= :user (:role msg)))
      (is (= "hi" (-> msg :content first :text)))
      (is (= 2 (:timestamp msg))))))

(deftest openai->assistant-message-test
  (testing "OpenAI assistant message with content converts back"
    (let [defaults {:api "openai" :provider "openai" :model "gpt-4"
                    :usage {:input 1 :output 2 :cache-read 0 :cache-write 0 :total-tokens 3}
                    :stop-reason :stop :timestamp 5}
          msg (shape/openai->message {:role "assistant" :content "ok"} defaults)]
      (is (= :assistant (:role msg)))
      (is (= "ok" (-> msg :content first :text)))
      (is (= "openai" (:api msg)))
      (is (= 5 (:timestamp msg)))))
  (testing "OpenAI assistant with tool calls converts back"
    (let [defaults {:api "openai" :provider "openai" :model "gpt-4"
                    :usage {:input 1 :output 2 :cache-read 0 :cache-write 0 :total-tokens 3}
                    :stop-reason :tool-use :timestamp 6}
          msg (shape/openai->message {:role "assistant"
                                         :tool_calls [{:id "call-1"
                                                       :type "function"
                                                       :function {:name "read"
                                                                  :arguments "{\"path\":\"a.txt\"}"}}]}
                                        defaults)]
      (is (= 1 (count (:content msg))))
      (is (= :tool-call (-> msg :content first :type)))
      (is (= "call-1" (-> msg :content first :id)))
      (is (= "a.txt" (-> msg :content first :arguments :path))))))

(deftest openai->tool-result-message-test
  (testing "OpenAI tool message converts to canonical tool result"
    (let [msg (shape/openai->message {:role "tool" :tool_call_id "call-1" :content "done"} {:timestamp 7})]
      (is (= :tool-result (:role msg)))
      (is (= "call-1" (:tool-call-id msg)))
      (is (= "done" (-> msg :content first :text))))))

(deftest openai-context-round-trip-test
  (testing "context converts to OpenAI messages and back"
    (let [context {:system-prompt "sys"
                   :messages [{:role :user :content "hi" :timestamp 1}]}
          openai-ctx (shape/openai-context context)
          back (shape/context-from-openai openai-ctx {:timestamp 1})]
      (is (= "sys" (:system-prompt back)))
      (is (= :user (-> back :messages first :role)))
      (is (= "hi" (-> back :messages first :content first :text))))))

(deftest validate-messages-test
  (testing "valid messages return nil"
    (is (nil? (shape/validate-messages [{:role :user :content "hi" :timestamp 1}]))))
  (testing "invalid messages return errors"
    (is (seq (shape/validate-messages [{:role :unknown}])))))
