(ns eta-mu.chat-ui.sol-session
  "IChatSession implementation backed by a Sol-compatible agent runtime."
  (:require [clojure.string :as str]
            [eta-mu.chat-ui.protocol :as proto]
            [eta-mu.chat-ui.stream :as stream]))

(defn- ->ws-url [http-url]
  (str/replace http-url #"^http" "ws"))

(defn- notify [listeners ev]
  (doseq [f @listeners]
    (f ev)))

(defn- event->ui [channel payload]
  (case channel
    "tokens"
    (when (= (:kind payload) "assistant_message")
      {:type "token" :text (:text payload) :id (:run-id payload)})

    "events"
    (case (:type payload)
      "run_completed" {:type "done"}
      "run_failed" {:type "error"}
      nil)

    nil))

(defn- open-stream! [config state listeners]
  (when-let [sid (:session-id @state)]
    (when-let [cid (:conversation-id @state)]
      (let [url (str (->ws-url (:base-url config)) "/ws/stream"
                     "?session_id=" (js/encodeURIComponent sid)
                     "&conversation_id=" (js/encodeURIComponent cid))
            conn (stream/connect-stream
                  url
                  {:on-token (fn [payload]
                               (when-let [ev (event->ui "tokens" payload)]
                                 (notify listeners ev)))
                   :on-event (fn [payload]
                               (when-let [ev (event->ui "events" payload)]
                                 (notify listeners ev)))
                   :on-error (fn [_] (notify listeners {:type "error"}))
                   :on-close (fn [] (swap! state dissoc :ws))})]
        (swap! state assoc :ws conn)))))

(defn- ^:async post-json [url body]
  (let [res (await (js/fetch url #js {:method "POST"
                                      :headers #js {"Content-Type" "application/json"}
                                      :body (js/JSON.stringify (clj->js body))}))
        data (await (.json res))]
    (if (.-ok res)
      data
      (throw (js/Error. (str "HTTP " (.-status res) " " (.-statusText res) ": " (pr-str data)))))))

(defn- ^:async start-conversation! [config state listeners text]
  (let [url (str (:base-url config) (:prefix config) "/chat/start")
        body (cond-> {:message text}
               (:model config) (assoc :model (:model config)))
        data (await (post-json url body))
        sid (or (aget data "session_id") (aget data "sessionId"))
        cid (or (aget data "conversation_id") (aget data "conversationId"))
        rid (or (aget data "run_id") (aget data "runId"))]
    (when (and sid cid)
      (swap! state assoc :session-id sid :conversation-id cid :run-id rid)
      (open-stream! config state listeners))
    data))

(defn- ^:async send-message! [config state listeners base-url prefix text]
  ;; Hoisted to a top-level ^:async defn: shadow-cljs does not treat `^:async`
  ;; on a reify method's arglist as an async context, so `await` there fails to
  ;; compile. The reify `send-message` delegates here and returns this promise.
  (if-let [cid (:conversation-id @state)]
    (do
      (when-not (:ws @state)
        (open-stream! config state listeners))
      (await (post-json (str base-url prefix "/chat")
                        (cond-> {:message text
                                 :conversation_id cid
                                 :session_id (:session-id @state)}
                          (:model config) (assoc :model (:model config))))))
    (await (start-conversation! config state listeners text))))

(defn create-sol-session
  "Create a Sol-backed chat session.
   opts: {:base-url default http://127.0.0.1:8001
          :prefix   default /api/agent
          :model    optional model id}"
  ([] (create-sol-session {}))
  ([opts]
   (let [base-url (or (:base-url opts) "http://127.0.0.1:8001")
         prefix (or (:prefix opts) "/api/agent")
         config {:base-url base-url :prefix prefix :model (:model opts)}
         state (atom {})
         listeners (atom [])]
     (reify proto/IChatSession
        (send-message [_ text]
          (send-message! config state listeners base-url prefix text))
       (subscribe [_ callback]
         (swap! listeners conj callback)
         (when (and (:session-id @state) (:conversation-id @state) (not (:ws @state)))
           (open-stream! config state listeners))
         (fn [] (swap! listeners (fn [ls] (filterv #(not= % callback) ls)))))
       (abort [_]
         (when-let [ws (:ws @state)]
           ((:close ws)))
         (swap! state dissoc :ws))
       (history [_]
         (js/Promise.resolve []))
       (close [_]
         (when-let [ws (:ws @state)]
           ((:close ws)))
         (reset! listeners []))))))
