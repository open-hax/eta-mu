(ns axxium.routes.health
  "Health check and system routes."
  (:require [axxium.db :as db]))

(defn- ^:async handle-health [_req reply]
  (try
    (await (db/query "SELECT 1 as ping" []))
    (.send reply (clj->js {:status "ok"
                              :service "axxium"
                              :version "0.1.0"}))
    (catch :default err
      (.send (.code reply 503)
             (clj->js {:status "error"
                          :service "axxium"
                          :error (.-message err)})))))

(defn- handle-root [_req reply]
  (.redirect reply "/portal/index.html"))

(defn register-health-routes!
  "Register health and system routes."
  [app]
  (.get app "/health" handle-health)
  (.get app "/" handle-root))
