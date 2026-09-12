(ns open-hax.services.law.local
  "Portable service changes. Clio owns ledger identity, admission and replay order."
  (:require [clio.law.schema :as schema]
            [clojure.string :as str]))

(def collections
  [:enum :events :sessions :documents :nodes :edges :translations :labels
   :label-targets :users :notifications])

(def change-schema
  (into [:multi {:dispatch :op}]
        (map (fn [op]
               [op (cond-> [:map {:closed true}
                            [:op [:= op]]
                            [:collection collections]
                            [:id [:string {:min 1}]]]
                     (not= :delete op) (conj [:value :map]))]))
        [:put :patch :delete]))

(def catalog
  {:open-hax.services/changed
   (schema/event-schema
    :open-hax.services/changed
    [:map {:closed true} [:changes [:vector {:min 1} change-schema]]])})

(defn require! [condition type message]
  (when-not condition
    (throw (ex-info message {:services/error type}))))

(def ^:private field-operators
  #{:$eq :$ne :$in :$nin :$exists :$gt :$gte :$lt :$lte})

(defn- operator? [key]
  (and (or (keyword? key) (string? key)) (str/starts-with? (name key) "$")))

(defn validate-query! [query]
  (require! (or (nil? query) (map? query)) :invalid-query "Local queries must be maps")
  (doseq [[field value] query]
    (if (#{:$and :$or} field)
      (do
        (require! (sequential? value) :invalid-query "Logical queries require a sequence")
        (doseq [child value] (validate-query! child)))
      (do
        (require! (not (operator? field)) :unsupported-query "Unsupported local query operator")
        (when (and (map? value) (some operator? (keys value)))
          (doseq [[operator operand] value]
            (require! (contains? field-operators operator) :unsupported-query
                      "Unsupported local query operator")
            (when (#{:$in :$nin} operator)
              (require! (sequential? operand) :invalid-query "Membership queries require a sequence"))
            (when (= :$exists operator)
              (require! (boolean? operand) :invalid-query "$exists requires a boolean")))))))
  query)
