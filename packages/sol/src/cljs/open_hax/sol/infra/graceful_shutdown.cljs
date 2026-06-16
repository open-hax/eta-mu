(ns open-hax.sol.infra.graceful-shutdown
  "Graceful shutdown orchestration for Sol.

   Sol strips out Mongo, Discord, event-runtime, etc. Shutdown simply drains
   the HTTP server and stops realtime broadcasting."
  (:require [open-hax.sol.domain.realtime :as realtime]))

(defonce shutdown-state* (atom {:installed? false
                                :in-progress? false
                                :promise nil
                                :signal nil}))

(defonce shutdown-target* (atom {:app nil
                                 :config nil}))

(defn- log-info!
  [app message]
  (if-let [logger (some-> app (.-log))]
    (.info logger message)
    (.log js/console message)))

(defn- log-error!
  [app message err]
  (if-let [logger (some-> app (.-log))]
    (.error logger message err)
    (.error js/console message err)))

(defn- ^:async close-server!
  [app]
  (try
    (let [result (.close app)]
      (if (some? result)
        (await result)
        true))
    (catch :default err
      (log-error! app "[shutdown] failed to close Fastify cleanly" err)
      false)))

(defn- ^:async run-shutdown!
  [app _config signal]
  (try
    (swap! shutdown-state* assoc :in-progress? true :signal signal)
    (log-info! app (str "[shutdown] received " signal "; draining Sol"))
    (realtime/stop!)
    (await (close-server! app))
    (log-info! app "[shutdown] graceful shutdown complete")
    (js/process.exit 0)
    (catch :default err
      (log-error! app "[shutdown] graceful shutdown failed" err)
      (js/process.exit 1))))

(defn begin-shutdown!
  [app config signal]
  (if-let [existing (:promise @shutdown-state*)]
    existing
    (let [signal (str (or signal "shutdown"))
          shutdown-promise (run-shutdown! app config signal)]
      (swap! shutdown-state* assoc :promise shutdown-promise)
      shutdown-promise)))

(defn- begin-current-shutdown!
  [signal]
  (let [{:keys [app config]} @shutdown-target*]
    (if app
      (begin-shutdown! app config signal)
      (do
        (.warn js/console "[shutdown] no active HTTP app; exiting")
        (js/process.exit 0)))))

(defn install!
  [app config]
  ;; Hot reload recreates the Fastify app without recreating the process. Keep
  ;; process signal handlers stable, but always point them at the latest app.
  (reset! shutdown-target* {:app app :config config})
  (when-not (:installed? @shutdown-state*)
    (swap! shutdown-state* assoc :installed? true)
    (.on js/process "SIGINT" (fn [] (begin-current-shutdown! "SIGINT")))
    (.on js/process "SIGTERM" (fn [] (begin-current-shutdown! "SIGTERM")))
    (.on js/process "message"
         (fn [message]
           (when (= (str message) "shutdown")
             (begin-current-shutdown! "pm2:shutdown"))))
    true))
