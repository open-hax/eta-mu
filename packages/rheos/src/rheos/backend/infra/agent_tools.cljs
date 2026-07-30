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
            [rheos.backend.domain.compose :as compose]
            [rheos.backend.domain.task-create :as task-create]
            [rheos.backend.domain.task-edit :as task-edit]
            [rheos.backend.domain.transition :as transition]
            [rheos.backend.infra.projects :as projects]
            [rheos.backend.infra.task-store :as tasks]
            [rheos.backend.law.frontmatter :as law-frontmatter]
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
      (throw (ex-info (str "path escapes project root: " rel)
                      {:kind :refused :path rel})))))

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
  (let [fsm (:fsm project)]
    (if (map? fsm)
      (:wip-limits fsm {})
      {})))

(defn- compose-flags
  "Build a parse-compose-query flag map from MCP tool args. Every key maps
   straight onto the same query DSL the CLI (`cmd-compose`) and HTTP
   (`handle-compose`) surfaces already use, so all three stay in parity.

   `project` (singular) is a convenience alias for `projects` scoping; `q`
   and `query` are aliases for the title-substring filter."
  [{:keys [project projects status priority labels q query domain org tier where]}]
  (cond-> {}
    (or projects project) (assoc "projects" (or projects project))
    status       (assoc "status" status)
    priority     (assoc "priority" priority)
    labels       (assoc "labels" labels)
    (or q query) (assoc "q" (or q query))
    domain       (assoc "domain" domain)
    org          (assoc "org" org)
    tier         (assoc "tier" tier)
    where        (assoc "where" where)))

(defn- ^:async tool-kanban-read-board [{:keys [project] :as args}]
  (let [snapshot (await (compose/compose-snapshot
                         (projects/all)
                         (compose/parse-compose-query (compose-flags args))))]
    (assoc (snapshot->summary snapshot)
           ;; WIP limits are per-project — only meaningful for a single-project
           ;; view. Report them when a single `project` is named; a cross-project
           ;; composition has no single WIP set.
           :wip-limits (if project
                         (project->wip-limits (projects/find-project project))
                         {}))))

(defn- ^:async tool-kanban-search-tasks [args]
  (let [snap (await (compose/compose-snapshot
                     (projects/all)
                     (compose/parse-compose-query (compose-flags args))))]
    {:matches (->> (:columns snap)
                   (mapcat (fn [c] (mapv (fn [t] {:uuid (:uuid t) :title (:title t) :status (:status c)
                                                  :priority (:priority t) :board (:source-board t)})
                                         (:tasks c))))
                   vec)}))

(defn- tool-kanban-list-projects [_]
  {:projects (mapv (fn [p] {:id (:id p)
                            :title (:title p)
                            :default (= (:id p) (projects/default-id))
                            :meta (:meta p)})
                   (projects/all))})

(defn- ^:async load-task [project uuid]
  (let [all (await (tasks/load-tasks (:tasks-dir project)))]
    (first (filter #(= (:uuid %) uuid) all))))

(defn- ^:async tool-kanban-read-task [{:keys [uuid project]}]
  (let [proj (projects/find-project project)]
    (when-not proj (throw (ex-info (str "unknown project: " project)
                                   {:kind :not-found :project project})))
    (let [task (await (load-task proj uuid))]
      (when-not task (throw (ex-info (str "unknown task: " uuid)
                                   {:kind :not-found :uuid uuid})))
      (let [raw (await (.readFile fsp (:source-path task) "utf8"))
            parsed (content-parser/parse-task-content raw)]
        {:uuid uuid :frontmatter (:frontmatter parsed) :sections (:sections parsed)
         :source-path (:source-path task)}))))

(defn- ^:async tool-kanban-update-status [{:keys [uuid status project]}]
  (let [proj (projects/find-project project)]
    (when-not proj (throw (ex-info (str "unknown project: " project)
                                   {:kind :not-found :project project})))
    (let [task (await (load-task proj uuid))]
      (when-not task (throw (ex-info (str "unknown task: " uuid)
                                   {:kind :not-found :uuid uuid})))
      (let [result (await (transition/move-task! {:project proj :task task :new-status status :source "agent"}))]
        (if (:ok result)
          {:ok true :uuid uuid :from (:from result) :to (:to result)}
          (throw (ex-info (str "transition rejected: " (:reason result))
                          {:kind :refused :uuid uuid :from (:from result) :to status})))))))

(defn- ^:async tool-kanban-add-comment [{:keys [uuid text project]}]
  (when (empty? text) (throw (ex-info "missing comment text" {:kind :usage})))
  (let [proj (projects/find-project project)]
    (when-not proj (throw (ex-info (str "unknown project: " project)
                                   {:kind :not-found :project project})))
    (let [task (await (load-task proj uuid))]
      (when-not task (throw (ex-info (str "unknown task: " uuid)
                                   {:kind :not-found :uuid uuid})))
      (await (task-edit/append-comment! {:project proj :task task :text text :source "agent"}))
      {:ok true :uuid uuid :comment text})))

(defn- ^:async tool-kanban-update-frontmatter
  "Update descriptive frontmatter, enforcing the same closed key set the HTTP
   PATCH handler enforces ([[rheos.backend.law.frontmatter/mutable-keys]]).
   `:status` is refused here and routed to the FSM, so there stays exactly one
   way to change a card's status."
  [{:keys [uuid project updates]}]
  (when (empty? updates) (throw (ex-info "no frontmatter updates given" {:kind :usage})))
  (let [keyworded (into {} (map (fn [[k v]] [(keyword (name k)) v])) updates)]
    (when (law-frontmatter/status-update? keyworded)
      (throw (ex-info "status is FSM-governed — use `rheos move <uuid> --to <status>`"
                      {:kind :usage :key "status"})))
    (when-let [bad (seq (law-frontmatter/disallowed-keys keyworded))]
      (throw (ex-info (law-frontmatter/disallowed-keys-message bad)
                      {:kind :usage :keys (vec (map name bad))})))
    (let [proj (projects/find-project project)]
      (when-not proj (throw (ex-info (str "unknown project: " project)
                                     {:kind :not-found :project project})))
      (let [task (await (load-task proj uuid))]
        (when-not task (throw (ex-info (str "unknown task: " uuid)
                                       {:kind :not-found :uuid uuid})))
        (let [result (await (task-edit/update-frontmatter!
                             {:project proj :task task
                              :updates (into {} (map (fn [[k v]] [(name k) v])) keyworded)
                              :source "agent"}))]
          {:ok true :uuid uuid :frontmatter (:frontmatter result)})))))

(defn- ^:async tool-kanban-create-task
  "Create a card. Both this and `kanban_create_subtask` delegate to the one
   creation chokepoint, so a root card and a child card are the same operation
   and both land in the ledger."
  [{:keys [title project parent parent-uuid type card-type status priority points
           labels body dir uuid force-status]}]
  (let [proj (projects/find-project project)]
    (when-not proj (throw (ex-info (str "unknown project: " project)
                                   {:kind :not-found :project project})))
    (await (task-create/create-task!
            {:project proj
             :title title
             :card-type (or card-type type "task")
             :parent (or parent parent-uuid)
             :status status
             :priority priority
             :points points
             :labels (vec (or labels []))
             :body body
             :dir dir
             :uuid uuid
             :force-status? (true? force-status)
             :source "agent"}))))

(defn- ^:async tool-kanban-create-subtask [args]
  (await (tool-kanban-create-task (assoc args :parent (or (:parent-uuid args) (:parent args))))))

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
    :description "Read the composed board (columns, counts, tasks, WIP limits). SCOPE IT: pass `project` (one id) or `projects` (comma-separated ids); with neither it composes EVERY project (epiphany, eta-mu, proxx, truth) and is very large. Also filters by status/priority/labels/q and meta (domain/org/tier) or a `where` clause — the same query DSL the CLI and HTTP compose surfaces use. Call kanban_list_projects first if you don't know the project ids."
    :input-schema {:type "object"
                   :properties {:project {:type "string" :description "single project id — scopes the board and reports that project's WIP limits"}
                                :projects {:type "string" :description "comma-separated project ids to include (cross-project view)"}
                                :status {:type "string" :description "comma-separated statuses, e.g. \"in_progress,review\""}
                                :priority {:type "string" :description "comma-separated priorities, e.g. \"P0,P1\""}
                                :labels {:type "string" :description "comma-separated labels (matched with AND)"}
                                :q {:type "string" :description "title substring match"}
                                :domain {:type "string"} :org {:type "string"} :tier {:type "string"}
                                :where {:type "string" :description "clause DSL, e.g. \"points in 1,2 and meta.tier = core\" (supports = , ~ regex, in, contains; meta.* fields)"}}}
    :handler tool-kanban-read-board}
   {:name "kanban_search_tasks"
    :description "Search/filter tasks across projects; returns compact rows (uuid/title/status/priority/board). Combine `q` (title substring) with `projects`/`status`/`priority`/`labels`/`domain`/`org`/`tier`/`where` to scope. All optional — omit `q` to list by filter alone."
    :input-schema {:type "object"
                   :properties {:query {:type "string" :description "title substring (alias of q)"}
                                :q {:type "string"}
                                :projects {:type "string"} :project {:type "string"}
                                :status {:type "string"} :priority {:type "string"} :labels {:type "string"}
                                ;; Same shared filter surface as kanban_read_board — both
                                ;; funnel through `compose-flags`, so the schemas stay in parity.
                                :domain {:type "string"} :org {:type "string"} :tier {:type "string"}
                                :where {:type "string" :description "clause DSL, e.g. \"points in 1,2 and meta.tier = core\" (supports = , ~ regex, in, contains; meta.* fields)"}}}
    :handler tool-kanban-search-tasks}
   {:name "kanban_list_projects"
    :description "List the projects this board composes: id, title, default flag, and meta. Use it to discover valid project ids before scoping a kanban_read_board / kanban_search_tasks call."
    :input-schema {:type "object" :properties {}}
    :handler tool-kanban-list-projects}
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
   {:name "kanban_update_frontmatter"
    :description "Update a card's descriptive frontmatter (title, priority, labels, points, category, description, estimate, assignee). Ledger-recorded, one event per changed key. `status` is refused — it is FSM-governed, use kanban_update_status."
    :input-schema {:type "object"
                   :properties {:uuid {:type "string"} :project {:type "string"}
                                :updates {:type "object" :description "key -> value map of frontmatter fields to set"}}
                   :required ["uuid" "updates"]}
    :handler tool-kanban-update-frontmatter}
   {:name "kanban_create_task"
    :description "Create a card and record a task-created ledger event. Works for root cards and children alike — pass `parent` only for a child. The card enters at the project FSM's initial state; use kanban_update_status to advance it. Pass `body` to author the card's markdown, otherwise a skeleton (Outcome / Scope / Acceptance criteria) is written so the card can pass its first gate."
    :input-schema {:type "object"
                   :properties {:title {:type "string"}
                                :type {:type "string" :enum ["task" "epic"] :description "card type; default \"task\""}
                                :parent {:type "string" :description "parent card uuid — omit for a root card"}
                                :project {:type "string"}
                                :status {:type "string" :description "refused unless it is the FSM initial state; pass force-status to override"}
                                :force-status {:type "boolean"}
                                :priority {:type "string"} :points {:type "string"}
                                :labels {:type "array" :items {:type "string"}}
                                :body {:type "string" :description "card markdown below the frontmatter"}
                                :dir {:type "string" :description "target directory relative to the project task root"}
                                :uuid {:type "string" :description "explicit uuid; refused if already taken"}}
                   :required ["title"]}
    :handler tool-kanban-create-task}
   {:name "kanban_create_subtask"
    :description "Create a card linked to a parent task. Thin alias of kanban_create_task with a required parent; prefer kanban_create_task."
    :input-schema {:type "object"
                   :properties {:parent-uuid {:type "string"} :title {:type "string"}
                                :project {:type "string"} :status {:type "string"}
                                :priority {:type "string"} :body {:type "string"}
                                :labels {:type "array" :items {:type "string"}}}
                   :required ["parent-uuid" "title"]}
    :handler tool-kanban-create-subtask}])

(def ^:private aliases
  {"kanban-status-update" "kanban_update_status"
   "kanban-add-comment" "kanban_add_comment"
   "kanban-create-task" "kanban_create_task"
   "kanban-update-frontmatter" "kanban_update_frontmatter"
   "kanban-create-subtask" "kanban_create_subtask"
   "kanban-read-task" "kanban_read_task"
   "kanban-search-tasks" "kanban_search_tasks"
   "kanban-read-board" "kanban_read_board"
   "kanban-list-projects" "kanban_list_projects"})

(def ^:private by-name (into {} (map (juxt :name identity)) tools))

(defn ^:async dispatch
  "Run tool `name` with `args` (a clj map). Returns the handler's result (clj data)."
  [name args]
  (if-let [tool (or (by-name name) (by-name (aliases name)))]
    (await ((:handler tool) args))
    (throw (ex-info (str "unknown tool: " name) {:kind :usage :tool name}))))
