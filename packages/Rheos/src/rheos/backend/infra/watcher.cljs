(ns rheos.backend.infra.watcher
  "File watcher for detecting task file changes with drift detection."
  (:require ["chokidar" :as chokidar]
            ["node:fs/promises" :as fsp]
            [rheos.backend.domain.events :as events]
            [rheos.backend.infra.ledger :as ledger]))

(defn- md? [^js p] (.endsWith p ".md"))

(defonce watchers (atom {}))
(defonce pending-writes (atom {}))

(defn- extract-write-id [content]
  (let [match (re-find #"write-id:\s*\"([^\"]+)\"" content)]
    (when match (nth match 1))))

(defn- extract-uuid [content]
  (let [match (re-find #"uuid:\s*\"([^\"]+)\"" content)]
    (when match (nth match 1))))

(defn expect-write!
  "Register an expected file write so the watcher can correlate the resulting
   file event back to the CLI/HTTP mutation that produced it."
  [write-id task-id]
  (swap! pending-writes assoc write-id {:task-id task-id :time (.now js/Date)}))

(def register-cli-event! expect-write!)

(defn- cleanup-old-writes []
  (let [now (.now js/Date)
        cutoff (- now 30000)] ; 30 seconds
    (swap! pending-writes
           (fn [writes]
             (into {} (filter (fn [[_ v]] (> (:time v) cutoff)) writes))))))

(defn- correlate-write [write-id]
  (cleanup-old-writes)
  (let [info (and write-id (@pending-writes write-id))]
    (when info
      (swap! pending-writes dissoc write-id))
    info))

(defn ^:async handle-file-event!
  "Handle a single file change: read the file, extract the write-id, and either
   correlate it to a known mutation or emit a drift event."
  [board-id tasks-dir file-path _event-type]
  (try
    (let [content (await (.readFile fsp file-path "utf8"))
          write-id (extract-write-id content)
          uuid (extract-uuid content)
          ledger (ledger/get-ledger tasks-dir)]
      (when uuid
        (if (correlate-write write-id)
          (events/emit-file-changed! ledger board-id uuid write-id "correlated")
          (events/emit-drift-detected! ledger board-id uuid write-id))))
    (catch :default err
      (js/console.error "Watcher error:" file-path (.-message err)))))

(defn start-watcher! [board-id tasks-dir]
  (when-not (@watchers board-id)
    ;; chokidar v4 dropped glob support — watch the dir recursively and filter for
    ;; .md in the handlers (a glob like `dir/**/*.md` would be treated as a literal
    ;; path and silently match nothing).
    (let [watcher (chokidar/watch tasks-dir #js {:ignoreInitial true
                                                 :persistent true
                                                 :awaitWriteFinish true})]
      (.on watcher "change" (fn [path] (when (md? path) (handle-file-event! board-id tasks-dir path "change"))))
      (.on watcher "add" (fn [path] (when (md? path) (handle-file-event! board-id tasks-dir path "add"))))
      (.on watcher "unlink" (fn [path] (when (md? path) (handle-file-event! board-id tasks-dir path "unlink"))))
      (swap! watchers assoc board-id watcher)
      (js/console.log "Watcher started for" board-id ":" tasks-dir))))

(defn stop-watcher! [board-id]
  (when-let [watcher (@watchers board-id)]
    (.close watcher)
    (swap! watchers dissoc board-id)
    (js/console.log "Watcher stopped for" board-id)))

(defn stop-all-watchers! []
  (doseq [[board-id _watcher] @watchers]
    (stop-watcher! board-id)))
