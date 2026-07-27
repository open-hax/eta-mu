(ns axxium.extern.fastify
  "Narrow Fastify JS boundary for Axxium routes.")

(defn request-param
  [request name]
  (some-> request
          (aget "params")
          (aget name)))

(defn- json-key
  [key]
  (if-let [key-ns (namespace key)]
    (str key-ns "/" (name key))
    (name key)))

(defn body->js
  "Convert CLJS response data without dropping keyword namespaces.
   Canonical runtime-binding keys therefore remain `principal/actor-id`, etc."
  [body]
  (clj->js body :keyword-fn json-key))

(defn send-json!
  [reply status body]
  (let [target (if status (.code reply status) reply)]
    (.send target (body->js body))))

(defn register-get!
  [app path handler]
  (.get app path handler))