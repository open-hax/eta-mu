(ns eta-mu.coding.domain.tool-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.coding.law.tool :as law]
            [eta-mu.coding.domain.tool :as domain]
            [eta-mu.coding.shape.tool :as shape]))

;; ============================================================================
;; Law: Schema Validation
;; ============================================================================

(deftest read-input-schema-test
  (testing "valid read input"
    (is (law/valid-tool-input? :read {:path "file.ts"}))
    (is (law/valid-tool-input? :read {:path "file.ts" :offset 1 :limit 10})))
  (testing "invalid read input"
    (is (not (law/valid-tool-input? :read {})))
    (is (not (law/valid-tool-input? :read {:path ""})))))

(deftest bash-input-schema-test
  (testing "valid bash input"
    (is (law/valid-tool-input? :bash {:command "ls"}))
    (is (law/valid-tool-input? :bash {:command "ls" :timeout 30})))
  (testing "invalid bash input"
    (is (not (law/valid-tool-input? :bash {})))
    (is (not (law/valid-tool-input? :bash {:command ""})))))

(deftest edit-input-schema-test
  (testing "valid edit input"
    (is (law/valid-tool-input? :edit {:path "file.ts"
                                      :edits [{:old-text "a" :new-text "b"}]})))
  (testing "invalid edit input"
    (is (not (law/valid-tool-input? :edit {:path "file.ts" :edits []})))
    (is (not (law/valid-tool-input? :edit {:path "file.ts"})))))

(deftest write-input-schema-test
  (testing "valid write input"
    (is (law/valid-tool-input? :write {:path "file.ts" :content "hello"})))
  (testing "invalid write input"
    (is (not (law/valid-tool-input? :write {:path "file.ts"})))
    (is (not (law/valid-tool-input? :write {:content "hello"})))))

(deftest grep-input-schema-test
  (testing "valid grep input"
    (is (law/valid-tool-input? :grep {:pattern "TODO"}))
    (is (law/valid-tool-input? :grep {:pattern "TODO" :path "src" :glob "*.ts" :ignore-case true})))
  (testing "empty pattern is valid"
    (is (law/valid-tool-input? :grep {:pattern ""}))))

(deftest find-input-schema-test
  (testing "valid find input"
    (is (law/valid-tool-input? :find {:pattern "*.ts"}))
    (is (law/valid-tool-input? :find {:pattern "**/*.ts" :path "src" :limit 100})))
  (testing "invalid find input"
    (is (not (law/valid-tool-input? :find {})))))

(deftest ls-input-schema-test
  (testing "valid ls input"
    (is (law/valid-tool-input? :ls {}))
    (is (law/valid-tool-input? :ls {:path "src"}))
    (is (law/valid-tool-input? :ls {:limit 10}))))

(deftest tool-definition-schema-test
  (testing "valid tool definition"
    (is (law/valid-tool-definition?
         {:name "my-tool"
          :label "My Tool"
          :description "Does stuff"
          :parameters {:type "object"}})))
  (testing "invalid tool definition"
    (is (not (law/valid-tool-definition? {})))))

(deftest tool-result-schema-test
  (testing "valid tool result"
    (is (law/valid-tool-result?
         {:content [{:type :text :text "ok"}]
          :is-error false})))
  (testing "invalid tool result"
    (is (not (law/valid-tool-result? {:content []})))))

;; ============================================================================
;; Domain: Tool Definitions
;; ============================================================================

(deftest make-tool-definition-test
  (testing "creates tool definition"
    (let [tool (domain/make-tool-definition "test" "Test" "A test tool" {:type "object"})]
      (is (= "test" (:name tool)))
      (is (= "Test" (:label tool)))
      (is (= "A test tool" (:description tool)))
      (is (= {:type "object"} (:parameters tool))))))

(deftest tool-display-name-test
  (testing "returns label when present"
    (is (= "Read" (domain/tool-display-name domain/read-tool-def))))
  (testing "falls back to name"
    (is (= "custom" (domain/tool-display-name {:name "custom"})))))

(deftest tool-execution-mode-test
  (testing "returns explicit mode"
    (is (= :sequential (domain/tool-execution-mode domain/bash-tool-def))))
  (testing "defaults to sequential"
    (is (= :sequential (domain/tool-execution-mode domain/read-tool-def)))))

(deftest built-in-tools-test
  (testing "has all 7 tools"
    (is (= 7 (count domain/built-in-tools))))
  (testing "all tools are valid definitions"
    (doseq [[name tool] domain/built-in-tools]
      (is (law/valid-tool-definition? tool) (str "Tool " name " should be valid")))))

;; ============================================================================
;; Domain: Tool Sets
;; ============================================================================

(deftest coding-tool-names-test
  (testing "coding tools are read, bash, edit, write"
    (is (= #{"read" "bash" "edit" "write"} domain/coding-tool-names))))

(deftest read-only-tool-names-test
  (testing "read-only tools are read, grep, find, ls"
    (is (= #{"read" "grep" "find" "ls"} domain/read-only-tool-names))))

(deftest get-tool-definition-test
  (testing "finds tool by name"
    (is (= "read" (:name (domain/get-tool-definition "read"))))
    (is (nil? (domain/get-tool-definition "nonexistent")))))

;; ============================================================================
;; Domain: Active Tool Management
;; ============================================================================

(deftest make-tool-state-test
  (testing "creates state with all tools active by default"
    (let [state (domain/make-tool-state)]
      (is (= domain/all-tool-names (domain/get-active-tools state)))))
  (testing "creates state with specific tools"
    (let [state (domain/make-tool-state #{"read" "bash"})]
      (is (= #{"read" "bash"} (domain/get-active-tools state))))))

(deftest set-active-tools-test
  (testing "sets active tools"
    (let [state (domain/make-tool-state)
          new-state (domain/set-active-tools state #{"read" "bash"})]
      (is (= #{"read" "bash"} (domain/get-active-tools new-state)))))
  (testing "filters invalid tool names"
    (let [state (domain/make-tool-state)
          new-state (domain/set-active-tools state #{"read" "nonexistent"})]
      (is (= #{"read"} (domain/get-active-tools new-state))))))

(deftest is-tool-active-test
  (testing "checks tool activity"
    (let [state (domain/make-tool-state #{"read" "bash"})]
      (is (domain/is-tool-active? state "read"))
      (is (domain/is-tool-active? state "bash"))
      (is (not (domain/is-tool-active? state "edit"))))))

(deftest get-active-tool-definitions-test
  (testing "returns definitions for active tools"
    (let [state (domain/make-tool-state #{"read" "bash"})
          defs (domain/get-active-tool-definitions state)]
      (is (= 2 (count defs)))
      (is (some #(= "read" (:name %)) defs))
      (is (some #(= "bash" (:name %)) defs)))))

;; ============================================================================
;; Domain: Tool Call Validation
;; ============================================================================

(deftest validate-tool-call-test
  (testing "valid tool call returns nil"
    (is (nil? (domain/validate-tool-call
               {:tool-name "read" :input {:path "file.ts"}}))))
  (testing "unknown tool returns error"
    (let [result (domain/validate-tool-call {:tool-name "nonexistent" :input {}})]
      (is (= :unknown-tool (:error result)))))
  (testing "invalid input returns error"
    (let [result (domain/validate-tool-call {:tool-name "read" :input {}})]
      (is (= :invalid-input (:error result))))))

;; ============================================================================
;; Domain: Input Normalization
;; ============================================================================

(deftest normalize-tool-input-edit-test
  (testing "normalizes legacy single-edit format"
    (let [input {:path "file.ts" :oldText "a" :newText "b"}
          result (domain/normalize-tool-input "edit" input)]
      (is (= "file.ts" (:path result)))
      (is (= [{:old-text "a" :new-text "b"}] (:edits result)))))
  (testing "normalizes multi-edit format"
    (let [input {:path "file.ts" :edits [{:oldText "a" :newText "b"}]}
          result (domain/normalize-tool-input "edit" input)]
      (is (= [{:old-text "a" :new-text "b"}] (:edits result))))))

(deftest normalize-tool-input-read-test
  (testing "handles file_path alias"
    (let [input {:file_path "file.ts"}
          result (domain/normalize-tool-input "read" input)]
      (is (= "file.ts" (:path result))))))

;; ============================================================================
;; Domain: Tool Result Construction
;; ============================================================================

(deftest make-tool-result-test
  (testing "creates result from string"
    (let [result (domain/make-tool-result "hello" false)]
      (is (= [{:type :text :text "hello"}] (:content result)))
      (is (false? (:is-error result)))))
  (testing "creates result from content vector"
    (let [result (domain/make-tool-result [{:type :text :text "hi"}] false)]
      (is (= [{:type :text :text "hi"}] (:content result))))))

(deftest make-error-result-test
  (testing "creates error result"
    (let [result (domain/make-error-result "something went wrong")]
      (is (true? (:is-error result)))
      (is (= "something went wrong" (get-in result [:content 0 :text]))))))

(deftest make-text-result-test
  (testing "creates text result"
    (let [result (domain/make-text-result "output")]
      (is (false? (:is-error result)))
      (is (= "output" (get-in result [:content 0 :text]))))))

;; ============================================================================
;; Domain: Truncation
;; ============================================================================

(deftest format-size-test
  (testing "formats bytes"
    (is (= "500B" (domain/format-size 500)))
    (is (= "1KB" (domain/format-size 1024)))
    (is (= "1MB" (domain/format-size (* 1024 1024))))))

(deftest truncate-to-bytes-test
  (testing "does not truncate when under limit"
    (let [[s result] (domain/truncate-to-bytes "hello" 100)]
      (is (= "hello" s))
      (is (false? (:truncated result)))))
  (testing "truncates when over limit"
    (let [[s result] (domain/truncate-to-bytes "hello world" 5)]
      (is (= "hello" s))
      (is (true? (:truncated result))))))

;; ============================================================================
;; Shape: Tool Definition Conversion
;; ============================================================================

(deftest tool-definition-from-external-test
  (testing "converts external tool definition"
    (let [result (shape/tool-definition-from-external
                  {:name "bash"
                   :label "Bash"
                   :description "Run bash"
                   :promptSnippet "Run commands"
                   :parameters {:type "object"}
                   :executionMode "parallel"})]
      (is (= "bash" (:name result)))
      (is (= :parallel (:execution-mode result))))))

(deftest tool-definition->external-test
  (testing "converts internal tool definition"
    (let [tool {:name "bash" :label "Bash" :description "Run bash"
                :parameters {:type "object"} :execution-mode :parallel}
          result (shape/tool-definition->external tool)]
      (is (= "bash" (:name result)))
      (is (= "parallel" (:executionMode result))))))

;; ============================================================================
;; Shape: Tool Input Conversion
;; ============================================================================

(deftest tool-input-from-external-edit-test
  (testing "converts external edit input"
    (let [result (shape/tool-input-from-external
                  "edit" {:path "file.ts" :edits [{:oldText "a" :newText "b"}]})]
      (is (= "file.ts" (:path result)))
      (is (= [{:old-text "a" :new-text "b"}] (:edits result)))))
  (testing "converts legacy single-edit format"
    (let [result (shape/tool-input-from-external
                  "edit" {:path "file.ts" :oldText "a" :newText "b"})]
      (is (= [{:old-text "a" :new-text "b"}] (:edits result))))))

(deftest tool-input-from-external-grep-test
  (testing "converts external grep input"
    (let [result (shape/tool-input-from-external
                  "grep" {:pattern "TODO" :path "src" :ignoreCase true})]
      (is (= "TODO" (:pattern result)))
      (is (= true (:ignore-case result))))))

(deftest tool-input->external-test
  (testing "converts internal edit input"
    (let [input {:path "file.ts" :edits [{:old-text "a" :new-text "b"}]}
          result (shape/tool-input->external :edit input)]
      (is (= [{:oldText "a" :newText "b"}] (:edits result))))))

;; ============================================================================
;; Shape: Tool Result Conversion
;; ============================================================================

(deftest tool-result-from-external-test
  (testing "converts external tool result"
    (let [result (shape/tool-result-from-external
                  "read" {:content [{:type "text" :text "ok"}]
                          :isError false})]
      (is (= [{:type :text :text "ok"}] (:content result)))
      (is (false? (:is-error result))))))

(deftest tool-result->external-test
  (testing "converts internal tool result"
    (let [result (shape/tool-result->external
                  "read" {:content [{:type :text :text "ok"}]
                          :is-error false})]
      (is (= [{:type :text :text "ok"}] (:content result)))
      (is (= false (:isError result))))))

;; ============================================================================
;; Shape: Tool Call Conversion
;; ============================================================================

(deftest tool-call-from-external-test
  (testing "converts external tool call"
    (let [result (shape/tool-call-from-external
                  {:toolCallId "tc1" :toolName "read" :input {:path "file.ts"}})]
      (is (= "tc1" (:tool-call-id result)))
      (is (= :read (:tool-name result)))
      (is (= {:path "file.ts"} (:input result))))))

(deftest tool-call->external-test
  (testing "converts internal tool call"
    (let [result (shape/tool-call->external
                  {:tool-call-id "tc1" :tool-name :read :input {:path "file.ts"}})]
      (is (= "tc1" (:toolCallId result)))
      (is (= "read" (:toolName result))))))
