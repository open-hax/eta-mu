(ns eta-mu.kanban.cli
  "CLI entry point for kanban operations."
  (:require ["node:fs/promises" :as fsp]
            [eta-mu.kanban.board :as board]
            [eta-mu.kanban.config :as config]
            [eta-mu.kanban.events :as events]
            [eta-mu.kanban.tasks :as tasks]))

(defn- parse-args [args]
  (let [[cmd sub & rest] args
        flags (loop [remaining rest acc {}]
                (if (empty? remaining)
                  acc
                  (let [[k v] remaining
                        flag-name (when (and k (re-matches #"^--.*" k)) (subs k 2))]
                    (if flag-name
                      (recur (drop 2 remaining) (assoc acc flag-name v))
                      (recur (rest remaining) acc)))))]
    {:command (when (and cmd (not (re-matches #"^--.*" cmd))) cmd)
     :subcommand (when (and sub (not (re-matches #"^--.*" sub))) sub)
     :flags flags}))

(defn- show-help []
  (println "OpenHax Kanban (CLJS)")
  (println "")
  (println "USAGE")
  (println "  openhax-kanban board snapshot [--tasks-dir <path>] [--out <path>]")
  (println "  openhax-kanban board list [--verbose]")
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

(defn ^:async cmd-events [project-state parsed]
  (let [project (first (:projects project-state))
        ledger (events/get-ledger (:tasks-dir project))
        task-id (:subcommand parsed)
        limit (:limit (:flags parsed))
        filter-spec (if task-id {:task-id task-id} {})
        evts (await (events/query-events ledger (clj->js filter-spec)))
        result (if limit (vec (take-last (js/parseInt limit) evts)) evts)]
    (doseq [evt result] (println (format-event evt)))))

(defn ^:async cmd-drift [project-state]
  (let [project (first (:projects project-state))
        ledger (events/get-ledger (:tasks-dir project))
        drift-evts (await (events/query-events ledger #js {:type "drift-detected"}))]
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
        loaded (await (config/load-config (get-flag (:flags parsed) "config")))
        tasks-dir (or (get-flag (:flags parsed) "tasks-dir")
                      (:tasksDir (:config loaded))
                      "docs/agile/tasks")
        ps (config/resolve-configured-projects loaded tasks-dir)]
    (cond
      (and (= "board" (:command parsed)) (= "snapshot" (:subcommand parsed)))
      (await (cmd-board-snapshot ps (:flags parsed)))

      (and (= "board" (:command parsed)) (= "list" (:subcommand parsed)))
      (cmd-board-list ps (:flags parsed))

      (= "events" (:command parsed))
      (await (cmd-events ps parsed))

      (= "drift" (:command parsed))
      (await (cmd-drift ps))

      (= "serve" (:command parsed))
      (let [server-mod (js/require "./server.js")]
        (await (.init server-mod)))

      :else (show-help))))
