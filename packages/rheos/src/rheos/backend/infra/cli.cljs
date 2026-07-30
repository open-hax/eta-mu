(ns rheos.backend.infra.cli
  "CLI entry point for kanban operations."
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

(def ^:private boolean-flags #{"force-status" "verbose"})

(defn parse-args [args]
  (let [args-vec (vec args)
        cmd (when (and (seq args-vec) (not (re-matches #"^--.*" (nth args-vec 0)))) (nth args-vec 0))
        sub (when (and (> (count args-vec) 1) (not (re-matches #"^--.*" (nth args-vec 1)))) (nth args-vec 1))
        rest-args (if sub (subvec args-vec 2) (if cmd (subvec args-vec 1) args-vec))
        flags (loop [remaining rest-args acc {}]
                (if (empty? remaining)
                  acc
                  (let [k (first remaining)
                        v (second remaining)
                        flag-name (when (and k (re-matches #"^--.*" k)) (subs k 2))
                        next-is-flag? (and v (re-matches #"^--.*" v))]
                    (cond
                      (nil? flag-name)
                      (recur (rest remaining) acc)

                      (boolean-flags flag-name)
                      (if (contains? #{"true" "false"} v)
                        (recur (drop 2 remaining) (assoc acc flag-name (= "true" v)))
                        (recur (rest remaining) (assoc acc flag-name true)))

                      (or (nil? v) next-is-flag?)
                      (recur (rest remaining) (assoc acc flag-name nil))

                      :else
                      (recur (drop 2 remaining) (assoc acc flag-name v))))))]
    {:command cmd
     :subcommand sub
     :flags flags}))

(defn- show-help []
  (println "OpenHax Kanban (CLJS)")
  (println "")
  (println "USAGE")
  (println "  openhax-kanban board snapshot [--tasks-dir <path>] [--out <path>]")
  (println "  openhax-kanban board list [--verbose]")
  (println "  openhax-kanban compose [--domain <d>] [--org <o>] [--status <s>] [--priority <p>] [--labels <l>] [--projects <p>] [--q <text>] [--where <clause>] [--save <name>] [--preset <name>]")
  (println "  openhax-kanban move <task-uuid> --to <status> [--project <id>]")
  (println "  openhax-kanban status-update <task-uuid> --to <status> [--project <id>]")
  (println "  openhax-kanban add-comment <task-uuid> --text <text> [--project <id>]")
  (println "  openhax-kanban create --title <title> [--type <task|epic>] [--parent <uuid>] [--project <id>] [--status <s>] [--force-status] [--priority <p>] [--points <n>] [--labels <l>] [--body-file <path>] [--dir <path>] [--uuid <id>]")
  (println "  openhax-kanban create-subtask <parent-uuid> --title <title> [--project <id>] [--status <s>] [--priority <p>]")
  (println "  openhax-kanban read-task <task-uuid> [--project <id>]")
  (println "  openhax-kanban search-tasks --query <text>")
  (println "  openhax-kanban read-board [--project <id>]")
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

(defn- ^:async cmd-board-snapshot [project-state flags]
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
  (let [verbose? (true? (:verbose flags))]
    (doseq [project (:projects project-state)]
      (let [default? (= (:id project) (:default-project-id project-state))]
        (println (str "[" (:id project) "]" (when default? " (default)") " " (:title project)))
        (when verbose?
          (doseq [[k v] (:meta project)]
            (when (and v (not= "" v))
              (println (str "  " (name k) ": " (pr-str v))))))))))

(defn- ^:async cmd-compose [project-state view-store flags]
  (let [preset-name (get-flag flags "preset")
        preset (when preset-name (await (views/load-view view-store preset-name)))
        effective-flags (if preset (views/merge-preset flags preset) flags)
        _ (when (and preset-name (not preset))
            (println (str "Unknown preset: " preset-name)))
        query (compose/parse-compose-query effective-flags)
        snapshot (await (compose/compose-snapshot (:projects project-state) query))
        save-name (get-flag flags "save")
        out-path (get-flag flags "out")]
    (when save-name
      (await (views/save-view! view-store save-name effective-flags))
      (println (str "Saved view '" save-name "'")))
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

(defn- ^:async cmd-move
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

(defn- ^:async run-tool [tool-name args]
  (let [result (await (agent-tools/dispatch tool-name args))]
    (println (js/JSON.stringify (clj->js result) nil 2))))

(defn- ^:async cmd-status-update [_ parsed]
  (let [uuid (:subcommand parsed)
        status (or (get-flag (:flags parsed) "to") (get-flag (:flags parsed) "status"))
        project (get-flag (:flags parsed) "project")]
    (if (or (nil? uuid) (nil? status))
      (println "usage: openhax-kanban status-update <task-uuid> --to <status>")
      (run-tool "kanban_update_status" {:uuid uuid :status status :project project}))))

(defn- ^:async cmd-add-comment [_ parsed]
  (let [uuid (:subcommand parsed)
        text (get-flag (:flags parsed) "text")
        project (get-flag (:flags parsed) "project")]
    (if (or (nil? uuid) (nil? text))
      (println "usage: openhax-kanban add-comment <task-uuid> --text <text>")
      (run-tool "kanban_add_comment" {:uuid uuid :text text :project project}))))

(defn- ^:async read-body
  "Card body from `--body-file <path>`, or stdin when the path is `-`.
   `fsp/readFile` cannot take a bare fd, so stdin is drained as a stream."
  [flags]
  (when-let [body-file (get-flag flags "body-file")]
    (if (= "-" body-file)
      (await (js/Promise.
              (fn [resolve reject]
                (let [chunks (atom [])]
                  (.setEncoding js/process.stdin "utf8")
                  (.on js/process.stdin "data" (fn [chunk] (swap! chunks conj chunk)))
                  (.on js/process.stdin "end" (fn [] (resolve (apply str @chunks))))
                  (.on js/process.stdin "error" reject)))))
      (await (.readFile fsp body-file "utf8")))))

(defn- ^:async cmd-create
  "Create a card through the one creation chokepoint. Root cards and children are
   the same operation; `--parent` is optional."
  [project-state parsed]
  (let [flags (:flags parsed)
        project (find-project project-state (get-flag flags "project"))
        title (get-flag flags "title")]
    (cond
      (nil? project)
      (println "unknown project")

      (nil? title)
      (println "usage: openhax-kanban create --title <title> [--type <task|epic>] [--parent <uuid>]")

      :else
      (let [labels (when-let [l (get-flag flags "labels")]
                     (vec (filter seq (map str/trim (str/split l #",")))))
            body (await (read-body flags))
            result (await (task-create/create-task!
                           {:project project
                            :title title
                            :card-type (get-flag flags "type")
                            :parent (get-flag flags "parent")
                            :status (get-flag flags "status")
                            :priority (get-flag flags "priority")
                            :points (get-flag flags "points")
                            :labels labels
                            :body body
                            :dir (get-flag flags "dir")
                            :uuid (get-flag flags "uuid")
                            :force-status? (true? (get-flag flags "force-status"))
                            :source "cli"}))]
        (println (str "created " (:card-type result) " " (:uuid result)
                      " [" (:status result) "] " (:title result)))
        (println (str "  " (:source-path result)))))))

(defn- ^:async cmd-create-subtask [_ parsed]
  (let [parent (:subcommand parsed)
        title (get-flag (:flags parsed) "title")
        project (get-flag (:flags parsed) "project")
        status (get-flag (:flags parsed) "status")
        priority (get-flag (:flags parsed) "priority")
        labels (when-let [l (get-flag (:flags parsed) "labels")]
                 (vec (filter seq (map str/trim (str/split l #",")))))]
    (if (or (nil? parent) (nil? title))
      (println "usage: openhax-kanban create-subtask <parent-uuid> --title <title>")
      (run-tool "kanban_create_subtask"
                (cond-> {:parent-uuid parent :title title :project project}
                  status (assoc :status status)
                  priority (assoc :priority priority)
                  labels (assoc :labels labels))))))

(defn- ^:async cmd-read-task [_ parsed]
  (let [uuid (:subcommand parsed)
        project (get-flag (:flags parsed) "project")]
    (if (nil? uuid)
      (println "usage: openhax-kanban read-task <task-uuid>")
      (run-tool "kanban_read_task" {:uuid uuid :project project}))))

(defn- ^:async cmd-search-tasks [_ parsed]
  (let [query (get-flag (:flags parsed) "query")]
    (if (nil? query)
      (println "usage: openhax-kanban search-tasks --query <text>")
      (run-tool "kanban_search_tasks" {:query query}))))

(defn- ^:async cmd-read-board [_ parsed]
  (let [project (get-flag (:flags parsed) "project")]
    (run-tool "kanban_read_board" {:project project})))

(defn ^:async cmd-events [project-state parsed]
  (let [project (find-project project-state (get-flag (:flags parsed) "project"))
        ledger (ledger/get-ledger (:tasks-dir project))
        task-id (:subcommand parsed)
        limit (:limit (:flags parsed))
        filter-spec (if task-id {:task-id task-id} {})
        evts (await (events/query-events ledger filter-spec))
        result (if limit (vec (take-last (js/parseInt limit) evts)) evts)]
    (doseq [evt result] (println (format-event evt)))))

(defn ^:async cmd-drift [project-state parsed]
  (let [project (find-project project-state (get-flag (:flags parsed) "project"))
        ledger (ledger/get-ledger (:tasks-dir project))
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
        tasks-dir (get-flag (:flags parsed) "tasks-dir")
        ps (config/resolve-configured-projects loaded tasks-dir)
        view-store (await (views/load-view-store (:config-dir loaded)))]
    ;; Share resolved projects with the tool registry so CLI and server resolve identically.
    (projects/set-projects! ps)
    (cond
      (and (= "board" (:command parsed)) (= "snapshot" (:subcommand parsed)))
      (await (cmd-board-snapshot ps (:flags parsed)))

      (and (= "board" (:command parsed)) (= "list" (:subcommand parsed)))
      (cmd-board-list ps (:flags parsed))

      (= "compose" (:command parsed))
      (await (cmd-compose ps view-store (:flags parsed)))

      (= "move" (:command parsed))
      (await (cmd-move ps parsed))

      (= "status-update" (:command parsed))
      (await (cmd-status-update ps parsed))

      (= "add-comment" (:command parsed))
      (await (cmd-add-comment ps parsed))

      (= "create" (:command parsed))
      (await (cmd-create ps parsed))

      (= "create-subtask" (:command parsed))
      (await (cmd-create-subtask ps parsed))

      (= "read-task" (:command parsed))
      (await (cmd-read-task ps parsed))

      (= "search-tasks" (:command parsed))
      (await (cmd-search-tasks ps parsed))

      (= "read-board" (:command parsed))
      (await (cmd-read-board ps parsed))

      (= "events" (:command parsed))
      (await (cmd-events ps parsed))

      (= "drift" (:command parsed))
      (await (cmd-drift ps parsed))

      (= "serve" (:command parsed))
      (await (http-server/init))

      :else (show-help))))
