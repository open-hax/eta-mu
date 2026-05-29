(ns eta-mu.runtime.facade-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.runtime.facade :as facade]))

(defn- ->clj
  [value]
  (js->clj value :keywordize-keys true))

(def valid-context
  #js {:repo "open-hax/proxx"
       :trigger "scheduler.tick"
       :target "open-hax/proxx"
       :summary "cheap reconcile loop found no action"
       :belief #js {:urgency 0
                    :ambiguity 0.25
                    :socialFriction 0
                    :deployRisk 0
                    :reviewDebt 0
                    :drift 0
                    :crust 0
                    :bloomNeed 0.25
                    :userIntentConfidence 0.5}})

(deftest js-compat-roundtrip-test
  (testing "facade preserves camelCase public keys while using internal kebab-case maps"
    (let [belief (->clj (facade/create-eta-belief #js {:socialFriction 2
                                                       :deployRisk -1
                                                       :userIntentConfidence 0.8}))]
      (is (= 1 (:socialFriction belief)))
      (is (= 0 (:deployRisk belief)))
      (is (= 0.8 (:userIntentConfidence belief)))
      (is (not (contains? belief :social-friction))))))

(deftest facade-action-batch-test
  (testing "facade returns the current JS action batch shape"
    (let [batch (->clj (facade/create-action-batch valid-context))]
      (is (= "eta-mu-action-batch.v1" (:kind batch)))
      (is (= ["field" "movement"] (:panels batch)))
      (is (= "noop" (-> batch :actions first :kind)))
      (is (= false (get-in batch [:breath :shouldCommit]))))))

(deftest malformed-context-rejected-test
  (testing "facade rejects malformed public planning context payloads"
    (is (thrown? js/Error
                 (facade/create-action-batch
                  #js {:repo "open-hax/proxx"
                       :trigger "scheduler.tick"
                       :target "open-hax/proxx"
                       :summary "bad context"
                       :belief #js {:urgency 2
                                    :ambiguity 0.25
                                    :socialFriction 0
                                    :deployRisk 0
                                    :reviewDebt 0
                                    :drift 0
                                    :crust 0
                                    :bloomNeed 0.25
                                    :userIntentConfidence 0.5}})))))
