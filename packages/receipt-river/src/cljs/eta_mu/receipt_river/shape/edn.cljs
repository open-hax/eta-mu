(ns eta-mu.receipt-river.shape.edn
  "EDN morphisms for line-oriented Receipt River storage."
  (:require [cljs.reader :as reader]))

(defn format-line [record]
  (pr-str record))

(defn parse-line [line]
  (reader/read-string line))
