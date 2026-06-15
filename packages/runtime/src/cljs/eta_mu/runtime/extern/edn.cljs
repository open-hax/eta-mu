(ns eta-mu.runtime.extern.edn
  (:require [cljs.reader :as reader]
            [eta-mu.runtime.extern.js :as extern-js]))

(defn parse
  "Parse an EDN string into keywordized CLJS data."
  [text]
  (try
    (extern-js/success :edn (reader/read-string text))
    (catch js/Error error
      (extern-js/error :edn "Invalid EDN" (.-name error) (.-message error)))))
