(ns eta-mu.gitops-controller.extern.fastify
  "Narrow Fastify boundary."
  (:require ["fastify" :default Fastify]))

(defn app []
  (Fastify #js {:logger false
                :disableRequestLogging true}))

(defn install-raw-json-parser! [app body-limit]
  (.removeContentTypeParser app "application/json")
  (.addContentTypeParser
   app
   "application/json"
   #js {:parseAs "buffer" :bodyLimit body-limit}
   (fn [_request body done]
     (done nil body)))
  app)

(defn request-header [request name]
  (aget (.-headers request) name))

(defn request-body [request]
  (.-body request))

(defn send! [reply status body]
  (.send (.code reply status) (clj->js body)))

(defn register-get! [app path handler]
  (.get app path handler))

(defn register-post! [app path handler]
  (.post app path handler))

(defn ^:async listen! [app host port]
  (await (.listen app #js {:host host :port port})))

(defn ^:async close! [app]
  (await (.close app)))
