(ns rheos.backend.law.condition.basic
  (:require [rheos.backend.law.path :as path]))

(defn equal? [context condition]
  (let [{:keys [found? value]} (path/value-at context (:condition/path condition))]
    (and found? (= value (:condition/value condition)))))

(defn exists? [context condition]
  (:found? (path/value-at context (:condition/path condition))))
