(ns axxium.db-test
  (:require [axxium.db :as db]
            [cljs.test :refer [deftest is testing]]
            [clojure.string :as str]))

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
