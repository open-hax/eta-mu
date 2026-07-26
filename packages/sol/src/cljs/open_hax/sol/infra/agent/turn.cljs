(ns open-hax.sol.infra.agent.turn
  "Turn orchestrator for Sol."
  (:require [clojure.string :as str]
            [open-hax.sol.domain.agent.content :as content]
            [open-hax.sol.domain.agent.text-delta :as text-delta]
            [open-hax.sol.domain.contracts.resolve :as contracts]
            [open-hax.sol.domain.models :refer [effective-thinking-level normalize-thinking-level]]
            [open-hax.sol.domain.realtime :as realtime]
            [open-hax.sol.domain.text :refer [assistant-message-text]]
            [open-hax.sol.domain.time :refer [now-iso]]
            [open-hax.sol.extern.agent-turn-prompt :as xprompt]
            [open-hax.sol.infra.agent.run-state :as run-state]
            [open-hax.sol.infra.agent.session :refer [ensure-agent-session! prune-session-messages]]
            [open-hax.sol.infra.agent.session-store :as session-store]
            [open-hax.sol.infra.agent.transcript :as transcript]
            [open-hax.sol.shape.agent :refer [abort! subscribe! send-user-message!]]
            [open-hax.sol.extern.agent-turn-node :as xturn-node]))

(defonce conversation-access* (atom {}))
(defonce lounge-messages* (atom []))

(defn ensure-conversation-access!
  [_ctx _conversation-id]
  true)

(defn remember-conversation-access!
  [_ctx _conversation-id]
  true)

(defn ensure-session-id
  [session-id]
  (or (content/nonblank session-id)
      (xturn-node/random-uuid!)))

(defn- auth-context-for-agent-turn
  [auth-context agent-spec]
  (let [agent-actor-id (some-> (:actor-id agent-spec) str str/trim not-empty)
        needs-context? (or auth-context
                           agent-actor-id
                           (seq (:tool-policies agent-spec))
                           (:role agent-spec))]
    (when needs-context?
      (cond-> (or auth-context {})
        agent-actor-id (assoc :actorId agent-actor-id)
        (and (nil? auth-context) (seq (:tool-policies agent-spec)))
        (assoc :toolPolicies (vec (:tool-policies agent-spec)))
        (and (nil? auth-context) (:role agent-spec))
        (assoc :roleSlugs [(:role agent-spec)])))))

(defn- resolve-turn-model
  [config model agent-spec]
  (or model (:model agent-spec) (:proxx-default-model config)))

(defn- merge-agent-contract
  "Resolve the agent contract for agent-spec and merge contract-derived fields
   back into the spec so downstream turn/session code uses authoritative values."
  [config agent-spec]
  (if-let [contract-id (some-> agent-spec :contract-id str str/trim not-empty)]
    (let [contract (contracts/effective-agent-contract config contract-id (:actor-id agent-spec))]
      (cond-> agent-spec
        contract (assoc :tool-ids (vec (:tool-ids contract)))
        (:model contract) (assoc :model (str (:model contract)))
        (:thinking-level contract) (assoc :thinking-level (str (:thinking-level contract)))
        (:system-prompt contract) (assoc :system-prompt (str (:system-prompt contract)))
        (:task-prompt contract) (assoc :task-prompt (str (:task-prompt contract)))
        (:role contract) (assoc :role (str (:role contract)))))
    agent-spec))

(defn- resolve-turn-thinking-level
  [config model-id thinking-level agent-spec]
  (let [thinking-level-raw (or thinking-level (:thinking-level agent-spec))
        parsed-thinking-level (when thinking-level-raw
                                (normalize-thinking-level thinking-level-raw))]
    (effective-thinking-level config model-id (or parsed-thinking-level
                                                  thinking-level-raw
                                                  (:agent-thinking-level config)
                                                  "off"))))

(defn content-part-type
  [part]
  (cond
    (keyword? (:type part)) (name (:type part))
    (string? (:type part)) (:type part)
    :else nil))

(defn- content-part->input-part
  "Project a sol ContentPart onto a turn-processor input content part (CLJS)."
  [part]
  (let [part-type (content-part-type part)
        text (:text part)
        url (:url part)
        data (:data part)
        mime (or (:mimeType part) (:mime-type part))]
    (case part-type
      "text" (when (not (str/blank? (str text))) {:type "text" :text text})
      "image" (cond
                (and (string? data) (not (str/blank? data))) {:type "image" :data data :mime-type (or mime "image/png")}
                (and (string? url) (not (str/blank? url))) (cond-> {:type "image" :url url}
                                                             mime (assoc :mime-type mime))
                :else nil)
      "audio" (cond
                (and (string? data) (not (str/blank? data))) {:type "audio" :data data :mime-type (or mime "audio/mpeg")}
                (and (string? url) (not (str/blank? url))) (cond-> {:type "audio" :url url}
                                                             mime (assoc :mime-type mime))
                :else nil)
      nil)))

(defn- build-user-content
  [message content-parts]
  (let [parts (keep content-part->input-part (or content-parts []))
        text (some-> message str str/trim not-empty)]
    (cond
      (and (seq parts) text) (conj (vec parts) {:type "text" :text text})
      (seq parts) (vec parts)
      :else (or text ""))))

(defn- last-assistant-text
  [session]
  (let [stored (transcript/session->stored-messages session)]
    (some->> stored
             (filter #(= "assistant" (:role %)))
             last
             :content
             str
             str/trim
             not-empty)))

;; ── Realtime token streaming ─────────────────────────────────────────────────
;; The board chat renders the assistant reply from "tokens" events whose payload
;; is {:kind "assistant_message" :token <delta> :run_id ...}. The agent session
;; emits provider stream events; we forward assistant text deltas as token
;; broadcasts. text-delta/diff-appended-text keeps this correct whether the
;; provider streams incremental deltas or resends cumulative "text so far".

(defn- broadcast-token!
  [{:keys [run-id conversation-id session-id]} delta]
  (when (seq delta)
    (realtime/broadcast-ws-session!
     session-id "tokens"
     {:run_id run-id
      :conversation_id conversation-id
      :session_id session-id
      :kind "assistant_message"
      :token delta})))

(defn stream-message-update!
  "Forward an assistant text delta from a run-loop message_update event. The
   :assistant-message-event is the stream's raw JS event; the openai extern
   carries the cumulative text-so-far on its :partial assistant message, which
   the cumulative-diff branch below tokenizes correctly."
  [scope seen-text* event]
  (let [ame (:assistant-message-event event)
        ame-type (some-> ame (aget "type") str)]
    (when (= ame-type "text_delta")
      (let [partial-message (aget ame "partial")
            delta (str (or (aget ame "delta")
                           (aget ame "text")
                           (and partial-message
                                (not (str/blank? (assistant-message-text partial-message)))
                                (assistant-message-text partial-message))
                           ""))
            seen @seen-text*]
        (if (and (seq seen) (str/starts-with? delta seen))
          ;; Provider resent the full message-so-far: emit only the new suffix.
          (let [appended (text-delta/diff-appended-text seen delta)]
            (broadcast-token! scope appended)
            (reset! seen-text* delta))
          ;; Incremental delta.
          (do
            (broadcast-token! scope delta)
            (swap! seen-text* str delta)))))))

(defn- assistant-role?
  "True for both role shapes in circulation. The run-loop carries keyword roles,
   while the realtime session handler, transcript, and persisted-message schemas
   all speak the string form — a terminal message in either shape must flush."
  [role]
  (contains? #{:assistant "assistant"} role))

(defn stream-message-end!
  "Flush any text not already streamed when an assistant message completes.
   Covers providers that send only a terminal message with no incremental
   deltas. Only assistant message_end events carry reply text; user/tool
   message_end events (follow-ups, tool results) must not broadcast."
  [scope seen-text* event]
  (when-let [message (:message event)]
    (when (assistant-role? (:role message))
      (let [full (str (or (assistant-message-text message) ""))
            appended (text-delta/diff-appended-text @seen-text* full)]
        (when (seq appended)
          (broadcast-token! scope appended)
          (reset! seen-text* full))))))

(defn- ^:async settle-on-send!
  "Settle the caller's result promise from the send promise.

   Invoked WITHOUT await: awaiting the send in the caller would defeat the
   timeout, because a hung stream or tool would never let the timer-backed
   result promise win the race. Settling from here instead of from :agent_end
   is also what keeps history correct — TurnSession resolves the send promise
   only after appending the new messages, whereas :agent_end fires inside the
   run-loop before that projection."
  [send-promise settle! resolve* reject* session]
  (try
    (await send-promise)
    (settle! #(when-let [r @resolve*] (r session)))
    (catch :default err
      (settle! #(when-let [r @reject*] (r err))))))

(defn ^:async send-user-message-with-timeout!
  "Send content to the session and wait for the send Promise to settle after
   the session has projected the turn into history. Resolves with the session.
   Streams assistant text deltas to the realtime WS as they arrive (scope carries
   :run-id/:conversation-id/:session-id). A timeout-ms of 0 or nil disables it."
  [session content timeout-ms scope]
  (let [settled? (atom false)
        unsubscribe* (atom nil)
        timeout-id* (atom nil)
        seen-text* (atom "")
        resolve* (atom nil)
        reject* (atom nil)
        settle! (fn [f]
                  (when (compare-and-set! settled? false true)
                    (when-let [tid @timeout-id*] (js/clearTimeout tid))
                    (when-let [unsub @unsubscribe*] (unsub))
                    (f)))
        handler (fn [event]
                  (let [event-type (:type event)]
                    (case event-type
                      ;; Token streaming is best-effort: a broadcast failure
                      ;; must never abort the turn.
                      :message_update (try (stream-message-update! scope seen-text* event)
                                           (catch :default _ nil))
                      :message_end (try (stream-message-end! scope seen-text* event)
                                        (catch :default _ nil))
                      :error (settle! #(when-let [r @reject*]
                                         (r (js/Error. (str "Agent error: " (:message event))))))
                      nil)))
        timeout! (fn []
                   (settle!
                    (fn []
                      (try
                        (.catch (js/Promise.resolve (abort! session))
                                (fn [_] nil))
                        (catch :default _ nil))
                      (when-let [r @reject*]
                        (r (js/Error. (str "Agent turn timed out after " timeout-ms "ms")))))))
        result-promise (js/Promise.
                        (fn [resolve reject]
                          (reset! resolve* resolve)
                          (reset! reject* reject)
                          (reset! unsubscribe* (subscribe! session handler))
                          (when (and timeout-ms (pos? timeout-ms))
                            (reset! timeout-id* (js/setTimeout timeout! timeout-ms)))))
        send-attempt (try
                       {:promise (send-user-message! session content)}
                       (catch :default err
                         {:error err}))]
    ;; Do not await the potentially hung turn before the timer-backed result.
    ;; TurnSession resolves this Promise only after appending the new messages,
    ;; whereas :agent_end is emitted inside the loop before that projection.
    (if-let [err (:error send-attempt)]
      (settle! #(when-let [r @reject*] (r err)))
      ;; Deliberately not awaited here — see settle-on-send!.
      (settle-on-send! (:promise send-attempt) settle! resolve* reject* session))
    (await result-promise)))

(defn- run-event-payload
  [run-id conversation-id session-id event-type payload]
  {:run_id run-id
   :conversation_id conversation-id
   :session_id session-id
   :event_type event-type
   :payload payload
   :created_at (now-iso)})

;; Realtime broadcast shape mirrors knoxx's tool-event-payload: a flat map keyed
;; by :type (NOT :event_type). The board chat client (Rheos) scopes by
;; conversation_id and switches on payload.type, so lifecycle events must use
;; this shape to be recognized as run_started / run_completed / run_failed.
(defn broadcast-run-event!
  [run-id conversation-id session-id event-type payload]
  (realtime/broadcast-ws-session!
   session-id "events"
   (merge {:run_id run-id
           :conversation_id conversation-id
           :session_id session-id
           :type event-type
           :at (now-iso)}
          (when (map? payload) payload))))

(defn- emit-run-event!
  [run-id conversation-id session-id event-type payload]
  ;; Ledger append (read by GET /api/agent/run/:id/events) keeps the :event_type shape.
  (run-state/append-run-event! run-id
                               (run-event-payload run-id conversation-id session-id event-type payload))
  ;; Realtime broadcast so the board chat actually receives lifecycle events. The
  ;; previous implementation only appended to the ledger and never broadcast,
  ;; which is why the chat never showed a reply or a completion.
  (broadcast-run-event! run-id conversation-id session-id event-type payload))

(defn- ^:async persist-run-completed!
  [run-id conversation-id session-id model-id answer messages]
  (await (run-state/run-patch! run-id
                               {:conversation_id conversation-id
                                :session_id session-id
                                :status "completed"
                                :model model-id
                                :answer answer
                                :messages (vec messages)
                                :has_active_stream false
                                :updated_at (now-iso)}))
  (await (session-store/session-record-run! session-id run-id "completed")))

(defn- ^:async persist-run-failed!
  [run-id conversation-id session-id model-id err messages]
  (await (run-state/run-patch! run-id
                               {:conversation_id conversation-id
                                :session_id session-id
                                :status "failed"
                                :model model-id
                                :error (str err)
                                :messages (vec messages)
                                :has_active_stream false
                                :updated_at (now-iso)}))
  (await (session-store/session-record-run! session-id run-id "failed")))

(defn- ^:async initialize-run!
  [run-id session-id conversation-id model-id thinking-level]
  (let [started-at (now-iso)]
    (await (run-state/run-put! {:run_id run-id
                                :session_id session-id
                                :conversation_id conversation-id
                                :status "running"
                                :model model-id
                                :thinking_level thinking-level
                                :created_at started-at
                                :updated_at started-at
                                :has_active_stream true}))
    (await (session-store/session-record-run! session-id run-id "running"))
    (await (emit-run-event! run-id conversation-id session-id "run_started"
                            {:model model-id}))))

(defn- execute-turn!
  [runtime config session-id conversation-id run-id model-id thinking-level
   content content-parts agent-spec auth-context]
  (js/Promise.
   (^:async fn [resolve reject]
     (try
       (let [session (await (ensure-agent-session! {:runtime runtime
                                                    :config config
                                                    :conversation-id conversation-id
                                                    :model-id model-id
                                                    :auth-context auth-context
                                                    :thinking-level thinking-level
                                                    :session-id session-id
                                                    :agent-spec agent-spec}))
             _ (xprompt/log-prompt! {:run-id run-id
                                     :session-id session-id
                                     :conversation-id conversation-id
                                     :model-id model-id
                                     :parts-count (if (string? content) 1 (count content))
                                     :media-parts-count (count (or content-parts []))
                                     :omitted-count 0
                                     :content content})
             _ (await (send-user-message-with-timeout! session content (:agent-turn-timeout-ms config)
                                                       {:run-id run-id
                                                        :conversation-id conversation-id
                                                        :session-id session-id}))
             answer (or (last-assistant-text session) "[Sol] No response from agent.")
             messages-after (transcript/session->stored-messages session)]
         (resolve [answer messages-after session]))
       (catch :default err
         (reject err))))))

(defn- finalize-success!
  [run-id session-id conversation-id model-id thinking-level started-at answer messages-after]
  (js/Promise.
   (^:async fn [resolve _reject]
     (try
       (persist-run-completed! run-id conversation-id session-id model-id answer messages-after)
       (emit-run-event! run-id conversation-id session-id "run_completed" {:answer answer})
       (let [current (or (session-store/session-get-sync session-id)
                         {:session_id session-id})
             runs (vec (:runs current))
             last-run-id (or (:last_run_id current) run-id)]
         (await (session-store/session-save! session-id
                                             {:session_id session-id
                                              :conversation_id conversation-id
                                              :run_id run-id
                                              :runs runs
                                              :last_run_id last-run-id
                                              :status "completed"
                                              :model model-id
                                              :thinking_level thinking-level
                                              :created_at started-at
                                              :updated_at (now-iso)
                                              :has_active_stream false
                                              :messages (vec messages-after)
                                              :answer answer})))
       (resolve nil)
       (catch :default _err
         (resolve nil))))))

(defn ^:async send-agent-turn!
  "Run a single Sol agent turn against the configured provider.
   Returns a Promise resolving to the turn result map."
  [runtime config {:keys [conversation-id session-id message content-parts model run-id
                          agent-spec auth-context thinking-level]}]
  (let [conversation-id (or conversation-id (xturn-node/random-uuid!))
        session-id (ensure-session-id session-id)
        run-id (or run-id (xturn-node/random-uuid!))
        agent-spec (merge-agent-contract config agent-spec)
        auth-context (auth-context-for-agent-turn auth-context agent-spec)
        model-id (resolve-turn-model config model agent-spec)
        thinking-level (resolve-turn-thinking-level config model-id thinking-level agent-spec)
        started-at (now-iso)
        user-message (if (seq content-parts)
                       {:role "user" :content (or message "") :content-parts content-parts}
                       {:role "user" :content (or message "")})
        final-messages (prune-session-messages agent-spec [user-message])
        content (build-user-content message content-parts)]
    (try
      (await (initialize-run! run-id session-id conversation-id model-id thinking-level))
      (let [[answer messages-after _session]
            (await (execute-turn! runtime config session-id conversation-id run-id
                                  model-id thinking-level content content-parts
                                  agent-spec auth-context))]
        (await (finalize-success! run-id session-id conversation-id model-id thinking-level
                                  started-at answer messages-after))
        {:answer answer
         :run_id run-id
         :conversation_id conversation-id
         :session_id session-id
         :model model-id
         :content_parts []
         :sources []
         :message_parts [{:role "assistant"
                          :content answer}]})
      (catch :default err
        (persist-run-failed! run-id conversation-id session-id model-id err final-messages)
        (emit-run-event! run-id conversation-id session-id "run_failed" {:error (str err)})
        (await (session-store/session-complete! session-id conversation-id
                                                {:status "failed"
                                                 :error (str err)
                                                 :messages final-messages}))
        (throw err)))))

(defn ^:async queue-agent-control!
  "Sol stub for live controls."
  [_runtime _config _control-request]
  (js/Promise.resolve {:ok true :queued true}))

(defn ^:async resume-recovered-session!
  "Sol stub for session recovery."
  [_runtime _config recovered-session & [_opts]]
  (js/Promise.resolve recovered-session))

(defn materialize-content-parts!
  [_runtime _config _model-id _auth-context _max-bytes parts]
  (js/Promise.resolve (vec (or parts []))))
