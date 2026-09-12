(ns rheos.backend.shape.frontmatter
  (:require [clojure.string :as str]))

(def ^:private unsupported ::unsupported)

(defn- plain-string [value]
  (let [value (str/trim value)]
    (when-not (or (contains? #{"true" "false" "null"} (str/lower-case value))
                  (re-find #":[ \t]|:$" value))
      value)))

(defn- character-at [text index]
  (when (< index (count text)) (subs text index (inc index))))

(defn- matching-character? [pattern text index]
  (when-let [character (character-at text index)]
    (some? (re-matches pattern character))))

(defn- skip-whitespace [text start]
  (loop [index start]
    (if (matching-character? #"[ \t]" text index)
      (recur (inc index))
      index)))

(defn- plain-member-end [text start]
  (loop [index (inc start)]
    (if (matching-character? #"[A-Za-z0-9_./: \t-]" text index)
      (recur (inc index))
      index)))

(defn- sequence-member [text start]
  (cond
    (= "\"" (character-at text start))
    (when-let [end (str/index-of text "\"" (inc start))]
      {:value (subs text (inc start) end) :next (inc end)})

    (matching-character? #"[A-Za-z_]" text start)
    (let [end (plain-member-end text start)]
      (when-let [value (plain-string (subs text start end))]
        {:value value :next end}))

    :else nil))

(defn parse-canonical-string-sequence
  "Decode Rheos's supported YAML subset for one single-line string sequence.

   Quoted members and plain word/path labels can be mixed. Plain booleans,
   nulls, numeric values, mappings, and nested collections remain unsupported.
   The scanner advances monotonically, including on malformed whitespace-heavy
   input, so synchronous card reads never retry overlapping whitespace matches.
   Physical LF, CR and form feed are refused, including inside quoted members.
   Returns nil for syntax outside that subset."
  [text]
  (when (and (= "[" (character-at text 0))
             (not (re-find #"[\r\n\f]" text)))
    (let [start (skip-whitespace text 1)]
      (if (= "]" (character-at text start))
        (when (= (skip-whitespace text (inc start)) (count text)) [])
        (loop [index start members []]
          (when-let [{:keys [value] next-index :next} (sequence-member text index)]
            (let [end (skip-whitespace text next-index)
                  members (conj members value)]
              (case (character-at text end)
                "," (recur (skip-whitespace text (inc end)) members)
                "]" (when (= (skip-whitespace text (inc end)) (count text)) members)
                nil))))))))

(defn- flat-value [raw]
  (let [value (str/trim raw)]
    (cond
      (empty? value) unsupported
      (or (str/starts-with? value "|")
          (str/starts-with? value ">")
          (str/starts-with? value "{")) unsupported
      (str/starts-with? value "[")
      ;; Keep the original sequence suffix so trimming cannot erase forbidden
      ;; control whitespace before the shared decoder sees it.
      (or (parse-canonical-string-sequence (str/replace raw #"^[ \t]+" "")) unsupported)
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
