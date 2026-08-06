(ns eta-mu.receipt-river.extern.glob
  "Raw JavaScript regular-expression boundary for discovery exclusion globs."
  (:require [clojure.string :as str]))

(defn- escape-character [character]
  (if (re-find #"[.+^${}()|\[\]\\]" character)
    (str "\\" character)
    character))

(defn- pattern->regex
  [pattern]
  (let [translated
        (loop [remaining pattern
               result ""]
          (cond
            (empty? remaining)
            result

            (= "/**" remaining)
            (str result "(?:/.*)?")

            (str/starts-with? remaining "**/")
            (recur (subs remaining 3) (str result "(?:.*/)?"))

            (str/starts-with? remaining "**")
            (recur (subs remaining 2) (str result ".*"))

            (str/starts-with? remaining "*")
            (recur (subs remaining 1) (str result "[^/]*"))

            (str/starts-with? remaining "?")
            (recur (subs remaining 1) (str result "[^/]"))

            :else
            (recur (subs remaining 1)
                   (str result (escape-character (subs remaining 0 1))))))]
    (js/RegExp. (str "^" translated "$"))))

(defn matches-any?
  [path patterns]
  (boolean
   (some #(.test (pattern->regex %) path) patterns)))
