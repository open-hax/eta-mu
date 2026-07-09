(ns eta-mu.contracts.output.domain.review
  "Deterministic stub review scoring and GPT review message building.
   No HTTP fetch or environment access in this namespace."
  (:require [clojure.string :as str]
            [eta-mu.contracts.output.extern.js :as extern]
            [eta-mu.contracts.output.law.contract :as law]
            [eta-mu.contracts.output.shape.markdown :as md]))

(defn- validate!
  [schema value label]
  (if (law/valid? schema value)
    value
    (throw (ex-info (str "Invalid eta-mu gate " label)
                    {:label label
                     :errors (law/explain schema value)
                     :value value}))))

(defn- clamp01
  [value]
  (max 0.0 (min 1.0 (double value))))

(defn- word-count
  [text]
  (let [trimmed (str/trim text)]
    (if (seq trimmed)
      (count (str/split trimmed #"\s+"))
      0)))

(defn- section-text
  [markdown heading]
  (let [document (md/extract-markdown-sections markdown)
        section (first (filter #(= (:heading %) heading) (:sections document)))]
    (if section
      (str/trim (str/join " " (map md/node-text (:nodes section))))
      "")))

(defn- fallback-criterion
  [criterion]
  {:id (:id criterion)
   :weight (:weight criterion)
   :score 0.7
   :note "Stub reviewer defaulted this criterion because no specialized heuristic exists yet."})

(defn- fidelity-criterion
  [criterion structure-report]
  {:id (:id criterion)
   :weight (:weight criterion)
   :score (if (:ok structure-report) 1 0)
   :note (if (:ok structure-report)
           "Structure gate already passed; the stub treats structural fidelity as complete."
           "Structure gate failed, so contract fidelity cannot pass review.")})

(defn- shortcutting-criterion
  [criterion markdown]
  (let [evidence-words (word-count (section-text markdown "Evidence"))
        frames-words (word-count (section-text markdown "Frames"))
        countermoves-words (word-count (section-text markdown "Countermoves"))
        density (/ (+ (min (/ evidence-words 20) 1.0)
                      (min (/ frames-words 20) 1.0)
                      (min (/ countermoves-words 20) 1.0))
                   3)
        score (clamp01 (+ 0.45 (* density 0.5)))]
    {:id (:id criterion)
     :weight (:weight criterion)
     :score score
     :note (str "Stub inferred shortcutting resistance from Evidence/Frames/Countermoves density ("
                evidence-words "/" frames-words "/" countermoves-words " words).")}))

(defn- context-alignment-criterion
  [criterion]
  {:id (:id criterion)
   :weight (:weight criterion)
   :score 0.65
   :note "Stub reviewer cannot inspect session history deeply yet, so context alignment is conservatively partial."})

(defn- actionability-criterion
  [criterion markdown]
  (let [next-words (word-count (section-text markdown "Next"))
        score (cond
                (>= next-words 4) 0.9
                (> next-words 0) 0.7
                :else 0.2)]
    {:id (:id criterion)
     :weight (:weight criterion)
     :score score
     :note (str "Stub actionability score derived from Next-section specificity (" next-words " words).")}))

(defn- score-criterion
  [criterion _contract markdown structure-report]
  (case (:id criterion)
    "criterion/contract-fidelity" (fidelity-criterion criterion structure-report)
    "criterion/shortcutting-risk" (shortcutting-criterion criterion markdown)
    "criterion/context-alignment" (context-alignment-criterion criterion)
    "criterion/actionability" (actionability-criterion criterion markdown)
    (fallback-criterion criterion)))

(def ^:private review-criteria-descriptions
  {"criterion/contract-fidelity" "Does the response satisfy all structural and semantic requirements of the contract? Are all required sections present with appropriate content?"
   "criterion/shortcutting-risk" "Did the model take shortcuts, omit important details, or produce generic filler instead of substantive content? Look for thin Evidence, vague Frames, or weak Countermoves."
   "criterion/context-alignment" "Is the response aligned with the session context? Does it address the actual user intent or drift into irrelevant territory?"
   "criterion/actionability" "Is the Next section actionable? Does it provide a single concrete step rather than vague directions?"})

(defn- build-review-system-prompt
  [contract]
  (let [headings (str/join ", " (map :heading (:sections contract)))
        criteria-descriptions (str/join "\n"
                                        (map (fn [c]
                                               (str "- " (:id c) " (weight " (:weight c) "): "
                                                    (get review-criteria-descriptions (:id c) "No description available")))
                                             (get-in contract [:review :criteria])))]
    (str "You are a contract compliance reviewer. Score the candidate response against the contract criteria.\n\n"
         "Contract name: " (:name contract) "\n"
         "Contract version: " (:version contract) "\n"
         "Required sections: " headings "\n\n"
         "Criteria:\n" criteria-descriptions "\n\n"
         "Score each criterion from 0.0 to 1.0.\n"
         "Compute overallScore as the weighted average of criterion scores.\n"
         "Threshold for passing: " (get-in contract [:review :threshold]) "\n\n"
         "Return ONLY a JSON object with this exact shape (no markdown code blocks):\n"
         "{\n"
         "  \"criteria\": [\n"
         "    {\"id\": \"criterion/contract-fidelity\", \"score\": 0.0-1.0, \"note\": \"brief explanation\"},\n"
         "    {\"id\": \"criterion/shortcutting-risk\", \"score\": 0.0-1.0, \"note\": \"brief explanation\"},\n"
         "    {\"id\": \"criterion/context-alignment\", \"score\": 0.0-1.0, \"note\": \"brief explanation\"},\n"
         "    {\"id\": \"criterion/actionability\", \"score\": 0.0-1.0, \"note\": \"brief explanation\"}\n"
         "  ],\n"
         "  \"deltas\": [\"actionable improvement suggestion 1\", \"actionable improvement suggestion 2\"]\n"
         "}")))

(defn- build-review-user-prompt
  ([contract candidate-markdown]
   (build-review-user-prompt contract candidate-markdown nil))
  ([_contract candidate-markdown session-history]
    (let [parts [(str "Candidate response:\n\n" candidate-markdown)]]
     (str/join "\n"
               (cond-> parts
                 (seq session-history)
                 (conj (str "\nSession context (last " (min (count session-history) 10) " turns):\n\n"
                            (str/join "\n\n" (map (fn [turn]
                                                     (str (name (:role turn)) ": " (:content turn)))
                                                   (take-last 10 session-history)))))
                 true (conj "\nReturn JSON with criteria scores and deltas."))))))

(defn build-review-messages
  "Build the system/user message pair for a GPT-family reviewer."
  ([contract candidate-markdown]
   (build-review-messages contract candidate-markdown nil))
  ([contract candidate-markdown session-history]
   (validate! law/normalized-contract-schema contract "contract")
   (validate!
    [:vector law/gpt-review-message-schema]
    [{:role :system
      :content (build-review-system-prompt contract)}
     {:role :user
      :content (build-review-user-prompt contract candidate-markdown session-history)}]
    "review messages")))

(def gpt-review-output-schema
  "Schema for the JSON object the GPT reviewer is asked to return."
  [:map
   [:criteria [:vector
               [:map
                [:id law/non-empty-string]
                [:score law/unit-interval]
                [:note law/non-empty-string]]]]
   [:deltas [:vector law/non-empty-string]]])

(defn- strip-json-code-block
  [text]
  (let [text (str/trim text)
        match (re-find #"```(?:json)?\s*\n?([\s\S]*?)```" text)]
    (if match
      (str/trim (second match))
      text)))

(defn parse-gpt-review-output
  "Parse a GPT review JSON string, tolerating markdown code blocks."
  [text]
  (let [json-text (strip-json-code-block text)
        parsed (js->clj (js/JSON.parse json-text) :keywordize-keys true)]
    (validate! gpt-review-output-schema parsed "gpt review output")
    parsed))

(defn map-gpt-output-to-criteria
  "Map parsed GPT criteria onto the contract criteria, preserving weights and
   falling back to 0.5 if a criterion is missing."
  [contract gpt-output]
  (let [gpt-map (reduce #(assoc %1 (:id %2) %2) {} (:criteria gpt-output))
        fallback (fn [criterion]
                   {:id (:id criterion)
                    :weight (:weight criterion)
                    :score 0.5
                    :note "GPT reviewer did not return this criterion; using fallback score."})]
    (mapv (fn [criterion]
            (if-let [gpt-result (get gpt-map (:id criterion))]
              {:id (:id criterion)
               :weight (:weight criterion)
               :score (clamp01 (:score gpt-result))
               :note (:note gpt-result)}
              (fallback criterion)))
          (get-in contract [:review :criteria]))))

(defn build-gpt-review-report-pure
  "Build a review report from parsed GPT output and contract criteria."
  [contract parsed-output model-id session-turns]
  (validate! law/normalized-contract-schema contract "contract")
  (let [criteria (map-gpt-output-to-criteria contract parsed-output)
        total-weight (reduce + (map :weight criteria))
        total-weight (if (zero? total-weight) 1 total-weight)
        overall-score (clamp01 (/ (reduce + (map #(* (:score %) (:weight %)) criteria))
                                  total-weight))]
    (validate!
     law/review-report-schema
     {:stage :review
      :reviewer :gpt
      :ok (>= overall-score (get-in contract [:review :threshold]))
      :threshold (get-in contract [:review :threshold])
      :overall-score overall-score
      :criteria criteria
      :deltas (:deltas parsed-output)
      :limitations []
      :generated-at (extern/now-iso)
      :model-id model-id
      :session-turns session-turns}
     "review report")))

(defn build-gpt-review-messages
  "Build the system/user message pair for a GPT-family reviewer."
  ([contract candidate-markdown]
   (build-gpt-review-messages contract candidate-markdown nil))
  ([contract candidate-markdown session-history]
   (build-review-messages contract candidate-markdown session-history)))

(defn build-stub-review-report
  "Build a deterministic review report from heuristics over the markdown and
   a prior structure report."
  [contract markdown structure-report]
  (validate! law/normalized-contract-schema contract "contract")
  (validate! law/failure-report-schema structure-report "structure report")
  (let [criteria (mapv #(score-criterion % contract markdown structure-report)
                       (get-in contract [:review :criteria]))
        total-weight (reduce + (map :weight criteria))
        total-weight (if (zero? total-weight) 1 total-weight)
        overall-score (clamp01 (/ (reduce + (map #(* (:score %) (:weight %)) criteria))
                                  total-weight))
        shortcutting (first (filter #(= (:id %) "criterion/shortcutting-risk") criteria))
        context (first (filter #(= (:id %) "criterion/context-alignment") criteria))
        actionability (first (filter #(= (:id %) "criterion/actionability") criteria))
        deltas (cond-> []
                 (and shortcutting (< (:score shortcutting) 0.8))
                 (conj "Evidence, Frames, or Countermoves look terse; deepen the body under the existing headings before relying on semantic review.")

                 (and context (< (:score context) 0.75))
                 (conj "Stub review cannot strongly assess session-context alignment yet; rerun with a GPT-family reviewer when integrated.")

                 (and actionability (< (:score actionability) 0.8))
                 (conj "Next is structurally valid but may need a more concrete or specific action phrase."))]
    (validate!
     law/review-report-schema
     {:stage :review
      :reviewer :stub
      :ok (>= overall-score (get-in contract [:review :threshold]))
      :threshold (get-in contract [:review :threshold])
      :overall-score overall-score
      :criteria criteria
      :deltas deltas
      :limitations ["This is a deterministic review stub, not a GPT-family semantic reviewer."
                    "Session-history sensitivity is currently approximated rather than inferred from real context."]
       :generated-at (extern/now-iso)}
     "review report")))
