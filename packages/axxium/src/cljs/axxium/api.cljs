(ns axxium.api
  "JavaScript export adapter; domain and plugin entry points remain CLJS-first."
  (:require [axxium.extern.fastify :as fastify]
            [axxium.extern.identity-http :as http]
            [axxium.infra.identity :as identity]
            [axxium.infra.identity-plugin :as descriptions]
            [axxium.extern.identity-plugin :as plugin]))

(defn create-provider
  "Create an opaque Axxium service from JavaScript configuration."
  [options]
  (identity/open! (http/provider-options options)))

(defn ^:async register-routes
  "Register the canonical Axxium login routes on an existing Fastify host."
  [app service]
  (await (plugin/register! app (await (descriptions/routes! service {}))))
  service)

(defn resolve-principal
  "Return a JSON-compatible verified principal, preserving namespaced keys."
  [service token]
  (some-> (identity/resolve-principal service token) fastify/body->js))

(defn request-token
  "Decode a bearer/cookie request through Axxium's HTTP boundary."
  [request]
  (:token (http/request-data request)))
