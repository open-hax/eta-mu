;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.infra.review-intent-worker
  "Fixed child entrypoint. It accepts one bounded EDN request and exposes only
  publisher transition/recovery operations over the exact Clio dependency."
  (:require [clio.infra.runtime :as clio-runtime]
            [clio.law.schema :as clio-schema-law]
            [clio.shape.edn :as clio-edn]
            [eta-mu.domain.review-intent :as intent]
            [eta-mu.domain.review-publication :as publication]
            [eta-mu.extern.review-intent :as host]
            [eta-mu.law.review-intent :as law]
            [eta-mu.shape.review-intent :as shape]))

(def ^:private cas-attempts 4)
(def ^:private schema-id shape/event-type)
(def ^:private catalog
  {schema-id (clio-schema-law/event-schema schema-id shape/event-data-schema)})

(defn- fail [reason] {:status :refused :reason reason})

(defn- file-identity [{:keys [partition-device partition-inode]}]
  [partition-device partition-inode])

(defn- file-guard [store]
  {:expected-file-identity (file-identity store)})

(defn- canonical-guard [store]
  {:expected-file-identities {(:ledger-file store) (file-identity store)}})

(defn- store-valid? [{:keys [ledger-file expected-lock-key] :as store} lock-key]
  (try
    (and (= lock-key expected-lock-key)
         (= (file-identity store) (host/partition-identity ledger-file)))
    (catch :default _ false)))

(defn- target-events [runtime store lock-key]
  (let [canonical (clio-runtime/canonicalize-files runtime [(:ledger-file store)]
                                                   (canonical-guard store))
        stream (shape/lock-stream lock-key)]
    (filterv #(= stream (:event/stream %)) (:canonical/events canonical))))

(defn- append-transition [request]
  (let [{:keys [store binding command context]} request
        context (assoc context :now-ms (host/clock-ms))
        admission (publication/admit context)
        lock-key (get-in admission [:binding :lock-key])]
    (if-not (and (= :admitted (:status admission))
                 (= binding (:binding admission))
                 (law/binding? binding) (store-valid? store lock-key))
      (fail :installation-binding)
      (let [runtime (clio-runtime/open (:schema-directory store) catalog)
            stream (shape/lock-stream lock-key)]
        (loop [attempt 0]
          (if (>= attempt cas-attempts)
            {:status :refused :reason :cas-exhausted}
            (let [events (target-events runtime store lock-key)
                  projection (intent/replay lock-key events)
                  proposal (intent/transition {:status :admitted :binding binding}
                                              projection command)]
              (if-not (= :append (:status proposal))
                proposal
                (let [event-data {:event/stream stream
                                  :event/seq (:event-seq proposal)
                                  :event/causes (:causes proposal)
                                  :event/actor "eta-mu-review-intent-adapter"
                                  :event/subject stream
                                  :event/data (:event-data proposal)}
                      append-result (try
                                      {:result (clio-runtime/append! runtime (:ledger-file store)
                                                                     schema-id event-data
                                                                     (file-guard store))}
                                      (catch :default error
                                        {:error error}))]
                    (if-let [error (:error append-result)]
                      (let [error-type (:clio/error (ex-data error))]
                        (cond
                          (= :clio.ledger/concurrent-stream-write error-type)
                          (recur (inc attempt))

                          (= :clio.ledger/id-collision error-type)
                          {:status :refused :reason :event-id-collision}

                          (contains? #{"clio.schema" "clio.event"} (namespace error-type))
                          {:status :refused :reason :event-schema}

                          :else
                          {:status :unknown :reason :append-outcome
                           :recovery (:clio/append-recovery (ex-data error))
                           :error (or error-type :append-error)
                           :message (ex-message error)
                           :capability-issued? false}))
                      (let [result (:result append-result)]
                        {:status (if (= :appended (:append/result result)) :appended :replayed)
                         :append-result (:append/result result) :state (:state proposal)
                         :event-seq (:event-seq proposal)
                         :intent-version (:intent-version proposal)
                         :event-id (get-in result [:event :event/id])
                         :claim-id (get-in result [:event :event/data :claim-id])})))))))))))

(defn- event-visible? [runtime store event]
  (let [canonical (clio-runtime/canonicalize-files runtime [(:ledger-file store)]
                                                   (canonical-guard store))]
    (some #(= event %) (:canonical/events canonical))))

(defn- recover [request]
  (let [{:keys [store recovery append-uncertain?]} request]
    (if-not (and (map? recovery)
                 (= (:ledger-file store) (:ledger/path recovery))
                 (store-valid? store (get-in recovery [:event :event/data :lock-key]))
                 (= schema-id (get-in recovery [:event :event/type]))
                 (= (shape/lock-stream (get-in recovery [:event :event/data :lock-key]))
                    (get-in recovery [:event :event/stream]))
                 (law/intent-event? (:event recovery)))
      (fail :recovery-binding)
      (try
        (let [runtime (clio-runtime/open (:schema-directory store) catalog)
              visible? (event-visible? runtime store (:event recovery))]
          (if (or visible? (true? append-uncertain?))
            (let [result (clio-runtime/retry-append! runtime recovery (file-guard store))]
              {:status (if (= :appended (:append/result result)) :recovered :replayed)
               :append-result (:append/result result)
               :event-id (get-in result [:event :event/id])
               :capability-issued? false})
            (fail :recovery-not-visible)))
        (catch :default error
          {:status :unknown :reason :recovery-outcome
           :recovery (:clio/append-recovery (ex-data error))
           :error (or (:clio/error (ex-data error)) :recovery-error)
           :capability-issued? false})))))

(defn- run-request [request]
  (case (:operation request)
    :transition (append-transition request)
    :recover (recover request)
    (fail :operation)))

(defn entry []
  (try
    (let [input (host/read-worker-input!)
          response (try (run-request (clio-edn/read-one input))
                        (catch :default error
                          {:status :refused :reason :request-invalid
                           :error (or (:intent/error (ex-data error))
                                      (:clio/error (ex-data error)))}))
          output (pr-str response)]
      (host/write-worker-output! output)
      response)
    (catch :default error
      (host/fail-worker! (str "review-intent worker refused: "
                              (or (:intent/error (ex-data error)) :worker-failure) "\n")))))
