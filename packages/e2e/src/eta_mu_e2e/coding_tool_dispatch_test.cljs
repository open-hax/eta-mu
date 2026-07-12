(ns eta-mu-e2e.coding-tool-dispatch-test
  "E2E tests for tool definition, validation, and shape round-trip across coding layers.

   Exercises:
   - domain/tool.cljs tool definitions, validation, state management
   - shape/tool.cljs JS<->CLJS round-trip fidelity
   - Cross-layer: tool definition → shape convert → validate → result shape"
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.coding.domain.tool :as dt]
            [eta-mu.coding.shape.tool :as st]))

;; ── Tool definition creation ─────────────────────────────────────────────────

(deftest make-tool-definition-e2e
  (testing "make-tool-definition produces a valid tool definition"
    (let [tool (dt/make-tool-definition
                "my_read" "My Read"
                "Read the contents of a file"
                {:type "object" :properties {:path {:type "string"}} :required ["path"]}
                :prompt-snippet "Reading a file from disk"
                :execution-mode :sequential)]
      (is (= "my_read" (:name tool)))
      (is (= "My Read" (:label tool)))
      (is (= "Read the contents of a file" (:description tool)))
      (is (= :sequential (:execution-mode tool)))
      (is (= "Reading a file from disk" (:prompt-snippet tool))))))

(deftest tool-display-name-e2e
  (testing "tool-display-name returns label or name"
    (let [with-label (dt/make-tool-definition "read" "Read File" "desc" {:type "object"})
          without-label (dt/make-tool-definition "bash" nil "desc" {:type "object"})]
      (is (= "Read File" (dt/tool-display-name with-label)))
      (is (= "bash" (dt/tool-display-name without-label))))))

(deftest tool-execution-mode-default-e2e
  (testing "default execution mode is sequential"
    (let [tool (dt/make-tool-definition "t" "T" "d" {:type "object"})]
      (is (= :sequential (dt/tool-execution-mode tool))))))

;; ── Built-in tool definitions ────────────────────────────────────────────────

(deftest get-tool-definition-builtin-e2e
  (testing "built-in tools are accessible by name"
    (let [read-tool (dt/get-tool-definition "read")]
      (is (some? read-tool))
      (is (= "read" (:name read-tool)))
      (is (string? (:description read-tool)))))

  (testing "unknown tool returns nil"
    (is (nil? (dt/get-tool-definition "nonexistent_tool")))))

(deftest tool-names-for-set-e2e
  (testing "tool-names-for-set returns correct subsets"
    (let [coding-tools (dt/tool-names-for-set :coding)
          read-only-tools (dt/tool-names-for-set :read-only)
          all-tools (dt/tool-names-for-set :all)]
      (is (set? coding-tools))
      (is (set? read-only-tools))
      (is (set? all-tools))
      ;; read-only is a subset of all
      (is (every? all-tools read-only-tools))
      ;; coding is a subset of all
      (is (every? all-tools coding-tools)))))

;; ── Tool state management ────────────────────────────────────────────────────

(deftest make-tool-state-default-e2e
  (testing "default tool state includes coding tools"
    (let [state (dt/make-tool-state)
          active (dt/get-active-tools state)]
      (is (set? active))
      (is (contains? active "read"))
      (is (contains? active "bash")))))

(deftest make-tool-state-custom-e2e
  (testing "custom tool state with specific tools"
    (let [state (dt/make-tool-state ["read" "bash"])
          active (dt/get-active-tools state)]
      (is (= #{"read" "bash"} active)))))

(deftest set-active-tools-e2e
  (testing "set-active-tools replaces the active set"
    (let [state (dt/make-tool-state)
          new-state (dt/set-active-tools state ["read"])
          active (dt/get-active-tools new-state)]
      (is (= #{"read"} active)))))

(deftest is-tool-active-e2e
  (testing "is-tool-active? checks membership"
    (let [state (dt/make-tool-state ["read" "bash"])]
      (is (true? (dt/is-tool-active? state "read")))
      (is (false? (dt/is-tool-active? state "write"))))))

(deftest get-active-tool-definitions-e2e
  (testing "get-active-tool-definitions returns definitions for active tools"
    (let [state (dt/make-tool-state ["read"])
          defs (dt/get-active-tool-definitions state)]
      (is (= 1 (count defs)))
      (is (= "read" (:name (first defs)))))))

;; ── Tool input normalization ─────────────────────────────────────────────────

(deftest normalize-tool-input-e2e
  (testing "normalize-tool-input handles aliases for read"
    (let [input {:file_path "/tmp/test.txt"}
          normalized (dt/normalize-tool-input "read" input)]
      ;; file_path should be aliased to path
      (is (contains? normalized :path))
      (is (= "/tmp/test.txt" (:path normalized)))))

  (testing "normalize-tool-input passes through unknown tools"
    (let [input {:custom "value"}
          normalized (dt/normalize-tool-input "unknown_tool" input)]
      (is (= {:custom "value"} normalized)))))

;; ── Tool validation ──────────────────────────────────────────────────────────

(deftest validate-tool-call-e2e
  (testing "valid tool call returns nil"
    (let [result (dt/validate-tool-call {:tool-name "read"
                                         :input {:path "/tmp/test.txt"}})]
      (is (nil? result))))

  (testing "unknown tool-name returns error"
    (let [result (dt/validate-tool-call {:input {:path "/tmp/test.txt"}})]
      (is (some? result))
      (is (contains? result :error)))))

;; ── Tool result creation ─────────────────────────────────────────────────────

(deftest make-tool-result-e2e
  (testing "make-tool-result wraps string content in content items"
    (let [result (dt/make-tool-result "file contents" false)]
      ;; Content is wrapped as a vector of content items
      (is (vector? (:content result)))
      (is (= 1 (count (:content result))))
      (is (= :text (:type (first (:content result)))))
      (is (= "file contents" (:text (first (:content result)))))
      (is (false? (:is-error result)))))

  (testing "make-error-result creates an error result"
    (let [result (dt/make-error-result "File not found")]
      (is (vector? (:content result)))
      (is (= "File not found" (:text (first (:content result)))))
      (is (true? (:is-error result))))))

(deftest make-text-result-e2e
  (testing "make-text-result creates a text result"
    (let [result (dt/make-text-result "hello world")]
      (is (vector? (:content result)))
      (is (= "hello world" (:text (first (:content result)))))
      (is (false? (:is-error result))))))

;; ── Tool result truncation ───────────────────────────────────────────────────

(deftest truncate-to-bytes-e2e
  (testing "truncate-to-bytes truncates long strings"
    (let [long-str (apply str (repeat 1000 "a"))
          [truncated truncation] (dt/truncate-to-bytes long-str 100)]
      (is (= 100 (count truncated)))
      (is (some? truncation))
      (is (true? (:truncated truncation)))
      (is (= 1000 (:total-bytes truncation))))))

(deftest format-size-e2e
  (testing "format-size produces human-readable strings"
    (is (string? (dt/format-size 0)))
    (is (string? (dt/format-size 1024)))
    (is (string? (dt/format-size 1048576)))))

;; ── Shape round-trip: tool definition ────────────────────────────────────────

(deftest tool-definition-roundtrip-e2e
  (testing "tool definition survives CLJS->JS->CLJS round-trip"
    (let [tool (dt/make-tool-definition "custom_tool" "Custom Tool"
                                        "A custom tool for testing"
                                        {:type "object" :properties {:query {:type "string"}}}
                                        :prompt-snippet "Custom prompt"
                                        :execution-mode :sequential)
          ext (st/tool-definition->external tool)
          back (st/tool-definition-from-external ext)]
      (is (= "custom_tool" (:name back)))
      (is (= "Custom Tool" (:label back)))
      (is (= "A custom tool for testing" (:description back)))
      (is (= :sequential (:execution-mode back))))))

;; ── Shape round-trip: tool input ─────────────────────────────────────────────

(deftest tool-input-roundtrip-e2e
  (testing "tool input survives CLJS->JS->CLJS round-trip for read"
    (let [input {:path "/tmp/test.txt" :offset 10 :limit 50}
          ext (st/tool-input->external "read" input)
          back (st/tool-input-from-external "read" ext)]
      (is (= "/tmp/test.txt" (:path back)))
      (is (= 10 (:offset back)))
      (is (= 50 (:limit back))))))

(deftest tool-input-roundtrip-bash-e2e
  (testing "tool input survives CLJS->JS->CLJS round-trip for bash"
    (let [input {:command "echo hello" :timeout 5000}
          ext (st/tool-input->external "bash" input)
          back (st/tool-input-from-external "bash" ext)]
      (is (= "echo hello" (:command back)))
      (is (= 5000 (:timeout back))))))

;; ── Shape round-trip: tool result ────────────────────────────────────────────

(deftest tool-result-roundtrip-e2e
  (testing "tool result survives CLJS->JS->CLJS round-trip"
    (let [result {:content [{:type :text :text "file contents"}] :is-error false}
          ext (st/tool-result->external "read" result)
          back (st/tool-result-from-external "read" ext)]
      (is (= [{:type :text :text "file contents"}] (:content back)))
      (is (false? (:is-error back))))))

(deftest tool-result-roundtrip-error-e2e
  (testing "error tool result survives round-trip"
    (let [result {:content [{:type :text :text "ENOENT: no such file"}] :is-error true}
          ext (st/tool-result->external "read" result)
          back (st/tool-result-from-external "read" ext)]
      (is (= [{:type :text :text "ENOENT: no such file"}] (:content back)))
      (is (true? (:is-error back))))))

;; ── Shape round-trip: tool call ──────────────────────────────────────────────

(deftest tool-call-roundtrip-e2e
  (testing "tool call survives CLJS->JS->CLJS round-trip"
    (let [call {:tool-call-id "call-1"
                :tool-name "read"
                :input {:path "/tmp/test.txt"}
                :parent-id "m1"}
          ext (st/tool-call->external call)
          back (st/tool-call-from-external ext)]
      (is (= "call-1" (:tool-call-id back)))
      (is (= :read (:tool-name back)))
      (is (= "/tmp/test.txt" (get-in back [:input :path]))))))

;; ── Cross-layer: tool definition → validate → shape → result ─────────────────

(deftest tool-pipeline-e2e
  (testing "full pipeline: define tool -> validate call -> create result -> shape convert"
    (let [;; 1. Define a tool (already built-in)
          tool (dt/get-tool-definition "grep")
          ;; 2. Validate a call
          call {:tool-name "grep" :input {:pattern "TODO"}}
          validation (dt/validate-tool-call call)
          ;; 3. Create a result
          result (dt/make-text-result "src/core.clj: (do ;; TODO)")
          ;; 4. Shape convert the result
          ext (st/tool-result->external "grep" result)
          back (st/tool-result-from-external "grep" ext)]
      (is (some? tool))
      (is (nil? validation))
      (is (false? (:is-error result)))
      (is (= (:content result) (:content back)))
      (is (= (:is-error result) (:is-error back))))))
