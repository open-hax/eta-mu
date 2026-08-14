(ns rheos.backend.shape.frontmatter
  (:require [clojure.string :as str]))

(def ^:private unsupported ::unsupported)

(defn- flat-string-value [raw]
  (let [value (str/trim raw)]
    (cond
      (empty? value) unsupported
      (#{{"|" "|-" "|+" ">" ">-" ">+"}} value) unsupported
      (or (str/starts-with? value "[")
          (str/starts-with? value "{")) unsupported
      :else (str/replace value #"^\"|\"$" ""))))

(defn parse-flat [frontmatter-raw]
  (reduce (fn [acc line]
            (if-let [[_ k v] (re-matches #"^([A-Za-z0-9_-]+):[ ]*(.*)$" line)]
              (let [value (flat-string-value v)]
                (if (= unsupported value)
                  acc
                  (assoc acc (keyword k) value)))
              acc))
          {}
          (str/split-lines (or frontmatter-raw ""))))
