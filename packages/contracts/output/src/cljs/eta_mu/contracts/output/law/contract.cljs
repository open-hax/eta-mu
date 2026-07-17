(ns eta-mu.contracts.output.law.contract
  "Malli schemas for the eta-mu output contract gate.
   These mirror the TypeScript contracts in
   packages/legacy/output-contract-gate/src/types.ts, adapted to idiomatic
   ClojureScript data with kebab-case keys and keyword enumerations where the
   legacy compiler normalizes EDN keywords.

   No raw JS interop is used in this namespace."
  (:require [malli.core :as m]
            [malli.error :as me]))

;; ============================================================
;; Primitive helpers
;; ============================================================

(def unit-interval
  "A number in the closed interval [0, 1]."
  [:and number? [:>= 0] [:<= 1]])

(def non-empty-string
  "A string with at least one character."
  [:string {:min 1}])

;; ============================================================
;; Contract building blocks
;; ============================================================

(def contract-section-schema
  [:map
   [:id non-empty-string]
   [:heading non-empty-string]
   [:required boolean?]
   [:order int?]
   [:cardinality [:enum :one :many]]
   [:allowed-node-types [:vector non-empty-string]]
   [:local-rule-ids {:optional true} [:vector non-empty-string]]])

(def contract-rule-schema
  [:map
   [:id non-empty-string]
   [:kind non-empty-string]
   [:check non-empty-string]
   [:section-id {:optional true} non-empty-string]
   [:min {:optional true} int?]
   [:max {:optional true} int?]
   [:exactly {:optional true} int?]])

(def repair-template-schema
  [:map
   [:id non-empty-string]
   [:when-rule-id non-empty-string]
   [:text non-empty-string]])

(def review-criterion-schema
  [:map
   [:id non-empty-string]
   [:weight unit-interval]])

(def review-criterion-score-schema
  [:map
   [:id non-empty-string]
   [:weight unit-interval]
   [:score unit-interval]
   [:note string?]])

(def review-policy-schema
  [:map
   [:enabled boolean?]
   [:reviewer-family {:optional true} non-empty-string]
   [:threshold unit-interval]
   [:criteria [:vector review-criterion-schema]]])

(def arbitration-form-schema
  "An arbitration clause is kept as a normalized EDN list form."
  [:sequential any?])

;; ============================================================
;; Normalized contract
;; ============================================================

(def normalized-contract-schema
  [:map
   [:name non-empty-string]
   [:version non-empty-string]
   [:target-format non-empty-string]
   [:target-ast non-empty-string]
   [:target-root non-empty-string]
   [:repair-max-retries int?]
   [:sections [:vector {:min 1} contract-section-schema]]
   [:sections-by-id [:map-of non-empty-string contract-section-schema]]
   [:sections-by-heading [:map-of non-empty-string contract-section-schema]]
   [:rules [:vector contract-rule-schema]]
   [:rules-by-id [:map-of non-empty-string contract-rule-schema]]
   [:repair-templates [:vector repair-template-schema]]
   [:repair-templates-by-rule-id [:map-of non-empty-string [:vector repair-template-schema]]]
   [:review review-policy-schema]
   [:arbitration [:sequential arbitration-form-schema]]])

;; ============================================================
;; Markdown AST and extracted document
;; ============================================================

(def ^:private markdown-node-map
  [:map
   [:type non-empty-string]
   [:depth {:optional true} int?]
   [:value {:optional true} string?]
   [:ordered {:optional true} boolean?]
   [:children {:optional true} [:vector [:ref ::markdown-node]]]])

(def markdown-node-schema
  "Recursive Malli schema for a single MDAST-compatible markdown node."
  [:schema
   {:registry {::markdown-node markdown-node-map}}
   [:ref ::markdown-node]])

(def markdown-root-schema
  "Malli schema for the root of an MDAST-compatible markdown tree."
  [:schema
   {:registry {::markdown-node markdown-node-map
               ::markdown-root [:map
                                [:type [:= :root]]
                                [:children [:vector [:ref ::markdown-node]]]]}}
   [:ref ::markdown-root]])

(def extracted-section-schema
  [:map
   [:heading non-empty-string]
   [:nodes [:vector markdown-node-schema]]])

(def extracted-document-schema
  [:map
   [:ast markdown-root-schema]
   [:preface-nodes [:vector markdown-node-schema]]
   [:sections [:vector extracted-section-schema]]])

;; ============================================================
;; Validation, failure, and artifact reports
;; ============================================================

(def validation-failure-schema
  [:map
   [:rule-id non-empty-string]
   [:message non-empty-string]
   [:section-id {:optional true} non-empty-string]
   [:heading {:optional true} non-empty-string]
   [:expected {:optional true} map?]
   [:actual {:optional true} map?]])

(def validation-result-schema
  [:map
   [:ok boolean?]
   [:sections [:vector extracted-section-schema]]
   [:failures [:vector validation-failure-schema]]])

(def failure-report-schema
  [:map
   [:contract non-empty-string]
   [:version non-empty-string]
   [:stage [:= :structure]]
   [:ok boolean?]
   [:failures [:vector validation-failure-schema]]])

(def artifact-bundle-schema
  [:map
   [:root non-empty-string]
   [:run-id non-empty-string]
   [:dir non-empty-string]
   [:files [:map-of non-empty-string non-empty-string]]])

;; ============================================================
;; Review and generation reports
;; ============================================================

(def review-report-schema
  [:map
   [:stage [:= :review]]
   [:reviewer [:enum :stub :gpt]]
   [:ok boolean?]
   [:threshold unit-interval]
   [:overall-score unit-interval]
   [:criteria [:vector review-criterion-score-schema]]
   [:deltas [:vector string?]]
   [:limitations [:vector string?]]
   [:generated-at non-empty-string]
   [:model-id {:optional true} non-empty-string]
   [:session-turns {:optional true} int?]])

(def gpt-review-config-schema
  [:map
   [:model {:optional true} non-empty-string]
   [:base-url {:optional true} non-empty-string]
   [:api-key {:optional true} non-empty-string]
   [:session-history {:optional true}
    [:vector
     [:map
      [:role [:enum :user :assistant]]
      [:content non-empty-string]]]]
   [:max-session-turns {:optional true} int?]
   [:temperature {:optional true} number?]
   [:fallback-to-stub {:optional true} boolean?]])

(def gpt-review-message-schema
  [:map
   [:role [:enum :system :user :assistant]]
   [:content non-empty-string]])

(def generation-mode-schema
  [:enum :fixture-valid :fixture-invalid :openai-chat])

(def generation-report-schema
  [:map
   [:stage [:= :generate]]
   [:generator generation-mode-schema]
   [:ok boolean?]
   [:attempt int?]
   [:repair-prompt-applied boolean?]
   [:model {:optional true} non-empty-string]
   [:base-url {:optional true} non-empty-string]
   [:temperature {:optional true} number?]
   [:prompt-summary [:map
                     [:required-headings [:vector non-empty-string]]
                     [:task-word-count int?]]]
   [:limitations [:vector string?]]
   [:generated-at non-empty-string]])

(def repair-attempt-record-schema
  [:map
   [:attempt int?]
   [:candidate-markdown non-empty-string]
   [:report failure-report-schema]
   [:repair-prompt non-empty-string]])

;; ============================================================
;; Qualified schema registry
;; ============================================================

(def schema-registry
  "Lookup map of qualified keywords to their Malli schemas."
  {::contract-section contract-section-schema
   ::contract-rule contract-rule-schema
   ::repair-template repair-template-schema
   ::review-criterion review-criterion-schema
   ::review-criterion-score review-criterion-score-schema
   ::review-policy review-policy-schema
   ::arbitration-form arbitration-form-schema
   ::normalized-contract normalized-contract-schema
   ::markdown-node markdown-node-schema
   ::markdown-root markdown-root-schema
   ::extracted-section extracted-section-schema
   ::extracted-document extracted-document-schema
   ::validation-failure validation-failure-schema
   ::validation-result validation-result-schema
   ::failure-report failure-report-schema
   ::artifact-bundle artifact-bundle-schema
   ::review-report review-report-schema
   ::gpt-review-config gpt-review-config-schema
   ::gpt-review-message gpt-review-message-schema
   ::generation-mode generation-mode-schema
   ::generation-report generation-report-schema
   ::repair-attempt-record repair-attempt-record-schema})

;; ============================================================
;; Validation helpers
;; ============================================================

(defn valid?
  "Return true when value satisfies schema."
  [schema value]
  (m/validate schema value))

(defn explain
  "Return a human-oriented explanation map for value against schema."
  [schema value]
  (some-> (m/explain schema value)
          (me/humanize)))

(defn validate!
  "Return value when schema-valid, otherwise throw an ex-info."
  [schema value label]
  (if (valid? schema value)
    value
    (throw (ex-info (str "Invalid output-contract-gate " label)
                    {:label label
                     :errors (explain schema value)
                     :value value}))))
