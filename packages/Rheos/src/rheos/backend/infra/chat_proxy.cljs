(ns rheos.backend.infra.chat-proxy
  "Proxy the board orchestrator's chat to knoxx, injecting the knoxx API key
   server-side so it never reaches the browser. The orchestrator panel talks to
   Rheos (POST /api/chat/start, /api/chat); Rheos forwards to knoxx
   (/api/knoxx/chat/start, /api/knoxx/chat) as the kanban_orchestrator agent.

   chat/start queues a run and returns a sessionId; the reply tokens stream over
   knoxx's WebSocket — bridged to the browser separately (see the WS relay)."
  (:require [clojure.string :as str]))

(defn- env [k d] (or (aget js/process.env k) d))

;; The agent backend is interchangeable: Sol and knoxx expose the same chat API
;; and only the route prefix differs (Sol: /api/agent, knoxx: /api/knoxx). Both
;; are configurable so this proxy can target either:
;;   - Sol  (default): RHEOS_AGENT_BASE_URL=http://127.0.0.1:8001  RHEOS_AGENT_PREFIX=/api/agent
;;   - knoxx:          RHEOS_AGENT_BASE_URL=http://127.0.0.1:8000  RHEOS_AGENT_PREFIX=/api/knoxx
;; RHEOS_AGENT_BASE_URL is preferred over the legacy KNOXX_BASE_URL so an ambient
;; KNOXX_BASE_URL (commonly left pointing at knoxx) can't silently re-point us.
(def agent-base
  (str/replace (env "RHEOS_AGENT_BASE_URL" (env "KNOXX_BASE_URL" "http://127.0.0.1:8001")) #"/$" ""))
(def agent-ws-base (str/replace agent-base #"^http" "ws"))
(def agent-prefix (str/replace (env "RHEOS_AGENT_PREFIX" "/api/agent") #"/$" ""))
(def api-key (env "KNOXX_API_KEY" ""))
(def agent-id (env "KANBAN_ORCHESTRATOR_AGENT" "kanban_orchestrator"))
;; Model the orchestrator runs on. mimo-v2.5-pro responds far faster than the
;; gemma4:31b default, which kept the board chat appearing unresponsive.
(def orchestrator-model (env "RHEOS_ORCHESTRATOR_MODEL" "mimo-v2.5-pro"))

(defn- ^:async forward [path ^js body]
  ;; Always run as the orchestrator agent regardless of what the client sent.
  (aset body "agentId" agent-id)
  (aset body "agent_id" agent-id)
  (aset body "model" orchestrator-model)
  (let [res (await (js/fetch (str agent-base path)
                             #js {:method "POST"
                                  :headers #js {"Content-Type" "application/json"
                                                "x-api-key" api-key}
                                  :body (js/JSON.stringify body)}))
        text (await (.text res))]
    {:status (.-status res) :text text}))

(defn- ^:async proxy! [path ^js req ^js reply]
  (try
    (let [{:keys [status text]} (await (forward path (or (.-body req) #js {})))]
      (-> reply (.code status) (.header "Content-Type" "application/json") (.send text)))
    (catch :default err
      (-> reply (.code 502) (.send #js {:error (str "knoxx chat proxy failed: " (.-message err))})))))

(defn ^:async handle-start [^js req ^js reply] (await (proxy! (str agent-prefix "/chat/start") req reply)))
(defn ^:async handle-send [^js req ^js reply] (await (proxy! (str agent-prefix "/chat") req reply)))

(defn handle-stream
  "SSE bridge: the browser opens this EventSource (same origin); Rheos connects to
   knoxx's WebSocket scoped by session/conversation and relays each message
   verbatim as an SSE `data:` line. knoxx's WS has no secret — only the ids — so
   nothing sensitive crosses here; this keeps the board on one origin."
  [^js req ^js reply]
  (.hijack reply)
  (let [raw (.-raw reply)
        q (.-query req)
        sid (or (.-session_id q) "")
        cid (or (.-conversation_id q) "")
        url (str agent-ws-base "/ws/stream?session_id=" (js/encodeURIComponent sid)
                 "&conversation_id=" (js/encodeURIComponent cid))
        ws (js/WebSocket. url)]
    (.writeHead raw 200 #js {"Content-Type" "text/event-stream"
                             "Cache-Control" "no-cache"
                             "Connection" "keep-alive"
                             "X-Accel-Buffering" "no"})
    (.write raw ": connected\n\n")
    (set! (.-onmessage ws) (fn [e] (try (.write raw (str "data: " (.-data e) "\n\n")) (catch :default _ nil))))
    (set! (.-onerror ws) (fn [_] (try (.write raw ": ws-error\n\n") (catch :default _ nil))))
    (let [hb (js/setInterval (fn [] (try (.write raw ": ping\n\n") (catch :default _ nil))) 25000)]
      (.on (.-raw req) "close"
           (fn [] (js/clearInterval hb) (try (.close ws) (catch :default _ nil)))))
    ;; Return undefined: the reply is hijacked, so Fastify must NOT try to send a
    ;; value. Returning the `.on` result triggers a spurious FST_ERR_REP_ALREADY_SENT.
    js/undefined))
