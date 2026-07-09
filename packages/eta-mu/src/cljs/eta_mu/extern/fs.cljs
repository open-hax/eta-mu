(ns eta-mu.extern.fs
  "Node fs boundary."
  (:require ["node:fs" :as fs]
            ["node:fs/promises" :as fsp]))

(defn file-exists? [path]
  (.existsSync fs path))

(defn read-file [path]
  (.readFileSync fs path "utf8"))

(defn write-file [path content]
  (.writeFileSync fs path content "utf8"))

(defn append-file [path content]
  (.appendFileSync fs path content "utf8"))

(defn mkdir [dir]
  (.mkdirSync fs dir #js {:recursive true}))

(defn ^:async read-file-async [path]
  (await (.readFile fsp path "utf8")))

(defn ^:async write-file-async [path content]
  (await (.writeFile fsp path content "utf8")))

(defn ^:async append-file-async [path content]
  (await (.appendFile fsp path content "utf8")))

(defn ^:async mkdir-async [dir]
  (await (.mkdir fsp dir #js {:recursive true})))
