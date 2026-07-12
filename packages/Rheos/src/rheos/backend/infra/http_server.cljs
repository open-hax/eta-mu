(ns rheos.backend.infra.http-server
  "Fastify HTTP server for the kanban board."
  (:require ["fastify" :default Fastify]
            ["@fastify/cors" :default fastifyCors]
            ["@fastify/static" :default fastifyStatic]
             ["node:path" :as path]
             ["node:fs/promises" :as fsp]
             ["node:child_process" :as cp]
             [clojure.string :as str]
             [rheos.backend.domain.board :as board]

            [rheos.backend.domain.compose :as compose]
            [rheos.backend.infra.config :as config]
            [rheos.backend.shape.content-parser :as content-parser]
             [rheos.backend.domain.events :as events]
             [rheos.backend.domain.task-edit :as task-edit]
             [rheos.backend.infra.chat-proxy :as chat-proxy]
             [rheos.backend.infra.ledger :as ledger]
             [rheos.backend.law.frontmatter :as law-frontmatter]

            [rheos.backend.infra.mcp :as mcp]
            [rheos.backend.infra.projects :as projects]
            [rheos.backend.infra.task-store :as tasks]
            [rheos.backend.domain.transition :as transition]
            [rheos.backend.infra.watcher :as watcher]))

(defonce server-state (atom nil))
;; Host/port captured at boot so the hot-reload after-load hook can re-listen.
(defonce boot-state (atom nil))

(def ^:private find-project projects/find-project)

(defn- serialize-task [task]
  #js {:uuid (:uuid task)
       :title (:title task)
       :status (:status task)
       :priority (:priority task)
       :labels (clj->js (:labels task))
       :createdAt (:created-at task)
       :sourcePath (:source-path task)})

(defn- serialize-board [project snapshot]
  #js {:generatedAt (:generated-at snapshot)
       :totalTasks (:total-tasks snapshot)
       :project #js {:id (:id project) :title (:title project)}
       :columns (clj->js
                 (mapv (fn [col]
                         #js {:status (:status col)
                              :title (:title col)
                              :taskCount (:task-count col)
                              :tasks (clj->js (mapv serialize-task (:tasks col)))})
                       (:columns snapshot)))})

(defn- send-json [reply data] (.send reply data))
;; Fastify requires .code BEFORE .send; the reverse leaves the status at 200.
(defn- send-error [reply code msg] (.send (.code reply code) #js {:error msg}))

(defn- handle-get-projects [_req reply]
  (send-json reply
             #js {:defaultProjectId (projects/default-id)
                  :projects (clj->js (mapv (fn [p] #js {:id (:id p) :title (:title p)}) (projects/all)))}))

(defn- handle-get-boards [_req reply]
  (send-json reply
             #js {:defaultProjectId (projects/default-id)
                  :projects (clj->js (mapv (fn [p] #js {:id (:id p) :title (:title p) :meta (clj->js (:meta p))}) (projects/all)))}))

(defn ^:async handle-get-board [^js req reply]
  (let [project (find-project (.. req -query -project))]
    (if-not project
      (send-error reply 404 "unknown project")
      (try
        (let [all-tasks (await (tasks/load-tasks (:tasks-dir project)))
              snapshot (board/build-board-snapshot all-tasks)]
          (send-json reply (serialize-board project snapshot)))
        (catch :default err (send-error reply 500 (.-message err)))))))

(defn ^:async handle-get-events [^js req reply]
  (let [project (find-project (.. req -query -project))]
    (if-not project
      (send-error reply 404 "unknown project")
      (try
        (let [ledger (ledger/get-ledger (:tasks-dir project))
              task-id (.. req -query -taskId)
              limit (.. req -query -limit)
              filter-spec (if task-id {:task-id task-id} {})
              evts (await (events/query-events ledger filter-spec))
              result (if limit (vec (take-last (js/parseInt limit) evts)) evts)]
          (send-json reply #js {:events (clj->js (mapv events/envelope->kanban-event result)) :total (count result)}))
        (catch :default err (send-error reply 500 (.-message err)))))))

(defn ^:async handle-get-drift [^js req reply]
  (let [project (find-project (.. req -query -project))]
    (if-not project
      (send-error reply 404 "unknown project")
      (try
        (let [ledger (ledger/get-ledger (:tasks-dir project))
              drift-evts (await (events/query-events ledger {:type "drift-detected"}))]
          (send-json reply #js {:events (clj->js (mapv events/envelope->kanban-event drift-evts)) :total (count drift-evts)}))
        (catch :default err (send-error reply 500 (.-message err)))))))

(defn ^:async handle-get-task-content [^js req reply]
  (let [project-id (.. req -query -project)
        uuid (.. req -params -uuid)
        project (find-project project-id)]
    (if-not project
      (send-error reply 404 "unknown project")
      (try
        (let [all-tasks (await (tasks/load-tasks (:tasks-dir project)))
              task (first (filter #(= (:uuid %) uuid) all-tasks))]
          (if-not task
            (send-error reply 404 "unknown uuid")
            (let [task-path (:source-path task)
                  fs fsp
                  raw (try (await (.readFile fs task-path "utf-8")) (catch :default _ nil))
                  parsed (content-parser/parse-task-content (or raw ""))]
              (send-json reply #js {:uuid uuid
                                    :frontmatter (clj->js (:frontmatter parsed))
                                    :sections (clj->js (mapv (fn [s] #js {:type (:type s) :content (:content s)}) (:sections parsed)))
                                    :sourcePath task-path}))))
        (catch :default err (send-error reply 500 (.-message err)))))))

(defn ^:async handle-post-status [^js req reply]
  (let [project (find-project (.. req -query -project))
        uuid (.. req -params -uuid)
        body (js->clj (.-body req) :keywordize-keys true)
        new-status (:status body)]
    (cond
      (not project) (send-error reply 404 "unknown project")
      (empty? new-status) (send-error reply 400 "missing status")
      :else (try
              (let [all-tasks (await (tasks/load-tasks (:tasks-dir project)))
                    task (first (filter #(= (:uuid %) uuid) all-tasks))]
                (if-not task
                  (send-error reply 404 "unknown uuid")
                  (let [result (await (transition/move-task!
                                       {:project project :task task
                                        :new-status new-status :source "web"}))]
                    (if (:ok result)
                      (send-json reply (serialize-task (:task result)))
                      ;; 409 Conflict: the FSM refused this transition.
                      (send-error reply 409 (:reason result))))))
              (catch :default err (send-error reply 500 (.-message err)))))))

(defn ^:async handle-update-frontmatter [^js req reply]
  (let [project-id (.. req -query -project)
        uuid (.. req -params -uuid)
        body (js->clj (.-body req) :keywordize-keys true)
        updates (or (:updates body)
                    (when (:key body) {(:key body) (:value body)}))
        ;; A client-supplied `key` arrives as a string; normalize to a keyword so
        ;; the law (keyword set) can decide both the `:updates` and `:key` shapes.
        updates (when (map? updates)
                  (reduce-kv (fn [m k v] (assoc m (keyword k) v)) {} updates))
        bad-keys (when (seq updates) (law-frontmatter/disallowed-keys updates))
        project (find-project project-id)]
    (cond
      (not project) (send-error reply 404 "unknown project")
      (empty? updates) (send-error reply 400 "missing key or updates")
      ;; `status` is FSM-governed: refuse it here and point at the status endpoint.
      (law-frontmatter/status-update? updates)
      (send-error reply 400 (str "status is not editable via frontmatter; "
                                 "POST /api/task/" uuid "/status"))
      (seq bad-keys)
      (send-error reply 400 (law-frontmatter/disallowed-keys-message bad-keys))
      :else (try
              (let [all-tasks (await (tasks/load-tasks (:tasks-dir project)))
                    task (first (filter #(= (:uuid %) uuid) all-tasks))]
                (if-not task
                  (send-error reply 404 "unknown uuid")
                   (let [_ (await (task-edit/update-frontmatter!
                                        {:project project :task task
                                         :updates updates
                                         :source "web"}))
                         new-parsed (content-parser/parse-task-content
                                     (await (.readFile fsp (:source-path task) "utf-8")))]
                    (send-json reply #js {:uuid uuid
                                          :frontmatter (clj->js (:frontmatter new-parsed))
                                          :sections (clj->js (mapv (fn [s] #js {:type (:type s) :content (:content s)}) (:sections new-parsed)))
                                          :sourcePath (:source-path task)}))))
              (catch :default err (send-error reply 500 (.-message err)))))))

(defn ^:async handle-post-comment [^js req reply]
  (let [project-id (.. req -query -project)
        uuid (.. req -params -uuid)
        body (js->clj (.-body req) :keywordize-keys true)
        text (str/trim (or (:text body) ""))
        project (find-project project-id)]
    (cond
      (not project) (send-error reply 404 "unknown project")
      (empty? text) (send-error reply 400 "missing text")
      :else (try
              (let [all-tasks (await (tasks/load-tasks (:tasks-dir project)))
                    task (first (filter #(= (:uuid %) uuid) all-tasks))]
                (if-not task
                  (send-error reply 404 "unknown uuid")
                  (let [_ (await (task-edit/append-comment!
                                        {:project project :task task
                                         :text text :source "web"}))
                        new-parsed (content-parser/parse-task-content
                                    (await (.readFile fsp (:source-path task) "utf-8")))]
                    (send-json reply #js {:uuid uuid
                                          :frontmatter (clj->js (:frontmatter new-parsed))
                                          :sections (clj->js (mapv (fn [s] #js {:type (:type s) :content (:content s)}) (:sections new-parsed)))
                                          :sourcePath (:source-path task)}))))
              (catch :default err (send-error reply 500 (.-message err)))))))


(defn ^:async handle-open-editor [^js req reply]
  (let [project-id (.. req -query -project)
        uuid (.. req -params -uuid)
        project (find-project project-id)]
    (if-not project
      (send-error reply 404 "unknown project")
      (try
        (let [all-tasks (await (tasks/load-tasks (:tasks-dir project)))
              task (first (filter #(= (:uuid %) uuid) all-tasks))]
          (if-not task
            (send-error reply 404 "unknown uuid")
            (let [task-path (:source-path task)
                  child-process cp]
              ;; Open in the system default editor. Pass the path as an argv entry
              ;; via execFile (no shell), so a task filename containing shell
              ;; metacharacters can't execute arbitrary commands. Fall back from
              ;; xdg-open (Linux) to open (macOS) on failure.
              (.execFile child-process "xdg-open" #js [task-path]
                         (fn [err _stdout _stderr]
                           (when err
                             (.execFile child-process "open" #js [task-path] (fn [_ _ _])))))
              (send-json reply #js {:ok true}))))
        (catch :default err (send-error reply 500 (.-message err)))))))

(defn- handle-health [_req reply] (send-json reply #js {:ok true}))

(defn handle-events-stream
  "Server-Sent Events stream of ledger activity. Subscribes to the in-process
   event bus ([[rheos.backend.domain.events/subscribe!]]) so every actor's
   mutation — HTTP, drag-drop, or external/CLI edits caught by the file watcher —
   pushes to connected browsers, which refetch the board in response."
  [^js req ^js reply]
  ;; Take ownership of the socket so Fastify doesn't try to serialize a reply.
  (.hijack reply)
  (let [raw (.-raw reply)]
    (.writeHead raw 200
                #js {"Content-Type" "text/event-stream"
                     "Cache-Control" "no-cache"
                     "Connection" "keep-alive"
                     ;; defeat proxy buffering so events arrive promptly
                     "X-Accel-Buffering" "no"})
    (.write raw ": connected\n\n")
    (let [unsub (events/subscribe!
                 (fn [ev]
                   (try (.write raw (str "data: " (js/JSON.stringify (clj->js ev)) "\n\n"))
                        (catch :default _ nil))))
          heartbeat (js/setInterval
                     (fn [] (try (.write raw ": ping\n\n") (catch :default _ nil)))
                     25000)]
      (.on (.-raw req) "close"
           (fn []
             (js/clearInterval heartbeat)
             (unsub))))
    ;; Return undefined: the reply is hijacked, so Fastify must NOT try to send a
    ;; value. Returning the `.on` result triggers a spurious FST_ERR_REP_ALREADY_SENT.
    js/undefined))

(defn ^:async handle-compose [^js req reply]
  (try
    (let [query-params (js->clj (.. req -query) :keywordize-keys true)
          query (compose/parse-compose-query query-params)
          snapshot (await (compose/compose-snapshot (projects/all) query))]
      (send-json reply
                 #js {:generatedAt (:generated-at snapshot)
                      :totalTasks (:total-tasks snapshot)
                      :query (clj->js query)
                      :columns (clj->js
                                (mapv (fn [col]
                                        #js {:status (:status col)
                                             :title (:title col)
                                             :taskCount (:task-count col)
                                                  :tasks (clj->js
                                                          (mapv (fn [t]
                                                                  #js {:uuid (:uuid t)
                                                                       :title (:title t)
                                                                       :status (:status t)
                                                                       :priority (:priority t)
                                                                       :labels (clj->js (:labels t))
                                                                       :createdAt (:created-at t)
                                                                       :sourcePath (:source-path t)
                                                                       :sourceBoard (:source-board t)
                                                                       :domain (:domain t)
                                                                       :org (:org t)
                                                                       :drift (:drift t)})
                                                                (:tasks col)))})
                                      (:columns snapshot)))}))
    (catch :default err (send-error reply 500 (.-message err)))))

(defn- register-routes [^js app]
  (.get app "/api/projects" handle-get-projects)
  (.get app "/api/boards" handle-get-boards)
  (.get app "/api/board" handle-get-board)
  (.get app "/api/board/compose" handle-compose)
  (.get app "/api/events" handle-get-events)
  (.get app "/api/events/stream" handle-events-stream)
  (.get app "/api/drift" handle-get-drift)
  (.get app "/api/task/:uuid/content" handle-get-task-content)
  (.patch app "/api/task/:uuid/frontmatter" handle-update-frontmatter)
  (.post app "/api/task/:uuid/comment" handle-post-comment)
  (.post app "/api/task/:uuid/status" handle-post-status)
  (.post app "/api/task/:uuid/open-editor" handle-open-editor)
  ;; MCP Streamable-HTTP endpoint — the orchestrator agent's toolbox (Slice 3).
  (.post app "/mcp" mcp/handle-post!)
  ;; Orchestrator chat — proxied to knoxx with the API key injected server-side.
  (.post app "/api/chat/start" chat-proxy/handle-start)
  (.post app "/api/chat" chat-proxy/handle-send)
  (.get app "/api/chat/stream" chat-proxy/handle-stream)
  (.get app "/api/health" handle-health))

(defn- sleep [ms] (js/Promise. (fn [resolve] (js/setTimeout resolve ms))))

(defn ^:async listen-with-retry!
  "Bind the listener, retrying transient EADDRINUSE. On hot-reload the previous
   listener's port can linger for a tick after `close()`; without a retry the
   re-`listen()` throws and leaves the dev server down until the next reload."
  [^js app host port attempts delay-ms]
  (loop [n attempts]
    (let [err (try
                (await (.listen app #js {:host host :port port}))
                nil
                (catch :default e e))]
      (cond
        (nil? err) app
        (and (> n 1) (= (.-code err) "EADDRINUSE"))
        (do (js/console.warn "[rheos] port" port "busy, retrying in" delay-ms "ms")
            (await (sleep delay-ms))
            (recur (dec n)))
        :else (throw err)))))

(defn ^:async start-http!
  "Create a fresh Fastify app, bind routes, and listen. Stored in `server-state`
   so the hot-reload hooks can close and recreate it without disturbing the
   durable watchers/project state."
  [host port]
  ;; forceCloseConnections: SSE streams are active connections that never end on
  ;; their own, so Fastify's default close() would leave the port held. Forcing
  ;; them closed lets stop-http! free the port deterministically before re-listen.
  (let [^js app (Fastify. #js {:logger true :forceCloseConnections true})
        current-dir (js/process.cwd)
        static-dir (path/join current-dir "resources" "public")
        js-dir (path/join current-dir "dist" "web" "js")]
    (await (.register app fastifyCors))
    ;; serve HTML/CSS from resources/public and the release JS bundle at /js
    (await (.register app fastifyStatic #js {:root static-dir :prefix "/"}))
    (await (.register app fastifyStatic #js {:root js-dir :prefix "/js" :decorateReply false}))
    (register-routes app)
    (await (listen-with-retry! app host port 5 250))
    (reset! server-state app)
    (js/console.log "Kanban server listening on http://" host ":" port)
    app))

(defn ^:async stop-http!
  "Close the current Fastify listener, releasing the port. Leaves watchers and
   project state intact — they are durable across hot reloads."
  []
  (when-let [^js app @server-state]
    (await (.close app))
    (reset! server-state nil)))

(defn ^:async init
  "Process entry (shadow :init-fn). Runs once at boot: load config, start the
   durable file watchers, remember host/port, then start the HTTP server. On hot
   reload this is NOT re-run — the load hooks below cycle only the HTTP listener."
  []
  (let [config-path (aget js/process.env "KANBAN_CONFIG")
        host (or (aget js/process.env "KANBAN_HOST") "127.0.0.1")
        port (js/parseInt (or (aget js/process.env "KANBAN_PORT") "8791"))
        loaded (await (config/load-config config-path))
        resolved (config/resolve-configured-projects loaded nil)]
    (projects/set-projects! resolved)
    (reset! boot-state {:host host :port port})
    (js/console.log "Loaded" (count (:projects resolved)) "projects")
    (when config-path (js/console.log "Config:" config-path))
    ;; Start file watchers for all projects
    (doseq [project (:projects resolved)]
      (watcher/start-watcher! (:id project) (:tasks-dir project)))
    (await (start-http! host port))))

(defn ^:async ^:dev/before-load-async stop-http-before-load!
  "Hot-reload: close the HTTP listener before new code loads so the port is free."
  [done]
  (try
    (await (stop-http!))
    (js/console.log "[rheos-hot-reload] HTTP server closed")
    (catch :default err
      (js/console.error "[rheos-hot-reload] failed to close HTTP server" err))
    (finally (done))))

(defn ^:async ^:dev/after-load-async start-http-after-load!
  "Hot-reload: re-create the HTTP server with freshly-loaded handlers. The durable
   watchers and project state established by `init` survive untouched."
  [done]
  (let [{:keys [host port]} @boot-state]
    (try
      (await (start-http! (or host "127.0.0.1") (or port 8791)))
      (js/console.log "[rheos-hot-reload] HTTP server restarted")
      (catch :default err
        (js/console.error "[rheos-hot-reload] failed to restart HTTP server" err))
      (finally (done)))))
