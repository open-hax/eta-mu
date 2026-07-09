(ns eta-mu.contracts.output.domain-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.contracts.output.domain.repair :as repair]
            [eta-mu.contracts.output.domain.review :as review]
            [eta-mu.contracts.output.domain.validate :as validate]
            [eta-mu.contracts.output.shape.fixtures :as fixtures]))

(deftest validate-accepts-valid-response-test
  (testing "validate-markdown-response accepts a structurally valid five-section response"
    (let [result (validate/validate-markdown-response
                  fixtures/eta-mu-five-section-contract
                  fixtures/valid-five-section-response)]
      (is (true? (:ok result)))
      (is (zero? (count (:failures result)))))))

(deftest validate-reports-deterministic-failures-test
  (testing "validate-markdown-response reports deterministic failures for malformed structure"
    (let [result (validate/validate-markdown-response
                  fixtures/eta-mu-five-section-contract
                  fixtures/invalid-five-section-response)
          rule-ids (set (map :rule-id (:failures result)))]
      (is (false? (:ok result)))
      (is (contains? rule-ids "rule/section-order"))
      (is (contains? rule-ids "rule/frames-cardinality"))
      (is (contains? rule-ids "rule/next-exactly-one-action")))))

(deftest validate-bold-subheading-regression-test
  (testing "validateMarkdownResponse does not interpret bold subheadings as section headers"
    (let [response "## Signal

Test signal.

## Evidence

**Core Architecture:**

1. Item one

**Key Helpers:**

- Helper one

## Frames

Frame 1: First interpretation.

Frame 2: Second interpretation.

## Countermoves

Countermove 1: First risk.

## Next

Do the next thing.
"
          result (validate/validate-markdown-response
                  fixtures/eta-mu-five-section-contract
                  response)]
      (is (true? (:ok result))
          (str "Expected validation to pass but got failures: "
               (pr-str (:failures result))))
      (is (= 5 (count (:sections result))))
      (is (= "Signal" (:heading (nth (:sections result) 0))))
      (is (= "Evidence" (:heading (nth (:sections result) 1))))
      (is (= "Frames" (:heading (nth (:sections result) 2))))
      (is (= "Countermoves" (:heading (nth (:sections result) 3))))
      (is (= "Next" (:heading (nth (:sections result) 4)))))))

(deftest to-failure-report-test
  (testing "to-failure-report preserves contract identity and stage"
    (let [result (validate/validate-markdown-response
                  fixtures/eta-mu-five-section-contract
                  fixtures/invalid-five-section-response)
          report (validate/to-failure-report fixtures/eta-mu-five-section-contract result)]
      (is (= "eta-mu-five-section-response" (:contract report)))
      (is (= "ημ.output/response-shape@0.1.0" (:version report)))
      (is (= :structure (:stage report)))
      (is (false? (:ok report)))
      (is (pos? (count (:failures report)))))))

(deftest compile-repair-prompt-test
  (testing "compile-repair-prompt names exact structural deltas"
    (let [result (validate/validate-markdown-response
                  fixtures/eta-mu-five-section-contract
                  fixtures/invalid-five-section-response)
          prompt (repair/compile-repair-prompt fixtures/eta-mu-five-section-contract result)]
      (is (re-find #"failed the structure contract" prompt))
      (is (re-find #"Reorder the existing sections to exactly: Signal, Evidence, Frames, Countermoves, Next" prompt))
      (is (re-find #"Rewrite `Frames` so it contains 2–3 plausible interpretations" prompt))
      (is (re-find #"Rewrite `Next` so it contains exactly one concrete next action" prompt)))))

(deftest compile-repair-prompt-success-test
  (testing "compile-repair-prompt returns a success message when validation passes"
    (let [result (validate/validate-markdown-response
                  fixtures/eta-mu-five-section-contract
                  fixtures/valid-five-section-response)
          prompt (repair/compile-repair-prompt fixtures/eta-mu-five-section-contract result)]
      (is (re-find #"Response already satisfies" prompt)))))

(deftest build-stub-review-report-test
  (testing "build-stub-review-report computes weighted score and threshold decision"
    (let [structure-report (validate/to-failure-report
                            fixtures/eta-mu-five-section-contract
                            (validate/validate-markdown-response
                             fixtures/eta-mu-five-section-contract
                             fixtures/valid-five-section-response))
          report (review/build-stub-review-report
                  fixtures/eta-mu-five-section-contract
                  fixtures/valid-five-section-response
                  structure-report)]
      (is (= :review (:stage report)))
      (is (= :stub (:reviewer report)))
      (is (number? (:overall-score report)))
      (is (boolean? (:ok report)))
      (is (= 4 (count (:criteria report))))
      (is (seq (:generated-at report))))))

(deftest build-review-messages-test
  (testing "build-review-messages produces system/user pair with contract context"
    (let [messages (review/build-review-messages
                    fixtures/eta-mu-five-section-contract
                    fixtures/valid-five-section-response)]
      (is (= 2 (count messages)))
      (is (= :system (:role (first messages))))
      (is (re-find #"Contract name" (:content (first messages))))
      (is (= :user (:role (second messages))))
      (is (re-find #"Candidate response" (:content (second messages)))))))

(deftest build-review-messages-with-history-test
  (testing "build-review-messages includes session history when provided"
    (let [history [{:role :user :content "hello"}
                   {:role :assistant :content "hi"}]
          messages (review/build-review-messages
                    fixtures/eta-mu-five-section-contract
                    fixtures/valid-five-section-response
                    history)]
      (is (re-find #"Session context" (:content (second messages))))
      (is (re-find #"user: hello" (:content (second messages)))))))
