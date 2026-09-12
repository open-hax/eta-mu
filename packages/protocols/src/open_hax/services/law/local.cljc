(ns open-hax.services.law.local
  "Portable service changes. Clio owns ledger identity, admission and replay order."
  (:require [clio.law.schema :as schema]
            [clojure.string :as str]))

(def collections
  [:enum :events :event-intents :sessions :documents :nodes :edges :translations :labels
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

(defn validate-record!
  "Generic records preserve application fields, but the container must be a map."
  [record]
  (require! (map? record) :invalid-record "Service record must be a map")
  record)

(defn validate-neighbor-ids!
  "Refuse malformed graph output without dropping its underlying stored edges."
  [ids]
  (require! (every? string? ids) :invalid-neighbor-identity "Neighbor identities must be strings")
  ids)

(def service-keys
  #{:events :sessions :documents :graph :translations :labels :users :realtime})

(defn validate-directory!
  "Reject absent and blank filesystem destinations before resolving or creating paths."
  [directory]
  (require! (and (string? directory) (not (str/blank? directory))) :missing-directory
            "The EDN service provider requires a non-blank directory")
  directory)

(defn validate-overrides!
  "Refuse misspelled or malformed service selection before any provider is opened."
  [overrides]
  (require! (or (nil? overrides) (map? overrides)) :invalid-service-overrides
            "Service overrides must be a map")
  (require! (every? service-keys (keys overrides)) :unknown-service-override
            "Service overrides must name an existing service protocol")
  overrides)

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
