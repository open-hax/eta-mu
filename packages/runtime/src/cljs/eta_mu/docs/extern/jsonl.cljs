(ns eta-mu.docs.extern.jsonl
  (:require [clojure.string :as str]
            [eta-mu.docs.extern.fs :as fs]
            [eta-mu.docs.extern.js :as extern-js]))

(defn read-json
  "Read a single JSON object from `file-path` and return keywordized CLJS data."
  [file-path]
  (let [raw (fs/read-file file-path)]
    (extern-js/value->clj (js/JSON.parse raw))))

(defn write-json
  "Write `value` as a single JSON object to `file-path`."
  [file-path value]
  (fs/write-file file-path (js/JSON.stringify (extern-js/clj->value value))))

(defn- object-record?
  "Return true when `value` is a non-null object (not an array)."
  [value]
  (and (map? value) (not (vector? value))))

(defn read-jsonl
  "Read JSONL rows from `file-path`, returning a vector of keywordized maps.
   Blank lines are ignored. Non-blank lines that are invalid JSON or not JSON
   objects cause an error with a clear message including the offending line."
  [file-path]
  (if-not (fs/file-exists? file-path)
    []
    (let [raw (fs/read-file file-path)
          lines (str/split-lines raw)]
      (vec
       (keep-indexed (fn [idx line]
                       (let [s (str/trim line)]
                         (when (seq s)
                           (try
                             (let [row (extern-js/value->clj (js/JSON.parse s))]
                               (if (object-record? row)
                                 row
                                 (throw (js/Error. (str "JSONL row " (inc idx) " is not an object: " s)))))
                             (catch js/Error e
                               (throw (js/Error. (str "JSONL row " (inc idx) " is invalid JSON: " s " (" (.-message e) ")"))))))))
                     lines)))))

(defn write-jsonl
  "Write `rows` as newline-delimited JSON to `file-path`.
   Non-array values are treated as an empty vector."
  [file-path rows]
  (let [safe-rows (if (vector? rows) rows [])
        lines (map #(js/JSON.stringify (extern-js/clj->value %)) safe-rows)
        text (if (seq safe-rows)
               (str (str/join "\n" lines) "\n")
               "")]
    (fs/write-file file-path text)))
