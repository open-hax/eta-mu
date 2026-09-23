(ns eta-mu.law.evidence-lane-catalog
  "Closed contracts for the bounded expert-lane catalog.

  A catalog declares which evidence class a lane owns and the artifacts, tools,
  producer identity, and budgets it may use. It contains no provider credentials
  or executable host objects."
  (:require [eta-mu.law.evidence-review :as review-law]
            [malli.core :as m]))

(def non-empty-string-schema
  [:string {:min 1}])

(def budget-schema
  [:map {:closed true}
   [:wall-ms [:int {:min 1}]]
   [:input-bytes [:int {:min 1}]]
   [:output-bytes [:int {:min 1}]]
   [:max-findings [:int {:min 0}]]])

(def producer-profile-schema
  [:map {:closed true}
   [:producer/actor :keyword]
   [:producer/actor-binding non-empty-string-schema]
   [:producer/profile-revision review-law/revision-schema]
   [:producer/workflow-revision review-law/revision-schema]])

(def lane-profile-schema
  [:map {:closed true}
   [:lane/id :keyword]
   [:lane/revision review-law/revision-schema]
   [:lane/producer producer-profile-schema]
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
