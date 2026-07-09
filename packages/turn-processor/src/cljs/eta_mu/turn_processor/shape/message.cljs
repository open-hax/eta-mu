(ns eta-mu.turn-processor.shape.message
  "Canonical AgentMessage ↔ OpenAI-compatible chat DTO conversions.

  The canonical side uses the kebab-case keyword schemas from
  `eta-mu.turn-processor.law.message`. The OpenAI side uses the string keys
  and string roles expected by the OpenAI chat-completions API.

  This namespace is intentionally narrow: it covers text, tool-call, and
  tool-result messages. Multimodal images/audio are serialized to text
  placeholders rather than OpenAI image-url/audio objects, keeping the shape
  provider-agnostic and safe as a fallback."
  (:require [eta-mu.turn-processor.law.message :as law]))

(defn- input-content->string
  "Flatten canonical input content into a single string for OpenAI text content."
  [content]
  (cond
    (string? content) content
    (empty? content) ""
    :else (transduce
            (comp (map (fn [part]
                        (case (:type part)
                          :text (:text part)
                          :image (str "[image: " (:mime-type part) "]")
                          :audio (str "[audio: " (:mime-type part) "]")
                          ""))))
            str
            content)))

(defn- content-parts->string
  "Convert a vector of assistant content parts to a single string.

  Text parts are concatenated; non-text parts are dropped from the string."
  [parts]
  (transduce
   (comp (filter #(= (:type %) :text))
         (map :text))
   str
   parts))

(defn- tool-calls->openai
  "Convert canonical tool-call content parts to OpenAI `tool_calls`."
  [parts]
  (mapv (fn [part]
          {:id (:id part)
           :type "function"
           :function {:name (:name part)
                      :arguments (js/JSON.stringify (clj->js (:arguments part)))}})
        (filter #(= (:type %) :tool-call) parts)))

(defn- openai-tool-calls->canonical
  "Convert OpenAI `tool_calls` to canonical tool-call content parts."
  [tool-calls]
  (mapv (fn [tc]
          {:type :tool-call
           :id (:id tc)
           :name (get-in tc [:function :name])
           :arguments (js->clj (js/JSON.parse (get-in tc [:function :arguments])) :keywordize-keys true)})
        tool-calls))

(defn message->openai
  "Convert a canonical AgentMessage to an OpenAI chat message DTO."
  [message]
  (case (:role message)
    :user
    {:role "user"
     :content (input-content->string (:content message))}

    :assistant
    (let [text (content-parts->string (:content message))
          tool-calls (tool-calls->openai (:content message))]
      (cond-> {:role "assistant"}
        (seq text) (assoc :content text)
        (seq tool-calls) (assoc :tool_calls tool-calls)))

    :tool-result
    {:role "tool"
     :tool_call_id (:tool-call-id message)
     :content (input-content->string (:content message))}

    message))

(defn openai->message
  "Convert an OpenAI chat message DTO back to a canonical AgentMessage.

  Assistant messages require `defaults` containing `:api`, `:provider`,
  `:model`, `:usage`, `:stop-reason`, and `:timestamp` because those fields
  are not present in the OpenAI DTO."
  ([message] (openai->message message nil))
  ([message defaults]
   (case (keyword (:role message))
     :user
     {:role :user
      :content (if (string? (:content message))
                 [{:type :text :text (:content message)}]
                 [{:type :text :text (str (:content message))}])
      :timestamp (or (:timestamp message) (:timestamp defaults) 0)}

     :assistant
     (let [content (when (string? (:content message))
                     [{:type :text :text (:content message)}])
           tool-calls (openai-tool-calls->canonical (:tool_calls message))]
       {:role :assistant
        :content (vec (concat (or content []) tool-calls))
        :api (:api defaults "")
        :provider (:provider defaults "")
        :model (:model defaults "")
        :usage (:usage defaults {:input 0 :output 0 :cache-read 0 :cache-write 0 :total-tokens 0})
        :stop-reason (or (:stop-reason defaults) :stop)
        :timestamp (or (:timestamp defaults) 0)})

     :tool
     {:role :tool-result
      :tool-call-id (:tool_call_id message)
      :tool-name (or (:name message) "")
      :content (if (string? (:content message))
                 [{:type :text :text (:content message)}]
                 [{:type :text :text (str (:content message))}])
      :is-error (boolean (:is-error message false))
      :timestamp (or (:timestamp message) (:timestamp defaults) 0)}

     message)))

(defn- openai-usage->canonical
  "Convert OpenAI usage fields to the canonical usage schema."
  [usage]
  {:input (or (:prompt_tokens usage) 0)
   :output (or (:completion_tokens usage) 0)
   :cache-read (or (:prompt_cache_read_tokens usage) 0)
   :cache-write (or (:prompt_cache_write_tokens usage) 0)
   :total-tokens (or (:total_tokens usage) 0)})

(defn- openai-finish-reason->stop-reason
  [reason]
  (case reason
    "stop" :stop
    "length" :length
    "tool_calls" :tool-use
    "error" :error
    :stop))

(defn openai-response->assistant-message
  "Convert an OpenAI chat-completions response to a canonical AssistantMessage.

  `defaults` is merged with fields extracted from the response; use it for
  `:api` and `:provider` when they are not present in the response."
  [response defaults]
  (let [choice (first (:choices response))
        message (:message choice)
        tool-calls (openai-tool-calls->canonical (:tool_calls message))
        content (when (seq (:content message))
                  [{:type :text :text (:content message)}])]
    {:role :assistant
     :content (vec (concat (or content []) tool-calls))
     :api (or (:api defaults) "openai")
     :provider (or (:provider defaults) "openai")
     :model (or (:model response) (:model defaults) "")
     :usage (openai-usage->canonical (or (:usage response) {}))
     :stop-reason (openai-finish-reason->stop-reason (or (:finish_reason choice) "stop"))
     :timestamp (or (:timestamp defaults) (js/Date.now))}))

(defn openai-error-message
  "Build a canonical error AssistantMessage from an OpenAI error response."
  [error defaults]
  {:role :assistant
   :content [{:type :text :text (or (:message error) (str error))}]
   :api (or (:api defaults) "openai")
   :provider (or (:provider defaults) "openai")
   :model (or (:model defaults) "")
   :usage {:input 0 :output 0 :cache-read 0 :cache-write 0 :total-tokens 0}
   :stop-reason :error
   :error-message (or (:message error) (str error))
   :timestamp (js/Date.now)})

(defn messages->openai
  "Convert a vector of canonical AgentMessages to a vector of OpenAI messages."
  [messages]
  (mapv message->openai messages))

(defn openai->messages
  "Convert a vector of OpenAI chat messages to canonical AgentMessages.

  Assistant messages use the supplied `defaults` map."
  ([messages] (openai->messages messages nil))
  ([messages defaults]
   (mapv #(openai->message % defaults) messages)))

(defn openai-system-message
  "Create an OpenAI system message from a system prompt string."
  [system-prompt]
  {:role "system" :content system-prompt})

(defn openai-context
  "Build an OpenAI-compatible context map from a turn-processor context.

  Returns `{:system-prompt string :messages [...]}` where messages are OpenAI
  chat messages. Tools are not converted here; use `shape.tool` for the
  OpenAI function definitions."
  [context]
  {:system-prompt (:system-prompt context)
   :messages (messages->openai (:messages context))})

(defn context-from-openai
  "Convert an OpenAI-compatible context back to a turn-processor context.

  Assistant messages require `defaults` (see `openai->message`)."
  ([context] (context-from-openai context nil))
  ([context defaults]
   {:system-prompt (:system-prompt context)
    :messages (openai->messages (:messages context) defaults)}))

(defn validate-messages
  "Validate a sequence of canonical AgentMessages, returning nil on success
  or a sequence of Malli error maps on failure."
  [messages]
  (let [errors (keep (fn [m]
                       (when-not (law/valid-message? m)
                         {:message m :error (law/explain-message m)}))
                     messages)]
    (when (seq errors) errors)))
