(ns eta-mu.e2e.sol-cli-e2e
  "End-to-end test for `eta-mu sol`.

  Spawns the REAL built `dist-cli/index.cjs` binary as a child process (not
  an in-process call) and asserts:

  1. `eta-mu sol agent <prompt>` completes one agent turn on sol's
     turn-processor stack against a mock OpenAI-compatible SSE server (the
     same mock pattern as the agent e2e suite) — proving the decoupling on
     the exact path users hit.
  2. `eta-mu sol --help` lists the v1 command surface.

  Isolation: the agent run gets its own tmp cwd and OS-assigned ephemeral
  port. Namespace ends in `-e2e` so the fast `:test` build never picks it
  up; run via `pnpm test:e2e` (builds the CLI first)."
  (:require [clojure.string :as str]
            [cljs.test :refer [deftest is testing]]
            ["node:http" :as http]
            ["node:child_process" :as cp]
            ["node:os" :as os]
            ["node:path" :as path]
            ["node:fs" :as fs]))

(defn- unique-id []
  (str (js/Date.now) "-" (.floor js/Math (* (.random js/Math) 1000000))))

(defn- completion
  "Build a single-chunk SSE `data:` payload equivalent to a full (non-streamed)
  OpenAI chat-completion turn."
  [delta finish-reason]
  {:model "mock-model"
   :choices [{:index 0 :delta delta :finish_reason finish-reason}]
   :usage {:prompt_tokens 1 :completion_tokens 1 :total_tokens 2}})

(defn- request-handler
  [remaining requests]
  (fn [^js req ^js res]
    (.setEncoding req "utf8")
    (let [chunks (atom [])]
      (.on req "data" (fn [chunk] (swap! chunks conj chunk)))
      (.on req "end"
           (fn []
             (let [body (js->clj (js/JSON.parse (apply str @chunks)) :keywordize-keys true)
                   auth (aget (.-headers req) "authorization")
                   next-response (first @remaining)]
               (swap! requests conj {:body body :authorization auth})
               (swap! remaining rest)
               (.writeHead res 200 #js {"Content-Type" "text/event-stream"})
               (.write res (str "data: " (js/JSON.stringify (clj->js next-response)) "\n\n"))
               (.end res "data: [DONE]\n\n")))))))

(defn- ^:async start-mock-server
  [queue]
  (let [remaining (atom queue)
        requests (atom [])
        server (http/createServer (request-handler remaining requests))]
    (js/Promise.
     (fn [resolve _reject]
       (.listen server 0 "127.0.0.1"
                (fn []
                  (resolve {:server server
                            :port (.-port (.address server))
                            :requests requests})))))))

(defn- ^:async stop-mock-server! [server]
  (js/Promise. (fn [resolve _reject] (.close server (fn [] (resolve nil))))))

(defn- ^:async run-cli!
  "Spawn the built CLI as a real child process with `cwd` and `env-overrides`,
  wait for it to exit (or time out), and return {:exit :stdout :stderr}.
  A nil override value deletes that key from the inherited environment."
  [entry-path cwd env-overrides args]
  (js/Promise.
   (fn [resolve _reject]
     (let [env (js/Object.assign #js {} js/process.env)]
       (doseq [[k v] env-overrides]
         (if (nil? v) (js-delete env k) (aset env k v)))
       (let [child (.spawn cp "node" (clj->js (into [entry-path] args))
                           #js {:cwd cwd
                                :env env
                                :stdio "pipe"})
             out (atom "")
             err (atom "")
             timer (js/setTimeout
                    (fn []
                      (.kill child)
                      (resolve {:exit :timed-out :stdout @out :stderr @err}))
                    20000)]
         (.on (.-stdout child) "data" (fn [d] (swap! out str d)))
         (.on (.-stderr child) "data" (fn [d] (swap! err str d)))
         (.on child "error" (fn [e]
                              (js/clearTimeout timer)
                              (resolve {:exit :spawn-error :stdout @out :stderr (str @err (.-message e))})))
         (.on child "close" (fn [code]
                              (js/clearTimeout timer)
                              (resolve {:exit code :stdout @out :stderr @err}))))))))

(deftest ^:async sol-agent-turn-e2e-test
  (testing "eta-mu sol agent completes one turn against a mock SSE server"
    (let [entry-path (path/join (js/process.cwd) "dist-cli" "index.cjs")]
      (is (.existsSync fs entry-path)
          (str "dist-cli/index.cjs is missing at " entry-path
               " — run `pnpm build` before `pnpm test:e2e`."))

      (let [tmp-dir (path/join (os/tmpdir) (str "eta-mu-sol-e2e-" (unique-id)))]
        (.mkdirSync fs tmp-dir #js {:recursive true})

        (let [queue [(completion {:role "assistant" :content "Sol reply."} "stop")]
              {:keys [server port requests]} (await (start-mock-server queue))
              result (await (run-cli! entry-path tmp-dir
                                      {}
                                      ["sol" "agent"
                                       "--model" "mock-model"
                                       "--base-url" (str "http://127.0.0.1:" port "/v1/chat/completions")
                                       "--api-key" "e2e-test-token"
                                       "say" "hi"]))]

          (testing "the CLI process completes successfully"
            (is (= 0 (:exit result)) (str "stderr: " (:stderr result)))
            (is (str/includes? (:stdout result) "Sol reply.")))

          (testing "the mock server received exactly one request"
            (is (= 1 (count @requests))))

          (testing "the turn carried the sol system prompt, the user prompt, and the model"
            (let [messages (:messages (:body (first @requests)))]
              (is (= "system" (:role (first messages))))
              (is (str/includes? (:content (first messages)) "Sol"))
              (is (= "user" (:role (second messages))))
              (is (= "say hi" (:content (second messages))))
              (is (= "mock-model" (:model (:body (first @requests)))))))

          (testing "the Authorization header carried the configured token"
            (is (= "Bearer e2e-test-token" (:authorization (first @requests)))))

          (await (stop-mock-server! server)))))))

(deftest ^:async sol-help-lists-surface-e2e-test
  (testing "eta-mu sol --help lists the v1 command surface"
    (let [entry-path (path/join (js/process.cwd) "dist-cli" "index.cjs")
          tmp-dir (path/join (os/tmpdir) (str "eta-mu-sol-e2e-help-" (unique-id)))]
      (.mkdirSync fs tmp-dir #js {:recursive true})
      (let [result (await (run-cli! entry-path tmp-dir {} ["sol" "--help"]))]
        (is (= 0 (:exit result)) (str "stderr: " (:stderr result)))
        (doseq [sub ["START" "STOP" "RESTART" "STATUS" "AGENT"]]
          (is (str/includes? (:stdout result) sub) sub))))))

(def ^:private fake-sol-server-source
  "Stand-in for sol's dist/server.js: binds SOL_PORT||PORT||8001 — the exact
  precedence of sol's infra.config — and serves a /health JSON payload."
  (str "const http = require(\"node:http\");\n"
       "const port = parseInt(process.env.SOL_PORT || process.env.PORT || \"8001\", 10);\n"
       "http.createServer((req, res) => {\n"
       "  if (req.url === \"/health\") {\n"
       "    res.writeHead(200, { \"Content-Type\": \"application/json\" });\n"
       "    res.end(JSON.stringify({ status: \"ok\", service: \"fake-sol\", at: new Date().toISOString() }));\n"
       "  } else {\n"
       "    res.writeHead(404);\n"
       "    res.end();\n"
       "  }\n"
       "}).listen(port, \"127.0.0.1\");\n"))

(defn- ^:async free-port
  "Return an OS-assigned ephemeral port that is free right now."
  []
  (let [server (http/createServer (fn [_req res] (.end res)))]
    (js/Promise.
     (fn [resolve _reject]
       (.listen server 0 "127.0.0.1"
                (fn []
                  (let [port (.-port (.address server))]
                    (.close server (fn [] (resolve port))))))))))

(deftest ^:async sol-start-port-flag-e2e-test
  (testing "sol start --port N spawns a server that actually listens on N"
    (let [entry-path (path/join (js/process.cwd) "dist-cli" "index.cjs")
          tmp-dir (path/join (os/tmpdir) (str "eta-mu-sol-e2e-start-" (unique-id)))]
      (.mkdirSync fs tmp-dir #js {:recursive true})
      (let [fake-server (path/join tmp-dir "fake-sol-server.cjs")]
        (.writeFileSync fs fake-server fake-sol-server-source)
        (let [port (await (free-port))
              env {"SOL_SERVER_PATH" fake-server
                   "SOL_PORT" nil "PORT" nil "SOL_HOST" nil "HOST" nil}
              started (await (run-cli! entry-path tmp-dir env
                                       ["sol" "start" "--port" (str port)]))]
          (try
            (testing "start exits 0 and reports health on the flag port"
              (is (= 0 (:exit started))
                  (str "stdout: " (:stdout started) " stderr: " (:stderr started)))
              (is (str/includes? (:stdout started) (str "port " port)))
              (is (str/includes? (:stdout started) "health: ok (fake-sol)")))
            (testing "status confirms the server is reachable on the flag port"
              (let [probed (await (run-cli! entry-path tmp-dir env
                                            ["sol" "status" "--port" (str port)]))]
                (is (= 0 (:exit probed))
                    (str "stdout: " (:stdout probed) " stderr: " (:stderr probed)))
                (is (str/includes? (:stdout probed) "process: running"))
                (is (str/includes? (:stdout probed) "health: ok (fake-sol, at"))))
            (finally
              (let [stopped (await (run-cli! entry-path tmp-dir env ["sol" "stop"]))]
                (is (= 0 (:exit stopped)) (str "stderr: " (:stderr stopped)))
                (is (str/includes? (:stdout stopped) "sol stopped"))))))))))
