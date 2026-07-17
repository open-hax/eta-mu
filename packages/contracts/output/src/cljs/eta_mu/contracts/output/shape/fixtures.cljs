(ns eta-mu.contracts.output.shape.fixtures
  "Compiled contract fixture and sample markdown responses ported from the
   TypeScript output-contract-gate fixtures.

   The contract uses keyword ids and string node types, matching the CLJS IR
   shape defined in eta-mu.contracts.output.law.contract.")

(def eta-mu-five-section-contract
  {:name "eta-mu-five-section-response"
   :version "ημ.output/response-shape@0.1.0"
   :target-format "markdown"
   :target-ast "mdast"
   :target-root "document"
   :repair-max-retries 2
   :sections
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
     :local-rule-ids ["rule/next-exactly-one-action"]}]
   :sections-by-id
   {"section/signal" {:id "section/signal"
                      :heading "Signal"
                      :required true
                      :order 1
                      :cardinality :one
                      :allowed-node-types ["paragraph" "list" "blockquote" "code" "table"]
                      :local-rule-ids []}
    "section/evidence" {:id "section/evidence"
                        :heading "Evidence"
                        :required true
                        :order 2
                        :cardinality :one
                        :allowed-node-types ["paragraph" "list" "blockquote" "code" "table"]
                        :local-rule-ids []}
    "section/frames" {:id "section/frames"
                      :heading "Frames"
                      :required true
                      :order 3
                      :cardinality :one
                      :allowed-node-types ["paragraph" "list" "blockquote"]
                      :local-rule-ids []}
    "section/countermoves" {:id "section/countermoves"
                            :heading "Countermoves"
                            :required true
                            :order 4
                            :cardinality :one
                            :allowed-node-types ["paragraph" "list" "blockquote"]
                            :local-rule-ids []}
    "section/next" {:id "section/next"
                    :heading "Next"
                    :required true
                    :order 5
                    :cardinality :one
                    :allowed-node-types ["paragraph" "list"]
                    :local-rule-ids ["rule/next-exactly-one-action"]}}
   :sections-by-heading
   {"Signal" {:id "section/signal"
              :heading "Signal"
              :required true
              :order 1
              :cardinality :one
              :allowed-node-types ["paragraph" "list" "blockquote" "code" "table"]
              :local-rule-ids []}
    "Evidence" {:id "section/evidence"
                :heading "Evidence"
                :required true
                :order 2
                :cardinality :one
                :allowed-node-types ["paragraph" "list" "blockquote" "code" "table"]
                :local-rule-ids []}
    "Frames" {:id "section/frames"
              :heading "Frames"
              :required true
              :order 3
              :cardinality :one
              :allowed-node-types ["paragraph" "list" "blockquote"]
              :local-rule-ids []}
    "Countermoves" {:id "section/countermoves"
                    :heading "Countermoves"
                    :required true
                    :order 4
                    :cardinality :one
                    :allowed-node-types ["paragraph" "list" "blockquote"]
                    :local-rule-ids []}
    "Next" {:id "section/next"
            :heading "Next"
            :required true
            :order 5
            :cardinality :one
            :allowed-node-types ["paragraph" "list"]
            :local-rule-ids ["rule/next-exactly-one-action"]}}
   :rules
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
     :section-id "section/frames"
     :check "frame-count"
     :min 2
     :max 3}
    {:id "rule/next-exactly-one-action"
     :kind "deterministic"
     :section-id "section/next"
     :check "action-count"
     :exactly 1}]
   :rules-by-id
   {"rule/required-section" {:id "rule/required-section"
                             :kind "deterministic"
                             :check "section-present"}
    "rule/unique-section" {:id "rule/unique-section"
                           :kind "deterministic"
                           :check "section-unique"}
    "rule/section-order" {:id "rule/section-order"
                          :kind "deterministic"
                          :check "heading-order"}
    "rule/allowed-node-types" {:id "rule/allowed-node-types"
                               :kind "deterministic"
                               :check "node-type-allowlist"}
    "rule/frames-cardinality" {:id "rule/frames-cardinality"
                               :kind "deterministic"
                               :section-id "section/frames"
                               :check "frame-count"
                               :min 2
                               :max 3}
    "rule/next-exactly-one-action" {:id "rule/next-exactly-one-action"
                                    :kind "deterministic"
                                    :section-id "section/next"
                                    :check "action-count"
                                    :exactly 1}}
   :repair-templates
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
     :text "Rewrite `Frames` so it contains 2–3 plausible interpretations."}]
   :repair-templates-by-rule-id
   {"rule/required-section"
    [{:id "repair/missing-section"
      :when-rule-id "rule/required-section"
      :text "Add the missing section `{{heading}}` in position {{order}}. Preserve all other sections."}]
    "rule/section-order"
    [{:id "repair/reorder-sections"
      :when-rule-id "rule/section-order"
      :text "Reorder the existing sections to exactly: Signal, Evidence, Frames, Countermoves, Next. Preserve content."}]
    "rule/next-exactly-one-action"
    [{:id "repair/rewrite-next"
      :when-rule-id "rule/next-exactly-one-action"
      :text "Rewrite `Next` so it contains exactly one concrete next action."}]
    "rule/frames-cardinality"
    [{:id "repair/frames-cardinality"
      :when-rule-id "rule/frames-cardinality"
      :text "Rewrite `Frames` so it contains 2–3 plausible interpretations."}]}
   :review
   {:enabled true
    :reviewer-family "gpt"
    :threshold 0.80
    :criteria
    [{:id "criterion/contract-fidelity"
      :weight 0.45}
     {:id "criterion/shortcutting-risk"
      :weight 0.20}
     {:id "criterion/context-alignment"
      :weight 0.20}
     {:id "criterion/actionability"
      :weight 0.15}]}
   :arbitration
   [['accept-if
     ['structure :pass]
     ['review-score-gte 0.80]]
    ['reject-if
     ['repair-retries-exhausted true]
     ['or :structure-failed :review-below-threshold]]]})

(def valid-five-section-response
  "## Signal
- Prototype the five-section output gate around the local ημ response shape.

## Evidence
- The contract is authored in EDN and compiled into a normalized IR.
- The Markdown reply is parsed into an AST before validation.

## Frames
- This is the cheapest contract dimension to enforce first.
- It proves the runtime can separate deterministic structure from semantic review.

## Countermoves
- Do not confuse structural success with broad truth satisfaction.
- Keep the semantic reviewer narrow and contract-scoped.

## Next
- Scaffold `packages/output-contract-gate/` with the first validator slice.")

(def invalid-five-section-response
  "## Signal
- Prototype the five-section output gate around the local ημ response shape.

## Frames
- This is the cheapest contract dimension to enforce first.

## Evidence
- The contract is authored in EDN and compiled into a normalized IR.

## Countermoves
- Keep the reviewer narrow.

## Next
- Scaffold `packages/output-contract-gate/`.
- Add the operator surface now.")
