(ns rheos.backend.infra.cli
  "CLI entry point for kanban operations.

   Three things are load-bearing here and easy to break:

   1. **[[verbs]] is the single source of help.** `rheos --help`, `rheos help
      <verb>`, `rheos <verb> --help`, and the reference table in `docs/cli.md`
      all render from it. Adding a verb without an entry fails the test suite,
      because undocumented verbs are how agents end up guessing.

   2. **Exit codes are a contract** ([[exit-codes]]). Every failure path exits
      non-zero with one line on stderr. A CLI that always exits 0 cannot be
      scripted and cannot be trusted by an agent.

   3. **Tool-backed verbs print JSON on stdout by default.** The `eta-mu kanban`
      bridge parses `read-board` stdout, so that default is not cosmetic."
  (:require [clojure.string :as str]
            ["node:fs/promises" :as fsp]
            [rheos.backend.domain.board :as board]
            [rheos.backend.domain.compose :as compose]
            [rheos.backend.domain.task-create :as task-create]
            [rheos.backend.infra.agent-tools :as agent-tools]
            [rheos.backend.infra.config :as config]
            [rheos.backend.domain.events :as events]
            [rheos.backend.infra.ledger :as ledger]
            [rheos.backend.infra.projects :as projects]
            [rheos.backend.infra.task-store :as tasks]
            [rheos.backend.domain.transition :as transition]
            [rheos.backend.infra.view-store :as views]
            [rheos.backend.infra.http-server :as http-server]))

(def bin-name "rheos")

;; ---------------------------------------------------------------------------
;; Exit contract
;; ---------------------------------------------------------------------------

(def exit-codes
  "What a caller may branch on. Stable — treat changes as breaking."
  {:ok 0 :usage 1 :not-found 2 :refused 3 :internal 4})

(defn- debug? []
  (or (= "1" (aget js/process.env "RHEOS_DEBUG"))
      (= "true" (aget js/process.env "RHEOS_DEBUG"))))

(defn- exit! [kind]
  (set! (.-exitCode js/process) (get exit-codes kind (:internal exit-codes))))

(defn- fail!
  "Report a failure on stderr and set the process exit code. Never prints a stack
   trace unless RHEOS_DEBUG is set — a stack trace is noise to a caller that just
   needs to know what went wrong."
  ([kind message] (fail! kind message nil))
  ([kind message err]
   (js/console.error (str bin-name ": " message))
   (when (and err (debug?)) (js/console.error err))
   (exit! kind)))

;; ---------------------------------------------------------------------------
;; Argument parsing
;; ---------------------------------------------------------------------------

(def ^:private boolean-flags
  "Flags that take no value. Everything else consumes the next token, so a value
   is still allowed to start with `--`."
  #{"verbose" "json" "debug" "help" "force" "force-status"})

(defn- flag-token? [s] (and (string? s) (str/starts-with? s "--")))

(defn- add-flag
  "Accumulate a flag. Repeats collect into a vector so `--set a=1 --set b=2`
   works; single occurrences stay scalar."
  [acc k v]
  (if (contains? acc k)
    (let [cur (get acc k)]
      (assoc acc k (if (vector? cur) (conj cur v) [cur v])))
    (assoc acc k v)))

(defn parse-args [args]
  (let [args-vec (vec args)
        cmd (when (and (seq args-vec) (not (flag-token? (nth args-vec 0)))) (nth args-vec 0))
        sub (when (and (> (count args-vec) 1) (not (flag-token? (nth args-vec 1)))) (nth args-vec 1))
        rest-args (if sub (subvec args-vec 2) (if cmd (subvec args-vec 1) args-vec))
        flags (loop [remaining rest-args acc {}]
                (if (empty? remaining)
                  acc
                  (let [k (first remaining)
                        v (second remaining)
                        flag-name (when (flag-token? k) (subs k 2))]
                    (cond
                      (nil? flag-name)
                      (recur (rest remaining) acc)

                      ;; Boolean: only consume the next token if it is an explicit
                      ;; true/false, so `--json --project x` parses both flags.
                      (contains? boolean-flags flag-name)
                      (if (contains? #{"true" "false"} v)
                        (recur (drop 2 remaining) (add-flag acc flag-name v))
                        (recur (rest remaining) (add-flag acc flag-name "true")))

                      :else
                      (recur (drop 2 remaining) (add-flag acc flag-name v))))))]
    {:command cmd :subcommand sub :flags flags}))

(defn- get-flag
  "Last value given for `key`, or nil."
  [flags key]
  (let [v (get flags key)]
    (if (vector? v) (last v) v)))

(defn- get-flag-list
  "Every value given for `key`, as a vector."
  [flags key]
  (let [v (get flags key)]
    (cond (nil? v) [] (vector? v) v :else [v])))

(defn- flag-true? [flags key]
  (let [v (get-flag flags key)]
    (and (some? v) (not= "false" v))))

;; ---------------------------------------------------------------------------
;; Verb registry — the single source of help
;; ---------------------------------------------------------------------------

(def common-flags
  [["--config <path>" "board config file (else $KANBAN_CONFIG, else discovered)"]
   ["--tasks-dir <path>" "override the resolved task root"]
   ["--project <id>" "scope to one project (see `rheos projects`)"]])

(def verbs
  "Every verb, its flags, and one worked example. Rendered into all help output
   and `docs/cli.md`; kept in the order a card moves through its life."
  [{:verb "create" :group "lifecycle" :mutates? true
    :args "--title <text>"
    :summary "Create a card (epic or task, root or child) and record a task-created event."
    :flags [["--title <text>" "card title (required)"]
            ["--type <task|epic>" "card type; default task"]
            ["--parent <uuid>" "parent card uuid — omit for a root card"]
            ["--priority <P0..P3>" "priority; default P3"]
            ["--points <n>" "Fibonacci size estimate"]
            ["--labels <a,b,c>" "comma-separated labels"]
            ["--body-file <path>" "read the card body from a file; `-` reads stdin"]
            ["--dir <path>" "target dir relative to the task root; default epics/ or tasks/"]
            ["--uuid <id>" "explicit uuid; refused if already taken"]
            ["--status <s>" "refused unless it is the FSM initial state"]
            ["--force-status" "allow a non-initial --status"]]
    :example "rheos create --type epic --title \"Ledger cutover\" --priority P0"
    :notes "A card is written with a skeleton body unless --body-file is given, so it can pass its first gate."}

   {:verb "create-subtask" :group "lifecycle" :mutates? true
    :args "<parent-uuid> --title <text>"
    :summary "Alias of `create --parent`. Kept for compatibility; prefer `create`."
    :flags [["--title <text>" "card title (required)"]
            ["--status <s>" "refused unless it is the FSM initial state"]
            ["--priority <P0..P3>" "priority; default P3"]
            ["--labels <a,b,c>" "comma-separated labels"]]
    :example "rheos create-subtask my-epic --title \"Extract the fold\""}

   {:verb "move" :group "lifecycle" :mutates? true
    :args "<uuid> --to <status>"
    :summary "Change a card's status. FSM-enforced, ledger-recorded, streamed to the UI."
    :flags [["--to <status>" "target status (required)"]
            ["--json" "emit the result as JSON"]]
    :example "rheos move my-card --to in_progress"
    :notes "The only way to change status. Exits 3 when the FSM, a WIP limit, or a build gate refuses."}

   {:verb "status-update" :group "lifecycle" :mutates? true
    :args "<uuid> --to <status>"
    :summary "Same enforced move as `move`, routed through the agent-tool dispatch; prints JSON."
    :flags [["--to <status>" "target status (required)"]]
    :example "rheos status-update my-card --to review"}

   {:verb "comment" :group "lifecycle" :mutates? true
    :args "<uuid> --text <text>"
    :summary "Append a comment to a card. The way to update a card after breakdown."
    :flags [["--text <text>" "comment body (required)"]]
    :example "rheos comment my-card --text \"Build gate green; ready for review\""
    :notes "Comments are append-only and ledger-recorded. Once a card is past breakdown its body is settled — record new information here rather than rewriting scope."}

   {:verb "add-comment" :group "lifecycle" :mutates? true
    :args "<uuid> --text <text>"
    :summary "Alias of `comment`."
    :flags [["--text <text>" "comment body (required)"]]
    :example "rheos add-comment my-card --text \"Blocked on #161\""}

   {:verb "frontmatter" :group "lifecycle" :mutates? true
    :args "<uuid> --set <key>=<value>"
    :summary "Update descriptive frontmatter (title, priority, labels, points, category, description, estimate, assignee)."
    :flags [["--set <key>=<value>" "repeatable; one ledger event per changed key"]]
    :example "rheos frontmatter my-card --set points=3 --set priority=P1"
    :notes "`--set status=…` is refused: status is FSM-governed, use `move`. Identity and provenance keys (uuid, created_at, write-id, source-path) are never writable."}

   {:verb "read-task" :group "read"
    :args "<uuid>"
    :summary "Print one card's frontmatter, body, and comments as JSON."
    :flags []
    :example "rheos read-task my-card"}

   {:verb "read-board" :group "read"
    :args ""
    :summary "Print the composed board — columns, counts, cards, WIP limits — as JSON."
    :flags [["--status <a,b>" "comma-separated statuses"]
            ["--priority <a,b>" "comma-separated priorities"]
            ["--labels <a,b>" "comma-separated labels (AND)"]
            ["--q <text>" "title substring"]]
    :example "rheos read-board --project kanban --status in_progress,review"
    :notes "Scope it. With no --project it composes every configured project."}

   {:verb "search-tasks" :group "read"
    :args "--query <text>"
    :summary "Search cards across projects; prints compact JSON rows."
    :flags [["--query <text>" "title substring"]]
    :example "rheos search-tasks --query \"ledger\""}

   {:verb "compose" :group "read"
    :args ""
    :summary "Composed board view with the full query DSL; human-readable by default."
    :flags [["--domain <d>" "meta.domain filter"]
            ["--org <o>" "meta.org filter"]
            ["--status <s>" "comma-separated statuses"]
            ["--priority <p>" "comma-separated priorities"]
            ["--labels <l>" "comma-separated labels"]
            ["--projects <p>" "comma-separated project ids"]
            ["--q <text>" "title substring"]
            ["--where <clause>" "clause DSL, e.g. \"points in 1,2 and meta.tier = core\""]
            ["--save <name>" "save these flags as a named preset"]
            ["--preset <name>" "load a saved preset"]
            ["--out <path>" "write JSON to a file"]
            ["--json" "emit JSON on stdout"]]
    :example "rheos compose --status in_progress --priority P0"}

   {:verb "board" :group "read"
    :args "<snapshot|list>"
    :summary "`board snapshot` writes a board JSON snapshot; `board list` lists configured projects."
    :flags [["--out <path>" "snapshot: write to a file instead of stdout"]
            ["--verbose" "list: include project meta"]]
    :example "rheos board snapshot --out board.json"}

   {:verb "projects" :group "read"
    :args ""
    :summary "List configured projects: id, title, default flag, meta. Prints JSON."
    :flags []
    :example "rheos projects"}

   {:verb "events" :group "read"
    :args "[uuid]"
    :summary "Print ledger events, newest last. Pass a uuid to scope to one card."
    :flags [["--limit <n>" "keep only the last n events"]
            ["--json" "emit the raw envelopes as JSON"]]
    :example "rheos events my-card --limit 20"}

   {:verb "drift" :group "read"
    :args ""
    :summary "Report cards whose files changed outside a recorded Rheos write."
    :flags [["--json" "emit JSON"]]
    :example "rheos drift"}

   {:verb "serve" :group "service"
    :args ""
    :summary "Run the HTTP server (board UI, REST API, SSE stream, MCP endpoint)."
    :flags [["--host <host>" "bind address"]
            ["--port <port>" "bind port"]]
    :example "rheos serve --port 8791"}])

(def ^:private by-verb (into {} (map (juxt :verb identity)) verbs))

(defn- flag-lines [flags]
  (mapv (fn [[flag doc]] (str "  " (subs (str flag "                          ") 0 24) " " doc)) flags))

(defn- usage-line [{:keys [verb args]}]
  (str "  " bin-name " " verb (when (seq args) (str " " args))))

(defn show-help []
  (println "rheos — agent-first kanban board CLI")
  (println "")
  (println "USAGE")
  (println (str "  " bin-name " <verb> [args] [flags]"))
  (println "")
  (doseq [[group label] [["lifecycle" "LIFECYCLE (mutating)"]
                         ["read" "READ"]
                         ["service" "SERVICE"]]]
    (println label)
    (doseq [v verbs :when (= group (:group v))]
      (println (str (subs (str (usage-line v) "                                                        ") 0 56)
                    " " (:summary v))))
    (println ""))
  (println "COMMON FLAGS")
  (doseq [line (flag-lines common-flags)] (println line))
  (println "")
  (println "EXIT CODES")
  (println "  0 ok   1 usage   2 not found   3 refused by policy   4 internal error")
  (println "")
  (println (str "  " bin-name " help <verb>   for a verb's flags and an example."))
  (println "  Card bodies settle once a card leaves breakdown — record later updates with")
  (println (str "  `" bin-name " comment <uuid> --text …` rather than rewriting the body.")))

(defn show-verb-help [verb]
  (if-let [v (by-verb verb)]
    (do
      (println (str bin-name " " (:verb v) (when (seq (:args v)) (str " " (:args v)))))
      (println "")
      (println (str "  " (:summary v)))
      (when (:mutates? v) (println "  Mutating: writes the card file and records a ledger event."))
      (println "")
      (when (seq (:flags v))
        (println "FLAGS")
        (doseq [line (flag-lines (:flags v))] (println line))
        (println ""))
      (println "COMMON FLAGS")
      (doseq [line (flag-lines common-flags)] (println line))
      (println "")
      (when (:notes v)
        (println "NOTES")
        (println (str "  " (:notes v)))
        (println ""))
      (println "EXAMPLE")
      (println (str "  " (:example v))))
    (do (js/console.error (str bin-name ": unknown verb: " verb))
        (js/console.error (str "  known verbs: " (str/join ", " (map :verb verbs))))
        (exit! :usage))))

;; ---------------------------------------------------------------------------
;; Output helpers
;; ---------------------------------------------------------------------------

(defn- print-json [value]
  (println (js/JSON.stringify (clj->js value) nil 2)))

(defn- pad-end [s width]
  (if (>= (count s) width)
    (subs s 0 width)
    (str s (apply str (repeat (- width (count s)) " ")))))

(defn- format-event [evt]
  (let [e (events/envelope->kanban-event evt)
        ts (subs (or (:timestamp e) "?") 0 19)
        src (pad-end (or (:source e) "?") 12)
        typ (pad-end (or (:type e) "?") 16)
        task (subs (or (:task-id e) "?") 0 30)]
    (str ts " [" src "] " typ " " task)))

(defn- find-project [project-state pid]
  (if pid
    (or (first (filter #(= (:id %) pid) (:projects project-state)))
        (throw (ex-info (str "unknown project: " pid) {:kind :not-found :project pid})))
    (first (:projects project-state))))

(defn- ^:async load-task-or-fail [project uuid]
  (let [all (await (tasks/load-tasks project))]
    (or (first (filter #(= (:uuid %) uuid) all))
        (throw (ex-info (str "unknown task: " uuid) {:kind :not-found :uuid uuid})))))

(defn- require-flag [flags key verb]
  (or (get-flag flags key)
      (throw (ex-info (str "missing --" key)
                      {:kind :usage :hint (str bin-name " help " verb)}))))

(defn- require-positional [value verb what]
  (or value
      (throw (ex-info (str "missing <" what ">")
                      {:kind :usage :hint (str bin-name " help " verb)}))))

;; ---------------------------------------------------------------------------
;; Verb implementations
;; ---------------------------------------------------------------------------

(defn- ^:async run-tool [tool-name args]
  (print-json (await (agent-tools/dispatch tool-name args))))

(defn- ^:async cmd-board-snapshot [project-state flags]
  (let [project (find-project project-state (get-flag flags "project"))
        all-tasks (await (tasks/load-tasks (:tasks-dir project)))
        snapshot (board/build-board-snapshot all-tasks)
        out-path (get-flag flags "out")]
    (if out-path
      (do
        (await (.writeFile fsp out-path (js/JSON.stringify (clj->js snapshot) nil 2) "utf8"))
        (println "Wrote board snapshot to" out-path))
      (print-json snapshot))))

(defn- cmd-board-list [project-state flags]
  (let [verbose? (flag-true? flags "verbose")]
    (doseq [project (:projects project-state)]
      (let [default? (= (:id project) (:default-project-id project-state))]
        (println (str "[" (:id project) "]" (when default? " (default)") " " (:title project)))
        (when verbose?
          (doseq [[k v] (:meta project)]
            (when (and v (not= "" v))
              (println (str "  " (name k) ": " (pr-str v))))))))))

(defn- ^:async cmd-compose [project-state view-store flags]
  (let [preset-name (get-flag flags "preset")
        preset (when preset-name (await (views/load-view view-store preset-name)))]
    (when (and preset-name (not preset))
      (throw (ex-info (str "unknown preset: " preset-name) {:kind :not-found :preset preset-name})))
    (let [effective-flags (if preset (views/merge-preset flags preset) flags)
          query (compose/parse-compose-query effective-flags)
          snapshot (await (compose/compose-snapshot (:projects project-state) query))
          save-name (get-flag flags "save")
          out-path (get-flag flags "out")]
      (when save-name
        (await (views/save-view! view-store save-name effective-flags))
        (js/console.error (str "Saved view '" save-name "'")))
      (cond
        out-path
        (do (await (.writeFile fsp out-path (js/JSON.stringify (clj->js snapshot) nil 2) "utf8"))
            (println "Wrote compose snapshot to" out-path))

        (flag-true? flags "json")
        (print-json snapshot)

        :else
        (do
          (println (str "Total tasks: " (:total-tasks snapshot)))
          (doseq [col (:columns snapshot)]
            (when (pos? (:task-count col))
              (println (str "\n" (:title col) " (" (:task-count col) ")"))
              (doseq [t (:tasks col)]
                (println (str "  [" (:priority t) "] " (:title t)))))))))))

(defn- read-stdin
  "Drain stdin to a string. `fsp/readFile` cannot take a bare fd, so read the
   stream — which also keeps `--body-file -` working on Windows."
  []
  (js/Promise.
   (fn [resolve reject]
     (let [chunks (atom [])]
       (.setEncoding js/process.stdin "utf8")
       (.on js/process.stdin "data" (fn [chunk] (swap! chunks conj chunk)))
       (.on js/process.stdin "end" (fn [] (resolve (apply str @chunks))))
       (.on js/process.stdin "error" reject)))))

(defn- ^:async read-body
  "Card body from `--body-file <path>`, or stdin when the path is `-`."
  [flags]
  (when-let [body-file (get-flag flags "body-file")]
    (if (= "-" body-file)
      (await (read-stdin))
      (await (.readFile fsp body-file "utf8")))))

(defn- ^:async cmd-create [project-state parsed verb]
  (let [flags (:flags parsed)
        project (find-project project-state (get-flag flags "project"))
        parent (if (= "create-subtask" verb)
                 (require-positional (:subcommand parsed) verb "parent-uuid")
                 (get-flag flags "parent"))
        labels (when-let [l (get-flag flags "labels")]
                 (vec (filter seq (map str/trim (str/split l #",")))))
        body (await (read-body flags))
        result (await (task-create/create-task!
                       {:project project
                        :title (require-flag flags "title" verb)
                        :card-type (get-flag flags "type")
                        :parent parent
                        :status (get-flag flags "status")
                        :priority (get-flag flags "priority")
                        :points (get-flag flags "points")
                        :labels labels
                        :body body
                        :dir (get-flag flags "dir")
                        :uuid (get-flag flags "uuid")
                        :force-status? (flag-true? flags "force-status")
                        :source "cli"}))]
    (if (flag-true? flags "json")
      (print-json result)
      (do
        (println (str "created " (:card-type result) " " (:uuid result)
                      " [" (:status result) "] " (:title result)))
        (println (str "  " (:source-path result)))))))

(defn- ^:async cmd-move
  "FSM-enforced, ledger-backed status move. Mirrors the server's write path so the
   CLI and UI cannot diverge on what transitions are legal."
  [project-state parsed]
  (let [flags (:flags parsed)
        uuid (require-positional (:subcommand parsed) "move" "uuid")
        new-status (or (get-flag flags "to") (get-flag flags "status")
                       (require-flag flags "to" "move"))
        project (find-project project-state (get-flag flags "project"))
        task (await (load-task-or-fail project uuid))
        result (await (transition/move-task!
                       {:project project :task task
                        :new-status new-status :source "cli"}))]
    (cond
      (and (:ok result) (flag-true? flags "json")) (print-json result)
      (:ok result) (println (str "moved " uuid ": " (:from result) " -> " (:to result)))
      :else (throw (ex-info (str "transition refused: " (:reason result))
                            {:kind :refused :uuid uuid
                             :from (:from result) :to new-status})))))

(defn- ^:async cmd-status-update [_ parsed]
  (let [flags (:flags parsed)]
    (run-tool "kanban_update_status"
              {:uuid (require-positional (:subcommand parsed) "status-update" "uuid")
               :status (or (get-flag flags "to") (require-flag flags "to" "status-update"))
               :project (get-flag flags "project")})))

(defn- ^:async cmd-add-comment [_ parsed verb]
  (let [flags (:flags parsed)]
    (run-tool "kanban_add_comment"
              {:uuid (require-positional (:subcommand parsed) verb "uuid")
               :text (require-flag flags "text" verb)
               :project (get-flag flags "project")})))

(defn- parse-set-pair
  "`key=value` -> [key value]. The value may contain `=`."
  [pair]
  (let [idx (str/index-of (str pair) "=")]
    (when-not (and idx (pos? idx))
      (throw (ex-info (str "--set expects key=value, got: " pair)
                      {:kind :usage :pair pair})))
    [(str/trim (subs pair 0 idx)) (subs pair (inc idx))]))

(defn- ^:async cmd-frontmatter [_ parsed]
  (let [flags (:flags parsed)
        pairs (get-flag-list flags "set")]
    (when (empty? pairs)
      (throw (ex-info "missing --set <key>=<value>"
                      {:kind :usage :hint (str bin-name " help frontmatter")})))
    (run-tool "kanban_update_frontmatter"
              {:uuid (require-positional (:subcommand parsed) "frontmatter" "uuid")
               :project (get-flag flags "project")
               :updates (into {} (map parse-set-pair) pairs)})))

(defn- ^:async cmd-read-task [_ parsed]
  (run-tool "kanban_read_task"
            {:uuid (require-positional (:subcommand parsed) "read-task" "uuid")
             :project (get-flag (:flags parsed) "project")}))

(defn- ^:async cmd-search-tasks [_ parsed]
  (let [flags (:flags parsed)]
    (run-tool "kanban_search_tasks"
              {:query (or (get-flag flags "query") (require-flag flags "query" "search-tasks"))
               :project (get-flag flags "project")})))

(defn- ^:async cmd-read-board [_ parsed]
  (let [flags (:flags parsed)]
    (run-tool "kanban_read_board"
              (cond-> {:project (get-flag flags "project")}
                (get-flag flags "status") (assoc :status (get-flag flags "status"))
                (get-flag flags "priority") (assoc :priority (get-flag flags "priority"))
                (get-flag flags "labels") (assoc :labels (get-flag flags "labels"))
                (get-flag flags "q") (assoc :q (get-flag flags "q"))))))

(defn- ^:async cmd-projects [_ _]
  (run-tool "kanban_list_projects" {}))

(defn ^:async cmd-events [project-state parsed]
  (let [flags (:flags parsed)
        project (find-project project-state (get-flag flags "project"))
        ledger (ledger/get-ledger (:tasks-dir project))
        task-id (:subcommand parsed)
        limit (get-flag flags "limit")
        filter-spec (if task-id {:task-id task-id} {})
        evts (await (events/query-events ledger filter-spec))
        result (if limit (vec (take-last (js/parseInt limit) evts)) evts)]
    (if (flag-true? flags "json")
      (print-json result)
      (doseq [evt result] (println (format-event evt))))))

(defn ^:async cmd-drift [project-state parsed]
  (let [flags (:flags parsed)
        project (find-project project-state (get-flag flags "project"))
        ledger (ledger/get-ledger (:tasks-dir project))
        drift-evts (await (events/query-events ledger {:type "drift-detected"}))]
    (cond
      (flag-true? flags "json") (print-json drift-evts)
      (empty? drift-evts) (println "No drift detected.")
      :else
      (doseq [evt drift-evts]
        (let [e (events/envelope->kanban-event evt)
              ts (subs (or (:timestamp e) "?") 0 19)
              task (subs (or (:task-id e) "?") 0 40)]
          (println (str ts " DRIFT " task))
          (when-let [details (:details e)]
            (doseq [[k v] details]
              (println (str "  " (name k) ": " (pr-str v))))))))))

;; ---------------------------------------------------------------------------
;; Dispatch
;; ---------------------------------------------------------------------------

(defn- ^:async dispatch-verb [verb ps view-store parsed]
  (case verb
    "create" (await (cmd-create ps parsed "create"))
    "create-subtask" (await (cmd-create ps parsed "create-subtask"))
    "move" (await (cmd-move ps parsed))
    "status-update" (await (cmd-status-update ps parsed))
    "comment" (await (cmd-add-comment ps parsed "comment"))
    "add-comment" (await (cmd-add-comment ps parsed "add-comment"))
    "frontmatter" (await (cmd-frontmatter ps parsed))
    "read-task" (await (cmd-read-task ps parsed))
    "read-board" (await (cmd-read-board ps parsed))
    "search-tasks" (await (cmd-search-tasks ps parsed))
    "projects" (await (cmd-projects ps parsed))
    "compose" (await (cmd-compose ps view-store (:flags parsed)))
    "events" (await (cmd-events ps parsed))
    "drift" (await (cmd-drift ps parsed))
    "serve" (await (http-server/init))
    "board" (case (:subcommand parsed)
              "snapshot" (await (cmd-board-snapshot ps (:flags parsed)))
              "list" (cmd-board-list ps (:flags parsed))
              (throw (ex-info (str "board expects `snapshot` or `list`"
                                   (when (:subcommand parsed) (str ", got: " (:subcommand parsed))))
                              {:kind :usage :hint (str bin-name " help board")})))
    (throw (ex-info (str "unknown verb: " verb)
                    {:kind :usage :hint (str bin-name " --help")}))))

(defn- ^:async run [parsed]
  (let [flags (:flags parsed)
        verb (:command parsed)
        config-path (or (get-flag flags "config") (aget js/process.env "KANBAN_CONFIG"))
        loaded (await (config/load-config config-path))
        ps (config/resolve-configured-projects loaded (get-flag flags "tasks-dir"))
        view-store (await (views/load-view-store (:config-dir loaded)))]
    ;; Share resolved projects with the tool registry so CLI and server resolve identically.
    (projects/set-projects! ps)
    (await (dispatch-verb verb ps view-store parsed))))

(defn ^:async main []
  (let [args (vec (drop 2 (js->clj js/process.argv)))
        parsed (parse-args args)
        verb (:command parsed)]
    (cond
      ;; Help never needs a board, so it must not fail when config is missing.
      (or (nil? verb) (= "--help" verb) (= "-h" verb)
          (and (= "help" verb) (nil? (:subcommand parsed))))
      (show-help)

      (= "help" verb)
      (show-verb-help (:subcommand parsed))

      (flag-true? (:flags parsed) "help")
      (show-verb-help verb)

      :else
      (try
        (await (run parsed))
        (catch :default err
          (let [data (ex-data err)
                kind (or (:kind data) :internal)
                hint (:hint data)]
            (fail! kind (str (.-message err) (when hint (str " — try `" hint "`"))) err)))))))
