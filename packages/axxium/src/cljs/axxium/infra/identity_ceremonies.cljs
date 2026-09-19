(ns axxium.infra.identity-ceremonies
  "Bounded Clio checkpoints for expiring ceremonies; durable identity facts are never compacted."
  (:require [axxium.domain.identity :as domain]
            [axxium.domain.identity-ceremonies :as policy]
            [axxium.extern.identity-host :as host]
            [clio.domain.projection :as projection]
            [clio.infra.event :as event]
            [clio.infra.runtime :as runtime]
            [clojure.string :as str]))

(defn vault [store]
  (assoc (:vault store) :directory (host/private-directory! (str (:directory store) "/private/ceremonies"))))

(defn entries [store]
  (if (= :memory (:provider store))
    @(:ceremonies store)
    (let [canonical (runtime/canonicalize-files (:runtime store) [(:ceremony-file store)])]
      (:challenges (projection/state canonical {} domain/apply-event)))))

(defn- persist! [store retained]
  (if (= :memory (:provider store))
    (let [references (set (map :private-ref (vals retained)))]
      (reset! (:ceremonies store) retained)
      (swap! (:private store)
             #(into {} (remove (fn [[key _]] (and (str/starts-with? key "ceremony:")
                                                   (not (contains? references key))))) %)))
    (let [checkpoint (event/make-event
                      (:schema/current (:runtime store)) :axxium/identity-changed
                      {:event/stream "axxium/ceremonies" :event/seq 1 :event/causes []
                       :event/actor "axxium" :event/subject "expiring-ceremonies"
                       :event/data {:operation :ceremonies-retained
                                    :changes (mapv (fn [[id value]] (domain/put :challenges id value)) retained)}})]
      (host/replace-private-text! (:ceremony-file store) (str (pr-str checkpoint) "\n"))
      (host/collect-private-blobs! (vault store) (set (map #(subs (:private-ref %) 9) (vals retained)))))))

(defn locked! [store run]
  (if (= :memory (:provider store)) (run) (host/with-operation-lock! (:directory store) run)))

(defn prune! [store]
  (locked! store
           #(let [current (entries store)
                  retained (policy/retained current (host/now))]
              ;; Replacement changes the inode, so fence the validated checkpoint
              ;; while the stable operation lock still excludes other replacements.
              (when (= :edn (:provider store))
                (runtime/ensure-durable! (:runtime store) (:ceremony-file store)))
              (if (not= current retained)
                (persist! store retained)
                (when (= :edn (:provider store))
                  (host/collect-private-blobs! (vault store)
                                               (set (map (fn [entry] (subs (:private-ref entry) 9)) (vals retained)))))))))

(defn unseal [store reference]
  (if (= :memory (:provider store))
    (get @(:private store) reference)
    (host/unseal (vault store) (subs reference 9))))

(defn issue!
  "Persist a bounded ceremony, optionally binding its issuance quota to a trusted client."
  ([store id browser-hash purpose data ttl]
   (issue! store id browser-hash purpose data ttl nil))
  ([store id browser-hash purpose data ttl client-hash]
   (host/bounded-private-value! data)
   (locked!
    store
    (fn []
      (let [now (host/now)
            retained (policy/retained (entries store) now)]
        (policy/admit! retained browser-hash now purpose client-hash)
        (let [reference (if (= :memory (:provider store)) (str "ceremony:" (host/id))
                            (str "ceremony:" (host/seal! (vault store) data)))
              value (cond-> {:purpose purpose :browser-hash browser-hash :issued-at now
                             :expires-at (+ now ttl) :private-ref reference}
                      client-hash (assoc :client-hash client-hash))]
          (when (= :memory (:provider store)) (swap! (:private store) assoc reference data))
          (persist! store (assoc retained id value))
          id))))))

(defn private-reference? [reference] (str/starts-with? reference "ceremony:"))

(defn reserve-proof-context!
  "Reserve a completion slot and capture its immutable record together with private proof data."
  [store id purpose browser-hash current-state]
  (locked!
   store
   #(let [now (host/now)
          challenge (policy/reserve-proof-attempt (current-state) id purpose browser-hash now)
          retained (policy/retained (entries store) now)]
      ;; A failed publication never starts crypto. A visible uncertain increment
      ;; remains spent; a retry advances again or refuses, never discounts it.
      (persist! store (assoc retained id challenge))
      {:record challenge :data (unseal store (:private-ref challenge))})))

(defn reserve-proof!
  "Return the protected proof data from one durable completion reservation."
  [store id purpose browser-hash current-state]
  (:data (reserve-proof-context! store id purpose browser-hash current-state)))

(defn private-value [store id]
  (when-let [record (get (policy/retained (entries store) (host/now)) id)]
    (unseal store (:private-ref record))))

(defn remove! [store id]
  (locked! store #(persist! store (dissoc (policy/retained (entries store) (host/now)) id))))

(defn finish-password! [store id]
  (locked!
   store
   #(let [retained (policy/retained (entries store) (host/now))]
      (when (= :password/active (get-in retained [id :purpose]))
        ;; Keep issuance time/client for throttling; only release the active slot.
        (persist! store (assoc-in retained [id :purpose] :password/attempt))))))

(defn ^:async password-work!
  "Bound public password derivation before invoking expensive work, across restarts."
  [store client-key work]
  (let [id (str "password:" (host/id))]
    (issue! store id (str "password:" client-key) :password/active {} 300000)
    (try (await (work))
         (finally
           ;; Admission has a durable expiring lease. Cleanup cannot replace a
           ;; committed result or the original work error with a lock conflict.
           (loop [attempt 0]
             (let [error (try (finish-password! store id) nil (catch :default error error))]
               (when error
                 (if (and (= :clio.ledger/concurrent-stream-write (:clio/error (ex-data error)))
                          (< attempt 4))
                   (do (await (host/delay! 20)) (recur (inc attempt)))
                   (host/report-deferred-cleanup! error)))))))))
