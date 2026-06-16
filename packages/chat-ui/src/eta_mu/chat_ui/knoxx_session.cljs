(ns eta-mu.chat-ui.knoxx-session
  "IChatSession implementation that talks directly to a knoxx-style chat API.
   Supports both browser and Node runtimes via js/fetch + js/WebSocket.

   Expected endpoints (customisable via :chat-path):
     POST <base-url><chat-path>/start
     POST <base-url><chat-path>
     WS   <ws-base-url><chat-path>/ws/stream?session_id=...&conversation_id=..."
  (:require [clojure.string :as str]
            [eta-mu.chat-ui.protocol :as proto]
            [eta-mu.chat-ui.stream :as stream]))

(defn- default-base-url []
  (or (when (exists? js/window)
        (some-> js/window .-location .-origin))
      "http://127.0.0.1:8000"))

(defn- default-api-key []
  (or (when (exists? js/process)
        (aget js/process.env "KNOXX_API_KEY"))
      ""))

(defn- ws-url [base-url]
  (str/replace (str base-url) #"^http" "ws"))

(defn- notify [listeners ev]
  (doseq [f @listeners] (f ev)))

(defn- ^:async post-json [url body api-key]
  (let [headers #js {"Content-Type" "application/json"}
        _ (when (seq api-key) (aset headers "x-api-key" api-key))
        res (await (js/fetch url #js {:method "POST" :headers headers :body (js/JSON.stringify (clj->js body))}))
        data (await (.json res))]
    data))

(defn- open-stream! [state listeners base-url chat-path sid cid]
  (let [url (str (ws-url base-url) chat-path "/ws/stream?session_id=" (js/encodeURIComponent sid)
                 "&conversation_id=" (js/encodeURIComponent cid))
        conn (stream/connect-stream
              url
              {:on-token (fn [{:keys [text run-id]}]
                           (notify listeners {:type "token" :text text :id run-id}))
               :on-event (fn [{:keys [type]}]
                           (case type
                             "run_completed" (notify listeners {:type "done"})
                             "run_failed" (notify listeners {:type "error"})
                             nil))})]
    (swap! state assoc :stream conn)))

(defn- ^:async start-conversation! [state listeners base-url chat-path api-key agent-id model text]
  (try
    (let [body (cond-> {:message text}
                 (seq agent-id) (assoc :agent_id agent-id)
                 (seq model) (assoc :model model))
          d (await (post-json (str base-url chat-path "/start") body api-key))
          sid (or (aget d "sessionId") (aget d "session_id"))
          cid (or (aget d "conversationId") (aget d "conversation_id"))]
      (when (and sid cid)
        (swap! state assoc :session-id sid :conversation-id cid)
        (open-stream! state listeners base-url chat-path sid cid))
      {:ok true})
    (catch :default e
      (notify listeners {:type "error"})
      (throw e))))

(defn create-knoxx-session
  "Create a knoxx-backed chat session.
   Options:
     :base-url   - knoxx HTTP origin (default: window.location.origin or http://127.0.0.1:8000)
     :chat-path  - API path prefix (default: /api/knoxx/chat)
     :api-key    - x-api-key header value (default: KNOXX_API_KEY env in Node)
     :agent-id   - agent to run as (default: kanban_orchestrator)
     :model      - model override (optional)"
  ([] (create-knoxx-session {}))
  ([{:keys [base-url chat-path api-key agent-id model]
      :or {base-url (default-base-url)
           chat-path "/api/knoxx/chat"
           api-key (default-api-key)
           agent-id "kanban_orchestrator"
           model ""}}]
   (let [listeners (atom [])
         state (atom {:session-id nil :conversation-id nil :stream nil})]
     (reify proto/IChatSession
       (send-message [_ text]
         (if-let [cid (:conversation-id @state)]
           (post-json (str base-url chat-path)
                      (cond-> {:message text :conversation_id cid :session_id (:session-id @state)}
                        (seq agent-id) (assoc :agent_id agent-id)
                        (seq model) (assoc :model model))
                      api-key)
           (start-conversation! state listeners base-url chat-path api-key agent-id model text)))
       (subscribe [_ callback]
         (swap! listeners conj callback)
         (fn [] (swap! listeners (fn [ls] (filterv #(not= % callback) ls)))))
       (abort [_]
         (when-let [conn (:stream @state)] ((:close conn))))
       (history [_] (js/Promise.resolve []))
       (close [_]
         (when-let [conn (:stream @state)] ((:close conn)))
         (reset! listeners []))))))
