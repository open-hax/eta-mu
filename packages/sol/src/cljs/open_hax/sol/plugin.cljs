(ns open-hax.sol.plugin
  "Fastify plugin entrypoint for embedding the Sol backend in another server."
  (:require [open-hax.sol.infra.core :as core]
            [open-hax.sol.infra.http-server :as http-server]))

(defn ^:async sol-plugin
  "Fastify plugin. Expects JS opts with optional `runtime` and `config` keys."
  [instance raw-opts done]
  (let [opts (js->clj raw-opts :keywordize-keys true)
        runtime (or (:runtime opts) #js {})
        config (:config opts)]
    (http-server/ensure-json-empty-body-parser! instance)
    (await (http-server/register-default-plugins! instance))
    (core/register-ws-routes! runtime instance)
    (core/register-app-routes! runtime instance config)
    (when (fn? done)
      (done))))
