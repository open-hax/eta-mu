(ns open-hax.sol.infra.agent.turn-timeout-test
  (:require [cljs.test :refer [deftest is testing]]
            [open-hax.sol.infra.agent.turn :as turn]
            [open-hax.sol.shape.agent :as agent]))

(deftest ^:async hung-turn-is-aborted-at-timeout
  (testing "the timeout wins even when send-user-message! never settles"
    (let [aborted? (atom false)
          unsubscribed? (atom false)
          session (reify agent/IAgentSession
                    (streaming? [_] true)
                    (current-turn [_] nil)
                    (messages [_] nil)
                    (subscribe! [_ _handler]
                      (fn [] (reset! unsubscribed? true)))
                    (send-user-message! [_ _content]
                      (js/Promise. (fn [_resolve _reject])))
                    (follow-up! [_ _message] (js/Promise.resolve nil))
                    (steer! [_ _message] (js/Promise.resolve nil))
                    (set-thinking-level! [_ _level] nil)
                    (set-active-tools! [_ _tool-names] nil)
                    (abort! [_]
                      (reset! aborted? true)
                      (js/Promise.resolve nil)))
          error (try
                  (await (turn/send-user-message-with-timeout!
                          session "hello" 5
                          {:run-id "run"
                           :conversation-id "conversation"
                           :session-id "session"}))
                  nil
                  (catch :default err err))]
      (is (some? error))
      (is (re-find #"Agent turn timed out after 5ms" (.-message error)))
      (is @aborted?)
      (is @unsubscribed?))))

(deftest ^:async agent-end-does-not-beat-session-history-projection
  (testing "completion waits for send-user-message! after agent_end is emitted"
    (let [history (atom [])
          handler* (atom nil)
          session (reify agent/IAgentSession
                    (streaming? [_] true)
                    (current-turn [_] nil)
                    (messages [_] (seq @history))
                    (subscribe! [_ handler]
                      (reset! handler* handler)
                      (fn [] nil))
                    (send-user-message! [_ _content]
                      (@handler* {:type :agent_end})
                      (.then (js/Promise.resolve nil)
                             (fn [_]
                               (reset! history
                                       [{:role :assistant
                                         :content [{:type :text :text "ready"}]}]))))
                    (follow-up! [_ _message] (js/Promise.resolve nil))
                    (steer! [_ _message] (js/Promise.resolve nil))
                    (set-thinking-level! [_ _level] nil)
                    (set-active-tools! [_ _tool-names] nil)
                    (abort! [_] (js/Promise.resolve nil)))]
      (await (turn/send-user-message-with-timeout!
              session "hello" 100
              {:run-id "run"
               :conversation-id "conversation"
               :session-id "session"}))
      (is (= "ready" (-> @history first :content first :text))))))
