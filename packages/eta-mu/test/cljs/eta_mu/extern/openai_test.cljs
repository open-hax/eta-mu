(ns eta-mu.extern.openai-test
  (:require [cljs.test :refer [deftest is testing use-fixtures]]
            [eta-mu.extern.openai :as openai]))

(def ^:private original-fetch js/fetch)

(use-fixtures :each
  {:before #(set! js/fetch original-fetch)
   :after #(set! js/fetch original-fetch)})

(defn- ^:async json-response
  "Create a mock Response with a JSON body."
  [body]
  #js {:ok true
       :status 200
       :json (fn [] (js/Promise.resolve (clj->js body)))})

(deftest ^:async stream-chat-success-test
  (testing "stream-chat returns a final assistant message from OpenAI response"
    (set! js/fetch
          (fn [_url _opts]
            (js/Promise.resolve
              (json-response
                {:model "gpt-4o-mini"
                 :choices [{:message {:role "assistant" :content "Hello"}
                            :finish_reason "stop"}]
                 :usage {:prompt_tokens 10 :completion_tokens 5 :total_tokens 15}}))))
    (let [stream (await (openai/stream-chat
                          {:id "gpt-4o-mini" :provider "openai"}
                          {:system-prompt "sys" :messages [] :tools []}
                          {:api-key "test-key"}))
          chunk (await (.next stream))
          final (await (.result stream))]
      (is (true? (.-done chunk)))
      (is (= :assistant (:role final)))
      (is (= "Hello" (-> final :content first :text)))
      (is (= "gpt-4o-mini" (:model final))))))

(deftest ^:async stream-chat-tool-calls-test
  (testing "stream-chat converts OpenAI tool_calls to canonical content"
    (set! js/fetch
          (fn [_url _opts]
            (js/Promise.resolve
              (json-response
                {:model "gpt-4o-mini"
                 :choices [{:message {:role "assistant"
                                      :tool_calls [{:id "call-1"
                                                    :type "function"
                                                    :function {:name "read" :arguments "{\"path\":\"a.txt\"}"}}]}
                            :finish_reason "tool_calls"}]
                 :usage {:prompt_tokens 10 :completion_tokens 5 :total_tokens 15}}))))
    (let [stream (await (openai/stream-chat
                          {:id "gpt-4o-mini" :provider "openai"}
                          {:system-prompt "sys" :messages [] :tools []}
                          {:api-key "test-key"}))
          final (await (.result stream))]
      (is (= :tool-use (:stop-reason final)))
      (is (= 1 (count (:content final))))
      (is (= :tool-call (-> final :content first :type)))
      (is (= "a.txt" (-> final :content first :arguments :path))))))

(deftest ^:async stream-chat-no-api-key-test
  (testing "stream-chat throws when no api key is provided"
    (set! js/fetch (fn [_url _opts] (js/Promise.reject (js/Error. "should not be called"))))
    (try
      (await (openai/stream-chat
               {:id "gpt-4o-mini" :provider "openai"}
               {:system-prompt "sys" :messages [] :tools []}
               {}))
      (is false "expected an error")
      (catch :default e
        (is (some? e))))))
