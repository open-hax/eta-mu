(ns clio.infra.cli
  (:require [cljs.reader :as reader]
            [clio.domain.schema :as schema]
            [clio.external.js.crypto :as crypto]
            [clio.external.js.fs :as fs]
            [clio.infra.ledger :as ledger]
            [clio.infra.runtime :as runtime]
            [clio.infra.schema-store :as schema-store]))

(defn- usage []
  (println "clio new <ledger.edn>")
  (println "clio schema-root <catalog.edn>")
  (println "clio append <schema-dir> <catalog.edn> <ledger.edn> <:schema/id> '<event-edn>'")
  (println "clio canonicalize <schema-dir> <ledger.edn> [ledger.edn ...]"))

(defn- read-edn-file [path]
  (reader/read-string (fs/read-text path)))

(defn- command-new [[path & extra]]
  (when (or (nil? path) (seq extra))
    (throw (ex-info "new expects exactly one ledger path"
                    {:clio/error :clio.cli/invalid-arguments})))
  (ledger/create-ledger! path)
  (prn {:ledger/path path :ledger/created? true}))

(defn- command-schema-root [[catalog-file & extra]]
  (when (or (nil? catalog-file) (seq extra))
    (throw (ex-info "schema-root expects exactly one catalog path"
                    {:clio/error :clio.cli/invalid-arguments})))
  (let [catalog (read-edn-file catalog-file)
        revision (schema/materialize crypto/sha256 catalog)]
    (prn {:schema/root (:schema/root revision)
          :schema/hashes (:schema/hashes revision)})))

(defn- command-append [[schema-dir catalog-file ledger-file schema-id-edn event-edn & extra]]
  (when (or (some nil? [schema-dir catalog-file ledger-file schema-id-edn event-edn])
            (seq extra))
    (throw (ex-info "append expects schema-dir, catalog, ledger, schema id, and event EDN"
                    {:clio/error :clio.cli/invalid-arguments})))
  (let [catalog (read-edn-file catalog-file)
        schema-id (reader/read-string schema-id-edn)
        event-data (reader/read-string event-edn)
        rt (runtime/open schema-dir catalog)
        result (runtime/append! rt ledger-file schema-id event-data)]
    (prn (select-keys result [:append/result :event]))))

(defn- command-canonicalize [[schema-dir & ledger-files]]
  (when (or (nil? schema-dir) (empty? ledger-files))
    (throw (ex-info "canonicalize expects a schema directory and at least one ledger"
                    {:clio/error :clio.cli/invalid-arguments})))
  (let [revisions (schema-store/load-revisions schema-dir)
        canonical (ledger/canonicalize-files revisions ledger-files)]
    (prn (select-keys canonical [:canonical/event-ids :canonical/events]))))

(defn -main [& args]
  (let [[command & command-args] args]
    (case command
      "new" (command-new command-args)
      "schema-root" (command-schema-root command-args)
      "append" (command-append command-args)
      "canonicalize" (command-canonicalize command-args)
      (do
        (usage)
        (throw (ex-info "unknown clio command"
                        {:clio/error :clio.cli/unknown-command
                         :command command}))))))
