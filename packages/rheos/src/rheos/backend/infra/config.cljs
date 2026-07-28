(ns rheos.backend.infra.config
  "Config loading and project resolution for Rheos boards."
  (:require ["node:fs/promises" :as fsp]
            ["node:path" :as path]
            [cljs.reader :as reader]
            [clojure.string :as str]))

(def default-config-names
  ["openhax.kanban.edn" "kanban.edn"
   "openhax.kanban.json" "kanban.json"])

(defn- normalize-key [k]
  (if (or (keyword? k) (string? k))
    (-> (name k)
        (str/replace #"([a-z0-9])([A-Z])" "$1-$2")
        str/lower-case
        keyword)
    k))

(defn normalize-config
  "Normalize EDN and legacy JSON config into one kebab-case Clojure shape."
  [value]
  (cond
    (map? value)
    (into {} (map (fn [[k v]] [(normalize-key k) (normalize-config v)]) value))

    (vector? value)
    (mapv normalize-config value)

    (sequential? value)
    (mapv normalize-config value)

    :else value))

(defn config-format [config-path]
  (let [lower (str/lower-case (str config-path))]
    (cond
      (str/ends-with? lower ".edn") :edn
      (str/ends-with? lower ".json") :json
      :else :unknown)))

(defn parse-config-content
  "Parse one config file by extension and return the normalized config map."
  [config-path raw]
  (normalize-config
   (case (config-format config-path)
     :edn (reader/read-string raw)
     :json (js->clj (js/JSON.parse raw) :keywordize-keys true)
     (throw (ex-info (str "Unsupported Rheos config format: " config-path)
                     {:config-path config-path})))))

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
            format (config-format config-path)
            _ (when (= :json format)
                (js/console.warn
                 (str "[rheos] JSON board config is deprecated: " config-path
                      "; migrate to openhax.kanban.edn")))
            parsed (parse-config-content config-path raw)]
        {:config parsed
         :config-format format
         :config-path config-path
         :config-dir (path/dirname config-path)})
      {:config {} :config-format nil :config-dir (js/process.cwd)})))

(defn- project-id-from-path [tasks-dir]
  (-> (path/basename tasks-dir)
      str/lower-case
      (str/replace #"[^a-z0-9]+" "-")
      (str/replace #"^-|-$" "")
      (or "kanban")))

(defn- resolve-fsm-config
  "Resolve filesystem fields in an FSM overlay relative to the board config."
  [config-dir fsm-config]
  (if (and (map? fsm-config) (:cwd fsm-config))
    (update fsm-config :cwd #(path/resolve config-dir %))
    fsm-config))

(defn- within-root? [root candidate]
  (or (= root candidate)
      (str/starts-with? candidate (str root path/sep))))

(defn- resolve-card-projection [tasks-dir projection]
  (when projection
    (let [paths (:paths projection)]
      (when-not (sequential? paths)
        (throw (ex-info "card-projection requires a sequential :paths value"
                        {:card-projection projection})))
      (assoc projection
             :paths
             (mapv (fn [relative-path]
                     (let [resolved (path/resolve tasks-dir (str relative-path))]
                       (when-not (within-root? tasks-dir resolved)
                         (throw (ex-info
                                 (str "card projection path escapes task root: " relative-path)
                                 {:tasks-dir tasks-dir :path relative-path})))
                       resolved))
                   paths)))))

(defn resolve-configured-projects [loaded-config explicit-tasks-dir]
  (let [config-dir (:config-dir loaded-config)
        config (:config loaded-config)
        explicit-resolved (when explicit-tasks-dir
                            (path/resolve (js/process.cwd) explicit-tasks-dir))]
    (if (and (:projects config) (seq (:projects config)))
      (let [seen (atom #{})
            projects
            (mapv
             (fn [project idx]
               (let [tasks-dir (if (:tasks-dir project)
                                 (path/resolve config-dir (:tasks-dir project))
                                 (throw (ex-info (str "Project at index " idx " missing tasks-dir")
                                                 {:index idx})))
                     base-id (or (some-> (:id project) str str/trim)
                                 (project-id-from-path tasks-dir)
                                 (str "project-" (inc idx)))
                     id (loop [candidate base-id suffix 2]
                          (if (@seen candidate)
                            (recur (str base-id "-" suffix) (inc suffix))
                            candidate))
                     fsm-config (or (:fsm project) (:fsm config))
                     projection (or (:card-projection project)
                                    (:card-projection config))]
                 (swap! seen conj id)
                 {:id id
                  :title (or (some-> (:title project) str str/trim) id)
                  :tasks-dir tasks-dir
                  :card-projection (resolve-card-projection tasks-dir projection)
                  :meta (or (:meta project) (:meta config) {})
                  :fsm (resolve-fsm-config config-dir fsm-config)}))
             (:projects config)
             (range))
            default-id (or (when-let [d (:default-project config)]
                             (when (some #(= (:id %) d) projects) d))
                           (:id (first projects)))]
        {:projects projects :default-project-id default-id})
      (let [tasks-dir (or explicit-resolved
                          (when (:tasks-dir config)
                            (path/resolve config-dir (:tasks-dir config)))
                          (path/resolve (js/process.cwd) "docs/agile/tasks"))
            id (project-id-from-path tasks-dir)]
        {:projects [{:id id
                     :title id
                     :tasks-dir tasks-dir
                     :card-projection
                     (resolve-card-projection tasks-dir (:card-projection config))
                     :meta (or (:meta config) {})
                     :fsm (resolve-fsm-config config-dir (:fsm config))}]
         :default-project-id id}))))
