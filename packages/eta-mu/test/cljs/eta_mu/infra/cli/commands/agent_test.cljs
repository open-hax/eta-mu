(ns eta-mu.infra.cli.commands.agent-test
  (:require [clojure.string :as str]
            [cljs.test :refer [deftest is testing use-fixtures]]
            [goog.object :as gobj]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]
            [eta-mu.infra.cli.commands.agent :as agent]
            [eta-mu.infra.cli.repl :as repl]
            [eta-mu.infra.session :as session]))

(def ^:private original-fetch js/fetch)
(def ^:private original-exit (.-exit js/process))
(def ^:private original-stdout-write (.-write js/process.stdout))
(def ^:private original-eta-mu-home (aget js/process.env "ETA_MU_HOME"))

(use-fixtures :each
  {:before #(do (set! js/fetch original-fetch)
                (set! (.-exit js/process) original-exit)
                (set! (.-write js/process.stdout) original-stdout-write))
   :after #(do (set! js/fetch original-fetch)
               (set! (.-exit js/process) original-exit)
               (set! (.-write js/process.stdout) original-stdout-write)
               (if original-eta-mu-home
                 (aset js/process.env "ETA_MU_HOME" original-eta-mu-home)
                 (gobj/remove js/process.env "ETA_MU_HOME")))})

(defn- isolate-eta-mu-home!
  "Point ETA_MU_HOME at a fresh tmp dir so tests never touch the real
  ~/.eta-mu session store."
  []
  (let [dir (path/join (os/tmpdir) (str "eta-mu-agent-test-" (js/Date.now) "-"
                                        (.floor js/Math (* (.random js/Math) 1000000))))]
    (.mkdirSync fs dir #js {:recursive true})
    (aset js/process.env "ETA_MU_HOME" dir)
    dir))

(defn- ^:async with-captured-stdout
  "Run `thunk`, capturing everything written via `process.stdout.write`
  (used by streamed output, which bypasses `println`/`with-out-str`)."
  [thunk]
  (let [captured (atom "")]
    (set! (.-write js/process.stdout) (fn [s] (swap! captured str s) true))
    (await (thunk))
    @captured))

(defn- sse-response
  "A mock streaming Response whose body yields one SSE event per read."
  [chunks]
  (let [encoder (js/TextEncoder.)
        blocks (conj (mapv (fn [c] (str "data: " (js/JSON.stringify (clj->js c)) "\n\n")) chunks)
                     "data: [DONE]\n\n")
        idx (atom 0)]
    #js {:ok true
         :status 200
         :body #js {:getReader
                    (fn []
                      #js {:read (fn []
                                   (js/Promise.resolve
                                    (if (< @idx (count blocks))
                                      (let [b (nth blocks @idx)]
                                        (swap! idx inc)
                                        #js {:done false :value (.encode encoder b)})
                                      #js {:done true :value nil})))})}}))

(deftest ^:async handle-prints-response-test
  (testing "single-turn agent command prints the assistant response"
    (set! js/fetch
          (fn [_url _opts]
            (js/Promise.resolve
              (sse-response
                [{:choices [{:index 0 :delta {:content "Hi there"} :finish_reason nil}]}
                 {:choices [{:index 0 :delta {} :finish_reason "stop"}]}]))))
    (let [exit-codes (atom [])
          home (isolate-eta-mu-home!)]
      (set! (.-exit js/process) #(swap! exit-codes conj %))
      (let [output (await (with-captured-stdout
                            #(agent/handle {:args ["hello"] :flags {"api-key" "test-key"}})))]
        (is (str/includes? output "Hi there"))
        (is (= [0] @exit-codes))
        (is (= 1 (count (.readdirSync fs (path/join home "sessions"))))
            "a single-turn run persists one session artifact")))))

(deftest ^:async repl-multi-turn-test
  (testing "REPL runs multiple turns and exits on /exit"
    (let [inputs (atom ["hi" "/exit"])
          get-input (fn [_prompt]
                      (let [next (first @inputs)]
                        (swap! inputs rest)
                        (js/Promise.resolve next)))
          stream-fn (fn [_ _ _]
                      #js {:next (fn [] (js/Promise.resolve #js {:done true}))
                           :result (fn [] (js/Promise.resolve
                                           {:role :assistant
                                            :content [{:type :text :text "Hello"}]
                                            :api "test" :provider "test" :model "test"
                                            :usage {:input 0 :output 0 :cache-read 0 :cache-write 0 :total-tokens 0}
                                            :stop-reason :stop
                                            :timestamp 0}))})
          output (with-out-str
                   (await (repl/run-repl {:system-prompt "sys"
                                           :messages []
                                           :tools []}
                                           {:model {:id "gpt-4o-mini" :provider "openai"}
                                            :convert-to-llm (fn [messages] messages)
                                            :api-key "test-key"}
                                           stream-fn
                                           {:get-input get-input})))]
      (is (str/includes? output "eta-mu agent REPL"))
      (is (str/includes? output "Hello"))
      (is (str/includes? output "Goodbye")))))

(deftest ^:async repl-persists-each-turn-test
  (testing "REPL with a session atom persists every turn and /clear clears the artifact"
    (let [home (isolate-eta-mu-home!)
          session-atom (await (session/create! {:model {:id "gpt-4o-mini" :provider "openai"}
                                                :system-prompt "sys"}))
          assistant (fn [text]
                      {:role :assistant
                       :content [{:type :text :text text}]
                       :api "test" :provider "test" :model "test"
                       :usage {:input 0 :output 0 :cache-read 0 :cache-write 0 :total-tokens 0}
                       :stop-reason :stop
                       :timestamp 0})
          replies (atom ["First" "Second"])
          stream-fn (fn [_ _ _]
                      (let [text (first @replies)]
                        (swap! replies rest)
                        #js {:next (fn [] (js/Promise.resolve #js {:done true}))
                             :result (fn [] (js/Promise.resolve (assistant text)))}))
          inputs (atom ["one" "two" "/clear" "/exit"])
          get-input (fn [_prompt]
                      (let [next (first @inputs)]
                        (swap! inputs rest)
                        (js/Promise.resolve next)))]
      (with-out-str
        (await (repl/run-repl {:system-prompt "sys" :messages [] :tools []}
                              {:model {:id "gpt-4o-mini" :provider "openai"}
                               :convert-to-llm (fn [messages] messages)
                               :api-key "test-key"}
                              stream-fn
                              {:get-input get-input :session session-atom})))
      (is (= [] (:messages @session-atom))
          "/clear empties the live artifact transcript")
      (let [persisted (await (session/load-artifact (:session-id @session-atom)))]
        (is (= [] (:messages persisted))
            "/clear flushes the empty transcript to disk")
        (is (= 1 (count (.readdirSync fs (path/join home "sessions"))))
            "one session file covers the whole REPL run")))))

(deftest ^:async repl-persists-turns-before-clear-test
  (testing "each completed turn lands in the artifact before the next prompt"
    (isolate-eta-mu-home!)
    (let [session-atom (await (session/create! {:model {:id "m" :provider "p"}
                                                :system-prompt "sys"}))
          stream-fn (fn [_ _ _]
                      #js {:next (fn [] (js/Promise.resolve #js {:done true}))
                           :result (fn [] (js/Promise.resolve
                                           {:role :assistant
                                            :content [{:type :text :text "reply"}]
                                            :api "test" :provider "test" :model "test"
                                            :usage {:input 0 :output 0 :cache-read 0 :cache-write 0 :total-tokens 0}
                                            :stop-reason :stop
                                            :timestamp 0}))})
          inputs (atom ["one" "two" "/exit"])
          get-input (fn [_prompt]
                      (let [next (first @inputs)]
                        (swap! inputs rest)
                        (js/Promise.resolve next)))]
      (with-out-str
        (await (repl/run-repl {:system-prompt "sys" :messages [] :tools []}
                              {:model {:id "m" :provider "p"}
                               :convert-to-llm (fn [messages] messages)
                               :api-key "test-key"}
                              stream-fn
                              {:get-input get-input :session session-atom})))
      (is (= [:user :assistant :user :assistant]
             (map :role (:messages @session-atom)))
          "both turns persist in order"))))
