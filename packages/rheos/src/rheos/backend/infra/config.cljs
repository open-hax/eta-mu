(ns rheos.backend.infra.config
  "Find a board config file, read it, and resolve the projects it declares.

   Decoding belongs to [[rheos.backend.shape.config]] — this namespace owns the
   filesystem: where to look, what to read, and turning declared paths into
   resolved ones."
  (:require ["node:fs" :as fs]
            ["node:fs/promises" :as fsp]
            ["node:path" :as path]
            [clojure.string :as str]
            [rheos.backend.shape.config :as shape-config]))

;; Re-exported so existing callers and tests keep one import. The definitions
;; live in the shape layer; these are the names this namespace has always
;; published.
(def default-config-names shape-config/default-config-names)
(def config-format shape-config/config-format)
(def normalize-config shape-config/normalize-config)
(def parse-config-content shape-config/parse-config-content)

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

(defn- real-path
  "`p` with symlinks resolved — resolving as much of it as exists.

   A projection directory is allowed to be created after the config names it,
   so a missing leaf is not an error. But returning the *lexical* path in that
   case is wrong, and was a hole: only the leaf is unknown, while its ancestors
   are on disk and may well be symlinks. Given `tasks/linked/new-cards` where
   `tasks/linked` points outside the task root, the lexical fallback answered
   with a path that looked contained, so the containment check passed and every
   card later written there landed outside the root.

   So: walk up to the nearest ancestor that does exist, resolve that, and
   re-attach the missing suffix. Only a genuinely-absent path is tolerated —
   anything else (a permission error, say) is rethrown rather than silently
   downgraded to \"not on disk\"."
  [p]
  (loop [current (path/resolve p) suffix []]
    (let [resolved (try (.realpathSync fs current)
                        (catch :default e
                          (when-not (= "ENOENT" (.-code e)) (throw e))
                          nil))]
      (cond
        resolved (apply path/join resolved suffix)

        ;; Reached the filesystem root without finding anything that exists.
        ;; Nothing to resolve; the lexical path is all there is.
        (= current (path/dirname current)) (path/resolve p)

        :else (recur (path/dirname current)
                     (into [(path/basename current)] suffix))))))

(defn- within-root?
  "Is `candidate` inside `root`, after both have their symlinks resolved?

   Comparing lexical paths is not enough. `path/resolve` never touches the
   filesystem, so a symlink sitting *under* the task root but pointing outside
   it produces a path that looks contained and is not — and
   `collect-markdown-files` follows symlinks through `stat`, so the board would
   quietly load cards from wherever it led."
  [root candidate]
  (let [root* (real-path root)
        candidate* (real-path candidate)]
    (or (= root* candidate*)
        (str/starts-with? candidate* (str root* path/sep)))))

(defn- resolve-card-projection
  "Resolve projection paths against the project's task root, refusing any that
   escape it.

   The escape check belongs here rather than only at the write: a projection
   path is where the board *looks*, so one pointing outside the task root makes
   every card written there invisible to the board while the config still reads
   as valid."
  [tasks-dir projection]
  (when projection
    (let [paths (:paths projection)]
      (when-not (sequential? paths)
        (throw (ex-info "card-projection requires a sequential :paths value"
                        {:card-projection projection})))
      (assoc projection
             :paths
             (mapv (fn [relative-path]
                     ;; Refuse absolute paths outright. `path/resolve` ignores
                     ;; `tasks-dir` when the second argument is absolute, so one
                     ;; that happens to sit inside the root passes containment
                     ;; and yields a config that only works on the machine it
                     ;; was written on. Containment is a safety check; this is a
                     ;; portability one, and the two are not the same.
                     (when (path/isAbsolute (str relative-path))
                       (throw (ex-info
                               (str "card projection path must be relative to the task root: "
                                    relative-path)
                               {:tasks-dir tasks-dir :path relative-path})))
                     (let [resolved (path/resolve tasks-dir (str relative-path))]
                       (when-not (within-root? tasks-dir resolved)
                         (throw (ex-info
                                 (str "card projection path escapes task root: " relative-path)
                                 {:tasks-dir tasks-dir :path relative-path})))
                       resolved))
                   paths)))))

(defn- project-card-config
  "The card-placement half of a project: where each card type lands
   (`:card-dirs`) and which paths the board scans (`:card-projection`). A
   project-level value wins over the board-level default.

   Keys are read in kebab-case only. [[parse-config-content]] pushes every
   config — EDN and legacy JSON alike — through [[normalize-config]] first, so
   `cardDirs` from a JSON board has already become `:card-dirs` by the time it
   reaches here."
  [config project tasks-dir]
  (let [card-dirs (or (:card-dirs project) (:card-dirs config))
        projection (or (:card-projection project) (:card-projection config))]
    (cond-> {}
      card-dirs (assoc :card-dirs card-dirs)
      projection (assoc :card-projection
                        (resolve-card-projection tasks-dir projection)))))

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
                     fsm-config (or (:fsm project) (:fsm config))]
                 (swap! seen conj id)
                 (merge
                  {:id id
                   :title (or (some-> (:title project) str str/trim) id)
                   :tasks-dir tasks-dir
                   :meta (or (:meta project) (:meta config) {})
                   :fsm (resolve-fsm-config config-dir fsm-config)}
                  (project-card-config config project tasks-dir))))
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
        {:projects [(merge
                     {:id id
                      :title id
                      :tasks-dir tasks-dir
                      :meta (or (:meta config) {})
                      :fsm (resolve-fsm-config config-dir (:fsm config))}
                     (project-card-config config {} tasks-dir))]
         :default-project-id id}))))
