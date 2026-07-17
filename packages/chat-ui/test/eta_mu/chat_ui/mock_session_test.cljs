(ns eta-mu.chat-ui.mock-session-test
  (:require [cljs.test :refer [deftest is]]
            [eta-mu.chat-ui.mock-session :as mock]
            [eta-mu.chat-ui.protocol :as proto]))

(deftest ^:async mock-session-emits-token-and-done
  (let [session (mock/create-mock-session)
        events (atom [])
        unsub (proto/subscribe session #(swap! events conj %))]
    (await (proto/send-message session "hello"))
    (await (js/Promise. (fn [resolve _] (js/setTimeout resolve 600))))
    (unsub)
    (let [token-events (filter #(= "token" (:type %)) @events)]
      (is (= 1 (count token-events)))
      (is (string? (:text (first token-events)))))
    (is (some #(= "done" (:type %)) @events))
    (proto/close session)))

(deftest ^:async mock-session-abort-resolves-promise
  (let [session (mock/create-mock-session {:delay 1000})
        events (atom [])
        unsub (proto/subscribe session #(swap! events conj %))]
    (let [p (proto/send-message session "hello")]
      (proto/abort session)
      (let [result (await p)]
        (is (= false (:ok result)))
        (is (= true (:aborted result)))))
    (await (js/Promise. (fn [resolve _] (js/setTimeout resolve 100))))
    (unsub)
    (is (not (some #(= "done" (:type %)) @events)))
    (proto/close session)))
