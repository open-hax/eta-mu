(ns open-hax.sol.bootstrap
  "Startup orchestration for the Sol CLJS backend.

   Contract:
   - shadow-cljs calls open-hax.sol.entrypoint/init.
   - Node/npm modules are required by the CLJS namespaces that consume them.
   - This namespace orchestrates startup and manages the HTTP lifecycle."
  (:require [open-hax.sol.contract-runtime-deps :as contract-runtime-deps]
            [open-hax.sol.infra.agent.run-state :as run-state]
            [open-hax.sol.infra.agent.session-store :as session-store]
            [open-hax.sol.infra.core :as core]
            [open-hax.sol.infra.graceful-shutdown :as graceful-shutdown]
            [open-hax.sol.infra.http-server :as http-server]
            [open-hax.sol.infra.lifecycle :as lifecycle]
            [open-hax.sol.infra.config :as runtime-config]
            [open-hax.sol.domain.models :as runtime-models]
            [open-hax.sol.domain.node.path :as path]
            [open-hax.sol.runtime.state :as runtime-state]))

(defn- process-uptime-ms
  []
  (js/Math.round (* 1000 (.uptime js/process))))

(defn- notify-ready!
  []
  (let [send-fn (aget js/process "send")
        connected? (aget js/process "connected")]
    (cond
      (fn? send-fn)
      (try
        (.call send-fn js/process "ready")
        (.log js/console "[sol-bootstrap] sent pm2 ready signal"
              (when-not connected?
                " (process.connected was false)"))
        true
        (catch :default err
          (.warn js/console "[sol-bootstrap] failed to send pm2 ready signal" err)
          false))

      :else
      (do
        (.log js/console "[sol-bootstrap] process.send unavailable; skipping pm2 ready signal")
        false))))

(defn- add-request-debug-hook!
  [app]
  (http-server/add-hook! app "onRequest"
    (fn [req _reply done]
      (when-let [len (aget (.-headers req) "content-length")]
        (when (> (js/parseInt len 10) (* 900 1024))
          (js/console.warn "[sol] large request" (.-url req) len "bytes")))
      (done))))

(defn- register-ws-routes-plugin!
  [runtime app]
  (.register app
             (fn [instance _opts done]
               (core/register-ws-routes! runtime instance)
               (done))))

(defn- register-http-routes!
  [runtime app cfg]
  (core/register-app-routes! runtime app cfg))

(defn- handle-app-listening!
  [_runtime app cfg]
  (lifecycle/remember-app! app)
  (graceful-shutdown/install! app cfg)
  (notify-ready!)
  (let [^js log (.-log app)]
    (.info log (str "Sol backend CLJS listening on " (:host cfg) ":" (:port cfg)))
    app))

(defn ^:async start-http!
  "Create a fresh Fastify app and bind HTTP routes around durable runtime state."
  [runtime cfg]
  (runtime-state/remember-context! runtime cfg nil)
  (let [app (http-server/create-app!)]
    (http-server/ensure-json-empty-body-parser! app)
    (add-request-debug-hook! app)
    (await (http-server/register-default-plugins! app))
    (await (register-ws-routes-plugin! runtime app))
    (await (register-http-routes! runtime app cfg))
    (await (http-server/listen! app (:host cfg) (:port cfg)))
    (handle-app-listening! runtime app cfg)))

(defn ^:async bootstrap!
  "Main entrypoint called by shadow-cljs."
  []
  (let [cfg (contract-runtime-deps/inject-deps!
             (runtime-models/enrich-config (runtime-config/cfg)))
        base-dir (path/join (path/cwd) ".ημ" "sol")
        session-store (session-store/create-edn-session-store (path/join base-dir "sessions"))
        run-state-store (run-state/create-edn-run-state-store (path/join base-dir "runs"))]
    (session-store/set-default-store! session-store)
    (run-state/set-default-store! run-state-store)
    (let [runtime #js {:sessionStore session-store :runStateStore run-state-store}]
      (lifecycle/remember-context! runtime cfg nil false)
      (try
        (await (start-http! runtime cfg))
        (catch :default err
          (.error js/console "Sol backend failed to start" err)
          (js/process.exit 1))))))

(defn ^:async ^:dev/before-load-async stop-http-before-load!
  [done]
  (.log js/console "[sol-hot-reload] before-load: closing HTTP server"
        #js {:pid (.-pid js/process)
             :uptimeMs (process-uptime-ms)})
  (try
    (await (lifecycle/close-current-http!))
    (.log js/console "[sol-hot-reload] before-load: HTTP server closed"
          #js {:pid (.-pid js/process)
               :uptimeMs (process-uptime-ms)})
    (catch :default err
      (.error js/console "[sol-hot-reload] failed to close HTTP server" err))
    (finally (done))))

(defn ^:async ^:dev/after-load-async start-http-after-load!
  [done]
  (.log js/console "[sol-hot-reload] after-load: starting HTTP server"
        #js {:pid (.-pid js/process)
             :uptimeMs (process-uptime-ms)})
  (let [{:keys [runtime]} (lifecycle/context)
        config (contract-runtime-deps/inject-deps!
                (runtime-models/enrich-config (runtime-config/cfg)))]
    (if runtime
      (do
        (lifecycle/remember-context! runtime config nil false)
        (try
          (await (start-http! runtime config))
          (.log js/console "[sol-hot-reload] after-load: HTTP server started"
                #js {:pid (.-pid js/process)
                     :uptimeMs (process-uptime-ms)})
          (catch :default err
            (.error js/console "[sol-hot-reload] failed to restart HTTP server" err))
          (finally (done))))
      (do
        (.warn js/console "[sol-hot-reload] no lifecycle context; skipping HTTP restart")
        (done)))))
