(ns axxium.infra.identity-store
  "Identity provider boundary; EDN state is replayed from canonical Clio facts."
  (:require [axxium.domain.identity :as domain]
            [axxium.extern.identity-host :as host]
            [axxium.law.identity :as law]
            [clio.domain.projection :as projection]
            [clio.extern.js.fs :as fs]
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
  (projection/state (history store) {} domain/apply-event))

(defmethod create-provider :edn [{:keys [directory]}]
  (law/require! (and (string? directory) (seq directory)) :missing-directory "EDN identity directory is required")
  (let [directory (host/private-directory! (host/resolve-path directory))
        file (str directory "/identity.edn")
        schemas (str directory "/schemas")
        existing? (fs/exists? schemas)
        vault (host/open-vault! directory existing?)]
    (when-not (fs/exists? file)
      (law/require! (not existing?) :missing-ledger "Identity schemas exist but identity.edn is missing")
      (ledger/create-ledger! file))
    (let [store {:provider :edn :file file :vault vault :runtime (runtime/open schemas law/catalog)}]
      (history store)
      store)))

(defmethod history :edn [{:keys [file runtime]}]
  (ledger/canonicalize-files (:schema/revisions (runtime/refresh runtime)) [file]))
(defmethod seal! :edn [store value] (host/seal! (:vault store) value))
(defmethod unseal :edn [store reference] (host/unseal (:vault store) reference))

(defmethod transact! :edn [store decide]
  (let [canonical (history store)
        current (projection/state canonical {} domain/apply-event)
        {:keys [operation actor changes result]} (decide current)]
    (when (seq changes)
      (let [previous (last (:canonical/events canonical))]
        (runtime/append! (:runtime store) (:file store) :axxium/identity-changed
                         {:event/stream "axxium/identity"
                          :event/seq (inc (or (:event/seq previous) 0))
                          :event/causes (if previous [(:event/id previous)] [])
                          :event/actor (or actor "axxium")
                          :event/subject "axxium/identity"
                          :event/data {:operation operation :changes (vec changes)}})))
    result))

(defmethod create-provider :memory [_]
  {:provider :memory :events (atom []) :private (atom {})})
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
