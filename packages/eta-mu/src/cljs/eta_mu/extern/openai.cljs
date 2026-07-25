(ns eta-mu.extern.openai
  "OpenAI-compatible chat-completions client for the eta-mu agent command.

  This is an extern boundary: it performs raw Node HTTP via `js/fetch` and
  returns a stream object compatible with `eta-mu.turn-processor.infra.loop`.

  Requests are sent with `stream: true`; the response body is a
  `text/event-stream` (SSE) that is parsed incrementally and turned into
  `:start` / `:text_start` / `:text_delta` / `:text_end` / `:toolcall_start`
  / `:toolcall_delta` / `:toolcall_end` stream events as chunks arrive. The
  turn-processor loop drains these via `.next()` before asking `.result()`
  for the final canonical AssistantMessage."
  (:require [clojure.string :as str]
            [eta-mu.turn-processor.shape.message :as shape.msg]
            [eta-mu.turn-processor.shape.tool :as shape.tool]
            [eta-mu.extern.process :as process]))

(def default-base-url "https://api.openai.com/v1/chat/completions")

(defn- build-system-message
  "Wrap a system prompt string as an OpenAI system message."
  [system-prompt]
  {:role "system" :content system-prompt})

(defn- no-provider-configured-message
  "A clear, actionable error in place of OpenAI's raw 401 body — this is what
  a user sees when they run `eta-mu agent` with no provider set up at all."
  [model]
  {:message (str "No API key configured, and no alternate provider set either.\n"
                "eta-mu agent needs to know which LLM to talk to before it can do anything:\n"
                "  - Set an API key: --api-key <key>, or the OPENAI_AUTH_TOKEN / OPENAI_API_KEY env var.\n"
                "  - Or point at a different provider/local proxy: --base-url <url>, or the OPENAI_BASE_URL env var\n"
                "    (must be a full chat-completions endpoint, e.g. http://localhost:8080/v1/chat/completions).\n"
                "See packages/eta-mu/README.md for the full setup guide.")
   :model (:id model)})

(defn- done-stream
  "A stream that immediately signals `:done` and resolves `.result()` to `message`."
  [message]
  #js {:next (fn [] (js/Promise.resolve #js {:done true}))
       :result (fn [] (js/Promise.resolve message))})

;; --- SSE parsing --------------------------------------------------------

(defn- split-sse-blocks
  "Split a buffered SSE text blob on blank-line boundaries.

  Returns `[complete-blocks remaining-buffer]` — `remaining-buffer` is the
  trailing, possibly-incomplete block to keep buffering."
  [buffer]
  (let [parts (str/split buffer #"\n\n" -1)]
    [(vec (butlast parts)) (or (last parts) "")]))

(defn- block->payload
  "Extract the `data: ...` payload string from one SSE event block, or nil."
  [block]
  (some (fn [line]
          (when (str/starts-with? line "data:")
            (str/trim (subs line 5))))
        (str/split-lines block)))

(defn- payload->chunk
  "Parse an SSE data payload into a chunk map, or `::done` for the `[DONE]` sentinel."
  [payload]
  (if (= payload "[DONE]")
    ::done
    (js->clj (js/JSON.parse payload) :keywordize-keys true)))

(defn- safe-parse-json
  "Parse a (possibly incomplete) JSON string, returning `{}` on failure."
  [s]
  (try
    (js->clj (js/JSON.parse s) :keywordize-keys true)
    (catch :default _ {})))

;; --- Delta accumulation --------------------------------------------------

(defn- new-accumulator []
  {:text "" :tool-calls (sorted-map) :finish-reason nil :usage nil :open nil})

(defn- partial-message
  "Build a canonical (but possibly incomplete) AssistantMessage from the
  accumulator's current state, for use as a stream event's `:partial`."
  [acc model-id]
  (let [{:keys [text tool-calls]} acc
        tool-call-parts (mapv (fn [[_ tc]]
                                {:type :tool-call
                                 :id (:id tc)
                                 :name (:name tc)
                                 :arguments (safe-parse-json (:arguments tc))})
                              tool-calls)
        content (vec (concat (when (seq text) [{:type :text :text text}])
                             tool-call-parts))]
    {:role :assistant
     :content content
     :api "openai"
     :provider "openai"
     :model model-id
     :usage {:input 0 :output 0 :cache-read 0 :cache-write 0 :total-tokens 0}
     :stop-reason nil
     :timestamp (js/Date.now)}))

(defn- event
  "Build the JS envelope expected by `eta-mu.turn-processor.infra.loop`: a JS
  object with a string `:type` and a plain ClojureScript map `:partial`."
  [type-str partial]
  #js {:type type-str :partial partial})

(defn- close-open!
  "Emit the `*_end` event for whatever content segment is currently open."
  [acc-atom queue model-id]
  (case (:open @acc-atom)
    :text (.push queue (event "text_end" (partial-message @acc-atom model-id)))
    nil nil
    (.push queue (event "toolcall_end" (partial-message @acc-atom model-id))))
  (swap! acc-atom assoc :open nil))

(defn- apply-tool-call-delta!
  [acc-atom queue model-id tc]
  (let [idx (:index tc)]
    (when (not= (:open @acc-atom) [:toolcall idx])
      (close-open! acc-atom queue model-id)
      (swap! acc-atom (fn [acc]
                        (-> acc
                            (assoc :open [:toolcall idx])
                            (update :tool-calls
                                    #(if (contains? % idx) % (assoc % idx {:id (:id tc) :name (get-in tc [:function :name]) :arguments ""}))))))
      (.push queue (event "toolcall_start" (partial-message @acc-atom model-id))))
    (when (:id tc) (swap! acc-atom assoc-in [:tool-calls idx :id] (:id tc)))
    (when (get-in tc [:function :name])
      (swap! acc-atom assoc-in [:tool-calls idx :name] (get-in tc [:function :name])))
    (when-let [frag (get-in tc [:function :arguments])]
      (swap! acc-atom update-in [:tool-calls idx :arguments] str frag))
    (.push queue (event "toolcall_delta" (partial-message @acc-atom model-id)))))

(defn- apply-chunk!
  "Fold one parsed SSE chunk into the accumulator, pushing stream events onto `queue`."
  [acc-atom queue model-id chunk]
  (when-let [usage (:usage chunk)]
    (swap! acc-atom assoc :usage usage))
  (let [choice (first (:choices chunk))
        delta (:delta choice)
        finish (:finish_reason choice)]
    (when-let [content (:content delta)]
      (when (not= (:open @acc-atom) :text)
        (close-open! acc-atom queue model-id)
        (swap! acc-atom assoc :open :text)
        (.push queue (event "text_start" (partial-message @acc-atom model-id))))
      (swap! acc-atom update :text str content)
      (.push queue (event "text_delta" (partial-message @acc-atom model-id))))
    (doseq [tc (:tool_calls delta)]
      (apply-tool-call-delta! acc-atom queue model-id tc))
    (when finish
      (close-open! acc-atom queue model-id)
      (swap! acc-atom assoc :finish-reason finish))))

(defn- accumulator->response
  "Reshape the accumulator's final state into an OpenAI non-streaming
  response map, so the existing `shape.message` conversion can be reused."
  [acc model-id]
  (let [{:keys [text tool-calls finish-reason usage]} acc
        message (cond-> {:role "assistant"}
                  (seq text) (assoc :content text)
                  (seq tool-calls) (assoc :tool_calls
                                          (mapv (fn [[_ tc]]
                                                 {:id (:id tc)
                                                  :type "function"
                                                  :function {:name (:name tc) :arguments (:arguments tc)}})
                                                tool-calls)))]
    {:model model-id
     :choices [{:message message :finish_reason (or finish-reason "stop")}]
     :usage usage}))

;; --- Network pump ---------------------------------------------------------

(defn- ^:async pull-network!
  "Read from the SSE reader until at least one event is queued or the
  network stream ends. Returns `true` if the network is exhausted."
  [reader decoder acc-atom queue model-id buffer-atom]
  (loop []
    (if (seq queue)
      false
      (let [result (await (.read reader))]
        (if (.-done result)
          (do
            ;; best-effort: fold a trailing block with no terminating blank line
            (when-let [payload (block->payload @buffer-atom)]
              (let [chunk (payload->chunk payload)]
                (when (and (map? chunk) (not= chunk ::done))
                  (apply-chunk! acc-atom queue model-id chunk))))
            true)
          (let [text (.decode decoder (.-value result) #js {:stream true})
                [blocks remainder] (split-sse-blocks (str @buffer-atom text))]
            (reset! buffer-atom remainder)
            (doseq [block blocks]
              (when-let [payload (block->payload block)]
                (let [chunk (payload->chunk payload)]
                  (when (map? chunk) (apply-chunk! acc-atom queue model-id chunk)))))
            (recur)))))))

(defn- ^:async drain-events!
  "Pull from the network until `state`'s queue is non-empty or the network
  is exhausted. Returns `true` once the network is exhausted."
  [state]
  (let [{:keys [reader decoder acc-atom queue model-id buffer-atom network-done-atom]} state]
    (if @network-done-atom
      true
      (let [done? (await (pull-network! reader decoder acc-atom queue model-id buffer-atom))]
        (reset! network-done-atom done?)
        done?))))

(defn- ^:async drain-fully!
  "Keep pulling from the network (discarding any queued events) until it is
  exhausted, then return the final accumulated AssistantMessage."
  [state]
  (let [{:keys [queue model-id acc-atom network-done-atom]} state]
    (loop []
      (if @network-done-atom
        (shape.msg/openai-response->assistant-message
         (accumulator->response @acc-atom model-id)
         {:api "openai" :provider "openai" :model model-id})
        (do (await (drain-events! state))
            (.splice queue 0)
            (recur))))))

(defn- ^:async stream-next! [state]
  (await (drain-events! state))
  (if (seq (:queue state))
    #js {:done false :value (.shift (:queue state))}
    #js {:done true}))

(defn- sse-stream
  "Build a turn-processor-compatible stream that reads and parses SSE chunks
  from `response` as they arrive."
  [response model-id]
  (let [queue #js []
        state {:reader (.getReader (.-body response))
               :decoder (js/TextDecoder.)
               :acc-atom (atom (new-accumulator))
               :queue queue
               :model-id model-id
               :buffer-atom (atom "")
               :network-done-atom (atom false)}]
    ;; Seed a `:start` event up front so `message_start` fires immediately,
    ;; before the first real content/tool-call delta arrives.
    (.push queue (event "start" (partial-message (new-accumulator) model-id)))
    #js {:next (fn [] (stream-next! state))
         :result (fn [] (drain-fully! state))}))

;; --- Request ---------------------------------------------------------------

(defn- ^:async post-chat
  "POST to the chat-completions endpoint with `stream: true` and return the
  raw fetch Response (not yet read)."
  [base-url auth-token model messages tools signal]
  (let [body (cond-> {:model (:id model)
                         :messages (clj->js messages)
                         :stream true
                         :stream_options {:include_usage true}}
                 (seq tools) (assoc :tools (clj->js tools)))
        headers (cond-> {"Content-Type" "application/json"}
                  auth-token (assoc "Authorization" (str "Bearer " auth-token)))
        request #js {:method "POST"
                     :headers (clj->js headers)
                     :body (js/JSON.stringify (clj->js body))}]
    (when signal
      (aset request "signal" signal))
    (await (js/fetch base-url request))))

(defn ^:async stream-chat
  "Create a turn-processor-compatible stream from an OpenAI-compatible chat-completions call.

  `model` is a map `{:id string :provider string}`.
  `llm-context` is `{:system-prompt string :messages [...] :tools [...]}`.
  `options` may contain:
    :api-key    — Bearer token (custom endpoints may instead use
                  OPENAI_BASE_URL_API_KEY; the default endpoint falls back to
                  OPENAI_AUTH_TOKEN, then OPENAI_API_KEY)
    :base-url   — full endpoint URL (falls back to OPENAI_BASE_URL,
                  then https://api.openai.com/v1/chat/completions)
    :signal     — AbortSignal forwarded to fetch"
  [model llm-context options]
  (let [base-url (or (:base-url options)
                     (process/env "OPENAI_BASE_URL")
                     default-base-url)
        custom-endpoint? (not= base-url default-base-url)
        auth-token (or (:api-key options)
                       (if custom-endpoint?
                         ;; A custom endpoint must opt into its own credential;
                         ;; never reuse ambient OpenAI secrets for it.
                         (process/env "OPENAI_BASE_URL_API_KEY")
                         (or (process/env "OPENAI_AUTH_TOKEN")
                             (process/env "OPENAI_API_KEY"))))]
    (if (and (nil? auth-token) (= base-url default-base-url))
      (done-stream (shape.msg/openai-error-message (no-provider-configured-message model) {:model (:id model)}))
      (let [system-prompt (:system-prompt llm-context)
            messages (:messages llm-context)
            messages (if (some? system-prompt)
                       (vec (cons (build-system-message system-prompt) messages))
                       messages)
            tools (shape.tool/tools->openai (:tools llm-context))]
        (try
          (let [response (await (post-chat base-url auth-token model messages tools
                                           (:signal options)))]
            (if (.-ok response)
              (sse-stream response (:id model))
              (let [error (js->clj (await (.json response)) :keywordize-keys true)]
                (done-stream (shape.msg/openai-error-message
                              {:message (str "LLM API error: " (pr-str error))}
                              {:model (:id model)})))))
          (catch :default e
            (done-stream (shape.msg/openai-error-message
                          {:message (.-message e)}
                          {:model (:id model)}))))))))
