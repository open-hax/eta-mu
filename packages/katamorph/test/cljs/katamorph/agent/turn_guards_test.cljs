(ns katamorph.agent.turn-guards-test
  (:require [cljs.test :refer [deftest testing is]]
            [katamorph.agent.turn-guards :as tg]))

(deftest empty-state-has-no-abort
  (testing "Fresh state with a single tool call does not abort"
    (let [result (tg/observe-tool-call tg/empty-tool-loop-state
                                       {:tool-name "search" :tool-call-id "1" :input-preview "{}"})]
      (is (not (:abort? result)))
      (is (= 1 (:count result)))
      (is (= 1 (:streak result))))))

(deftest streak-increments-for-same-signature
  (testing "Repeated identical calls increment streak"
    (let [event {:tool-name "search" :tool-call-id "1" :input-preview "{}"}
           state (loop [s tg/empty-tool-loop-state n 0]
                   (if (>= n 4) s
                     (recur (:state (tg/observe-tool-call s event)) (inc n))))]
      (is (= 4 (:streak state)))
      (is (= 4 (get (:counts state) "search::{}"))))))

(deftest streak-resets-on-different-signature
  (testing "Different tool name resets streak to 1"
    (let [r1 (tg/observe-tool-call tg/empty-tool-loop-state
                                   {:tool-name "a" :tool-call-id "1" :input-preview "{}"})
          r2 (tg/observe-tool-call (:state r1)
                                   {:tool-name "b" :tool-call-id "2" :input-preview "{}"})]
      (is (= 1 (:streak (:state r2))))
      (is (= 1 (get (:counts (:state r2)) "b::{}"))))))

(deftest abort-at-streak-limit
  (testing "Aborts when streak reaches limit (default 6)"
    (let [event {:tool-name "loop" :tool-call-id "1" :input-preview "x"}
          result (loop [s tg/empty-tool-loop-state n 0]
                   (let [r (tg/observe-tool-call s event)]
                     (if (or (:abort? r) (>= n 10))
                       r
                       (recur (:state r) (inc n)))))]
      (is (:abort? result))
      (is (= 6 (:streak result)))
      (is (re-find #"death_spiral_detected" (:reason result))))))

(deftest abort-at-total-limit
  (testing "Aborts when total count for a signature reaches limit (default 12)"
    (let [base-state {:last "other::x" :streak 1 :counts {"loop::y" 11}}
          result (tg/observe-tool-call base-state
                                       {:tool-name "loop" :tool-call-id "1" :input-preview "y"})]
      (is (:abort? result))
      (is (= 12 (:count result))))))

(deftest custom-limits
  (testing "Respects custom streak-limit and total-limit"
    (let [result (tg/observe-tool-call tg/empty-tool-loop-state
                                       {:tool-name "x" :tool-call-id "1" :input-preview ""
                                        :streak-limit 2 :total-limit 100})]
      (is (not (:abort? result)))
      (let [r2 (tg/observe-tool-call (:state result)
                                     {:tool-name "x" :tool-call-id "2" :input-preview ""
                                      :streak-limit 2 :total-limit 100})]
        (is (:abort? r2))
        (is (= 2 (:streak (:state r2))))))))

(deftest already-aborting-skips-abort
  (testing "Does not re-abort when aborting? is already true"
    (let [result (tg/observe-tool-call tg/empty-tool-loop-state
                                       {:tool-name "x" :tool-call-id "1" :input-preview ""
                                        :aborting? true :streak-limit 1})]
      (is (not (:abort? result))))))

(deftest signature-includes-input-preview
  (testing "Same tool with different input-preview has different signatures"
    (let [r1 (tg/observe-tool-call tg/empty-tool-loop-state
                                   {:tool-name "search" :tool-call-id "1" :input-preview "query-a"})
          r2 (tg/observe-tool-call (:state r1)
                                   {:tool-name "search" :tool-call-id "2" :input-preview "query-b"})]
      (is (= 1 (:streak (:state r2))))
      (is (= 1 (get (:counts (:state r2)) "search::query-b"))))))
