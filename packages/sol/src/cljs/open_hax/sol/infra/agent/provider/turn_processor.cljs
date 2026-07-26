(ns open-hax.sol.infra.agent.provider.turn-processor
  "Turn-processor provider adapter for agent runtime session construction.

   Sessions are `open-hax.sol.infra.agent.turn-session` records whose turns
   run through the turn-processor run-loop with `eta-mu.extern.openai`
   streaming; model and auth arrive as plain config resolved from sol's
   decoupled settings (no SDK singletons, no on-disk models.json)."
  (:require [clojure.string :as str]
            [eta-mu.extern.openai :as openai]
            [eta-mu.infra.tools.registry :as tool-registry]
            [eta-mu.turn-processor.infra.loop :as loop]
            [eta-mu.turn-processor.shape.message :as shape.msg]
            [open-hax.sol.domain.agent.settings :as agent-settings]
            [open-hax.sol.domain.models :as models]
            [open-hax.sol.extern.process :as process]
            [open-hax.sol.infra.agent.media :as media]
            [open-hax.sol.infra.agent.provider :refer [fetch-proxx-model-ids!]]
            [open-hax.sol.infra.agent.turn-session :as turn-session]
            [open-hax.sol.shape.agent :as agent-shape]))

(defprotocol IAgentProviderAdapter
  (ensure-runtime! [provider])
  (resolve-model [provider models provider-id model-id fallback-model-id])
  (create-session! [provider session-request])
  (send-message! [provider provider-session message-request])
  (subscribe-stream! [provider provider-session handlers]))

(defn- ^:async ensure-runtime-impl!
  [config]
  (let [model-ids (await (fetch-proxx-model-ids! config))]
    {:models (models/models-config config model-ids)}))

(defn- provider-credentials
  [config model]
  (let [auth (agent-settings/provider-auth config process/env-var)
        provider-id (or (some-> (:provider model) str) "proxx")]
    (get auth provider-id)))

(defn- part-type
  [part]
  (some-> (:type part) name keyword))

(defn- data-url
  [part default-mime-type]
  (or (some-> (:url part) str str/trim not-empty)
      (when-let [data (some-> (:data part) str str/trim not-empty)]
        (str "data:" (or (:mime-type part) default-mime-type) ";base64," data))))

(defn- openai-audio-format
  [part]
  (case (some-> (:mime-type part) str str/lower-case)
    "audio/wav" "wav"
    "audio/wave" "wav"
    "audio/x-wav" "wav"
    "audio/mpeg" "mp3"
    "audio/mp3" "mp3"
    (throw (ex-info "OpenAI audio input supports only WAV or MP3"
                    {:mime-type (:mime-type part)}))))

(defn- content-part->openai
  [part]
  (case (part-type part)
    :text
    {:type "text" :text (str (or (:text part) ""))}

    :image
    (if-let [url (data-url part "image/png")]
      {:type "image_url" :image_url {:url url}}
      (throw (ex-info "Image content must include :url or :data" {:part part})))

    :audio
    (if-let [data (some-> (:data part) str str/trim not-empty)]
      {:type "input_audio"
       :input_audio {:data data :format (openai-audio-format part)}}
      (throw (ex-info "Audio content must be materialized to :data before projection"
                      {:part part})))

    nil))

(defn- media-part?
  [part]
  (contains? #{:image :audio} (part-type part)))

(declare messages->openai)

(defn- ^:async materialize-audio-part!
  [materialize! part]
  (if (and (= :audio (part-type part))
           (nil? (some-> (:data part) str str/trim not-empty))
           (some-> (:url part) str str/trim not-empty))
    (do
      (when-not materialize!
        (throw (ex-info "Audio content must be materialized to :data before projection"
                        {:part part})))
      (let [materialized
            (await (materialize!
                    {:type "audio"
                     :url (:url part)
                     :mimeType (or (:mime-type part)
                                   (:mimeType part)
                                   "audio/mpeg")}))
            data (some-> (:data materialized) str str/trim not-empty)]
        (when-not data
          (throw (ex-info "Audio materialization returned no data"
                          {:part part})))
        {:type :audio
         :data data
         :mime-type (or (:mimeType materialized)
                        (:mime-type materialized)
                        (:mime-type part)
                        (:mimeType part)
                        "audio/mpeg")}))
    part))

(defn- ^:async materialize-message-audio!
  [materialize! message]
  (if (vector? (:content message))
    (let [parts (await
                 (js/Promise.all
                  (to-array
                   (map #(materialize-audio-part! materialize! %)
                        (:content message)))))]
      (assoc message :content (vec (array-seq parts))))
    message))

(defn ^:async messages->openai!
  "Materialize URL-backed audio, then project canonical messages to the
  synchronous OpenAI wire shape."
  [materialize! messages]
  (let [hydrated (await
                  (js/Promise.all
                   (to-array
                    (map #(materialize-message-audio! materialize! %)
                         messages))))]
    (messages->openai (vec (array-seq hydrated)))))

(defn- tool-result->openai
  [message]
  (let [content (vec (:content message))
        media (->> content (filter media-part?) (keep content-part->openai) vec)]
    (if (seq media)
      (let [text (->> content
                      (filter #(= :text (part-type %)))
                      (map :text)
                      (remove str/blank?)
                      (str/join "\n"))]
        [{:role "tool"
          :tool_call_id (:tool-call-id message)
          :content (if (seq text) text "(see attached media)")}
         {:role "user"
          :content (into [{:type "text" :text "Attached media from tool result:"}]
                         media)}])
      [(shape.msg/message->openai message)])))

(defn messages->openai
  "Project canonical turn messages to OpenAI chat-completions messages without
   silently flattening image/audio parts. Tool-result media follows the
   corresponding tool message as a user media message, matching the legacy
   compatibility adapter."
  [messages]
  (->> messages
       (mapcat
        (fn [message]
          (cond
            (= :tool-result (:role message))
            (tool-result->openai message)

            (and (= :user (:role message))
                 (vector? (:content message))
                 (some media-part? (:content message)))
            [{:role "user"
              :content (->> (:content message)
                            (keep content-part->openai)
                            vec)}]

            :else
            [(shape.msg/message->openai message)])))
       vec))

(defn- create-session-impl!
  [config {:keys [model thinking-level system-prompt custom-tools
                  tool-name-allowlist materialize!]}]
  (let [credentials (provider-credentials config model)
        tools (media/wrap-tools materialize!
                                (into (vec tool-registry/tools) (or custom-tools [])))
        session (turn-session/make-session
                 {:run-loop loop/run-loop
                  :stream-fn openai/stream-chat
                  :convert-to-llm (fn [messages]
                                    (messages->openai! materialize! messages))
                  :model (select-keys model [:id :provider])
                  :api-key (:api-key credentials)
                  :base-url (:base-url credentials)
                  :system-prompt system-prompt
                  :tools tools
                  :thinking-level thinking-level
                  :active-tools tool-name-allowlist})]
    {:session session}))

(defrecord TurnProcessorProviderAdapter [runtime config]
  IAgentProviderAdapter
  (ensure-runtime! [_]
    (ensure-runtime-impl! config))

  (resolve-model [_ models provider-id model-id fallback-model-id]
    (models/find-model models provider-id model-id fallback-model-id))

  (create-session! [_ session-request]
    (create-session-impl! config session-request))

  (send-message! [_ provider-session message-request]
    (agent-shape/send-user-message! provider-session (:content message-request)))

  (subscribe-stream! [_ provider-session handlers]
    (agent-shape/subscribe! provider-session (:handler handlers))))

(defn turn-processor-provider
  [runtime config]
  (->TurnProcessorProviderAdapter runtime config))
