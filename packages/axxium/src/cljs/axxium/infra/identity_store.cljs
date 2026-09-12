(ns axxium.infra.identity-store
  "Identity provider boundary; EDN state is replayed from canonical Clio facts."
  (:require [axxium.domain.identity :as domain]
            [axxium.domain.identity-private :as private-domain]
            [axxium.extern.identity-host :as host]
            [axxium.infra.identity-ceremonies :as ceremonies]
            [axxium.law.identity :as law]
            [clio.domain.projection :as projection]
            [clio.extern.js.fs :as fs]
            [clio.infra.event :as event]
            [clio.infra.ledger :as ledger]
            [clio.infra.runtime :as runtime]))

(defmulti create-provider
  "Construct an explicitly selected identity persistence provider."
  :provider)
(defmulti history "Read canonical identity facts." :provider)
(defmulti transact! "Commit all changes from a synchronous pure decision atomically." (fn [store _] (:provider store)))
(defmulti seal! "Persist private credential material outside public facts." (fn [store _] (:provider store)))
(defmulti unseal "Read private credential material by immutable reference." (fn [store _] (:provider store)))

(defn state "Rebuild disposable identity state." [store]
  ;; Durable consumption facts win even if a crash preceded checkpoint cleanup.
  (projection/state (history store) {:challenges (ceremonies/entries store)} domain/apply-event))

(defn check-readiness!
  "Authenticate current private references while excluding concurrent checkpoint cleanup."
  [store]
  (ceremonies/locked!
   store
   (fn []
     (let [current (state store)
           records (concat (vals (:credentials current)) (vals (:challenges current)))]
       (doseq [reference (distinct (keep :private-ref records))]
         (law/require! (some? (unseal store reference)) :missing-secret "Referenced identity material is unavailable"))
       true))))

(defn read-private-value
  "Read a credential and authenticate its blob while excluding reference replacement."
  [store key]
  (ceremonies/locked!
   store
   #(when-let [record (get-in (state store) [:credentials key])]
      (unseal store (:private-ref record)))))

(defn discard-unreferenced!
  "Reclaim only supplied main-vault candidates absent from fenced current state."
  [store references]
  (ceremonies/locked!
   store
   (fn []
     (let [current (state store)
           discarded (private-domain/reclaimable-references current references)]
       ;; A failed append can already be visible. Re-fence current history before
       ;; any deletion, and retain every current reference even after a lost ack.
       (when (= :edn (:provider store))
         (runtime/ensure-durable! (:runtime store) (:file store)))
       (doseq [reference discarded]
         (if (= :memory (:provider store))
           (swap! (:private store) dissoc reference)
           (host/discard-private! (:vault store) reference)))
       discarded))))

(defn- ensure-ledger! [file]
  (when-not (fs/exists? file)
    (try (ledger/create-ledger! file)
         (catch :default cause
           (when-not (host/already-exists-error? cause) (throw cause))))))

(defn- open-edn-provider! [directory]
  (let [file (str directory "/identity.edn")
        ceremony-file (str directory "/ceremonies.edn")
        schemas (str directory "/schemas")
        ;; Surviving facts are proof of an existing encrypted identity store
        ;; even when its schema directory was lost during a partial restore.
        existing? (or (fs/exists? schemas) (fs/exists? file) (fs/exists? ceremony-file)
                      (host/private-state-exists? directory))
        _ (when-not (fs/exists? file)
            (law/require! (not existing?) :missing-ledger
                          "Identity state survives but identity.edn is missing; restore the original history"))
        _ (when existing?
            (law/require! (fs/exists? ceremony-file) :missing-ceremonies
                          "Identity state survives but ceremonies.edn is missing; restore the original checkpoint"))
        vault (host/open-vault! directory existing?)]
    ;; Publish the checkpoint first: a visible final identity-ledger creation
    ;; can then retry its fence without inventing missing ceremony history.
    (ensure-ledger! ceremony-file)
    (ensure-ledger! file)
    (let [store {:provider :edn :directory directory :file file :ceremony-file ceremony-file
                 :vault vault :runtime (runtime/open schemas law/catalog)}]
      (history store)
      (runtime/ensure-durable! (:runtime store) file)
      (ceremonies/prune! store)
      store)))

(defmethod create-provider :edn [{:keys [directory]}]
  (law/require! (and (string? directory) (seq directory)) :missing-directory "EDN identity directory is required")
  (let [directory (host/private-directory! (host/resolve-path directory))]
    (host/with-initialization-lock! directory #(open-edn-provider! directory))))

(defmethod history :edn [{:keys [file runtime]}]
  (law/require! (fs/exists? file) :missing-ledger
                "Identity ledger disappeared; refusing empty replay")
  (runtime/canonicalize-files runtime [file]))
(defmethod seal! :edn [store value] (host/seal! (:vault store) value))
(defmethod unseal :edn [store reference]
  (if (ceremonies/private-reference? reference) (ceremonies/unseal store reference)
      (host/unseal (:vault store) reference)))

(defn- append-prepared-event! [store prepared]
  (let [revisions (:schema/revisions (runtime/refresh (:runtime store)))]
    (try
      (ledger/append-event! revisions (:file store) prepared)
      (catch :default cause
        ;; An append can become visible before its durability fence fails. Keep
        ;; the original decision/result in this invocation and re-fence only
        ;; that exact accepted event. Never repeat the authority or crypto work.
        (if (some #(= prepared %) (:canonical/events (history store)))
          (ledger/append-event! revisions (:file store) prepared)
          (throw cause))))))

(defn- append-transaction! [store decide]
  (let [canonical (history store)
        current (projection/state canonical {:challenges (ceremonies/entries store)} domain/apply-event)
        {:keys [operation actor changes result]} (decide current)]
    (if (seq changes)
      (let [previous (last (:canonical/events canonical))]
        (append-prepared-event!
         store
         (event/make-event
          (:schema/current (:runtime store)) :axxium/identity-changed
          {:event/stream "axxium/identity"
           :event/seq (inc (or (:event/seq previous) 0))
           :event/causes (if previous [(:event/id previous)] [])
           :event/actor (or actor "axxium")
           :event/subject "axxium/identity"
           :event/data {:operation operation :changes (vec changes)}})))
      (runtime/ensure-durable! (:runtime store) (:file store)))
    result))

(defmethod transact! :edn [store decide]
  (ceremonies/locked! store #(append-transaction! store decide)))

(defmethod create-provider :memory [_]
  {:provider :memory :events (atom []) :private (atom {}) :ceremonies (atom {})})
(defmethod history :memory [store] {:canonical/events @(:events store)})
(defmethod seal! :memory [store value]
  (let [reference (host/id)] (swap! (:private store) assoc reference value) reference))
(defmethod unseal :memory [store reference] (get @(:private store) reference))
(defmethod transact! :memory [store decide]
  (let [{:keys [operation changes result]} (decide (state store))]
    (when (seq changes)
      (swap! (:events store) conj {:event/data {:operation operation :changes changes}}))
    result))
(defmethod create-provider :default [_]
  (throw (ex-info "Unsupported identity provider" {:code :unsupported-identity-provider})))
