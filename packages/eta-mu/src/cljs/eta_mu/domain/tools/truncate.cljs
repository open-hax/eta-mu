(ns eta-mu.domain.tools.truncate
  "Pure line/byte truncation for tool output.

  Truncation is bounded by two independent limits, whichever is hit first:
  a line count and a byte count."
  (:require [clojure.string :as str]))

(def default-max-lines 2000)
(def default-max-bytes (* 50 1024))

(defn- byte-length [s]
  (.byteLength js/Buffer s "utf-8"))

(defn format-size [bytes]
  (cond
    (< bytes 1024) (str bytes "B")
    (< bytes (* 1024 1024)) (str (.toFixed (/ bytes 1024) 1) "KB")
    :else (str (.toFixed (/ bytes (* 1024 1024)) 1) "MB")))

(defn- fits-under-bytes?
  "Shrink `lines` (in the given direction) until the joined content fits
  `max-bytes`, or is empty."
  [lines max-bytes take-fn]
  (loop [n (count lines)]
    (if (<= n 0)
      {:content "" :truncated-by :bytes}
      (let [candidate (str/join "\n" (take-fn n lines))]
        (if (<= (byte-length candidate) max-bytes)
          {:content candidate :truncated-by :bytes}
          (recur (dec n)))))))

(defn- truncate*
  [content {:keys [max-lines max-bytes]} take-fn]
  (let [max-lines (or max-lines default-max-lines)
        max-bytes (or max-bytes default-max-bytes)
        lines (str/split content #"\n" -1)
        total-lines (count lines)
        total-bytes (byte-length content)]
    (if (and (<= total-lines max-lines) (<= total-bytes max-bytes))
      {:content content :truncated false :truncated-by nil
       :total-lines total-lines :total-bytes total-bytes
       :max-lines max-lines :max-bytes max-bytes}
      (let [line-limited (take-fn max-lines lines)
            by-lines-content (str/join "\n" line-limited)]
        (merge
         {:truncated true :total-lines total-lines :total-bytes total-bytes
          :max-lines max-lines :max-bytes max-bytes}
         (if (<= (byte-length by-lines-content) max-bytes)
           {:content by-lines-content :truncated-by :lines}
           (fits-under-bytes? line-limited max-bytes take-fn)))))))

(defn truncate-head
  "Keep the first `max-lines`/`max-bytes` of `content`, whichever is hit first."
  ([content] (truncate-head content {}))
  ([content opts]
   (truncate* content opts take)))

(defn truncate-tail
  "Keep the last `max-lines`/`max-bytes` of `content`, whichever is hit first."
  ([content] (truncate-tail content {}))
  ([content opts]
   (truncate* content opts take-last)))
