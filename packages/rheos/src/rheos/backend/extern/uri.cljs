(ns rheos.backend.extern.uri
  "Defined ClojureScript values for JavaScript URI operations.")

(defn encode-component
  "Encode one value as a URI component and return a ClojureScript string."
  [value]
  (js/encodeURIComponent (str value)))
