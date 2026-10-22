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
    (dissoc result :capability :capability-issued? :recovery-receipt)
    {:status :unknown :reason :worker-response-shape}))

(defn- bind-recovery-result [store result]
  (if (map? (:recovery result))
    (let [token ((:put! token-vault)
                 {:kind :recovery :store (store-key store) :recovery (:recovery result)})]
      (-> result (dissoc :recovery) (assoc :recovery-receipt token)))
    result))

(defn- issue-capability! [binding]
  ((:put! token-vault) {:kind :post-capability :binding binding}))

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
            raw-result (host/run-fixed-worker! request)
            result (bind-recovery-result store (observed-worker-result raw-result))]
        (if (and (= :appended (:status result)) (= :post-started (:state result)))
          (let [fresh-admission (safe-admission context)]
            (if (and (= :admitted (:status fresh-admission))
                     (= binding (:binding fresh-admission)))
              (assoc result :capability (issue-capability! binding) :capability-issued? true)
              (assoc result :status :unknown :reason :ack-recheck :capability-issued? false)))
          (assoc result :capability-issued? false))))))

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
        (let [raw-result (host/run-fixed-worker!
                          {:operation :recover
                           :store (store-key store)
                           :recovery recovery-map
                           :append-uncertain? authorized?})
              result (observed-worker-result raw-result)
              next-recovery (:recovery result)
              result (dissoc result :recovery)]
          (when (and authorized? (map? next-recovery))
            ((:replace! token-vault) recovery (assoc record :recovery next-recovery)))
          (when (and authorized? (not (map? next-recovery))
                     (contains? #{:recovered :replayed} (:status result)))
            ((:remove! token-vault) recovery))
          (assoc result :capability-issued? false))))))

(defn consume-capability! [capability binding]
  (let [record ((:lookup token-vault) capability)]
    (if (and (= :post-capability (:kind record))
             (= binding (:binding record)))
      (do ((:remove! token-vault) capability) true)
      false)))
