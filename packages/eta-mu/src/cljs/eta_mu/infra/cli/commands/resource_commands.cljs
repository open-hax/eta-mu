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
            [eta-mu.extern.os :as os]
            [eta-mu.extern.process :as process]
            [eta-mu.shape.command-resource :as cr]))

(def project-dir
  "Command resources belonging to one repository."
  "contracts/commands")

(def user-dir
  "Command resources a person installs for themselves, across every project.
   Sits with the other eta-mu *config* (~/.config/eta-mu) rather than with its
   state (~/.eta-mu)."
  ".config/eta-mu/commands")

(def shipped-dir
  "Command resources that ship with eta-mu itself.

   Resolved relative to the running bundle, not the working directory, so a
   globally installed eta-mu carries its own tools into every project. This is
   the scope a tool belongs in: `workflows` is not a property of the repository
   that happens to be checked out."
  "commands")

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

(defn- read-dir
  "Every command resource in one directory, tagged with its scope and root."
  [scope root dir]
  (if-not (and dir (fs/existsSync dir))
    []
    (try
      (->> (fs/readdirSync dir)
           sort
           (filter #(str/ends-with? % ".edn"))
           (mapcat #(read-resources (path/join dir %)))
           (map #(assoc % ::scope scope ::root root))
           vec)
      (catch :default e
        (console/warn! (str "eta-mu: cannot read " dir ": " (.-message e)))
        []))))

(defn- bundle-root
  "Directory of the installed eta-mu package, or nil when it cannot be found.

   `dist-cli/index.cjs` is the bin entry, so the package root is its parent's
   parent. Scripts resolve against this, never against the working directory —
   a tool that only works inside the repo it was developed in is not a tool."
  []
  (try
    (let [f (.-filename (js/eval "module"))]
      (when (string? f) (path/dirname (path/dirname f))))
    (catch :default _ nil)))

(defn discover
  "Command resources from every scope, nearest-last.

   Order is shipped -> user -> project, so a later scope can override an
   earlier one by claiming the same name. Overrides are reported, never silent."
  [root]
  (vec (concat (read-dir :shipped (bundle-root)
                         (some-> (bundle-root) (path/join shipped-dir)))
               (read-dir :user (os/homedir)
                         (path/join (os/homedir) user-dir))
               (read-dir :project root
                         (and root (path/join root project-dir))))))

(defn- bundled-runtime
  "Path to a runtime bundled with eta-mu, or nil.

   nbb is a pinned npm dependency, so a shipped command runs the interpreter
   eta-mu was tested against rather than whatever the machine happens to have
   on PATH. The globally installed nbb on this workspace was 1.3.204 while the
   pinned one is 1.5.211 — precisely the drift bundling removes."
  [runtime]
  (when-let [root (bundle-root)]
    (let [p (path/join root "node_modules" ".bin" runtime)]
      (when (fs/existsSync p) p))))

(defn- script-path
  "A command's script resolves against the root of the scope that declared it,
   so a shipped tool finds its own script wherever eta-mu is installed."
  [resource]
  (path/resolve (::root resource) (:command/script resource)))

(defn dispatch!
  "Run a command resource's script, forwarding its exit code.

   The script inherits stdio, so it owns its own output entirely — eta-mu does
   not parse, wrap, or re-print it.

   Context travels in `ETA_MU_CONTEXT` as EDN, not on argv. argv belongs to the
   user: a script parses exactly what was typed, and one that never reads the
   variable is unaffected by its existence. Injecting a `--eta-mu-context` flag
   instead would put eta-mu inside every extension's argument parser."
  [root resource {:keys [args raw-args flags version]}]
  (let [script (script-path resource)
        runtime-name (name (:command/runtime resource))
        ;; Bundled first, PATH only as a fallback — a developer running from a
        ;; source checkout may have neither installed locally.
        runtime (or (bundled-runtime runtime-name) runtime-name)]
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
                      (str "\n  " runtime-name " was not found bundled with eta-mu"
                           " or on PATH."
                           (when (= "nbb" runtime-name)
                             " nbb is a pinned dependency; a broken install is the likely cause.")
                           (when (= "bb" runtime-name)
                             " bb is a native binary and cannot be bundled — install Babashka.")))))
              (process/exit! 4))

          ;; Node reports `status` as null and sets `signal` when a child is
          ;; killed. `(or status 0)` therefore turned every signalled death —
          ;; SIGKILL from an OOM, SIGINT from the user — into a clean success.
          (nil? (.-status result))
          (do (console/error!
               (str "eta-mu: " (:command/name resource) " terminated by signal "
                    (or (.-signal result) "unknown")))
              (process/exit! 4))

          :else
          (process/exit! (.-status result)))))))

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
            {:keys [shadowing]} (cr/conflicts built-in-names commands)
            shadow-set (set shadowing)
            ;; Later scope wins. `commands` arrives shipped -> user -> project,
            ;; so reducing into a map leaves the nearest declaration in place.
            by-name (reduce (fn [m r] (assoc m (:command/name r) r))
                            {}
                            (remove #(shadow-set (:command/name %)) commands))
            overridden (->> commands
                            (remove #(shadow-set (:command/name %)))
                            (group-by :command/name)
                            (filter #(> (count (val %)) 1)))]
        (doseq [{:keys [resource problems]} rejected]
          (console/warn! (str "eta-mu: ignoring command resource "
                              (pr-str (:command/name resource "<unnamed>"))
                              ": " (str/join "; " problems))))
        (doseq [n shadowing]
          (console/warn! (str "eta-mu: command resource " (pr-str n)
                              " is ignored — a built-in already owns that name")))
        (doseq [[n rs] overridden]
          (console/warn! (str "eta-mu: " (pr-str n) " declared in "
                              (str/join " and " (map #(name (::scope %)) rs))
                              " — using the " (name (::scope (last rs))) " one")))
        (into {}
              (map (fn [[_ r]]
                     [(:command/name r)
                      (cr/resource->command
                       r (fn [resource context]
                           (dispatch! root resource (assoc context :version version))))]))
              by-name)))))
