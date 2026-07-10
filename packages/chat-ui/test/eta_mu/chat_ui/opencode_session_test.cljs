(ns eta-mu.chat-ui.opencode-session-test
  (:require [cljs.test :refer [deftest is]]
            [eta-mu.chat-ui.opencode-session :as opencode]
            [eta-mu.chat-ui.protocol :as proto]))

(defn- mock-fetch [response]
  (fn [_url _opts]
    (js/Promise.resolve #js {:ok true
                             :status 200
                             :statusText "OK"
                             :json (fn [] (js/Promise.resolve (clj->js response)))})))

(deftest ^:async opencode-session-emits-token-and-done
  (let [original-fetch js/fetch
        response {:id "test"
                  :object "chat.completion"
                  :created 0
                  :model "glm-5"
                  :choices [{:index 0
                             :message {:role "assistant"
                                       :content "Hello from opencode"}
                             :finish_reason "stop"}]
                  :usage {:prompt_tokens 0 :completion_tokens 0 :total_tokens 0}}]
    (set! js/fetch (mock-fetch response))
    (try
      (let [session (opencode/create-opencode-session {:chunk-delay-ms 0})
            events (atom [])
            unsub (proto/subscribe session #(swap! events conj %))]
        (await (proto/send-message session "hello"))
        (await (js/Promise. (fn [resolve _] (js/setTimeout resolve 100))))
        (unsub)
        (let [token-events (filter #(= "token" (:type %)) @events)
              done-events (filter #(= "done" (:type %)) @events)]
          (is (= "Hello from opencode" (apply str (map :text token-events))))
          (is (= 1 (count done-events))))
        (let [history (await (proto/history session))]
          (is (= 2 (count history)))
          (is (= "user" (:role (first history))))
          (is (= "hello" (:content (first history))))
          (is (= "assistant" (:role (second history))))
          (is (= "Hello from opencode" (:content (second history)))))
        (proto/close session))
      (finally
        (set! js/fetch original-fetch)))))