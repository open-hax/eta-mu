(ns rheos.backend.infra.task-store
  "Task loading from projected Markdown files with YAML frontmatter parsing."
  (:require ["node:fs/promises" :as fsp]
            ["node:path" :as path]
            [clojure.string :as str]
            [rheos.backend.infra.projects :as projects]
            [rheos.backend.shape.kanban :as shape]))

(def status-index
  (into {} (map-indexed (fn [i s] [s i]) shape/StatusOrder)))

(defn- parse-yaml-simple [yaml-str]
  (let [lines (str/split-lines yaml-str)]
    (reduce (fn [acc line]
              (cond
                (re-matches #"^(\w[\w_-]*):\s*\"(.*)\"\s*" line)
                (let [[_ k v] (re-matches #"^(\w[\w_-]*):\s*\"(.*)\"\s*" line)]
                  (assoc acc (keyword k) v))

                (re-matches #"^(\w[\w_-]*):\s*(.+)\s*" line)
                (let [[_ k v] (re-matches #"^(\w[\w_-]*):\s*(.+)\s*" line)]
                  (assoc acc (keyword k) (str/trim v)))

                (re-matches #"^(\w[\w_-]*):\s*$" line)
                (let [[_ k] (re-matches #"^(\w[\w_-]*):\s*$" line)]
                  (assoc acc (keyword k) ""))

                :else acc))
            {}
            lines)))

(defn- parse-frontmatter [raw]
  (let [match (re-matches #"---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)" raw)]
    (if match
      (let [yaml-str (nth match 1)
            content (nth match 2)
            parsed (parse-yaml-simple yaml-str)]
        {:frontmatter parsed :content content})
      {:frontmatter {} :content raw})))

(defn- normalize-labels [labels tags]
  (let [raw (or labels tags [])
        items (cond
                (string? raw) (str/split raw #",")
                (vector? raw) raw
                :else [])]
    (vec (distinct (filter seq (mapv str/trim items))))))

(defn- normalize-status [status]
  (case (-> (or status "incoming") str/lower-case str/trim)
    "pending" "incoming"
    "completed" "done"
    (-> (or status "incoming") str/lower-case str/trim)))

(defn- ^:async parse-task-file [file-path _tasks-dir]
  (try
    (let [raw (await (.readFile fsp file-path "utf8"))
          {:keys [frontmatter content]} (parse-frontmatter raw)
          title (or (:title frontmatter) (path/basename file-path ".md"))
          priority (-> (or (:priority frontmatter) "P3") str/upper-case str/trim)
          labels (normalize-labels (:labels frontmatter) (:tags frontmatter))
          uuid (or (:uuid frontmatter)
                   (:slug frontmatter)
                   (-> title str/lower-case (str/replace #"[^a-z0-9]+" "-")))
          status (normalize-status (:status frontmatter))
          created-at (or (:created_at frontmatter)
                         (:createdAt frontmatter)
                         (.toISOString (new js/Date)))]
      {:uuid uuid
       :title title
       :slug (or (:slug frontmatter) uuid)
       :status status
       :priority priority
       :labels labels
       :created-at created-at
       :content content
       :source-path file-path})
    (catch :default err
      (js/console.error "Parse error:" file-path (.-message err))
      nil)))

(defn- ^:async is-directory? [full-path]
  (try
    (let [stat (await (.stat fsp full-path))]
      (.isDirectory stat))
    (catch :default _ false)))

(defn- ^:async is-file? [full-path]
  (try
    (let [stat (await (.stat fsp full-path))]
      (.isFile stat))
    (catch :default _ false)))

(defn- ^:async entry-kind
  "`:file`, `:dir`, `:link`, or nil — read with `lstat`, so a symlink reports as
   a link rather than as whatever it points at."
  [full-path]
  (try
    ;; ^js: `isSymbolicLink` is not in the externs shadow infers from, so the
    ;; call compiles to a munged name under :advanced without the hint.
    (let [^js st (await (.lstat fsp full-path))]
      (cond
        (.isSymbolicLink st) :link
        (.isDirectory st) :dir
        (.isFile st) :file
        :else nil))
    (catch :default _ nil)))

(declare collect-entry)

(defn- ^:async collect-below
  "Markdown files below `dir`, one level at a time."
  [dir]
  (try
    (let [names (await (.readdir fsp dir))
          nested (await
                  (js/Promise.all
                   (clj->js
                    (mapv #(collect-entry (path/join dir %)) names))))]
      (vec (apply concat nested)))
    (catch :default err
      (js/console.error "collect error:" dir (.-message err))
      [])))

(defn- ^:async collect-entry
  "One discovered entry, classified with `lstat`.

   Symlinks are **skipped, not followed**. The walk enforces no containment of
   its own — that check happens in `shape.config` against the *configured*
   projection roots — so a link planted underneath a projected root would
   otherwise pull cards in from anywhere the process can read, and a link back
   to an ancestor would recurse until the process died. Neither is hypothetical:
   `stat` follows links, and this walk used it."
  [entry-path]
  (let [kind (await (entry-kind entry-path))]
    (case kind
      :file (if (str/ends-with? entry-path ".md") [entry-path] [])
      :dir (await (collect-below entry-path))
      [])))

(defn- ^:async collect-markdown-files
  "Markdown files at or under a configured projection root.

   The root itself is resolved with `stat`, so it may legitimately be a symlink —
   `shape.config` has already resolved it and checked it stays inside the task
   root. Everything discovered *below* it goes through [[collect-entry]], which
   does not follow links."
  [entry-path]
  (try
    (cond
      (await (is-file? entry-path))
      (if (str/ends-with? entry-path ".md") [entry-path] [])

      (await (is-directory? entry-path))
      (await (collect-below entry-path))

      :else [])
    (catch :default err
      (js/console.error "collect error:" entry-path (.-message err))
      [])))

(defn- task-sort-key [task]
  [(get status-index (:status task) 99)
   (case (:priority task) "P0" 0 "P1" 1 "P2" 2 "P3" 3 4)
   (str/lower-case (:title task))])

(defn- source->project
  "Normalize `load-tasks`' argument. A project map passes through; a tasks-dir
   string is resolved through the shared registry so a configured project keeps
   its `:card-projection`."
  [source]
  (if (map? source)
    source
    (or (projects/find-project-by-tasks-dir source)
        {:tasks-dir source})))

(defn ^:async load-tasks
  "Load materialized card projections for a project.

   `source` is either a project map or a bare tasks-dir string. A project with
   `:card-projection {:paths [...]}` scans only those resolved paths; a bare
   tasks-dir preserves recursive legacy discovery.

   The resolved tasks-dir is checked because getting it wrong used to be
   invisible: `readdir` throws on a bad argument, [[collect-markdown-files]]
   catches everything and returns `[]`, and the caller reads that as \"the board
   has no cards\". A CLI verb shipped with exactly that mistake and reported
   `unknown task` for cards that existed. Fail where the mistake is, not five
   frames later — accepting a project map here does not make an unusable one
   silent."
  [source]
  (when-not (or (map? source) (and (string? source) (seq source)))
    (throw (ex-info (str "load-tasks expects a project map or a tasks directory path, got: " (pr-str source))
                    {:kind :usage :source source})))
  (let [project (source->project source)
        tasks-dir (:tasks-dir project)
        _ (when-not (and (string? tasks-dir) (seq tasks-dir))
            (throw (ex-info (str "load-tasks resolved no tasks directory from: " (pr-str source))
                            {:kind :usage :source source :tasks-dir tasks-dir})))
        projection (:card-projection project)
        roots (if (and projection (contains? projection :paths))
                (:paths projection)
                [tasks-dir])
        nested (await (js/Promise.all
                       (clj->js (mapv collect-markdown-files roots))))
        files (vec (distinct (apply concat nested)))
        tasks-raw (await (js/Promise.all
                          (clj->js
                           (mapv #(parse-task-file % tasks-dir) files))))
        tasks (filterv some? (vec tasks-raw))]
    (vec (sort-by task-sort-key tasks))))
