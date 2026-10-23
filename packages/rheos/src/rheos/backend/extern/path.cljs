(ns rheos.backend.extern.path
  "Decode native path operations for host-independent callers."
  (:require [clojure.string :as str]
            ["node:path" :as path]))

(defn resolve-from-cwd [value]
  (path/resolve value))

(defn relative [root target]
  (let [native (path/relative root target)]
    {:path (str/replace native path/sep "/")
     :absolute? (path/isAbsolute native)}))
