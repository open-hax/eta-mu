(ns eta-mu.extern.fs
  "Node fs boundary."
  (:require [clojure.string :as str]
            ["node:fs" :as fs]
            ["node:fs/promises" :as fsp]
            ["node:path" :as path]))

(defn file-exists? [path]
  (.existsSync fs path))

(defn directory? [abs-path]
  (.isDirectory (.statSync fs abs-path)))

(defn read-file [path]
  (.readFileSync fs path "utf8"))

(defn- to-posix [p]
  (str/replace p "\\" "/"))

(defn list-dir
  "Single-level directory listing: `[{:name :dir?} ...]`, skipping entries
  that cannot be stat'd (e.g. broken symlinks)."
  [dir-path]
  (into []
        (keep (fn [entry-name]
                (try
                  {:name entry-name
                   :dir? (directory? (.join path dir-path entry-name))}
                  (catch :default _ nil))))
        (js->clj (.readdirSync fs dir-path))))

(defn walk
  "Recursively list `root`, returning `[{:path relative-posix-path :dir? bool} ...]`.

  Directories whose basename is in `ignored-dir-names` are skipped entirely
  (not walked into, not included in the result). Symlinked directories are
  not followed (uses `lstatSync` while walking, to avoid symlink cycles)."
  [root ignored-dir-names]
  (let [out (atom [])]
    ((fn walk-dir [dir-path rel-prefix]
       (doseq [entry-name (js->clj (.readdirSync fs dir-path))]
         (when-not (contains? ignored-dir-names entry-name)
           (let [abs (.join path dir-path entry-name)
                 rel (to-posix (if (seq rel-prefix) (str rel-prefix "/" entry-name) entry-name))]
             (try
               (let [entry-stat (.lstatSync fs abs)
                     dir? (.isDirectory entry-stat)]
                 (swap! out conj {:path rel :dir? dir?})
                 (when dir?
                   (walk-dir abs rel)))
               (catch :default _ nil))))))
     root "")
    @out))

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
