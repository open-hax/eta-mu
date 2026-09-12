(ns axxium.infra.identity-store
  "Identity provider boundary; EDN state is replayed from canonical Clio facts."
  (:require [axxium.domain.identity :as domain]
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

(defn- ensure-ledger! [file]
  (when-not (fs/exists? file)
    (try (ledger/create-ledger! file)
         (catch :default cause
           (when-not (host/already-exists-error? cause) (throw cause))))))

(defn- open-edn-provider! [directory]
  (let [file (str directory "/identity.edn")
        schemas (str directory "/schemas")
        ;; Surviving facts are proof of an existing encrypted identity store
        ;; even when its schema directory was lost during a partial restore.
        existing? (or (fs/exists? schemas) (fs/exists? file) (host/private-state-exists? directory))
        _ (when-not (fs/exists? file)
            (law/require! (not existing?) :missing-ledger
                          "Identity state survives but identity.edn is missing; restore the original history"))
        vault (host/open-vault! directory existing?)]
    (ensure-ledger! file)
    (let [ceremony-file (str directory "/ceremonies.edn")
          _ (ensure-ledger! ceremony-file)
          store {:provider :edn :directory directory :file file :ceremony-file ceremony-file
                 :vault vault :runtime (runtime/open schemas law/catalog)}]
      (history store)
      (ledger/ensure-durable! (get-in store [:runtime :schema/revisions]) file)
      (ceremonies/prune! store)
      store)))

(defmethod create-provider :edn [{:keys [directory]}]
  (law/require! (and (string? directory) (seq directory)) :missing-directory "EDN identity directory is required")
  (let [directory (host/private-directory! (host/resolve-path directory))]
    (host/with-initialization-lock! directory #(open-edn-provider! directory))))

(defmethod history :edn [{:keys [file runtime]}]
  (law/require! (fs/exists? file) :missing-ledger
                "Identity ledger disappeared; refusing empty replay")
  (ledger/canonicalize-files (:schema/revisions (runtime/refresh runtime)) [file]))
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
      (ledger/ensure-durable! (:schema/revisions (runtime/refresh (:runtime store))) (:file store)))
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
