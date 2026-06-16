(ns eta-mu.ai.domain.message
  "Pure constructors and predicates for the canonical AI message model.

  All constructors validate against eta-mu.ai.law.message schemas and return
  canonical kebab-case maps. No JS interop is used here."
  (:require [eta-mu.ai.law.message :as law]
            [malli.core :as m]
            [malli.error :as me]))

(defn- validate!
  "Validate value against schema, throwing on mismatch."
  [schema value label]
  (if (m/validate schema value)
    value
    (throw (ex-info (str "Invalid AI " label)
                    {:label label
                     :errors (me/humanize (m/explain schema value))
                     :value value}))))

(defn text-content
  ([text]
   (text-content text nil))
  ([text text-signature]
   (validate! law/text-content-schema
              (cond-> {:type :text :text (or text "")}
                (some? text-signature) (assoc :text-signature text-signature))
              "text content")))

(defn image-content
  [data mime-type]
  (validate! law/image-content-schema
             {:type :image :data data :mime-type mime-type}
             "image content"))

(defn audio-content
  ([data mime-type]
   (audio-content data mime-type nil))
  ([data mime-type format]
   (validate! law/audio-content-schema
              (cond-> {:type :audio :data data :mime-type mime-type}
                (some? format) (assoc :format format))
              "audio content")))

(defn thinking-content
  ([thinking]
   (thinking-content thinking nil))
  ([thinking thinking-signature]
   (validate! law/thinking-content-schema
              (cond-> {:type :thinking :thinking (or thinking "")}
                (some? thinking-signature) (assoc :thinking-signature thinking-signature))
              "thinking content"))
  ([thinking thinking-signature redacted]
   (validate! law/thinking-content-schema
              {:type :thinking
               :thinking (or thinking "")
               :thinking-signature thinking-signature
               :redacted redacted}
              "thinking content")))

(defn tool-call
  ([id name arguments]
   (tool-call id name arguments nil))
  ([id name arguments thought-signature]
   (validate! law/tool-call-schema
              (cond-> {:type :tool-call :id id :name name :arguments (or arguments {})}
                (some? thought-signature) (assoc :thought-signature thought-signature))
              "tool call")))

(defn input-content-vector
  "Normalize string content into a canonical input content vector."
  [content]
  (let [normalized (if (string? content)
                     [(text-content content)]
                     (vec content))]
    (doseq [part normalized]
      (validate! law/input-content-schema part "input content"))
    normalized))

(defn user-message
  [content timestamp]
  (validate! law/user-message-schema
             {:role :user
              :content (input-content-vector content)
              :timestamp timestamp}
             "user message"))

(defn assistant-message
  [{:keys [content api provider model usage stop-reason timestamp
           response-id error-message]}]
  (validate! law/assistant-message-schema
             (cond-> {:role :assistant
                        :content (vec content)
                        :api api
                        :provider provider
                        :model model
                        :usage usage
                        :stop-reason stop-reason
                        :timestamp timestamp}
               (some? response-id) (assoc :response-id response-id)
               (some? error-message) (assoc :error-message error-message))
             "assistant message"))

(defn tool-result-message
  [{:keys [tool-call-id tool-name content is-error timestamp details]}]
  (validate! law/tool-result-message-schema
             (cond-> {:role :tool-result
                        :tool-call-id tool-call-id
                        :tool-name tool-name
                        :content (input-content-vector content)
                        :is-error (boolean is-error)
                        :timestamp timestamp}
               (some? details) (assoc :details details))
             "tool result message"))

(defn tool
  [name description parameters]
  (validate! law/tool-schema
             {:name name :description description :parameters parameters}
             "tool"))

(defn context
  [{:keys [system-prompt messages tools]}]
  (validate! law/context-schema
             (cond-> {:messages (vec messages)}
               (some? system-prompt) (assoc :system-prompt system-prompt)
               (some? tools) (assoc :tools (vec tools)))
             "context"))

(defn text-content? [x] (= (:type x) :text))
(defn image-content? [x] (= (:type x) :image))
(defn audio-content? [x] (= (:type x) :audio))
(defn thinking-content? [x] (= (:type x) :thinking))
(defn tool-call? [x] (= (:type x) :tool-call))

(defn user-message? [x] (= (:role x) :user))
(defn assistant-message? [x] (= (:role x) :assistant))
(defn tool-result-message? [x] (= (:role x) :tool-result))

(defn content-extensions
  "Return the extension keys of a content part beyond the canonical schema.

  Used to preserve provider-specific extensibility (e.g. image/audio variants)
  during canonical round-trips."
  [content]
  (let [base (case (:type content)
               :text #{:type :text :text-signature}
               :image #{:type :data :mime-type}
               :audio #{:type :data :mime-type :format}
               :thinking #{:type :thinking :thinking-signature :redacted}
               :tool-call #{:type :id :name :arguments :thought-signature}
               #{})]
    (reduce (fn [ext k]
              (if (contains? base k)
                ext
                (assoc ext k (get content k))))
            {}
            (keys content))))
