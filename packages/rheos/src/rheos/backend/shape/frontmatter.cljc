(ns rheos.backend.shape.frontmatter
  (:require [clojure.string :as str]))

(def ^:private unsupported ::unsupported)

(def ^:private canonical-string-sequence-pattern
  #"^\[\s*(?:\"[^\"]*\"(?:\s*,\s*\"[^\"]*\")*)?\s*\]$")

(def ^:private quoted-string-pattern
  #"\"([^\"]*)\"")

(def ^:private plain-and-quoted-sequence-pattern
  #"^\[\s*(?:\"[^\"]*\"|[A-Za-z_][A-Za-z0-9_./: \t-]*)(?:\s*,\s*(?:\"[^\"]*\"|[A-Za-z_][A-Za-z0-9_./: \t-]*))*\s*\]$")

(def ^:private sequence-member-pattern
  #"\"([^\"]*)\"|([A-Za-z_][A-Za-z0-9_./: \t-]*)")

(defn- plain-string [value]
  (let [value (str/trim value)]
    (when-not (or (contains? #{"true" "false" "null"} (str/lower-case value))
                  (re-find #":[ \t]|:$" value))
      value)))

(defn- parse-mixed-string-sequence [value]
  (when (re-matches plain-and-quoted-sequence-pattern value)
    (let [members (mapv (fn [[_ quoted plain]]
                          (if (some? quoted) quoted (plain-string plain)))
                        (re-seq sequence-member-pattern value))]
      (when (every? some? members) members))))

(defn parse-canonical-string-sequence
  "Decode Rheos's supported YAML subset for one inline string sequence.

   Quoted members and plain word/path labels can be mixed. Plain booleans,
   nulls, numeric values, mappings, and nested collections remain unsupported.
   Returns nil for syntax outside that subset so every consumer can make the
   same fail-closed decision instead of growing a second comma-splitting parser."
  [value]
  (if (re-matches canonical-string-sequence-pattern value)
    (mapv second (re-seq quoted-string-pattern value))
    (parse-mixed-string-sequence value)))

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
