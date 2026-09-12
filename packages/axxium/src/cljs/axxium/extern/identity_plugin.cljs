(ns axxium.extern.identity-plugin
  "Native Fastify registration boundary for the Axxium route descriptions."
  (:require [axxium.extern.identity-http :as http]
            [axxium.law.identity-http :as law]))

(defn ^:async register!
  "Register Axxium on an embedding host; the native app stays at this edge."
  [app descriptions]
  (await (http/ensure-cookies! app))
  (let [{:keys [origin routes]} (law/require-routes! descriptions)]
    (doseq [{:keys [method path handler]} routes]
      (http/register! app method path origin handler)))
  nil)
