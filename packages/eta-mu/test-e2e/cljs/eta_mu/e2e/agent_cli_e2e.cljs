(ns eta-mu.e2e.agent-cli-e2e
  "End-to-end test for `eta-mu agent`.

  This spawns the REAL built `dist-cli/index.cjs` binary as a child process
  (not an in-process call) against a mock OpenAI-compatible chat-completions
  HTTP server that serves a fixed, hand-ordered queue of canned assistant
  turns. It asserts two independent things:

  1. The tool_result content the harness sends BACK to the LLM on each turn
     is exactly what the tool should have produced (read the mock server's
     recorded request bodies for the `role: tool` messages).
  2. The tools' real, physical side effects landed correctly on disk (an
     isolated tmp directory used as the child process's cwd).

  \"Shuffled\": turn 1 issues two tool calls per turn whose effects don't
  depend on each other (write a.txt / write b.txt; read a.txt / bash on
  b.txt), and each pair is queued in the NON-default order (second-then-first)
  to prove the harness doesn't rely on tool-call array order to keep
  concurrent tool effects isolated. This is a fixed, hand-picked order, not a
  random shuffle: a truly random shuffle would make a failing run
  non-reproducible, which defeats the point of an e2e regression test.

  Isolation: every run gets its own tmp working directory (random suffix) and
  its own OS-assigned ephemeral port, so this test cannot interfere with
  itself across repeated or parallel runs, and its tool side effects
  (a.txt/b.txt/created files) cannot interfere with each other because each
  tool call in a shuffled pair targets a distinct file.

  Namespace note: this file's namespace ends in `-e2e`, not `-test`, on
  purpose — the fast `:test` shadow-cljs build (`pnpm test`) only picks up
  `-test$` namespaces, so this heavier, network- and child-process-driving
  suite never runs as part of the quick unit-test loop. Run it via
  `pnpm test:e2e` (which builds the CLI first, then runs this)."
  (:require [clojure.string :as str]
            [cljs.test :refer [deftest is testing]]
            ["node:http" :as http]
            ["node:child_process" :as cp]
            ["node:os" :as os]
            ["node:path" :as path]
            ["node:fs" :as fs]))

(defn- unique-id []
  (str (js/Date.now) "-" (.floor js/Math (* (.random js/Math) 1000000))))

(defn- tool-call-message
  "Build an OpenAI streaming-delta assistant message issuing one or more tool
  calls, each fully formed in a single delta (a degenerate one-chunk stream)."
  [calls]
  {:role "assistant"
   :tool_calls (map-indexed (fn [idx [id name args]]
                              {:index idx :id id :type "function"
                               :function {:name name :arguments (js/JSON.stringify (clj->js args))}})
                            calls)})

(defn- completion
  "Build a single-chunk SSE `data:` payload equivalent to a full (non-streamed)
  OpenAI chat-completion turn — the real client always requests `stream:
  true`, so every mock turn must be shaped as a streaming-delta chunk."
  [delta finish-reason]
  {:model "mock-model"
   :choices [{:index 0 :delta delta :finish_reason finish-reason}]
   :usage {:prompt_tokens 1 :completion_tokens 1 :total_tokens 2}})

;; The canned turn queue. Two shuffled (non-default-order) parallel-tool-call
;; turns, one single-tool-call turn, then a final stop turn.
(defn- turn-queue []
  [;; Turn 1: write b.txt THEN write a.txt (reverse of "natural" a-then-b order).
   (completion (tool-call-message [["call-1" "write" {:path "b.txt" :content "BBB"}]
                                   ["call-2" "write" {:path "a.txt" :content "AAA"}]])
               "tool_calls")
   ;; Turn 2: bash on b.txt THEN read a.txt (reverse of read-then-bash order).
   (completion (tool-call-message [["call-3" "bash" {:command "wc -l b.txt"}]
                                   ["call-4" "read" {:path "a.txt"}]])
               "tool_calls")
   ;; Turn 3: edit a.txt.
   (completion (tool-call-message [["call-5" "edit" {:path "a.txt" :old_text "AAA" :new_text "ZZZ"}]])
               "tool_calls")
   ;; Turn 4: final answer, no more tool calls.
   (completion {:role "assistant" :content "Done."} "stop")])

(defn- request-handler
  "Build the (req res) handler for the mock server: read the full body,
  record it, pop the next canned response off `remaining`, and reply as a
  single-event SSE stream (the real client always sends `stream: true`)."
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
  "Start an HTTP server on an OS-assigned port serving `queue` (a vector of
  canned OpenAI chat-completion response maps) one per request, in order.
  Returns {:server :port :requests}, where :requests is an atom accumulating
  {:body :authorization} for every request received."
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

(defn- tool-messages [request]
  (filter #(= (:role %) "tool") (:messages (:body request))))

(deftest ^:async agent-cli-tool-loop-e2e-test
  (testing "eta-mu agent drives a real multi-turn, parallel-tool-call loop against a mock LLM"
    (let [entry-path (path/join (js/process.cwd) "dist-cli" "index.cjs")]
      (is (.existsSync fs entry-path)
          (str "dist-cli/index.cjs is missing at " entry-path
               " — run `pnpm build` before `pnpm test:e2e`."))

      (let [tmp-dir (path/join (os/tmpdir) (str "eta-mu-e2e-" (unique-id)))]
        (.mkdirSync fs tmp-dir #js {:recursive true})

        (let [{:keys [server port requests]} (await (start-mock-server (turn-queue)))
              result (await (run-cli! entry-path tmp-dir
                                      {"OPENAI_BASE_URL" (str "http://127.0.0.1:" port "/v1/chat/completions")
                                       "OPENAI_AUTH_TOKEN" "e2e-test-token"}
                                      ["agent" "--model" "mock-model" "start"]))]

          (testing "the CLI process completes successfully"
            (is (= 0 (:exit result)) (str "stderr: " (:stderr result)))
            (is (str/includes? (:stdout result) "Done.")))

          (testing "the mock server received exactly one request per turn"
            (is (= 4 (count @requests))))

          ;; Each request's messages array accumulates the FULL conversation
          ;; history, so later requests also carry earlier turns' tool
          ;; results. `take-last` isolates just the turn that produced them.
          (testing "turn 1's parallel writes each produced the correct, isolated tool_result"
            (let [messages (take-last 2 (tool-messages (nth @requests 1)))]
              (is (= 2 (count messages)))
              (is (= "Wrote 3 bytes to b.txt" (:content (nth messages 0))))
              (is (= "Wrote 3 bytes to a.txt" (:content (nth messages 1))))))

          (testing "turn 2's parallel bash+read each produced the correct, isolated tool_result"
            (let [messages (take-last 2 (tool-messages (nth @requests 2)))
                  bash-result (:content (nth messages 0))
                  read-result (:content (nth messages 1))]
              (is (str/includes? bash-result "b.txt"))
              ;; "BBB" has no trailing newline, so `wc -l` reports 0 lines.
              (is (re-find #"\b0\b" bash-result))
              (is (= "AAA" read-result))))

          (testing "turn 3's edit produced the correct tool_result"
            (let [messages (take-last 1 (tool-messages (nth @requests 3)))]
              (is (= "Edited a.txt" (:content (nth messages 0))))))

          (testing "the Authorization header carried the configured token"
            (is (= "Bearer e2e-test-token" (:authorization (first @requests)))))

          (testing "the real filesystem reflects every tool's effect, with no cross-file interference"
            (is (= "ZZZ" (.readFileSync fs (path/join tmp-dir "a.txt") "utf8")))
            (is (= "BBB" (.readFileSync fs (path/join tmp-dir "b.txt") "utf8"))))

          (await (stop-mock-server! server)))))))

(deftest ^:async agent-cli-find-grep-ls-tools-e2e-test
  (testing "eta-mu agent drives find/grep/ls tool calls against a mock LLM"
    (let [entry-path (path/join (js/process.cwd) "dist-cli" "index.cjs")]
      (is (.existsSync fs entry-path)
          (str "dist-cli/index.cjs is missing at " entry-path
               " — run `pnpm build` before `pnpm test:e2e`."))

      (let [tmp-dir (path/join (os/tmpdir) (str "eta-mu-e2e-tools-" (unique-id)))]
        (.mkdirSync fs tmp-dir #js {:recursive true})
        (.writeFileSync fs (path/join tmp-dir "needle.txt") "find the needle here")
        (.mkdirSync fs (path/join tmp-dir "sub") #js {:recursive true})
        (.writeFileSync fs (path/join tmp-dir "sub" "other.txt") "nothing to see")

        (let [queue [(completion (tool-call-message [["call-1" "find" {:pattern "*.txt"}]]) "tool_calls")
                     (completion (tool-call-message [["call-2" "grep" {:pattern "needle"}]]) "tool_calls")
                     (completion (tool-call-message [["call-3" "ls" {}]]) "tool_calls")
                     (completion {:role "assistant" :content "Done."} "stop")]
              {:keys [server port requests]} (await (start-mock-server queue))
              result (await (run-cli! entry-path tmp-dir
                                      {"OPENAI_BASE_URL" (str "http://127.0.0.1:" port "/v1/chat/completions")
                                       "OPENAI_AUTH_TOKEN" "e2e-test-token"}
                                      ["agent" "--model" "mock-model" "start"]))]

          (testing "the CLI process completes successfully"
            (is (= 0 (:exit result)) (str "stderr: " (:stderr result)))
            (is (str/includes? (:stdout result) "Done.")))

          (testing "find returned both .txt files, sorted, relative to cwd"
            (let [messages (tool-messages (nth @requests 1))]
              (is (= "needle.txt\nsub/other.txt" (:content (first messages))))))

          (testing "grep found the match in needle.txt with the right line number"
            (let [messages (tool-messages (nth @requests 2))]
              (is (= "needle.txt:1: find the needle here" (:content (last messages))))))

          (testing "ls listed both the file and the sub directory"
            (let [messages (tool-messages (nth @requests 3))
                  content (:content (last messages))]
              (is (str/includes? content "needle.txt"))
              (is (str/includes? content "sub/"))))

          (await (stop-mock-server! server)))))))

(defn- ^:async start-sse-mock-server
  "Start an HTTP server that always replies with the same genuinely
  multi-chunk `text/event-stream` body — each SSE `data:` line is written as
  a SEPARATE `res.write`, so the real client must reassemble the response
  from several network reads rather than getting it whole in one shot."
  [sse-body]
  (let [server (http/createServer
                (fn [^js req ^js res]
                  (.on req "data" (fn [_chunk]))
                  (.on req "end"
                       (fn []
                         (.writeHead res 200 #js {"Content-Type" "text/event-stream"})
                         (doseq [line sse-body]
                           (.write res line))
                         (.end res)))))]
    (js/Promise.
     (fn [resolve _reject]
       (.listen server 0 "127.0.0.1"
                (fn [] (resolve {:server server :port (.-port (.address server))})))))))

(deftest ^:async agent-cli-sse-streaming-e2e-test
  (testing "eta-mu agent reassembles a genuinely chunked SSE response into the final reply"
    (let [entry-path (path/join (js/process.cwd) "dist-cli" "index.cjs")]
      (is (.existsSync fs entry-path)
          (str "dist-cli/index.cjs is missing at " entry-path
               " — run `pnpm build` before `pnpm test:e2e`."))

      (let [tmp-dir (path/join (os/tmpdir) (str "eta-mu-e2e-sse-" (unique-id)))
            sse-body ["data: " (js/JSON.stringify (clj->js {:choices [{:index 0 :delta {:role "assistant"} :finish_reason nil}]}))
                      "\n\n"
                      "data: " (js/JSON.stringify (clj->js {:choices [{:index 0 :delta {:content "Hel"} :finish_reason nil}]}))
                      "\n\n"
                      "data: " (js/JSON.stringify (clj->js {:choices [{:index 0 :delta {:content "lo, "} :finish_reason nil}]}))
                      "\n\n"
                      "data: " (js/JSON.stringify (clj->js {:choices [{:index 0 :delta {:content "world!"} :finish_reason nil}]}))
                      "\n\n"
                      "data: " (js/JSON.stringify (clj->js {:choices [{:index 0 :delta {} :finish_reason "stop"}]}))
                      "\n\n"
                      "data: [DONE]\n\n"]]
        (.mkdirSync fs tmp-dir #js {:recursive true})

        (let [{:keys [server port]} (await (start-sse-mock-server sse-body))
              result (await (run-cli! entry-path tmp-dir
                                      {"OPENAI_BASE_URL" (str "http://127.0.0.1:" port "/v1/chat/completions")
                                       "OPENAI_AUTH_TOKEN" "e2e-test-token"}
                                      ["agent" "--model" "mock-model" "hi"]))]

          (testing "the CLI process completes successfully with the reassembled text"
            (is (= 0 (:exit result)) (str "stderr: " (:stderr result)))
            (is (str/includes? (:stdout result) "Hello, world!")))

          (await (stop-mock-server! server)))))))
