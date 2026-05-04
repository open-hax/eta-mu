(ns eta-mu.extensions.opmf-contract-gate-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.contracts.core :as contracts]
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

(def minimal-contract
  {:name "test-five-section-response"
   :version "test"
   :sections [{:id "signal" :heading "Signal" :required true :order 1}
              {:id "evidence" :heading "Evidence" :required true :order 2}
              {:id "frames" :heading "Frames" :required true :order 3}
              {:id "countermoves" :heading "Countermoves" :required true :order 4}
              {:id "next" :heading "Next" :required true :order 5}]
   :sections-by-id {"signal" {:id "signal" :heading "Signal"}
                    "evidence" {:id "evidence" :heading "Evidence"}
                    "frames" {:id "frames" :heading "Frames"}
                    "countermoves" {:id "countermoves" :heading "Countermoves"}
                    "next" {:id "next" :heading "Next"}}
   :sections-by-heading {"Signal" {:id "signal" :heading "Signal"}
                         "Evidence" {:id "evidence" :heading "Evidence"}
                         "Frames" {:id "frames" :heading "Frames"}
                         "Countermoves" {:id "countermoves" :heading "Countermoves"}
                         "Next" {:id "next" :heading "Next"}}
   :rules [{:id "rule/frames-cardinality" :section-id "frames" :min 2 :max 3}
           {:id "rule/next-exactly-one-action" :section-id "next" :exactly 1}]})

(deftest markdown-section-extraction-test
  (testing "accepts CommonMark h2 closing hashes and ignores fenced headings"
    (let [doc (contracts/extract-markdown-sections
               "  ## Signal ##\nOne\n\n```markdown\n## Not a real section\n```\n\n## Evidence\nTwo")]
      (is (= ["Signal" "Evidence"] (mapv :heading (:sections doc))))))
  (testing "counts multiline list items semantically"
    (is (= 3 (contracts/count-semantic-items
              {:heading "Frames"
               :content "- one\n- two\n- three"}))))
  (testing "does not count fenced code lines as additional Next actions"
    (is (= 1 (contracts/count-semantic-items
              {:heading "Next"
               :content "- Patch the config:\n\n```yaml\nFASTER_WHISPER_DEVICE: cpu\nVOICE_GATEWAY_TTS_DEVICE: cpu\n```"}))))
  (testing "counts separated prose blocks as separate semantic items"
    (is (= 2 (contracts/count-semantic-items
              {:heading "Next"
               :content "Patch the config.\n\nThen restart the service."}))))
  (testing "does not treat h3 headings as contract sections"
    (let [doc (contracts/extract-markdown-sections
               "## Signal\nText\n\n### Detail\nStill signal\n\n## Evidence\nText")]
      (is (= ["Signal" "Evidence"] (mapv :heading (:sections doc)))))))

(deftest validation-guidance-test
  (testing "two explicit frame bullets satisfy the deterministic checker"
    (is (true? (:ok (contracts/validate-markdown-response
                     minimal-contract
                     "## Signal\nOne\n\n## Evidence\n- A\n\n## Frames\n- Frame 1: local snapshot complete.\n- Frame 2: remote push blocked.\n\n## Countermoves\n- Do not rewrite history.\n\n## Next\n- Resolve push protection.")))))
  (testing "frame cardinality repair explains the deterministic list-item format"
    (let [result (contracts/validate-markdown-response
                  minimal-contract
                  "## Signal\nOne\n\n## Evidence\n- A\n\n## Frames\nOne prose line only.\n\n## Countermoves\n- Do not rewrite history.\n\n## Next\n- Resolve push protection.")
          prompt (contracts/compile-repair-prompt minimal-contract result)]
      (is (false? (:ok result)))
      (is (re-find #"checker counted 1" prompt))
      (is (re-find #"use 2–3 markdown bullet items" prompt)))))

(deftest huge-counted-section-preflight-test
  (testing "detects giant counted lists before full validation or repair-prompt compilation"
    (let [huge-next (str "## Signal\nS\n\n## Evidence\nE\n\n## Frames\n- A\n- B\n\n## Countermoves\nC\n\n## Next\n"
                         (apply str (map #(str "- item " % "\n") (range 100))))
          result (gate/preflight-huge-counted-section minimal-contract huge-next)]
      (is (some? result))
      (is (= "preflight" (get-in result [:report :stage])))
      (is (= "rule/next-exactly-one-action" (get-in result [:report :failures 0 :rule-id])))
      (is (= 26 (get-in result [:report :failures 0 :actual :count]))))))

(deftest auto-repair-delivery-mode-test
  (testing "auto-repair is queued for the agent_idle hook instead of injected as steering from agent_end"
    (let [sent (atom [])
          pi #js {:sendUserMessage (fn [message options]
                                     (swap! sent conj {:message message
                                                       :deliver-as (when options (aget options "deliverAs"))}))}
          ctx #js {:hasUI false}
          state (gate/get-state)
          _ (aset state "config" #js {:autoRepair true
                                      :repairDelayMs 0
                                      :maxSessionTurns 10})
          _ (aset state "pendingRepair" nil)
          _ (aset state "repairCounts" #js {})
          _ (aset state "sessionRepairCount" 0)
          result #js {:ok false
                      :repairInfo #js {:attempt 0}
                      :repairPrompt "Repair this response"
                      :assistant #js {:id "assistant-1"}
                      :contract {:repair-max-retries 2}}]
      (gate/handle-validation-result pi ctx state result #js [])
      (is (= 0 (count @sent)))
      (is (some? (aget state "pendingRepair")))
      (gate/handle-agent-idle pi ctx #js {})
      (is (= 1 (count @sent)))
      (is (nil? (:deliver-as (first @sent))))
      (is (nil? (aget state "pendingRepair")))
      (is (re-find #"^\[\[eta-mu-opmf-contract-gate repair 1/2\]\]"
                   (:message (first @sent)))))))

(deftest auto-repair-loop-guard-test
  (testing "same failed assistant cannot be repaired indefinitely when repair sentinel parsing is unavailable"
    (let [notices (atom [])
          pi #js {:sendUserMessage (fn [_message])}
          ctx #js {:hasUI true
                   :ui #js {:notify (fn [message level]
                                      (swap! notices conj {:message message :level level}))
                            :setStatus (fn [& _args])}}
          state (gate/get-state)
          assistant #js {:id "assistant-loop"
                         :content "## Signal\nS\n\n## Evidence\nE\n\n## Frames\n- A\n- B\n\n## Countermoves\nC\n\n## Next\n- one\n- two\n- three"}
          result #js {:ok false
                      :repairInfo nil
                      :repairPrompt "Section `Next` must have exactly 1 semantic item(s); checker counted 3"
                      :assistant assistant
                      :report {:failures [{:rule-id "rule/next-exactly-one-action"}]}
                      :contract {:repair-max-retries 2}}]
      (aset state "config" #js {:autoRepair true :maxSessionTurns 10})
      (aset state "pendingRepair" nil)
      (aset state "repairCounts" #js {})
      (aset state "sessionRepairCount" 0)

      (gate/handle-validation-result pi ctx state result #js [])
      (is (= 1 (aget (aget state "pendingRepair") "attempt")))

      ;; Duplicate agent_end/handler delivery for the same assistant should not
      ;; advance the repair counter while a repair is already queued.
      (gate/handle-validation-result pi ctx state result #js [])
      (is (= 1 (aget (aget state "pendingRepair") "attempt")))

      ;; If the queued repair disappears or fails to enter history, repeated
      ;; validation is still capped by the out-of-band per-assistant counter.
      (aset state "pendingRepair" nil)
      (gate/handle-validation-result pi ctx state result #js [])
      (is (= 2 (aget (aget state "pendingRepair") "attempt")))

      (aset state "pendingRepair" nil)
      (gate/handle-validation-result pi ctx state result #js [])
      (is (nil? (aget state "pendingRepair")))
      (is (some #(re-find #"eta-mu-opmf-contract-gate failed" (:message %)) @notices)))))

(deftest huge-list-auto-repair-skip-test
  (testing "pathologically large counted sections fail closed instead of starting repair loops"
    (let [notices (atom [])
          pi #js {:sendUserMessage (fn [_message])}
          ctx #js {:hasUI true
                   :ui #js {:notify (fn [message level]
                                      (swap! notices conj {:message message :level level}))
                            :setStatus (fn [& _args])}}
          state (gate/get-state)
          result #js {:ok false
                      :repairInfo nil
                      :repairPrompt nil
                      :assistant #js {:id "assistant-huge"
                                      :content "## Next\n- many items"}
                      :report {:failures [{:rule-id "rule/next-exactly-one-action"
                                           :actual {:count 200}}]}
                      :contract {:repair-max-retries 2}}]
      (aset state "config" #js {:autoRepair true :maxSessionTurns 10})
      (aset state "pendingRepair" nil)
      (aset state "repairCounts" #js {})
      (aset state "sessionRepairCount" 0)

      (gate/handle-validation-result pi ctx state result #js [])
      (is (nil? (aget state "pendingRepair")))
      (is (= 0 (aget state "sessionRepairCount")))
      (is (some #(re-find #"full validation/auto-repair skipped" (:message %)) @notices)))))
