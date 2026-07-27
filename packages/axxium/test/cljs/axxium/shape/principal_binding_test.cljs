(ns axxium.shape.principal-binding-test
  (:require [axxium.schema :as schema]
            [axxium.shape.principal-binding :as binding]
            [cljs.test :refer [deftest is testing]]))

(def base-row
  {:actor_id "actor.agent.research"
   :entity_id "entity.agent.research"
   :actor_status "active"
   :entity_kind "agent"})

(deftest runnable-principal-binding-test
  (doseq [[kind expected]
          [["human" "human"]
           ["agent" "agent"]
           ["service" "service"]
           ["automation" "automation"]]]
    (testing kind
      (let [actual (binding/row->runtime-binding
                    (assoc base-row :entity_kind kind))]
        (is (= expected (:principal/kind actual)))
        (is (= "actor.agent.research" (:principal/actor-id actual)))
        (is (= "entity.agent.research" (:principal/entity-id actual)))
        (is (schema/valid? schema/RuntimePrincipalBinding actual))))))

(deftest organization-scope-test
  (testing "organization scope is preserved when present"
    (is (= "org.open-hax"
           (:principal/org-id
            (binding/row->runtime-binding
             (assoc base-row :org_id "org.open-hax"))))))

  (testing "legacy actors remain valid without organization scope"
    (let [actual (binding/row->runtime-binding base-row)]
      (is (not (contains? actual :principal/org-id)))
      (is (schema/valid? schema/RuntimePrincipalBinding actual)))))

(deftest inactive-and-missing-row-test
  (is (nil? (binding/row->runtime-binding nil)))
  (is (nil? (binding/row->runtime-binding
             (assoc base-row :actor_status "suspended"))))
  (is (nil? (binding/row->runtime-binding
             (assoc base-row :actor_status "retired")))))

(deftest invalid-authoritative-row-test
  (testing "organization entities are not runnable principals"
    (try
      (binding/row->runtime-binding (assoc base-row :entity_kind "org"))
      (is false "organization entity should be rejected")
      (catch :default error
        (is (= :unsupported-principal-kind
               (:reason (ex-data error)))))))

  (testing "unknown entity kinds are rejected"
    (try
      (binding/row->runtime-binding (assoc base-row :entity_kind "robot"))
      (is false "unknown entity kind should be rejected")
      (catch :default error
        (is (= :unsupported-principal-kind
               (:reason (ex-data error)))))))

  (testing "actor and entity identity are required"
    (doseq [[row expected]
            [[(dissoc base-row :actor_id) :missing-actor-id]
             [(dissoc base-row :entity_id) :missing-entity-id]]]
      (try
        (binding/row->runtime-binding row)
        (is false "missing identity should be rejected")
        (catch :default error
          (is (= expected (:reason (ex-data error)))))))))
