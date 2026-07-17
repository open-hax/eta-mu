(ns eta-mu.extern.openai-test
  (:require [cljs.test :refer [deftest is testing use-fixtures]]
            [eta-mu.extern.openai :as openai]))

(def ^:private original-fetch js/fetch)

(use-fixtures :each
  {:before #(set! js/fetch original-fetch)
   :after #(set! js/fetch original-fetch)})

(defn- sse-body
  "A `response.body`-like object whose `getReader()` yields one SSE event per
  `.read()` call. `chunks` is a vector of chat-completion-chunk maps; a
  trailing `[DONE]` sentinel is appended automatically."
  [chunks]
  (let [encoder (js/TextEncoder.)
        blocks (conj (mapv (fn [c] (str "data: " (js/JSON.stringify (clj->js c)) "\n\n")) chunks)
                     "data: [DONE]\n\n")
        idx (atom 0)]
    #js {:getReader
         (fn []
           #js {:read (fn []
                        (js/Promise.resolve
                         (if (< @idx (count blocks))
                           (let [b (nth blocks @idx)]
                             (swap! idx inc)
                             #js {:done false :value (.encode encoder b)})
                           #js {:done true :value nil})))})}))

(defn- sse-response
  "A mock streaming Response: `.ok true`, body yields one SSE event per read."
  [chunks]
  #js {:ok true :status 200 :body (sse-body chunks)})

(defn- split-across-reads-response
  "A mock streaming Response whose full SSE text arrives split across two
  separate `.read()` calls, to exercise the buffering/reassembly path."
  [full-text]
  (let [encoder (js/TextEncoder.)
        mid (quot (count full-text) 2)
        parts [(subs full-text 0 mid) (subs full-text mid)]
        idx (atom 0)]
    #js {:ok true
         :status 200
         :body #js {:getReader
                    (fn []
                      #js {:read (fn []
                                   (js/Promise.resolve
                                    (if (< @idx (count parts))
                                      (let [p (nth parts @idx)]
                                        (swap! idx inc)
                                        #js {:done false :value (.encode encoder p)})
                                      #js {:done true :value nil})))})}}))

(defn- error-response [status body]
  #js {:ok false
       :status status
       :json (fn [] (js/Promise.resolve (clj->js body)))})

(defn- ^:async drain-events!
  "Drain a stream's `.next()` calls into a vector of `{:type :partial}` maps."
  [stream]
  (loop [events []]
    (let [chunk (await (.next stream))]
      (if (.-done chunk)
        events
        (let [^js v (.-value chunk)]
          (recur (conj events {:type (.-type v) :partial (.-partial v)})))))))

(deftest ^:async stream-chat-success-test
  (testing "stream-chat streams text deltas and resolves to the final assistant message"
    (set! js/fetch
          (fn [_url _opts]
            (js/Promise.resolve
             (sse-response
              [{:choices [{:index 0 :delta {:role "assistant"} :finish_reason nil}]}
               {:choices [{:index 0 :delta {:content "Hel"} :finish_reason nil}]}
               {:choices [{:index 0 :delta {:content "lo"} :finish_reason nil}]}
               {:choices [{:index 0 :delta {} :finish_reason "stop"}]}
               {:choices [] :usage {:prompt_tokens 10 :completion_tokens 5 :total_tokens 15}}]))))
    (let [stream (await (openai/stream-chat
                          {:id "gpt-4o-mini" :provider "openai"}
                          {:system-prompt "sys" :messages [] :tools []}
                          {:api-key "test-key"}))
          events (await (drain-events! stream))
          final (await (.result stream))]
      (is (= "start" (:type (first events))))
      (is (some #(= "text_start" (:type %)) events))
      (is (>= (count (filter #(= "text_delta" (:type %)) events)) 2))
      (is (= "text_end" (:type (last events))))
      (is (= :assistant (:role final)))
      (is (= "Hello" (-> final :content first :text)))
      (is (= "gpt-4o-mini" (:model final)))
      (is (= :stop (:stop-reason final)))
      (is (= 15 (:total-tokens (:usage final)))))))

(deftest ^:async stream-chat-tool-calls-test
  (testing "stream-chat accumulates streamed tool_calls into canonical content"
    (set! js/fetch
          (fn [_url _opts]
            (js/Promise.resolve
             (sse-response
              [{:choices [{:index 0
                           :delta {:tool_calls [{:index 0 :id "call-1" :type "function"
                                                  :function {:name "read" :arguments ""}}]}
                           :finish_reason nil}]}
               {:choices [{:index 0
                           :delta {:tool_calls [{:index 0 :function {:arguments "{\"path\":"}}]}
                           :finish_reason nil}]}
               {:choices [{:index 0
                           :delta {:tool_calls [{:index 0 :function {:arguments "\"a.txt\"}"}}]}
                           :finish_reason nil}]}
               {:choices [{:index 0 :delta {} :finish_reason "tool_calls"}]}]))))
    (let [stream (await (openai/stream-chat
                          {:id "gpt-4o-mini" :provider "openai"}
                          {:system-prompt "sys" :messages [] :tools []}
                          {:api-key "test-key"}))
          events (await (drain-events! stream))
          final (await (.result stream))]
      (is (some #(= "toolcall_start" (:type %)) events))
      (is (some #(= "toolcall_delta" (:type %)) events))
      (is (= "toolcall_end" (:type (last events))))
      (is (= :tool-use (:stop-reason final)))
      (is (= 1 (count (:content final))))
      (is (= :tool-call (-> final :content first :type)))
      (is (= "a.txt" (-> final :content first :arguments :path))))))

(deftest ^:async stream-chat-split-across-reads-test
  (testing "stream-chat reassembles an SSE event split across multiple network reads"
    (let [payload (str "data: " (js/JSON.stringify
                                  (clj->js {:choices [{:index 0 :delta {:content "Hi"} :finish_reason nil}]}))
                       "\n\n"
                       "data: " (js/JSON.stringify
                                 (clj->js {:choices [{:index 0 :delta {} :finish_reason "stop"}]}))
                       "\n\n"
                       "data: [DONE]\n\n")]
      (set! js/fetch (fn [_url _opts] (js/Promise.resolve (split-across-reads-response payload)))))
    (let [stream (await (openai/stream-chat
                          {:id "gpt-4o-mini" :provider "openai"}
                          {:system-prompt "sys" :messages [] :tools []}
                          {:api-key "test-key"}))
          final (await (.result stream))]
      (is (= :assistant (:role final)))
      (is (= "Hi" (-> final :content first :text))))))

(deftest ^:async stream-chat-no-api-key-local-proxy-test
  (testing "stream-chat succeeds without an auth token when a non-default base-url is set (local proxy)"
    (set! js/fetch
          (fn [_url _opts]
            (js/Promise.resolve
             (sse-response
              [{:choices [{:index 0 :delta {:content "Hi"} :finish_reason nil}]}
               {:choices [{:index 0 :delta {} :finish_reason "stop"}]}]))))
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

(deftest ^:async stream-chat-api-error-test
  (testing "stream-chat surfaces a non-200 response as an error assistant message"
    (set! js/fetch
          (fn [_url _opts]
            (js/Promise.resolve
             (error-response 401 {:error {:message "invalid api key"}}))))
    (let [stream (await (openai/stream-chat
                          {:id "gpt-4o-mini" :provider "openai"}
                          {:system-prompt "sys" :messages [] :tools []}
                          {:api-key "bad-key"}))
          final (await (.result stream))]
      (is (= :error (:stop-reason final)))
      (is (re-find #"invalid api key" (:error-message final))))))
