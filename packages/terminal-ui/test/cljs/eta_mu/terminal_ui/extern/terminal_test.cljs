(ns eta-mu.terminal-ui.extern.terminal-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.terminal-ui.extern.terminal :as terminal]))

(defn- mock-stdout
  "Create a mock stdout object that records writes and exposes columns/rows."  
  []
  (let [buffer (atom "")
        listeners (atom {})]
    #js {:write #(swap! buffer str %)
         :columns 80
         :rows 24
         :on (fn [event handler]
               (swap! listeners update event (fnil conj []) handler))
         :removeListener (fn [event handler]
                           (swap! listeners update event
                                  (fn [hs] (vec (remove #(identical? % handler) hs)))))
         :getBuffer (fn [] @buffer)
         :clearBuffer (fn [] (reset! buffer ""))
         :getListeners (fn [] @listeners)}))

(defn- mock-stdin
  "Create a mock stdin object with EventEmitter-like methods."  
  []
  (let [listeners (atom {})
         raw-mode? (atom false)
         encoding (atom nil)]
    #js {:setRawMode (fn [flag] (reset! raw-mode? flag))
         :isTTY true
         :setEncoding (fn [enc] (reset! encoding enc))
         :getEncoding (fn [] @encoding)
         :getRawMode (fn [] @raw-mode?)
         :getListeners (fn [] @listeners)
         :resume (fn [] nil)
         :pause (fn [] nil)
         :on (fn [event handler]
               (swap! listeners update event (fnil conj []) handler))
         :removeListener (fn [event handler]
                           (swap! listeners update event
                                  (fn [hs] (vec (remove #(identical? % handler) hs)))))
         :emit (fn [event data]
                 (doseq [handler (get @listeners event [])]
                   (handler data)))}))

(deftest write-test
  (testing "write appends data to stdout"
    (let [stdin (mock-stdin)
          stdout (mock-stdout)
          term (terminal/->ProcessTerminal stdin stdout)]
      (terminal/write term "hello")
      (is (= "hello" ((.-getBuffer stdout)))))))

(deftest cursor-test
  (testing "hide and show cursor emit ANSI sequences"
    (let [stdin (mock-stdin)
          stdout (mock-stdout)
          term (terminal/->ProcessTerminal stdin stdout)]
      (terminal/hide-cursor term)
      (terminal/show-cursor term)
      (is (= "\u001b[?25l\u001b[?25h" ((.-getBuffer stdout)))))))

(deftest clear-screen-test
  (testing "clear screen emits ANSI sequence"
    (let [stdin (mock-stdin)
          stdout (mock-stdout)
          term (terminal/->ProcessTerminal stdin stdout)]
      (terminal/clear-screen term)
      (is (= "\u001b[2J\u001b[H" ((.-getBuffer stdout)))))))

(deftest set-title-test
  (testing "set title emits OSC sequence"
    (let [stdin (mock-stdin)
          stdout (mock-stdout)
          term (terminal/->ProcessTerminal stdin stdout)]
      (terminal/set-title term "agent")
      (is (= "\u001b]0;agent\u0007" ((.-getBuffer stdout)))))))

(deftest dimensions-test
  (testing "columns and rows read from stdout"
    (let [stdin (mock-stdin)
          stdout (mock-stdout)
          term (terminal/->ProcessTerminal stdin stdout)]
      (is (= 80 (terminal/columns term)))
      (is (= 24 (terminal/rows term))))))

(deftest start-stop-test
  (testing "start enables raw mode and attaches handlers; stop reverses"
    (let [stdin (mock-stdin)
          stdout (mock-stdout)
          term (terminal/->ProcessTerminal stdin stdout)
          input-handler (fn [_] nil)
          resize-handler (fn [] nil)]
      (terminal/start term input-handler resize-handler)
      (is (true? ((.-getRawMode stdin))))
      (is (= "utf8" ((.-getEncoding stdin))))
      (is (= 1 (count (get ((.-getListeners stdin)) "data"))))
      (is (= 1 (count (get ((.-getListeners stdout)) "resize"))))
      (terminal/stop term)
      (is (false? ((.-getRawMode stdin))))
      (is (= 0 (count (get ((.-getListeners stdin)) "data"))))
      (is (= 0 (count (get ((.-getListeners stdout)) "resize")))))))

(deftest ^:async drain-input-test
  (testing "drain-input resolves after idle period"
    (let [stdin (mock-stdin)
          stdout (mock-stdout)
          term (terminal/->ProcessTerminal stdin stdout)]
      (await (terminal/drain-input term 100 10)))))