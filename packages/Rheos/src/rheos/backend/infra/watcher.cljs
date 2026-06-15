(ns rheos.backend.infra.watcher
  "File watcher for detecting task file changes with drift detection."
  (:require ["chokidar" :as chokidar]
            ["node:fs/promises" :as fsp]
            [rheos.backend.domain.events :as events]
            [rheos.backend.infra.ledger :as ledger]))

(defn- md? [^js p] (.endsWith p ".md"))

(defonce watchers (atom {}))
(defonce recent-cli-events (atom {}))

(defn- extract-write-id [content]
  (let [match (re-find #"write-id:\s*\"([^\"]+)\"" content)]
    (when match (nth match 1))))

(defn- extract-uuid [content]
  (let [match (re-find #"uuid:\s*\"([^\"]+)\"" content)]
    (when match (nth match 1))))

(defn register-cli-event! [write-id task-id]
  (swap! recent-cli-events assoc write-id {:task-id task-id :time (.now js/Date)}))

(defn- cleanup-old-events []
  (let [now (.now js/Date)
        cutoff (- now 30000)] ; 30 seconds
    (swap! recent-cli-events
           (fn [events]
             (into {} (filter (fn [[_ v]] (> (:time v) cutoff)) events))))))

(defn- check-drift [board-id tasks-dir file-path write-id uuid]
  (cleanup-old-events)
  (let [has-cli-event? (and write-id (@recent-cli-events write-id))]
    (when-not has-cli-event?
      (let [ledger (ledger/get-ledger tasks-dir)]
        (events/emit-frontmatter-change!
         ledger board-id uuid "drift-detected" nil nil
         (events/generate-write-id))
        (js/console.log "Drift detected:" file-path)))))

(defn- handle-file-change [board-id tasks-dir file-path _event-type]
  (let [fs fsp]
    (-> (.readFile fs file-path "utf8")
        (.then (fn [content]
                 (let [write-id (extract-write-id content)
                       uuid (extract-uuid content)
                       ledger (ledger/get-ledger tasks-dir)]
                   (when uuid
                     ;; Emit file change event
                     (events/emit-frontmatter-change!
                      ledger board-id uuid "file-changed" nil nil
                      (or write-id (events/generate-write-id)))
                     ;; Check for drift
                     (check-drift board-id tasks-dir file-path write-id uuid)))))
        (.catch (fn [err]
                  (js/console.error "Watcher error:" file-path (.-message err)))))))

(defn start-watcher! [board-id tasks-dir]
  (when-not (@watchers board-id)
    ;; chokidar v4 dropped glob support — watch the dir recursively and filter for
    ;; .md in the handlers (a glob like `dir/**/*.md` would be treated as a literal
    ;; path and silently match nothing).
    (let [watcher (chokidar/watch tasks-dir #js {:ignoreInitial true
                                                 :persistent true
                                                 :awaitWriteFinish true})]
      (.on watcher "change" (fn [path] (when (md? path) (handle-file-change board-id tasks-dir path "change"))))
      (.on watcher "add" (fn [path] (when (md? path) (handle-file-change board-id tasks-dir path "add"))))
      (.on watcher "unlink" (fn [path] (when (md? path) (handle-file-change board-id tasks-dir path "unlink"))))
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
