(ns eta-mu.garden.extern.js)

(defn value->clj
  "Decode a JavaScript value into keywordized CLJS data at a named boundary."
  [value]
  (js->clj value :keywordize-keys true))

(defn object->clj
  "Decode a possibly nil JavaScript object into a keywordized CLJS map."
  [value]
  (js->clj (or value #js {}) :keywordize-keys true))

(defn array->clj-vector
  "Decode a possibly nil JavaScript array into a CLJS vector."
  [value]
  (vec (js->clj (or value #js []) :keywordize-keys true)))

(defn clj->value
  "Encode CLJS data as a JavaScript value at a named boundary."
  [value]
  (clj->js value))

(defn encode-uri-component
  "URL-encode a string using the host's `encodeURIComponent`."
  [s]
  (js/encodeURIComponent (str s)))

(defn finite-number?
  "Return true when `n` is a finite number."
  [n]
  (and (number? n)
       (not (js/isNaN n))
       (js/Number.isFinite n)))
