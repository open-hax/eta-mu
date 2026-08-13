(ns rheos.backend.infra.task-store
  "Markdown discovery plus the legacy Kanban task projection."
  (:require ["node:fs/promises" :as fsp]
            ["node:path" :as path]
            [clojure.string :as str]
            [rheos.backend.domain.kanban-projection :as kanban]
            [rheos.backend.domain.markdown-document :as markdown]
            [rheos.backend.infra.projects :as projects]
            [rheos.backend.shape.kanban :as shape]))

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
  "Normalize a loader source. A project map passes through; a tasks-dir string
   is resolved through the shared registry so configured projections survive."
  [source]
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

(defn ^:async load-documents
  "Load Markdown documents losslessly from the same configured roots Rheos uses
   for card projections.

   Frontmatter interpretation may be partial, but the exact frontmatter payload,
   body, and source path remain available to profile/reaction consumers."
  [source]
  (await (load-documents* (resolve-source source "load-documents"))))

(defn- document->task [document]
  (let [source-path (:document/source-path document)]
    (kanban/task document
                 {:fallback-title (path/basename source-path ".md")
                  :fallback-created-at (.toISOString (new js/Date))
                  :source-path source-path})))

(defn ^:async load-tasks
  "Load materialized card projections for a project.

   The filesystem boundary now loads lossless Markdown documents first. Kanban
   fields and defaults are a projection over those documents, not the ingest
   representation itself. Existing project/card-projection discovery behavior is
   preserved."
  [source]
  (let [resolved (resolve-source source "load-tasks")
        documents (await (load-documents* resolved))
        tasks (mapv document->task documents)]
    (vec (sort-by task-sort-key tasks))))
