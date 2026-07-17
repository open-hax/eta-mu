(ns eta-mu.terminal-ui.infra.input-editor-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.terminal-ui.extern.terminal :as terminal]
            [eta-mu.terminal-ui.infra.input-editor :as editor]))

(deftype FakeTerminal [buf on-input]
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
  (start [_ on-input-fn _on-resize] (reset! on-input on-input-fn))
  (stop [_] nil)
  (drain-input [_ _max-ms _idle-ms] (js/Promise.resolve nil)))

(defn- fake-terminal []
  (let [on-input (atom nil)]
    [(->FakeTerminal (atom "") on-input) on-input]))

(defn- feed!
  "Deliver key chunks to the running editor on the next tick, sequentially."
  [handler-atom chunks]
  (letfn [(step [cs]
            (when (seq cs)
              (js/setTimeout
               (fn []
                 (when-let [h @handler-atom]
                   (h (first cs)))
                 (step (rest cs)))
               0)))]
    (step chunks)))

(deftest ^:async input-editor-submit-test
  (testing "typed text plus enter submits the line"
    (let [[term handler] (fake-terminal)]
      (feed! handler ["hello" "\r"])
      (let [result (await (editor/ask term "> " {}))]
        (is (= "hello" (:text result)))))))

(deftest ^:async input-editor-cursor-editing-test
  (testing "left arrow + insert edits before submit"
    (let [[term handler] (fake-terminal)]
      (feed! handler ["helo" "[D" "l" "\r"])
      (let [result (await (editor/ask term "> " {}))]
        (is (= "hello" (:text result)))))))

(deftest ^:async input-editor-multi-line-test
  (testing "ctrl-j composes a multi-line buffer"
    (let [[term handler] (fake-terminal)]
      (feed! handler ["ab" "\n" "cd" "\r"])
      (let [result (await (editor/ask term "> " {}))]
        (is (= "ab\ncd" (:text result)))))))

(deftest ^:async input-editor-trailing-backslash-test
  (testing "a trailing backslash continues the line instead of submitting"
    (let [[term handler] (fake-terminal)]
      (feed! handler ["ab\\" "\r" "cd" "\r"])
      (let [result (await (editor/ask term "> " {}))]
        (is (= "ab\ncd" (:text result)))))))

(deftest ^:async input-editor-history-test
  (testing "up-arrow recalls the previous submission across calls"
    (let [[term handler] (fake-terminal)
          first-result (atom nil)]
      (feed! handler ["first" "\r"])
      (let [r1 (await (editor/ask term "> " {}))]
        (reset! first-result r1)
        (feed! handler ["\u001b[A" "\r"])
        (let [r2 (await (editor/ask term "> " {:history (:history r1)}))]
          (is (= "first" (:text r2))))))))

(deftest ^:async input-editor-abort-test
  (testing "ctrl-c resolves nil"
    (let [[term handler] (fake-terminal)]
      (feed! handler ["partial" "\u0003"])
      (let [result (await (editor/ask term "> " {}))]
        (is (nil? result))))))
