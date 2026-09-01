(ns rheos.backend.extern.document-source
  "Node boundary for typed Markdown document source and sidecar access."
  (:require ["node:buffer" :refer [Buffer]]
            ["node:crypto" :as crypto]
            ["node:fs/promises" :as fsp]
            ["node:path" :as path]
            [clojure.string :as str]))

(defn- inside-root? [root-path candidate-path]
  (or (= root-path candidate-path)
      (str/starts-with? candidate-path (str root-path path/sep))))

(defn ^:async resolve-contained-sidecar!
  "Resolve `relative-path` beside the Markdown document and prove its real path
   remains inside `root-path`. The realpath check rejects symlink escapes."
  [root-path document-path relative-path]
  (cond
    (str/blank? relative-path)
    {:ok false
     :errors [{:error/code :sidecar/blank-path
               :error/message "rheos-sidecar must name a relative EDN file"}]}

    (path/isAbsolute relative-path)
    {:ok false
     :errors [{:error/code :sidecar/absolute-path
               :error/message "rheos-sidecar may not be absolute"}]}

    (not (str/ends-with? relative-path ".edn"))
    {:ok false
     :errors [{:error/code :sidecar/not-edn
               :error/message "rheos-sidecar must name an .edn file"}]}

    :else
    (let [root-candidate (path/resolve root-path)
          sidecar-candidate (path/resolve (path/dirname document-path) relative-path)]
      (if-not (inside-root? root-candidate sidecar-candidate)
        {:ok false
         :errors [{:error/code :sidecar/path-escape
                   :error/message "rheos-sidecar resolves outside the document root"}]}
        (try
          (let [root-real (await (.realpath fsp root-candidate))
                sidecar-real (await (.realpath fsp sidecar-candidate))]
            (if (inside-root? root-real sidecar-real)
              {:ok true :path sidecar-real}
              {:ok false
               :errors [{:error/code :sidecar/symlink-escape
                         :error/message "rheos-sidecar follows a link outside the document root"}]}))
          (catch :default _
            {:ok false
             :errors [{:error/code :sidecar/unreadable-path
                       :error/message "rheos-sidecar path cannot be resolved"}]}))))))

(defn ^:async read-text! [file-path]
  (await (.readFile fsp file-path "utf8")))

(defn ^:async read-text-result! [file-path]
  (try
    {:ok true :text (await (read-text! file-path))}
    (catch :default _
      {:ok false
       :errors [{:error/code :source/unreadable
                 :error/message "document source cannot be read"}]})))

(defn content-sha256 [document-raw sidecar-raw]
  (let [digest (crypto/createHash "sha256")
        document-bytes (.from Buffer document-raw "utf8")
        sidecar-bytes (.from Buffer sidecar-raw "utf8")]
    (.update digest (str (.-length document-bytes) ":") "utf8")
    (.update digest document-raw "utf8")
    (.update digest (str (.-length sidecar-bytes) ":") "utf8")
    (.update digest sidecar-raw "utf8")
    (.digest digest "hex")))

(defn event-id []
  (crypto/randomUUID))

(defn iso-now []
  (.toISOString (new js/Date)))
