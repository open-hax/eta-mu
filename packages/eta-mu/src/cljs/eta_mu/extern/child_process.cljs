(ns eta-mu.extern.child-process
  "Node child_process boundary."
  (:require [clojure.string :as string]
            ["node:child_process" :as cp]
            ["node:fs" :as fs]
            ["node:path" :as path]))

(defn- module-dir
  "Return the directory containing the executing bundle, or cwd if unknown."
  []
  (or (when (and (exists? js/__filename) js/__filename)
        (path/dirname js/__filename))
      (js/process.cwd)))

(defn- candidate-package-roots
  "Return candidate directories for a package, searched from cwd and the module dir."
  [package-name]
  (let [segments (string/split package-name #"/")
        relative (apply str "node_modules/" (interpose "/" segments))
        base (module-dir)]
    [(path/resolve (js/process.cwd) relative)
     (path/resolve base relative)
     (path/resolve base ".." relative)
     (path/resolve base ".." ".." relative)]))

(defn- ancestor-dirs
  "Return dir followed by each of its parents, filesystem root last."
  [start]
  (loop [dir start
         acc []]
    (let [acc (conj acc dir)
          parent (path/dirname dir)]
      (if (= parent dir)
        acc
        (recur parent acc)))))

(defn- package-json-name
  "Read the \"name\" field of a package.json, or nil if unreadable."
  [pkg-json-path]
  (try
    (.-name (js/JSON.parse (.readFileSync fs pkg-json-path "utf8")))
    (catch :default _ nil)))

(defn workspace-package-root
  "Find package-name inside the pnpm workspace containing dir, or nil.

  Walks up from dir to the nearest ancestor holding a pnpm-workspace.yaml and
  scans its packages/* entries for a package.json with a matching name. This
  lets a globally installed binary locate private workspace packages (such as
  the open-hax rheos kanban CLI) when invoked from anywhere inside the monorepo."
  [dir package-name]
  (some (fn [ancestor]
          (when (.existsSync fs (path/join ancestor "pnpm-workspace.yaml"))
            (let [pkgs-dir (path/join ancestor "packages")]
              (when (.existsSync fs pkgs-dir)
                (some (fn [entry]
                        (let [pkg-root (path/join pkgs-dir entry)
                              pkg-json (path/join pkg-root "package.json")]
                          (when (and (.existsSync fs pkg-json)
                                     (= package-name (package-json-name pkg-json)))
                            pkg-root)))
                      (js->clj (.readdirSync fs pkgs-dir)))))))
        (ancestor-dirs dir)))

(defn- resolve-package-root
  "Find the package root by locating package.json. Handles ESM packages that do not
  export package.json, and falls back to cwd-anchored Node resolution plus a pnpm
  workspace scan so global installs can find private workspace packages."
  [package-name]
  (or (try
        (when-let [resolved (js/require.resolve (str package-name "/package.json"))]
          (path/dirname resolved))
        (catch :default _ nil))
      (try
        (when-let [resolved (js/require.resolve (str package-name "/package.json")
                                                #js {:paths #js [(js/process.cwd)]})]
          (path/dirname resolved))
        (catch :default _ nil))
      (some (fn [candidate]
              (let [pkg-json (path/join candidate "package.json")]
                (when (.existsSync fs pkg-json) candidate)))
            (candidate-package-roots package-name))
      (workspace-package-root (js/process.cwd) package-name)))

(defn exec-capture
  "Execute a command with args, capture stdout/stderr, and return a promise of
  {:exit <code> :stdout <string> :stderr <string>}.

  Stdio is piped; the current working directory is process.cwd()."
  [command args]
  (js/Promise.
    (fn [resolve _reject]
      (let [stdout (atom "")
            stderr (atom "")
            child (.spawn cp command (clj->js args) #js {"stdio" "pipe" "cwd" (js/process.cwd)})]
        (.on (.-stdout child) "data" (fn [data] (swap! stdout str data)))
        (.on (.-stderr child) "data" (fn [data] (swap! stderr str data)))
        (.on child "close" (fn [code] (resolve {:exit (or code 0) :stdout @stdout :stderr @stderr})))
        (.on child "error" (fn [err] (resolve {:exit 1 :stdout @stdout :stderr (.-message err)})))))))

(def ^:private terminate-grace-ms
  "How long a process tree gets to honour SIGTERM before SIGKILL."
  2000)

(defn- signal-tree!
  "Send `sig` to the whole process group when detached, else to the child alone.
   Returns true when the signal was delivered. ESRCH is success in disguise —
   the process is already gone, which is the state we were asking for."
  [^js child detached? sig]
  (let [pid (.-pid child)]
    (try
      (if (and detached? pid)
        (js/process.kill (- pid) sig)
        (.kill child sig))
      true
      (catch :default err
        (when-not (= "ESRCH" (.-code err))
          (js/console.warn (str "[child_process] " sig " to pid " pid " failed: "
                                (.-message err))))
        false))))

(defn- terminate-process-tree!
  "Terminate a shell command's child and its descendants.

   Escalates SIGTERM -> SIGKILL after a grace period: a process that ignores
   SIGTERM or is wedged in an uninterruptible state would otherwise survive an
   abort/timeout as an orphan, which would defeat the point of aborting. The
   escalation timer is unref'd so it never holds a CLI process open, and it only
   fires while `alive?` still reports the child as running. Delivery failures are
   logged rather than swallowed."
  [^js child detached? alive?]
  (if (= "win32" (.-platform js/process))
    (let [pid (.-pid child)]
      (try
        ;; taskkill /T /F is already tree-wide and forceful — nothing to escalate to.
        (.spawn cp "taskkill" #js ["/pid" (str pid) "/T" "/F"]
                #js {"stdio" "ignore" "windowsHide" true})
        (catch :default err
          (js/console.warn (str "[child_process] taskkill for pid " pid " failed: "
                                (.-message err))))))
    (do
      (when-not (signal-tree! child detached? "SIGTERM")
        ;; The group signal failed (e.g. the child never became a group leader);
        ;; fall back to signalling the child directly.
        (signal-tree! child false "SIGTERM"))
      (let [timer (js/setTimeout
                   (fn []
                     (when (alive?)
                       (js/console.warn
                        (str "[child_process] pid " (.-pid child) " ignored SIGTERM after "
                             terminate-grace-ms "ms; escalating to SIGKILL"))
                       (when-not (signal-tree! child detached? "SIGKILL")
                         (signal-tree! child false "SIGKILL"))))
                   terminate-grace-ms)]
        (when (fn? (.-unref timer)) (.unref timer))
        timer))))

(defn exec-shell-capture
  "Execute a shell command string, capture stdout/stderr, and return a promise
  of {:exit <code> :stdout <string> :stderr <string> :timed-out? <bool>
      :aborted? <bool>}.

  When `timeout-ms` is positive, the process tree is terminated and exit 124 is
  reported if it has not closed within that window. When `signal` aborts, the
  process tree is terminated and exit 130 is reported. Stdio is piped; the
  current working directory is process.cwd()."
  ([command timeout-ms]
   (exec-shell-capture command timeout-ms nil))
  ([command timeout-ms signal]
   (js/Promise.
    (fn [resolve _reject]
      (let [stdout (atom "")
            stderr (atom "")
            timed-out? (atom false)
            aborted? (atom false)
            settled? (atom false)
            detached? (not= "win32" (.-platform js/process))
            child (.spawn cp command #js {"shell" true
                                          "stdio" "pipe"
                                          "cwd" (js/process.cwd)
                                          "detached" detached?})
            timer* (atom nil)
            abort-listener* (atom nil)
            cleanup! (fn []
                       (when-let [timer @timer*]
                         (js/clearTimeout timer))
                       (when (and signal @abort-listener*)
                         (.removeEventListener signal "abort" @abort-listener*)))
            finish! (fn [result]
                      (when (compare-and-set! settled? false true)
                        (cleanup!)
                        (resolve result)))
            ;; The child is still running until close/error settled the promise;
            ;; the SIGKILL escalation checks this so it never signals a reaped pid.
            alive? (fn [] (not @settled?))
            abort! (fn []
                     (reset! aborted? true)
                     (terminate-process-tree! child detached? alive?))]
        (.on (.-stdout child) "data" (fn [data] (swap! stdout str data)))
        (.on (.-stderr child) "data" (fn [data] (swap! stderr str data)))
        (.on child "close"
             (fn [code]
               (finish! {:exit (cond
                                 @aborted? 130
                                 @timed-out? 124
                                 :else (or code 0))
                         :stdout @stdout
                         :stderr @stderr
                         :timed-out? @timed-out?
                         :aborted? @aborted?})))
        (.on child "error"
             (fn [err]
               (finish! {:exit (if @aborted? 130 1)
                         :stdout @stdout
                         :stderr (.-message err)
                         :timed-out? @timed-out?
                         :aborted? @aborted?})))
        (when (and timeout-ms (pos? timeout-ms))
          (reset! timer*
                  (js/setTimeout
                   (fn []
                     (reset! timed-out? true)
                     (terminate-process-tree! child detached? alive?))
                   timeout-ms)))
        (when signal
          (let [listener (fn [] (abort!))]
            (reset! abort-listener* listener)
            (.addEventListener signal "abort" listener #js {:once true})
            (when (.-aborted signal)
              (abort!)))))))))

(defn spawn-inherit
  "Spawn a command with inherited stdio and return a promise that resolves with its exit code."
  [command args]
  (js/Promise.
    (fn [resolve _reject]
      (let [child (.spawn cp command (clj->js args) #js {"stdio" "inherit" "cwd" (js/process.cwd)})]
        (.on child "close" (fn [code] (resolve (or code 0))))
        (.on child "error" (fn [err]
                             (js/console.error (str "Failed to spawn '" command "': " (.-message err)))
                             (resolve 1)))))))

(defn resolve-rheos-path
  "Resolve the @eta-mu/rheos dist/cli.cjs path, or nil if not installed."
  []
  (when-let [root (resolve-package-root "@eta-mu/rheos")]
    (let [candidate (path/join root "dist" "cli.cjs")]
      (when (.existsSync fs candidate)
        candidate))))

(defn resolve-sol-server-path
  "Resolve the installed open-hax sol dist/server.js path, or nil if not installed."
  []
  (when-let [root (resolve-package-root "@eta-mu/sol")]
    (let [candidate (path/join root "dist" "server.js")]
      (when (.existsSync fs candidate)
        candidate))))

(defn resolve-contracts-output-path
  "Resolve the @eta-mu/contracts-output dist-cli/index.cjs path, or nil if not installed."
  []
  (when-let [root (resolve-package-root "@eta-mu/contracts-output")]
    (let [candidate (path/join root "dist-cli" "index.cjs")]
      (when (.existsSync fs candidate)
        candidate))))