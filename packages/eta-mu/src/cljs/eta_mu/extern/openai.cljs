(ns eta-mu.extern.openai
  "Minimal OpenAI chat-completions client for the eta-mu agent command.

  This is an extern boundary: it performs raw Node HTTP via `js/fetch` and
  returns a stream object compatible with `eta-mu.turn-processor.infra.loop`.

  The stream returned here is synchronous (non-streaming) to keep the first
  cut small. A streaming SSE implementation can replace this later without
  changing the turn-processor contract."
  (:require [eta-mu.turn-processor.shape.message :as shape.msg]
            [eta-mu.extern.process :as process]))

(defn- ^:async fetch-chat
  "POST to the OpenAI chat-completions endpoint and return the parsed JSON."
  [api-key model messages tools]
  (let [body (cond-> {:model (:id model)
                         :messages (clj->js messages)
                         :stream false}
                 (seq tools) (assoc :tools (clj->js tools)))
        response (await (js/fetch "https://api.openai.com/v1/chat/completions"
                                  #js {:method "POST"
                                       :headers #js {"Content-Type" "application/json"
                                                     "Authorization" (str "Bearer " api-key)}
                                       :body (js/JSON.stringify (clj->js body))}))]
    (if (.-ok response)
      (js->clj (await (.json response)) :keywordize-keys true)
      (let [error (js->clj (await (.json response)) :keywordize-keys true)]
        (throw (ex-info (str "OpenAI API error: " (pr-str error))
                        {:status (.-status response) :body error}))))))

(defn- build-system-message
  "Wrap a system prompt string as an OpenAI system message."
  [system-prompt]
  {:role "system" :content system-prompt})

(defn- ^:async stream-result
  "Build a canonical AssistantMessage from an OpenAI response and the request context."
  [response model]
  (shape.msg/openai-response->assistant-message
   response
   {:api "openai" :provider "openai" :model (:id model)}))

(defn ^:async stream-chat
  "Create a turn-processor-compatible stream from an OpenAI chat-completions call.

  `model` is a map `{:id string :provider string}`.
  `llm-context` is `{:system-prompt string :messages [...] :tools [...]}`.
  `options` may contain `:api-key`; otherwise `OPENAI_API_KEY` is read from the environment."
  [model llm-context options]
  (let [api-key (or (:api-key options) (process/env "OPENAI_API_KEY"))
        system-prompt (:system-prompt llm-context)
        messages (:messages llm-context)
        messages (if (some? system-prompt)
                   (vec (cons (build-system-message system-prompt) messages))
                   messages)
        tools (:tools llm-context)]
    (if-not api-key
      (throw (ex-info "OpenAI API key not provided. Pass :api-key or set OPENAI_API_KEY." {}))
      (let [response (try
                        (await (fetch-chat api-key model messages tools))
                        (catch :default e
                          {:error true :message (.-message e)}))]
        (if (:error response)
          #js {:next (fn [] (js/Promise.resolve #js {:done true}))
               :result (fn [] (js/Promise.resolve (shape.msg/openai-error-message response {:model (:id model)})))}
          #js {:next (fn [] (js/Promise.resolve #js {:done true}))
               :result (fn [] (stream-result response model))})))))
