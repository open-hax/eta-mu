(ns rheos.backend.law.condition.membership
  (:require [rheos.backend.law.path :as path]))

(defn not-equal? [context condition]
  (let [{:keys [found? value]} (path/value-at context (:condition/path condition))]
    (and found? (not= value (:condition/value condition)))))

(defn in? [context condition]
  (let [{:keys [found? value]} (path/value-at context (:condition/path condition))
        values (:condition/values condition)]
    (and found?
         (sequential? values)
         (boolean (some #(= value %) values)))))
