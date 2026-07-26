(ns eta-mu.infra.cli.commands.sol-test
  (:require [clojure.string :as str]
            [cljs.test :refer [deftest is testing use-fixtures]]
            [goog.object :as gobj]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]
            [eta-mu.domain.router :as router]
            [eta-mu.infra.cli.commands.sol :as sol]
            [eta-mu.shape.args :as args]))

(def ^:private original-exit (.-exit js/process))
(def ^:private original-console-error (.-error js/console))
(def ^:private env-keys ["SOL_SERVER_PATH" "SOL_PORT" "PORT" "SOL_HOST" "HOST"])
(def ^:private saved-env (into {} (keep (fn [k] (when-let [v (aget js/process.env k)] [k v])) env-keys)))

(use-fixtures :each
  {:before #(do (set! (.-exit js/process) original-exit)
                (set! (.-error js/console) original-console-error))
   :after #(do (set! (.-exit js/process) original-exit)
               (set! (.-error js/console) original-console-error)
               (doseq [k env-keys]
                 (if-let [v (get saved-env k)]
                   (aset js/process.env k v)
                   (gobj/remove js/process.env k))))})

(defn- stub-exit!
  "Stub process.exit and console.error, returning [exit-codes errors] atoms."
  []
  (let [exit-codes (atom [])
        errors (atom [])]
    (set! (.-exit js/process) (fn [code] (swap! exit-codes conj code)))
    (set! (.-error js/console) (fn [& xs] (swap! errors conj (str/join " " xs))))
    [exit-codes errors]))

(defn- tmp-dir [label]
  (let [dir (path/join (os/tmpdir) (str "eta-mu-sol-test-" label "-" (js/Date.now) "-"
                                        (.floor js/Math (* (.random js/Math) 1000000))))]
    (.mkdirSync fs dir #js {:recursive true})
    dir))

(defn- route
  [tokens]
  (router/resolve-dispatch {"sol" (sol/group)} (args/parse tokens)))

(deftest routes-lifecycle-subcommands-test
  (testing "start/stop/restart/status dispatch to their handlers with no args"
    (doseq [[token handler] [["start" sol/start]
                             ["stop" sol/stop]
                             ["restart" sol/restart]
                             ["status" sol/status]]]
      (let [{:keys [type command path args]} (route ["sol" token])]
        (is (= :dispatch type) token)
        (is (= ["sol" token] path) token)
        (is (= [] args) token)
        (is (identical? handler (:handler command)) token)))))

(deftest routes-agent-prompt-args-test
  (testing "sol agent dispatches prompt tokens as args, flags stay in parsed flags"
    (let [{:keys [type command path args]} (route ["sol" "agent" "hello" "world"])]
      (is (= :dispatch type))
      (is (= ["sol" "agent"] path))
      (is (= ["hello" "world"] args))
      (is (identical? sol/agent (:handler command))))
    (let [parsed (args/parse ["sol" "agent" "--model" "mock" "hi"])]
      (is (= "mock" (get (:flags parsed) "model"))))))

(deftest routes-help-test
  (testing "bare sol and sol --help render the group help listing the surface"
    (is (= {:type :help :path ["sol"]} (route ["sol"])))
    (is (= {:type :help :path ["sol"]} (route ["sol" "--help"])))
    (let [help (router/render-help {"sol" (sol/group)} ["sol"])]
      (doseq [sub ["START" "STOP" "RESTART" "STATUS" "AGENT"]]
        (is (str/includes? help sub) sub))
      (is (str/includes? help "--model")))))

(deftest routes-unknown-subcommand-test
  (testing "an unknown sol subcommand is an error descriptor"
    (is (= :error (:type (route ["sol" "bogus"]))))))

(deftest effective-port-test
  (testing "--port flag beats SOL_PORT/PORT env, default is 8001"
    (doseq [k ["SOL_PORT" "PORT"]] (gobj/remove js/process.env k))
    (is (= sol/default-port (sol/effective-port {})))
    (is (= sol/default-port (sol/effective-port {"port" "not-a-number"})))
    (aset js/process.env "SOL_PORT" "9001")
    (aset js/process.env "PORT" "9002")
    (is (= 7000 (sol/effective-port {"port" "7000"})))
    (is (= 9001 (sol/effective-port {})))
    (gobj/remove js/process.env "SOL_PORT")
    (is (= 9002 (sol/effective-port {})))))

(deftest health-url-test
  (testing "health url targets the loopback /health endpoint on the effective port"
    (doseq [k ["SOL_HOST" "HOST" "SOL_PORT" "PORT"]] (gobj/remove js/process.env k))
    (is (= "http://127.0.0.1:8001/health" (sol/health-url {})))
    (is (= "http://127.0.0.1:7000/health" (sol/health-url {"port" "7000"})))))

(deftest shell-quote-test
  (testing "shell-quote wraps in single quotes and escapes embedded quotes"
    (is (= "'plain'" (sol/shell-quote "plain")))
    (is (= "'a'\\''b'" (sol/shell-quote "a'b")))))

(deftest launch-command-test
  (testing "the launch command injects SOL_PORT so the server binds the CLI's port"
    (let [cmd (sol/launch-command "/srv/sol server.js" "/state/sol.log" 8991)]
      (is (str/starts-with? cmd "SOL_PORT=8991 nohup node "))
      (is (str/includes? cmd "'/srv/sol server.js'"))
      (is (str/includes? cmd ">> '/state/sol.log' 2>&1 & echo $!")))
    (is (str/starts-with? (sol/launch-command "/s.js" "/l.log" 8001) "SOL_PORT=8001 "))))

(deftest resolve-server-path-override-test
  (testing "$SOL_SERVER_PATH is authoritative: returned when it exists, nil when not"
    (let [dir (tmp-dir "path")
          server (path/join dir "server.js")]
      (.writeFileSync fs server "// fake\n")
      (aset js/process.env "SOL_SERVER_PATH" server)
      (is (= server (sol/resolve-server-path)))
      (aset js/process.env "SOL_SERVER_PATH" (path/join dir "missing.js"))
      (is (nil? (sol/resolve-server-path))))))

(deftest ^:async start-not-built-test
  (testing "sol start with no resolvable server fails with the not-built error"
    (aset js/process.env "SOL_SERVER_PATH" (path/join (tmp-dir "not-built") "missing.js"))
    (let [[exit-codes errors] (stub-exit!)]
      (await (sol/start {:args [] :flags {}}))
      (is (= [1] @exit-codes))
      (is (some #(str/includes? % "not built or installed") @errors))
      (is (some #(str/includes? % "pnpm -C packages/sol build") @errors)))))

(deftest ^:async agent-usage-error-test
  (testing "sol agent without a prompt fails with usage"
    (let [[exit-codes errors] (stub-exit!)]
      (await (sol/agent {:args [] :flags {}}))
      (is (= [1] @exit-codes))
      (is (some #(str/includes? % "usage: eta-mu sol agent") @errors)))))

(deftest ^:async stop-when-not-running-test
  (testing "sol stop with no live server is idempotent and clears a stale pidfile"
    (let [dir (tmp-dir "stop")
          original-cwd (js/process.cwd)
          [exit-codes _] (stub-exit!)]
      (js/process.chdir dir)
      (try
        (.mkdirSync fs (path/join dir ".eta-mu-sol") #js {:recursive true})
        (.writeFileSync fs (path/join dir ".eta-mu-sol" "sol.pid") "999999\n")
        (let [output (with-out-str (await (sol/stop {:args [] :flags {}})))]
          (is (= [0] @exit-codes))
          (is (str/includes? output "sol is not running"))
          (is (not (.existsSync fs (path/join dir ".eta-mu-sol" "sol.pid")))))
        (finally (js/process.chdir original-cwd))))))

(deftest ^:async stop-does-not-signal-foreign-live-pid-test
  (testing "a recycled pid owned by another process is stale, never signalled"
    (let [dir (tmp-dir "foreign-pid")
          server (path/join dir "server.js")
          pid-path (path/join dir ".eta-mu-sol" "sol.pid")
          original-cwd (js/process.cwd)
          [exit-codes _] (stub-exit!)]
      (.writeFileSync fs server "// fake sol server\n")
      (aset js/process.env "SOL_SERVER_PATH" server)
      (js/process.chdir dir)
      (try
        (.mkdirSync fs (path/join dir ".eta-mu-sol") #js {:recursive true})
        (.writeFileSync fs pid-path (str (.-pid js/process) "\n"))
        (let [output (with-out-str (await (sol/stop {:args [] :flags {}})))]
          (is (= [0] @exit-codes))
          (is (str/includes? output "sol is not running"))
          (is (not (.existsSync fs pid-path))))
        (finally (js/process.chdir original-cwd))))))

(deftest ^:async status-when-not-running-test
  (testing "sol status with no live server reports not running and exits 1"
    (let [dir (tmp-dir "status")
          original-cwd (js/process.cwd)
          [exit-codes _] (stub-exit!)]
      (js/process.chdir dir)
      (try
        (let [output (with-out-str
                       (await (sol/status {:args [] :flags {"port" "59999"}})))]
          (is (= [1] @exit-codes))
          (is (str/includes? output "process: not running"))
          (is (str/includes? output "health: unreachable")))
        (finally (js/process.chdir original-cwd))))))
