(ns eta-mu.extern.openai
  "Minimal OpenAI chat-completions client for the eta-mu agent command.

  This is an extern boundary: it performs raw Node HTTP via `js/fetch` and
  returns a stream object compatible with `eta-mu.turn-processor.infra.loop`.

  The stream returned here is synchronous (non-streaming) to keep the first
  cut small. A streaming SSE implementation can replace this later without
  changing the turn-processor contract."
  (:require [eta-mu.turn-processor.shape.message :as shape.msg]
            [eta-mu.turn-processor.shape.tool :as shape.tool]
            [eta-mu.extern.process :as process]))

(defn- ^:async fetch-chat
  "POST to the chat-completions endpoint and return the parsed JSON.

  `base-url` is the full endpoint URL (defaults to OpenAI production).
  `auth-token` is the Bearer token; if nil, no Authorization header is sent."
  [base-url auth-token model messages tools]
  (let [body (cond-> {:model (:id model)
                         :messages (clj->js messages)
                         :stream false}
                 (seq tools) (assoc :tools (clj->js tools)))
        headers (cond-> {"Content-Type" "application/json"}
                  auth-token (assoc "Authorization" (str "Bearer " auth-token)))
        response (await (js/fetch base-url
                                  #js {:method "POST"
                                       :headers (clj->js headers)
                                       :body (js/JSON.stringify (clj->js body))}))]
    (if (.-ok response)
      (js->clj (await (.json response)) :keywordize-keys true)
      (let [error (js->clj (await (.json response)) :keywordize-keys true)]
        (throw (ex-info (str "LLM API error: " (pr-str error))
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
  "Create a turn-processor-compatible stream from an OpenAI-compatible chat-completions call.

  `model` is a map `{:id string :provider string}`.
  `llm-context` is `{:system-prompt string :messages [...] :tools [...]}`.
  `options` may contain:
    :api-key    — Bearer token (falls back to OPENAI_AUTH_TOKEN, then OPENAI_API_KEY)
    :base-url   — full endpoint URL (falls back to OPENAI_BASE_URL,
                  then https://api.openai.com/v1/chat/completions)"
  [model llm-context options]
  (let [base-url (or (:base-url options)
                     (process/env "OPENAI_BASE_URL")
                     "https://api.openai.com/v1/chat/completions")
        auth-token (or (:api-key options)
                       (process/env "OPENAI_AUTH_TOKEN")
                       (process/env "OPENAI_API_KEY"))
        system-prompt (:system-prompt llm-context)
        messages (:messages llm-context)
        messages (if (some? system-prompt)
                   (vec (cons (build-system-message system-prompt) messages))
                   messages)
        tools (shape.tool/tools->openai (:tools llm-context))
        response (try
                   (await (fetch-chat base-url auth-token model messages tools))
                   (catch :default e
                     {:error true :message (.-message e)}))]
    (if (:error response)
      #js {:next (fn [] (js/Promise.resolve #js {:done true}))
           :result (fn [] (js/Promise.resolve (shape.msg/openai-error-message response {:model (:id model)})))}
      #js {:next (fn [] (js/Promise.resolve #js {:done true}))
           :result (fn [] (stream-result response model))})))
