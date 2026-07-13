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

(deftest ^:async stream-chat-no-api-key-local-proxy-test
  (testing "stream-chat succeeds without an auth token when a non-default base-url is set (local proxy)"
    (set! js/fetch
          (fn [_url _opts]
            (js/Promise.resolve
              (json-response
                {:model "local-model"
                 :choices [{:message {:role "assistant" :content "Hi"}
                            :finish_reason "stop"}]
                 :usage {:prompt_tokens 1 :completion_tokens 1 :total_tokens 2}}))))
    (let [stream (await (openai/stream-chat
                          {:id "local-model" :provider "local"}
                          {:system-prompt "sys" :messages [] :tools []}
                          {:base-url "http://localhost:1234/v1/chat/completions"}))
          final (await (.result stream))]
      (is (= :assistant (:role final)))
      (is (= "Hi" (-> final :content first :text))))))

(deftest ^:async stream-chat-no-provider-configured-test
  (testing "stream-chat short-circuits with a clear error when no api key and no alternate base-url are set"
    (set! js/fetch (fn [_url _opts] (throw (js/Error. "fetch should not be called"))))
    (let [stream (await (openai/stream-chat
                          {:id "gpt-4o-mini" :provider "openai"}
                          {:system-prompt "sys" :messages [] :tools []}
                          {}))
          final (await (.result stream))]
      (is (= :error (:stop-reason final)))
      (is (re-find #"No API key configured" (:error-message final))))))
