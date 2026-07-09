(ns rheos.backend.infra.config
  "Config loading and project resolution from openhax.kanban.json."
  (:require ["node:fs/promises" :as fsp]
            ["node:path" :as path]
            [clojure.string :as str]))

(def default-config-names ["openhax.kanban.json" "kanban.json"])
(def default-config-dirs ["." "kanban" ".kanban"])

(defn- ^:async try-paths [paths]
  (when (seq paths)
    (try
      (await (.access fsp (first paths)))
      (first paths)
      (catch :default _
        (await (try-paths (rest paths)))))))

(defn ^:async find-config-path [explicit-path]
  (if explicit-path
    (path/resolve (js/process.cwd) explicit-path)
    (let [candidates (for [dir default-config-dirs
                           name default-config-names]
                       (path/resolve (js/process.cwd) dir name))]
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
                                          candidate))]
                               (swap! seen conj id)
                               {:id id :title (or (some-> (:title project) str/trim) id)
                                :tasks-dir tasks-dir :meta (or (:meta project) {})
                                :fsm (or (:fsm project) (:fsm config))}))
                           (:projects config) (range))
            default-id (or (when-let [d (:defaultProject config)]
                             (when (some #(= (:id %) d) projects) d))
                           (:id (first projects)))]
        {:projects projects :default-project-id default-id})
      (let [tasks-dir (or explicit-resolved
                          (when (:tasksDir config) (path/resolve config-dir (:tasksDir config)))
                          (path/resolve (js/process.cwd) "docs/agile/tasks"))
            id (project-id-from-path tasks-dir)]
        {:projects [{:id id :title id :tasks-dir tasks-dir :meta {}
                     :fsm (:fsm config)}]
         :default-project-id id}))))
