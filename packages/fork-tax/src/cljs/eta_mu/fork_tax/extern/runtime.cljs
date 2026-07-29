(ns eta-mu.fork-tax.extern.runtime
  "Raw filesystem, path, process, and console boundary for Fork Tax."
  (:require ["node:fs" :as fs]
            ["node:path" :as path]))

(defn current-directory []
  (.cwd js/process))

(defn now-iso []
  (.toISOString (js/Date.)))

(defn resolve-path
  ([value]
   (path/resolve value))
  ([root value]
   (path/resolve root value)))

(defn join-path [& values]
  (.apply (.-join path) nil (into-array values)))

(defn make-directories! [value]
  (.mkdirSync fs value #js {:recursive true}))

(defn write-text! [value text]
  (.writeFileSync fs value text "utf8"))

(defn exit! [code]
  (.exit js/process code))
