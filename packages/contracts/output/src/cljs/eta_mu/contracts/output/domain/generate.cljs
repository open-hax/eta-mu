(ns eta-mu.contracts.output.domain.generate
  "Pure generation logic for output-contract candidates.

   Builds generation messages, chooses fixture candidates, and assembles the
   deterministic parts of a generation report. No I/O."
  (:require [clojure.string :as str]
            [eta-mu.contracts.output.shape.fixtures :as fixtures]))

(defn- word-count
  [text]
  (let [trimmed (str/trim (str text))]
    (if (seq trimmed)
      (count (str/split trimmed #"\s+"))
      0)))

(defn- required-headings
  [contract]
  (mapv :heading (:sections contract)))

(defn- build-hints
  [contract]
  (let [next-rule (first (filter #(= (:id %) "rule/next-exactly-one-action") (:rules contract)))
        frames-rule (first (filter #(= (:id %) "rule/frames-cardinality") (:rules contract)))
        frames-hint (when frames-rule
                      (str "Frames must contain " (:min frames-rule) "–" (:max frames-rule) " plausible interpretations."))
        next-hint (when (:exactly next-rule)
                    (str "Next must contain exactly " (:exactly next-rule) " concrete action."))]
    [frames-hint next-hint]))

(defn build-generation-messages-for-attempt
  "Build the system/user message pair for a single generation attempt.
   If `repair-prompt` and `previous-candidate` are supplied, a repair turn is
   built instead of a fresh prompt."
  [contract task-text & {:keys [repair-prompt previous-candidate]}]
  (let [headings (str/join ", " (required-headings contract))
        [frames-hint next-hint] (build-hints contract)
        system-content (str/join "\n" (filter seq ["Return Markdown only."
                                                    "Use exactly these level-2 headings in this exact order:"
                                                    headings
                                                    frames-hint
                                                    next-hint]))]
    (if (and repair-prompt previous-candidate)
      [{:role "system" :content system-content}
       {:role "user" :content (str/join "\n\n" [(str "Original task:\n" task-text)
                                                  (str "Previous response:\n\n" previous-candidate)
                                                  (str "Repair instructions:\n" repair-prompt)])}]
      [{:role "system" :content system-content}
       {:role "user" :content task-text}])))

(defn build-generation-messages
  "Convenience wrapper for the first attempt."
  [contract task-text]
  (build-generation-messages-for-attempt contract task-text))

(defn prompt-summary
  [contract task-text]
  {:required-headings (required-headings contract)
   :task-word-count (word-count task-text)})

(defn fixture-generation-report
  [mode contract task-text attempt repair-prompt-applied temperature]
  {:stage "generate"
   :generator mode
   :ok true
   :attempt attempt
   :repair-prompt-applied (boolean repair-prompt-applied)
   :temperature temperature
   :prompt-summary (prompt-summary contract task-text)
   :limitations (case mode
                   "fixture-valid" ["Fixture generator returns a canned structurally valid response."]
                   "fixture-invalid" [(if repair-prompt-applied
                                         "Fixture-invalid generator switches to a canned repaired response once repair instructions are supplied."
                                         "Fixture generator returns a canned structurally invalid response for repair-loop testing.")]
                   [])})

(defn generate-fixture-candidate
  "Return a candidate markdown and report for a fixture generator."
  [mode contract task-text attempt repair-prompt temperature]
  (let [repair-prompt-applied (boolean repair-prompt)
        candidate-markdown (case mode
                             "fixture-valid" fixtures/valid-five-section-response
                             "fixture-invalid" (if repair-prompt-applied
                                                 fixtures/valid-five-section-response
                                                 fixtures/invalid-five-section-response)
                             "")]
    {:candidate-markdown candidate-markdown
     :report (fixture-generation-report mode contract task-text attempt repair-prompt-applied temperature)}))

(defn extract-chat-content
  "Extract content from an OpenAI-style chat completion response."
  [payload]
  (let [choices (:choices payload)
        first-choice (first choices)
        content (get-in first-choice [:message :content])
        text (:text first-choice)]
    (cond
      (and (string? content) (seq (str/trim content))) (str/trim content)
      (vector? content)
      (let [joined (str/join "" (map (fn [entry]
                                      (cond
                                        (string? entry) entry
                                        (and (map? entry) (string? (:text entry))) (:text entry)
                                        :else ""))
                                    content))]
        (when (seq (str/trim joined)) (str/trim joined)))
      (and (string? text) (seq (str/trim text))) (str/trim text)
      :else (throw (ex-info "Empty or invalid LLM response" {:payload payload})))))

(defn openai-generation-report
  [contract task-text attempt repair-prompt-applied model base-url temperature]
  {:stage "generate"
   :generator "openai-chat"
   :ok true
   :attempt attempt
   :repair-prompt-applied (boolean repair-prompt-applied)
   :model model
   :base-url base-url
   :temperature temperature
   :prompt-summary (prompt-summary contract task-text)
   :limitations ["This generator uses an OpenAI-compatible chat/completions transport only."
                   "Semantic review still runs through the deterministic review stub unless a later reviewer is integrated."]})

(defn default-base-url
  []
  (or (.-OPENAI_BASE_URL js/process.env) "http://127.0.0.1:8789/v1"))

(defn default-model
  []
  (or (.-OUTPUT_CONTRACT_GATE_MODEL js/process.env)
      (.-MODEL js/process.env)
      "gpt-5.4"))

(defn default-api-key
  []
  (or (.-OUTPUT_CONTRACT_GATE_API_KEY js/process.env)
      (.-OPENAI_API_KEY js/process.env)
      (.-OPEN_HAX_OPENAI_PROXY_AUTH_TOKEN js/process.env)
      (.-PROXY_AUTH_TOKEN js/process.env)))

(defn default-temperature
  [mode]
  (if (= mode :generate) 0.2 0.3))

(defn trim-slash
  [value]
  (str/replace value #"/+$" ""))
