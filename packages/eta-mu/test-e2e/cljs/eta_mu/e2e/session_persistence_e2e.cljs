(ns eta-mu.e2e.session-persistence-e2e
  "End-to-end test for agent session persistence and resume.

  Spawns the REAL built `dist-cli/index.cjs` binary as a child process against
  a mock OpenAI-compatible server, twice: the first run must write a session
  artifact under an isolated ETA_MU_HOME, and the second run — `--resume` with
  only a unique id PREFIX and no --model flag — must send the first run's full
  transcript back to the model and adopt the artifact's stored model. A third
  invocation of `eta-mu session` must list the stored session.

  Isolation: every run gets its own tmp cwd, tmp ETA_MU_HOME, and ephemeral
  port, so the suite cannot interfere with itself or the developer's real
  ~/.eta-mu. Namespace ends in `-e2e` so it never runs in the fast `:test`
  loop; run via `pnpm test:e2e`."
  (:require [clojure.edn :as edn]
            [clojure.string :as str]
            [cljs.test :refer [deftest is testing]]
            ["node:http" :as http]
            ["node:child_process" :as cp]
            ["node:os" :as os]
            ["node:path" :as path]
            ["node:fs" :as fs]))

(defn- unique-id []
  (str (js/Date.now) "-" (.floor js/Math (* (.random js/Math) 1000000))))

(defn- completion
  "Build a single-chunk SSE `data:` payload for one assistant text turn."
  [text]
  {:model "mock-model"
   :choices [{:index 0 :delta {:role "assistant" :content text} :finish_reason "stop"}]
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
                   next-response (first @remaining)]
               (swap! requests conj {:body body})
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
  wait for it to exit (or time out), and return {:exit :stdout :stderr}."
  [entry-path cwd env-overrides args]
  (js/Promise.
   (fn [resolve _reject]
     (let [child (.spawn cp "node" (clj->js (into [entry-path] args))
                         #js {:cwd cwd
                              :env (js/Object.assign #js {} js/process.env (clj->js env-overrides))
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
                            (resolve {:exit code :stdout @out :stderr @err})))))))

(deftest ^:async agent-session-write-and-resume-e2e-test
  (testing "eta-mu agent persists each turn and --resume rebuilds the full transcript"
    (let [entry-path (path/join (js/process.cwd) "dist-cli" "index.cjs")]
      (is (.existsSync fs entry-path)
          (str "dist-cli/index.cjs is missing at " entry-path
               " — run `pnpm build` before `pnpm test:e2e`."))

      (let [tmp-dir (path/join (os/tmpdir) (str "eta-mu-e2e-session-" (unique-id)))
            home-dir (path/join tmp-dir "eta-mu-home")
            work-dir (path/join tmp-dir "work")]
        (.mkdirSync fs home-dir #js {:recursive true})
        (.mkdirSync fs work-dir #js {:recursive true})

        (let [{:keys [server port requests]}
              (await (start-mock-server [(completion "First reply.")
                                         (completion "Second reply.")]))
              env {"ETA_MU_HOME" home-dir
                   "OPENAI_BASE_URL" (str "http://127.0.0.1:" port "/v1/chat/completions")
                   "OPENAI_AUTH_TOKEN" "e2e-test-token"}
              run-1 (await (run-cli! entry-path work-dir env
                                     ["agent" "--model" "mock-model" "remember-alpha"]))]

          (testing "run 1 completes and persists one session artifact"
              (is (= 0 (:exit run-1)) (str "stderr: " (:stderr run-1)))
              (is (str/includes? (:stdout run-1) "First reply."))
              (let [session-files (.readdirSync fs (path/join home-dir "sessions"))]
                (is (= 1 (count session-files)))

                (let [session-id (subs (first session-files) 0 (- (count (first session-files)) 4))
                      artifact (edn/read-string
                                (fs/readFileSync (path/join home-dir "sessions" (first session-files)) "utf8"))]

                  (testing "the artifact holds the turn: user prompt then assistant reply"
                    (is (= session-id (:session-id artifact)))
                    (is (= work-dir (:cwd artifact)))
                    (is (= {:id "mock-model" :provider "openai"} (:model artifact)))
                    (is (= [:user :assistant] (map :role (:messages artifact))))
                    (is (= "remember-alpha" (:content (first (:messages artifact)))))
                    (is (= "First reply."
                           (:text (first (:content (second (:messages artifact))))))))

                  (testing "run 2 with --resume (prefix only, no --model) replays the transcript"
                    (let [run-2 (await (run-cli! entry-path work-dir env
                                                 ["agent" "--resume" (subs session-id 0 12)
                                                  "what-did-i-say"]))]
                      (is (= 0 (:exit run-2)) (str "stderr: " (:stderr run-2)))
                      (is (str/includes? (:stdout run-2) "Second reply."))

                      (let [second-request (second @requests)
                            messages (:messages (:body second-request))]
                        (is (= 2 (count @requests)))
                        (is (= "mock-model" (:model (:body second-request)))
                            "the resumed run adopts the artifact's stored model")
                        (is (= ["system" "user" "assistant" "user"] (map :role messages)))
                        (is (= "remember-alpha" (:content (nth messages 1))))
                        (is (= "First reply." (:content (nth messages 2))))
                        (is (= "what-did-i-say" (:content (nth messages 3))))))

                  (testing "eta-mu session lists the stored session"
                    (let [run-3 (await (run-cli! entry-path work-dir env ["session"]))]
                      (is (= 0 (:exit run-3)) (str "stderr: " (:stderr run-3)))
                      (is (str/includes? (:stdout run-3) session-id))
                      (is (str/includes? (:stdout run-3) "mock-model"))
                      (is (str/includes? (:stdout run-3) "remember-alpha"))))

                  (testing "both runs share one artifact: resume appends, not duplicates"
                    (let [final-artifact (edn/read-string
                                          (fs/readFileSync (path/join home-dir "sessions" (first session-files)) "utf8"))]
                      (is (= [:user :assistant :user :assistant]
                             (map :role (:messages final-artifact))))))))))

          (await (stop-mock-server! server)))))))
