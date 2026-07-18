(ns open-hax.sol.infra.agent.turn-session
  "IAgentSession implementation whose turns are driven by the turn-processor
   run-loop.

   Session state is plain CLJS data in atoms: the message history is a vector
   of turn-processor-law-shaped AgentMessages (built by construction, never
   wrapped in a JS session object), turns are serialized through a pump so at
   most one turn is in flight, and abort is a per-turn js/AbortController
   whose signal the run-loop threads through streaming and tool execution.

   The run-loop arrives as :run-loop in the session deps (the
   `eta-mu.turn-processor.infra.loop/run-loop` signature). It is injected
   rather than required so this namespace carries no compile-time dependency
    on the turn-processor classpath entry; the provider wiring hands the real
    run-loop in. No legacy CLI SDK import lives here."
  (:require [open-hax.sol.shape.agent :refer [IAgentSession]]))

(defn- now-ms
  []
  (.now js/Date))

(defn- coerce-content-part
  "Coerce a sol ContentPart-ish map into a turn-processor-law input content part."
  [part]
  (let [mime-type (or (:mime-type part) (:mimeType part))]
    (cond-> {:type (keyword (:type part))}
      (:text part) (assoc :text (:text part))
      (:url part) (assoc :url (:url part))
      (:data part) (assoc :data (:data part))
      mime-type (assoc :mime-type mime-type))))

(defn- ->user-message
  "Coerce outbound content into a turn-processor-law-shaped user message."
  [content]
  (cond
    (string? content)
    {:role :user :content content :timestamp (now-ms)}

    (vector? content)
    {:role :user :content (mapv coerce-content-part content) :timestamp (now-ms)}

    (map? content)
    (merge {:timestamp (now-ms)} content)

    :else
    {:role :user :content (str content) :timestamp (now-ms)}))

(defn- active-tool-list
  "Filter the session's tools to the active name set; nil/empty means all."
  [tools active]
  (let [tools (vec (or tools []))]
    (if (seq active)
      (filterv #(contains? active (:name %)) tools)
      tools)))

(defn- fan-out!
  "Deliver one run-loop event to every subscriber. A throwing handler must
   never break the turn."
  [state* event]
  (doseq [handler (:subscribers @state*)]
    (try
      (handler event)
      (catch :default _ nil)))
  (js/Promise.resolve nil))

(defn- drain-queue!
  "Return and clear one queued-message list (steering or follow-up)."
  [state* queue-key]
  (let [queued (vec (get @state* queue-key))]
    (when (seq queued)
      (swap! state* assoc queue-key []))
    queued))

(defn ^:async run-queued-turn!
  "Run one queued turn through the run-loop and append the user message plus
   the loop's new messages to history. Returns the new messages; the pump
   settles the turn's promise once post-turn state is final."
  [state* deps turn]
  (let [controller (js/AbortController.)
        session-config (:config @state*)
        context {:system-prompt (:system-prompt deps)
                 :messages (conj (vec (:messages @state*)) (:user-message turn))
                 :tools (active-tool-list (:tools deps) (:active-tools session-config))}
        config (cond-> {:model (:model deps)
                        :convert-to-llm (:convert-to-llm deps)
                        :abort-signal (.-signal controller)
                        :get-steering-messages (fn [] (drain-queue! state* :steering-queue))
                        :get-follow-up-messages (fn [] (drain-queue! state* :follow-up-queue))}
                 (:api-key deps) (assoc :api-key (:api-key deps))
                 (:base-url deps) (assoc :base-url (:base-url deps))
                 (:thinking-level session-config)
                 (assoc :thinking-level (:thinking-level session-config))
                 (:before-tool-call deps) (assoc :before-tool-call (:before-tool-call deps))
                 (:after-tool-call deps) (assoc :after-tool-call (:after-tool-call deps)))]
    (swap! state* assoc
           :current-turn (:promise turn)
           :abort-controller controller)
    (try
      (let [new-messages (await ((:run-loop deps) context config
                                                   (fn [event] (fan-out! state* event))
                                                   (:stream-fn deps)))]
        (swap! state* update :messages into (cons (:user-message turn) new-messages))
        new-messages)
      (finally
        (swap! state* assoc
               :steering-queue []
               :follow-up-queue [])))))

(defn- settle-turn!
  [turn [kind value]]
  (case kind
    :resolve ((:resolve turn) value)
    :reject ((:reject turn) value)))

(defn ^:async pump!
  "Drain queued turns one at a time until the queue is empty. Idle state is
   cleared before the last turn's promise settles, so awaiting a turn always
   observes the session at rest."
  [state* deps]
  (loop []
    (let [turn (first (:pending-turns @state*))]
      (when turn
        (swap! state* update :pending-turns subvec 1)
        (let [outcome (try
                        [:resolve (await (run-queued-turn! state* deps turn))]
                        (catch :default err
                          [:reject err]))]
          (when-not (seq (:pending-turns @state*))
            (swap! state* assoc
                   :pumping? false
                   :streaming? false
                   :current-turn nil
                   :abort-controller nil))
          (settle-turn! turn outcome)
          (when (:pumping? @state*)
            (recur)))))))

(defn- enqueue-turn!
  "Queue a user message as a serialized turn. Returns a Promise that resolves
   with the run-loop's new messages when that turn completes. The session
   activates synchronously so an immediate follow-up!/steer! appends to the
   in-flight context instead of racing the pump's first step."
  [state* deps user-message]
  (let [resolve* (atom nil)
        reject* (atom nil)
        promise (js/Promise. (fn [resolve reject]
                               (reset! resolve* resolve)
                               (reset! reject* reject)))
        turn {:user-message user-message
              :promise promise
              :resolve (fn [value] (@resolve* value))
              :reject (fn [err] (@reject* err))}]
    (swap! state* update :pending-turns conj turn)
    (when-not (:pumping? @state*)
      (swap! state* assoc
             :pumping? true
             :streaming? true
             :current-turn promise)
      (pump! state* deps))
    promise))

(defn- enqueue-control!
  "Deliver a mid-turn control message. While a turn is in flight the message
   appends to the in-flight context through the run-loop's steering/follow-up
   hooks; when idle it starts a fresh turn with the message."
  [state* deps queue-key message]
  (if (:streaming? @state*)
    (do
      (swap! state* update queue-key conj (->user-message message))
      (js/Promise.resolve nil))
    (enqueue-turn! state* deps (->user-message message))))

(defrecord TurnSession [state* deps]
  IAgentSession
  (streaming? [_]
    (boolean (:streaming? @state*)))

  (current-turn [_]
    (:current-turn @state*))

  (messages [_]
    (seq (:messages @state*)))

  (subscribe! [_ handler]
    (swap! state* update :subscribers conj handler)
    (fn [] (swap! state* update :subscribers disj handler)))

  (send-user-message! [_ content]
    (enqueue-turn! state* deps (->user-message content)))

  (follow-up! [_ message]
    (enqueue-control! state* deps :follow-up-queue message))

  (steer! [_ message]
    (enqueue-control! state* deps :steering-queue message))

  (set-thinking-level! [_ level]
    (swap! state* assoc-in [:config :thinking-level] level)
    nil)

  (set-active-tools! [_ tool-names]
    (swap! state* assoc-in [:config :active-tools]
           (some->> tool-names (map str) set))
    nil)

  (abort! [_]
    (when-let [controller (:abort-controller @state*)]
      (.abort controller))
    (js/Promise.resolve nil)))

(defn make-session
  "Create an IAgentSession whose turns run through the injected turn-processor
   run-loop. deps:

     :run-loop        — (context config emit stream-fn) -> Promise of new messages
     :stream-fn       — (model llm-context options) -> stream object
                        (e.g. packages/eta-mu extern.openai/stream-chat)
     :model           — {:id string :provider string}
     :convert-to-llm  — (messages) -> llm messages, possibly async
     :system-prompt   — string or nil
     :tools           — vector of turn-processor tool maps
     :api-key         — optional provider key, plain config (no SDK singletons)
     :base-url        — optional provider endpoint, plain config
     :before-tool-call / :after-tool-call — optional run-loop hooks
     :thinking-level  — optional initial thinking level
     :active-tools    — optional initial active tool name set"
  [deps]
  (->TurnSession (atom {:messages []
                        :pending-turns []
                        :pumping? false
                        :streaming? false
                        :current-turn nil
                        :abort-controller nil
                        :steering-queue []
                        :follow-up-queue []
                        :subscribers #{}
                        :config {:thinking-level (:thinking-level deps)
                                 :active-tools (some->> (:active-tools deps) (map str) set)}})
                 deps))
