(ns rheos.backend.infra.watcher
  "File watcher for detecting task file changes with drift detection."
  (:require ["chokidar" :as chokidar]
            ["node:fs/promises" :as fsp]
            ["node:path" :as path]
            [clojure.string :as str]
            [rheos.backend.domain.events :as events]
            [rheos.backend.infra.ledger :as ledger]
            [rheos.backend.law.fsm :as fsm]))

(defn- md? [^js p] (.endsWith p ".md"))

(defn projected?
  "Is `file-path` a file the board would actually scan?

   `projection-paths` is a project's resolved `:card-projection` roots.

   `nil` — no `:card-projection` configured — means the whole task root is the
   board, which is the legacy default. An **explicit empty** list is not the
   same thing: it means the board projects nothing, and it must scan nothing.
   The loader already draws that distinction (`{:paths []}` gives it no roots to
   walk), and the call site passes `(get-in project [:card-projection :paths])`,
   so absent and empty arrive here distinguishable. Collapsing them with
   `empty?` made the watcher scan the entire task root for a board that had
   asked for none of it.

   Without this the watcher and the loader disagree: the loader honours the
   projection, the watcher walks the entire task root, and any markdown holding
   a `uuid: \"...\"` line looks like a card to it. A design note or guide that
   quotes card frontmatter as an example then appends drift events to the
   authoritative ledger for a card that is not on the board."
  [projection-paths file-path]
  (or (nil? projection-paths)
      (let [resolved (path/resolve file-path)]
        (boolean
         (some (fn [root]
                 (let [root* (path/resolve root)]
                   (or (= root* resolved)
                       (str/starts-with? resolved (str root* path/sep)))))
               projection-paths)))))

(defonce watchers (atom {}))
(defonce pending-writes (atom {}))

(defn- extract-write-id [content]
  (let [match (re-find #"write-id:\s*\"([^\"]+)\"" content)]
    (when match (nth match 1))))

(defn- extract-uuid [content]
  (let [match (re-find #"uuid:\s*\"([^\"]+)\"" content)]
    (when match (nth match 1))))

(defn- extract-status [content]
  (let [match (re-find #"status:\s*\"([^\"]+)\"" content)]
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
  [board-id tasks-dir file-path event-type]
  (if (= event-type "unlink")
    (js/Promise.resolve nil)
    (try
      (let [content (await (.readFile fsp file-path "utf8"))
            write-id (extract-write-id content)
            uuid (extract-uuid content)
            ledger (ledger/get-ledger tasks-dir)]
        (when uuid
          (if-let [info (correlate-write write-id)]
            (if (= (:task-id info) uuid)
              (events/emit-file-changed! ledger board-id uuid write-id "correlated")
              (do
                (events/emit-drift-detected! ledger board-id uuid write-id)
                (let [status (extract-status content)
                      valid? (and status (some #(= status %) (:states fsm/promethean-fsm)))]
                  (events/emit-drift-protocol-rerun! ledger board-id uuid status (if valid? "valid" "invalid")))))
            (do
              (events/emit-drift-detected! ledger board-id uuid write-id)
              (let [status (extract-status content)
                    valid? (and status (some #(= status %) (:states fsm/promethean-fsm)))]
                (events/emit-drift-protocol-rerun! ledger board-id uuid status (if valid? "valid" "invalid")))))))
      (catch :default err
        (js/console.error "Watcher error:" file-path (.-message err))))))

(defn start-watcher!
  "Watch a board's task root for card changes.

   `projection-paths` narrows what counts as a card file to the project's
   configured `:card-projection` roots, so the watcher and the task loader agree
   on which files are on the board. Omit it, or pass an empty collection, to
   treat the whole task root as the board."
  ([board-id tasks-dir] (start-watcher! board-id tasks-dir nil))
  ([board-id tasks-dir projection-paths]
   (when-not (@watchers board-id)
    ;; chokidar v4 dropped glob support — watch the dir recursively and filter for
    ;; .md in the handlers (a glob like `dir/**/*.md` would be treated as a literal
    ;; path and silently match nothing).
     (let [watcher (chokidar/watch tasks-dir #js {:ignoreInitial true
                                                  :persistent true
                                                  :awaitWriteFinish true})
           card? (fn [p] (and (md? p) (projected? projection-paths p)))
           on (fn [event]
                (fn [p] (when (card? p) (handle-file-event! board-id tasks-dir p event))))]
       (.on watcher "change" (on "change"))
       (.on watcher "add" (on "add"))
       (.on watcher "unlink" (on "unlink"))
       (swap! watchers assoc board-id watcher)
       (js/console.log "Watcher started for" board-id ":" tasks-dir
                       (if (seq projection-paths)
                         (str "(projection: " (str/join ", " projection-paths) ")")
                         ""))))))

(defn stop-watcher! [board-id]
  (when-let [watcher (@watchers board-id)]
    (.close watcher)
    (swap! watchers dissoc board-id)
    (js/console.log "Watcher stopped for" board-id)))

(defn stop-all-watchers! []
  (doseq [[board-id _watcher] @watchers]
    (stop-watcher! board-id)))
