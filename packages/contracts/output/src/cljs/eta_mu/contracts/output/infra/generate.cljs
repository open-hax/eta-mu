(ns eta-mu.contracts.output.infra.generate
  "Effect orchestration for candidate generation.
   Composes `domain.generate` and `extern.http` to produce a candidate
   markdown response and generation report."
  (:require [clojure.string :as str]
            [eta-mu.contracts.output.domain.generate :as gen]
            [eta-mu.contracts.output.extern.http :as http]))

(defn ^:async generate-candidate
  "Generate a candidate markdown response for `contract` and `task-text`.
   Supports fixture generators and an OpenAI-compatible chat generator."
  [contract task-text & {:keys [mode attempt repair-prompt previous-candidate
                                    model base-url api-key temperature]
                             :or {mode "fixture-valid"
                                  attempt 0}}]
  (let [temp (or temperature (gen/default-temperature :generate))
        m (or model (gen/default-model))
        url (or base-url (gen/default-base-url))]
    (if (str/starts-with? (str mode) "fixture")
      (gen/generate-fixture-candidate mode contract task-text attempt repair-prompt temp)
      (let [messages (gen/build-generation-messages-for-attempt contract task-text
                                                                  :repair-prompt repair-prompt
                                                                  :previous-candidate previous-candidate)
            response (await (http/chat-completions (gen/trim-slash url)
                                                   api-key
                                                   {:model m
                                                    :messages messages
                                                    :temperature temp}))
            candidate-markdown (gen/extract-chat-content response)]
        {:candidate-markdown candidate-markdown
         :report (gen/openai-generation-report contract task-text attempt (boolean repair-prompt) m url temp)}))))
