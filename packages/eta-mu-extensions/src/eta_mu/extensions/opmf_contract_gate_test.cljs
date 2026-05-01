(ns eta-mu.extensions.opmf-contract-gate-test
  (:require [cljs.test :refer [async deftest is testing]]
            [eta-mu.extensions.opmf-contract-gate :as gate]))

(deftest parse-repair-attempt-test
  (testing "parses the current eta-mu repair sentinel"
    (is (= {:attempt 2 :max 3}
           (gate/parse-repair-attempt
            "[[eta-mu-opmf-contract-gate repair 2/3]]\nrepair prompt"))))
  (testing "parses the legacy short repair sentinel"
    (is (= {:attempt 1 :max 4}
           (gate/parse-repair-attempt
            "[[output-contract-gate repair 1/4]]\nrepair prompt"))))
  (testing "parses the accidental historical eta-mu output-contract sentinel"
    (is (= {:attempt 3 :max 5}
           (gate/parse-repair-attempt
            "[[eta-mu-opmf-output-contract-gate repair 3/5]]\nrepair prompt"))))
  (testing "rejects non-repair user content"
    (is (nil? (gate/parse-repair-attempt "normal prompt")))))

(deftest stale-context-message-test
  (testing "detects eta-mu stale context guard messages"
    (is (true? (gate/stale-context-message?
                "This extension ctx is stale after session replacement or reload.")))
    (is (true? (gate/stale-context-message?
                "Do not use a captured pi or command ctx after ctx.reload()."))))
  (testing "does not treat unrelated queue failures as stale context"
    (is (false? (gate/stale-context-message? "network unavailable")))
    (is (nil? (gate/stale-context-message? nil)))))

(deftest notify-repair-queue-error-test
  (testing "stale context errors are downgraded to repair skip notices"
    (let [notices (atom [])
          ctx #js {:hasUI true
                   :ui #js {:notify (fn [message level]
                                      (swap! notices conj {:message message :level level}))}}]
      (gate/notify-repair-queue-error
       ctx
       #js {:message "This extension ctx is stale after session replacement or reload. Do not use a captured pi or command ctx."})
      (is (= [{:message "eta-mu-opmf-contract-gate skipped auto-repair because the session was replaced or extensions reloaded"
               :level "warn"}]
             @notices))))
  (testing "non-stale errors keep the queue failure diagnostic"
    (let [notices (atom [])
          ctx #js {:hasUI true
                   :ui #js {:notify (fn [message level]
                                      (swap! notices conj {:message message :level level}))}}]
      (gate/notify-repair-queue-error ctx #js {:message "boom"})
      (is (= [{:message "eta-mu-opmf-contract-gate repair queue failed: boom"
               :level "warn"}]
             @notices)))))

(deftest auto-repair-delivery-mode-test
  (testing "auto-repair is directly injected after agent_end instead of queued as steering"
    (async done
      (let [sent (atom [])
            pi #js {:sendUserMessage (fn [message options]
                                       (swap! sent conj {:message message
                                                         :deliver-as (when options (aget options "deliverAs"))}))}
            ctx #js {:hasUI false}
            state #js {:config #js {:autoRepair true
                                    :repairDelayMs 0}}
            result #js {:ok false
                        :repairInfo #js {:attempt 0}
                        :repairPrompt "Repair this response"
                        :assistant #js {:id "assistant-1"}
                        :contract {:repair-max-retries 2}}]
        (gate/handle-validation-result pi ctx state result #js [])
        (js/setTimeout
          (fn []
            (is (= 1 (count @sent)))
            (is (nil? (:deliver-as (first @sent))))
            (is (re-find #"^\[\[eta-mu-opmf-contract-gate repair 1/2\]\]"
                         (:message (first @sent))))
            (done))
          10)))))
