(ns eta-mu.docs.extern.fs
  (:require [clojure.string :as str]))

(def ^:private fs (js/require "node:fs"))
(def ^:private path (js/require "node:path"))
(def ^:private crypto (js/require "node:crypto"))

(defn read-file
  "Read `file-path` as UTF-8 and return its contents as a string."
  [file-path]
  (.readFileSync fs file-path "utf8"))

(defn write-file
  "Write `content` to `file-path` as UTF-8, creating parent directories first."
  [file-path content]
  (.mkdirSync fs (.dirname path file-path) #js {:recursive true})
  (.writeFileSync fs file-path content "utf8"))

(defn mkdir
  "Create `dir` recursively if it does not exist."
  [dir]
  (.mkdirSync fs dir #js {:recursive true}))

(defn rmdir
  "Recursively remove `dir` if it exists."
  [dir]
  (.rmSync fs dir #js {:recursive true :force true}))

(defn file-exists?
  "Return true when `file-path` exists on disk."
  [file-path]
  (.existsSync fs file-path))

(defn stat
  "Return a map of file metadata for `file-path`.
   Keys: :size, :mtime-ms, :mtime-ns, :mtime-utc."
  [file-path]
  (let [st (.statSync fs file-path)
        mtime-ms (.-mtimeMs st)
        mtime-ns-raw (.-mtimeNs st)
        mtime-ns (cond
                   (number? mtime-ns-raw) mtime-ns-raw
                   (some? mtime-ns-raw) (js/Number mtime-ns-raw)
                   :else (* mtime-ms 1000000))]
    {:size (.-size st)
     :mtime-ms mtime-ms
     :mtime-ns mtime-ns
     :mtime-utc (.toISOString (js/Date. mtime-ms))}))

(defn readdir
  "Return a vector of dirent-like maps for `dir`.
   Each map contains :name, :directory?, :file?, and :absolute-path."
  [dir]
  (let [entries (.readdirSync fs dir #js {:withFileTypes true})]
    (mapv (fn [e]
            {:name (.-name e)
             :directory? (.isDirectory e)
             :file? (.isFile e)
             :absolute-path (.join path dir (.-name e))})
          entries)))

(defn walk-markdown-files
  "Recursively walk `root-abs` and return a vector of absolute paths to .md files.
   Skips node_modules, .git, dist, build, coverage, .cache, .opencode, .ημ, and .Π
   directories, and files beginning with '.#'."
  [root-abs]
  (let [skip-dirs #{"node_modules" ".git" "dist" "build" "coverage" ".cache" ".opencode" ".ημ" ".Π"}]
    (loop [todo [root-abs] out []]
      (if (empty? todo)
        out
        (let [dir (peek todo)
              entries (readdir dir)
              [next-todo next-out]
              (reduce (fn [[t o] e]
                        (cond
                          (str/starts-with? (:name e) ".#")
                          [t o]

                          (:directory? e)
                          (if (contains? skip-dirs (:name e))
                            [t o]
                            [(conj t (:absolute-path e)) o])

                          (and (:file? e)
                               (str/ends-with? (str/lower-case (:name e)) ".md"))
                          [t (conj o (:absolute-path e))]

                          :else
                          [t o]))
                      [(pop todo) out]
                      entries)]
          (recur next-todo next-out))))))

(defn sha256-hex
  "Return the SHA-256 hex digest of `value` as a string."
  [value]
  (-> (.createHash crypto "sha256")
      (.update (str (or value "")) "utf8")
      (.digest "hex")))

(defn stable-id
  "Return a stable identifier string of form `<prefix>:<truncated-sha256>`."
  ([prefix seed]
   (stable-id prefix seed 20))
  ([prefix seed width]
   (let [token (.slice (sha256-hex seed) 0 (max 8 width))]
     (str prefix ":" token))))

(defn path-resolve
  "Resolve `parts` against `base` to an absolute path."
  ([parts]
   (.apply (.-resolve path) path (clj->js (vec parts))))
  ([base part]
   (.resolve path base part)))

(defn path-dirname
  "Return the directory name of `file-path`."
  [file-path]
  (.dirname path file-path))

(defn path-join
  "Join path `parts` into a single path."
  [& parts]
  (.apply (.-join path) path (clj->js (vec parts))))

(defn posix-relative
  "Return the POSIX-style relative path from `from-abs` to `to-abs`."
  [from-abs to-abs]
  (let [rel (.relative path from-abs to-abs)]
    (str/join "/" (.split rel (.-sep path)))))

(defn cwd
  "Return the current working directory."
  []
  (.cwd (.-process js/globalThis)))
