(ns axxium.domain.identity-ceremonies
  "Retention and admission laws for unauthenticated, short-lived ceremonies."
  (:require [axxium.domain.identity :as identity]
            [axxium.law.identity :as law]
            [axxium.law.identity-ceremonies :as ceremonies]))

(defn retained [entries now]
  (into {} (filter (fn [[_ value]] (> (:expires-at value) now))) entries))

(defn reserve-proof-attempt
  "Validate current challenge authority and reserve one attempt before crypto."
  [state id purpose browser-hash now]
  (let [challenge (identity/require-challenge! state id purpose browser-hash now)
        attempts (get challenge :proof-attempts 0)]
    (ceremonies/require-proof-slot! purpose attempts)
    (assoc challenge :proof-attempts (inc attempts))))

(defn admit!
  "Bound global, browser and trusted-client issuance within the same retained checkpoint."
  ([entries browser-hash now purpose]
   (admit! entries browser-hash now purpose nil))
  ([entries browser-hash now purpose client-hash]
   (let [recent (filter #(> (:issued-at %) (- now 60000)) (vals entries))]
     (when (= :password/active purpose)
       (law/require! (< (count (filter #(= :password/active (:purpose %)) (vals entries))) 2)
                     :ceremony-rate-limit "Password verification is busy; retry later"))
     (law/require! (and (< (count entries) 256)
                        (< (count recent) 64)
                        (< (count (filter #(= browser-hash (:browser-hash %)) recent)) 8)
                        (or (nil? client-hash)
                            (< (count (filter #(= client-hash (:client-hash %)) recent)) 8)))
                   :ceremony-rate-limit "Too many authentication attempts; wait before retrying"))))
