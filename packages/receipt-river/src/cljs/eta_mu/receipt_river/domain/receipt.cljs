(ns eta-mu.receipt-river.domain.receipt
  "Pure Receipt River payload construction and normalization."
  (:require [clojure.string :as str]
            [eta-mu.receipt-river.law.receipt :as law]))

(def known-kinds law/known-kinds)

(def legacy-required-keys law/legacy-required-keys)

(defn clean-field
  ([value] (clean-field value "none"))
  ([value fallback]
   (let [s (-> (str (or value ""))
               (str/replace #"\r?\n+" " ")
               (str/replace #"\s+" " ")
               str/trim)]
     (if (pos? (.-length s)) s fallback))))

(defn normalize-kind
  [value fallback]
  (let [raw (clean-field value (name fallback))
        kind (keyword (if (str/starts-with? raw ":") (subs raw 1) raw))]
    (if (contains? known-kinds kind)
      kind
      (throw (js/Error. (str "Unknown receipt kind: " kind))))))

(defn build-payload
  "Build the existing Receipt River record shape as a package-owned payload."
  [params repo-root recorded-at fallback-kind]
  (let [owner (clean-field (:owner params) "receipt-river")
        record {:ts (clean-field (:ts params) recorded-at)
                :kind (normalize-kind (:kind params) fallback-kind)
                :repo repo-root
                :origin (clean-field (:origin params) "eta-mu")
                :owner owner
                :dod (clean-field (:dod params) owner)
                :pi (clean-field (:pi params) "eta-mu")
                :host (clean-field (:host params) "local")
                :manifest (clean-field (:manifest params) "none")
                :refs (clean-field (:refs params) "none")}
        optionals (select-keys params [:note :tests :decisions :drift])]
    (reduce (fn [acc [key value]]
              (let [clean (clean-field value "")]
                (if (str/blank? clean) acc (assoc acc key clean))))
            record
            optionals)))
