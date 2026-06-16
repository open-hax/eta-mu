(ns rheos.ui.infra.chat-session
  "Real IChatSession for the orchestrator panel, backed by the Rheos chat proxy
   (→ knoxx, agent kanban_orchestrator). First message POSTs /api/chat/start to
   open a conversation, then opens an SSE stream (/api/chat/stream) bridged from
   knoxx's token WebSocket; later messages POST /api/chat. Maps knoxx's
   {channel,payload} envelopes to chat-ui events."
  (:require [eta-mu.chat-ui.protocol :as proto]))

(defn- notify [listeners ev] (doseq [f @listeners] (f ev)))

(defn- ^:async post-json [url body]
  (let [res (await (js/fetch url #js {:method "POST"
                                      :headers #js {"Content-Type" "application/json"}
                                      :body (js/JSON.stringify (clj->js body))}))
        data (await (.json res))]
    data))

(defn- open-stream! [state listeners sid cid]
  (let [es (js/EventSource. (str "/api/chat/stream?session_id=" (js/encodeURIComponent sid)
                                 "&conversation_id=" (js/encodeURIComponent cid)))]
    (set! (.-onmessage es)
          (fn [e]
            (let [env (try (js/JSON.parse (.-data e)) (catch :default _ nil))
                  channel (some-> env (aget "channel"))
                  payload (some-> env (aget "payload"))]
              (cond
                (and (= channel "tokens") payload (= (aget payload "kind") "assistant_message"))
                (notify listeners {:type "token" :text (aget payload "token") :id (aget payload "run_id")})

                (and (= channel "events") payload)
                (case (aget payload "type")
                  "run_completed" (notify listeners {:type "done"})
                  "run_failed" (notify listeners {:type "error"})
                  nil)))))
    (swap! state assoc :es es)))

(defn- ^:async start-conversation! [state listeners text]
  (try
    (let [d (await (post-json "/api/chat/start" {:message text}))
          sid (or (aget d "sessionId") (aget d "session_id"))
          cid (or (aget d "conversationId") (aget d "conversation_id"))]
      (when (and sid cid)
        (swap! state assoc :session-id sid :conversation-id cid)
        (open-stream! state listeners sid cid))
      {:ok true})
    (catch :default e
      (notify listeners {:type "error"})
      (throw e))))

(defn create-session
  "Create an orchestrator chat session bound to the kanban board."
  []
  (let [listeners (atom [])
        state (atom {:session-id nil :conversation-id nil :es nil})]
    (reify proto/IChatSession
      (send-message [_ text]
        (if-let [cid (:conversation-id @state)]
          ;; Continue the existing conversation.
          (post-json "/api/chat" {:message text :conversation_id cid :session_id (:session-id @state)})
          ;; First turn: start the conversation, then open the token stream.
          (start-conversation! state listeners text)))
      (subscribe [_ callback]
        (swap! listeners conj callback)
        (fn [] (swap! listeners (fn [ls] (filterv #(not= % callback) ls)))))
      (abort [_])
      (history [_] (js/Promise.resolve []))
      (close [_]
        (when-let [es (:es @state)] (.close es))
        (reset! listeners [])))))
