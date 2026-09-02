(ns eta-mu.gitops-controller.extern.runtime
  "Raw process, clock, and scheduling boundary."
  (:require [clojure.string :as str]))

(defn environment [name]
  (let [value (aget (.-env js/process) name)]
    (when (and (string? value) (not (str/blank? value))) value)))

(defn now-timestamp []
  (.toISOString (js/Date.)))

(defn unix-seconds []
  (js/Math.floor (/ (.now js/Date) 1000)))

(defn- ^:async invoke-contained! [f]
  (try
    (await (f))
    (catch :default _
      (js/console.error "eta-mu scheduled operation failed"))))

(defn- ^:async invoke-serially-contained! [running?* f]
  (when (compare-and-set! running?* false true)
    (try
      (await (f))
      (catch :default _
        (js/console.error "eta-mu scheduled operation failed"))
      (finally
        (reset! running?* false)))))

(defn schedule! [f]
  (js/setImmediate #(invoke-contained! f)))

(defn every! [interval-ms f]
  (let [running?* (atom false)]
    (js/setInterval #(invoke-serially-contained! running?* f) interval-ms)))

(defn cancel! [timer]
  (js/clearInterval timer))

(defn info! [message]
  (js/console.log message))

(defn error! [message]
  (js/console.error message))
