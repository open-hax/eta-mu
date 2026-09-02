(ns eta-mu.gitops-controller.extern.uri
  "Narrow JavaScript URI-encoding boundary.")

(defn encode-component [value]
  (js/encodeURIComponent value))
