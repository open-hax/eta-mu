(ns eta-mu.infra.cli.tui-repl-test
  (:require [clojure.string :as str]
            [cljs.test :refer [deftest is testing]]
            [eta-mu.infra.cli.tui-repl :as tui-repl]
            [eta-mu.terminal-ui.extern.terminal :as terminal]))

(deftype FakeTerminal [buf]
  terminal/Terminal
  (write [_ data] (swap! buf str data))
  (columns [_] 80)
  (rows [_] 24)
  (hide-cursor [_] nil)
  (show-cursor [_] nil)
  (clear-line [_] nil)
  (clear-from-cursor [_] nil)
  (clear-screen [_] nil)
  (move-by [_ _lines] nil)
  (set-title [_ _title] nil)
  (start [_ _on-input _on-resize] nil)
  (stop [_] nil)
  (drain-input [_ _max-ms _idle-ms] (js/Promise.resolve nil)))

(defn- fake-terminal []
  (->FakeTerminal (atom "")))

(defn- assistant-stream [text]
  (fn [_model _llm-context _options]
    #js {:next (fn [] (js/Promise.resolve #js {:done true}))
         :result (fn [] (js/Promise.resolve
                          {:role :assistant
                           :content [{:type :text :text text}]
                           :api "test" :provider "test" :model "test"
                           :usage {:input 0 :output 0 :cache-read 0 :cache-write 0 :total-tokens 0}
                           :stop-reason :stop
                           :timestamp 0}))}))

(deftest ^:async tui-repl-renders-assistant-reply-test
  (testing "renders the banner, assistant reply, and exits on /exit"
    (let [term (fake-terminal)
          inputs (atom ["hi" "/exit"])
          get-input (fn [_prompt]
                      (let [next (first @inputs)]
                        (swap! inputs rest)
                        (js/Promise.resolve next)))]
      (await (tui-repl/run-tui-repl {:system-prompt "sys" :messages [] :tools []}
                                    {:model {:id "m" :provider "p"}
                                     :convert-to-llm (fn [messages] messages)}
                                    (assistant-stream "Hello there")
                                    get-input
                                    term))
      (let [output @(.-buf term)]
        (is (str/includes? output "eta-mu agent TUI"))
        (is (str/includes? output "Hello there"))
        (is (str/includes? output "Goodbye"))))))

(deftest ^:async tui-repl-clear-resets-context-test
  (testing "/clear resets messages and keeps the session running"
    (let [term (fake-terminal)
          inputs (atom ["/clear" "/exit"])
          get-input (fn [_prompt]
                      (let [next (first @inputs)]
                        (swap! inputs rest)
                        (js/Promise.resolve next)))]
      (await (tui-repl/run-tui-repl {:system-prompt "sys" :messages [] :tools []}
                                    {:model {:id "m" :provider "p"}
                                     :convert-to-llm (fn [messages] messages)}
                                    (assistant-stream "unused")
                                    get-input
                                    term))
      (is (str/includes? @(.-buf term) "Context cleared.")))))
