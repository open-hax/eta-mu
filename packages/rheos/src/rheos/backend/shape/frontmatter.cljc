(ns rheos.backend.shape.frontmatter
  (:require [clojure.string :as str]))

(def ^:private unsupported ::unsupported)

(def ^:private canonical-string-sequence-pattern
  #"^\[\s*(?:\"[^\"]*\"(?:\s*,\s*\"[^\"]*\")*)?\s*\]$")

(def ^:private quoted-string-pattern
  #"\"([^\"]*)\"")

(defn parse-canonical-string-sequence
  "Decode Rheos's supported YAML subset for one inline string sequence.

   Returns nil for syntax outside that subset so every consumer can make the
   same fail-closed decision instead of growing a second comma-splitting parser."
  [value]
  (when (re-matches canonical-string-sequence-pattern value)
    (mapv second (re-seq quoted-string-pattern value))))

(defn- flat-value [raw]
  (let [value (str/trim raw)]
    (cond
      (empty? value) unsupported
      (or (str/starts-with? value "|")
          (str/starts-with? value ">")
          (str/starts-with? value "{")) unsupported
      (str/starts-with? value "[")
      (or (parse-canonical-string-sequence value) unsupported)
      :else (str/replace value #"^\"|\"$" ""))))

(defn parse-flat [frontmatter-raw]
  (reduce (fn [acc line]
            (if-let [[_ k v] (re-matches #"^([A-Za-z0-9_-]+):[ ]*(.*)$" line)]
              (let [value (flat-value v)]
                (if (= unsupported value)
                  acc
                  (assoc acc (keyword k) value)))
              acc))
          {}
          (str/split-lines (or frontmatter-raw ""))))
