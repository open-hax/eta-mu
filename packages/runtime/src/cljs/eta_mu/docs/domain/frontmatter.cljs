(ns eta-mu.docs.domain.frontmatter
  (:require [clojure.string :as str]))

(defn parse-frontmatter
  "Split a markdown string into frontmatter text (without fences) and body.
   Mirrors the behavior of the legacy Node implementation."
  [text]
  (let [raw (str text)]
    (if-not (str/starts-with? raw "---")
      {:frontmatter "" :body raw}
      (let [lines (str/split-lines raw)]
        (if-not (= (str/trim (first lines)) "---")
          {:frontmatter "" :body raw}
          (let [end (loop [i 1]
                      (cond
                        (>= i (count lines)) -1
                        (= (str/trim (nth lines i)) "---") i
                        :else (recur (inc i))))]
            (if (= end -1)
              {:frontmatter "" :body raw}
              {:frontmatter (str/join "\n" (subvec lines 1 end))
               :body (str/join "\n" (subvec lines (inc end)))})))))))

(defn parse-frontmatter-scalar
  "Extract a single scalar value for `key` from a frontmatter string."
  [frontmatter key]
  (let [fm (str frontmatter)
        pattern (re-pattern (str key ": \\s*(.+)\\s*"))
        lines (str/split-lines fm)]
    (or (some #(when-let [m (re-matches pattern (str/trim %))]
                 (-> (second m)
                     str/trim
                     (str/replace #"^['\"]|['\"]$" "")))
              lines)
        "")))

(defn parse-frontmatter-tags
  "Extract the tags list from a frontmatter string.
   Supports inline `[a, b]` syntax and YAML list syntax."
  [frontmatter]
  (let [fm (str frontmatter)
        lines (str/split-lines fm)]
    (loop [i 0]
      (if (>= i (count lines))
        []
        (let [line (nth lines i)
              m (re-matches #"^tags:\s*(.*)\s*$" line)]
          (if-not m
            (recur (inc i))
            (let [rest (str/trim (second m))]
              (if (and (str/starts-with? rest "[") (str/ends-with? rest "]"))
                (->> (str/split (subs rest 1 (dec (count rest))) #",")
                     (map #(-> % str/trim (str/replace #"^['\"]|['\"]$" "")))
                     (filter seq)
                     vec)
                (loop [j (inc i)
                       out []]
                  (if (>= j (count lines))
                    out
                    (let [li (nth lines j)
                          mm (re-matches #"^\s*-\s*(.+)\s*$" li)]
                      (if-not mm
                        out
                        (let [t (-> (second mm)
                                    str/trim
                                    (str/replace #"^['\"]|['\"]$" ""))]
                          (recur (inc j) (if (seq t) (conj out t) out)))))))))))))))
