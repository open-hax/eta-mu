(ns eta-mu.infra.cli.commands.agent-test
  (:require [clojure.string :as str]
            [cljs.test :refer [deftest is testing use-fixtures]]
            [eta-mu.infra.cli.commands.agent :as agent]
            [eta-mu.infra.cli.repl :as repl]))

(def ^:private original-fetch js/fetch)
(def ^:private original-exit (.-exit js/process))

(use-fixtures :each
  {:before #(do (set! js/fetch original-fetch)
                (set! (.-exit js/process) original-exit))
   :after #(do (set! js/fetch original-fetch)
               (set! (.-exit js/process) original-exit))})

(defn- ^:async json-response
  [body]
  #js {:ok true
       :status 200
       :json (fn [] (js/Promise.resolve (clj->js body)))})

(deftest ^:async handle-prints-response-test
  (testing "single-turn agent command prints the assistant response"
    (set! js/fetch
          (fn [_url _opts]
            (js/Promise.resolve
              (json-response
                {:model "gpt-4o-mini"
                 :choices [{:message {:role "assistant" :content "Hi there"}
                            :finish_reason "stop"}]
                 :usage {:prompt_tokens 1 :completion_tokens 1 :total_tokens 2}}))))
    (let [exit-codes (atom [])]
      (set! (.-exit js/process) #(swap! exit-codes conj %))
      (let [output (with-out-str
                     (await (agent/handle {:args ["hello"] :flags {"api-key" "test-key"}})))]
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
