(ns eta-mu.law.evidence-lane-catalog
  "Closed contracts for the bounded expert-lane catalog.

  A catalog declares which evidence class a lane owns and the artifacts, tools,
  and budgets it may use. It contains no provider credentials or executable
  host objects."
  (:require [malli.core :as m]))

(def non-empty-string-schema
  [:string {:min 1}])

(def budget-schema
  [:map {:closed true}
   [:wall-ms [:int {:min 1}]]
   [:input-bytes [:int {:min 1}]]
   [:output-bytes [:int {:min 1}]]
   [:max-findings [:int {:min 0}]]])

(def lane-profile-schema
  [:map {:closed true}
   [:lane/id :keyword]
   [:lane/actor :keyword]
   [:lane/description non-empty-string-schema]
   [:lane/artifact-kinds [:set :keyword]]
   [:lane/tools [:set :keyword]]
   [:lane/budgets budget-schema]])

(def lane-catalog-schema
  [:map {:closed true}
   [:catalog/version [:= 1]]
   [:catalog/id :keyword]
   [:catalog/required-lanes [:set :keyword]]
   [:catalog/lanes [:vector lane-profile-schema]]])

(defn valid-catalog-shape?
  [value]
  (m/validate lane-catalog-schema value))

(defn explain-catalog
  [value]
  (m/explain lane-catalog-schema value))
