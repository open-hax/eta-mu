(ns eta-mu.coding.extern.fs
  (:require [eta-mu.coding.extern.path :as path]))

(def ^:private fs (js/require "node:fs"))
(def ^:private crypto (js/require "node:crypto"))

(defn read-text-file
  "Read `file-path` as UTF-8. Returns {:ok true :content string :path} or {:ok false :error :code :path}."
  [file-path]
  (try
    {:ok true
     :content (.readFileSync fs file-path "utf8")
     :path file-path}
    (catch js/Error e
      {:ok false
       :error (.-message e)
       :code (or (.-code e) "EREAD")
       :path file-path})))

(defn write-text-file!
  "Write `content` to `file-path` as UTF-8, creating parent directories."
  [file-path content]
  (try
    (let [dir (path/path-dirname file-path)]
      (.mkdirSync fs dir #js {:recursive true})
      (.writeFileSync fs file-path content "utf8")
      {:ok true :path file-path})
    (catch js/Error e
      {:ok false
       :error (.-message e)
       :code (or (.-code e) "EWRITE")
       :path file-path})))

(defn append-text-file!
  "Append `content` to `file-path` as UTF-8, creating parent directories."
  [file-path content]
  (try
    (let [dir (path/path-dirname file-path)]
      (.mkdirSync fs dir #js {:recursive true})
      (.appendFileSync fs file-path content "utf8")
      {:ok true :path file-path})
    (catch js/Error e
      {:ok false
       :error (.-message e)
       :code (or (.-code e) "EAPPEND")
       :path file-path})))

(defn file-exists?
  "Return true when `file-path` exists."
  [file-path]
  (.existsSync fs file-path))

(defn directory-exists?
  "Return true when `dir-path` exists and is a directory."
  [dir-path]
  (try
    (.isDirectory (.statSync fs dir-path))
    (catch js/Error _
      false)))

(defn ensure-directory!
  "Create `dir-path` recursively."
  [dir-path]
  (try
    (.mkdirSync fs dir-path #js {:recursive true})
    {:ok true :path dir-path}
    (catch js/Error e
      {:ok false
       :error (.-message e)
       :code (or (.-code e) "EMKDIR")
       :path dir-path})))

(defn list-directory
  "Return a map with :entries, each containing :name, :directory?, :file?, :symbolic-link?, :absolute-path."
  [dir-path]
  (try
    (let [entries (.readdirSync fs dir-path #js {:withFileTypes true})]
      {:ok true
       :path dir-path
       :entries (mapv (fn [^js e]
                        {:name (.-name e)
                         :directory? (.isDirectory e)
                         :file? (.isFile e)
                         :symbolic-link? (.isSymbolicLink e)
                         :absolute-path (path/path-join dir-path (.-name e))})
                      entries)})
    (catch js/Error e
      {:ok false
       :error (.-message e)
       :code (or (.-code e) "EREADDIR")
       :path dir-path})))

(defn delete-file!
  "Remove `file-path`."
  [file-path]
  (try
    (.rmSync fs file-path #js {:force true})
    {:ok true :path file-path}
    (catch js/Error e
      {:ok false
       :error (.-message e)
       :code (or (.-code e) "ERM")
       :path file-path})))

(defn delete-directory!
  "Recursively remove `dir-path`."
  [dir-path]
  (try
    (.rmSync fs dir-path #js {:recursive true :force true})
    {:ok true :path dir-path}
    (catch js/Error e
      {:ok false
       :error (.-message e)
       :code (or (.-code e) "ERMDIR")
       :path dir-path})))

(defn copy-file!
  "Copy `src` to `dest`, creating parent directories."
  [src dest]
  (try
    (.mkdirSync fs (path/path-dirname dest) #js {:recursive true})
    (.copyFileSync fs src dest)
    {:ok true :src src :dest dest}
    (catch js/Error e
      {:ok false
       :error (.-message e)
       :code (or (.-code e) "ECOPY")
       :src src
       :dest dest})))

(defn path-resolve
  "Resolve path parts to an absolute path."
  ([parts]
   (path/path-resolve parts))
  ([base part]
   (path/path-resolve base part)))

(defn path-join
  "Join path parts into a single path."
  [& parts]
  (apply path/path-join parts))

(defn path-basename
  "Return the last portion of a path."
  ([file-path]
   (path/path-basename file-path))
  ([file-path ext]
   (path/path-basename file-path ext)))

(defn path-dirname
  "Return the directory name of a path."
  [file-path]
  (path/path-dirname file-path))

(defn sha256-hex
  "Return the SHA-256 hex digest of `value`.
   If `value` is a string that names an existing file, hashes the file contents;
   otherwise hashes the string representation."
  [value]
  (let [hash (.createHash crypto "sha256")]
    (if (and (string? value) (.existsSync fs value))
      (.update hash (.readFileSync fs value))
      (.update hash (str (or value "")) "utf8"))
    (.digest hash "hex")))
