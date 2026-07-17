(ns eta-mu.domain.tools.edit
  "Pure exact-string replacement with a uniqueness check for the edit tool."
  (:require [clojure.string :as str]))

(defn- occurrences
  "Count non-overlapping occurrences of `needle` in `content`."
  [content needle]
  (loop [idx 0 n 0]
    (let [found (str/index-of content needle idx)]
      (if found
        (recur (+ found (count needle)) (inc n))
        n))))

(defn apply-edit
  "Replace the unique occurrence of `old-text` in `content` with `new-text`.

  Returns `{:content string}` on success, or `{:error :no-op|:not-found|:not-unique
  :count n}` on failure. `old-text` must appear in `content` exactly once."
  [content old-text new-text]
  (cond
    (= old-text new-text)
    {:error :no-op}

    :else
    (let [n (occurrences content old-text)]
      (cond
        (zero? n) {:error :not-found}
        (> n 1) {:error :not-unique :count n}
        :else {:content (str/replace-first content old-text new-text)}))))
