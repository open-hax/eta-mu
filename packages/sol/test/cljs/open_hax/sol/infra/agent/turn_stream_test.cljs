(ns open-hax.sol.infra.agent.turn-stream-test
  "Coverage for the agent-loop realtime streaming wiring.

   Regression guard: a queued run must broadcast assistant token deltas on the
   `tokens` channel and lifecycle events (run_completed/run_failed) on the
   `events` channel, scoped to the run's conversation. A prior implementation
   only appended lifecycle events to the run ledger and dropped token deltas
   entirely, so the board chat never showed a reply."
  (:require [cljs.test :refer [deftest testing is use-fixtures]]
            [open-hax.sol.domain.realtime :as realtime]
            [open-hax.sol.infra.agent.turn :as turn]))

(def ^:private scope {:run-id "r1" :conversation-id "c1" :session-id "s1"})

(defn- capturing-client
  "Register a fake WS client and return an atom that collects the parsed
   ws-envelopes it receives. clj->js/JSON round-trips just like a real send."
  [session-id conversation-id]
  (let [received (atom [])
        socket #js {:readyState 1
                    :send (fn [s] (swap! received conj (js->clj (js/JSON.parse s) :keywordize-keys true)))}]
    (swap! realtime/ws-clients* assoc (str (gensym "client"))
           #js {:socket socket :sessionId session-id :conversationId conversation-id})
    received))

(use-fixtures :each
  {:before (fn [] (reset! realtime/ws-clients* {}))
   :after  (fn [] (reset! realtime/ws-clients* {}))})

(defn- text-delta-event
  "A run-loop :message_update event as eta-mu.turn-processor.infra.loop emits
   it: the raw :assistant-message-event is the openai-extern JS envelope whose
   :partial is a CLJS assistant message carrying the cumulative text-so-far."
  [text-so-far]
  (let [partial {:role :assistant :content [{:type :text :text text-so-far}]}]
    {:type :message_update
     :message partial
     :assistant-message-event #js {:type "text_delta" :partial partial}}))

(defn- message-end-event
  "A run-loop :message_end event carrying the final CLJS assistant message."
  [content]
  {:type :message_end
   :message {:role :assistant :content content}})

(defn- tokens-from [received]
  (->> @received
       (filter #(= "tokens" (:channel %)))
       (map #(get-in % [:payload :token]))))

(deftest streams-incremental-text-deltas
  (testing "incremental provider deltas are forwarded verbatim as assistant_message tokens"
    (let [received (capturing-client "s1" "c1")
          seen* (atom "")]
      (turn/stream-message-update! scope seen* (text-delta-event "po"))
      (turn/stream-message-update! scope seen* (text-delta-event "ng"))
      (is (= ["po" "ng"] (tokens-from received)))
      (is (every? #(= "assistant_message" (get-in % [:payload :kind]))
                  (filter #(= "tokens" (:channel %)) @received)))
      (is (every? #(= "r1" (get-in % [:payload :run_id]))
                  (filter #(= "tokens" (:channel %)) @received))))))

(deftest streams-cumulative-text-deltas-as-suffix
  (testing "providers that resend the full message-so-far only emit the new suffix"
    (let [received (capturing-client "s1" "c1")
          seen* (atom "")]
      (turn/stream-message-update! scope seen* (text-delta-event "po"))
      (turn/stream-message-update! scope seen* (text-delta-event "pong"))
      (is (= ["po" "ng"] (tokens-from received))))))

(deftest message-end-flushes-untokenized-text
  (testing "a terminal message with no prior deltas is flushed as one token"
    (let [received (capturing-client "s1" "c1")
          seen* (atom "")]
      (turn/stream-message-end! scope seen* (message-end-event "pong"))
      (is (= ["pong"] (tokens-from received))))))

(deftest message-end-does-not-duplicate-streamed-text
  (testing "message_end only flushes the tail not already streamed"
    (let [received (capturing-client "s1" "c1")
          seen* (atom "")]
      (turn/stream-message-update! scope seen* (text-delta-event "po"))
      (turn/stream-message-end! scope seen* (message-end-event "pong"))
      (is (= ["po" "ng"] (tokens-from received))))))

(deftest broadcasts-run-completed-as-typed-event
  (testing "lifecycle events reach the events channel keyed by :type (board contract)"
    (let [received (capturing-client "s1" "c1")]
      (turn/broadcast-run-event! "r1" "c1" "s1" "run_completed" {:answer "pong"})
      (let [env (first (filter #(= "events" (:channel %)) @received))]
        (is (some? env))
        (is (= "run_completed" (get-in env [:payload :type])))
        (is (= "c1" (get-in env [:payload :conversation_id])))
        (is (= "r1" (get-in env [:payload :run_id])))))))

(deftest broadcasts-are-scoped-by-conversation
  (testing "a client on a different conversation receives neither tokens nor events"
    (let [other (capturing-client "s2" "other-convo")
          seen* (atom "")]
      (turn/stream-message-update! scope seen* (text-delta-event "po"))
      (turn/broadcast-run-event! "r1" "c1" "s1" "run_completed" {:answer "pong"})
      (is (empty? @other)))))
