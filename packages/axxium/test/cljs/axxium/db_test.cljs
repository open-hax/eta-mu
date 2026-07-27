(ns axxium.db-test
  (:require [axxium.db :as db]
            [cljs.test :refer [deftest is testing]]
            [clojure.string :as str]))

(defn- integration-db?
  []
  (= "true" (aget (.-env js/process) "AXXIUM_TEST_DB")))

(deftest schema-sql-adds-organization-scope-idempotently-test
  (testing "new and existing installs receive the organization column"
    (is (str/includes? db/schema-sql "org_id TEXT"))
    (is (str/includes? db/schema-sql
                       "ADD COLUMN IF NOT EXISTS org_id TEXT")))

  (testing "the organization reference remains a foreign key"
    (is (str/includes? db/schema-sql
                       "ADD CONSTRAINT actors_org_id_fkey"))
    (is (str/includes? db/schema-sql
                       "FOREIGN KEY (org_id) REFERENCES entities(id)")))

  (testing "actor writes require an organization entity"
    (is (str/includes? db/schema-sql
                       "axxium_enforce_actor_org_id"))
    (is (str/includes? db/schema-sql
                       "organization.kind = 'org'")))

  (testing "referenced organization entities cannot change kind"
    (is (str/includes? db/schema-sql
                       "axxium_protect_org_entity_kind"))
    (is (str/includes? db/schema-sql
                       "BEFORE UPDATE OF kind ON entities")))

  (testing "pre-existing invalid organization bindings fail migration"
    (is (str/includes? db/schema-sql
                       "actors.org_id contains a non-organization entity reference")))

  (testing "organization lookup is indexed"
    (is (str/includes? db/schema-sql
                       "idx_actors_org ON actors(org_id)"))))

(deftest ^:async organization-scope-database-constraint-test
  (if-not (integration-db?)
    (is true "PostgreSQL integration is opt-in outside CI")
    (let [suffix (str (random-uuid))
          org-id (str "org_test_" suffix)
          human-id (str "human_test_" suffix)
          agent-entity-id (str "agent_entity_test_" suffix)
          actor-id (str "actor_test_" suffix)
          invalid-actor-id (str "invalid_actor_test_" suffix)]
      (try
        (await (db/init-schema!))
        (await (db/query
                "INSERT INTO entities (id, kind) VALUES ($1, 'org'), ($2, 'human'), ($3, 'agent')"
                [org-id human-id agent-entity-id]))
        (await (db/query
                "INSERT INTO actors (id, entity_id, org_id) VALUES ($1, $2, $3)"
                [actor-id agent-entity-id org-id]))
        (is (some? (await (db/query-one
                           "SELECT id FROM actors WHERE id = $1"
                           [actor-id]))))

        (try
          (await (db/query
                  "INSERT INTO actors (id, entity_id, org_id) VALUES ($1, $2, $3)"
                  [invalid-actor-id agent-entity-id human-id]))
          (is false "non-organization entity must not be accepted as org_id")
          (catch :default error
            (is (= "23514" (.-code error)))))

        (try
          (await (db/query
                  "UPDATE entities SET kind = 'service' WHERE id = $1"
                  [org-id]))
          (is false "referenced organization entity kind must remain org")
          (catch :default error
            (is (= "23514" (.-code error)))))

        (finally
          (try
            (await (db/query "DELETE FROM actors WHERE id = $1" [actor-id]))
            (await (db/query "DELETE FROM entities WHERE id IN ($1, $2, $3)"
                             [org-id human-id agent-entity-id]))
            (catch :default _ nil))
          (await (.end @db/pool)))))))
