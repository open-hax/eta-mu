(ns eta-mu.extern.path
  "Node path boundary."
  (:require ["node:path" :as path]))

(defn join [& segments]
  (.apply (.-join path) nil (into-array segments)))

(defn dirname [p]
  (.dirname path p))

(defn basename [p]
  (.basename path p))

(defn resolve-path [& paths]
  (.apply (.-resolve path) nil (into-array paths)))

(defn relative [from to]
  (.relative path from to))

(defn is-absolute? [p]
  (.isAbsolute path p))
