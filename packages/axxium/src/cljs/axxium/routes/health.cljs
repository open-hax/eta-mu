(ns axxium.routes.health
  "Retained database health decisions, with native HTTP operations in extern."
  (:require [axxium.db :as db]
            [axxium.extern.legacy-http :as http]))

(defn- ^:async health [_request]
  (try
    (await (db/query "SELECT 1 as ping" []))
    {:body {:status "ok" :service "axxium" :version "0.1.0"}}
    (catch :default error
      {:status 503 :body {:status "error" :service "axxium"
                          :error (get-in (http/error-data error "Database unavailable") [:body :error])}})))

(def register-health-routes!
  "Register health and portal routes through the compatible native entry point."
  (http/route-registrar
   [{:method "GET" :path "/health" :handler (http/handler health {})}
    {:method "GET" :path "/" :handler (http/handler (fn [_] {:redirect "/portal/index.html"}) {})}]))
