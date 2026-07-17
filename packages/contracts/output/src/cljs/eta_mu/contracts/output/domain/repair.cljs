(ns eta-mu.contracts.output.domain.repair
  "Repair-prompt compilation from validation failures and contract templates."
  (:require [clojure.string :as str]
            [eta-mu.contracts.output.law.contract :as law]))

(defn- validate!
  [schema value label]
  (if (law/valid? schema value)
    value
    (throw (ex-info (str "Invalid eta-mu gate " label)
                    {:label label
                     :errors (law/explain schema value)
                     :value value}))))

(defn- interpolate
  [template failure]
  (let [bindings (merge
                  (:expected failure)
                  (:actual failure)
                  {:heading (:heading failure)})]
    (str/replace template #"\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}"
                 (fn [[_ key]]
                   (let [value (get bindings (keyword key))]
                     (if (nil? value) "" (str value)))))))

(defn- instruction-for-failure
  [contract failure]
  (if-let [template (first (get (:repair-templates-by-rule-id contract) (:rule-id failure)))]
    (interpolate (:text template) failure)
    (:message failure)))

(defn compile-repair-prompt
  "Compile a repair prompt from a validation result. Returns a string."
  [contract result]
  (validate! law/normalized-contract-schema contract "contract")
  (validate! law/validation-result-schema result "validation result")
  (if (:ok result)
    (str "Response already satisfies " (:name contract) ".")
    (let [instructions (map-indexed (fn [idx failure]
                                      (str (inc idx) ". " (instruction-for-failure contract failure)))
                                    (:failures result))]
      (str/join "\n"
                (concat
                 [(str "Your last response failed the structure contract `" (:name contract) "`.")
                  "Repair only the following violations and preserve all passing content:"]
                 instructions
                 ["Return Markdown only."])))))
