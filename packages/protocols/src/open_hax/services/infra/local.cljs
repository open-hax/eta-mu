(ns open-hax.services.infra.local
  "Clio storage adapter. Every read rebuilds state from validated canonical history."
  (:require [clio.domain.projection :as projection]
            [clio.extern.js.fs :as fs]
            [clio.infra.event :as event]
            [clio.infra.ledger :as ledger]
            [clio.infra.runtime :as runtime]
            [open-hax.services.domain.local :as domain]
            [open-hax.services.extern.local :as host]
            [open-hax.services.law.local :as law]))

(defn history [{:keys [file runtime]}]
  (law/require! (fs/exists? file) :missing-ledger
                "Local service ledger disappeared; refusing empty replay")
  (ledger/canonicalize-files (:schema/revisions (runtime/refresh runtime)) [file]))

(defn state [store]
  (projection/state (history store) {} domain/apply-event))

(defn open! [directory]
  (law/validate-directory! directory)
  (let [directory (host/resolve-path directory)
        file (str directory "/services.edn")
        schemas (str directory "/schemas")
        existing? (fs/exists? schemas)]
    (fs/ensure-dir! directory)
    ;; Never treat a lost ledger beside known schemas as a fresh empty service.
    (when-not (fs/exists? file)
      (law/require! (not existing?) :missing-ledger
                    "Local service schemas exist but services.edn is missing")
      (try
        (ledger/create-ledger! file)
        (catch :default cause
          (when-not (host/already-exists-error? cause)
            (throw cause)))))
    (let [store {:directory directory :file file
                 :runtime (runtime/open schemas law/catalog)}]
      (history store)
      store)))

(defn transact! [store transition]
  (let [canonical (history store)
        current (projection/state canonical {} domain/apply-event)
        {:keys [changes result]} (transition current)]
    (when (seq changes)
      (let [previous (last (:canonical/events canonical))
            event (event/make-event
                   (get-in store [:runtime :schema/current])
                   :open-hax.services/changed
                   {:event/stream "open-hax/services"
                    :event/seq (inc (or (:event/seq previous) 0))
                    :event/causes (if previous [(:event/id previous)] [])
                    :event/actor "local-development"
                    :event/subject "open-hax/services"
                    :event/data {:changes (vec changes)}})]
        ;; Clio locks the inode and refuses a stale writer claiming this slot.
        ;; Callers may retry the whole operation; no lost updates are hidden.
        (ledger/append-event!
         (:schema/revisions (runtime/refresh (:runtime store))) (:file store) event)))
    result))

(defn ^:async perform [operation] (operation))

(defn watch! [store collection predicate callback]
  (let [seen (atom (set (:canonical/event-ids (history store))))
        pump! (fn []
                (doseq [event (:canonical/events (history store))
                        :when (not (contains? @seen (:event/id event)))]
                  (swap! seen conj (:event/id event))
                  (doseq [change (get-in event [:event/data :changes])
                          :when (and (= collection (:collection change))
                                     (= :put (:op change))
                                     (predicate (:value change)))]
                    (try (callback (:value change))
                         (catch :default cause
                           (host/report-callback-error! cause))))))
        close! (host/watch-file! (:file store) pump!)]
    (try (pump!)
         (catch :default cause
           (close!)
           (throw cause)))
    {:id (host/id) :close! close! :close close!}))
