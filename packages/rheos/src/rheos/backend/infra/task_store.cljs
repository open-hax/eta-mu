(ns rheos.backend.infra.task-store
  "Markdown discovery plus the legacy Kanban task projection."
  (:require ["node:fs/promises" :as fsp]
            ["node:path" :as path]
            [clojure.string :as str]
            [rheos.backend.domain.kanban-projection :as kanban]
            [rheos.backend.infra.projects :as projects]
            [rheos.backend.shape.kanban :as shape]
            [rheos.backend.shape.markdown-document :as markdown]))

(def status-index
  (into {} (map-indexed (fn [i s] [s i]) shape/StatusOrder)))

(defn- ^:async read-document-file [file-path]
  (try
    (let [raw (await (.readFile fsp file-path "utf8"))]
      (assoc (markdown/parse raw)
             :document/source-path file-path))
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

(defn- ^:async entry-kind [full-path]
  (try
    (let [^js st (await (.lstat fsp full-path))]
      (cond
        (.isSymbolicLink st) :link
        (.isDirectory st) :dir
        (.isFile st) :file
        :else nil))
    (catch :default _ nil)))

(declare collect-entry)

(defn- ^:async collect-below [dir]
  (try
    (let [names (await (.readdir fsp dir))
          nested (await
                  (js/Promise.all
                   (clj->js (mapv #(collect-entry (path/join dir %)) names))))]
      (vec (apply concat nested)))
    (catch :default err
      (js/console.error "collect error:" dir (.-message err))
      [])))

(defn- ^:async collect-entry [entry-path]
  (let [kind (await (entry-kind entry-path))]
    (case kind
      :file (if (str/ends-with? entry-path ".md") [entry-path] [])
      :dir (await (collect-below entry-path))
      [])))

(defn- ^:async collect-markdown-files [entry-path]
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

(defn- source->project [source]
  (if (map? source)
    source
    (or (projects/find-project-by-tasks-dir source)
        {:tasks-dir source})))

(defn- resolve-source [source caller]
  (when-not (or (map? source) (and (string? source) (seq source)))
    (throw (ex-info (str caller " expects a project map or a tasks directory path, got: " (pr-str source))
                    {:kind :usage :source source})))
  (let [project (source->project source)
        tasks-dir (:tasks-dir project)]
    (when-not (and (string? tasks-dir) (seq tasks-dir))
      (throw (ex-info (str caller " resolved no tasks directory from: " (pr-str source))
                      {:kind :usage :source source :tasks-dir tasks-dir})))
    (let [projection (:card-projection project)
          roots (if (and projection (contains? projection :paths))
                  (:paths projection)
                  [tasks-dir])]
      {:project project
       :tasks-dir tasks-dir
       :roots roots})))

(defn- ^:async load-documents* [{:keys [roots]}]
  (let [nested (await (js/Promise.all
                       (clj->js (mapv collect-markdown-files roots))))
        files (vec (distinct (apply concat nested)))
        documents-raw (await (js/Promise.all
                              (clj->js (mapv read-document-file files))))]
    (filterv some? (vec documents-raw))))

(defn ^:async load-documents [source]
  (await (load-documents* (resolve-source source "load-documents"))))

(defn- document->task [document]
  (let [source-path (:document/source-path document)]
    (kanban/task document
                 {:fallback-title (path/basename source-path ".md")
                  :fallback-created-at (.toISOString (new js/Date))
                  :source-path source-path})))

(defn ^:async load-tasks [source]
  (let [resolved (resolve-source source "load-tasks")
        documents (await (load-documents* resolved))
        tasks (mapv document->task documents)]
    (vec (sort-by task-sort-key tasks))))
