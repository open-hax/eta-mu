(ns clio.law.event
  (:require [clojure.string :as str]))

(def uuid-pattern
  #"(?i)^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")

(defn uuid-string?
  [value]
  (and (string? value)
       (boolean (re-matches uuid-pattern value))))

(defn non-blank-string?
  [value]
  (and (string? value)
       (not (str/blank? value))))

(defn positive-int?
  [value]
  (and (integer? value)
       (pos? value)))

(defn event-identity-valid?
  [event]
  (and (uuid-string? (:event/id event))
       (non-blank-string? (:event/stream event))
       (positive-int? (:event/seq event))
       (vector? (:event/causes event))
       (every? uuid-string? (:event/causes event))))
