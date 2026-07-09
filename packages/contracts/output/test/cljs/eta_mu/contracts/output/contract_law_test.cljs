(ns eta-mu.contracts.output.contract-law-test
  "Tests for the output contract gate Malli schemas in eta-mu.contracts.output.law.contract.
   Validates the schemas against the fixture contract from
   packages/legacy/output-contract-gate/src/fixtures.ts (represented here as
   its normalized ClojureScript IR) and rejects deliberately malformed data."
  (:require [cljs.test :refer [deftest is testing]]
            [clojure.edn :as edn]
            [eta-mu.contracts.output.law.contract :as law]
            [malli.core :as m]))

;; ============================================================
;; Fixture data: normalized IR for ETA_MU_FIVE_SECTION_CONTRACT_EDN
;; ============================================================

(def fixture-sections
  [{:id "section/signal"
    :heading "Signal"
    :required true
    :order 1
    :cardinality :one
    :allowed-node-types ["paragraph" "list" "blockquote" "code" "table"]
    :local-rule-ids []}
   {:id "section/evidence"
    :heading "Evidence"
    :required true
    :order 2
    :cardinality :one
    :allowed-node-types ["paragraph" "list" "blockquote" "code" "table"]
    :local-rule-ids []}
   {:id "section/frames"
    :heading "Frames"
    :required true
    :order 3
    :cardinality :one
    :allowed-node-types ["paragraph" "list" "blockquote"]
    :local-rule-ids []}
   {:id "section/countermoves"
    :heading "Countermoves"
    :required true
    :order 4
    :cardinality :one
    :allowed-node-types ["paragraph" "list" "blockquote"]
    :local-rule-ids []}
   {:id "section/next"
    :heading "Next"
    :required true
    :order 5
    :cardinality :one
    :allowed-node-types ["paragraph" "list"]
    :local-rule-ids ["rule/next-exactly-one-action"]}])

(def fixture-rules
  [{:id "rule/required-section"
    :kind "deterministic"
    :check "section-present"}
   {:id "rule/unique-section"
    :kind "deterministic"
    :check "section-unique"}
   {:id "rule/section-order"
    :kind "deterministic"
    :check "heading-order"}
   {:id "rule/allowed-node-types"
    :kind "deterministic"
    :check "node-type-allowlist"}
   {:id "rule/frames-cardinality"
    :kind "deterministic"
    :check "frame-count"
    :section-id "section/frames"
    :min 2
    :max 3}
   {:id "rule/next-exactly-one-action"
    :kind "deterministic"
    :check "action-count"
    :section-id "section/next"
    :exactly 1}])

(def fixture-repair-templates
  [{:id "repair/missing-section"
    :when-rule-id "rule/required-section"
    :text "Add the missing section `{{heading}}` in position {{order}}. Preserve all other sections."}
   {:id "repair/reorder-sections"
    :when-rule-id "rule/section-order"
    :text "Reorder the existing sections to exactly: Signal, Evidence, Frames, Countermoves, Next. Preserve content."}
   {:id "repair/rewrite-next"
    :when-rule-id "rule/next-exactly-one-action"
    :text "Rewrite `Next` so it contains exactly one concrete next action."}
   {:id "repair/frames-cardinality"
    :when-rule-id "rule/frames-cardinality"
    :text "Rewrite `Frames` so it contains 2–3 plausible interpretations."}])

(def fixture-review-policy
  {:enabled true
   :reviewer-family "gpt"
   :threshold 0.80
   :criteria [{:id "criterion/contract-fidelity" :weight 0.45}
              {:id "criterion/shortcutting-risk" :weight 0.20}
              {:id "criterion/context-alignment" :weight 0.20}
              {:id "criterion/actionability" :weight 0.15}]})

(def fixture-arbitration
  [['accept-if ['structure :pass] ['review-score-gte 0.80]]
   ['reject-if ['repair-retries-exhausted true] ['or :structure-failed :review-below-threshold]]])

(def fixture-normalized-contract
  {:name "eta-mu-five-section-response"
   :version "ημ.output/response-shape@0.1.0"
   :target-format "markdown"
   :target-ast "mdast"
   :target-root "document"
   :repair-max-retries 2
   :sections fixture-sections
   :sections-by-id (into {} (map #(vector (:id %) %) fixture-sections))
   :sections-by-heading (into {} (map #(vector (:heading %) %) fixture-sections))
   :rules fixture-rules
   :rules-by-id (into {} (map #(vector (:id %) %) fixture-rules))
   :repair-templates fixture-repair-templates
   :repair-templates-by-rule-id
   {"rule/required-section" [{:id "repair/missing-section"
                              :when-rule-id "rule/required-section"
                              :text "Add the missing section `{{heading}}` in position {{order}}. Preserve all other sections."}]
    "rule/section-order" [{:id "repair/reorder-sections"
                           :when-rule-id "rule/section-order"
                           :text "Reorder the existing sections to exactly: Signal, Evidence, Frames, Countermoves, Next. Preserve content."}]
    "rule/next-exactly-one-action" [{:id "repair/rewrite-next"
                                     :when-rule-id "rule/next-exactly-one-action"
                                     :text "Rewrite `Next` so it contains exactly one concrete next action."}]
    "rule/frames-cardinality" [{:id "repair/frames-cardinality"
                                :when-rule-id "rule/frames-cardinality"
                                :text "Rewrite `Frames` so it contains 2–3 plausible interpretations."}]}
   :review fixture-review-policy
   :arbitration fixture-arbitration})

(def fixture-valid-markdown-root
  {:type :root
   :children [{:type "heading"
               :depth 2
               :children [{:type "text" :value "Signal"}]}
              {:type "list"
               :ordered false
               :children [{:type "listItem"
                           :children [{:type "paragraph"
                                       :children [{:type "text"
                                                   :value "Prototype the five-section output gate."}]}]}]}
              {:type "heading"
               :depth 2
               :children [{:type "text" :value "Next"}]}
              {:type "list"
               :children [{:type "listItem"
                           :children [{:type "paragraph"
                                       :children [{:type "text"
                                                   :value "Scaffold the validator slice."}]}]}]}]})

(def fixture-extracted-document
  {:ast fixture-valid-markdown-root
   :preface-nodes []
   :sections [{:heading "Signal"
               :nodes [{:type "paragraph"
                        :children [{:type "text" :value "Signal content."}]}]}
              {:heading "Next"
               :nodes [{:type "paragraph"
                        :children [{:type "text" :value "Next content."}]}]}]})

(def fixture-validation-result
  {:ok true
   :sections (:sections fixture-extracted-document)
   :failures []})

(def fixture-failure-report
  {:contract "eta-mu-five-section-response"
   :version "ημ.output/response-shape@0.1.0"
   :stage :structure
   :ok false
   :failures [{:rule-id "rule/required-section"
               :message "Missing required section: Evidence"
               :section-id "section/evidence"
               :heading "Evidence"
               :expected {:present true}
               :actual {:present false}}]})

(def fixture-artifact-bundle
  {:root "/tmp/run-123"
   :run-id "run-123"
   :dir "/tmp/run-123/artifacts"
   :files {"input.json" "{}"
           "contract.edn" "(...)"
           "candidate.md" "# Signal"}})

(def fixture-review-report
  {:stage :review
   :reviewer :stub
   :ok true
   :threshold 0.80
   :overall-score 0.85
   :criteria [{:id "criterion/contract-fidelity"
               :weight 0.45
               :score 1.0
               :note "Structure passed."}]
   :deltas []
   :limitations []
   :generated-at "2026-06-15T00:00:00Z"
   :model-id "stub"
   :session-turns 1})

(def fixture-gpt-review-config
  {:model "gpt-test"
   :base-url "https://api.openai.example/v1"
   :api-key "sk-test"
   :session-history [{:role :user :content "Review this output."}]
   :max-session-turns 5
   :temperature 0.2
   :fallback-to-stub true})

(def fixture-generation-report
  {:stage :generate
   :generator :fixture-valid
   :ok true
   :attempt 1
   :repair-prompt-applied false
   :model "gpt-test"
   :base-url "https://api.openai.example/v1"
   :temperature 0.7
   :prompt-summary {:required-headings ["Signal" "Evidence" "Frames" "Countermoves" "Next"]
                    :task-word-count 12}
   :limitations []
   :generated-at "2026-06-15T00:00:00Z"})

(def fixture-repair-attempt-record
  {:attempt 1
   :candidate-markdown "## Signal\n- ok"
   :report fixture-failure-report
   :repair-prompt "Add the missing section."})

;; ============================================================
;; Helpers
;; ============================================================

(defn- conforming?
  [schema value]
  (m/validate schema value))

(defn- reject?
  [schema value]
  (not (conforming? schema value)))

;; ============================================================
;; Tests
;; ============================================================

(deftest normalized-contract-fixture-test
  (testing "fixture contract IR conforms to normalized-contract schema"
    (is (conforming? law/normalized-contract-schema fixture-normalized-contract))
    (is (conforming? (get law/schema-registry ::law/normalized-contract)
                     fixture-normalized-contract))))

(deftest normalized-contract-rejects-malformed-test
  (testing "normalized contract rejects missing required keys and bad types"
    (is (reject? law/normalized-contract-schema (dissoc fixture-normalized-contract :name)))
    (is (reject? law/normalized-contract-schema (assoc fixture-normalized-contract :repair-max-retries "two")))
    (is (reject? law/normalized-contract-schema (assoc fixture-normalized-contract :sections [])))
    (is (reject? law/normalized-contract-schema (assoc-in fixture-normalized-contract [:sections 0 :cardinality] :wrong)))))

(deftest contract-section-schema-test
  (testing "valid section accepted and invalid sections rejected"
    (is (conforming? law/contract-section-schema (first fixture-sections)))
    (is (reject? law/contract-section-schema (dissoc (first fixture-sections) :heading)))
    (is (reject? law/contract-section-schema (assoc (first fixture-sections) :order -1.5)))
    (is (reject? law/contract-section-schema (assoc (first fixture-sections) :cardinality :dozen)))))

(deftest contract-rule-schema-test
  (testing "valid rule accepted and invalid rules rejected"
    (is (conforming? law/contract-rule-schema (first fixture-rules)))
    (is (conforming? law/contract-rule-schema (nth fixture-rules 4)))
    (is (reject? law/contract-rule-schema (dissoc (first fixture-rules) :kind)))
    (is (reject? law/contract-rule-schema (assoc (nth fixture-rules 4) :min "2")))))

(deftest repair-template-schema-test
  (testing "repair template accepts valid and rejects malformed"
    (is (conforming? law/repair-template-schema (first fixture-repair-templates)))
    (is (reject? law/repair-template-schema (assoc (first fixture-repair-templates) :when-rule-id 42)))))

(deftest review-policy-schema-test
  (testing "review policy accepts fixture and rejects bad criteria"
    (is (conforming? law/review-policy-schema fixture-review-policy))
    (is (reject? law/review-policy-schema (assoc fixture-review-policy :threshold 1.5)))
    (is (reject? law/review-policy-schema (update fixture-review-policy :criteria conj {:id "x" :weight -0.1})))))

(deftest review-criterion-score-schema-test
  (testing "criterion score accepts valid and rejects out-of-range scores"
    (is (conforming? law/review-criterion-score-schema
                     (first (:criteria fixture-review-report))))
    (is (reject? law/review-criterion-score-schema
                 (assoc (first (:criteria fixture-review-report)) :score 1.2)))))

(deftest arbitration-form-schema-test
  (testing "arbitration forms are accepted as sequential EDN clauses"
    (is (conforming? law/arbitration-form-schema (first fixture-arbitration)))
    (is (reject? law/arbitration-form-schema {:not "sequential"}))))

(deftest markdown-node-schema-test
  (testing "recursive markdown node accepts valid AST nodes"
    (is (conforming? law/markdown-node-schema {:type "text" :value "hello"}))
    (is (conforming? law/markdown-node-schema
                     {:type "heading"
                      :depth 2
                      :children [{:type "text" :value "Signal"}]}))
    (is (reject? law/markdown-node-schema {:type ""}))
    (is (reject? law/markdown-node-schema {:type "heading" :depth "2"}))))

(deftest markdown-root-schema-test
  (testing "markdown root accepts valid root and rejects non-root types"
    (is (conforming? law/markdown-root-schema fixture-valid-markdown-root))
    (is (reject? law/markdown-root-schema (assoc fixture-valid-markdown-root :type "root")))
    (is (reject? law/markdown-root-schema (dissoc fixture-valid-markdown-root :children)))))

(deftest extracted-document-schema-test
  (testing "extracted document accepts fixture and rejects malformed nodes"
    (is (conforming? law/extracted-document-schema fixture-extracted-document))
    (is (reject? law/extracted-document-schema (assoc fixture-extracted-document :sections "nope")))))

(deftest validation-result-schema-test
  (testing "validation result accepts valid and rejects bad failure shapes"
    (is (conforming? law/validation-result-schema fixture-validation-result))
    (is (reject? law/validation-result-schema (assoc fixture-validation-result :ok "true")))))

(deftest failure-report-schema-test
  (testing "failure report accepts fixture and rejects wrong stage"
    (is (conforming? law/failure-report-schema fixture-failure-report))
    (is (reject? law/failure-report-schema (assoc fixture-failure-report :stage :review)))))

(deftest artifact-bundle-schema-test
  (testing "artifact bundle accepts valid layout and rejects non-string files"
    (is (conforming? law/artifact-bundle-schema fixture-artifact-bundle))
    (is (reject? law/artifact-bundle-schema (assoc-in fixture-artifact-bundle [:files "input.json"] 42)))))

(deftest review-report-schema-test
  (testing "review report accepts fixture and rejects invalid reviewer"
    (is (conforming? law/review-report-schema fixture-review-report))
    (is (reject? law/review-report-schema (assoc fixture-review-report :reviewer :human)))))

(deftest gpt-review-config-schema-test
  (testing "GPT review config accepts valid and rejects bad session history"
    (is (conforming? law/gpt-review-config-schema fixture-gpt-review-config))
    (is (reject? law/gpt-review-config-schema
                 (assoc-in fixture-gpt-review-config [:session-history 0 :role] :system)))))

(deftest gpt-review-message-schema-test
  (testing "GPT review message accepts valid chat messages"
    (is (conforming? law/gpt-review-message-schema {:role :system :content "You are a reviewer."}))
    (is (reject? law/gpt-review-message-schema {:role :tool :content "nope"}))))

(deftest generation-mode-schema-test
  (testing "generation mode enum accepts known modes only"
    (is (conforming? law/generation-mode-schema :fixture-valid))
    (is (conforming? law/generation-mode-schema :openai-chat))
    (is (reject? law/generation-mode-schema :unknown))))

(deftest generation-report-schema-test
  (testing "generation report accepts fixture and rejects bad prompt summary"
    (is (conforming? law/generation-report-schema fixture-generation-report))
    (is (reject? law/generation-report-schema
                 (assoc-in fixture-generation-report [:prompt-summary :task-word-count] "twelve")))))

(deftest repair-attempt-record-schema-test
  (testing "repair attempt record accepts valid and rejects bad report stage"
    (is (conforming? law/repair-attempt-record-schema fixture-repair-attempt-record))
    (is (reject? law/repair-attempt-record-schema
                 (assoc-in fixture-repair-attempt-record [:report :stage] :review)))))

(deftest schema-registry-test
  (testing "qualified keyword registry contains every exported schema"
    (is (= 22 (count law/schema-registry)))
    (is (every? qualified-keyword? (keys law/schema-registry)))
    (is (every? #(conforming? (get law/schema-registry %) (get {:eta-mu.contracts.output.law.contract/contract-section (first fixture-sections)
                                                                 :eta-mu.contracts.output.law.contract/contract-rule (first fixture-rules)
                                                                 :eta-mu.contracts.output.law.contract/repair-template (first fixture-repair-templates)
                                                                 :eta-mu.contracts.output.law.contract/review-criterion (first (:criteria fixture-review-policy))
                                                                 :eta-mu.contracts.output.law.contract/review-criterion-score (first (:criteria fixture-review-report))
                                                                 :eta-mu.contracts.output.law.contract/review-policy fixture-review-policy
                                                                 :eta-mu.contracts.output.law.contract/arbitration-form (first fixture-arbitration)
                                                                 :eta-mu.contracts.output.law.contract/normalized-contract fixture-normalized-contract
                                                                 :eta-mu.contracts.output.law.contract/markdown-node {:type "text"}
                                                                 :eta-mu.contracts.output.law.contract/markdown-root fixture-valid-markdown-root
                                                                 :eta-mu.contracts.output.law.contract/extracted-section (first (:sections fixture-extracted-document))
                                                                 :eta-mu.contracts.output.law.contract/extracted-document fixture-extracted-document
                                                                 :eta-mu.contracts.output.law.contract/validation-failure (first (:failures fixture-failure-report))
                                                                 :eta-mu.contracts.output.law.contract/validation-result fixture-validation-result
                                                                 :eta-mu.contracts.output.law.contract/failure-report fixture-failure-report
                                                                 :eta-mu.contracts.output.law.contract/artifact-bundle fixture-artifact-bundle
                                                                 :eta-mu.contracts.output.law.contract/review-report fixture-review-report
                                                                 :eta-mu.contracts.output.law.contract/gpt-review-config fixture-gpt-review-config
                                                                 :eta-mu.contracts.output.law.contract/gpt-review-message {:role :user :content "hi"}
                                                                 :eta-mu.contracts.output.law.contract/generation-mode :fixture-valid
                                                                 :eta-mu.contracts.output.law.contract/generation-report fixture-generation-report
                                                                 :eta-mu.contracts.output.law.contract/repair-attempt-record fixture-repair-attempt-record}
                                                                %))
                (keys law/schema-registry)))))

(deftest edn-round-trip-test
  (testing "fixture IR survives EDN serialization and still validates"
    (let [round-tripped (edn/read-string (pr-str fixture-normalized-contract))]
      (is (conforming? law/normalized-contract-schema round-tripped))
      (is (= fixture-normalized-contract round-tripped)))))
