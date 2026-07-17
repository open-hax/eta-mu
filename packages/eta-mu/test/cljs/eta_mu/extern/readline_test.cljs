(ns eta-mu.extern.readline-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.extern.readline :as rl]
            ["node:stream" :as stream]))

(defn- make-handle
  "Create a handle over an in-memory input stream and a discarding output."
  []
  (let [input (stream/PassThrough.)
        output (stream/Writable. #js {:write (fn [_chunk _enc cb] (cb))})]
    {:input input :handle (rl/create-interface input output)}))

(deftest ^:async question-resolves-typed-line-test
  (testing "question resolves the typed line, not nil (close must not win the race)"
    (let [{:keys [input handle]} (make-handle)
          pending (rl/question handle "> ")]
      (.write input "hello\n")
      (is (= "hello" (await pending)))
      (rl/close! handle))))

(deftest ^:async question-preserves-typed-ahead-lines-test
  (testing "lines arriving while no question is pending are queued, not dropped"
    (let [{:keys [input handle]} (make-handle)]
      (.write input "first\nsecond\n")
      (is (= "first" (await (rl/question handle "> "))))
      (is (= "second" (await (rl/question handle "> "))))
      (rl/close! handle))))

(deftest ^:async question-resolves-nil-on-close-test
  (testing "question resolves nil when input ends before a line arrives"
    (let [{:keys [input handle]} (make-handle)
          pending (rl/question handle "> ")]
      (.end input)
      (is (nil? (await pending)))
      (is (nil? (await (rl/question handle "> ")))
          "questions after close resolve nil immediately"))))
