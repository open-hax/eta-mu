(ns eta-mu.contracts.output.extern.fs
  "Raw Node.js fs / crypto boundary for the output contract package.
   No domain policy; only file and hash primitives."
  (:require [clojure.string :as str]
            [eta-mu.contracts.output.extern.path :as path]))

(def ^:private fs (js/require "node:fs"))
(def ^:private crypto (js/require "node:crypto"))

(defn read-text-file
  "Read `file-path` as UTF-8 synchronously."
  [file-path]
  (.readFileSync fs file-path "utf8"))

(defn write-text-file!
  "Write `content` to `file-path` as UTF-8, creating parent directories."
  [file-path content]
  (let [dir (path/path-dirname file-path)]
    (.mkdirSync fs dir #js {:recursive true})
    (.writeFileSync fs file-path content "utf8"))
  file-path)

(defn ensure-directory!
  "Create `dir-path` recursively."
  [dir-path]
  (.mkdirSync fs dir-path #js {:recursive true})
  dir-path)

(defn file-exists?
  "Return true when `file-path` exists."
  [file-path]
  (.existsSync fs file-path))

(defn sha256-hex
  "Return the SHA-256 hex digest of `value`. Strings are hashed as UTF-8."
  [value]
  (let [hash (.createHash crypto "sha256")]
    (if (string? value)
      (.update hash value "utf8")
      (.update hash (str value) "utf8"))
    (.digest hash "hex")))

(defn random-uuid-fragment
  "Return a random UUID string."
  []
  (.randomUUID crypto))

(defn write-json!
  "Write `value` as pretty-printed JSON to `file-path`."
  [file-path value]
  (write-text-file! file-path (str (js/JSON.stringify (clj->js value) nil 2) "\n")))

(defn now-iso
  "Return an ISO-8601 timestamp string."
  []
  (.toISOString (js/Date.)))

(defn run-id
  "Return a unique run id: ISO timestamp with colons/dots replaced by dashes,
   followed by a short random suffix."
  []
  (let [stamp (-> (now-iso)
                   (str/replace #":" "-")
                   (str/replace #"\\." "-"))]
    (str stamp "_" (subs (random-uuid-fragment) 0 8))))

(defn read-json
  "Read `file-path` as JSON and decode to CLJS data. Returns nil if missing."
  [file-path]
  (when (file-exists? file-path)
    (js->clj (js/JSON.parse (read-text-file file-path)) :keywordize-keys true)))
