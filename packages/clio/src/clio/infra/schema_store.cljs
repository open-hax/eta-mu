(ns clio.infra.schema-store
  (:require [cljs.reader :as reader]
            [clio.domain.schema :as schema]
            [clio.external.js.crypto :as crypto]
            [clio.external.js.fs :as fs]
            [clio.external.js.runtime :as runtime]
            [clojure.string :as str]))

(defn- fail!
  [type message data]
  (throw (ex-info message (assoc data :clio/error type))))

(defn revision-path
  [directory root]
  (str directory "/" root ".edn"))

(defn- write-edn-atomically!
  [path value]
  (let [tmp (str path ".tmp-" (runtime/random-uuid))]
    (try
      (fs/write-text! tmp (str (pr-str value) "\n"))
      (fs/rename! tmp path)
      (finally
        (fs/delete-if-exists! tmp)))))

(defn ensure-revision!
  "Persist a catalog snapshot under its derived Merkle root. A source edit that
   changes schema structure therefore creates a new revision automatically; old
   shapes remain available without maintaining version numbers in code."
  [directory revision]
  (fs/ensure-dir! directory)
  (let [root (:schema/root revision)
        path (revision-path directory root)
        snapshot {:schema/root root
                  :schema/catalog (:schema/catalog revision)}]
    (if (fs/exists? path)
      (let [old (reader/read-string (fs/read-text path))]
        (when-not (= snapshot old)
          (fail! :clio.schema-store/root-collision
                 "Persisted schema root has different contents"
                 {:schema/root root :path path}))
        path)
      (do
        (write-edn-atomically! path snapshot)
        path))))

(defn- load-revision-file
  [directory filename]
  (let [path (str directory "/" filename)
        snapshot (reader/read-string (fs/read-text path))
        materialized (schema/materialize crypto/sha256 (:schema/catalog snapshot))]
    (when-not (= (:schema/root snapshot) (:schema/root materialized))
      (fail! :clio.schema-store/corrupt-snapshot
             "Persisted schema snapshot does not hash to its recorded root"
             {:path path
              :recorded/root (:schema/root snapshot)
              :actual/root (:schema/root materialized)}))
    materialized))

(defn load-revisions
  [directory]
  (->> (fs/list-files directory)
       (filter #(str/ends-with? % ".edn"))
       sort
       (mapv #(load-revision-file directory %))))
