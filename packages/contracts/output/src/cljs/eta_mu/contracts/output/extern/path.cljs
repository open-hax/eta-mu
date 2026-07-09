(ns eta-mu.contracts.output.extern.path
  "Raw Node.js path boundary for the output contract package.
   No domain policy; only path manipulation.")

(def ^:private node-path (js/require "node:path"))

(defn path-resolve
  "Resolve path parts to an absolute path."
  ([parts]
   (.apply (.-resolve node-path) node-path (clj->js (vec parts))))
  ([base part]
   (.resolve node-path base part)))

(defn path-join
  "Join path parts into a single path."
  [& parts]
  (.apply (.-join node-path) node-path (clj->js (vec parts))))

(defn path-basename
  "Return the last portion of a path."
  ([file-path]
   (.basename node-path file-path))
  ([file-path ext]
   (.basename node-path file-path ext)))

(defn path-dirname
  "Return the directory name of a path."
  [file-path]
  (.dirname node-path file-path))

(defn absolute?
  "Return true when path is absolute."
  [file-path]
  (.isAbsolute node-path file-path))

(defn path-relative
  "Return the relative path from `from` to `to`."
  [from to]
  (.relative node-path from to))

(defn sep
  "Return the platform-specific path separator."
  []
  (.-sep node-path))
