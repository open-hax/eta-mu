(ns open-hax.sol.infra.core
  "Minimal Sol core: exposes route and WebSocket registration helpers."
  (:require [open-hax.sol.infra.routes.app :as app-routes]
            [open-hax.sol.domain.realtime :as realtime]
            [open-hax.sol.infra.config :as runtime-config]
            [open-hax.sol.domain.models :as runtime-models]
            [open-hax.sol.extern.process :as process]
            [open-hax.sol.runtime.state :as runtime-state]))

(defonce server* (atom nil))

(defn register-ws-routes!
  [runtime app]
  (realtime/register-ws-routes! runtime app (fn [] 0) (atom [])))

(defn config-js
  []
  (clj->js (runtime-models/enrich-config (runtime-config/cfg) process/env-var)))

(defn register-app-routes!
  [runtime app config]
  (let [resolved-config (runtime-models/enrich-config
                         (if (map? config) config (runtime-config/cfg))
                         process/env-var)]
    (reset! runtime-state/config* resolved-config)
    (reset! runtime-state/runtime* runtime)
    (app-routes/register-routes! runtime app resolved-config)))

(defn ^:async start!
  [runtime]
  (when-not @server*
    (let [config (runtime-models/enrich-config (runtime-config/cfg) process/env-var)
          Fastify (js/require "fastify")
          app (Fastify #js {:logger #js {:stream (.-stderr js/process)}})]
      (reset! runtime-state/config* config)
      (reset! runtime-state/runtime* runtime)
      (register-app-routes! runtime app config)
      (register-ws-routes! runtime app)
      (await (.listen app #js {:host (:host config) :port (:port config)}))
      (reset! server* app)
      (.info (.-log app) (str "Sol backend CLJS listening on " (:host config) ":" (:port config))))))
