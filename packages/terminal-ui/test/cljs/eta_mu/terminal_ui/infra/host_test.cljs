(ns eta-mu.terminal-ui.infra.host-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.terminal-ui.extern.terminal :as terminal]
            [eta-mu.terminal-ui.infra.host :as host]))

(defn- mock-stdout []
  (let [buffer (atom "")
        listeners (atom {})]
    #js {:write (fn [data] (swap! buffer str data) true)
         :columns 80
         :rows 24
         :on (fn [event handler]
               (swap! listeners update event (fnil conj []) handler))
         :removeListener (fn [event handler]
                           (swap! listeners update event
                                  (fn [hs] (vec (remove #(identical? % handler) hs)))))
         :getBuffer (fn [] @buffer)
         :getListeners (fn [] @listeners)}))

(defn- mock-stdin []
  #js {:setRawMode (fn [_] nil)
       :isTTY true
       :setEncoding (fn [_] nil)
       :resume (fn [] nil)
       :pause (fn [] nil)
       :on (fn [_ _] nil)
       :removeListener (fn [_ _] nil)})

(defn- clear-line-count
  "Count `clear-line`'s ANSI escape (`ESC [ K`) in the recorded stdout buffer,
  so a diff-op count can be checked without asserting on exact escape
  sequences."
  [s]
  (count (re-seq #"\[K" s)))

(deftest diff-ops-test
  (testing "no ops when frames are identical"
    (is (= [] (host/diff-ops ["a" "b"] ["a" "b"]))))

  (testing "one op for a single changed row"
    (is (= [{:row 1 :text "changed"}]
           (host/diff-ops ["a" "b" "c"] ["a" "changed" "c"]))))

  (testing "op for a row appended past the previous frame's length"
    (is (= [{:row 2 :text "new"}]
           (host/diff-ops ["a" "b"] ["a" "b" "new"]))))

  (testing "clear op for a row removed from the previous frame"
    (is (= [{:row 1 :text ""}]
           (host/diff-ops ["a" "b"] ["a"])))))

(deftest render-minimal-diff-test
  (testing "a single-line change only clears/writes that one row"
    (let [stdout (mock-stdout)
          term (terminal/->ProcessTerminal (mock-stdin) stdout)
          state (host/new-state)]
      (host/render! state term ["assistant" "line one" "line two"])
      (let [after-first (clear-line-count (.getBuffer stdout))]
        (host/render! state term ["assistant" "line one (updated)" "line two"])
        (is (= 1 (- (clear-line-count (.getBuffer stdout)) after-first))
            "only the changed row should be cleared/rewritten")))))

(deftest render-resets-column-before-each-op-test
  (testing "writes a carriage return before clearing each changed row, so a
    shorter replacement line doesn't leave stale characters from a longer
    previous line at the start of the row"
    (let [stdout (mock-stdout)
          term (terminal/->ProcessTerminal (mock-stdin) stdout)
          state (host/new-state)]
      (host/render! state term ["a very long first line"])
      (let [before (.getBuffer stdout)]
        (host/render! state term ["short"])
        (let [written (subs (.getBuffer stdout) (count before))]
          (is (re-find #"\r.*\[K" written)
              "expects a carriage return before the clear-line escape"))))))

(deftest start-host-resize-forces-full-redraw-test
  (testing "start-host!'s resize handler forces the next render to rewrite every row"
    (let [stdout (mock-stdout)
          stdin (mock-stdin)
          term (terminal/->ProcessTerminal stdin stdout)
          state (host/new-state)
          frame ["a" "b" "c"]]
      (host/start-host! term state (fn [_]))
      (host/render! state term frame)
      (let [after-first (clear-line-count (.getBuffer stdout))
            resize-handlers (get (.getListeners stdout) "resize")]
        (is (= 1 (count resize-handlers)) "expects exactly one resize listener attached")
        ((first resize-handlers))
        (host/render! state term frame)
        (is (= 3 (- (clear-line-count (.getBuffer stdout)) after-first))
            "resize should force a full redraw of the unchanged frame"))
      (host/stop-host! term))))

(deftest render-resize-forces-full-redraw-test
  (testing "force-full-redraw! makes the next render rewrite every row"
    (let [stdout (mock-stdout)
          term (terminal/->ProcessTerminal (mock-stdin) stdout)
          state (host/new-state)
          frame ["a" "b" "c"]]
      (host/render! state term frame)
      (let [after-first (clear-line-count (.getBuffer stdout))]
        (host/force-full-redraw! state)
        (host/render! state term frame)
        (is (= 3 (- (clear-line-count (.getBuffer stdout)) after-first))
            "a forced full redraw should touch all 3 rows even though the frame is unchanged")))))
