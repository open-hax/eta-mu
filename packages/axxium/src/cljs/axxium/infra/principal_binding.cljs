(ns axxium.infra.principal-binding
  "Axxium query seam for runtime principal identity references."
  (:require [axxium.db :as db]
            [axxium.shape.principal-binding :as shape]))

(def runtime-binding-sql
  "SELECT
     a.id AS actor_id,
     a.entity_id AS entity_id,
     a.org_id AS org_id,
     a.status AS actor_status,
     e.kind AS entity_kind
   FROM actors a
   JOIN entities e ON e.id = a.entity_id
   WHERE a.id = $1 AND a.status = 'active'")

(defn ^:async resolve-runtime-binding
  "Resolve one active Axxium actor to an immutable runtime binding.
   Returns nil for missing/inactive actors."
  [actor-id]
  (some-> (await (db/query-one runtime-binding-sql [actor-id]))
          shape/row->runtime-binding))
