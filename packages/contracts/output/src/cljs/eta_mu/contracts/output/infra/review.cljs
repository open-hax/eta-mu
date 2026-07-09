(ns eta-mu.contracts.output.infra.review
  "Effect orchestration for GPT-family review.
   Composes `domain.review` and `extern.http` to call a remote reviewer and
   build a review report."
  (:require [eta-mu.contracts.output.domain.generate :as gen]
            [eta-mu.contracts.output.domain.review :as review]
            [eta-mu.contracts.output.extern.http :as http]))

(defn ^:async build-gpt-review-report
  "Build a GPT review report for `contract` and `candidate-markdown`.
   If the call fails and `fallback?` is true, returns a stub report with a
   limitation instead of throwing."
  [contract candidate-markdown structure-report
   & {:keys [model base-url api-key max-session-turns temperature fallback?]
       :or {fallback? true
            max-session-turns 10}}]
  (let [m (or model (gen/default-model))
        url (or base-url (gen/default-base-url))
        temp (or temperature 0.3)
        session-history (when-let [history (:session-history structure-report)]
                          (take-last max-session-turns history))
        messages (review/build-gpt-review-messages contract candidate-markdown session-history)]
    (try
      (let [response (await (http/chat-completions (gen/trim-slash url) api-key
                                                    {:model m
                                                     :messages messages
                                                     :temperature temp}))
            content (get-in response [:choices 0 :message :content])
            parsed (review/parse-gpt-review-output content)]
        (review/build-gpt-review-report-pure contract parsed m (count session-history)))
      (catch js/Error e
        (if fallback?
          (let [stub (review/build-stub-review-report contract candidate-markdown structure-report)]
            (update stub :limitations conj (str "GPT reviewer unavailable (" (.-message e) "). Fell back to stub reviewer.")))
          (throw e))))))
