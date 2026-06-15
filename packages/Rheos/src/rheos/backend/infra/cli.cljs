(ns eta-mu.kanban.cli
  "CLI entry point for kanban operations."
  (:require ["node:fs/promises" :as fsp]
            [eta-mu.kanban.board :as board]
            [eta-mu.kanban.compose :as compose]
            [eta-mu.kanban.config :as config]
            [eta-mu.kanban.events :as events]
            [eta-mu.kanban.tasks :as tasks]
            [eta-mu.kanban.transition :as transition]))

(defn- parse-args [args]
  (let [args-vec (vec args)
        cmd (when (and (seq args-vec) (not (re-matches #"^--.*" (nth args-vec 0)))) (nth args-vec 0))
        sub (when (and (> (count args-vec) 1) (not (re-matches #"^--.*" (nth args-vec 1)))) (nth args-vec 1))
        rest-args (if sub (subvec args-vec 2) (if cmd (subvec args-vec 1) args-vec))
        flags (loop [remaining rest-args acc {}]
                (if (empty? remaining)
                  acc
                  (let [k (first remaining)
                        v (second remaining)
                        flag-name (when (and k (re-matches #"^--.*" k)) (subs k 2))]
                    (if flag-name
                      (recur (drop 2 remaining) (assoc acc flag-name v))
                      (recur (rest remaining) acc)))))]
    {:command cmd
     :subcommand sub
     :flags flags}))

(defn- show-help []
  (println "OpenHax Kanban (CLJS)")
  (println "")
  (println "USAGE")
  (println "  openhax-kanban board snapshot [--tasks-dir <path>] [--out <path>]")
  (println "  openhax-kanban board list [--verbose]")
  (println "  openhax-kanban compose [--domain <d>] [--org <o>] [--status <s>] [--priority <p>] [--q <text>] [--where <clause>]")
  (println "  openhax-kanban move <task-uuid> --to <status> [--project <id>]")
  (println "  openhax-kanban events [task-uuid] [--limit <n>]")
  (println "  openhax-kanban drift")
  (println "  openhax-kanban serve [--host <host>] [--port <port>]"))

(defn- get-flag [flags key] (get flags key))

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

(defn ^:async cmd-board-snapshot [project-state flags]
  (let [project (first (:projects project-state))
        all-tasks (await (tasks/load-tasks (:tasks-dir project)))
        snapshot (board/build-board-snapshot all-tasks)
        out-path (get-flag flags "out")]
    (if out-path
      (do
        (await (.writeFile fsp out-path (js/JSON.stringify (clj->js snapshot) nil 2) "utf8"))
        (println "Wrote board snapshot to" out-path))
      (println (js/JSON.stringify (clj->js snapshot) nil 2)))))

(defn- cmd-board-list [project-state flags]
  (let [verbose? (= "true" (:verbose flags))]
    (doseq [project (:projects project-state)]
      (let [default? (= (:id project) (:default-project-id project-state))]
        (println (str "[" (:id project) "]" (when default? " (default)") " " (:title project)))
        (when verbose?
          (doseq [[k v] (:meta project)]
            (when (and v (not= "" v))
              (println (str "  " (name k) ": " (pr-str v))))))))))

(defn ^:async cmd-compose [project-state flags]
  (let [query (compose/parse-compose-query flags)
        snapshot (await (compose/compose-snapshot (:projects project-state) query))
        out-path (get-flag flags "out")]
    (if out-path
      (do
        (await (.writeFile fsp out-path (js/JSON.stringify (clj->js snapshot) nil 2) "utf8"))
        (println "Wrote compose snapshot to" out-path))
      (do
        (println (str "Total tasks: " (:total-tasks snapshot)))
        (doseq [col (:columns snapshot)]
          (when (pos? (:task-count col))
            (println (str "\n" (:title col) " (" (:task-count col) ")"))
            (doseq [t (:tasks col)]
              (println (str "  [" (:priority t) "] " (:title t))))))))))

(defn- find-project [project-state pid]
  (if pid
    (first (filter #(= (:id %) pid) (:projects project-state)))
    (first (:projects project-state))))

(defn ^:async cmd-move
  "FSM-enforced, ledger-backed status move. Mirrors the server's write path so the
   CLI and UI cannot diverge on what transitions are legal."
  [project-state parsed]
  (let [uuid (:subcommand parsed)
        new-status (or (get-flag (:flags parsed) "to") (get-flag (:flags parsed) "status"))
        project (find-project project-state (get-flag (:flags parsed) "project"))]
    (cond
      (or (nil? uuid) (nil? new-status))
      (println "usage: openhax-kanban move <task-uuid> --to <status>")

      (nil? project)
      (println "unknown project")

      :else
      (let [all-tasks (await (tasks/load-tasks (:tasks-dir project)))
            task (first (filter #(= (:uuid %) uuid) all-tasks))]
        (if-not task
          (println (str "unknown task: " uuid))
          (let [result (await (transition/move-task!
                               {:project project :task task
                                :new-status new-status :source "cli"}))]
            (if (:ok result)
              (println (str "moved " uuid ": " (:from result) " -> " (:to result)))
              (println (str "REJECTED " uuid ": " (:reason result))))))))))

(defn ^:async cmd-events [project-state parsed]
  (let [project (find-project project-state (get-flag (:flags parsed) "project"))
        ledger (events/get-ledger (:tasks-dir project))
        task-id (:subcommand parsed)
        limit (:limit (:flags parsed))
        filter-spec (if task-id {:task-id task-id} {})
        evts (await (events/query-events ledger filter-spec))
        result (if limit (vec (take-last (js/parseInt limit) evts)) evts)]
    (doseq [evt result] (println (format-event evt)))))

(defn ^:async cmd-drift [project-state parsed]
  (let [project (find-project project-state (get-flag (:flags parsed) "project"))
        ledger (events/get-ledger (:tasks-dir project))
        drift-evts (await (events/query-events ledger {:type "drift-detected"}))]
    (if (empty? drift-evts)
      (println "No drift detected.")
      (doseq [evt drift-evts]
        (let [e (events/envelope->kanban-event evt)
              ts (subs (or (:timestamp e) "?") 0 19)
              task (subs (or (:task-id e) "?") 0 40)]
          (println (str ts " DRIFT " task))
          (when-let [details (:details e)]
            (doseq [[k v] details]
              (println (str "  " (name k) ": " (pr-str v))))))))))

(defn ^:async main []
  (let [args (vec (drop 2 (js->clj js/process.argv)))
        parsed (parse-args args)
        config-path (or (get-flag (:flags parsed) "config")
                        (aget js/process.env "KANBAN_CONFIG"))
        loaded (await (config/load-config config-path))
        tasks-dir (or (get-flag (:flags parsed) "tasks-dir")
                      (:tasksDir (:config loaded))
                      "docs/agile/tasks")
        ps (config/resolve-configured-projects loaded tasks-dir)]
    (cond
      (and (= "board" (:command parsed)) (= "snapshot" (:subcommand parsed)))
      (await (cmd-board-snapshot ps (:flags parsed)))

      (and (= "board" (:command parsed)) (= "list" (:subcommand parsed)))
      (cmd-board-list ps (:flags parsed))

      (= "compose" (:command parsed))
      (await (cmd-compose ps (:flags parsed)))

      (= "move" (:command parsed))
      (await (cmd-move ps parsed))

      (= "events" (:command parsed))
      (await (cmd-events ps parsed))

      (= "drift" (:command parsed))
      (await (cmd-drift ps parsed))

      (= "serve" (:command parsed))
      (let [server-mod (js/require "./server.js")]
        (await (.init server-mod)))

      :else (show-help))))
