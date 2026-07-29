(ns eta-mu.session-mycology.extern.runtime
  "Raw filesystem, path, process, and console boundary for Session Mycology."
  (:require ["node:fs" :as fs]
            ["node:path" :as path]))

(defn current-directory []
  (.cwd js/process))

(defn join-path [& values]
  (.apply (.-join path) nil (into-array values)))

(defn parent-directory [value]
  (.dirname path value))

(defn make-directories! [value]
  (.mkdirSync fs value #js {:recursive true}))

(defn append-text! [value text]
  (.appendFileSync fs value text "utf8"))

(defn error! [message]
  (js/console.error message))

(defn exit! [code]
  (.exit js/process code))
