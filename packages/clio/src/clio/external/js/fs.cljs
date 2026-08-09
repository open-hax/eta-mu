(ns clio.external.js.fs
  (:require ["node:fs" :as fs]))

(defn exists?
  [path]
  (boolean (fs/existsSync path)))

(defn ensure-dir!
  [path]
  (fs/mkdirSync path #js {:recursive true})
  path)

(defn create-exclusive!
  [path]
  (let [fd (fs/openSync path "wx")]
    (fs/closeSync fd))
  path)

(defn read-text
  [path]
  (fs/readFileSync path "utf8"))

(defn append-text!
  [path text]
  (fs/appendFileSync path text "utf8")
  path)

(defn write-text!
  [path text]
  (fs/writeFileSync path text "utf8")
  path)

(defn rename!
  [from to]
  (fs/renameSync from to)
  to)

(defn delete-if-exists!
  [path]
  (when (exists? path)
    (fs/unlinkSync path))
  path)

(defn list-files
  [path]
  (if (exists? path)
    (vec (array-seq (fs/readdirSync path)))
    []))
