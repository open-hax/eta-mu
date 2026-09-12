(ns axxium.server
  "Standalone Axxium identity service; the same plugin is embedded by Knoxx."
  (:require [axxium.extern.identity-host :as host]
            [axxium.extern.identity-http :as http]
            [axxium.infra.identity :as identity]
            [axxium.infra.identity-plugin :as plugin]))

(defn environment-options
  "Explicit environment configuration for local EDN identity and optional OAuth providers."
  []
  (let [origin (or (host/env "AXXIUM_PUBLIC_BASE_URL") "http://localhost:8787")]
    {:provider :edn
     :directory (or (host/env "AXXIUM_EDN_DIRECTORY") ".ημ/axxium")
     :public-base-url (http/origin origin)
     :rp-id (http/hostname origin)
     :providers {:github {:client-id (host/env "GITHUB_OAUTH_CLIENT_ID")
                          :client-secret (host/env "GITHUB_OAUTH_CLIENT_SECRET")}
                 :discord {:client-id (host/env "DISCORD_OAUTH_CLIENT_ID")
                           :client-secret (host/env "DISCORD_OAUTH_CLIENT_SECRET")}
                 :google {:client-id (host/env "GOOGLE_OAUTH_CLIENT_ID")
                          :client-secret (host/env "GOOGLE_OAUTH_CLIENT_SECRET")}
                 :atproto {:client-id (host/env "ATPROTO_OAUTH_CLIENT_ID")}}}))

(defn ^:async start!
  "Start the actual identity plugin with no database server prerequisite."
  []
  (try
    (let [service (identity/open! (environment-options))
          app (http/create-app)]
      (await (plugin/register! app service {}))
      (http/register! app "GET" "/health" (fn [_ reply] (http/send! reply 200 {:ok true :service "axxium" :provider "edn"})))
      (http/log! (str "Axxium listening on "
                      (await (http/listen! app (or (host/env "AXXIUM_HOST") "127.0.0.1")
                                           (or (some-> (host/env "AXXIUM_PORT") parse-long) 8787))))))
    (catch :default _error
      (http/log! "Axxium could not start; validate identity storage and provider configuration")
      (http/exit! 1))))
