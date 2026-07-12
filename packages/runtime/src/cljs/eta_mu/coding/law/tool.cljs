(ns eta-mu.coding.law.tool
  "Malli schemas for coding-agent tool inputs, outputs, and dispatch descriptors."
  (:require [malli.core :as m]
            [malli.error :as me]
            [malli.registry :as mr]
            [eta-mu.runtime.law.content-part :as content]))

;; ============================================================================
;; Tool Names
;; ============================================================================

(def tool-name-schema
  [:enum :read :bash :edit :write :grep :find :ls])

(def all-tool-names
  #{:read :bash :edit :write :grep :find :ls})

;; ============================================================================
;; Tool Input Schemas
;; ============================================================================

(def read-input-schema
  [:map
   [:path [:string {:min 1}]]
   [:offset {:optional true} [:int {:min 1}]]
   [:limit {:optional true} [:int {:min 1}]]])

(def bash-input-schema
  [:map
   [:command [:string {:min 1}]]
   [:timeout {:optional true} [:int {:min 1}]]])

(def replace-edit-schema
  [:map
   [:old-text [:string {:min 1}]]
   [:new-text string?]])

(def edit-input-schema
  [:map
   [:path [:string {:min 1}]]
   [:edits [:vector {:min 1} replace-edit-schema]]])

(def write-input-schema
  [:map
   [:path [:string {:min 1}]]
   [:content string?]])

(def grep-input-schema
  [:map
   [:pattern [:string {:min 0}]]
   [:path {:optional true} [:string {:min 1}]]
   [:glob {:optional true} [:string {:min 1}]]
   [:ignore-case {:optional true} boolean?]
   [:literal {:optional true} boolean?]
   [:context {:optional true} [:int {:min 0}]]
   [:limit {:optional true} [:int {:min 1}]]])

(def find-input-schema
  [:map
   [:pattern [:string {:min 1}]]
   [:path {:optional true} [:string {:min 1}]]
   [:limit {:optional true} [:int {:min 1}]]])

(def ls-input-schema
  [:map
   [:path {:optional true} [:string {:min 1}]]
   [:limit {:optional true} [:int {:min 1}]]])

(def tool-input-schema
  [:or read-input-schema bash-input-schema edit-input-schema
       write-input-schema grep-input-schema find-input-schema ls-input-schema])

;; ============================================================================
;; Truncation
;; ============================================================================

(def truncation-result-schema
  [:map
   [:total-bytes [:int {:min 0}]]
   [:total-lines [:int {:min 0}]]
   [:truncated boolean?]
   [:head-truncated boolean?]
   [:tail-truncated boolean?]])

;; ============================================================================
;; Tool Details
;; ============================================================================

(def read-tool-details-schema
  [:map
   [:truncation {:optional true} truncation-result-schema]])

(def bash-tool-details-schema
  [:map
   [:truncation {:optional true} truncation-result-schema]
   [:full-output-path {:optional true} [:string {:min 1}]]])

(def edit-tool-details-schema
  [:map
   [:diff [:string {:min 0}]]
   [:first-changed-line {:optional true} [:int {:min 1}]]])

(def grep-tool-details-schema
  [:map
   [:truncation {:optional true} truncation-result-schema]
   [:match-limit-reached {:optional true} [:int {:min 0}]]
   [:lines-truncated {:optional true} boolean?]])

(def find-tool-details-schema
  [:map
   [:truncation {:optional true} truncation-result-schema]
   [:result-limit-reached {:optional true} [:int {:min 0}]]])

(def ls-tool-details-schema
  [:map
   [:truncation {:optional true} truncation-result-schema]
   [:entry-limit-reached {:optional true} [:int {:min 0}]]])

(def tool-details-schema
  [:or read-tool-details-schema bash-tool-details-schema edit-tool-details-schema
       grep-tool-details-schema find-tool-details-schema ls-tool-details-schema])

;; ============================================================================
;; Tool Result
;; ============================================================================

(def tool-result-schema
  [:map
   [:content [:vector content/input-content-schema]]
   [:is-error boolean?]
   [:details {:optional true} tool-details-schema]])

;; ============================================================================
;; Tool Call Descriptor
;; ============================================================================

(def tool-call-descriptor-schema
  [:map
   [:tool-call-id [:string {:min 1}]]
   [:tool-name tool-name-schema]
   [:input tool-input-schema]])

;; ============================================================================
;; Tool Definition
;; ============================================================================

(def tool-definition-schema
  [:map
   [:name [:string {:min 1}]]
   [:label [:string {:min 1}]]
   [:description [:string {:min 1}]]
   [:prompt-snippet {:optional true} [:string {:min 1}]]
   [:prompt-guidelines {:optional true} [:vector [:string {:min 1}]]]
   [:parameters map?]
   [:execution-mode {:optional true} [:enum :sequential :parallel]]
   [:render-shell {:optional true} [:enum :default :self]]])

;; ============================================================================
;; Tool Manager State
;; ============================================================================

(def tool-state-schema
  [:map
   [:active-tools [:vector [:string {:min 1}]]]
   [:all-tool-names [:vector [:string {:min 1}]]]])

;; ============================================================================
;; Registry
;; ============================================================================

(def registry
  (mr/composite-registry
   m/default-registry
   {"ToolName" tool-name-schema
    "ReadInput" read-input-schema
    "BashInput" bash-input-schema
    "EditInput" edit-input-schema
    "WriteInput" write-input-schema
    "GrepInput" grep-input-schema
    "FindInput" find-input-schema
    "LsInput" ls-input-schema
    "ToolInput" tool-input-schema
    "TruncationResult" truncation-result-schema
    "ReadToolDetails" read-tool-details-schema
    "BashToolDetails" bash-tool-details-schema
    "EditToolDetails" edit-tool-details-schema
    "GrepToolDetails" grep-tool-details-schema
    "FindToolDetails" find-tool-details-schema
    "LsToolDetails" ls-tool-details-schema
    "ToolDetails" tool-details-schema
    "ToolResult" tool-result-schema
    "ToolCallDescriptor" tool-call-descriptor-schema
    "ToolDefinition" tool-definition-schema
    "ToolState" tool-state-schema}))

(defn schema
  "Return a named schema from the tool registry."
  [name]
  [:ref name])

(defn validator
  "Return a validator for a named schema from the tool registry."
  [name]
  (m/validator (schema name) {:registry registry}))

(defn explain
  "Return a human-oriented explanation for value against a named schema."
  [name value]
  (some-> (m/explain (schema name) value {:registry registry})
          (me/humanize)))

(defn valid-tool-input?
  "Return true when value is a valid tool input."
  [tool-name value]
  (let [input-schema (case tool-name
                       :read read-input-schema
                       :bash bash-input-schema
                       :edit edit-input-schema
                       :write write-input-schema
                       :grep grep-input-schema
                       :find find-input-schema
                       :ls ls-input-schema)]
    (m/validate input-schema value)))

(defn valid-tool-definition?
  "Return true when value is a valid tool definition."
  [value]
  (m/validate tool-definition-schema value))

(defn valid-tool-result?
  "Return true when value is a valid tool result."
  [value]
  (m/validate tool-result-schema value))
