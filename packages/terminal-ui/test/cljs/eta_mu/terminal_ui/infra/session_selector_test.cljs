(ns eta-mu.terminal-ui.infra.session-selector-test
  (:require [clojure.string :as str]
            [cljs.test :refer [deftest is testing]]
            [eta-mu.terminal-ui.extern.terminal :as terminal]
            [eta-mu.terminal-ui.infra.session-selector :as selector]))

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

(def ^:private sample-sessions
  [{:session-id "aaaa1111-0000" :updated-at "2026-07-16T10:00:00Z" :model "mock-model"
    :cwd "/tmp" :message-count 4 :preview "remember-alpha please"}
   {:session-id "bbbb2222-1111" :updated-at "2026-07-16T11:00:00Z" :model "mock-model"
    :cwd "/tmp" :message-count 2 :preview "deploy the thing"}])

(defn- feed! [handler-atom chunks]
  (letfn [(step [cs]
            (when (seq cs)
              (js/setTimeout
               (fn []
                 (when-let [h @handler-atom]
                   (h (first cs)))
                 (step (rest cs)))
               0)))]
    (step chunks)))

(deftest filter-sessions-test
  (testing "fuzzy filter narrows by preview content and blank query keeps all"
    (is (= 2 (count (selector/filter-sessions "" sample-sessions))))
    (is (= ["bbbb2222-1111"]
           (map :session-id (selector/filter-sessions "deploy" sample-sessions))))
    (is (= [] (selector/filter-sessions "zzz-nope" sample-sessions)))))

(deftest ^:async selector-renders-and-selects-test
  (testing "down-arrow + enter selects the second session"
    (let [[term handler] (fake-terminal)]
      (feed! handler ["\u001b[B" "\r"])
      (let [chosen (await (selector/choose term sample-sessions))]
        (is (= "bbbb2222-1111" (:session-id chosen)))
        (is (str/includes? @(.-buf term) "resume a session")
            "overlay rendered the hint row")))))

(deftest ^:async selector-type-to-filter-test
  (testing "typing filters the list; enter selects the match"
    (let [[term handler] (fake-terminal)]
      (feed! handler ["deploy" "\r"])
      (let [chosen (await (selector/choose term sample-sessions))]
        (is (= "bbbb2222-1111" (:session-id chosen)))))))

(deftest ^:async selector-dismiss-test
  (testing "esc dismisses to start fresh"
    (let [[term handler] (fake-terminal)]
      (feed! handler ["\u001b"])
      (let [chosen (await (selector/choose term sample-sessions))]
        (is (nil? chosen))))))
