(ns eta-mu.coding.extern.fs
  (:require [eta-mu.coding.extern.path :as path]))

(def ^:private node-fs (js/require "node:fs"))
(def ^:private crypto (js/require "node:crypto"))

(defn read-text-file
  "Read `file-path` as UTF-8. Returns {:ok true :content string :path} or {:ok false :error :code :path}."
  [file-path]
  (try
    {:ok true
     :content (.readFileSync node-fs file-path "utf8")
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
      (.mkdirSync node-fs dir #js {:recursive true})
      (.writeFileSync node-fs file-path content "utf8")
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
      (.mkdirSync node-fs dir #js {:recursive true})
      (.appendFileSync node-fs file-path content "utf8")
      {:ok true :path file-path})
    (catch js/Error e
      {:ok false
       :error (.-message e)
       :code (or (.-code e) "EAPPEND")
       :path file-path})))

(defn file-exists?
  "Return true when `file-path` exists."
  [file-path]
  (.existsSync node-fs file-path))

(defn directory-exists?
  "Return true when `dir-path` exists and is a directory."
  [dir-path]
  (try
    (.isDirectory (.statSync node-fs dir-path))
    (catch js/Error _
      false)))

(defn ensure-directory!
  "Create `dir-path` recursively."
  [dir-path]
  (try
    (.mkdirSync node-fs dir-path #js {:recursive true})
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
    (let [entries (.readdirSync node-fs dir-path #js {:withFileTypes true})]
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
    (.rmSync node-fs file-path #js {:force true})
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
    (.rmSync node-fs dir-path #js {:recursive true :force true})
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
    (.mkdirSync node-fs (path/path-dirname dest) #js {:recursive true})
    (.copyFileSync node-fs src dest)
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

;; ============================================================================
;; JS Interop Wrappers (boundary-compliant)
;; ============================================================================

(defn to-js
  "Convert a ClojureScript value to JavaScript data."
  [x]
  (clj->js x))

(defn to-clj
  "Convert a JavaScript value to ClojureScript data with keywordized keys."
  [x]
  (js->clj x :keywordize-keys true))

(defn now-ms
  "Return the current time in milliseconds since epoch."
  []
  (.now js/Date))

(defn env-get
  "Return the value of an environment variable, or nil."
  [var-name]
  (aget js/process.env var-name))

(defn log-warn
  "Log a warning message."
  [& args]
  (apply js/console.warn args))

(defn promise-resolve
  "Create a resolved promise."
  [value]
  (js/Promise.resolve value))

(defn make-error
  "Create a new Error with the given message."
  [message]
  (js/Error. message))

(defn error-message
  "Extract message from an error object."
  [e]
  (.-message e))

(defn error-stack
  "Extract stack trace from an error object."
  [e]
  (.-stack e))

(defn node-require
  "Require a Node.js module by path."
  [module-path]
  (js/require module-path))

(defn json-parse
  "Parse a JSON string into a CLJS map."
  [s]
  (js->clj (.parse js/JSON s) :keywordize-keys true))

(defn json-stringify
  "Stringify a CLJS map to JSON."
  [data indent]
  (.stringify js/JSON (to-js data) nil indent))

(defn config-dir
  "Return the eta-mu config directory path, creating it if needed."
  []
  (let [homedir (or (env-get "HOME") (.-homedir (js/require "node:os")))
        config-path (path/path-join homedir ".config" "eta-mu")]
    (ensure-directory! config-path)
    config-path))

(defn read-json-file
  "Read a JSON file and parse it.
   Returns {:ok true :data parsed :path} or {:ok false :error :code :path}."
  [file-path]
  (if-not (file-exists? file-path)
    {:ok false :error "File not found" :code "ENOENT" :path file-path}
    (try
      (let [content (.readFileSync node-fs file-path "utf8")]
        {:ok true :data (.parse js/JSON content) :path file-path})
      (catch js/Error e
        {:ok false
         :error (.-message e)
         :code (or (.-code e) "EPARSE")
         :path file-path}))))

(defn write-json-file!
  "Write data as JSON to a file, creating parent directories.
   Returns {:ok true :path} or {:ok false :error :code :path}."
  [file-path data]
  (let [content (.stringify js/JSON (to-js data) nil 2)]
    (write-text-file! file-path content)))

(defn sha256-hex
  "Return the SHA-256 hex digest of `value`.
   If `value` is a string that names an existing file, hashes the file contents;
   otherwise hashes the string representation."
  [value]
  (let [hash (.createHash crypto "sha256")]
    (if (and (string? value) (.existsSync node-fs value))
      (.update hash (.readFileSync node-fs value))
      (.update hash (str (or value "")) "utf8"))
    (.digest hash "hex")))
