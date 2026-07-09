(ns eta-mu.turn-processor.domain.turn-test
  (:require [clojure.string :as str]
            [cljs.test :refer [deftest is testing]]
            [eta-mu.turn-processor.domain.turn :as turn]))

(def sample-tools
  [{:name "read" :label "Read" :description "Read" :parameters [:map]}
   {:name "bash" :label "Bash" :description "Bash" :parameters [:map] :execution-mode :sequential}
   {:name "grep" :label "Grep" :description "Grep" :parameters [:map]}])

(deftest tool-calls-in-message-test
  (testing "extracts tool calls from an assistant message"
    (let [msg {:role :assistant
               :content [{:type :text :text "ok"}
                         {:type :tool-call :id "c1" :name "read" :arguments {:path "a"}}]}]
      (is (= 1 (count (turn/tool-calls-in-message msg))))
      (is (= "read" (:name (first (turn/tool-calls-in-message msg)))))))
  (testing "returns [] for non-assistant message"
    (is (empty? (turn/tool-calls-in-message {:role :user :content "hi" :timestamp 0})))))

(deftest execution-mode-test
  (testing "parallel when no sequential tool or config"
    (is (= :parallel (turn/execution-mode [{:id "c1" :name "grep" :arguments {}}] sample-tools :parallel))))
  (testing "sequential when a tool is sequential"
    (is (= :sequential (turn/execution-mode [{:id "c1" :name "bash" :arguments {}}] sample-tools :parallel))))
  (testing "sequential when config is sequential"
    (is (= :sequential (turn/execution-mode [{:id "c1" :name "grep" :arguments {}}] sample-tools :sequential)))))

(deftest missing-tool-result-test
  (testing "produces an error result for unknown tool"
    (let [result (turn/missing-tool-result {:id "c1" :name "unknown" :arguments {}})]
      (is (:is-error result))
      (is (str/includes? (get-in result [:result :content 0 :text]) "unknown")))))

(deftest build-tool-result-message-test
  (testing "creates a tool-result message"
    (let [finalized {:tool-call {:id "c1" :name "read" :arguments {}}
                     :result {:content [{:type :text :text "contents"}] :details {:x 1}}
                     :is-error false}
          msg (turn/build-tool-result-message finalized)]
      (is (= :tool-result (:role msg)))
      (is (= "c1" (:tool-call-id msg)))
      (is (= "read" (:tool-name msg)))
      (is (= false (:is-error msg))))))

(deftest should-terminate-batch-test
  (testing "terminates when all results request termination"
    (is (turn/should-terminate-batch [{:result {:terminate true}}
                                        {:result {:terminate true}}])))
  (testing "does not terminate when any result is missing terminate"
    (is (not (turn/should-terminate-batch [{:result {:terminate true}}
                                           {:result {:content []}}])))))

(deftest next-action-stream-test
  (testing "next action is stream when last message is user"
    (is (= :stream (:action (turn/next-action {:messages [{:role :user :content "hi" :timestamp 0}]}))))))

(deftest next-action-execute-tools-test
  (testing "next action is execute-tools when assistant has tool calls"
    (let [context {:messages [{:role :assistant
                               :content [{:type :tool-call :id "c1" :name "read" :arguments {}}]}]}]
      (is (= :execute-tools (:action (turn/next-action context))))
      (is (= 1 (count (:tool-calls (turn/next-action context))))))))

(deftest next-action-stop-test
  (testing "next action is stop when assistant has no tool calls"
    (is (= :stop (:action (turn/next-action {:messages [{:role :assistant
                                                          :content [{:type :text :text "done"}]}]}))))))
