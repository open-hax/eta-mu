(ns rheos.backend.domain.compose-condition
  (:require [clojure.string :as str]
            [rheos.backend.law.condition :as condition]))

(defn normalize-value [value]
  (if (keyword? value) (name value) (str value)))

(defn- canonical-match? [field-value op test-value]
  (let [context {:value (normalize-value field-value)}]
    (case op
      := (condition/match? context {:condition/op :eq :condition/path [:value]
                                    :condition/value (normalize-value test-value)})
      :in (condition/match? context {:condition/op :in :condition/path [:value]
                                     :condition/values (mapv normalize-value
                                                             (if (vector? test-value)
                                                               test-value
                                                               [test-value]))})
      false)))

(defn- legacy-contains? [field-value test-value]
  (let [needle (normalize-value test-value)]
    (if (vector? field-value)
      (boolean (some #(= (normalize-value %) needle) field-value))
      (str/includes? (normalize-value field-value) needle))))

(defn- legacy-regex? [field-value pattern]
  (try
    (boolean (re-matches (re-pattern (normalize-value pattern))
                         (normalize-value field-value)))
    (catch #?(:clj Exception :cljs :default) _ false)))

(defn apply-operator [field-value op test-value]
  (case op
    := (canonical-match? field-value := test-value)
    :in (canonical-match? field-value :in test-value)
    :contains (legacy-contains? field-value test-value)
    :regex (legacy-regex? field-value test-value)
    false))

(defn- field-key [field]
  (let [field-name (name field)]
    (keyword (if (str/starts-with? field-name "meta.")
               (subs field-name 5)
               field-name))))

(defn match-clause? [context [field op value]]
  (apply-operator (get context (field-key field)) op value))

(defn match-any? [field-value values]
  (or (empty? values) (canonical-match? field-value :in values)))

(defn contains-all? [field-value values]
  (or (empty? values) (every? #(legacy-contains? field-value %) values)))
