(ns eta-mu.coding.shape.tool
  "JS↔CLJS converters for coding-agent tool definitions and results."
  (:require [eta-mu.runtime.shape.message :as message-shape]))

;; ============================================================================
;; Helpers
;; ============================================================================

(defn- first-present
  [m keys]
  (when-let [key (first (filter #(contains? m %) keys))]
    (get m key)))

(defn- keyword-or-nil
  [value]
  (cond
    (keyword? value) value
    (string? value) (keyword value)
    :else nil))

;; ============================================================================
;; Tool Definition
;; ============================================================================

(defn tool-definition-from-external
  "Convert an external tool definition to internal form."
  [tool]
  {:name (:name tool)
   :label (:label tool)
   :description (:description tool)
   :prompt-snippet (first-present tool [:promptSnippet :prompt-snippet])
   :prompt-guidelines (first-present tool [:promptGuidelines :prompt-guidelines])
   :parameters (or (:parameters tool) {})
   :execution-mode (keyword-or-nil (first-present tool [:executionMode :execution-mode]))
   :render-shell (keyword-or-nil (first-present tool [:renderShell :render-shell]))})

(defn tool-definition->external
  "Convert an internal tool definition to external form."
  [tool]
  (cond-> {:name (:name tool)
           :label (:label tool)
           :description (:description tool)
           :parameters (:parameters tool)}
    (:prompt-snippet tool) (assoc :promptSnippet (:prompt-snippet tool))
    (:prompt-guidelines tool) (assoc :promptGuidelines (:prompt-guidelines tool))
    (:execution-mode tool) (assoc :executionMode (name (:execution-mode tool)))
    (:render-shell tool) (assoc :renderShell (name (:render-shell tool)))))

;; ============================================================================
;; Tool Input
;; ============================================================================

(defn tool-input-from-external
  "Convert external tool input to internal form based on tool name."
  [tool-name input]
  (case (keyword-or-nil tool-name)
    :edit (let [edits (or (:edits input) [])
                normalized (if (and (:oldText input) (:newText input) (empty? edits))
                             [{:old-text (:oldText input)
                               :new-text (:newText input)}]
                             (mapv (fn [e]
                                     {:old-text (or (:oldText e) (:old-text e))
                                      :new-text (or (:newText e) (:new-text e))})
                                   edits))]
            {:path (or (:path input) (:file_path input))
             :edits normalized})
    :read (cond-> {}
            (:path input) (assoc :path (:path input))
            (:file_path input) (assoc :path (:file_path input))
            (:offset input) (assoc :offset (:offset input))
            (:limit input) (assoc :limit (:limit input)))
    :bash (cond-> {}
            (:command input) (assoc :command (:command input))
            (:timeout input) (assoc :timeout (:timeout input)))
    :write (cond-> {}
            (:path input) (assoc :path (:path input))
            (:content input) (assoc :content (:content input)))
    :grep (cond-> {}
            (:pattern input) (assoc :pattern (:pattern input))
            (:path input) (assoc :path (:path input))
            (:glob input) (assoc :glob (:glob input))
            (:ignoreCase input) (assoc :ignore-case (:ignoreCase input))
            (:ignore_case input) (assoc :ignore-case (:ignore_case input))
            (:literal input) (assoc :literal (:literal input))
            (:context input) (assoc :context (:context input))
            (:limit input) (assoc :limit (:limit input)))
    :find (cond-> {}
            (:pattern input) (assoc :pattern (:pattern input))
            (:path input) (assoc :path (:path input))
            (:limit input) (assoc :limit (:limit input)))
    :ls (cond-> {}
          (:path input) (assoc :path (:path input))
          (:limit input) (assoc :limit (:limit input)))
    input))

(defn tool-input->external
  "Convert internal tool input to external form."
  [tool-name input]
  (case (keyword tool-name)
    :edit (let [edits (:edits input)]
            (cond-> {}
              (:path input) (assoc :path (:path input))
              (seq edits) (assoc :edits
                                 (mapv (fn [e]
                                         {:oldText (:old-text e)
                                          :newText (:new-text e)})
                                       edits))))
    :read (cond-> {}
            (:path input) (assoc :path (:path input))
            (:offset input) (assoc :offset (:offset input))
            (:limit input) (assoc :limit (:limit input)))
    :bash (cond-> {}
            (:command input) (assoc :command (:command input))
            (:timeout input) (assoc :timeout (:timeout input)))
    :write (cond-> {}
            (:path input) (assoc :path (:path input))
            (:content input) (assoc :content (:content input)))
    :grep (cond-> {}
            (:pattern input) (assoc :pattern (:pattern input))
            (:path input) (assoc :path (:path input))
            (:glob input) (assoc :glob (:glob input))
            (:ignore-case input) (assoc :ignoreCase (:ignore-case input))
            (:literal input) (assoc :literal (:literal input))
            (:context input) (assoc :context (:context input))
            (:limit input) (assoc :limit (:limit input)))
    :find (cond-> {}
            (:pattern input) (assoc :pattern (:pattern input))
            (:path input) (assoc :path (:path input))
            (:limit input) (assoc :limit (:limit input)))
    :ls (cond-> {}
          (:path input) (assoc :path (:path input))
          (:limit input) (assoc :limit (:limit input)))
    input))

;; ============================================================================
;; Tool Details
;; ============================================================================

(defn tool-details-from-external
  "Convert external tool details to internal form."
  [tool-name details]
  (when details
    (case (keyword-or-nil tool-name)
      :read {:truncation (:truncation details)}
      :bash {:truncation (:truncation details)
             :full-output-path (first-present details [:fullOutputPath :full-output-path])}
      :edit {:diff (:diff details)
             :first-changed-line (first-present details [:firstChangedLine :first-changed-line])}
      :grep {:truncation (:truncation details)
             :match-limit-reached (first-present details [:matchLimitReached :match-limit-reached])
             :lines-truncated (first-present details [:linesTruncated :lines-truncated])}
      :find {:truncation (:truncation details)
             :result-limit-reached (first-present details [:resultLimitReached :result-limit-reached])}
      :ls {:truncation (:truncation details)
           :entry-limit-reached (first-present details [:entryLimitReached :entry-limit-reached])}
      details)))

(defn tool-details->external
  "Convert internal tool details to external form."
  [tool-name details]
  (when details
    (case (keyword tool-name)
      :read {:truncation (:truncation details)}
      :bash (cond-> {}
              (:truncation details) (assoc :truncation (:truncation details))
              (:full-output-path details) (assoc :fullOutputPath (:full-output-path details)))
      :edit (cond-> {}
              (:diff details) (assoc :diff (:diff details))
              (:first-changed-line details) (assoc :firstChangedLine (:first-changed-line details)))
      :grep (cond-> {}
              (:truncation details) (assoc :truncation (:truncation details))
              (:match-limit-reached details) (assoc :matchLimitReached (:match-limit-reached details))
              (:lines-truncated details) (assoc :linesTruncated (:lines-truncated details)))
      :find (cond-> {}
              (:truncation details) (assoc :truncation (:truncation details))
              (:result-limit-reached details) (assoc :resultLimitReached (:result-limit-reached details)))
      :ls (cond-> {}
            (:truncation details) (assoc :truncation (:truncation details))
            (:entry-limit-reached details) (assoc :entryLimitReached (:entry-limit-reached details)))
      details)))

;; ============================================================================
;; Tool Result
;; ============================================================================

(defn tool-result-from-external
  "Convert an external tool result to internal form."
  [tool-name result]
  {:content (mapv message-shape/content-from-external (or (:content result) []))
   :is-error (boolean (:isError result))
   :details (tool-details-from-external tool-name (:details result))})

(defn tool-result->external
  "Convert an internal tool result to external form."
  [tool-name result]
  (cond-> {:content (mapv message-shape/content->external (:content result))
           :isError (:is-error result)}
    (:details result) (assoc :details (tool-details->external tool-name (:details result)))))

;; ============================================================================
;; Tool Call Descriptor
;; ============================================================================

(defn tool-call-from-external
  "Convert an external tool call to internal form."
  [call]
  {:tool-call-id (:toolCallId call)
   :tool-name (keyword-or-nil (:toolName call))
   :input (tool-input-from-external (:toolName call) (:input call))})

(defn tool-call->external
  "Convert an internal tool call to external form."
  [call]
  {:toolCallId (:tool-call-id call)
   :toolName (name (:tool-name call))
   :input (tool-input->external (:tool-name call) (:input call))})

;; ============================================================================
;; Truncation Result
;; ============================================================================

(defn truncation-from-external
  "Convert an external truncation result to internal form."
  [trunc]
  {:total-bytes (:totalBytes trunc)
   :total-lines (:totalLines trunc)
   :truncated (:truncated trunc)
   :head-truncated (:headTruncated trunc)
   :tail-truncated (:tailTruncated trunc)})

(defn truncation->external
  "Convert an internal truncation result to external form."
  [trunc]
  {:totalBytes (:total-bytes trunc)
   :totalLines (:total-lines trunc)
   :truncated (:truncated trunc)
   :headTruncated (:head-truncated trunc)
   :tailTruncated (:tail-truncated trunc)})
