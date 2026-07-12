(ns eta-mu-e2e.cross-package-extension-coding-test
  "E2E tests for cross-package interactions between extensions and coding layers.

   Exercises:
   - Extension event conversions through coding shape layers
   - Extension tool definitions round-trip through coding shape layers
   - Extension registered tools/commands/flags survive conversion"
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.coding.shape.tool :as st]
            [eta-mu.coding.shape.extension :as se]))

;; ── Extension tool definition → coding shape round-trip ──────────────────────

(deftest extension-tool-shape-roundtrip-e2e
  (testing "extension tool definition survives double conversion (ext shape -> coding shape)"
    (let [ext-tool {:name "custom_tool"
                    :label "Custom Tool"
                    :description "A custom tool"
                    :parameters {:type "object" :properties {:input {:type "string"}}}}
          ;; Extension converts to JS
          ext-js (se/tool-definition->external ext-tool)
          ;; Extension converts back from JS
          ext-clj (se/tool-definition-from-external ext-js)
          ;; Coding converts to its own JS shape
          coding-js (st/tool-definition->external ext-clj)
          ;; Coding converts back
          coding-clj (st/tool-definition-from-external coding-js)]
      ;; Identity preserved through all conversions
      (is (= "custom_tool" (:name coding-clj)))
      (is (= "Custom Tool" (:label coding-clj)))
      (is (= "A custom tool" (:description coding-clj))))))

;; ── Extension event conversion ───────────────────────────────────────────────

(deftest extension-tool-call-event-roundtrip-e2e
  (testing "tool_call event survives CLJS->JS->CLJS conversion"
    (let [event {:type :tool_call
                 :tool-call-id "call-abc"
                 :tool-name "write_file"
                 :input {:path "/tmp/test.txt" :content "hello"}
                 :parent-id "msg-1"}
          ext (se/event->external event)
          back (se/event-from-external ext)]
      (is (= :tool_call (:type back)))
      (is (= "call-abc" (:tool-call-id back)))
      (is (= "write_file" (:tool-name back)))
      (is (= "/tmp/test.txt" (get-in back [:input :path])))
      (is (= "hello" (get-in back [:input :content]))))))

(deftest extension-tool-result-event-roundtrip-e2e
  (testing "tool_result event survives CLJS->JS->CLJS conversion"
    (let [event {:type :tool_result
                 :tool-call-id "call-abc"
                 :tool-name "write_file"
                 :input {:path "/tmp/test.txt"}
                 :content [{:type :text :text "ok"}]
                 :is-error false
                 :parent-id "tc-1"}
          ext (se/event->external event)
          back (se/event-from-external ext)]
      (is (= :tool_result (:type back)))
      (is (= "call-abc" (:tool-call-id back)))
      (is (= [{:type :text :text "ok"}] (:content back)))
      (is (false? (:is-error back))))))

(deftest extension-input-event-roundtrip-e2e
  (testing "input event survives CLJS->JS->CLJS conversion"
    (let [event {:type :input
                 :text "Hello, how are you?"
                 :images []
                 :source :user}
          ext (se/event->external event)
          back (se/event-from-external ext)]
      (is (= :input (:type back)))
      (is (= "Hello, how are you?" (:text back))))))

(deftest extension-context-event-roundtrip-e2e
  (testing "context event survives CLJS->JS->CLJS conversion"
    (let [event {:type :context
                 :messages [{:role :user :content "Hello"}
                            {:role :assistant :content "Hi"}]}
          ext (se/event->external event)
          back (se/event-from-external ext)]
      (is (= :context (:type back)))
      (is (= 2 (count (:messages back)))))))

(deftest extension-before-agent-start-event-roundtrip-e2e
  (testing "before_agent_start event survives CLJS->JS->CLJS conversion"
    (let [event {:type :before_agent_start
                 :prompt "Help me code"
                 :images []
                 :system-prompt "You are helpful"}
          ext (se/event->external event)
          back (se/event-from-external ext)]
      (is (= :before_agent_start (:type back)))
      (is (= "Help me code" (:prompt back)))
      (is (= "You are helpful" (:system-prompt back))))))

;; ── Registered tool shape roundtrip ──────────────────────────────────────────

(deftest registered-tool-roundtrip-e2e
  (testing "registered tool (extension → coding) survives round-trip"
    (let [registered {:definition {:name "research_search"
                                  :label "Research Search"
                                  :description "Search sources"
                                  :parameters {:type "object" :properties {:query {:type "string"}}}}
                      :source-info {:source :extension :base-dir "/ext"}}
          ext (se/registered-tool->external registered)
          back (se/registered-tool-from-external ext)]
      (is (= "research_search" (get-in back [:definition :name])))
      (is (= "Research Search" (get-in back [:definition :label])))
      (is (= "Search sources" (get-in back [:definition :description])))
      (is (= :extension (get-in back [:source-info :source]))))))

;; ── Registered command shape roundtrip ───────────────────────────────────────

(deftest registered-command-roundtrip-e2e
  (testing "registered command survives round-trip"
    (let [command {:name "run-research"
                   :description "Run a research query"
                   :invocation-name "research"
                   :source-info {:source :extension :base-dir "/ext"}}
          ext (se/registered-command->external command)
          back (se/registered-command-from-external ext)]
      (is (= "run-research" (:name back)))
      (is (= "Run a research query" (:description back)))
      (is (= "research" (:invocation-name back))))))

;; ── Extension flag shape roundtrip ───────────────────────────────────────────

(deftest extension-flag-roundtrip-e2e
  (testing "extension flag survives round-trip"
    (let [flag {:name "verbose"
                :description "Enable verbose output"
                :type :boolean
                :default false
                :extension-path "/ext/verbose"}
          ext (se/extension-flag->external flag)
          back (se/extension-flag-from-external ext)]
      (is (= "verbose" (:name back)))
      (is (= "Enable verbose output" (:description back)))
      (is (= :boolean (:type back)))
      (is (false? (:default back)))
      (is (= "/ext/verbose" (:extension-path back))))))
