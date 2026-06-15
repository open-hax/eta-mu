(ns katamorph.schema-test
  (:require [cljs.test :refer [deftest testing is]]
            [katamorph.schema :as schema]))

(deftest infer-contract-class-by-kind
  (is (= :agent (schema/infer-contract-class {:contract/kind :agent})))
  (is (= :actor (schema/infer-contract-class {:contract/kind :actor})))
  (is (= :policy (schema/infer-contract-class {:contract/kind :policy})))
  (is (= :fulfillment (schema/infer-contract-class {:contract/kind :fulfillment})))
  (is (= :trigger (schema/infer-contract-class {:contract/kind :trigger}))))

(deftest infer-contract-class-by-kind-string
  (is (= :agent (schema/infer-contract-class {:contract/kind "agent"})))
  (is (= :policy (schema/infer-contract-class {:contract/kind "policy"}))))

(deftest infer-contract-class-by-heuristic
  (is (= :actor (schema/infer-contract-class {:actor/id "user1"})))
  (is (= :role (schema/infer-contract-class {:role/id :admin})))
  (is (= :capability (schema/infer-contract-class {:cap/id :read})))
  (is (= :model (schema/infer-contract-class {:model/id "gpt-5"})))
  (is (= :model-family (schema/infer-contract-class {:model-family/id "gpt"})))
  (is (= :generator (schema/infer-contract-class {:generator/id "gen1"})))
  (is (= :schedule (schema/infer-contract-class {:schedule/id "sched1"})))
  (is (= :sub-agent (schema/infer-contract-class {:parent-agent "parent1"})))
  (is (= :agent (schema/infer-contract-class {:contract/id "my-agent"}))))

(deftest infer-contract-class-fallback
  (is (= :agent (schema/infer-contract-class {})))
  (is (= :agent (schema/infer-contract-class "not-a-map")))
  (is (= :agent (schema/infer-contract-class nil))))

(deftest schema-for-known-kinds
  (is (some? (schema/schema-for :agent)))
  (is (some? (schema/schema-for :actor)))
  (is (some? (schema/schema-for :role)))
  (is (some? (schema/schema-for :policy)))
  (is (some? (schema/schema-for :fulfillment)))
  (is (some? (schema/schema-for :trigger)))
  (is (some? (schema/schema-for :model)))
  (is (some? (schema/schema-for :model-family))))

(deftest schema-for-string-kind
  (is (some? (schema/schema-for "agent")))
  (is (some? (schema/schema-for "actor"))))

(deftest schema-for-throws-on-unknown
  (is (thrown-with-msg? js/Error #"Unknown contract kind"
        (schema/schema-for :nonexistent))))

(deftest validate-agent-contract
  (let [agent {:contract/id "test" :contract/kind :agent}]
    (is (:ok (schema/validate agent)))))

(deftest validate-actor-contract
  (let [actor {:actor/id "user1" :actor/kind :user}]
    (is (:ok (schema/validate actor)))))

(deftest validate-fails-missing-required
  (let [result (schema/validate :actor {:actor/kind :user})]
    (is (not (:ok result)))
    (is (seq (:errors result)))))

(deftest validate-with-explicit-class
  (let [result (schema/validate :role {:role/id :admin})]
    (is (:ok result)))
  (let [result (schema/validate :role {})]
    (is (not (:ok result)))))

(deftest validate-infers-class-when-nil
  (let [result (schema/validate nil {:actor/id "u" :actor/kind :user})]
    (is (:ok result))
    (is (= :actor (schema/infer-contract-class (:value result))))))

(deftest assert!-passes-valid
  (is (= {:contract/id "x" :contract/kind :agent}
         (schema/assert! :agent {:contract/id "x" :contract/kind :agent}))))

(deftest assert!-throws-on-invalid
  (is (thrown? js/Error
        (schema/assert! :actor {}))))
