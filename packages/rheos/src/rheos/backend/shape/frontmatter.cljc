(ns rheos.backend.shape.frontmatter
  (:require [clojure.string :as str]))

(defn parse-flat [frontmatter-raw]
  (reduce (fn [acc line]
            (if-let [[_ k v] (re-matches #"^([A-Za-z0-9_-]+):[ ]*(.*)$" line)]
              (assoc acc (keyword k) (str/replace (str/trim v) #"^\"|\"$" ""))
              acc))
          {}
          (str/split-lines (or frontmatter-raw ""))))
