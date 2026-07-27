(ns axxium.extern.fastify
  "Narrow Fastify JS boundary for Axxium routes.")

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
