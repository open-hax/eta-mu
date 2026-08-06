(ns eta-mu.infra.cli.commands.resource-commands
  "Discover command resources on disk and dispatch to their scripts.

   Discovery is synchronous and best-effort: a broken or missing
   `contracts/commands/` must never stop the CLI from starting, because the
   commands people rely on are compiled in and have nothing to do with it.
   Problems are reported on stderr and the built-ins carry on."
  (:require ["node:child_process" :as cp]
            ["node:fs" :as fs]
            ["node:path" :as path]
            [cljs.reader :as reader]
            [clojure.string :as str]
            [eta-mu.extern.console :as console]
            [eta-mu.extern.process :as process]
            [eta-mu.shape.command-resource :as cr]))

(def contracts-dir "contracts/commands")

(defn- repo-root
  "Nearest ancestor of `start` containing a .git entry, or nil.

   Walks rather than shelling out to git: this runs on every invocation,
   including `eta-mu --help`, and 30ms of subprocess for a directory test is a
   tax on every command."
  [start]
  (loop [dir (path/resolve start)]
    (cond
      (fs/existsSync (path/join dir ".git")) dir
      (= dir (path/dirname dir)) nil
      :else (recur (path/dirname dir)))))

(defn- read-resources
  "Every resource in one namespace file, or nil when it cannot be read."
  [file]
  (try
    (let [{:keys [resources]} (reader/read-string (fs/readFileSync file "utf8"))]
      (filter #(= :command (:contract/kind %)) resources))
    (catch :default e
      (console/warn! (str "eta-mu: skipping unreadable command resource " file
                          ": " (.-message e)))
      nil)))

(defn discover
  "Command resources declared under `<repo-root>/contracts/commands/`."
  [root]
  (let [dir (and root (path/join root contracts-dir))]
    (if-not (and dir (fs/existsSync dir))
      []
      (try
        (->> (fs/readdirSync dir)
             sort
             (filter #(str/ends-with? % ".edn"))
             (mapcat #(read-resources (path/join dir %)))
             vec)
        (catch :default e
          (console/warn! (str "eta-mu: cannot read " dir ": " (.-message e)))
          [])))))

(defn- script-path [root resource]
  (path/resolve root (:command/script resource)))

(defn dispatch!
  "Run a command resource's script, forwarding its exit code.

   The script inherits stdio, so it owns its own output entirely — eta-mu does
   not parse, wrap, or re-print it.

   Context travels in `ETA_MU_CONTEXT` as EDN, not on argv. argv belongs to the
   user: a script parses exactly what was typed, and one that never reads the
   variable is unaffected by its existence. Injecting a `--eta-mu-context` flag
   instead would put eta-mu inside every extension's argument parser."
  [root resource {:keys [args raw-args flags version]}]
  (let [script (script-path root resource)
        runtime (name (:command/runtime resource))]
    (if-not (fs/existsSync script)
      (do (console/error! (str "eta-mu: " (:command/name resource)
                               " declares a script that does not exist: " script))
          (process/exit! 2))
      (let [ctx (cr/context-for {:cwd (process/cwd)
                                 :repo-root root
                                 :args (or (seq raw-args) args)
                                 :flags flags
                                 :version version})
            env (js/Object.assign #js {} (.-env js/process)
                                  #js {"ETA_MU_CONTEXT" (pr-str ctx)})
            result (cp/spawnSync runtime
                                 (clj->js (cons script (or (seq raw-args) args)))
                                 #js {:stdio "inherit" :cwd root :env env})]
        (cond
          (.-error result)
          (do (console/error!
               (str "eta-mu: cannot run " runtime " for " (:command/name resource)
                    ": " (.-message (.-error result))
                    (when (= "ENOENT" (.-code (.-error result)))
                      (str "\n  " runtime " is not on PATH. Command resources with"
                           " :command/runtime :" runtime " need it installed."))))
              (process/exit! 4))

          :else
          (process/exit! (or (.-status result) 0)))))))

(defn registry-entries
  "Registry entries for every usable command resource, keyed by name.

   Built-ins win every conflict, and a shadowed or duplicated resource is
   reported rather than silently dropped — a command that quietly does not
   exist is worse than one that fails loudly."
  [built-in-names version]
  (let [root (repo-root (process/cwd))
        resources (discover root)]
    (if (empty? resources)
      {}
      (let [{:keys [commands rejected]} (cr/collect resources)
            {:keys [shadowing duplicated]} (cr/conflicts built-in-names commands)
            usable (remove #(or (contains? (set shadowing) (:command/name %))
                                (contains? (set duplicated) (:command/name %)))
                           commands)]
        (doseq [{:keys [resource problems]} rejected]
          (console/warn! (str "eta-mu: ignoring command resource "
                              (pr-str (:command/name resource "<unnamed>"))
                              ": " (str/join "; " problems))))
        (doseq [n shadowing]
          (console/warn! (str "eta-mu: command resource " (pr-str n)
                              " is ignored — a built-in already owns that name")))
        (doseq [n duplicated]
          (console/warn! (str "eta-mu: command resource " (pr-str n)
                              " is declared more than once and is ignored")))
        (into {}
              (map (fn [r]
                     [(:command/name r)
                      (cr/resource->command
                       r (fn [resource context]
                           (dispatch! root resource (assoc context :version version))))]))
              usable)))))
