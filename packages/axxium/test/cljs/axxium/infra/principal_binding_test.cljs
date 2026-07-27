(ns axxium.infra.principal-binding-test
  (:require [axxium.db :as db]
            [axxium.infra.principal-binding :as binding]
            [cljs.test :refer [deftest is testing]]))

(deftest ^:async resolve-runtime-binding-test
  (testing "joins actor and entity authority and projects the result"
    (let [calls* (atom [])]
      (with-redefs [db/query-one
                    (fn [sql params]
                      (swap! calls* conj [sql params])
                      (js/Promise.resolve
                       {:actor_id "actor.agent.research"
                        :entity_id "entity.agent.research"
                        :org_id "org.open-hax"
                        :actor_status "active"
                        :entity_kind "agent"}))]
        (let [actual (await (binding/resolve-runtime-binding
                             "actor.agent.research"))]
          (is (= {:binding/version 1
                  :principal/actor-id "actor.agent.research"
                  :principal/entity-id "entity.agent.research"
                  :principal/kind "agent"
                  :principal/org-id "org.open-hax"}
                 actual))
          (is (= [[binding/runtime-binding-sql
                   ["actor.agent.research"]]]
                 @calls*))))))

(deftest ^:async missing-active-actor-test
  (with-redefs [db/query-one
                (fn [_sql _params]
                  (js/Promise.resolve nil))]
    (is (nil? (await (binding/resolve-runtime-binding "missing"))))))
