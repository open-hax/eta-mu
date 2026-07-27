(ns axxium.extern.fastify
  "Narrow Fastify JS boundary for Axxium routes."
  (:require [clojure.walk :as walk]))

(defn request-param
  [request name]
  (some-> request
          (aget "params")
          (aget name)))

(defn send-json!
  [reply status body]
  (let [target (if status (.code reply status) reply)]
    (.send target (clj->js body))))

(defn register-get!
  [app path handler]
  (.get app path handler))

(defn keywordize-row
  "Convert a JS database row when an extern caller receives one directly."
  [value]
  (when value
    (walk/keywordize-keys (js->clj value))))
