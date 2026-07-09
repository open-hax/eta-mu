(ns eta-mu.contracts.output.extern.js)

(defn parse-int
  "Parse an integer from a string using radix 10."
  [s]
  (js/parseInt s 10))

(defn now-iso
  "Return the current UTC time as an ISO-8601 string."
  []
  (.toISOString (js/Date.)))
