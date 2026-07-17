(ns open-hax.sol.infra.agent.turn-session-test
  "Coverage for the turn-processor session adapter.

   The injected run-loop here is a documented double of
   `eta-mu.turn-processor.infra.loop/run-loop`: sol's build classpath does
   not yet carry the turn-processor sources (the provider-swap card wires
   that path in), so the double mirrors the loop contract — lifecycle events,
   steering-then-follow-up consultation, tool execution through tool maps,
   and abort observation at turn boundaries. The real loop's side of the
   contract is pinned by the turn-processor suite."
  (:require [cljs.test :refer [deftest testing is]]
            [open-hax.sol.infra.agent.turn-session :as turn-session]
            [open-hax.sol.shape.agent :as agent]))

;; ─── Mock stream-fn streams ──────────────────────────────────────────────────

(defn- scripted-stream
  "A stream object yielding each scripted chunk via .next, then resolving
   final-message from .result."
  [chunks final-message]
  (let [remaining (atom (vec chunks))]
    #js {:next (fn []
                 (if-let [chunk (first @remaining)]
                   (do
                     (swap! remaining subvec 1)
                     (js/Promise.resolve #js {:done false :value chunk}))
                   (js/Promise.resolve #js {:done true})))
         :result (fn [] (js/Promise.resolve final-message))}))

(defn- text-chunk [partial-message]
  #js {:type "text_delta" :partial partial-message})

(defn- assistant-message
  ([content] (assistant-message content :stop))
  ([content stop-reason]
   {:role :assistant
    :content content
    :api "test" :provider "test" :model "test-model"
    :usage {:input 0 :output 0 :cache-read 0 :cache-write 0 :total-tokens 0}
    :stop-reason stop-reason
    :timestamp 0}))

(defn- text-assistant [text]
  (assistant-message [{:type :text :text text}]))

;; ─── Run-loop contract double ────────────────────────────────────────────────

(defn- aborted-signal? [signal]
  (boolean (and signal (.-aborted signal))))

(defn- ^:async emit! [emit event]
  (await (emit event)))

(defn- ^:async drain-stream
  "Consume a mock stream, emitting message_update per chunk and the
   message_start/message_end pair around the final message."
  [stream emit]
  (loop []
    (let [chunk (await (.next stream))]
      (if (or (nil? chunk) (.-done chunk))
        (let [final (await (.result stream))]
          (emit! emit {:type :message_start :message final})
          (emit! emit {:type :message_end :message final})
          final)
        (do
          (emit! emit {:type :message_update
                       :message (.-partial (.-value chunk))
                       :assistant-message-event (.-value chunk)})
          (recur))))))

(defn- ^:async contract-run-loop
  "Double mirroring the run-loop contract: agent_start/turn_start lifecycle,
   pending-message injection, tool execution with the abort signal, steering
   consulted before follow-up, and abort observed after each stream and after
   each tool batch."
  [context config emit stream-fn]
  (let [ctx (atom context)
        new-messages (atom [])
        signal (:abort-signal config)]
    (emit! emit {:type :agent_start})
    (emit! emit {:type :turn_start})
    (loop [first-turn? true pending []]
      (doseq [message pending]
        (emit! emit {:type :message_start :message message})
        (emit! emit {:type :message_end :message message})
        (swap! ctx update :messages conj message)
        (swap! new-messages conj message))
      (when-not first-turn?
        (emit! emit {:type :turn_start}))
      (let [llm-messages (await ((:convert-to-llm config) (:messages @ctx)))
            stream (stream-fn (:model config)
                              {:system-prompt (:system-prompt @ctx)
                               :messages llm-messages
                               :tools (:tools @ctx)}
                              {:api-key (:api-key config)
                               :base-url (:base-url config)
                               :signal signal})
            assistant (await (drain-stream stream emit))]
        (swap! ctx update :messages conj assistant)
        (swap! new-messages conj assistant)
        (if (or (contains? #{:error :aborted} (:stop-reason assistant))
                (aborted-signal? signal))
          (do
            (emit! emit {:type :turn_end :message assistant :tool-results []})
            (emit! emit {:type :agent_end :messages @new-messages})
            (vec @new-messages))
          (let [tool-calls (filterv #(= (:type %) :tool-call) (:content assistant))]
            (if (seq tool-calls)
              (let [result-messages
                    (loop [acc [] remaining tool-calls]
                      (if-let [more (seq remaining)]
                        (let [tool-call (first more)
                              tool (some #(when (= (:name %) (:name tool-call)) %) (:tools @ctx))]
                          (emit! emit {:type :tool_execution_start
                                       :tool-call-id (:id tool-call)
                                       :tool-name (:name tool-call)
                                       :args (:arguments tool-call)})
                          (let [result (await ((:execute tool)
                                               (:id tool-call)
                                               (:arguments tool-call)
                                               signal
                                               (fn [_] nil)))
                                message {:role :tool-result
                                         :tool-call-id (:id tool-call)
                                         :tool-name (:name tool-call)
                                         :content (:content result)
                                         :details (:details result)
                                         :is-error false
                                         :timestamp 0}]
                            (emit! emit {:type :tool_execution_end
                                         :tool-call-id (:id tool-call)
                                         :tool-name (:name tool-call)
                                         :result result
                                         :is-error false})
                            (emit! emit {:type :message_start :message message})
                            (emit! emit {:type :message_end :message message})
                            (swap! ctx update :messages conj message)
                            (swap! new-messages conj message)
                            (recur (conj acc message) (rest more))))
                        acc))]
                (emit! emit {:type :turn_end :message assistant :tool-results result-messages})
                (if (aborted-signal? signal)
                  (do
                    (emit! emit {:type :agent_end :messages @new-messages})
                    (vec @new-messages))
                  (recur false [])))
              (let [steering (when-let [f (:get-steering-messages config)] (await (f)))]
                (if (seq steering)
                  (recur false (vec steering))
                  (let [follow-up (when-let [f (:get-follow-up-messages config)] (await (f)))]
                    (if (seq follow-up)
                      (recur false (vec follow-up))
                      (do
                        (emit! emit {:type :turn_end :message assistant :tool-results []})
                        (emit! emit {:type :agent_end :messages @new-messages})
                        (vec @new-messages)))))))))))))

;; ─── Fixtures ────────────────────────────────────────────────────────────────

(defn- test-deps
  ([stream-fn] (test-deps stream-fn {}))
  ([stream-fn extra]
   (merge {:run-loop contract-run-loop
           :stream-fn stream-fn
           :model {:id "test-model" :provider "test"}
           :convert-to-llm (fn [messages] messages)
           :system-prompt "sys"
           :tools []}
          extra)))

(defn- capture-subscription
  "Subscribe a capturing handler to the session; returns the events atom."
  [session]
  (let [events (atom [])]
    (agent/subscribe! session (fn [event] (swap! events conj event)))
    events))

;; ─── Tests ───────────────────────────────────────────────────────────────────

(deftest ^:async send-streams-turn-and-appends-messages
  (testing "send → streamed turn → user and assistant messages appended to history"
    (let [stream-fn (fn [_ _ _] (scripted-stream [] (text-assistant "pong")))
          session (turn-session/make-session (test-deps stream-fn))]
      (is (false? (agent/streaming? session)))
      (let [turn (agent/send-user-message! session "ping")]
        (is (true? (agent/streaming? session)))
        (is (some? (agent/current-turn session)))
        (await turn))
      (is (false? (agent/streaming? session)))
      (is (nil? (agent/current-turn session)))
      (let [messages (vec (agent/messages session))]
        (is (= [:user :assistant] (mapv :role messages)))
        (is (= "ping" (:content (first messages))))
        (is (= [{:type :text :text "pong"}] (:content (second messages))))
        (is (every? #(int? (:timestamp %)) messages))))))

(deftest ^:async follow-up-mid-turn-continues-the-turn
  (testing "a follow-up queued mid-turn is appended to the in-flight context"
    (let [stream-calls (atom 0)
          stream-fn (fn [_ _ _]
                      (let [n (swap! stream-calls inc)]
                        (scripted-stream [] (text-assistant (str "reply-" n)))))
          session (turn-session/make-session (test-deps stream-fn))
          events (capture-subscription session)
          turn (agent/send-user-message! session "ping")]
      (is (true? (agent/streaming? session)))
      (await (agent/follow-up! session "and another thing"))
      (await turn)
      (is (= 2 @stream-calls))
      (let [messages (vec (agent/messages session))]
        (is (= [:user :assistant :user :assistant] (mapv :role messages)))
        (is (= "and another thing" (:content (nth messages 2)))))
      (is (some #(and (= :message_start (:type %))
                      (= :user (get-in % [:message :role]))
                      (= "and another thing" (get-in % [:message :content])))
                @events)))))

(deftest ^:async steer-mid-turn-continues-the-turn
  (testing "a steer queued mid-turn is delivered through the steering hook"
    (let [stream-calls (atom 0)
          stream-fn (fn [_ _ _]
                      (let [n (swap! stream-calls inc)]
                        (scripted-stream [] (text-assistant (str "reply-" n)))))
          session (turn-session/make-session (test-deps stream-fn))
          turn (agent/send-user-message! session "ping")]
      (is (true? (agent/streaming? session)))
      (await (agent/steer! session "go left instead"))
      (await turn)
      (is (= 2 @stream-calls))
      (let [messages (vec (agent/messages session))]
        (is (= [:user :assistant :user :assistant] (mapv :role messages)))
        (is (= "go left instead" (:content (nth messages 2))))))))

(deftest ^:async abort-halts-turn-before-tools
  (testing "abort! halts a turn that would otherwise continue calling tools"
    (let [tool-called? (atom false)
          stream-fn (fn [_ _ _]
                      (scripted-stream [] (assistant-message
                                           [{:type :tool-call
                                             :id "call-1"
                                             :name "read"
                                             :arguments {}}]
                                           :tool-use)))
          read-tool {:name "read"
                     :execute (fn [_id _args _signal _on-update]
                                (reset! tool-called? true)
                                (js/Promise.resolve {:content [{:type :text :text "x"}]
                                                     :details {}}))}
          session (turn-session/make-session (test-deps stream-fn {:tools [read-tool]}))
          events (atom [])
          turn (do
                 (agent/subscribe! session
                                   (fn [event]
                                     (swap! events conj event)
                                     (when (= :message_end (:type event))
                                       (agent/abort! session))))
                 (agent/send-user-message! session "ping"))]
      (await turn)
      (is (false? @tool-called?))
      (is (not-any? #(= :tool_execution_start (:type %)) @events))
      (is (some #(= :agent_end (:type %)) @events))
      (is (false? (agent/streaming? session)))
      (let [messages (vec (agent/messages session))]
        (is (= [:user :assistant] (mapv :role messages)))))))

(deftest ^:async subscribers-receive-the-run-loop-events
  (testing "subscribe receives the same events the run-loop emits, in order"
    (let [partial-message (text-assistant "po")
          stream-fn (fn [_ _ _]
                      (scripted-stream [(text-chunk partial-message)
                                        (text-chunk partial-message)]
                                       (text-assistant "pong")))
          session (turn-session/make-session (test-deps stream-fn))
          events (capture-subscription session)]
      (await (agent/send-user-message! session "ping"))
      (is (= [:agent_start
              :turn_start
              :message_update
              :message_update
              :message_start
              :message_end
              :turn_end
              :agent_end]
             (mapv :type @events)))
      (let [updates (filter #(= :message_update (:type %)) @events)]
        (is (every? #(identical? partial-message (:message %)) updates)))
      (let [end-event (last @events)]
        (is (= [:assistant] (mapv :role (:messages end-event)))))
      (let [other (atom [])]
        (agent/subscribe! session (fn [event] (swap! other conj event)))
        (await (agent/send-user-message! session "again"))
        (is (= (mapv :type @other)
               (subvec (mapv :type @events) 8)))))))

(deftest ^:async unsubscribe-stops-delivery
  (testing "the subscribe! return value unsubscribes the handler"
    (let [stream-fn (fn [_ _ _] (scripted-stream [] (text-assistant "pong")))
          session (turn-session/make-session (test-deps stream-fn))
          events (atom [])
          unsubscribe (agent/subscribe! session (fn [event] (swap! events conj event)))]
      (unsubscribe)
      (await (agent/send-user-message! session "ping"))
      (is (empty? @events)))))

(deftest ^:async config-updates-apply-to-subsequent-turns
  (testing "set-thinking-level! / set-active-tools! shape the next turn's config"
    (let [seen (atom [])
          recording-run-loop (fn [context config emit stream-fn]
                               (swap! seen conj {:thinking-level (:thinking-level config)
                                                 :tools (mapv :name (:tools context))})
                               (contract-run-loop context config emit stream-fn))
          stream-fn (fn [_ _ _] (scripted-stream [] (text-assistant "pong")))
          tool-a {:name "a" :execute (fn [_ _ _ _] (js/Promise.resolve {:content [] :details {}}))}
          tool-b {:name "b" :execute (fn [_ _ _ _] (js/Promise.resolve {:content [] :details {}}))}
          session (turn-session/make-session (test-deps stream-fn {:run-loop recording-run-loop
                                                                   :tools [tool-a tool-b]}))]
      (await (agent/send-user-message! session "one"))
      (agent/set-thinking-level! session "high")
      (agent/set-active-tools! session ["a"])
      (await (agent/send-user-message! session "two"))
      (is (= [{:thinking-level nil :tools ["a" "b"]}
              {:thinking-level "high" :tools ["a"]}]
             @seen)))))

(deftest ^:async turns-are-serialized
  (testing "a second send waits for the in-flight turn and sees its history"
    (let [context-sizes (atom [])
          stream-fn (fn [_ llm-context _]
                      (swap! context-sizes conj (count (:messages llm-context)))
                      (scripted-stream [] (text-assistant "pong")))
          session (turn-session/make-session (test-deps stream-fn))]
      (await (js/Promise.all (clj->js [(agent/send-user-message! session "one")
                                       (agent/send-user-message! session "two")])))
      (is (= [1 3] @context-sizes))
      (is (= [:user :assistant :user :assistant]
             (mapv :role (agent/messages session)))))))

(deftest ^:async idle-follow-up-starts-a-new-turn
  (testing "follow-up! with no in-flight turn enqueues a fresh turn"
    (let [stream-fn (fn [_ _ _] (scripted-stream [] (text-assistant "pong")))
          session (turn-session/make-session (test-deps stream-fn))]
      (await (agent/follow-up! session "hello"))
      (is (= [:user :assistant] (mapv :role (agent/messages session)))))))

(deftest ^:async abort-when-idle-is-a-no-op
  (testing "abort! with no in-flight turn resolves without touching history"
    (let [stream-fn (fn [_ _ _] (scripted-stream [] (text-assistant "pong")))
          session (turn-session/make-session (test-deps stream-fn))]
      (await (agent/abort! session))
      (is (false? (agent/streaming? session)))
      (is (empty? (agent/messages session))))))
