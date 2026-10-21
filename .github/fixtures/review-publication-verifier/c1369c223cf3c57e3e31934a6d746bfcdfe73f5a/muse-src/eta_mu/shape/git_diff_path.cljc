(ns eta-mu.shape.git-diff-path
  "Pure Git patch-header pathname decoding. No filename normalization or I/O."
  (:require [clojure.string :as str]))

(defn- invalid-path []
  (throw (ex-info "Invalid Git diff path: malformed quoting or UTF-8 bytes."
                  {:kind :invalid-git-diff-path})))

(def ^:private octal-digits (zipmap "01234567" (range 8)))
(def ^:private controls (set (map char (concat (range 32) [127]))))
(def ^:private escapes
  {\" "\"", \\ "\\", \a (str (char 7)), \b "\b", \t "\t", \n "\n",
   \v (str (char 11)), \f "\f", \r "\r"})

(defn- codepoint-text [cp]
  (if (<= cp 65535)
    (str (char cp))
    (let [n (- cp 65536)]
      (str (char (+ 55296 (bit-shift-right n 10)))
           (char (+ 56320 (bit-and n 1023)))))))

(defn- utf8-text [bytes]
  (loop [remaining (seq bytes), out []]
    (if-let [b (first remaining)]
      (let [[width mask minimum] (cond
                                   (< b 128) [1 127 0]
                                   (<= 194 b 223) [2 31 128]
                                   (<= 224 b 239) [3 15 2048]
                                   (<= 240 b 244) [4 7 65536]
                                   :else (invalid-path))
            chunk (take width remaining)]
        (when-not (and (= width (count chunk))
                       (every? #(<= 128 % 191) (rest chunk)))
          (invalid-path))
        (let [cp (reduce (fn [n tail] (+ (* n 64) (bit-and tail 63)))
                         (bit-and b mask) (rest chunk))]
          (when (or (zero? cp) (< cp minimum) (> cp 1114111) (<= 55296 cp 57343))
            (invalid-path))
          (recur (drop width remaining) (conj out (codepoint-text cp)))))
      (apply str out))))

(defn- octal-byte [digits]
  (let [b (reduce (fn [n digit] (+ (* n 8) (get octal-digits digit))) 0 digits)]
    (if (<= b 255) b (invalid-path))))

(defn- unquote-path [token]
  (loop [i 1, out []]
    (let [c (nth token i nil)]
      (cond
        (nil? c) (invalid-path)

        (= c \")
        (if (= i (dec (count token))) (apply str out) (invalid-path))

        (= c \\)
        (let [escape (nth token (inc i) nil)]
          (if-let [text (get escapes escape)]
            (recur (+ i 2) (conj out text))
            (if-let [octals (re-find #"^(?:\\[0-7]{3})+" (subs token i))]
              (let [bytes (map (comp octal-byte second) (re-seq #"\\([0-7]{3})" octals))]
                (recur (+ i (count octals)) (conj out (utf8-text bytes))))
              (invalid-path))))

        (contains? controls c) (invalid-path)
        :else (recur (inc i) (conj out c))))))

(defn normalize
  "Decode a Git +++ header path to its exact repository filename, or nil for
   /dev/null. C-octal escapes encode bytes, not Unicode codepoints. Throws on
  malformed input so a review cannot silently omit an unindexed file."
  [header-path]
  (when-not (string? header-path) (invalid-path))
  ;; Git appends a structural TAB to unquoted headers containing spaces.
  ;; Real TABs in filenames are C-quoted; never trim filename whitespace.
  (let [token (if (str/ends-with? header-path "\t")
                (subs header-path 0 (dec (count header-path))) header-path)
        path (if (str/starts-with? token "\"")
               (unquote-path token)
               (if (some #(or (contains? controls %) (= % \") (= % \\)) token)
                 (invalid-path) token))
        path (if (str/starts-with? path "b/") (subs path 2) path)]
    (when (empty? path) (invalid-path))
    (when-not (= path "/dev/null") path)))
