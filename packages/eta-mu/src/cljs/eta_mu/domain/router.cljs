(ns eta-mu.domain.router
  "Pure routing decisions and help generation.

  This namespace has no I/O. It operates on the command registry data structure
  and the parsed argument map from eta-mu.shape.args."
  (:require [clojure.string :as str]))

(defn- command->lines
  [name command indent]
  (let [pad (apply str (repeat indent " "))
        lines [(str pad (str/upper-case name) "  " (:description command))]]
    (if-let [subs (->> (:subcommands command)
                       (remove #(-> % val :hidden?))
                       (sort-by key))]
      (into lines
            (mapcat (fn [[sub-name sub-cmd]]
                      (command->lines sub-name sub-cmd (+ indent 2)))
                    subs))
      lines)))

(defn- lookup-command
  [registry path]
  (loop [reg registry
         [name & rest] path]
    (when-let [cmd (get reg name)]
      (if (empty? rest)
        cmd
        (recur (:subcommands cmd) rest)))))

(defn render-help
  "Render a help string for a command path within the registry."
  [registry path]
  (let [cmd (when (seq path) (lookup-command registry path))
        commands (cond
                   (nil? cmd) registry
                   (:subcommands cmd) (:subcommands cmd)
                   :else {(last path) cmd})
        title (cond
                (nil? cmd) "eta-mu — AI assistant router"
                (:subcommands cmd) (str "eta-mu " (str/join " " path) " — sub-command help")
                :else (str "eta-mu " (str/join " " path) " — " (:description cmd)))]
    (str title "\n\nCOMMANDS\n"
         (str/join "\n" (mapcat (fn [[name cmd]] (command->lines name cmd 2)) (sort-by key commands)))
         "\n\nRun 'eta-mu" (when (seq path) (str " " (str/join " " path))) " <command> --help' for more.")))

(defn find-command
  "Walk the registry along tokens, returning the deepest matched command and the
  remaining tokens, or an unmatched token if any step is missing."
  [registry tokens]
  (loop [current registry
         remaining tokens
         path []
         last-cmd nil]
    (if (empty? remaining)
      {:command last-cmd :path path :remaining []}
      (let [name (first remaining)]
        (if-let [cmd (get current name)]
          (if-let [subs (:subcommands cmd)]
            (recur subs (rest remaining) (conj path name) cmd)
            {:command cmd :path (conj path name) :remaining (rest remaining)})
          {:command last-cmd :path path :remaining remaining :unmatched name})))))

(defn resolve-dispatch
  "Given a registry and parsed args, return a dispatch descriptor.

  Descriptor shapes:
    {:type :help     :path [...]}
    {:type :version}
    {:type :dispatch :command command-map :path [...] :args remaining-tokens}
    {:type :error    :message string}"
  [registry parsed]
  (let [positional (:positional parsed)
        help? (or (get (:flags parsed) "help")
                  (get (:flags parsed) "h"))
        version? (or (get (:flags parsed) "version")
                     (get (:flags parsed) "v"))]
    (cond
      version?
      {:type :version}

      help?
      (let [{:keys [path]} (find-command registry positional)]
        {:type :help :path path})

      (empty? positional)
      (if-let [agent (get registry "agent")]
        {:type :dispatch :command agent :path ["agent"] :args []}
        {:type :error :message "No default command registered."})

      :else
      (let [{:keys [command path remaining unmatched]} (find-command registry positional)]
        (cond
          unmatched
          {:type :error :message (str "Unknown command: " unmatched) :path path}

          (:subcommands command)
          {:type :help :path path}

          :else
          {:type :dispatch :command command :path path :args remaining})))))
