(ns rheos.backend.infra.agent-tools
  "The board orchestrator's toolbox — thin wrappers over the existing domain
   functions (the same ones the HTTP handlers use).

   Two kinds of tools, and only these two:
   - READ-ONLY project inspection: read / glob / grep. The orchestrator must be
     able to understand the codebase to orchestrate well, but it never edits code.
   - BOARD reads + MUTATION: status changes go through [[transition/move-task!]],
     the single enforced path — FSM-checked, ledger-recorded, SSE-streamed — so
     the orchestrator's actions show up live in the UI.

   The orchestrator's ONLY write surface is the board. Code changes happen
   indirectly: moving a card changes board state, which triggers other agents
   downstream depending on the workflow. There is deliberately no code-write tool."
  (:require ["node:child_process" :as cp]
            ["node:fs/promises" :as fsp]
            ["node:path" :as path]
            [clojure.string :as str]
            [rheos.backend.domain.compose :as compose]
            [rheos.backend.domain.events :as events]
            [rheos.backend.domain.transition :as transition]
            [rheos.backend.infra.projects :as projects]
            [rheos.backend.infra.task-edit :as task-edit]
            [rheos.backend.infra.task-store :as tasks]
            [rheos.backend.infra.watcher :as watcher]
            [rheos.backend.shape.content-parser :as content-parser]))

(defn- env [k default] (or (aget js/process.env k) default))
(def project-root (path/resolve (env "KANBAN_PROJECT_ROOT" (js/process.cwd))))

;; ---------------------------------------------------------------------------
;; Read-only project inspection (rg + fs), confined to the project root
;; ---------------------------------------------------------------------------

(defn- safe-resolve [rel]
  (let [abs (path/resolve project-root (or rel "."))]
    (if (or (= abs project-root) (.startsWith abs (str project-root path/sep)))
      abs
      (throw (js/Error. (str "path escapes project root: " rel))))))

(defn- ^:async exec-file
  "Run `cmd args` under the project root, resolving with stdout. ripgrep exits 1
   when there are simply no matches — not an error, so resolve empty."
  [cmd args]
  (js/Promise.
   (fn [resolve _reject]
     (.execFile cp cmd (clj->js args)
                #js {:cwd project-root :maxBuffer (* 8 1024 1024)}
                (fn [err stdout _stderr]
                  (resolve (if (and err (not= 1 (.-code err)))
                             (str "ERROR: " (.-message err))
                             (or stdout ""))))))))

(defn- lines [s limit]
  (let [ls (->> (.split (str s) "\n") (remove #(= "" %)) vec)]
    (if (> (count ls) limit)
      (conj (subvec ls 0 limit) (str "… (" (- (count ls) limit) " more — refine your query)"))
      ls)))

(defn- ^:async tool-project-glob [{:keys [pattern limit]}]
  {:files (lines (await (exec-file "rg" ["--files" "-g" pattern])) (or limit 200))})

(defn- ^:async tool-project-grep [{:keys [pattern path glob limit]}]
  ;; Always pass an explicit search path — with none, rg reads stdin (a pipe under
  ;; execFile) and blocks forever instead of searching the tree.
  ;; Resolve the search path through safe-resolve (same guard tool-project-read
  ;; uses) so the orchestrator can't grep outside the project root.
  (let [args (cond-> ["-n" "--no-heading" "--color" "never"]
               glob (into ["-g" glob])
               true (into ["--" pattern])
               true (conj (safe-resolve path)))]
    {:matches (lines (await (exec-file "rg" args)) (or limit 200))}))

(defn- ^:async tool-project-read [{:keys [path max-bytes]}]
  (let [raw (await (.readFile fsp (safe-resolve path) "utf8"))
        cap (or max-bytes 60000)]
    {:path path :truncated (> (count raw) cap) :content (subs raw 0 (min cap (count raw)))}))

;; ---------------------------------------------------------------------------
;; Board reads + mutation — direct domain calls
;; ---------------------------------------------------------------------------

(defn- snapshot->summary [snapshot]
  {:total-tasks (:total-tasks snapshot)
   :columns (mapv (fn [c] {:status (:status c)
                           :count (:task-count c)
                           :tasks (mapv (fn [t] {:uuid (:uuid t) :title (:title t)
                                                 :priority (:priority t) :board (:source-board t)})
                                        (:tasks c))})
                  (:columns snapshot))})

(defn- project->wip-limits [project]
  (when-let [fsm (or (:fsm project) {})]
    (if (map? fsm)
      (:wip-limits fsm {})
      {})))

(defn- ^:async tool-kanban-read-board [{:keys [project]}]
  (let [proj (projects/find-project project)
        snapshot (await (compose/compose-snapshot (projects/all) (compose/parse-compose-query {})))]
    (assoc (snapshot->summary snapshot)
           :wip-limits (project->wip-limits proj))))

(defn- ^:async tool-kanban-search-tasks [{:keys [query]}]
  (let [snap (await (compose/compose-snapshot (projects/all) (compose/parse-compose-query {:q query})))]
    {:matches (->> (:columns snap)
                   (mapcat (fn [c] (mapv (fn [t] {:uuid (:uuid t) :title (:title t) :status (:status c)
                                                  :priority (:priority t) :board (:source-board t)})
                                         (:tasks c))))
                   vec)}))

(defn- ^:async load-task [project uuid]
  (let [all (await (tasks/load-tasks (:tasks-dir project)))]
    (first (filter #(= (:uuid %) uuid) all))))

(defn- ^:async tool-kanban-read-task [{:keys [uuid project]}]
  (let [proj (projects/find-project project)]
    (when-not proj (throw (js/Error. (str "unknown project: " project))))
    (let [task (await (load-task proj uuid))]
      (when-not task (throw (js/Error. (str "unknown task: " uuid))))
      (let [raw (await (.readFile fsp (:source-path task) "utf8"))
            parsed (content-parser/parse-task-content raw)]
        {:uuid uuid :frontmatter (:frontmatter parsed) :sections (:sections parsed)
         :source-path (:source-path task)}))))

(defn- ^:async tool-kanban-update-status [{:keys [uuid status project]}]
  (let [proj (projects/find-project project)]
    (when-not proj (throw (js/Error. (str "unknown project: " project))))
    (let [task (await (load-task proj uuid))]
      (when-not task (throw (js/Error. (str "unknown task: " uuid))))
      (let [result (await (transition/move-task! {:project proj :task task :new-status status :source "agent"}))]
        (if (:ok result)
          {:ok true :uuid uuid :from (:from result) :to (:to result)}
          (throw (js/Error. (str "transition rejected: " (:reason result)))))))))

(defn- ^:async tool-kanban-add-comment [{:keys [uuid text project]}]
  (when (empty? text) (throw (js/Error. "missing comment text")))
  (let [proj (projects/find-project project)]
    (when-not proj (throw (js/Error. (str "unknown project: " project))))
    (let [task (await (load-task proj uuid))]
      (when-not task (throw (js/Error. (str "unknown task: " uuid))))
      (await (task-edit/append-comment! {:project proj :task task :text text :source "agent"}))
      {:ok true :uuid uuid :comment text})))

(defn- slugify [title]
  (-> title
      str/lower-case
      (str/replace #"[^a-z0-9]+" "-")
      (str/replace #"^-+|-+$" "")
      (or "subtask")))

(defn- ^:async file-exists? [file-path]
  (try
    (await (.access fsp file-path))
    true
    (catch :default _ false)))

(defn- ^:async unique-file-path [dir slug uuid]
  (let [candidate (path/join dir (str slug ".md"))]
    (if (await (file-exists? candidate))
      (path/join dir (str slug "-" (subs uuid 0 8) ".md"))
      candidate)))

(defn- ^:async tool-kanban-create-subtask [{:keys [parent-uuid title project status priority labels]}]
  (let [proj (projects/find-project project)]
    (when-not proj (throw (js/Error. (str "unknown project: " project))))
    (let [parent (await (load-task proj parent-uuid))]
      (when-not parent (throw (js/Error. (str "unknown parent task: " parent-uuid))))
      (let [sub-uuid (str (random-uuid))
            sub-slug (slugify title)
            parent-dir (path/dirname (:source-path parent))
            file-path (await (unique-file-path parent-dir sub-slug sub-uuid))
            subtask {:uuid sub-uuid
                     :title title
                     :status (or status "incoming")
                     :priority (or priority "P3")
                     :labels (vec (or labels []))
                     :created_at (.toISOString (new js/Date))
                     :parent parent-uuid}
             raw (content-parser/serialize-task-content {:frontmatter subtask :sections []})
             write-id (events/generate-write-id)]
         (watcher/register-cli-event! write-id sub-uuid)
         (await (.writeFile fsp file-path raw "utf8"))
         {:ok true :uuid sub-uuid :title title :source-path file-path}))))

;; ---------------------------------------------------------------------------
;; Tool registry — name, description, JSON-Schema input, handler
;; ---------------------------------------------------------------------------

(def tools
  [{:name "project_glob"
    :description "List project files matching a glob (e.g. \"**/*.cljs\"). Read-only; respects .gitignore."
    :input-schema {:type "object"
                   :properties {:pattern {:type "string"} :limit {:type "integer"}}
                   :required ["pattern"]}
    :handler tool-project-glob}
   {:name "project_grep"
    :description "Search project file contents with ripgrep. Read-only. Use it to understand code before orchestrating."
    :input-schema {:type "object"
                   :properties {:pattern {:type "string"}
                                :path {:type "string" :description "optional path to scope the search"}
                                :glob {:type "string" :description "optional -g glob filter"}
                                :limit {:type "integer"}}
                   :required ["pattern"]}
    :handler tool-project-grep}
   {:name "project_read"
    :description "Read a project file (read-only, capped). Path is confined to the project root."
    :input-schema {:type "object"
                   :properties {:path {:type "string"} :max-bytes {:type "integer"}}
                   :required ["path"]}
    :handler tool-project-read}
   {:name "kanban_read_board"
    :description "Read the composed board: columns, per-column counts, tasks (uuid/title/priority/board), and WIP limits."
    :input-schema {:type "object" :properties {:project {:type "string"}}}
    :handler tool-kanban-read-board}
   {:name "kanban_search_tasks"
    :description "Search tasks across all boards by text query. Returns matching tasks (uuid/title/status/board)."
    :input-schema {:type "object" :properties {:query {:type "string"}} :required ["query"]}
    :handler tool-kanban-search-tasks}
   {:name "kanban_read_task"
    :description "Read one task's full content (frontmatter + body + comments) by uuid."
    :input-schema {:type "object"
                   :properties {:uuid {:type "string"} :project {:type "string"}}
                   :required ["uuid"]}
    :handler tool-kanban-read-task}
   {:name "kanban_update_status"
    :description "Move a task to a new status. FSM-enforced, ledger-recorded, streamed live to the board UI. This is the orchestrator's primary lever — moving a card is how downstream agents get triggered."
    :input-schema {:type "object"
                   :properties {:uuid {:type "string"} :status {:type "string"} :project {:type "string"}}
                   :required ["uuid" "status"]}
    :handler tool-kanban-update-status}
   {:name "kanban_add_comment"
    :description "Append a comment section to a task markdown file. The comment is streamed live via the ledger."
    :input-schema {:type "object"
                   :properties {:uuid {:type "string"} :text {:type "string"} :project {:type "string"}}
                   :required ["uuid" "text"]}
    :handler tool-kanban-add-comment}
   {:name "kanban_create_subtask"
    :description "Create a new task file linked to a parent task. The subtask starts in 'incoming'."
    :input-schema {:type "object"
                   :properties {:parent-uuid {:type "string"} :title {:type "string"}
                                :project {:type "string"} :status {:type "string"}
                                :priority {:type "string"} :labels {:type "array" :items {:type "string"}}}
                   :required ["parent-uuid" "title"]}
    :handler tool-kanban-create-subtask}])

(def ^:private aliases
  {"kanban-status-update" "kanban_update_status"
   "kanban-add-comment" "kanban_add_comment"
   "kanban-create-subtask" "kanban_create_subtask"
   "kanban-read-task" "kanban_read_task"
   "kanban-search-tasks" "kanban_search_tasks"
   "kanban-read-board" "kanban_read_board"})

(def ^:private by-name (into {} (map (juxt :name identity)) tools))

(defn ^:async dispatch
  "Run tool `name` with `args` (a clj map). Returns the handler's result (clj data)."
  [name args]
  (if-let [tool (or (by-name name) (by-name (aliases name)))]
    (await ((:handler tool) args))
    (throw (js/Error. (str "unknown tool: " name)))))
