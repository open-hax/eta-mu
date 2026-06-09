(ns eta-mu.kanban.server
  "Fastify HTTP server for the kanban board."
  (:require ["fastify" :default Fastify]
            ["@fastify/cors" :default fastifyCors]
            [eta-mu.kanban.board :as board]
            [eta-mu.kanban.compose :as compose]
            [eta-mu.kanban.config :as config]
            [eta-mu.kanban.events :as events]
            [eta-mu.kanban.tasks :as tasks]
            [eta-mu.kanban.task-writeback :as writeback]))

(defonce server-state (atom nil))
(defonce project-state (atom nil))

(defn- find-project [project-id]
  (let [projects (:projects @project-state)
        default-id (:default-project-id @project-state)
        pid (or project-id default-id)]
    (first (filter #(= (:id %) pid) projects))))

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
(defn- send-error [reply code msg] (.code (.send reply #js {:error msg}) code))

(defn- handle-get-projects [_req reply]
  (send-json reply
             #js {:defaultProjectId (:default-project-id @project-state)
                  :projects (clj->js (mapv (fn [p] #js {:id (:id p) :title (:title p)}) (:projects @project-state)))}))

(defn- handle-get-boards [_req reply]
  (send-json reply
             #js {:defaultProjectId (:default-project-id @project-state)
                  :projects (clj->js (mapv (fn [p] #js {:id (:id p) :title (:title p) :meta (clj->js (:meta p))}) (:projects @project-state)))}))

(defn ^:async handle-get-board [req reply]
  (let [project (find-project (.. req -query -project))]
    (if-not project
      (send-error reply 404 "unknown project")
      (try
        (let [all-tasks (await (tasks/load-tasks (:tasks-dir project)))
              snapshot (board/build-board-snapshot all-tasks)]
          (send-json reply (serialize-board project snapshot)))
        (catch :default err (send-error reply 500 (.-message err)))))))

(defn ^:async handle-get-events [req reply]
  (let [project (find-project (.. req -query -project))]
    (if-not project
      (send-error reply 404 "unknown project")
      (try
        (let [ledger (events/get-ledger (:tasks-dir project))
              task-id (.. req -query -taskId)
              limit (.. req -query -limit)
              filter-spec (if task-id {:task-id task-id} {})
              evts (await (events/query-events ledger (clj->js filter-spec)))
              result (if limit (vec (take-last (js/parseInt limit) evts)) evts)]
          (send-json reply #js {:events (clj->js (mapv events/envelope->kanban-event result)) :total (count result)}))
        (catch :default err (send-error reply 500 (.-message err)))))))

(defn ^:async handle-get-drift [req reply]
  (let [project (find-project (.. req -query -project))]
    (if-not project
      (send-error reply 404 "unknown project")
      (try
        (let [ledger (events/get-ledger (:tasks-dir project))
              drift-evts (await (events/query-events ledger #js {:type "drift-detected"}))]
          (send-json reply #js {:events (clj->js (mapv events/envelope->kanban-event drift-evts)) :total (count drift-evts)}))
        (catch :default err (send-error reply 500 (.-message err)))))))

(defn ^:async handle-post-status [req reply]
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
                  (let [write-id (events/generate-write-id)
                        ledger (events/get-ledger (:tasks-dir project))
                        updated (await (writeback/write-task-status task (:tasks-dir project) new-status))]
                    (events/emit-status-change! ledger (:id project) uuid (:status task) new-status write-id)
                    (send-json reply (serialize-task updated)))))
              (catch :default err (send-error reply 500 (.-message err)))))))

(defn- handle-health [_req reply] (send-json reply #js {:ok true}))

(defn ^:async handle-compose [req reply]
  (try
    (let [query-params (js->clj (.. req -query) :keywordize-keys true)
          query (compose/parse-compose-query query-params)
          projects (:projects @project-state)
          filtered-projects (compose/filter-projects-for-debug projects query)
          _ (js/console.error "COMPOSE:" (count filtered-projects) "projects match," (count (:where-clauses query)) "where-clauses")
          snapshot (await (compose/compose-snapshot projects query))]
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
                                                                  :sourceBoard (:source-board t)})
                                                           (:tasks col)))})
                                      (:columns snapshot)))}))
    (catch :default err (send-error reply 500 (.-message err)))))

(defn- register-routes [app]
  (.get app "/api/projects" handle-get-projects)
  (.get app "/api/boards" handle-get-boards)
  (.get app "/api/board" handle-get-board)
  (.get app "/api/board/compose" handle-compose)
  (.get app "/api/events" handle-get-events)
  (.get app "/api/drift" handle-get-drift)
  (.post app "/api/task/:uuid/status" handle-post-status)
  (.get app "/api/health" handle-health))

(defn ^:async start!
  ([] (start! "127.0.0.1" 8791))
  ([host port]
   (let [app (Fastify. #js {:logger true})]
     (await (.register app fastifyCors))
     (register-routes app)
     (await (.listen app #js {:host host :port port}))
     (reset! server-state app)
     (js/console.log "Kanban server listening on http://" host ":" port)
     app)))

(defn ^:async stop! []
  (when-let [app @server-state]
    (await (.close app))
    (reset! server-state nil)
    (js/console.log "Kanban server stopped")))

(defn ^:async init []
  (let [config-path (aget js/process.env "KANBAN_CONFIG")
        host (or (aget js/process.env "KANBAN_HOST") "127.0.0.1")
        port (js/parseInt (or (aget js/process.env "KANBAN_PORT") "8791"))
        loaded (await (config/load-config config-path))
        projects (config/resolve-configured-projects loaded nil)]
    (reset! project-state projects)
    (js/console.log "Loaded" (count (:projects projects)) "projects")
    (when config-path (js/console.log "Config:" config-path))
    (await (start! host port))))
