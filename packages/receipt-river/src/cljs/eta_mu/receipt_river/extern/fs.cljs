(ns eta-mu.receipt-river.extern.fs
  "Raw Node filesystem and path boundary for Receipt River."
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

(defn write-text! [value text]
  (.writeFileSync fs value text "utf8"))

(defn append-text! [value text]
  (.appendFileSync fs value text "utf8"))

(defn make-directories! [value]
  (.mkdirSync fs value #js {:recursive true}))

(defn realpath [value]
  (.realpathSync fs value))

(defn join [& values]
  (.apply (.-join path) nil (into-array values)))

(defn resolve-path [& values]
  (.apply (.-resolve path) nil (into-array values)))

(defn dirname [value]
  (.dirname path value))

(defn basename [value]
  (.basename path value))

(defn absolute? [value]
  (path/isAbsolute value))
