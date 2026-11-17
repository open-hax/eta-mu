;; SPDX-License-Identifier: GPL-3.0-or-later
(ns deterministic-evidence-workflow-test
  (:require [cljs.test :refer [deftest is run-tests]]
            ["node:fs" :as fs]
            ["node:child_process" :as cp]
            ["yaml" :as yaml]
            ["@actions/expressions" :as expressions]))
(defn read-yaml [file] (js->clj (yaml/parse (fs/readFileSync file "utf8")) :keywordize-keys true))
(def live (read-yaml ".github/workflows/opencode-code-review.yml"))
(def retired (read-yaml ".github/scripts/fixtures/retired-mimo/opencode-code-review.yml"))
(def sha (apply str (repeat 40 "a")))
(def good {"PULL_REQUEST_EVENT" "true" "ELIGIBLE_REVIEW_EVENT" "true"
           "DETERMINISTIC_JOB_RESULT" "success" "DETERMINISTIC_OUTPUT_RESULT" "success"
           "DETERMINISTIC_EXPECTED_SHA" sha "DETERMINISTIC_EXECUTED_SHA" sha
           "DETERMINISTIC_COMPLETION_SHA" sha "DETERMINISTIC_EXACT_HEAD" "true"
           "DETERMINISTIC_CLEAN" "true"})
(defn gate [env]
  (.-status (cp/spawnSync "bash" #js ["-c" (get-in live [:jobs :review_gate :steps 0 :run])]
                         #js {:encoding "utf8" :env (clj->js (merge {"PATH" (.-PATH js/process.env)} env))})))
(def node-step-index
  (first (keep-indexed #(when (= "actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020" (:uses %2)) %1)
                       (get-in live [:jobs :deterministic_evidence :steps]))))
(defn selected-node [inputs]
  (let [raw (get-in live [:jobs :deterministic_evidence :steps node-step-index :with :node-version])
        source (if (.startsWith raw "${{") (.slice raw 3 -2) (str "'" raw "'"))
        tokens (.-tokens (.lex (expressions/Lexer. source)))
        expression (.parse (expressions/Parser. tokens #js ["inputs"] #js []))
        values (expressions/data.Dictionary.)
        context (expressions/data.Dictionary.)]
    (doseq [[k v] inputs] (.add values k (expressions/data.StringData. v)))
    (.add context "inputs" values)
    (.coerceString (.evaluate (expressions/Evaluator. expression context)))))
(deftest evidence-runtime-selection
  (is (= {:description "Node.js version for deterministic evidence commands; independent of retired model runtime inputs."
          :required false :type "string" :default "24"}
         (get-in live [:on :workflow_call :inputs :evidence_node_version])))
  (is (= "24" (selected-node {})))
  (is (= "24" (selected-node {"evidence_node_version" ""})))
  (is (= "24" (selected-node {"node_version" "22.20.0"})))
  (is (= "22.20.0" (selected-node {"evidence_node_version" "22.20.0"}))))
(deftest producer-and-interface-preserved
  (is (= (get-in retired [:jobs :deterministic_evidence])
         (assoc-in (get-in live [:jobs :deterministic_evidence]) [:steps node-step-index]
                   (get-in retired [:jobs :deterministic_evidence :steps node-step-index]))))
  (is (= #{:deterministic_evidence :review_gate} (set (keys (:jobs live)))))
  (is (= ["deterministic_evidence"] (get-in live [:jobs :review_gate :needs])))
  (is (true? (get-in live [:on :workflow_call :inputs :pr_head_sha :required]))))
(deftest no-model-wait-or-approval
  (is (zero? (gate good)))
  (doseq [state ["failure" "cancelled" "skipped" "timed_out" ""]]
    (is (zero? (gate (assoc good "REVIEW_JOB_RESULT" state "CONTEXT_JOB_RESULT" state))))))
(deftest fail-closed-deterministic-evidence
  (doseq [key ["DETERMINISTIC_JOB_RESULT" "DETERMINISTIC_OUTPUT_RESULT"]
          state ["failure" "cancelled" "skipped" ""]]
    (is (= 1 (gate (assoc good key state)))))
  (doseq [key ["DETERMINISTIC_EXPECTED_SHA" "DETERMINISTIC_EXECUTED_SHA" "DETERMINISTIC_COMPLETION_SHA"]
          value ["" "bad" (apply str (repeat 40 "b"))]]
    (is (= 1 (gate (assoc good key value)))))
  (doseq [key ["DETERMINISTIC_EXACT_HEAD" "DETERMINISTIC_CLEAN"] value ["false" ""]]
    (is (= 1 (gate (assoc good key value)))))
)
(deftest event-boundary
  (is (= 1 (gate (assoc good "PULL_REQUEST_EVENT" "false"))))
  (is (zero? (gate {"PULL_REQUEST_EVENT" "true" "ELIGIBLE_REVIEW_EVENT" "false"}))))
(deftest assessments-retired
  (doseq [name ["actionability" "rejection" "positive-cohort"]]
    (is (not (fs/existsSync (str ".github/workflows/opencode-" name "-assessment.yml"))))))
(deftest no-executable-mimo-route
  (doseq [name (js->clj (fs/readdirSync ".github/workflows"))
          :when (re-find #"\.ya?ml$" name)]
    (let [document (read-yaml (str ".github/workflows/" name))
          executable (pr-str (select-keys document [:jobs :env]))]
      (is (nil? (re-find #"mimo|opencode-free-mimo-flash|run-opencode-review-recovery" executable)) name))))
(run-tests)
