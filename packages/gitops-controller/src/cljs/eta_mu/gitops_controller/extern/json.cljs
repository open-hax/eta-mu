(ns eta-mu.gitops-controller.extern.json
  "JSON boundary. JSON is decoded only after webhook authenticity is proven.")

(defn- json-key [value]
  (if-let [key-ns (namespace value)]
    (str key-ns "/" (name value))
    (name value)))

(defn parse-bytes [bytes]
  (-> (.toString bytes "utf8")
      js/JSON.parse
      (js->clj :keywordize-keys true)))

(defn encode [value]
  (js/JSON.stringify (clj->js value :keyword-fn json-key)))

(defn decode [value]
  (-> value js/JSON.parse (js->clj :keywordize-keys true)))
