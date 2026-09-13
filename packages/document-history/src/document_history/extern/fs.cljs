(ns document-history.extern.fs
  (:refer-clojure :exclude [exists?])
  (:require ["node:fs" :as fs]
            ["node:path" :as path]
            [clio.extern.js.runtime :as runtime]
            [clio.extern.js.fs :as clio-fs]
            [clojure.string :as str]))

(defn join [& pieces] (apply path/join pieces))
(defn directory! [directory]
  (fs/mkdirSync directory #js {:recursive true})
  directory)

(defn- eta-mu-path? [value]
  (boolean (some #{".ημ"} (str/split value #"[/\\]+"))))

(defn root! [root]
  (when-not (and (string? root) (eta-mu-path? (path/resolve root)))
    (throw (ex-info "Document histories and snapshots must reside under .ημ"
                    {:document-history/error :invalid-root})))
  (directory! root)
  (let [resolved (fs/realpathSync root)]
    (when-not (eta-mu-path? resolved)
      (throw (ex-info "Resolved document history root escapes .ημ"
                      {:document-history/error :invalid-root})))
    resolved))

(defn exists? [file] (boolean (fs/existsSync file)))
(defn read-text [file] (fs/readFileSync file "utf8"))
(defn write-text! [file text] (fs/writeFileSync file text "utf8"))
(defn remove-tree! [directory] (fs/rmSync directory #js {:recursive true :force true}))
(defn remove-file! [file] (when (exists? file) (fs/unlinkSync file)))
(defn unique-name [] (runtime/random-uuid))

(defn finalized-ledgers [directory]
  (->> (vec (fs/readdirSync directory))
       (filter #(and (not (str/starts-with? % ".")) (str/ends-with? % ".edn")))
       sort
       (mapv (fn [name]
               (let [file (join directory name)
                     stat (fs/lstatSync file)]
                 (when-not (.isFile stat)
                   (throw (ex-info "Ledger partitions must be regular files"
                                   {:document-history/error :invalid-partition :path file})))
                 file)))))

(defn publish-ledger!
  "Atomically publish a completely appended unique partition; linking refuses
   accidental replacement and the pending name is never read as history."
  [pending final]
  (fs/linkSync pending final)
  (fs/unlinkSync pending)
  final)

(defn publish-directory!
  "Publish a complete immutable snapshot directory. Concurrent publication of
   the same content address is allowed; the caller verifies existing contents."
  [pending final]
  (try
    (fs/renameSync pending final)
    :published
    (catch :default cause
      (if (contains? #{"EEXIST" "ENOTEMPTY"} (.-code cause))
        :already-present
        (throw cause)))))

(defn ensure-lock-file! [file]
  (try
    (clio-fs/create-exclusive! file)
    (catch :default cause
      (when-not (= "EEXIST" (.-code cause)) (throw cause))))
  file)
