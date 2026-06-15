(ns eta-mu.docs.domain.markdown
  (:require [clojure.string :as str]))

(defn normalize-tag
  "Normalize a tag string by trimming, removing leading `#`, brackets,
   surrounding quotes, and lowercasing."
  [value]
  (-> (str value)
      str/trim
      (str/replace #"^#" "")
      (str/replace #"^\[|\]$" "")
      (str/replace #"^['\"]|['\"]$" "")
      str/trim
      str/lower-case))

(defn normalize-wikilink-key
  "Normalize a wikilink target for indexing."
  [target]
  (-> (str target)
      str/trim
      (str/replace #"\s+" " ")
      str/lower-case))

(defn strip-fenced-code-blocks
  "Replace lines inside triple-backtick fenced code blocks with empty strings.
   The fence lines themselves are also replaced with empty strings."
  [markdown]
  (let [lines (str/split-lines (str markdown))]
    (loop [in-fence false
           remaining lines
           out []]
      (if (empty? remaining)
        (str/join "\n" out)
        (let [line (first remaining)
              toggled (str/starts-with? (str/trim line) "```")]
          (if toggled
            (recur (not in-fence) (rest remaining) (conj out ""))
            (recur in-fence (rest remaining) (conj out (if in-fence "" line)))))))))

(defn extract-headings
  "Extract markdown ATX headings from text."
  [text]
  (let [lines (str/split-lines (str text))]
    (vec
     (for [line lines
           :let [m (re-matches #"^(#{1,6})\s+(.+)$" line)]
           :when m]
       {:level (count (nth m 1))
        :title (str/trim (nth m 2))}))))

(defn- regex-matches
  "Return a vector of maps containing :match, :groups, and :index for each
   match of `re` against `s` using only pure ClojureScript string operations."
  [re s]
  (let [matches (re-seq re s)]
    (loop [matches matches
           pos 0
           out []]
      (if (empty? matches)
        out
        (let [m (first matches)
              match-str (first m)
              idx (str/index-of s match-str pos)]
          (if (nil? idx)
            (recur (rest matches) pos out)
            (recur (rest matches) (inc idx) (conj out {:match match-str
                                                        :groups (vec (rest m))
                                                        :index idx}))))))))

(defn extract-inline-tags
  "Extract `#tag` tokens from inline text."
  [text]
  (let [s (str text)]
    (->> (regex-matches #"(^|\s)#([a-zA-Z0-9_-]{1,64})\b" s)
         (map #(normalize-tag (second (:groups %))))
         (filter seq)
         vec)))

(defn extract-hashtags-lines
  "Extract tags from dedicated `#hashtags:` lines."
  [text]
  (let [lines (str/split-lines (str text))]
    (vec
     (for [line lines
           :let [m (re-matches #"^#hashtags:\s*(.*)$" line)]
           :when m
           raw (str/split (str/trim (second m)) #"\s+")
           :when (str/starts-with? raw "#")
           :let [t (normalize-tag raw)]
           :when (seq t)]
       t))))

(defn extract-wikilinks
  "Extract `[[target|alias]]` wikilinks from text.
   Returns a vector of maps with :target, :alias, :raw, and :index."
  [text]
  (let [s (str text)]
    (vec
     (for [{:keys [groups index]} (regex-matches #"\[\[([^\]]+)\]\]" s)
           :let [raw-inner (str/trim (first groups))]
           :when (seq raw-inner)
           :let [parts (str/split raw-inner #"\|")
                 target (str/trim (first parts))
                 alias (str/trim (or (second parts) ""))]]
       {:target target
        :alias alias
        :raw raw-inner
        :index index}))))

(defn extract-markdown-links
  "Extract `[text](url)` markdown links from text.
   Returns a vector of maps with :url, :text, and :index."
  [text]
  (let [s (str text)]
    (vec
     (for [{:keys [groups index]} (regex-matches #"(^|[^!])\[([^\]]+)\]\(([^)]+)\)" s)
           :let [label (str/trim (second groups))
                 url (str/trim (nth groups 2))]
           :when (seq url)]
       {:url url
        :text label
        :index index}))))

(defn line-number-at
  "Return the 1-based line number for `index` within `text`."
  [text index]
  (let [s (str text)
        limit (min (max 0 (or index 0)) (count s))]
    (inc (count (filter #(= % \newline) (take limit s))))))

(defn basename
  "Return the last path segment of `path` using only string operations."
  [path]
  (let [normalized (str/replace (str path) #"\\" "/")
        parts (str/split normalized #"/")]
    (or (last parts) "")))
