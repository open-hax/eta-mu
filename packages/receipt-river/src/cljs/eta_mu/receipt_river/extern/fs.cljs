(ns eta-mu.receipt-river.extern.fs
  "Raw Node filesystem boundary for repository discovery."
  (:require ["node:fs" :as fs]
            ["node:path" :as path]))

(defn path-exists? [value]
  (.existsSync fs value))

(defn lstat [value]
  (.lstatSync fs value))

(defn directory? [value]
  (.isDirectory (lstat value)))

(defn symbolic-link? [value]
  (.isSymbolicLink (lstat value)))

(defn entries [value]
  (js->clj (.readdirSync fs value)))

(defn read-text [value]
  (.readFileSync fs value "utf8"))

(defn realpath [value]
  (.realpathSync fs value))

(defn join [& values]
  (.apply (.-join path) nil (into-array values)))

(defn resolve-path [& values]
  (.apply (.-resolve path) nil (into-array values)))

(defn basename [value]
  (.basename path value))
