(ns rheos.backend.infra.watcher
  "File watcher for detecting task file changes with drift detection."
  (:require ["chokidar" :as chokidar]
            ["node:fs/promises" :as fsp]
            ["node:path" :as path]
            [clojure.string :as str]
            [rheos.backend.domain.events :as events]
            [rheos.backend.infra.document-file-event :as document-file-event]
            [rheos.backend.infra.ledger :as ledger]
            [rheos.backend.law.fsm :as fsm]
            [rheos.backend.shape.content-parser :as content-parser]))

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

(defn card-fields
  "Read `uuid`, `write-id`, and `status` out of a card's frontmatter.

   This parses the frontmatter block with the same reader the rest of the board
   uses rather than regexing the raw file, and the distinction is not cosmetic.
   The regexes this replaced required a *double-quoted* scalar
   (`status: \"incoming\"`), which only cards the CLI had written ever carry.
   Hand-authored and normalized cards use plain YAML (`status: incoming`) —
   68 of this repo's 282 cards at the time of writing — and every one of them
   read back as `nil` and was then recorded in the authoritative ledger as an
   FSM violation.

   Scanning the raw file was the second half of the defect: a `status: \"done\"`
   quoted anywhere in a card's *prose* would satisfy the regex and be reported
   as that card's status."
  [raw]
  (let [{:keys [frontmatter]} (content-parser/parse-frontmatter raw)]
    (select-keys frontmatter [:uuid :write-id :status])))

(defn status-verdict
  "Classify a card's parsed `status` against the FSM.

   Three outcomes, not two. A status that is absent or unparseable is
   `\"unknown\"` — the watcher failed to read the card, which is not the same
   claim as the card holding a status the FSM forbids. Collapsing those two into
   `\"invalid\"` is what let a read failure be published as a verdict about the
   card's contents."
  [status]
  (cond
    (str/blank? status) "unknown"
    (some #(= status %) (:states fsm/promethean-fsm)) "valid"
    :else "invalid"))

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
            {:keys [uuid write-id status]} (card-fields content)
            ledger (ledger/get-ledger tasks-dir)]
        (when uuid
          ;; Only consume the pending registration once the file has proven it is
          ;; a card; a uuid-less file must not spend another card's write-id.
          (if (= (:task-id (correlate-write write-id)) uuid)
            (events/emit-file-changed! ledger board-id uuid write-id "correlated")
            (do
              (events/emit-drift-detected! ledger board-id uuid write-id)
              (events/emit-drift-protocol-rerun! ledger board-id uuid status
                                                 (status-verdict status))))))
      (catch :default err
        (js/console.error "Watcher error:" file-path (.-message err))))))

(defn ^:async handle-watched-markdown!
  "Sequence the typed document adapter before the legacy Kanban adapter.

   Every Markdown file is offered to the typed document adapter. Only files in
   the board's card projection continue through the legacy Kanban adapter. A
   profiled card may satisfy both; serializing their ledger appends prevents two
   file writers from racing on the same append-only EDN file."
  [board-id tasks-dir file-path event-type projection-paths]
  (await (document-file-event/handle-file-event!
          board-id tasks-dir file-path event-type))
  (when (projected? projection-paths file-path)
    (await (handle-file-event! board-id tasks-dir file-path event-type))))

(defn start-watcher!
  "Watch a board's task root for Markdown changes.

   Every Markdown file is checked for the typed document profile.
   `projection-paths` narrows only what continues through the legacy Kanban
   adapter to the project's configured `:card-projection` roots, so the watcher
   and task loader agree on which files are cards. Omit it to treat the whole
   task root as the legacy board; an explicit empty collection projects no
   legacy cards."
  ([board-id tasks-dir] (start-watcher! board-id tasks-dir nil))
  ([board-id tasks-dir projection-paths]
   (when-not (@watchers board-id)
    ;; chokidar v4 dropped glob support — watch the dir recursively and filter for
    ;; .md in the handlers (a glob like `dir/**/*.md` would be treated as a literal
    ;; path and silently match nothing).
     (let [watcher (chokidar/watch tasks-dir #js {:ignoreInitial true
                                                  :persistent true
                                                  :awaitWriteFinish true})
           on (fn [event]
                (fn [p]
                  (when (md? p)
                    ;; A profiled Markdown file emits a typed document proposal
                    ;; or rejection. Only projected files continue through the
                    ;; unchanged Kanban correlation/drift path.
                    (handle-watched-markdown!
                     board-id tasks-dir p event projection-paths))))]
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
