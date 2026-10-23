;; SPDX-License-Identifier: GPL-3.0-or-later
(ns antigravity.shape.diff
  "Added-line coordinates from a Git zero-context diff of one already known path."
  (:require [clojure.string :as str]))

(defn added-lines [patch]
  (loop [lines (str/split-lines patch) coordinate nil found #{}]
    (if-let [line (first lines)]
      (if-let [[_ start] (re-find #"^@@ -[0-9]+(?:,[0-9]+)? \+([0-9]+)(?:,[0-9]+)? @@" line)]
        (recur (rest lines) (parse-long start) found)
        (cond
          (nil? coordinate) (recur (rest lines) nil found)
          (str/starts-with? line "+") (recur (rest lines) (inc coordinate) (conj found coordinate))
          (or (str/starts-with? line "-") (str/starts-with? line "\\")) (recur (rest lines) coordinate found)
          :else (recur (rest lines) (inc coordinate) found)))
      found)))
