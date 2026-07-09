(ns eta-mu.contracts.output.domain.validate
  "Deterministic admissibility logic over a normalized contract and an
   extracted markdown response."
  (:require [clojure.string :as str]
            [eta-mu.contracts.output.law.contract :as law]
            [eta-mu.contracts.output.shape.markdown :as md]))

(defn- validate!
  "Return value when schema-valid, otherwise throw an ex-info."
  [schema value label]
  (if (law/valid? schema value)
    value
    (throw (ex-info (str "Invalid eta-mu gate " label)
                    {:label label
                     :errors (law/explain schema value)
                     :value value}))))

(defn- build-failure
  [_contract failure]
  (validate!
   law/validation-failure-schema
   (assoc failure :message (:message failure (str "Violation of " (:rule-id failure))))
   "validation failure"))

(defn- sections-by-heading
  [sections heading]
  (filter #(= (:heading %) heading) sections))

(defn- validate-required-sections
  [contract sections]
  (mapcat (fn [section]
            (let [matches (sections-by-heading sections (:heading section))]
              (cond
                (and (:required section) (zero? (count matches)))
                [(build-failure contract
                                {:rule-id "rule/required-section"
                                 :section-id (:id section)
                                 :heading (:heading section)
                                 :expected {:heading (:heading section) :order (:order section)}
                                 :actual {:present false}
                                 :message (str "Missing required section `" (:heading section) "`")})]

                (> (count matches) 1)
                [(build-failure contract
                                {:rule-id "rule/unique-section"
                                 :section-id (:id section)
                                 :heading (:heading section)
                                 :expected {:max-occurrences 1}
                                 :actual {:occurrences (count matches)}
                                 :message (str "Section `" (:heading section) "` appears " (count matches) " times")})]

                :else [])))
          (:sections contract)))

(defn- validate-section-order
  [contract sections]
  (let [expected (mapv :heading (:sections contract))
        actual (mapv :heading sections)]
    (if (and (= (count expected) (count actual))
             (every? identity (map-indexed (fn [idx heading]
                                            (= heading (nth actual idx)))
                                          expected)))
      []
      [(build-failure contract
                      {:rule-id "rule/section-order"
                       :expected {:headings expected}
                       :actual {:headings actual}
                       :message (str "Section order mismatch. Expected "
                                     (str/join ", " expected)
                                     ", received "
                                     (str/join ", " actual))})])))

(defn- validate-allowed-node-types
  [contract sections]
  (vec
   (for [section sections
         :let [expected-section (get (:sections-by-heading contract) (:heading section))]
         :when expected-section
         node (:nodes section)
         :when (not (contains? (set (:allowed-node-types expected-section)) (:type node)))]
     (let [is-subheading (and (= (:type node) "heading")
                              (number? (:depth node))
                              (> (:depth node) 2))
           message (if is-subheading
                     (str "Section `" (:heading section) "` contains a sub-heading (h"
                          (:depth node)
                          "). Flatten the sub-heading content into paragraphs, lists, or blockquotes. Do not use `###` or deeper headings inside sections.")
                     (str "Section `" (:heading section) "` contains disallowed node type `" (:type node) "`"))]
       (build-failure contract
                      {:rule-id "rule/allowed-node-types"
                       :section-id (:id expected-section)
                       :heading (:heading section)
                       :expected {:allowed-node-types (:allowed-node-types expected-section)}
                       :actual {:node-type (:type node)}
                       :message message})))))

(defn- validate-count-rule
  [contract sections rule]
  (if-let [section-id (:section-id rule)]
    (if-let [section-config (get (:sections-by-id contract) section-id)]
      (if-let [section (first (sections-by-heading sections (:heading section-config)))]
        (let [item-count (md/count-semantic-items section)]
          (cond
            (and (number? (:exactly rule)) (not= item-count (:exactly rule)))
            [(build-failure contract
                            {:rule-id (:id rule)
                             :section-id section-id
                             :heading (:heading section-config)
                             :expected {:exactly (:exactly rule)}
                             :actual {:count item-count}
                             :message (str "Section `" (:heading section-config)
                                           "` must contain exactly " (:exactly rule)
                                           " semantic item(s)")})]

            (and (number? (:min rule)) (< item-count (:min rule)))
            [(build-failure contract
                            {:rule-id (:id rule)
                             :section-id section-id
                             :heading (:heading section-config)
                             :expected {:min (:min rule) :max (:max rule)}
                             :actual {:count item-count}
                             :message (str "Section `" (:heading section-config)
                                           "` must contain at least " (:min rule)
                                           " semantic item(s)")})]

            (and (number? (:max rule)) (> item-count (:max rule)))
            [(build-failure contract
                            {:rule-id (:id rule)
                             :section-id section-id
                             :heading (:heading section-config)
                             :expected {:min (:min rule) :max (:max rule)}
                             :actual {:count item-count}
                             :message (str "Section `" (:heading section-config)
                                           "` must contain at most " (:max rule)
                                           " semantic item(s)")})]

            :else []))
        [])
      [])
    []))

(defn validate-markdown-response
  "Validate a markdown response against a normalized contract. Returns a
   validation result with extracted sections and any failures."
  [contract markdown]
  (validate! law/normalized-contract-schema contract "contract")
  (let [extracted (md/extract-markdown-sections markdown)
        sections (:sections extracted)
        failures (vec (concat
                       (validate-required-sections contract sections)
                       (validate-section-order contract sections)
                       (validate-allowed-node-types contract sections)
                       (mapcat #(validate-count-rule contract sections %) (:rules contract))))
        result {:ok (zero? (count failures))
                :sections sections
                :failures failures}]
    (validate! law/validation-result-schema result "validation result")))

(defn to-failure-report
  "Convert a validation result into a failure report."
  [contract result]
  (validate! law/normalized-contract-schema contract "contract")
  (validate! law/validation-result-schema result "validation result")
  (validate!
   law/failure-report-schema
   {:contract (:name contract)
    :version (:version contract)
    :stage :structure
    :ok (:ok result)
    :failures (:failures result)}
   "failure report"))
