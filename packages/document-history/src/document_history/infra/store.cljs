(ns document-history.infra.store
  (:refer-clojure :exclude [read!])
  (:require [clio.infra.event :as event]
            [clio.extern.js.fs :as clio-fs]
            [clio.infra.ledger :as ledger]
            [clio.infra.projection :as projection]
            [clio.infra.runtime :as runtime]
            [clio.shape.canonical :as canonical]
            [clio.shape.edn :as edn]
            [document-history.domain.history :as history]
            [document-history.extern.fs :as fs]
            [document-history.law.revision :as law]))

(defn open!
  "Open an operator-owned root beneath .ημ. Functions are synchronous like
   Clio's filesystem API; every returned commit has been appended and sealed."
  [root]
  (let [root (fs/root! root)]
    {:store/root root
     :store/ledgers (fs/directory! (fs/join root "ledgers"))
     :store/seeds (fs/directory! (fs/join root "seeds"))
     :store/snapshots (fs/directory! (fs/join root "snapshots"))
     :store/runtime (runtime/open (fs/join root "schemas") law/catalog)}))

(defn- canonical-history [store]
  (let [rt (runtime/refresh (:store/runtime store))
        value (ledger/canonicalize-files (:schema/revisions rt)
                                         (fs/finalized-ledgers (:store/ledgers store)))]
    (doseq [event (:canonical/events value)]
      (law/require-id! (:event/subject event))
      (doseq [parent (:event/causes event)]
        (law/require-parent! (:event/subject event) parent
                             (get-in value [:canonical/by-id parent]))))
    value))

(defn- document-canonical [canonical-history document-id]
  (let [events (filterv #(= document-id (:event/subject %))
                        (:canonical/events canonical-history))]
    {:canonical/events events :canonical/event-ids (mapv :event/id events)}))

(defn- verify-snapshot! [directory value]
  (when-not (and (= (:document/metadata value)
                   (edn/read-one (fs/read-text (fs/join directory "metadata.edn"))))
                (= (:document/markdown value)
                   (fs/read-text (fs/join directory "document.md")))
                (= value (edn/read-one (fs/read-text (fs/join directory "snapshot.edn")))))
    (throw (ex-info "Immutable snapshot contents differ from the canonical history"
                    {:document-history/error :corrupt-snapshot :path directory}))))

(defn- materialize! [store value]
  (let [parent (fs/directory! (fs/join (:store/snapshots store) (:document/id value)))
        directory (fs/join parent (:projection/source-hash value))]
    (when-not (fs/exists? directory)
      (let [pending (fs/directory! (fs/join parent (str ".pending-" (fs/unique-name))))]
        (try
          (projection/write! (fs/join pending "metadata.edn") (:document/metadata value))
          (projection/write! (fs/join pending "snapshot.edn") value)
          (fs/write-text! (fs/join pending "document.md") (:document/markdown value))
          (fs/publish-directory! pending directory)
          (finally (fs/remove-tree! pending)))))
    (verify-snapshot! directory value)
    (assoc value
           :snapshot/metadata-path (fs/join directory "metadata.edn")
           :snapshot/markdown-path (fs/join directory "document.md"))))

(defn- project-document! [store canonical-history document-id]
  (let [projected (projection/build (document-canonical canonical-history document-id)
                                    {} history/apply-revision)]
    (when-let [value (history/document (:projection/state projected))]
      (materialize! store (assoc value :projection/source-hash
                                 (:projection/source-hash projected))))))

(defn read! [store document-id]
  (law/require-id! document-id)
  (project-document! store (canonical-history store) document-id))

(defn list! [store]
  (let [canonical-history (canonical-history store)
        ids (sort (distinct (map :event/subject (:canonical/events canonical-history))))]
    (mapv #(project-document! store canonical-history %) ids)))

(defn commit!
  "Append one full document revision. Parents are the editor's observed
   revisions, including multiple heads for an explicit resolution. The event
   survives projection failure; callers can always recover it through replay."
  [store command]
  (law/require-command! command)
  ;; Reuse Clio's portable EDN rules and strict reader before publishing data.
  (canonical/canonical-edn (:document/metadata command))
  (when-not (= (:document/metadata command)
               (edn/read-one (pr-str (:document/metadata command))))
    (throw (ex-info "Metadata must round-trip as plain EDN"
                    {:document-history/error :invalid-command})))
  (let [accepted (canonical-history store)
        document-id (:document/id command)]
    (doseq [parent (:revision/parents command)]
      (law/require-parent! document-id parent (get-in accepted [:canonical/by-id parent])))
    (let [rt (runtime/refresh (:store/runtime store))
          value (event/make-event
                 (:schema/current rt) :document-history/revision-recorded
                 {:event/stream (str "document-revision:" (fs/unique-name))
                  :event/seq 1
                  :event/causes (:revision/parents command)
                  :event/actor (:revision/actor command)
                  :event/subject document-id
                  :event/data (select-keys command [:document/metadata :document/markdown])})
          id (:event/id value)
          pending (fs/join (:store/ledgers store) (str ".pending-" id))
          final (fs/join (:store/ledgers store) (str id ".edn"))]
      (try
        (ledger/create-ledger! pending)
        (ledger/append-event! (:schema/revisions rt) pending value)
        (fs/publish-ledger! pending final)
        (finally (fs/remove-file! pending)))
      (assoc (read! store document-id) :commit/revision id))))

(defn read-revision!
  "Materialize one immutable revision and its complete causal ancestry. Other
   concurrent branches remain in the ledger and in read!'s full history."
  [store document-id revision-id]
  (law/require-id! document-id)
  (let [canonical-history (canonical-history store)
        by-id (:canonical/by-id canonical-history)
        revision (law/require-parent! document-id revision-id (get by-id revision-id))
        ancestors (loop [pending [(:event/id revision)] seen #{}]
                    (if-let [id (peek pending)]
                      (if (contains? seen id)
                        (recur (pop pending) seen)
                        (recur (into (pop pending) (:event/causes (get by-id id)))
                               (conj seen id)))
                      seen))
        scoped (update canonical-history :canonical/events
                       #(filterv (comp ancestors :event/id) %))]
    (project-document! store scoped document-id)))

(defn seed!
  "Import an initial revision at most once. The stable per-document lock inode
   is retained permanently; a killed importer releases its Clio kernel lock.
   Ordinary saves never use this initialization lock."
  [store command]
  (law/require-command! command)
  (when (seq (:revision/parents command))
    (throw (ex-info "A document seed must have no parents"
                    {:document-history/error :invalid-command})))
  (let [document-id (:document/id command)
        file (fs/ensure-lock-file! (fs/join (:store/seeds store) (str document-id ".lock")))
        lock (clio-fs/acquire-lock! file)]
    (try
      (if-let [existing (read! store document-id)]
        (assoc existing :seed/created? false)
        (assoc (commit! store command) :seed/created? true))
      (finally (clio-fs/release-lock! lock)))))
