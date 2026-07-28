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
  (-> (or status "incoming") str/lower-case str/trim))

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

(defn- ^:async collect-markdown-files [entry-path]
  (try
    (cond
      (await (is-file? entry-path))
      (if (str/ends-with? entry-path ".md") [entry-path] [])

      (await (is-directory? entry-path))
      (let [names (await (.readdir fsp entry-path))
            nested (await
                    (js/Promise.all
                     (clj->js
                      (mapv #(collect-markdown-files (path/join entry-path %))
                            names))))]
        (vec (apply concat nested)))

      :else [])
    (catch :default err
      (js/console.error "collect error:" entry-path (.-message err))
      [])))

(defn- task-sort-key [task]
  [(get status-index (:status task) 99)
   (case (:priority task) "P0" 0 "P1" 1 "P2" 2 "P3" 3 4)
   (str/lower-case (:title task))])

(defn- source->project [source]
  (if (map? source)
    source
    (or (projects/find-project-by-tasks-dir source)
        {:tasks-dir source})))

(defn ^:async load-tasks
  "Load materialized card projections for a project.

   A project with `:card-projection {:paths [...]}` scans only those resolved paths.
   Passing a bare tasks-dir preserves recursive legacy discovery; configured callers
   are resolved through the shared project registry during the migration."
  [source]
  (let [project (source->project source)
        tasks-dir (:tasks-dir project)
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
