(ns open-hax.katamorph.agent.reasoning-test
  (:require [cljs.test :refer [deftest testing is]]
            [katamorph.agent.reasoning :as r]))

(deftest split-think-tags-with-reasoning
  (testing "Extracts reasoning from <think>...</think> block"
    (let [result (r/split-think-tags "<think>Let me think about this.</think>The answer is 42.")]
      (is (= "Let me think about this." (:reasoning result)))
      (is (= "The answer is 42." (:answer result)))
      (is (true? (:hadThinkTags result))))))

(deftest split-think-tags-no-tags
  (testing "Returns full text as answer when no think tags"
    (let [result (r/split-think-tags "Just a plain response.")]
      (is (= "" (:reasoning result)))
      (is (= "Just a plain response." (:answer result)))
      (is (false? (:hadThinkTags result))))))

(deftest split-think-tags-nil-input
  (testing "Handles nil input gracefully"
    (let [result (r/split-think-tags nil)]
      (is (= "" (:reasoning result)))
      (is (= "" (:answer result)))
      (is (false? (:hadThinkTags result))))))

(deftest split-think-tags-only-reasoning
  (testing "Think tags with no content after"
    (let [result (r/split-think-tags "<think>reasoning only</think>")]
      (is (= "reasoning only" (:reasoning result)))
      (is (= "" (:answer result)))
      (is (true? (:hadThinkTags result))))))

(deftest split-think-tags-late-position
  (testing "Think tags past position 64 are not extracted"
    (let [prefix (apply str (repeat 70 "a"))
          result (r/split-think-tags (str prefix "<think>late think</think>answer"))]
      (is (= "" (:reasoning result)))
      (is (false? (:hadThinkTags result))))))

(deftest route-think-delta-off-mode
  (testing "In :off mode, text without think tags emits as agent_message"
    (let [result (r/route-think-delta {:mode :off :delta "Hello"})]
      (is (= :off (:mode result)))
      (is (= [{:kind :agent_message :delta "Hello"}] (:emissions result))))))

(deftest route-think-delta-off-to-thinking
  (testing "In :off mode, opening think tag transitions to :thinking"
    (let [result (r/route-think-delta {:mode :off :last-assistant-text "" :delta "<think>reasoning"})]
      (is (= :thinking (:mode result)))
      (is (= [{:kind :reasoning :delta "reasoning"}] (:emissions result))))))

(deftest route-think-delta-thinking-continues
  (testing "In :thinking mode, text emits as reasoning"
    (let [result (r/route-think-delta {:mode :thinking :delta "more thought"})]
      (is (= :thinking (:mode result)))
      (is (= [{:kind :reasoning :delta "more thought"}] (:emissions result))))))

(deftest route-think-delta-thinking-closes
  (testing "In :thinking mode, closing tag transitions to :done"
    (let [result (r/route-think-delta {:mode :thinking :delta "</think>answer text"})]
      (is (= :done (:mode result)))
      (is (= [{:kind :reasoning :delta ""}
              {:kind :agent_message :delta "answer text"}]
             (:emissions result))))))

(deftest route-think-delta-done-mode
  (testing "In :done mode, text emits as agent_message"
    (let [result (r/route-think-delta {:mode :done :delta "more answer"})]
      (is (= :done (:mode result)))
      (is (= [{:kind :agent_message :delta "more answer"}] (:emissions result))))))

(deftest route-think-delta-blank-delta
  (testing "Blank delta produces no emissions"
    (let [result (r/route-think-delta {:mode :off :delta ""})]
      (is (= :off (:mode result)))
      (is (= [] (:emissions result))))))
