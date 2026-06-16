(ns eta-mu.ai.extern.js)

(defn value->clj
  "Decode a JavaScript value into keywordized CLJS data at the AI boundary."
  [value]
  (js->clj value :keywordize-keys true))

(defn object->clj
  "Decode a possibly nil JavaScript object into a keywordized CLJS map."
  [value]
  (js->clj (or value #js {}) :keywordize-keys true))

(defn clj->value
  "Encode CLJS data as a JavaScript value at the AI boundary."
  [value]
  (clj->js value))
