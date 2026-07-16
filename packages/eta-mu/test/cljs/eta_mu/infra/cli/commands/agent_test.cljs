(ns eta-mu.infra.cli.commands.agent-test
  (:require [clojure.string :as str]
            [cljs.test :refer [deftest is testing use-fixtures]]
            [eta-mu.infra.cli.commands.agent :as agent]
            [eta-mu.infra.cli.repl :as repl]))

(def ^:private original-fetch js/fetch)
(def ^:private original-exit (.-exit js/process))
(def ^:private original-stdout-write (.-write js/process.stdout))

(use-fixtures :each
  {:before #(do (set! js/fetch original-fetch)
                (set! (.-exit js/process) original-exit)
                (set! (.-write js/process.stdout) original-stdout-write))
   :after #(do (set! js/fetch original-fetch)
               (set! (.-exit js/process) original-exit)
               (set! (.-write js/process.stdout) original-stdout-write))})

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
    (let [exit-codes (atom [])]
      (set! (.-exit js/process) #(swap! exit-codes conj %))
      (let [output (await (with-captured-stdout
                            #(agent/handle {:args ["hello"] :flags {"api-key" "test-key"}})))]
        (is (str/includes? output "Hi there"))
        (is (= [0] @exit-codes))))))

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
                                          get-input)))]
      (is (str/includes? output "eta-mu agent REPL"))
      (is (str/includes? output "Hello"))
      (is (str/includes? output "Goodbye")))))
