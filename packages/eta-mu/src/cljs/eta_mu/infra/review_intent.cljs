;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.infra.review-intent
  "Bounded Clio-backed publication-intent adapter. The configured partition is
  installation input; admission facts remain caller-port input and are rechecked
  by the existing publisher domain before any child process is started."
  (:require [eta-mu.domain.review-publication :as publication]
            [eta-mu.extern.review-intent :as host]
            [eta-mu.law.review-intent :as law]))

(defn- refused [reason] {:status :refused :reason reason})

(defn- configured-store? [store]
  (and (map? store)
       (string? (:schema-directory store))
       (string? (:ledger-file store))
       (law/file-identity? [(:partition-device store) (:partition-inode store)])
       (law/lock-key? (:expected-lock-key store))))

(def ^:private token-vault (host/new-opaque-vault))
(def ^:private store-keys [:schema-directory :ledger-file :partition-device
                           :partition-inode :expected-lock-key])

(defn- store-key [store] (select-keys store store-keys))

(defn- safe-admission [context]
  (try
    (publication/admit (assoc context :now-ms (host/clock-ms)))
    (catch :default _ {:status :refused :reason :clock-or-admission})))

(defn- observed-worker-result [result]
  (if (map? result)
    (dissoc result :capability :capability-issued? :recovery-receipt
            :outcome-receipt :outcome-issued?)
    {:status :unknown :reason :worker-response-shape}))

(defn- invoke-worker [request]
  (try
    (observed-worker-result (host/run-fixed-worker! request))
    (catch :default error
      (let [error-type (:intent/error (ex-data error))
            ;; These two host failures occur before spawn. An unclassified
            ;; exception may follow a started worker, so it remains uncertain.
            preflight? (contains? #{:installation :input-bound} error-type)]
        {:status (if (and preflight? (= :transition (:operation request))) :refused :unknown)
         :reason (if preflight? :worker-preflight :worker-invocation)
         :error (or error-type :worker-error)}))))

(defn- bind-recovery-result [store result outcome-receipt]
  (if (map? (:recovery result))
    (let [token ((:put! token-vault)
                 {:kind :recovery :store (store-key store) :recovery (:recovery result)
                  :outcome-receipt outcome-receipt})]
      (-> result (dissoc :recovery) (assoc :recovery-receipt token)))
    result))

(defn- issue-authorities! [store binding command result]
  (let [record {:store (store-key store) :binding binding
                :claim-id (:claim-id command) :owner (:owner command)
                :expected-version (:intent-version result)}
        capability ((:put! token-vault) (assoc record :kind :post-capability))
        outcome ((:put! token-vault) (assoc record :kind :outcome
                                           :capability capability))]
    {:capability capability :outcome-receipt outcome :capability-issued? true}))

(defn- started-ack? [command result]
  (and (= :post-started (:state command) (:state result))
       (law/text? (:claim-id command))
       (= (:claim-id command) (:claim-id result))
       (law/natural? (:expected-version command))
       (law/natural? (:intent-version result))
       (law/portable-equal? (inc (:expected-version command)) (:intent-version result))))

(defn- recovery-record [token store]
  (let [record ((:lookup token-vault) token)]
    (when (and (= :recovery (:kind record))
               (= (store-key store) (:store record)))
      record)))

(defn transition!
  "Re-admit current native facts, then ask one bounded fixed worker to perform
  canonical replay plus Clio slot CAS. `:capability` is an opaque process-local
  Symbol and exists only for the fresh post-started append result."
  [store context command]
  (let [admission (safe-admission context)
        binding (:binding admission)
        lock-key (:lock-key binding)]
    (cond
      (not= :admitted (:status admission)) (refused [:admission (:reason admission)])
      (not (configured-store? store)) (refused :installation-store)
      (not= (:expected-lock-key store) lock-key) (refused :installation-lock-key)
      (not (contains? #{:reserved :post-started} (:state command))) (refused :transition)
      (and (= :post-started (:state command))
           (not (and (law/natural? (:expected-version command))
                     (law/text? (:owner command))))) (refused :claim)
      :else
      (let [claim-id (when (= :post-started (:state command)) (str (random-uuid)))
            request {:operation :transition
                     :store (store-key store)
                     :context (assoc context :now-ms (get-in admission [:context :now-ms]))
                     :binding binding
                     :command (cond-> (select-keys command [:state :expected-version :owner])
                                claim-id (assoc :claim-id claim-id))}
            result (bind-recovery-result store (invoke-worker request) nil)]
        (if (and (= :appended (:status result)) (= :post-started (:state result)))
          (let [fresh-admission (safe-admission context)]
            (if (and (= :admitted (:status fresh-admission))
                     (= binding (:binding fresh-admission))
                     (started-ack? (:command request) result))
              (merge result (issue-authorities! store binding (:command request) result))
              (assoc result :status :unknown :reason :ack-recheck :capability-issued? false)))
          (assoc result :capability-issued? false))))))

(defn record-unknown!
  "Persist uncertainty for exactly one privately acknowledged started claim.
  The separate opaque receipt survives consuming the POST capability. A valid
  store-bound receipt retires its own wire authority before freshness checks or
  any uncertain worker attempt. Retry can repair durability, never authorize POST."
  [store context receipt]
  (let [record ((:lookup token-vault) receipt)]
    (if-not (and (configured-store? store) (= :outcome (:kind record))
                 (= (store-key store) (:store record)))
      (assoc (refused :outcome-receipt) :capability-issued? false)
      (do
        ((:remove! token-vault) (:capability record))
        (let [admission (safe-admission context)
              binding (:binding record)]
          (if-not (and (= :admitted (:status admission))
                       (= binding (:binding admission)))
            (assoc (refused :outcome-admission) :capability-issued? false)
            (let [command (assoc (select-keys record [:expected-version :owner :claim-id])
                                 :state :post-unknown)
                  result (bind-recovery-result
                           store (invoke-worker {:operation :transition
                                                 :store (store-key store)
                                                 :context (assoc context :now-ms
                                                                 (get-in admission [:context :now-ms]))
                                                 :binding binding :command command}) receipt)
                  appended? (= :appended (:status result))
                  exact-ack? (and (= :post-unknown (:state result))
                                  (= (:claim-id record) (:claim-id result))
                                  (law/natural? (:intent-version result))
                                  (law/portable-equal? (inc (:expected-version record))
                                                       (:intent-version result)))
                  result (if (and appended? (not exact-ack?))
                           (assoc result :status :unknown :reason :outcome-ack)
                           result)]
              (when (and appended? exact-ack?)
                ((:remove! token-vault) receipt))
              (assoc result :capability-issued? false))))))))

(defn recover!
  "Exact Clio retry is durability repair only. Even a recovery append is
  discovery-only and never mints an effect capability."
  [store recovery]
  (if-not (configured-store? store)
    (refused :recovery)
    (let [record (recovery-record recovery store)
          authorized? (some? record)
          recovery-map (if authorized? (:recovery record)
                           (when (map? recovery) recovery))]
      (if-not recovery-map
        (refused :recovery-receipt)
        (let [result (invoke-worker {:operation :recover
                                    :store (store-key store)
                                    :recovery recovery-map
                                    :append-uncertain? authorized?})
              next-recovery (:recovery result)
              result (dissoc result :recovery)]
          (when (and authorized? (map? next-recovery))
            ((:replace! token-vault) recovery (assoc record :recovery next-recovery)))
          (when (and authorized? (not (map? next-recovery))
                     (contains? #{:recovered :replayed} (:status result)))
            ((:remove! token-vault) recovery)
            (when-let [outcome-receipt (:outcome-receipt record)]
              ((:remove! token-vault) outcome-receipt)))
          (assoc result :capability-issued? false))))))

(defn consume-capability! [capability binding]
  (let [record ((:lookup token-vault) capability)]
    (if (and (= :post-capability (:kind record))
             (= binding (:binding record)))
      (do ((:remove! token-vault) capability) true)
      false)))
