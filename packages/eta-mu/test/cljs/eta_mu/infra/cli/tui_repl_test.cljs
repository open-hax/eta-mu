(ns eta-mu.infra.cli.tui-repl-test
  (:require [clojure.string :as str]
            [cljs.test :refer [deftest is testing]]
            [eta-mu.infra.cli.tui-repl :as tui-repl]
            [eta-mu.terminal-ui.extern.terminal :as terminal]
            [eta-mu.terminal-ui.infra.host :as host]))

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

(deftest ^:async tui-repl-shows-and-clears-thinking-indicator-test
  (testing "shows a 'thinking...' status line while awaiting the model, clears it once output starts"
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
        (is (str/includes? output "thinking...")
            "the indicator should have been written at least once")
        (is (str/includes? output "Hello there")
            "the reply should still render after the indicator clears")))))

(deftest tui-emit-thinking-indicator-survives-lifecycle-events-test
  (testing "an :agent_start event does not clear the indicator; the first assistant delta does"
    (let [term (fake-terminal)
          state (host/new-state)
          emit (tui-repl/tui-emit term state)]
      (host/render! state term ["thinking..."])
      (emit {:type :agent_start})
      (is (seq (:frame @state))
          "lifecycle bookkeeping must not erase the indicator during the model wait")
      (emit {:type :message_update
             :message {:role :assistant :content [{:type :text :text "Hello"}]}})
      (is (empty? (:frame @state))
          "the first real output clears the indicator"))))

(deftest tui-emit-streams-markdown-through-host-test
  (testing "assistant deltas re-render as markdown frames; tool results interleave; turn ends cleanly"
    (let [term (fake-terminal)
          state (host/new-state)
          emit (tui-repl/tui-emit term state)]
      (emit {:type :agent_start})
      (emit {:type :message_update
             :message {:role :assistant :content [{:type :text :text "# Title"}]}})
      (emit {:type :message_update
             :message {:role :assistant :content [{:type :text :text "# Title\nsome **bold** text"}]}})
      (emit {:type :message_end
             :message {:role :tool-result :tool-name "bash" :is-error false
                       :content [{:type :text :text "ok"}]}})
      (emit {:type :turn_end
             :message {:role :assistant :content [{:type :text :text "# Title\nsome **bold** text"}]}})
      (let [output @(.-buf term)]
        (is (str/includes? output "Title") "markdown content rendered")
        (is (str/includes? output "[1;36m") "header styled (cyan) at least once")
        (is (str/includes? output "✓") "tool result interleaved in the frame"))
      (emit {:type :message_update
             :message {:role :assistant :content [{:type :text :text "next turn"}]}})
      (is (str/includes? @(.-buf term) "next turn")
          "a fresh turn renders after segments reset"))))

(deftest ^:async tui-repl-survives-persistence-failure-test
  (testing "a law-gate throw from record-turn! warns and the REPL keeps running"
    (let [term (fake-terminal)
          inputs (atom ["hi" "/exit"])
          get-input (fn [_prompt]
                      (let [next (first @inputs)]
                        (swap! inputs rest)
                        (js/Promise.resolve next)))
          session (atom {:messages []})]
      (await (tui-repl/run-tui-repl {:system-prompt "sys" :messages [] :tools []}
                                    {:model {:id "m" :provider "p"}
                                     :convert-to-llm (fn [messages] messages)}
                                    (assistant-stream "Hello there")
                                    {:get-input get-input :term term :session session}))
      (let [output @(.-buf term)]
        (is (str/includes? output "Session persistence record-turn failed")
            "the persistence failure should be reported, not thrown")
        (is (str/includes? output "Hello there")
            "the reply should still render")
        (is (str/includes? output "Goodbye")
            "the REPL should accept the next input and exit cleanly")))))

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
