(ns eta-mu.coding.extern.fs-watch
  (:require [eta-mu.coding.extern.path :as path]))

(def ^:private node-fs (js/require "node:fs"))

(defn watch-path
  "Watch `target-path` and call `on-event` with {:type :change|:rename :path}.
   Returns {:ok true :watcher watcher :close fn} or {:ok false :error :code :path}."
  [target-path on-event]
  (try
    (let [watcher (.watch node-fs target-path
                          (fn [event-type filename]
                            (on-event {:type (keyword event-type)
                                       :path (if filename
                                               (path/path-join target-path filename)
                                               target-path)})))]
      {:ok true
       :watcher watcher
       :close (fn []
                (try
                  (.close watcher)
                  (catch js/Error _)))})
    (catch js/Error e
      {:ok false
       :error (.-message e)
       :code (or (.-code e) "EWATCH")
       :path target-path})))

(defn watch-file
  "Watch `target-path` with fs.watchFile and call `on-change` with current/previous stats maps.
   Returns {:ok true :unwatch fn} or {:ok false :error :code :path}."
  [target-path on-change]
  (try
    (.watchFile node-fs target-path
                (fn [^js current ^js previous]
                  (on-change {:current {:size (.-size current)
                                        :mtime-ms (.-mtimeMs current)}
                              :previous {:size (.-size previous)
                                         :mtime-ms (.-mtimeMs previous)}})))
    {:ok true
     :unwatch (fn []
                (try
                  (.unwatchFile node-fs target-path)
                  (catch js/Error _)))}
    (catch js/Error e
      {:ok false
       :error (.-message e)
       :code (or (.-code e) "EWATCH")
       :path target-path})))

(defn close-watcher
  "Close a watcher returned by watch-path."
  [watcher]
  (when watcher
    (try
      (.close watcher)
      (catch js/Error _))))
