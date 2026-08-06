(ns rheos.backend.infra.config
  "Config loading and project resolution from openhax.kanban.json."
  (:require ["node:fs/promises" :as fsp]
            ["node:path" :as path]
            [clojure.string :as str]))

(def default-config-names ["openhax.kanban.json" "kanban.json"])

(defn- ^:async try-paths [paths]
  (when (seq paths)
    (try
      (await (.access fsp (first paths)))
      (first paths)
      (catch :default _
        (await (try-paths (rest paths)))))))

(defn- ^:async parent-dirs
  "Return [cwd, parent, grand-parent, ...] up to the filesystem root."
  []
  (let [cwd (js/process.cwd)]
    (loop [dir cwd
           dirs []]
      (if (or (str/blank? dir) (= dir (path/dirname dir)))
        (conj dirs dir)
        (recur (path/dirname dir) (conj dirs dir))))))

(defn ^:async find-config-path [explicit-path]
  (if explicit-path
    (path/resolve (js/process.cwd) explicit-path)
    (let [base-dirs (await (parent-dirs))
          candidates (for [dir base-dirs
                           subdir ["" "kanban" ".kanban"]
                           name default-config-names]
                       (path/resolve dir subdir name))]
      (await (try-paths candidates)))))

(defn ^:async load-config [explicit-path]
  (let [config-path (await (find-config-path explicit-path))]
    (if config-path
      (let [raw (await (.readFile fsp config-path "utf8"))
            parsed (js->clj (js/JSON.parse raw) :keywordize-keys true)]
        {:config parsed :config-path config-path :config-dir (path/dirname config-path)})
      {:config {} :config-dir (js/process.cwd)})))

(defn- project-id-from-path [tasks-dir]
  (-> (path/basename tasks-dir) str/lower-case
      (str/replace #"[^a-z0-9]+" "-") (str/replace #"^-|-$" "") (or "kanban")))

(defn- resolve-fsm-config
  "Resolve filesystem fields in an FSM overlay relative to the board config.

   This keeps checked-in project gates portable across workspaces while leaving
   string presets and FSM maps without a :cwd unchanged."
  [config-dir fsm-config]
  (if (and (map? fsm-config) (:cwd fsm-config))
    (update fsm-config :cwd #(path/resolve config-dir %))
    fsm-config))

(defn- resolve-card-projection
  "Resolve projection paths relative to the project's task root."
  [tasks-dir projection]
  (when projection
    (update projection :paths
            (fn [paths]
              (mapv #(path/resolve tasks-dir %) (or paths []))))))

(defn- project-card-config
  [config project tasks-dir]
  (let [card-dirs (or (:cardDirs project) (:card-dirs project)
                      (:cardDirs config) (:card-dirs config))
        projection (or (:cardProjection project) (:card-projection project)
                       (:cardProjection config) (:card-projection config))]
    (cond-> {}
      card-dirs (assoc :card-dirs card-dirs)
      projection (assoc :card-projection
                        (resolve-card-projection tasks-dir projection)))))

(defn resolve-configured-projects [loaded-config explicit-tasks-dir]
  (let [config-dir (:config-dir loaded-config)
        config (:config loaded-config)
        explicit-resolved (when explicit-tasks-dir (path/resolve (js/process.cwd) explicit-tasks-dir))]
    (if (and (:projects config) (seq (:projects config)))
      (let [seen (atom #{})
            projects (mapv (fn [project idx]
                             (let [tasks-dir (if (:tasksDir project)
                                               (path/resolve config-dir (:tasksDir project))
                                               (throw (ex-info (str "Project at index " idx " missing tasksDir") {:index idx})))
                                   base-id (or (some-> (:id project) str/trim)
                                               (project-id-from-path tasks-dir)
                                               (str "project-" (inc idx)))
                                   id (loop [candidate base-id suffix 2]
                                        (if (@seen candidate)
                                          (recur (str base-id "-" suffix) (inc suffix))
                                          candidate))
                                   fsm-config (or (:fsm project) (:fsm config))]
                               (swap! seen conj id)
                               (merge
                                {:id id :title (or (some-> (:title project) str/trim) id)
                                 :tasks-dir tasks-dir :meta (or (:meta project) (:meta config) {})
                                 :fsm (resolve-fsm-config config-dir fsm-config)}
                                (project-card-config config project tasks-dir))))
                           (:projects config) (range))
            default-id (or (when-let [d (:defaultProject config)]
                             (when (some #(= (:id %) d) projects) d))
                           (:id (first projects)))]
        {:projects projects :default-project-id default-id})
      (let [tasks-dir (or explicit-resolved
                          (when (:tasksDir config) (path/resolve config-dir (:tasksDir config)))
                          (path/resolve (js/process.cwd) "docs/agile/tasks"))
            id (project-id-from-path tasks-dir)]
        {:projects [(merge
                     {:id id :title id :tasks-dir tasks-dir :meta (or (:meta config) {})
                      :fsm (resolve-fsm-config config-dir (:fsm config))}
                     (project-card-config config {} tasks-dir))]
         :default-project-id id}))))
