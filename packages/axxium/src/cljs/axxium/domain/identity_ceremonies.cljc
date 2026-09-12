(ns axxium.domain.identity-ceremonies
  "Retention and admission laws for unauthenticated, short-lived ceremonies."
  (:require [axxium.law.identity :as law]))

(defn retained [entries now]
  (into {} (filter (fn [[_ value]] (> (:expires-at value) now))) entries))

(defn admit! [entries browser-hash now purpose]
  (let [recent (filter #(> (:issued-at %) (- now 60000)) (vals entries))]
    (when (= :password/active purpose)
      (law/require! (< (count (filter #(= :password/active (:purpose %)) (vals entries))) 2)
                    :ceremony-rate-limit "Password verification is busy; retry later"))
    (law/require! (and (< (count entries) 256)
                       (< (count recent) 64)
                       (< (count (filter #(= browser-hash (:browser-hash %)) recent)) 8))
                  :ceremony-rate-limit "Too many authentication attempts; wait before retrying")))
