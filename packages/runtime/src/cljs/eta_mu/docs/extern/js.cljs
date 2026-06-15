(ns eta-mu.docs.extern.js)

(defn value->clj
  "Decode a JavaScript value into keywordized CLJS data at the docs boundary."
  [value]
  (js->clj value :keywordize-keys true))

(defn clj->value
  "Encode CLJS data as a JavaScript value at the docs boundary."
  [value]
  (clj->js value))
