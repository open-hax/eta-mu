(ns eta-mu.turn-processor.infra.loop
  "Async turn-loop orchestration.

  This namespace wires the pure domain decisions in `domain.turn` to concrete
  LLM streaming and tool execution. It emits the agent lifecycle events that
  higher layers (TUI, session manager) observe."
  (:require [eta-mu.turn-processor.domain.turn :as turn]))

(defn- ^:async emit! [emit event]
  (await (emit event)))

(defn- update-context! [context-atom message]
  (swap! context-atom update :messages conj message))

(defn- update-new-messages! [new-messages-atom message]
  (swap! new-messages-atom conj message))

(defn- ^:async stream-final-message
  "Consume a stream and return the final assistant message.

  A stream is a JS object with two methods:
    - next() -> Promise of {done, value} where value is a stream event
    - result() -> Promise of the final AssistantMessage

  The function emits message_start and message_end and returns the final message."
  [stream emit]
  (let [started? (atom false)]
    (loop []
      (let [chunk (await (.next stream))]
        (if (or (nil? chunk) (.-done chunk))
          (let [final (await (.result stream))]
            (when-not @started?
              (emit! emit {:type :message_start :message final}))
            (emit! emit {:type :message_end :message final})
            final)
          (let [^js event (.-value chunk)
                type (keyword (.-type event))]
            (when (and (= type :start) (not @started?))
              (let [partial (.-partial ^js event)]
                (emit! emit {:type :message_start :message partial})
                (reset! started? true)))
            (when (or (= type :start)
                      (= type :text_start)
                      (= type :text_delta)
                      (= type :text_end)
                      (= type :thinking_start)
                      (= type :thinking_delta)
                      (= type :thinking_end)
                      (= type :toolcall_start)
                      (= type :toolcall_delta)
                      (= type :toolcall_end))
              (let [partial (.-partial ^js event)]
                (emit! emit {:type :message_update
                             :message partial
                             :assistant-message-event event})))
            (recur)))))))

(defn- signal-aborted?
  "True when the abort signal (a JS AbortSignal) has fired."
  [signal]
  (boolean (and signal (.-aborted signal))))

(defn- tool-abort-error
  []
  (doto (js/Error. "Tool execution aborted")
    (aset "name" "AbortError")))

(defn- ^:async settle-start!
  "Await a tool start operation and settle the outer abort race exactly once."
  [start settle! resolve reject]
  (try
    (settle! resolve (await (start)))
    (catch :default error
      (settle! reject error))))

(defn- race-with-abort
  "Start one tool operation and race its result against `signal`. This keeps
  the turn pump resumable even when a tool ignores the AbortSignal."
  [signal start]
  (if (signal-aborted? signal)
    (js/Promise.reject (tool-abort-error))
    (js/Promise.
     (fn [resolve reject]
       (let [settled? (atom false)
             listener* (atom nil)
             cleanup! (fn []
                        (when (and signal @listener*)
                          (.removeEventListener signal "abort" @listener*)))
             settle! (fn [f value]
                       (when (compare-and-set! settled? false true)
                         (cleanup!)
                         (f value)))
             on-abort (fn []
                        (settle! reject (tool-abort-error)))]
         (reset! listener* on-abort)
         (when signal
           (.addEventListener signal "abort" on-abort #js {:once true}))
         ;; Cover an abort racing the listener registration.
         (if (signal-aborted? signal)
           (on-abort)
           (settle-start! start settle! resolve reject)))))))

(defn- ^:async execute-tool!
  "Execute a single prepared tool call and return an ExecutedToolCallOutcome.

  The tool is a map with an :execute function `(id args signal on-update)`.
  The abort signal from the run-loop config is passed through so tools can
  cancel in-flight work."
  [prepared emit signal]
  (let [tool (:tool prepared)
        tool-call (:tool-call prepared)
        args (:args prepared)
        updates (atom [])]
    (try
      (let [result (await
                    (race-with-abort
                     signal
                     (fn []
                       ((:execute tool)
                        (:id tool-call)
                        args
                        signal
                        (fn [partial]
                          (swap! updates conj
                                 (emit! emit {:type :tool_execution_update
                                              :tool-call-id (:id tool-call)
                                              :tool-name (:name tool-call)
                                              :args args
                                              :partial-result partial})))))))]
        (await (js/Promise.all (clj->js @updates)))
        {:result result :is-error false})
      (catch :default e
        (await (js/Promise.all (clj->js @updates)))
        {:result {:content [{:type :text
                             :text (str "Tool execution error: " (.-message e))}]
                  :details {}}
         :is-error true}))))

(defn- ^:async prepare-tool-call
  "Find the tool, validate arguments, and run beforeToolCall hook.

  Returns a finalized result map if blocked or errored, or a prepared map with
  :tool, :tool-call, :args."  
  [context assistant-message tool-call tools before-tool-call]
  (let [tool (turn/tool-by-name tools (:name tool-call))]
    (if-not tool
      (turn/missing-tool-result tool-call)
      (try
        (let [args (:arguments tool-call)]
          (if before-tool-call
            (let [result (await (before-tool-call {:assistant-message assistant-message
                                                   :tool-call tool-call
                                                   :args args
                                                   :context context}))]
              (if (:block result)
                (turn/missing-tool-result tool-call)
                {:tool tool :tool-call tool-call :args args}))
            {:tool tool :tool-call tool-call :args args}))
        (catch :default _e
          (turn/missing-tool-result tool-call))))))

(defn- ^:async execute-one!
  "Execute a single prepared tool call, emit lifecycle events, and return a
  finalized result."
  [prepared emit after-tool-call context signal]
  (emit! emit {:type :tool_execution_start
               :tool-call-id (get-in prepared [:tool-call :id])
               :tool-name (get-in prepared [:tool-call :name])
               :args (:args prepared)})
  (let [executed (await (execute-tool! prepared emit signal))
        finalized (turn/finalize-tool-result executed
                                             (:tool-call prepared)
                                             context
                                             after-tool-call)]
    (emit! emit {:type :tool_execution_end
                 :tool-call-id (get-in finalized [:tool-call :id])
                 :tool-name (get-in finalized [:tool-call :name])
                 :result (:result finalized)
                 :is-error (:is-error finalized)})
    finalized))

(defn- ^:async execute-tool-calls
  "Execute tool calls sequentially or in parallel and return finalized results.

  Emits tool_execution_start, tool_execution_update, and tool_execution_end events."  
  [context assistant-message tool-calls tools config emit]
  (let [mode (turn/execution-mode tool-calls tools (:tool-execution config :parallel))
        before-tool-call (:before-tool-call config)
        after-tool-call (:after-tool-call config)
        signal (:abort-signal config)]
    (if (= mode :parallel)
      (let [preparations (await (js/Promise.all
                                  (clj->js
                                    (mapv #(prepare-tool-call context assistant-message % tools before-tool-call)
                                          tool-calls))))
            immediate-results (filter :is-error preparations)
            prepared (remove :is-error preparations)
            finalized (await (js/Promise.all (clj->js (mapv #(execute-one! % emit after-tool-call context signal) prepared))))]
        (concat immediate-results finalized))
      (loop [acc [] remaining tool-calls]
        (if (empty? remaining)
          acc
          (let [tc (first remaining)
                prepared (await (prepare-tool-call context assistant-message tc tools before-tool-call))]
            (if (:is-error prepared)
              (recur (conj acc prepared) (rest remaining))
              (do (emit! emit {:type :tool_execution_start
                               :tool-call-id (get-in prepared [:tool-call :id])
                               :tool-name (get-in prepared [:tool-call :name])
                               :args (:args prepared)})
                  (let [executed (await (execute-tool! prepared emit signal))
                        finalized (turn/finalize-tool-result executed
                                                             (:tool-call prepared)
                                                             context
                                                             after-tool-call)]
                    (emit! emit {:type :tool_execution_end
                                 :tool-call-id (get-in finalized [:tool-call :id])
                                 :tool-name (get-in finalized [:tool-call :name])
                                 :result (:result finalized)
                                 :is-error (:is-error finalized)})
                    (recur (conj acc finalized) (rest remaining)))))))))))

(defn ^:async run-loop
  "Run the agent turn loop.

  Arguments:
    context   — AgentContext map with :system-prompt, :messages, :tools
    config    — map with :model, :convert-to-llm, optional :tool-execution,
                :before-tool-call, :after-tool-call, :get-steering-messages,
                :get-follow-up-messages, :api-key, :base-url, :abort-signal
    emit      — async event sink (event -> promise)
    stream-fn — (model llm-context options) -> stream object

  :abort-signal is a JS AbortSignal. It is forwarded to stream-fn options (as
  :signal) and to every tool :execute call, and the loop observes it at turn
  boundaries: after a streamed assistant message the loop halts before any
  tool execution, and after a tool batch it halts before the next stream.

  Returns the vector of new AgentMessages produced by the loop."
  [context config emit stream-fn]
  (let [ctx (atom context)
        new-messages (atom [])
        pending (atom [])
        signal (:abort-signal config)]
    (emit! emit {:type :agent_start})
    (emit! emit {:type :turn_start})

    (loop [first-turn? true]
      (when (seq @pending)
        (doseq [message @pending]
          (emit! emit {:type :message_start :message message})
          (emit! emit {:type :message_end :message message})
          (update-context! ctx message)
          (update-new-messages! new-messages message))
        (reset! pending []))

      (when-not first-turn?
        (emit! emit {:type :turn_start}))

      (let [llm-messages (await ((:convert-to-llm config) (:messages @ctx)))
            llm-context {:system-prompt (:system-prompt @ctx)
                         :messages llm-messages
                         :tools (:tools @ctx)}
            stream (await (stream-fn (:model config)
                                     llm-context
                                     {:api-key (:api-key config)
                                      :base-url (:base-url config)
                                      :signal signal}))
            assistant (await (stream-final-message stream emit))]
        (update-context! ctx assistant)
        (update-new-messages! new-messages assistant)

        (if (or (= (:stop-reason assistant) :error)
                (= (:stop-reason assistant) :aborted)
                (signal-aborted? signal))
          (do (emit! emit {:type :turn_end :message assistant :tool-results []})
              (emit! emit {:type :agent_end :messages @new-messages})
              (vec @new-messages))
          (let [tool-calls (turn/tool-calls-in-message assistant)]
            (if (seq tool-calls)
              (let [finalized (await (execute-tool-calls @ctx assistant tool-calls (:tools @ctx) config emit))
                    result-messages (map turn/build-tool-result-message finalized)]
                (doseq [message result-messages]
                  (emit! emit {:type :message_start :message message})
                  (emit! emit {:type :message_end :message message})
                  (update-context! ctx message)
                  (update-new-messages! new-messages message))
                (emit! emit {:type :turn_end :message assistant :tool-results result-messages})
                (if (or (turn/should-terminate-batch finalized)
                        (signal-aborted? signal))
                  (do (emit! emit {:type :agent_end :messages @new-messages})
                      (vec @new-messages))
                  (recur false)))
              (let [steering (when-let [f (:get-steering-messages config)] (await (f)))]
                (if (seq steering)
                  (do (reset! pending steering)
                      (recur false))
                  (let [follow-up (when-let [f (:get-follow-up-messages config)] (await (f)))]
                    (if (seq follow-up)
                      (do (reset! pending follow-up)
                          (recur false))
                      (do (emit! emit {:type :turn_end :message assistant :tool-results []})
                          (emit! emit {:type :agent_end :messages @new-messages})
                          (vec @new-messages)))))))))))))