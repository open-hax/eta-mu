(ns axxium.auth.session-test
  (:require [axxium.auth.session :as session]
            [axxium.schema :as schema]
            [cljs.test :refer [deftest is testing]]))

(def actor-row
  {:id "actor.agent.research"
   :entity_id "entity.agent.research"
   :email "agent@example.com"
   :capabilities [:research/read]
   :roles [:research/agent]})

(deftest actor->auth-context-test
  (testing "organization scope is propagated"
    (let [actual (session/actor->auth-context
                  (assoc actor-row :org_id "org.open-hax"))]
      (is (= "org.open-hax" (:auth/org-id actual)))
      (is (= "actor.agent.research" (:auth/actor-id actual)))
      (is (= "entity.agent.research" (:auth/entity-id actual)))
      (is (schema/valid? schema/AuthContext actual))))

  (testing "legacy rows remain valid without organization scope"
    (let [actual (session/actor->auth-context actor-row)]
      (is (not (contains? actual :auth/org-id)))
      (is (schema/valid? schema/AuthContext actual)))))
