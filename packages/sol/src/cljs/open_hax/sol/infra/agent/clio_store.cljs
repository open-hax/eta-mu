(ns open-hax.sol.infra.agent.clio-store
  "Durable Sol episode adapter over the canonical packages/clio kernel."
  (:require [clio.infra.ledger :as ledger]
            [clio.infra.runtime :as runtime]
            [clio.extern.js.fs :as fs]
            [clojure.string :as str]
            [open-hax.sol.domain.episode-ledger :as episode-ledger]
            [open-hax.sol.extern.node-fs :as node-fs]
            [open-hax.sol.law.episode-event :as episode-law]))

(defn canonical-events
  "Read and validate the full persisted history, including historical schemas."
  [{:keys [clio-runtime ledger-file]}]
  (let [current (runtime/refresh clio-runtime)]
    (:canonical/events
     (ledger/canonicalize-files (:schema/revisions current) [ledger-file]))))

(defn open-store
  "Create a ledger only in an empty/new directory. Reopening an initialized
   directory with a missing or corrupt ledger fails instead of resetting history."
  [directory]
  (when (or (not (string? directory)) (str/blank? directory))
    (throw (ex-info "SOL_CLIO_DIRECTORY must name a directory"
                    {:sol/error :sol.clio/invalid-directory})))
  (let [ledger-file (str directory "/events.edn")
        schema-directory (str directory "/schemas")]
    (when-not (fs/exists? ledger-file)
      (when (and (seq (fs/list-files directory))
                 (not (fs/exists? ledger-file)))
        (throw (ex-info "Sol Clio ledger is missing from an initialized directory"
                        {:sol/error :sol.clio/missing-ledger
                         :path ledger-file})))
      (fs/ensure-dir! directory)
      (try
        (ledger/create-ledger! ledger-file)
        (catch :default cause
          ;; Another opener may have won after the existence check. Only that
          ;; collision is recoverable; the winning history is validated below.
          (when-not (node-fs/already-exists-error? cause)
            (throw cause)))))
    (let [store {:ledger-file ledger-file
                 :clio-runtime (runtime/open schema-directory episode-law/catalog)}]
      (canonical-events store)
      store)))

(defn- retry-committed-envelope!
  "Only an identical wire fact can resolve a lost stream-slot race."
  [{:keys [clio-runtime ledger-file] :as store} envelope cause]
  (when-not (= :clio.ledger/concurrent-stream-write (:clio/error (ex-data cause)))
    (throw cause))
  (let [plan (episode-ledger/append-plan (canonical-events store) envelope)]
    (when-not (= :retry (:plan/action plan))
      (throw cause))
    ;; Reuse the durable UUID/time, rather than creating another wrapper. Clio
    ;; checks this exact event under its normal lock before we acknowledge it.
    (ledger/append-event! (:schema/revisions (runtime/refresh clio-runtime))
                          ledger-file (:event plan))))

(defn append-envelope!
  "Persist an episode payload before acknowledging it. Exact wire retries reuse
   the original Clio event; changed payloads with the same id are rejected."
  [{:keys [clio-runtime ledger-file] :as store} envelope]
  (let [plan (episode-ledger/append-plan (canonical-events store) envelope)]
    (try
      (case (:plan/action plan)
        :retry
        (ledger/append-event! (:schema/revisions (runtime/refresh clio-runtime))
                              ledger-file (:event plan))
        :append
        (runtime/append! clio-runtime ledger-file :sol/episode-emitted (:event plan)))
      (catch :default cause
        (retry-committed-envelope! store envelope cause)))
    envelope))

(defn read-envelopes
  "Replay the original Sol public payloads from Clio's canonical history."
  [store]
  (mapv :event/data (canonical-events store)))
