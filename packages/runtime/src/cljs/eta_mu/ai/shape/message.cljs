(ns eta-mu.ai.shape.message
  "Canonical↔JS DTO conversions for the AI message model.

  JS DTOs use camelCase string keys and string enum values to match the
  legacy TypeScript types. All raw JS interop is delegated to
  eta-mu.ai.extern.js."
  (:require [eta-mu.ai.domain.message :as domain]
            [eta-mu.ai.extern.js :as extern]
            [eta-mu.ai.law.message :as law]
            [malli.core :as m]
            [malli.error :as me]))

(def ^:private content-type->external
  {:text "text"
   :image "image"
   :audio "audio"
   :thinking "thinking"
   :tool-call "toolCall"})

(def ^:private content-type->internal
  (into {} (map (fn [[k v]] [v k])) content-type->external))

(def ^:private role->external
  {:user "user"
   :assistant "assistant"
   :tool-result "toolResult"})

(def ^:private role->internal
  (into {} (map (fn [[k v]] [v k])) role->external))

(def ^:private stop-reason->external
  {:stop "stop"
   :length "length"
   :tool-use "toolUse"
   :error "error"
   :aborted "aborted"})

(def ^:private stop-reason->internal
  (into {} (map (fn [[k v]] [v k])) stop-reason->external))

(defn- maybe-keyword
  [value]
  (cond
    (keyword? value) value
    (string? value) (keyword value)
    :else value))

(defn- extensions->external
  [content]
  (reduce (fn [m [k v]]
            (assoc m k v))
          {}
          (domain/content-extensions content)))

(defn- extensions-from-external
  [content]
  (let [known #{:type :text :textSignature
                :data :mimeType
                :format
                :thinking :thinkingSignature :redacted
                :id :name :arguments :thoughtSignature}]
    (reduce (fn [m [k v]]
              (if (contains? known k)
                m
                (assoc m k v)))
            {}
            content)))

(defn content->js
  [content]
  (extern/clj->value
   (merge
    (case (:type content)
      :text
      (cond-> {:type "text"
               :text (:text content)}
        (:text-signature content) (assoc :textSignature (:text-signature content)))

      :image
      {:type "image"
       :data (:data content)
       :mimeType (:mime-type content)}

      :audio
      (cond-> {:type "audio"
                :data (:data content)
                :mimeType (:mime-type content)}
        (:format content) (assoc :format (name (:format content))))

      :thinking
      (cond-> {:type "thinking"
                :thinking (:thinking content)}
        (:thinking-signature content) (assoc :thinkingSignature (:thinking-signature content))
        (contains? content :redacted) (assoc :redacted (:redacted content)))

      :tool-call
      (cond-> {:type "toolCall"
                :id (:id content)
                :name (:name content)
                :arguments (:arguments content)}
        (:thought-signature content) (assoc :thoughtSignature (:thought-signature content)))

      content)
    (extensions->external content))))

(defn- validate!
  [schema value label]
  (when-not (m/validate schema value)
    (throw (ex-info (str "Invalid AI " label)
                    {:label label
                     :errors (me/humanize (m/explain schema value))
                     :value value}))))

(defn content-from-js
  [value]
  (let [content (extern/value->clj value)
        content-type (get content-type->internal (:type content))
        internal (case content-type
                   :text
                   (cond-> {:type :text
                             :text (or (:text content) "")}
                     (:textSignature content) (assoc :text-signature (:textSignature content))
                     (:text-signature content) (assoc :text-signature (:text-signature content)))

                   :image
                   {:type :image
                    :data (:data content)
                    :mime-type (or (:mimeType content) (:mime-type content))}

                   :audio
                   (cond-> {:type :audio
                             :data (:data content)
                             :mime-type (or (:mimeType content) (:mime-type content))}
                     (:format content) (assoc :format (maybe-keyword (:format content))))

                   :thinking
                   (cond-> {:type :thinking
                             :thinking (or (:thinking content) "")}
                     (:thinkingSignature content) (assoc :thinking-signature (:thinkingSignature content))
                     (:thinking-signature content) (assoc :thinking-signature (:thinking-signature content))
                     (contains? content :redacted) (assoc :redacted (boolean (:redacted content))))

                   :tool-call
                   (cond-> {:type :tool-call
                             :id (:id content)
                             :name (:name content)
                             :arguments (or (:arguments content) {})}
                     (:thoughtSignature content) (assoc :thought-signature (:thoughtSignature content))
                     (:thought-signature content) (assoc :thought-signature (:thought-signature content)))

                   content)
         internal (merge internal (extensions-from-external content))]
     (validate! law/content-part-schema internal "content part")
     internal))

(defn usage->js
  [usage]
  (extern/clj->value
   {:input (:input usage)
    :output (:output usage)
    :cacheRead (:cache-read usage)
    :cacheWrite (:cache-write usage)
    :totalTokens (:total-tokens usage)
    :cost {:input (get-in usage [:cost :input])
           :output (get-in usage [:cost :output])
           :cacheRead (get-in usage [:cost :cache-read])
           :cacheWrite (get-in usage [:cost :cache-write])
           :total (get-in usage [:cost :total])}}))

(defn usage-from-js
  [value]
  (let [usage (extern/value->clj value)]
    {:input (:input usage)
     :output (:output usage)
     :cache-read (or (:cacheRead usage) (:cache-read usage))
     :cache-write (or (:cacheWrite usage) (:cache-write usage))
     :total-tokens (or (:totalTokens usage) (:total-tokens usage))
     :cost {:input (get-in usage [:cost :input])
            :output (get-in usage [:cost :output])
            :cache-read (or (get-in usage [:cost :cacheRead]) (get-in usage [:cost :cache-read]))
            :cache-write (or (get-in usage [:cost :cacheWrite]) (get-in usage [:cost :cache-write]))
            :total (get-in usage [:cost :total])}}))

(defn message->js
  [message]
  (extern/clj->value
   (case (:role message)
     :user
     {:role "user"
      :content (mapv content->js (:content message))
      :timestamp (:timestamp message)}

     :assistant
     (cond-> {:role "assistant"
               :content (mapv content->js (:content message))
               :api (:api message)
               :provider (:provider message)
               :model (:model message)
               :usage (usage->js (:usage message))
               :stopReason (stop-reason->external (:stop-reason message))
               :timestamp (:timestamp message)}
       (:response-id message) (assoc :responseId (:response-id message))
       (:error-message message) (assoc :errorMessage (:error-message message)))

     :tool-result
     (cond-> {:role "toolResult"
               :toolCallId (:tool-call-id message)
               :toolName (:tool-name message)
               :content (mapv content->js (:content message))
               :isError (:is-error message)
               :timestamp (:timestamp message)}
       (contains? message :details) (assoc :details (:details message)))

     message)))

(defn message-from-js
  [value]
  (let [message (extern/value->clj value)
        role (get role->internal (:role message))]
    (case role
      :user
      (domain/user-message (mapv content-from-js (:content message)) (:timestamp message))

      :assistant
      (domain/assistant-message
       {:content (mapv content-from-js (:content message))
        :api (:api message)
        :provider (:provider message)
        :model (:model message)
        :usage (usage-from-js (:usage message))
        :stop-reason (get stop-reason->internal (or (:stopReason message) (:stop-reason message)))
        :timestamp (:timestamp message)
        :response-id (or (:responseId message) (:response-id message))
        :error-message (or (:errorMessage message) (:error-message message))})

      :tool-result
      (domain/tool-result-message
       {:tool-call-id (or (:toolCallId message) (:tool-call-id message))
        :tool-name (or (:toolName message) (:tool-name message))
        :content (mapv content-from-js (:content message))
        :is-error (boolean (or (:isError message) (:is-error message)))
        :timestamp (:timestamp message)
        :details (:details message)})

      message)))

(defn tool->js
  [tool]
  (extern/clj->value
   {:name (:name tool)
    :description (:description tool)
    :parameters (:parameters tool)}))

(defn tool-from-js
  [value]
  (let [tool (extern/value->clj value)]
    (domain/tool (:name tool) (:description tool) (:parameters tool))))

(defn context->js
  [context]
  (extern/clj->value
   (cond-> {:messages (mapv message->js (:messages context))}
     (contains? context :system-prompt) (assoc :systemPrompt (:system-prompt context))
     (contains? context :tools) (assoc :tools (mapv tool->js (:tools context))))))

(defn context-from-js
  [value]
  (let [context (extern/value->clj value)]
    (domain/context
     {:system-prompt (or (:systemPrompt context) (:system-prompt context))
      :messages (mapv message-from-js (:messages context))
      :tools (when (:tools context) (mapv tool-from-js (:tools context)))})))
