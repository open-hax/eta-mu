(ns eta-mu.infra.cli.commands.kanban
  "Kanban command: bridge legacy kanban-legacy vocabulary to the Rheos CLI.

  Rheos is the long-term kanban backend. Until users have fully migrated to its
  native command vocabulary, this handler translates the old legacy commands
  (list, search, find, count, content, comment, frontmatter, serve, etc.) into
  the corresponding Rheos commands and spawns them. Native Rheos commands pass
  through unchanged."
  (:require [clojure.string :as str]
            [eta-mu.extern.child-process :as child]
            [eta-mu.extern.process :as process]))

(def ^:private rheos-commands
  "Native Rheos verbs, passed through untouched. Legacy names that collide with a
   native verb but use positional arguments (`comment`, `frontmatter`) are
   deliberately absent — they are translated below instead."
  #{"board" "compose" "move" "status-update" "add-comment"
    "create" "create-subtask" "read-task" "search-tasks" "read-board"
    "projects" "events" "drift" "serve"})

(defn- rheos-command? [s]
  (contains? rheos-commands s))

(defn- fmt-counts [json]
  (let [data (js->clj (js/JSON.parse json) :keywordize-keys true)
        cols (filterv #(pos? (:count %)) (:columns data))]
    (println (str "Total tasks: " (:total-tasks data)))
    (doseq [col cols]
      (println (str "  " (str/capitalize (:status col)) ": " (:count col))))))

(defn- fmt-list [json]
  (let [data (js->clj (js/JSON.parse json) :keywordize-keys true)
        order (zipmap (map str/lower-case
                           ["icebox" "incoming" "accepted" "breakdown"
                            "blocked" "ready" "todo" "in_progress" "review"
                            "document" "done" "rejected"])
                      (range))
        cols (sort-by #(get order (str/lower-case (name (:status %))) 99)
                       (:columns data))]
    (doseq [col cols
            task (:tasks col)]
      (println (str (:status col) "  " (:priority task) "  " (:title task))))))

(defn- ^:async run-formatted [rheos-path args formatter]
  (let [{:keys [exit stdout stderr]} (await (child/exec-capture "node" (into [rheos-path] args)))]
    (when (seq stderr) (js/console.error stderr))
    (when (and (zero? exit) (seq stdout))
      (try (formatter stdout)
           (catch :default err
             (js/console.error "Failed to format Rheos output:" (.-message err))
             (print stdout))))
    (process/exit! exit)))

(defn translate-args
  "Convert legacy kanban-legacy command vocabulary to Rheos commands.
   Returns a map with :args (Rheos args) and optional :formatter (a function
   that should receive the captured stdout for custom rendering)."
  [args]
  (if (empty? args)
    {:args ["board" "list"]}
    (let [cmd (first args)]
      (cond
        (rheos-command? cmd)
        {:args args}

        (= "list" cmd)
        {:args (into ["read-board"] (rest args)) :formatter fmt-list}

        (= "count" cmd)
        {:args (into ["read-board"] (rest args)) :formatter fmt-counts}

        (= "search" cmd)
        (let [[_ query & more] args]
          (when (nil? query)
            (throw (js/Error. "usage: eta-mu kanban search <query>")))
          {:args (into ["search-tasks" "--query" query] more)})

        (= "find" cmd)
        (let [[_ uuid & more] args]
          (when (nil? uuid)
            (throw (js/Error. "usage: eta-mu kanban find <uuid>")))
          {:args (into ["read-task" uuid] more)})

        (= "content" cmd)
        (let [[_ uuid & more] args]
          (when (nil? uuid)
            (throw (js/Error. "usage: eta-mu kanban content <uuid>")))
          {:args (into ["read-task" uuid] more)})

        (= "comment" cmd)
        (let [[_ uuid text & more] args]
          (when (or (nil? uuid) (nil? text))
            (throw (js/Error. "usage: eta-mu kanban comment <uuid> <text>")))
          {:args (into ["add-comment" uuid "--text" text] more)})

        (= "frontmatter" cmd)
        (let [[_ uuid key value & more] args]
          (when (or (nil? uuid) (nil? key) (nil? value))
            (throw (js/Error. "usage: eta-mu kanban frontmatter <uuid> <key> <value>")))
          ;; `status` is FSM-governed and has its own verb; everything else now
          ;; routes to Rheos's `frontmatter --set`, which enforces the mutable-key
          ;; law. This used to throw and tell callers to edit markdown by hand.
          (case key
            "status" {:args (into ["status-update" uuid "--to" value] more)}
            {:args (into ["frontmatter" uuid "--set" (str key "=" value)] more)}))

        (= "open" cmd)
        (throw (js/Error. "eta-mu kanban open is not supported by Rheos. Open the task markdown directly."))

        (= "sync" cmd)
        (throw (js/Error. "eta-mu kanban sync is not supported by Rheos. Use the legacy kanban-legacy CLI."))

        :else
        {:args args}))))

(defn ^:async handle
  "Bridge legacy kanban-legacy commands to the Rheos CLI.

  Uses :raw-args (flags and ordering intact) so Rheos flags like --query,
  --to, and --text survive the router's flag parsing."
  [{:keys [args raw-args]}]
  (if-let [rheos-path (child/resolve-rheos-path)]
    (let [translation (try (translate-args (or raw-args args))
                          (catch :default err
                            (js/console.error (str err))
                            (process/exit! 1)))
          rheos-args (:args translation)
          formatter (:formatter translation)]
      (if formatter
        (await (run-formatted rheos-path rheos-args formatter))
        (let [exit-code (await (child/spawn-inherit "node" (into [rheos-path] rheos-args)))]
          (process/exit! exit-code))))
    (do (js/console.error
          (str "eta-mu kanban: @eta-mu/rheos is not installed or built.\n"
               "Run from inside the eta-mu workspace after building it:\n"
               "  pnpm --filter @eta-mu/rheos build"))
        (process/exit! 1))))
