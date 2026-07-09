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
