(ns eta-mu.domain.tools.glob
  "Pure glob-pattern matching for the `find`/`grep` tools.

  Supports `*` (any chars except `/`), `**` (any chars including `/`), `?`
  (one char except `/`), and literal path segments — the common subset used
  by real-world glob patterns like `*.ts`, `**/*.json`, `src/**/*.spec.ts`."
  (:require [clojure.string :as str]))

(defn- escape-regex-char [c]
  (if (re-find #"[.*+?^${}()|\[\]\\]" c) (str "\\" c) c))

(defn- pattern->regex-source [pattern]
  (loop [chars (seq pattern) out ""]
    (if (empty? chars)
      out
      (let [c (first chars)]
        (cond
          (and (= c \*) (= (second chars) \*))
          (recur (drop 2 chars) (str out ".*"))

          (= c \*)
          (recur (rest chars) (str out "[^/]*"))

          (= c \?)
          (recur (rest chars) (str out "[^/]"))

          :else
          (recur (rest chars) (str out (escape-regex-char (str c)))))))))

(defn glob->regex
  "Compile a glob pattern into a JS RegExp anchored to the full string."
  [pattern]
  (js/RegExp. (str "^" (pattern->regex-source pattern) "$")))

(defn match?
  "Test whether `relative-path` (posix-separated) matches `pattern`."
  [pattern relative-path]
  (.test (glob->regex pattern) relative-path))

(defn ignored?
  "Test whether `relative-path` should be excluded given a set of simple
  ignore patterns (as found in a `.gitignore`: literal names, globs, or
  `/`-rooted paths). This is a best-effort approximation of `.gitignore`
  semantics — not a full spec implementation — that matches a slash-free
  pattern against any path segment (so a bare directory name like `dist`
  excludes everything under it, the same as a real `.gitignore`), or a
  pattern containing `/` against the full relative path."
  [ignore-patterns relative-path]
  (let [segments (str/split relative-path #"/")]
    (boolean
     (some (fn [raw-pattern]
             (let [rooted? (str/starts-with? raw-pattern "/")
                   pattern (str/replace (cond-> raw-pattern
                                          rooted? (subs 1)
                                          (str/ends-with? raw-pattern "/") (subs 0 (dec (count raw-pattern))))
                                        #"^/+|/+$" "")]
               (if (str/includes? pattern "/")
                 (match? pattern relative-path)
                 (some #(match? pattern %) segments))))
           ignore-patterns))))

(defn parse-gitignore
  "Parse `.gitignore`-style text into a vector of pattern strings, dropping
  blank lines and comments. Negation (`!pattern`) is not supported."
  [text]
  (into []
        (comp (map str/trim)
              (remove str/blank?)
              (remove #(str/starts-with? % "#"))
              (remove #(str/starts-with? % "!")))
        (str/split-lines (or text ""))))
