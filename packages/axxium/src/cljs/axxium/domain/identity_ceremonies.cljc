(ns axxium.domain.identity-ceremonies
  "Retention and admission laws for unauthenticated, short-lived ceremonies."
  (:require [axxium.law.identity :as law]))

(defn retained [entries now]
  (into {} (filter (fn [[_ value]] (> (:expires-at value) now))) entries))

(defn admit! [entries browser-hash now]
  (let [recent (filter #(> (:issued-at %) (- now 60000)) (vals entries))]
    (law/require! (and (< (count entries) 256)
                       (< (count recent) 64)
                       (< (count (filter #(= browser-hash (:browser-hash %)) recent)) 8))
                  :ceremony-rate-limit "Too many authentication attempts; wait before retrying")))
