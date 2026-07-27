(ns axxium.db-test
  (:require [axxium.db :as db]
            [cljs.test :refer [deftest is testing]]
            [clojure.string :as str]))

(deftest schema-sql-adds-organization-scope-idempotently-test
  (testing "new installs create the organization column"
    (is (str/includes? db/schema-sql
                       "org_id TEXT REFERENCES entities(id)")))
  (testing "existing installs receive an additive migration"
    (is (str/includes? db/schema-sql
                       "ADD COLUMN IF NOT EXISTS org_id")))
  (testing "organization lookup is indexed"
    (is (str/includes? db/schema-sql
                       "idx_actors_org ON actors(org_id)"))))
