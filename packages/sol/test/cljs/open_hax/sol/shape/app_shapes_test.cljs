(ns open-hax.sol.shape.app-shapes-test
  (:require [cljs.test :refer [deftest is]]
            [open-hax.sol.shape.app-shapes :as shapes]))

;; ── normalize-chat-body ─────────────────────────────────────────────────────

(deftest normalize-chat-body-basic
  (let [body {:message "hello"}
        result (shapes/normalize-chat-body body)]
    (is (= "hello" (:message result)))
    (is (= "direct" (:mode result)))
    (is (nil? (:conversation-id result)))
    (is (nil? (:session-id result)))))

(deftest normalize-chat-body-extracts-all-fields
  (let [body {:message "hi"
              :conversationId "conv-1"
              :sessionId "sess-1"
              :runId "run-1"
              :model "gpt-5"
              :thinkingLevel "high"
              :mode "rag"}
        result (shapes/normalize-chat-body body)]
    (is (= "conv-1" (:conversation-id result)))
    (is (= "sess-1" (:session-id result)))
    (is (= "run-1" (:run-id result)))
    (is (= "gpt-5" (:model result)))
    (is (= "high" (:thinking-level result)))
    (is (= "rag" (:mode result)))))

(deftest normalize-chat-body-accepts-kebab-case-keys
  (let [body {"message" "hi"
              "conversation-id" "conv-2"
              "session-id" "sess-2"
              "run-id" "run-2"}
        result (shapes/normalize-chat-body body)]
    (is (= "conv-2" (:conversation-id result)))
    (is (= "sess-2" (:session-id result)))
    (is (= "run-2" (:run-id result)))))

(deftest normalize-chat-body-accepts-snake-case-keys
  (let [body {"message" "hi"
              "conversation_id" "conv-3"
              "session_id" "sess-3"
              "run_id" "run-3"}
        result (shapes/normalize-chat-body body)]
    (is (= "conv-3" (:conversation-id result)))
    (is (= "sess-3" (:session-id result)))
    (is (= "run-3" (:run-id result)))))

(deftest normalize-chat-body-defaults-message-to-empty
  (let [result (shapes/normalize-chat-body {})]
    (is (= "" (:message result)))))

(deftest normalize-chat-body-defaults-mode-to-direct
  (let [result (shapes/normalize-chat-body {:message "x"})]
    (is (= "direct" (:mode result)))))

(deftest normalize-chat-body-normalizes-agent-spec
  (let [body {:message "hi"
              :agentSpec {:contractId "agent-1"
                          :model "gpt-5"
                          :systemPrompt "you are helpful"}}
        result (shapes/normalize-chat-body body)]
    (is (= "agent-1" (get-in result [:agent-spec :contract-id])))
    (is (= "gpt-5" (get-in result [:agent-spec :model])))
    (is (= "you are helpful" (get-in result [:agent-spec :system-prompt])))))

(deftest normalize-chat-body-agent-spec-kebab-case
  (let [body {:message "hi"
              :agent-spec {:contract-id "a-1"
                           :system-prompt "test"}}
        result (shapes/normalize-chat-body body)]
    (is (= "a-1" (get-in result [:agent-spec :contract-id])))
    (is (= "test" (get-in result [:agent-spec :system-prompt])))))

(deftest normalize-chat-body-content-parts-from-string
  (let [body {:message "hi"
              :contentParts [{:type "text" :text "part 1"}
                             {:type "image_url" :url "http://img.png"}]}
        result (shapes/normalize-chat-body body)]
    (is (= 2 (count (:content-parts result))))
    (is (= :text (:type (first (:content-parts result)))))
    (is (= "part 1" (:text (first (:content-parts result)))))
    (is (= :image (:type (second (:content-parts result)))))))

(deftest normalize-chat-body-nil-agent-spec
  (let [result (shapes/normalize-chat-body {:message "hi"})]
    (is (nil? (:agent-spec result)))))

;; ── normalize-control-body ──────────────────────────────────────────────────

(deftest normalize-control-body-basic
  (let [body {:message "stop"}
        result (shapes/normalize-control-body body)]
    (is (= "stop" (:message result)))
    (is (= {} (:metadata result)))))

(deftest normalize-control-body-extracts-fields
  (let [body {:message "steer"
              :conversationId "c1"
              :sessionId "s1"
              :runId "r1"
              :actorId "a1"
              :metadata {:key "val"}}
        result (shapes/normalize-control-body body)]
    (is (= "c1" (:conversation-id result)))
    (is (= "s1" (:session-id result)))
    (is (= "r1" (:run-id result)))
    (is (= "a1" (:actor-id result)))
    (is (= {:key "val"} (:metadata result)))))

(deftest normalize-control-body-accepts-snake-case
  (let [body {"message" "x"
              "conversation_id" "c2"
              "session_id" "s2"
              "run_id" "r2"
              "actor_id" "a2"}
        result (shapes/normalize-control-body body)]
    (is (= "c2" (:conversation-id result)))
    (is (= "s2" (:session-id result)))
    (is (= "r2" (:run-id result)))
    (is (= "a2" (:actor-id result)))))

(deftest normalize-control-body-defaults-message
  (let [result (shapes/normalize-control-body {})]
    (is (= "" (:message result)))))

(deftest normalize-control-body-trims-actor-id
  (let [result (shapes/normalize-control-body {:actorId "  user-1  "})]
    (is (= "user-1" (:actor-id result)))))

(deftest normalize-control-body-nil-actor-id-for-blank
  (let [result (shapes/normalize-control-body {:actorId "  "})]
    (is (nil? (:actor-id result)))))
