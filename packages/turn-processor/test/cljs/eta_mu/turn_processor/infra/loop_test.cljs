(ns eta-mu.turn-processor.infra.loop-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.turn-processor.infra.loop :as loop]))

(defn- mock-stream [final-message]
  #js {:next (fn [] (js/Promise.resolve #js {:done true}))
       :result (fn [] (js/Promise.resolve final-message))})

(defn- capture-emit []
  (let [events (atom [])]
    [(fn [event]
       (swap! events conj event)
       (js/Promise.resolve nil))
     events]))

(defn- test-tool [name execute-fn]
  {:name name
   :label (str "Label " name)
   :description (str "Desc " name)
   :parameters [:map]
   :execute execute-fn})

(deftest ^:async stream-final-message-test
  (testing "stream-final-message returns final assistant"
    (let [assistant {:role :assistant
                     :content [{:type :text :text "done"}]
                     :api "test" :provider "test" :model "test"
                     :usage {:input 0 :output 0 :cache-read 0 :cache-write 0 :total-tokens 0}
                     :stop-reason :stop
                     :timestamp 0}
          [emit events] (capture-emit)
          stream (mock-stream assistant)
          result (await (#'loop/stream-final-message stream emit))]
      (is (= :assistant (:role result)))
      (is (some #(= :message_end (:type %)) @events)))))

(deftest ^:async run-loop-stop-no-tools-test
  (testing "loop stops when assistant has no tool calls"
    (let [assistant {:role :assistant
                     :content [{:type :text :text "done"}]
                     :api "test" :provider "test" :model "test"
                     :usage {:input 0 :output 0 :cache-read 0 :cache-write 0 :total-tokens 0}
                     :stop-reason :stop
                     :timestamp 0}
          stream-fn (fn [_ _ _] (mock-stream assistant))
          [emit events] (capture-emit)
          context {:system-prompt "hello"
                   :messages [{:role :user :content "hi" :timestamp 0}]}
          config {:model {:id "test" :provider "test"}
                  :convert-to-llm (fn [messages] messages)}
          result (await (loop/run-loop context config emit stream-fn))]
      (is (= 1 (count result)))
      (is (= :assistant (:role (first result))))
      (is (some #(= :agent_start (:type %)) @events))
      (is (some #(= :turn_end (:type %)) @events))
      (is (some #(= :agent_end (:type %)) @events)))))

(deftest ^:async run-loop-awaits-async-stream-factory-test
  (testing "run-loop awaits a Promise-returning stream factory before consuming it"
    (let [assistant {:role :assistant
                     :content [{:type :text :text "done"}]
                     :api "test" :provider "test" :model "test"
                     :usage {:input 0 :output 0 :cache-read 0 :cache-write 0 :total-tokens 0}
                     :stop-reason :stop
                     :timestamp 0}
          stream-fn (fn [_ _ _]
                      (js/Promise.resolve (mock-stream assistant)))
          [emit] (capture-emit)
          context {:system-prompt "hello"
                   :messages [{:role :user :content "hi" :timestamp 0}]}
          config {:model {:id "test" :provider "test"}
                  :convert-to-llm (fn [messages] messages)}
          result (await (loop/run-loop context config emit stream-fn))]
      (is (= [assistant] result)))))

(defn- stateful-stream-fn [final-messages]
  (let [index (atom -1)]
    (fn [_ _ _]
      (let [next-message (nth final-messages (swap! index inc))]
        (mock-stream next-message)))))

(deftest ^:async run-loop-execute-tool-test
  (testing "loop executes a tool call and returns the result message"
    (let [tool-call {:role :assistant
                     :content [{:type :tool-call
                                :id "call-1"
                                :name "read"
                                :arguments {:path "file.txt"}}]
                     :api "test" :provider "test" :model "test"
                     :usage {:input 0 :output 0 :cache-read 0 :cache-write 0 :total-tokens 0}
                     :stop-reason :tool-use
                     :timestamp 0}
          final {:role :assistant
                 :content [{:type :text :text "done"}]
                 :api "test" :provider "test" :model "test"
                 :usage {:input 0 :output 0 :cache-read 0 :cache-write 0 :total-tokens 0}
                 :stop-reason :stop
                 :timestamp 0}
          stream-fn (stateful-stream-fn [tool-call final])
          [emit events] (capture-emit)
          read-tool (test-tool "read" (fn [_id _args _signal _on-update]
                                        (js/Promise.resolve {:content [{:type :text :text "contents"}]
                                                             :details {}})))
          context {:system-prompt "hello"
                   :messages [{:role :user :content "hi" :timestamp 0}]
                   :tools [read-tool]}
          config {:model {:id "test" :provider "test"}
                  :convert-to-llm (fn [messages] messages)}
          result (await (loop/run-loop context config emit stream-fn))]
      (is (= 3 (count result)))
      (is (= :tool-result (:role (second result))))
      (is (some #(= :tool_execution_start (:type %)) @events))
      (is (some #(= :tool_execution_end (:type %)) @events)))))

(deftest ^:async run-loop-terminate-test
  (testing "loop terminates when all tools request termination"
    (let [assistant {:role :assistant
                     :content [{:type :tool-call
                                :id "call-1"
                                :name "stop"
                                :arguments {}}]
                     :api "test" :provider "test" :model "test"
                     :usage {:input 0 :output 0 :cache-read 0 :cache-write 0 :total-tokens 0}
                     :stop-reason :tool-use
                     :timestamp 0}
          stream-fn (fn [_ _ _] (mock-stream assistant))
          [emit events] (capture-emit)
          stop-tool (test-tool "stop" (fn [_id _args _signal _on-update]
                                        (js/Promise.resolve {:content [{:type :text :text "stopping"}]
                                                             :details {}
                                                             :terminate true})))
          context {:system-prompt "hello"
                   :messages [{:role :user :content "hi" :timestamp 0}]
                   :tools [stop-tool]}
          config {:model {:id "test" :provider "test"}
                  :convert-to-llm (fn [messages] messages)}
          result (await (loop/run-loop context config emit stream-fn))]
      (is (= 2 (count result)))
      (is (some #(= :agent_end (:type %)) @events)))))

(deftest ^:async run-loop-missing-tool-test
  (testing "loop emits error result when tool is not found"
    (let [tool-call {:role :assistant
                     :content [{:type :tool-call
                                :id "call-1"
                                :name "missing"
                                :arguments {}}]
                     :api "test" :provider "test" :model "test"
                     :usage {:input 0 :output 0 :cache-read 0 :cache-write 0 :total-tokens 0}
                     :stop-reason :tool-use
                     :timestamp 0}
          final {:role :assistant
                 :content [{:type :text :text "done"}]
                 :api "test" :provider "test" :model "test"
                 :usage {:input 0 :output 0 :cache-read 0 :cache-write 0 :total-tokens 0}
                 :stop-reason :stop
                 :timestamp 0}
          stream-fn (stateful-stream-fn [tool-call final])
          [emit] (capture-emit)
          context {:system-prompt "hello"
                   :messages [{:role :user :content "hi" :timestamp 0}]}
          config {:model {:id "test" :provider "test"}
                  :convert-to-llm (fn [messages] messages)}
          result (await (loop/run-loop context config emit stream-fn))]
      (is (= :tool-result (:role (second result))))
      (is (true? (:is-error (second result))))
      (is (= "Tool missing not found" (-> result second :content first :text))))))

(defn- text-assistant [text]
  {:role :assistant
   :content [{:type :text :text text}]
   :api "test" :provider "test" :model "test"
   :usage {:input 0 :output 0 :cache-read 0 :cache-write 0 :total-tokens 0}
   :stop-reason :stop
   :timestamp 0})

(defn- counting-stream-fn [stream-calls messages]
  (fn [_ _ _]
    (let [next-message (nth messages @stream-calls)]
      (swap! stream-calls inc)
      (mock-stream next-message))))

(deftest ^:async run-loop-steering-messages-test
  (testing "steering messages are injected as a new turn instead of ending the agent"
    (let [stream-calls (atom 0)
          stream-fn (counting-stream-fn stream-calls [(text-assistant "first")
                                                      (text-assistant "second")])
          steering {:role :user :content "steer it" :timestamp 0}
          steering-queue (atom [steering])
          [emit events] (capture-emit)
          context {:system-prompt "hello"
                   :messages [{:role :user :content "hi" :timestamp 0}]}
          config {:model {:id "test" :provider "test"}
                  :convert-to-llm (fn [messages] messages)
                  :get-steering-messages (fn [] (let [queued @steering-queue]
                                                  (reset! steering-queue [])
                                                  queued))}
          result (await (loop/run-loop context config emit stream-fn))]
      (is (= 2 @stream-calls))
      (is (= [:assistant :user :assistant] (mapv :role result)))
      (is (= "steer it" (:content (second result))))
      (is (= 2 (count (filter #(= :turn_start (:type %)) @events))))
      (is (some #(= :agent_end (:type %)) @events)))))

(deftest ^:async run-loop-follow-up-messages-test
  (testing "follow-up messages continue the loop when no steering is queued"
    (let [stream-calls (atom 0)
          stream-fn (counting-stream-fn stream-calls [(text-assistant "first")
                                                      (text-assistant "second")])
          follow-up {:role :user :content "and more" :timestamp 0}
          follow-up-queue (atom [follow-up])
          [emit events] (capture-emit)
          context {:system-prompt "hello"
                   :messages [{:role :user :content "hi" :timestamp 0}]}
          config {:model {:id "test" :provider "test"}
                  :convert-to-llm (fn [messages] messages)
                  :get-steering-messages (fn [] [])
                  :get-follow-up-messages (fn [] (let [queued @follow-up-queue]
                                                   (reset! follow-up-queue [])
                                                   queued))}
          result (await (loop/run-loop context config emit stream-fn))]
      (is (= 2 @stream-calls))
      (is (= [:assistant :user :assistant] (mapv :role result)))
      (is (= "and more" (:content (second result))))
      (is (some #(= :agent_end (:type %)) @events)))))

(deftest ^:async run-loop-abort-before-tool-execution-test
  (testing "an abort signalled during streaming halts the loop before tools run"
    (let [controller (js/AbortController.)
          tool-call {:role :assistant
                     :content [{:type :tool-call
                                :id "call-1"
                                :name "read"
                                :arguments {:path "file.txt"}}]
                     :api "test" :provider "test" :model "test"
                     :usage {:input 0 :output 0 :cache-read 0 :cache-write 0 :total-tokens 0}
                     :stop-reason :tool-use
                     :timestamp 0}
          stream #js {:next (fn [] (js/Promise.resolve #js {:done true}))
                      :result (fn []
                                (.abort controller)
                                (js/Promise.resolve tool-call))}
          tool-called? (atom false)
          read-tool (test-tool "read" (fn [_id _args _signal _on-update]
                                        (reset! tool-called? true)
                                        (js/Promise.resolve {:content [{:type :text :text "contents"}]
                                                             :details {}})))
          [emit events] (capture-emit)
          context {:system-prompt "hello"
                   :messages [{:role :user :content "hi" :timestamp 0}]
                   :tools [read-tool]}
          config {:model {:id "test" :provider "test"}
                  :convert-to-llm (fn [messages] messages)
                  :abort-signal (.-signal controller)}
          result (await (loop/run-loop context config emit (fn [_ _ _] stream)))]
      (is (false? @tool-called?))
      (is (not-any? #(= :tool_execution_start (:type %)) @events))
      (is (some #(= :turn_end (:type %)) @events))
      (is (some #(= :agent_end (:type %)) @events))
      (is (= 1 (count result))))))

(deftest ^:async run-loop-abort-after-tool-batch-test
  (testing "an abort signalled inside a tool halts the loop before the next stream"
    (let [controller (js/AbortController.)
          stream-calls (atom 0)
          tool-call {:role :assistant
                     :content [{:type :tool-call
                                :id "call-1"
                                :name "read"
                                :arguments {}}]
                     :api "test" :provider "test" :model "test"
                     :usage {:input 0 :output 0 :cache-read 0 :cache-write 0 :total-tokens 0}
                     :stop-reason :tool-use
                     :timestamp 0}
          stream-fn (counting-stream-fn stream-calls [tool-call
                                                      (text-assistant "never")])
          read-tool (test-tool "read" (fn [_id _args _signal _on-update]
                                        (.abort controller)
                                        (js/Promise.resolve {:content [{:type :text :text "contents"}]
                                                             :details {}})))
          [emit events] (capture-emit)
          context {:system-prompt "hello"
                   :messages [{:role :user :content "hi" :timestamp 0}]
                   :tools [read-tool]}
          config {:model {:id "test" :provider "test"}
                  :convert-to-llm (fn [messages] messages)
                  :abort-signal (.-signal controller)}
          result (await (loop/run-loop context config emit stream-fn))]
      (is (= 1 @stream-calls))
      (is (= [:assistant :tool-result] (mapv :role result)))
      (is (some #(= :agent_end (:type %)) @events)))))

(deftest ^:async run-loop-abort-unblocks-signal-ignoring-tool-test
  (testing "an abort settles the loop even when an in-flight tool never settles"
    (let [controller (js/AbortController.)
          stream-calls (atom 0)
          tool-call {:role :assistant
                     :content [{:type :tool-call
                                :id "call-1"
                                :name "hung"
                                :arguments {}}]
                     :api "test" :provider "test" :model "test"
                     :usage {:input 0 :output 0 :cache-read 0 :cache-write 0 :total-tokens 0}
                     :stop-reason :tool-use
                     :timestamp 0}
          stream-fn (counting-stream-fn stream-calls [tool-call
                                                      (text-assistant "never")])
          hung-tool (test-tool "hung" (fn [_id _args _signal _on-update]
                                        (js/setTimeout #(.abort controller) 0)
                                        (js/Promise. (fn [_resolve _reject]))))
          [emit events] (capture-emit)
          context {:system-prompt "hello"
                   :messages [{:role :user :content "hi" :timestamp 0}]
                   :tools [hung-tool]}
          config {:model {:id "test" :provider "test"}
                  :convert-to-llm (fn [messages] messages)
                  :abort-signal (.-signal controller)}
          result (await (loop/run-loop context config emit stream-fn))]
      (is (= 1 @stream-calls))
      (is (= [:assistant :tool-result] (mapv :role result)))
      (is (true? (:is-error (second result))))
      (is (some #(= :agent_end (:type %)) @events)))))

(deftest ^:async run-loop-abort-signal-threaded-test
  (testing "the abort signal reaches stream-fn options and tool execute"
    (let [controller (js/AbortController.)
          seen-options (atom nil)
          seen-tool-signal (atom nil)
          tool-call {:role :assistant
                     :content [{:type :tool-call
                                :id "call-1"
                                :name "read"
                                :arguments {}}]
                     :api "test" :provider "test" :model "test"
                     :usage {:input 0 :output 0 :cache-read 0 :cache-write 0 :total-tokens 0}
                     :stop-reason :tool-use
                     :timestamp 0}
          stream-fn (fn [_ _ options]
                      (reset! seen-options options)
                      (mock-stream tool-call))
          read-tool (test-tool "read" (fn [_id _args signal _on-update]
                                        (reset! seen-tool-signal signal)
                                        (.abort controller)
                                        (js/Promise.resolve {:content [{:type :text :text "contents"}]
                                                             :details {}
                                                             :terminate true})))
          [emit] (capture-emit)
          context {:system-prompt "hello"
                   :messages [{:role :user :content "hi" :timestamp 0}]
                   :tools [read-tool]}
          config {:model {:id "test" :provider "test"}
                  :convert-to-llm (fn [messages] messages)
                  :abort-signal (.-signal controller)}]
      (await (loop/run-loop context config emit stream-fn))
      (is (identical? (.-signal controller) (:signal @seen-options)))
      (is (identical? (.-signal controller) @seen-tool-signal)))))
