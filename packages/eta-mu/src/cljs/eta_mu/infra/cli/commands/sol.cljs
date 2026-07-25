(ns eta-mu.infra.cli.commands.sol
  "Sol command group: lifecycle for the sol backend server plus one-shot
  agent turns on sol's turn-processor stack.

  Lifecycle (start/stop/restart/status) follows the kanban precedent: a
  child-process bridge that resolves @eta-mu/sol's built server target
  (dist/server.js) and fails with a clear error when sol isn't built. The
  server is spawned detached through the shell (nohup) with its pid and log
  under <cwd>/.eta-mu-sol/ — pm2 remains an operator choice, not a CLI
  dependency. All process, fs, and health-probe I/O stays behind the
  existing extern boundaries (child-process, fs, process).

  `sol agent` runs in-process by design (recorded on the card): sol's agent
  sessions are turn-processor run-loops over eta-mu's openai stream and tool
  registry, so the CLI drives that exact stack directly instead of
  round-tripping through a child process."
  (:require [clojure.string :as str]
            [eta-mu.extern.child-process :as child]
            [eta-mu.extern.fs :as fs]
            [eta-mu.extern.openai :as openai]
            [eta-mu.extern.path :as path]
            [eta-mu.extern.process :as process]
            [eta-mu.infra.cli.repl :as repl]
            [eta-mu.infra.tools.registry :as tools]
            [eta-mu.turn-processor.infra.loop :as loop]
            [eta-mu.turn-processor.shape.message :as shape.msg]))

(def default-port 8001)

(def default-system-prompt
  "You are Sol, a minimal agent runtime for the active workspace.")

(defn- parse-port
  [raw]
  (let [n (js/parseInt (str (or raw "")) 10)]
    (when (js/Number.isFinite n) n)))

(defn effective-port
  "Port sol listens on: --port flag, then SOL_PORT/PORT env, then 8001."
  [flags]
  (or (parse-port (get flags "port"))
      (parse-port (process/env "SOL_PORT"))
      (parse-port (process/env "PORT"))
      default-port))

(defn- probe-host
  []
  (let [h (or (process/env "SOL_HOST") (process/env "HOST"))]
    (if (or (str/blank? (or h "")) (= "0.0.0.0" h)) "127.0.0.1" h)))

(defn health-url
  "URL of sol's /health probe for the given flags/environment."
  [flags]
  (str "http://" (probe-host) ":" (effective-port flags) "/health"))

(defn shell-quote
  "Quote a string for safe embedding in a /bin/sh command line."
  [s]
  (str "'" (str/replace s "'" "'\\''") "'"))

(defn launch-command
  "Shell command that spawns sol's server detached and echoes its pid. The
  effective port is injected as SOL_PORT because the server resolves its
  listen port exclusively from SOL_PORT/PORT env — without it a --port flag
  would be reported and probed by the CLI but never reach the server."
  [server log-file port]
  (str "SOL_PORT=" (int port) " nohup node " (shell-quote server)
       " >> " (shell-quote log-file) " 2>&1 & echo $!"))

(defn resolve-server-path
  "Locate sol's built server bundle. $SOL_SERVER_PATH is authoritative when
  set; otherwise probe well-known workspace-relative locations (repo root or
  packages/eta-mu as cwd), then fall back to node package resolution so the
  published install finds its bundled sol dependency. Returns nil when sol
  isn't built/installed."
  []
  (let [override (process/env "SOL_SERVER_PATH")]
    (if (seq override)
      (when (fs/file-exists? override) override)
      (let [cwd (process/cwd)]
        (or (first (filter fs/file-exists?
                           [(path/join cwd "packages" "sol" "dist" "server.js")
                            (path/join cwd ".." "sol" "dist" "server.js")]))
            (child/resolve-sol-server-path))))))

(defn- state-dir [] (path/join (process/cwd) ".eta-mu-sol"))
(defn- pid-file [] (path/join (state-dir) "sol.pid"))
(defn- log-file [] (path/join (state-dir) "sol.log"))

(defn- ^:async sol-process?
  "True when pid belongs to a Node process running this Sol server bundle."
  [pid]
  (when-let [server (resolve-server-path)]
    (let [{:keys [exit stdout]}
          (await (child/exec-capture "ps" ["-p" pid "-o" "command="]))]
      (and (zero? exit)
           (str/includes? stdout server)))))

(defn- ^:async live-pid
  "Return the pidfile's pid only when it names this Sol server process."
  []
  (when (fs/file-exists? (pid-file))
    (let [pid (str/trim (fs/read-file (pid-file)))]
      (when (re-matches #"\d+" pid)
        (let [{:keys [exit]} (await (child/exec-capture "kill" ["-0" pid]))]
          (when (and (zero? exit)
                     (await (sol-process? pid)))
            pid))))))

(defn- ^:async fetch-health
  "GET sol's /health via curl through the child-process boundary, retrying
  `attempts` times (0.5s apart) so callers can ride out startup. Returns the
  decoded JSON map, or nil when unreachable."
  [flags attempts]
  (let [url (health-url flags)
        cmd (if (> attempts 1)
              (str "for i in $(seq 1 " attempts "); do curl -sf -m 1 " (shell-quote url)
                   " 2>/dev/null && exit 0; sleep 0.5; done; exit 1")
              (str "curl -sf -m 2 " (shell-quote url) " 2>/dev/null"))
        {:keys [exit stdout]} (await (child/exec-shell-capture cmd (+ 4000 (* attempts 1500))))]
    (when (zero? exit)
      (try (js->clj (js/JSON.parse stdout) :keywordize-keys true)
           (catch :default _ nil)))))

(defn- not-built
  []
  (js/console.error (str "eta-mu sol: @eta-mu/sol is not built or installed.\n"
                         "  Looked for dist/server.js via $SOL_SERVER_PATH, packages/sol "
                         "(cwd-anchored), and node package resolution.\n"
                         "  In the workspace, build it with: pnpm -C packages/sol build"))
  1)

(defn- ^:async start-impl
  [flags]
  (if-not (resolve-server-path)
    (not-built)
    (if-let [pid (await (live-pid))]
      (do (println (str "sol is already running (pid " pid ", port " (effective-port flags) ")"))
          0)
      (let [server (resolve-server-path)]
        (fs/mkdir (state-dir))
        (let [cmd (launch-command server (log-file) (effective-port flags))
              {:keys [exit stdout stderr]} (await (child/exec-shell-capture cmd 5000))
              pid (str/trim stdout)]
          (if-not (and (zero? exit) (re-matches #"\d+" pid))
            (do (js/console.error (str "eta-mu sol start: failed to launch server: "
                                       (str/trim stderr)))
                1)
            (do (fs/write-file (pid-file) (str pid "\n"))
                (println (str "sol started (pid " pid ", port " (effective-port flags) ")"))
                (println (str "log: " (log-file)))
                (if-let [health (await (fetch-health flags 10))]
                  (do (println (str "health: " (:status health) " (" (:service health) ")"))
                      0)
                  (if (await (live-pid))
                    (do (println (str "health: not yet reachable at " (health-url flags)
                                      " — see log"))
                        0)
                    (do (js/console.error (str "eta-mu sol start: server exited during "
                                               "startup — see log: " (log-file)))
                        1))))))))))

(defn- ^:async stop-impl
  []
  (if-let [pid (await (live-pid))]
    (do (await (child/exec-capture "kill" [pid]))
        (let [wait-cmd (str "for i in $(seq 1 20); do kill -0 " pid
                            " 2>/dev/null || exit 0; sleep 0.5; done; exit 1")
              {:keys [exit]} (await (child/exec-shell-capture wait-cmd 15000))]
          (if (zero? exit)
            (do (await (child/exec-capture "rm" ["-f" (pid-file)]))
                (println (str "sol stopped (pid " pid ")"))
                0)
            (do (js/console.error (str "eta-mu sol stop: pid " pid
                                       " did not exit within 10s; pidfile kept"))
                1))))
    (do (when (fs/file-exists? (pid-file))
          (await (child/exec-capture "rm" ["-f" (pid-file)])))
        (println "sol is not running")
        0)))

(defn- ^:async status-impl
  [flags]
  (let [pid (await (live-pid))
        health (await (fetch-health flags 1))]
    (println (if pid
               (str "process: running (pid " pid ")")
               "process: not running"))
    (if health
      (println (str "health: " (:status health) " (" (:service health)
                    ", at " (:at health) ")"))
      (println (str "health: unreachable at " (health-url flags))))
    (if (and pid health) 0 1)))

(defn- ^:async agent-impl
  [flags prompt-args]
  (if (empty? prompt-args)
    (do (js/console.error (str "usage: eta-mu sol agent [--model MODEL] [--provider P] "
                               "[--base-url URL] [--api-key KEY] [--system SYSTEM] "
                               "<prompt...>"))
        1)
    (let [config {:model {:id (or (get flags "model") "gpt-4o-mini")
                          :provider (or (get flags "provider") "openai")}
                  :convert-to-llm shape.msg/messages->openai
                  :api-key (get flags "api-key")
                  :base-url (get flags "base-url")}
          user-message {:role :user
                        :content (str/join " " prompt-args)
                        :timestamp (js/Date.now)}
          context {:system-prompt (or (get flags "system") default-system-prompt)
                   :messages [user-message]
                   :tools tools/tools}]
      (await (loop/run-loop context config (repl/make-repl-emit) openai/stream-chat))
      0)))

(defn ^:async start
  "Launch the sol backend server (detached)."
  [{:keys [flags]}]
  (process/exit! (await (start-impl flags))))

(defn ^:async stop
  "Stop the running sol backend server."
  [_]
  (process/exit! (await (stop-impl))))

(defn ^:async restart
  "Restart the sol backend server."
  [{:keys [flags]}]
  (let [stop-code (await (stop-impl))]
    (if (zero? stop-code)
      (process/exit! (await (start-impl flags)))
      (process/exit! stop-code))))

(defn ^:async status
  "Show sol process state and /health summary."
  [{:keys [flags]}]
  (process/exit! (await (status-impl flags))))

(defn ^:async agent
  "Run one agent turn on sol's turn-processor stack."
  [{:keys [args flags]}]
  (try
    (process/exit! (await (agent-impl flags args)))
    (catch :default e
      (js/console.error (str "eta-mu sol agent: " (.-message e)))
      (process/exit! 1))))

(defn group
  "Return the sol command group map."
  []
  {:name "sol"
   :description "Sol backend lifecycle and agent turns"
   :subcommands {"start"   {:name "start"
                             :description "Launch the sol backend server (detached spawn of dist/server.js on --port/SOL_PORT/PORT, default 8001; pid and log under .eta-mu-sol/)"
                             :handler start}
                 "stop"    {:name "stop"
                            :description "Stop the running sol backend server"
                            :handler stop}
                 "restart" {:name "restart"
                            :description "Restart the sol backend server"
                            :handler restart}
                 "status"  {:name "status"
                            :description "Show sol process state and /health summary (--port, or SOL_PORT/PORT env)"
                            :handler status}
                 "agent"   {:name "agent"
                            :description "Run one agent turn on sol's turn-processor stack: eta-mu sol agent [--model M] [--base-url U] [--api-key K] [--system S] <prompt...>"
                            :handler agent}}})
