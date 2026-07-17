(ns eta-mu.contracts.output.shape.edn-test
  "Tests for the EDN contract compiler in eta-mu.contracts.output.shape.edn."
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.contracts.output.law.contract :as law]
            [eta-mu.contracts.output.shape.edn :as edn]
            [eta-mu.contracts.output.shape.fixtures :as fixtures]))

(def five-section-contract-edn
  "(agent-output-contract\n  (name \"eta-mu-five-section-response\")\n  (v \"ημ.output/response-shape@0.1.0\")\n\n  (target\n    (format :markdown)\n    (ast :mdast)\n    (root :document))\n\n  (structure\n    (section\n      (id :section/signal)\n      (heading \"Signal\")\n      (required true)\n      (order 1)\n      (cardinality :one)\n      (allowed-node-types [:paragraph :list :blockquote :code :table]))\n\n    (section\n      (id :section/evidence)\n      (heading \"Evidence\")\n      (required true)\n      (order 2)\n      (cardinality :one)\n      (allowed-node-types [:paragraph :list :blockquote :code :table]))\n\n    (section\n      (id :section/frames)\n      (heading \"Frames\")\n      (required true)\n      (order 3)\n      (cardinality :one)\n      (allowed-node-types [:paragraph :list :blockquote]))\n\n    (section\n      (id :section/countermoves)\n      (heading \"Countermoves\")\n      (required true)\n      (order 4)\n      (cardinality :one)\n      (allowed-node-types [:paragraph :list :blockquote]))\n\n    (section\n      (id :section/next)\n      (heading \"Next\")\n      (required true)\n      (order 5)\n      (cardinality :one)\n      (allowed-node-types [:paragraph :list])\n      (local-rules [:rule/next-exactly-one-action])))\n\n  (rules\n    (rule\n      (id :rule/required-section)\n      (kind :deterministic)\n      (check :section-present))\n\n    (rule\n      (id :rule/unique-section)\n      (kind :deterministic)\n      (check :section-unique))\n\n    (rule\n      (id :rule/section-order)\n      (kind :deterministic)\n      (check :heading-order))\n\n    (rule\n      (id :rule/allowed-node-types)\n      (kind :deterministic)\n      (check :node-type-allowlist))\n\n    (rule\n      (id :rule/frames-cardinality)\n      (kind :deterministic)\n      (section :section/frames)\n      (check :frame-count)\n      (min 2)\n      (max 3))\n\n    (rule\n      (id :rule/next-exactly-one-action)\n      (kind :deterministic)\n      (section :section/next)\n      (check :action-count)\n      (exactly 1)))\n\n  (repair\n    (max-retries 2)\n\n    (template\n      (id :repair/missing-section)\n      (when :rule/required-section)\n      (text \"Add the missing section `{{heading}}` in position {{order}}. Preserve all other sections.\"))\n\n    (template\n      (id :repair/reorder-sections)\n      (when :rule/section-order)\n      (text \"Reorder the existing sections to exactly: Signal, Evidence, Frames, Countermoves, Next. Preserve content.\"))\n\n    (template\n      (id :repair/rewrite-next)\n      (when :rule/next-exactly-one-action)\n      (text \"Rewrite `Next` so it contains exactly one concrete next action.\"))\n\n    (template\n      (id :repair/frames-cardinality)\n      (when :rule/frames-cardinality)\n      (text \"Rewrite `Frames` so it contains 2–3 plausible interpretations.\")))\n\n  (review\n    (enabled true)\n    (reviewer-family :gpt)\n    (threshold 0.80)\n    (criteria\n      (criterion (id :criterion/contract-fidelity) (weight 0.45))\n      (criterion (id :criterion/shortcutting-risk) (weight 0.20))\n      (criterion (id :criterion/context-alignment) (weight 0.20))\n      (criterion (id :criterion/actionability) (weight 0.15))))\n\n  (arbitration\n    (accept-if\n      (structure :pass)\n      (review-score-gte 0.80))\n    (reject-if\n      (repair-retries-exhausted true)\n      (or :structure-failed :review-below-threshold))))")

(deftest compile-contract-test
  (testing "compiles the eta-mu five-section response contract"
    (is (= fixtures/eta-mu-five-section-contract
           (edn/compile-agent-output-contract five-section-contract-edn)))))

(deftest parse-edn-form-test
  (testing "returns a readable s-expression"
    (let [form (edn/parse-edn-form five-section-contract-edn)]
      (is (seq? form))
      (is (= 'agent-output-contract (first form))))))

(deftest compile-contract-errors-test
  (testing "rejects a non-contract root"
    (is (thrown? js/Error (edn/compile-agent-output-contract "{:not-a-contract true}"))))
  (testing "rejects missing required sections"
    (is (thrown? js/Error (edn/compile-agent-output-contract "(agent-output-contract (name \"x\"))")))))

(deftest coerce-json-contract-test
  (testing "round-trips a normalized contract through JSON (arbitration is lossy)"
    (let [json (js/JSON.stringify (clj->js fixtures/eta-mu-five-section-contract))
          parsed (js->clj (js/JSON.parse json) :keywordize-keys true)
          coerced (edn/coerce-json-contract parsed)]
      (is (law/valid? law/normalized-contract-schema coerced))
      (is (= (dissoc fixtures/eta-mu-five-section-contract :arbitration)
             (dissoc coerced :arbitration))))))
