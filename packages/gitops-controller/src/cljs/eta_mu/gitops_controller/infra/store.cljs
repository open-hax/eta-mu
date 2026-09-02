(ns eta-mu.gitops-controller.infra.store
  "Append-only delivery and dispatch evidence with immutable ID projections."
  (:require [clojure.string :as str]
            [eta-mu.gitops-controller.extern.fs :as fs]
            [eta-mu.gitops-controller.extern.runtime :as runtime]
            [eta-mu.gitops-controller.law.webhook :as law]
            [eta-mu.gitops-controller.shape.edn :as edn]))

(defn- paths [root]
  {:deliveries (fs/join root "deliveries")
   :dispatches (fs/join root "dispatches")
   :dispatch-calls (fs/join root "dispatch-calls")
   :gate-checks (fs/join root "gate-checks")
   :gate-terminal-intents (fs/join root "gate-terminal-intents")
   :outbox (fs/join root "outbox")
   :workflow-runs (fs/join root "workflow-runs")
   :ledgers (fs/join root "ledgers")})

(def ^:private dispatch-receipt-types
  #{"review-dispatch-intent"
    "review-gate-check-prepared"
    "review-dispatch-call-begun"
    "review-workflow-run-correlated"
    "review-gate-terminal-intent"
    "review-command-completed"})

(def ^:private delivery-receipt-types
  #{"webhook-received"})

(def ^:private ledger-specifications
  [{:ledger "deliveries"
    :projections [[:deliveries "webhook-received"]]
    :types delivery-receipt-types}
   {:ledger "dispatches"
    :projections
    [[:outbox "review-dispatch-intent"]
     [:gate-checks "review-gate-check-prepared"]
     [:dispatch-calls "review-dispatch-call-begun"]
     [:workflow-runs "review-workflow-run-correlated"]
     [:gate-terminal-intents "review-gate-terminal-intent"]
     [:dispatches "review-command-completed"]]
    :types dispatch-receipt-types}])

(declare assert-no-legacy-state! initialize-delivery-cache!)

(defn create [root]
  {:root root
   :paths (paths root)
   ;; All ledger/projection mutations in one controller process are serialized.
   ;; Production still runs one controller replica per state root; this queue is
   ;; the same-process half of that single-writer contract.
   :writer-tails* {:deliveries (atom (js/Promise.resolve nil))
                   :other (atom (js/Promise.resolve nil))}
   ;; The delivery journal is validated once at startup. Admission and periodic
   ;; replay then remain bounded by one identity or the live pending set, never
   ;; by total historical journal length.
   :delivery-cache* (atom nil)
   ;; A journal append is authoritative. If projection publication fails, keep
   ;; the bounded repair work in memory so periodic replay can heal it live.
   :dirty-projections* (atom {})})

(defn ^:async initialize! [{:keys [root paths] :as store}]
  (await (fs/ensure-directory! root (fs/dirname root)))
  (doseq [directory (vals paths)]
    (await (fs/ensure-directory! directory root)))
  ;; This controller has never shipped a compatible JSON/NDJSON state schema.
  ;; Refuse legacy evidence before creating or appending any native journal.
  (await (assert-no-legacy-state! store))
  (await (initialize-delivery-cache! store))
  store)

(defn- delivery-file [{:keys [paths]} delivery-id]
  (fs/join (:deliveries paths) (str delivery-id ".edn")))

(defn- outbox-file [{:keys [paths]} delivery-id]
  (fs/join (:outbox paths) (str delivery-id ".edn")))

(defn- dispatch-file [{:keys [paths]} delivery-id]
  (fs/join (:dispatches paths) (str delivery-id ".edn")))

(defn- gate-check-file [{:keys [paths]} delivery-id]
  (fs/join (:gate-checks paths) (str delivery-id ".edn")))

(defn- dispatch-call-file [{:keys [paths]} delivery-id]
  (fs/join (:dispatch-calls paths) (str delivery-id ".edn")))

(defn- workflow-run-file [{:keys [paths]} delivery-id]
  (fs/join (:workflow-runs paths) (str delivery-id ".edn")))

(defn- gate-terminal-intent-file [{:keys [paths]} delivery-id]
  (fs/join (:gate-terminal-intents paths) (str delivery-id ".edn")))

(defn- ledger-file [{:keys [paths]} name]
  (fs/join (:ledgers paths) (str name ".nd-edn")))

(defn- receipt-type [receipt]
  (let [value (:receipt/type receipt)]
    (if (keyword? value) (name value) value)))

(defn- receipt-identity [receipt]
  (if (contains? delivery-receipt-types (receipt-type receipt))
    ["github-delivery" (:delivery/id receipt)]
    [(receipt-type receipt) (:delivery/id receipt)]))

(defn- same-wire-value? [left right]
  ;; Native EDN is the durable wire format. Compare its deterministic encoding
  ;; so keyword/string and vector/list substitutions cannot masquerade as the
  ;; same immutable evidence.
  (= (edn/encode left) (edn/encode right)))

(defn- conflict!
  [message data]
  (throw (ex-info message (merge {:error/code :immutable-state-conflict}
                                 data))))

(defn- ^:async with-writer!
  ([store operation]
   (await (with-writer! store :other operation)))
  ([store partition operation]
   (let [release* (atom nil)
         gate (js/Promise. (fn [resolve _reject]
                             (reset! release* resolve)))
         writer-tail* (get-in store [:writer-tails* partition])
         predecessor @writer-tail*]
     ;; JavaScript cannot yield between this read and reset, so each caller gets
     ;; the previous gate and publishes its own before any asynchronous work.
     (reset! writer-tail* gate)
     (await predecessor)
     (try
       (await (operation))
       (finally
         (@release* nil))))))

(defn- ^:async with-all-writers! [store operation]
  ;; Lifecycle reconciliation is startup-exclusive and takes locks in one fixed
  ;; order. Live admission otherwise never queues behind dispatch history.
  (await
   (with-writer!
    store :deliveries
    (^:async fn []
      (await (with-writer! store :other operation))))))

(defn- delivery-id-from-file-name [name]
  (when (str/ends-with? name ".edn")
    (let [delivery-id (subs name 0 (- (count name) 4))]
      (when (law/delivery-id? delivery-id) delivery-id))))

(defn- decode-ledger-line [ledger line-number line]
  (when (str/blank? line)
    (conflict! "ledger contains a blank complete record"
               {:ledger ledger :line line-number}))
  (try
    (edn/read-one line)
    (catch :default _
      (conflict! "ledger contains a corrupt complete record"
                 {:ledger ledger :line line-number}))))

(defn- ^:async read-ledger-events
  ([store ledger]
   (read-ledger-events store ledger false))
  ([store ledger repair-unterminated-tail?]
  (let [file (ledger-file store ledger)]
    (if (await (fs/path-exists? file))
      (let [{:keys [text]}
            (try
              (await (fs/read-complete-text!
                      file repair-unterminated-tail?))
              (catch :default error
                (if (= :unterminated-ledger-tail
                       (:error/code (ex-data error)))
                  (conflict! "ledger has an unterminated final record"
                             {:ledger ledger})
                  (throw error))))]
        (if (empty? text)
          []
          (let [body (subs text 0 (dec (count text)))
                lines (array-seq (.split body "\n"))]
            (mapv (fn [index line]
                    (decode-ledger-line ledger (inc index) line))
                  (range (count lines)) lines))))
      []))))

(defn- events-by-identity [ledger events]
  (reduce
   (fn [indexed event]
     (let [identity (receipt-identity event)]
       (when-not (and (law/delivery-id? (:delivery/id event))
                      (law/non-blank-string? (receipt-type event)))
         (conflict! "ledger contains an invalid immutable receipt identity"
                    {:ledger ledger :receipt/identity identity}))
       (if-let [existing (get indexed identity)]
         (if (same-wire-value? existing event)
           indexed
           (conflict! "ledger contains conflicting immutable receipts"
                      {:ledger ledger :receipt/identity identity}))
         (assoc indexed identity event))))
   {}
   events))

(defn- ledger-index [ledger allowed-types events]
  (doseq [event events]
    (when-not (and (keyword? (:receipt/type event))
                   (contains? allowed-types (receipt-type event)))
      (conflict! "ledger contains a receipt for the wrong partition"
                 {:ledger ledger
                  :receipt/type (receipt-type event)
                  :delivery/id (:delivery/id event)})))
  (events-by-identity ledger events))

(defn- ^:async read-ledger-index
  ([store ledger allowed-types]
   (read-ledger-index store ledger allowed-types false))
  ([store ledger allowed-types repair-unterminated-tail?]
   (ledger-index ledger allowed-types
                 (await (read-ledger-events
                         store ledger repair-unterminated-tail?)))))

(defn- ^:async projection-events [store partition expected-type]
  (let [directory (get-in store [:paths partition])
        names (await (fs/entries directory))]
    (loop [remaining (keep delivery-id-from-file-name (sort names))
           events []]
      (if-let [delivery-id (first remaining)]
        (let [event (-> (await (fs/read-text
                                (fs/join directory (str delivery-id ".edn"))))
                        edn/read-one)]
          (when-not (= delivery-id (:delivery/id event))
            (conflict! "projection filename does not match receipt delivery ID"
                       {:partition partition
                        :filename-delivery-id delivery-id
                        :receipt-delivery-id (:delivery/id event)}))
          (when-not (= expected-type (receipt-type event))
            (conflict! "projection contains the wrong receipt type"
                       {:partition partition
                        :expected-type expected-type
                        :actual-type (receipt-type event)
                        :delivery/id delivery-id}))
          (recur (next remaining) (conj events event)))
        events))))

(defn- projection-file-for-type [store receipt]
  (case (receipt-type receipt)
    "webhook-received" (delivery-file store (:delivery/id receipt))
    "review-dispatch-intent" (outbox-file store (:delivery/id receipt))
    "review-gate-check-prepared" (gate-check-file store
                                                  (:delivery/id receipt))
    "review-dispatch-call-begun" (dispatch-call-file store
                                                     (:delivery/id receipt))
    "review-workflow-run-correlated" (workflow-run-file
                                      store (:delivery/id receipt))
    "review-gate-terminal-intent" (gate-terminal-intent-file
                                   store (:delivery/id receipt))
    "review-command-completed" (dispatch-file store (:delivery/id receipt))
    nil))

(defn- ^:async publish-projection! [store receipt]
  (when-let [file (projection-file-for-type store receipt)]
    (when-not (await (fs/write-exclusive! file (edn/encode receipt)))
      (let [existing (-> (await (fs/read-text file)) edn/read-one)]
        (when-not (same-wire-value? existing receipt)
          (conflict! "projection conflicts with append-only ledger receipt"
                     {:receipt/identity (receipt-identity receipt)}))))))

(defn ^:async append-event!
  ([store ledger event]
   (await (append-event! store ledger event nil)))
  ([store ledger event expected-position]
   (await (fs/append-line! (ledger-file store ledger)
                           (edn/encode event) expected-position))))

(defn- ^:async publish-tracked-projection! [store receipt]
  (let [identity (receipt-identity receipt)]
    (swap! (:dirty-projections* store) assoc identity receipt)
    (await (publish-projection! store receipt))
    (swap! (:dirty-projections* store) dissoc identity)))

(defn- ^:async repair-dirty-projections! [store]
  (loop [remaining (seq @(:dirty-projections* store))]
    (when-let [[_ receipt] (first remaining)]
      (await (publish-tracked-projection! store receipt))
      (recur (next remaining)))))

(defn- ^:async require-ledger-receipt!
  [store ledger allowed-types receipt missing-code]
  (let [identity (receipt-identity receipt)
        indexed (await (read-ledger-index store ledger allowed-types))]
    (if-let [existing (get indexed identity)]
      (do
        (when-not (same-wire-value? existing receipt)
          (conflict! "ledger receipt conflicts with its immutable projection"
                     {:ledger ledger :receipt/identity identity}))
        existing)
      (throw (ex-info "immutable projection has no canonical ledger receipt"
                      {:error/code missing-code
                       :ledger ledger
                       :receipt/identity identity})))))

(defn- ^:async record-ledger-receipt!
  "Append and read back the authoritative receipt before publishing its
  rebuildable projection. Returns the first durable receipt for the identity."
  [store ledger allowed-types receipt]
  (let [identity (receipt-identity receipt)
        indexed (await (read-ledger-index store ledger allowed-types))
        existing (get indexed identity)
        created? (nil? existing)
        canonical (or existing receipt)]
    (when created?
      (await (append-event! store ledger canonical)))
    ;; append-line! fsyncs the file and directory. Reopening the journal proves
    ;; the exact canonical record before any derived projection is published.
    (await (require-ledger-receipt! store ledger allowed-types canonical
                                    :ledger-receipt-not-durable))
    (await (publish-tracked-projection! store canonical))
    {:created? created?
     :receipt canonical}))

(defn- ^:async read-projection-index [store ledger projections]
  (let [events
        (loop [pending projections result []]
          (if-let [[partition expected-type] (first pending)]
            (recur (next pending)
                   (into result
                         (await (projection-events store partition
                                                   expected-type))))
            result))]
    (events-by-identity ledger events)))

(defn- assert-indexes-equal! [ledger ledger-index projection-index]
  (doseq [[identity projection] projection-index]
    (if-let [ledger-event (get ledger-index identity)]
      (when-not (same-wire-value? projection ledger-event)
        (conflict! "projection and ledger receipts disagree"
                   {:ledger ledger :receipt/identity identity}))
      (conflict! "projection has no canonical ledger receipt"
                 {:ledger ledger :receipt/identity identity})))
  (doseq [[identity _] ledger-index]
    (when-not (contains? projection-index identity)
      (conflict! "canonical ledger receipt has no immutable projection"
                 {:ledger ledger :receipt/identity identity}))))

(defn- projection-partitions []
  (->> ledger-specifications
       (mapcat :projections)
       (map first)
       distinct))

(defn- ^:async legacy-state-paths [store]
  (let [ledger-directory (get-in store [:paths :ledgers])
        legacy-ledgers
        (->> (await (fs/entries ledger-directory))
             (filter #(str/ends-with? % ".ndjson"))
             (map #(fs/join ledger-directory %)))]
    (loop [partitions (seq (projection-partitions))
           result (vec legacy-ledgers)]
      (if-let [partition (first partitions)]
        (let [directory (get-in store [:paths partition])
              legacy-projections
              (->> (await (fs/entries directory))
                   (filter #(str/ends-with? % ".json"))
                   (map #(fs/join directory %)))]
          (recur (next partitions) (into result legacy-projections)))
        (vec (sort result))))))

(defn- ^:async assert-no-legacy-state! [store]
  (let [legacy-paths (await (legacy-state-paths store))]
    (when (seq legacy-paths)
      (throw (ex-info
              "legacy JSON/NDJSON state is unsupported; preserve it and use a fresh state root"
              {:error/code :legacy-state-unsupported
               :legacy/paths legacy-paths})))))

(defn- ^:async reconcile-ledger!
  [store {:keys [ledger projections types]}]
  (let [ledger-index (await (read-ledger-index store ledger types true))
        projection-index (await (read-projection-index
                                 store ledger projections))]
    (doseq [[identity projection] projection-index]
      (if-let [ledger-event (get ledger-index identity)]
        (when-not (same-wire-value? projection ledger-event)
          (conflict! "projection and ledger receipts disagree"
                     {:ledger ledger :receipt/identity identity}))
        (conflict! "derived projection has no authoritative journal receipt"
                   {:ledger ledger :receipt/identity identity})))
    (let [missing-projections (remove #(contains? projection-index (key %))
                                      ledger-index)]
      (doseq [[_ ledger-event]
              (sort-by (comp pr-str key) missing-projections)]
        (await (publish-projection! store ledger-event)))
      ;; Startup repairs only derived state, then reopens both sides before
      ;; replay. A projection can never create receipt authority.
      (assert-indexes-equal!
       ledger
       (await (read-ledger-index store ledger types))
       (await (read-projection-index store ledger projections)))
      {:ledger-appends 0
       :projection-restores (count missing-projections)})))

(defn- delivery-disposition [receipt]
  (some-> (:disposition receipt) name keyword))

(defn- authenticated-delivery-receipt? [receipt]
  (let [payload-sha256 (:payload/sha256 receipt)]
    (and (law/payload-sha256? payload-sha256)
         (= payload-sha256 (get-in receipt [:command :payload/sha256])))))

(defn- assert-cacheable-delivery! [receipt]
  (let [disposition (:disposition receipt)
        reason (:reason receipt)
        delivery-id (:delivery/id receipt)
        command (:command receipt)
        queued? (= :queued disposition)
        ignored? (= :ignored disposition)]
    (when-not (and (= :webhook-received (:receipt/type receipt))
                   (law/non-blank-string? (:receipt/recorded-at receipt))
                   (law/delivery-id? delivery-id)
                   (= delivery-id (:delivery-id command))
                   (authenticated-delivery-receipt? receipt)
                   (or (and queued?
                            (nil? reason)
                            (= delivery-id (:command-id command))
                            (law/admitted-command? command))
                       (and ignored?
                            (contains? law/ignored-delivery-reasons reason)
                            (law/webhook-base-source? command)
                            (nil? (:command-id command))
                            (nil? (:command/type command))
                            (nil? (:capability command))
                            (nil? (:admission command)))))
      (conflict! "delivery journal contains an invalid receipt"
                 {:delivery/id delivery-id
                  :disposition disposition}))))

(defn- ^:async projection-id-set [store partition]
  (->> (await (fs/entries (get-in store [:paths partition])))
       (keep delivery-id-from-file-name)
       set))

(defn- build-delivery-cache
  [events tail-bytes outbox-ids dispatch-call-ids completed-ids]
  (let [indexed (ledger-index "deliveries" delivery-receipt-types events)]
    ;; Delivery GUID alone is the identity. Even byte-identical repeated lines
    ;; violate the one-record-per-delivery journal contract.
    (when-not (= (count events) (count indexed))
      (conflict! "delivery journal repeats an immutable delivery GUID" {}))
    (reduce
     (fn [cache [sequence-number receipt]]
       (assert-cacheable-delivery! receipt)
       (let [delivery-id (:delivery/id receipt)
             queued? (= :queued (delivery-disposition receipt))
             pending? (and queued?
                           (not (contains? completed-ids delivery-id))
                           (or (not (contains? outbox-ids delivery-id))
                               (not (contains? dispatch-call-ids delivery-id))))]
         (cond-> (-> cache
                     (assoc-in [:by-id delivery-id] receipt)
                     (assoc-in [:sequence-by-id delivery-id] sequence-number)
                     (assoc :next-sequence (inc sequence-number)))
           pending? (assoc-in [:pending sequence-number] delivery-id))))
     {:by-id {}
      :sequence-by-id {}
      :pending (sorted-map)
      :next-sequence 0
      :tail-bytes tail-bytes}
     (map-indexed vector events))))

(defn- ^:async load-delivery-cache! [store]
  (let [file (ledger-file store "deliveries")]
    (when-not (await (fs/durable-appendable? file))
      (throw (ex-info "delivery journal is not durably appendable"
                      {:error/code :delivery-cache-not-ready})))
    (let [size-before (await (fs/file-size file))
          events (await (read-ledger-events store "deliveries"))
          size-after (await (fs/file-size file))]
      (when-not (= size-before size-after)
        (conflict! "delivery journal changed while building its cache" {}))
      (let [cache (build-delivery-cache
                   events size-after
                   (await (projection-id-set store :outbox))
                   (await (projection-id-set store :dispatch-calls))
                   (await (projection-id-set store :dispatches)))]
        (reset! (:delivery-cache* store) cache)
        cache))))

(defn- delivery-cache! [store]
  (or @(:delivery-cache* store)
      (throw (ex-info "delivery cache requires successful startup reconciliation"
                      {:error/code :delivery-cache-not-ready}))))

(defn- cache-delivery [cache receipt tail-bytes]
  (let [delivery-id (:delivery/id receipt)
        sequence-number (:next-sequence cache)]
    (cond-> (-> cache
                (assoc-in [:by-id delivery-id] receipt)
                (assoc-in [:sequence-by-id delivery-id] sequence-number)
                (assoc :next-sequence (inc sequence-number)
                       :tail-bytes tail-bytes))
      (= :queued (delivery-disposition receipt))
      (assoc-in [:pending sequence-number] delivery-id))))

(defn- remove-pending-delivery! [store delivery-id]
  (swap! (:delivery-cache* store)
         (fn [cache]
           (if-let [sequence-number
                    (get-in cache [:sequence-by-id delivery-id])]
             (update cache :pending dissoc sequence-number)
             cache))))

(defn- ^:async reconcile-all! [store]
  ;; Never leave an old cache available after reconciliation begins. A failure
  ;; must stop admission/replay until a clean restart proves the full journal.
  (reset! (:delivery-cache* store) nil)
  (let [attempts (await (read-ledger-events store "attempts" true))]
    (doseq [[index event] (map-indexed vector attempts)]
      (when-not (and (= :review-attempt-failed (:receipt/type event))
                     (law/delivery-id? (:delivery/id event)))
        (conflict! "attempts ledger contains an invalid complete receipt"
                   {:ledger "attempts" :line (inc index)}))))
  (let [totals
        (loop [remaining ledger-specifications
               result {:ledger-appends 0 :projection-restores 0}]
          (if-let [specification (first remaining)]
            (recur (next remaining)
                   (merge-with + result
                               (await (reconcile-ledger!
                                       store specification))))
            result))]
    (await (load-delivery-cache! store))
    (reset! (:dirty-projections* store) {})
    totals))

(defn- ^:async initialize-delivery-cache! [store]
  (await (with-all-writers! store (^:async fn []
                                    (await (reconcile-all! store))))))

(defn ^:async reconcile-ledgers!
  "Repair crash gaps before replay under the controller's exclusive startup
  phase. Only an unterminated final ND-EDN tail is quarantined; any complete
  corrupt record or conflicting immutable evidence fails startup."
  [store]
  (await
   (with-all-writers!
    store
    (^:async fn []
      (await (reconcile-all! store))))))

(defn- ^:async record-delivery!
  [store command disposition reason]
  (await
   (with-writer!
    store :deliveries
    (^:async fn []
      (let [payload-sha256 (:payload/sha256 command)
            _ (when-not (law/payload-sha256? payload-sha256)
                (throw (ex-info "delivery requires an authenticated payload hash"
                                {:error/code :invalid-payload-sha256
                                 :delivery/id (:delivery-id command)})))
            receipt (cond-> {:receipt/type :webhook-received
                             :receipt/recorded-at (runtime/now-timestamp)
                             :delivery/id (:delivery-id command)
                             :payload/sha256 payload-sha256
                             :disposition disposition
                             :command command}
                      reason (assoc :reason reason))
            cache (delivery-cache! store)
            existing (get-in cache [:by-id (:delivery-id command)])
            created? (nil? existing)
            canonical (or existing receipt)]
        (when created?
          (assert-cacheable-delivery! receipt)
          (let [append-result
                (try
                  (await (append-event!
                          store "deliveries" receipt (:tail-bytes cache)))
                  (catch :default error
                    ;; The append may have reached disk before a later fsync or
                    ;; readback failed. Do not guess: this process cannot admit
                    ;; or replay again until startup reconstructs the cache.
                    (reset! (:delivery-cache* store) nil)
                    (throw error)))
                readback
                (try
                  (edn/read-one (:readback append-result))
                  (catch :default error
                    (reset! (:delivery-cache* store) nil)
                    (throw error)))]
            (when-not (same-wire-value? receipt readback)
              (reset! (:delivery-cache* store) nil)
              (conflict! "delivery append readback changed the receipt"
                         {:delivery/id (:delivery-id command)}))
            (swap! (:delivery-cache* store)
                   cache-delivery receipt (:end append-result))))
        (await (publish-tracked-projection! store canonical))
        (when-not (and (= (:delivery-id command) (:delivery/id canonical))
                       (= "webhook-received" (receipt-type canonical)))
          (conflict! "delivery receipt has an invalid immutable identity"
                     {:delivery/id (:delivery-id command)}))
        (when-not (and (= payload-sha256 (:payload/sha256 canonical))
                       (= (name disposition)
                          (some-> (:disposition canonical) name))
                       (= (some-> reason name)
                          (some-> (:reason canonical) name))
                       (same-wire-value? (:command canonical) command))
          (conflict! "delivery ID was replayed with a different command"
                     {:delivery/id (:delivery-id command)
                      :error/code :delivery-payload-mismatch}))
        {:accepted? created?
         :duplicate? (not created?)
         :receipt canonical})))))

(defn ^:async accept-delivery!
  [store command]
  (await (record-delivery! store command :queued nil)))

(defn ^:async ignore-delivery!
  [store command reason]
  (await (record-delivery! store command :ignored reason)))

(defn ^:async read-delivery [store delivery-id]
  (await
   (with-writer!
    store :deliveries
    (^:async fn []
      (let [canonical (get-in (delivery-cache! store) [:by-id delivery-id])
            _ (when-not canonical
                (if (await (fs/path-exists?
                            (delivery-file store delivery-id)))
                  (do
                    ;; A projection that appeared after startup cannot create
                    ;; journal authority. Invalidate the cache so readiness
                    ;; stays revoked until a clean restart reconciles all
                    ;; immutable evidence and fails closed on the orphan.
                    (reset! (:delivery-cache* store) nil)
                    (conflict!
                     "delivery projection has no cached journal receipt"
                     {:delivery/id delivery-id}))
                  (throw (ex-info "delivery receipt does not exist"
                                  {:error/code :delivery-not-found
                                   :delivery/id delivery-id}))))
            _ (await (publish-tracked-projection! store canonical))
            receipt (-> (await (fs/read-text
                                (delivery-file store delivery-id)))
                        edn/read-one)]
        (when-not (and (= delivery-id (:delivery/id receipt))
                       (= "webhook-received" (receipt-type receipt)))
          (conflict! "delivery projection has an invalid immutable identity"
                     {:delivery/id delivery-id}))
        (when-not (same-wire-value? canonical receipt)
          (conflict! "delivery projection and cached journal receipt disagree"
                     {:delivery/id delivery-id}))
        receipt)))))

(defn ^:async read-dispatch-intent [store delivery-id]
  (await
   (with-writer!
    store
    (^:async fn []
      (let [receipt (-> (await (fs/read-text (outbox-file store delivery-id)))
                        edn/read-one)]
        (when-not (and (= delivery-id (:delivery/id receipt))
                       (= "review-dispatch-intent" (receipt-type receipt)))
          (conflict! "dispatch projection has an invalid immutable identity"
                     {:delivery/id delivery-id}))
        (await (require-ledger-receipt!
                store "dispatches" dispatch-receipt-types receipt
                :dispatch-intent-not-durable)))))))

(defn ^:async dispatch-intent-recorded? [store delivery-id]
  (await (fs/path-exists? (outbox-file store delivery-id))))

(defn ^:async read-completion [store delivery-id]
  (await
   (with-writer!
    store
    (^:async fn []
      (let [receipt (-> (await (fs/read-text
                                (dispatch-file store delivery-id)))
                        edn/read-one)]
        (when-not (and (= delivery-id (:delivery/id receipt))
                       (= "review-command-completed"
                          (receipt-type receipt)))
          (conflict! "completion projection has an invalid immutable identity"
                     {:delivery/id delivery-id}))
        (await (require-ledger-receipt!
                store "dispatches" dispatch-receipt-types
                receipt :completion-not-durable))
        receipt)))))

(defn ^:async completed? [store delivery-id]
  (await
   (with-writer!
    store
    (^:async fn []
      (let [file (dispatch-file store delivery-id)]
        (if-not (await (fs/path-exists? file))
          false
          (let [receipt (-> (await (fs/read-text file)) edn/read-one)]
            (when-not (and (= delivery-id (:delivery/id receipt))
                           (= "review-command-completed"
                              (receipt-type receipt)))
              (conflict!
               "completion projection has an invalid immutable identity"
               {:delivery/id delivery-id}))
            (await (require-ledger-receipt!
                    store "dispatches" dispatch-receipt-types
                    receipt :completion-not-durable))
            true)))))))

(defn ^:async claim-dispatch!
  [store delivery-id dispatch]
  (await
   (with-writer!
    store
    (^:async fn []
      (let [intent {:receipt/type :review-dispatch-intent
                    :receipt/recorded-at (runtime/now-timestamp)
                    :delivery/id delivery-id
                    :dispatch dispatch}
            recorded (await (record-ledger-receipt!
                             store "dispatches" dispatch-receipt-types
                             intent))
            canonical (:receipt recorded)]
        (when-not (and (= delivery-id (:delivery/id canonical))
                       (= "review-dispatch-intent"
                          (receipt-type canonical)))
          (conflict! "dispatch projection has an invalid immutable identity"
                     {:delivery/id delivery-id}))
        (when-not (same-wire-value? (:dispatch canonical) dispatch)
          (conflict! "delivery ID has a different dispatch intent"
                     {:delivery/id delivery-id}))
        (:created? recorded))))))

(defn ^:async read-gate-check [store delivery-id]
  (await
   (with-writer!
    store
    (^:async fn []
      (let [receipt (-> (await (fs/read-text
                                (gate-check-file store delivery-id)))
                        edn/read-one)]
        (when-not (and (= delivery-id (:delivery/id receipt))
                       (= "review-gate-check-prepared"
                          (receipt-type receipt)))
          (conflict! "gate check projection has an invalid immutable identity"
                     {:delivery/id delivery-id}))
        (await (require-ledger-receipt!
                store "dispatches" dispatch-receipt-types receipt
                :gate-check-not-durable))
        receipt)))))

(defn ^:async gate-check-recorded? [store delivery-id]
  (await (fs/path-exists? (gate-check-file store delivery-id))))

(defn ^:async workflow-run-correlation-recorded? [store delivery-id]
  (await (fs/path-exists? (workflow-run-file store delivery-id))))

(defn ^:async record-gate-check!
  "Persist the exact create-or-find Check Run result before a workflow call may
  begin. The projection and ledger receipt are immutable for the delivery ID."
  [store delivery-id gate-check]
  (await
   (with-writer!
    store
    (^:async fn []
      (let [receipt {:receipt/type :review-gate-check-prepared
                     :receipt/recorded-at (runtime/now-timestamp)
                     :delivery/id delivery-id
                     :gate-check gate-check}
            recorded (await (record-ledger-receipt!
                             store "dispatches" dispatch-receipt-types
                             receipt))
            canonical (:receipt recorded)]
        (when-not (and (= delivery-id (:delivery/id canonical))
                       (= "review-gate-check-prepared"
                          (receipt-type canonical)))
          (conflict! "gate check projection has an invalid immutable identity"
                     {:delivery/id delivery-id}))
        (when-not (same-wire-value? (:gate-check canonical) gate-check)
          (conflict! "delivery ID has a different gate check receipt"
                     {:delivery/id delivery-id}))
        canonical)))))

(defn ^:async read-dispatch-call [store delivery-id]
  (await
   (with-writer!
    store
    (^:async fn []
      (let [receipt (-> (await (fs/read-text
                                (dispatch-call-file store delivery-id)))
                        edn/read-one)]
        (when-not (and (= delivery-id (:delivery/id receipt))
                       (= "review-dispatch-call-begun"
                          (receipt-type receipt)))
          (conflict! "dispatch call projection has an invalid immutable identity"
                     {:delivery/id delivery-id}))
        (await (require-ledger-receipt!
                store "dispatches" dispatch-receipt-types receipt
                :dispatch-call-not-durable))
        receipt)))))

(defn ^:async dispatch-call-begun? [store delivery-id]
  (await
   (with-writer!
    store
    (^:async fn []
      ;; A same-process journal-first append is already authoritative even when
      ;; its first projection publication failed. Repair this exact identity
      ;; before reporting the non-idempotent boundary absent.
      (when-let [receipt (get @(:dirty-projections* store)
                              ["review-dispatch-call-begun" delivery-id])]
        (await (publish-tracked-projection! store receipt)))
      (await (fs/path-exists? (dispatch-call-file store delivery-id)))))))

(defn ^:async begin-dispatch-call!
  "Durably mark the last safe replay boundary before invoking GitHub's
  workflow-dispatch endpoint, which offers no idempotency key."
  [store delivery-id dispatch]
  (await
   (with-writer!
    store
    (^:async fn []
      (let [receipt {:receipt/type :review-dispatch-call-begun
                     :receipt/recorded-at (runtime/now-timestamp)
                     :delivery/id delivery-id
                     :dispatch dispatch}
            recorded (await (record-ledger-receipt!
                             store "dispatches" dispatch-receipt-types
                             receipt))
            canonical (:receipt recorded)]
        (when-not (and (= delivery-id (:delivery/id canonical))
                       (= "review-dispatch-call-begun"
                          (receipt-type canonical)))
          (conflict! "dispatch call projection has an invalid immutable identity"
                     {:delivery/id delivery-id}))
        (when-not (same-wire-value? (:dispatch canonical) dispatch)
          (conflict! "delivery ID has a different workflow dispatch call"
                     {:delivery/id delivery-id}))
        (remove-pending-delivery! store delivery-id)
        (:created? recorded))))))

(defn ^:async record-workflow-run-correlation!
  "Bind GitHub's returned workflow run ID to the exact durable dispatch and
  controller gate before the ordinary command completion is published."
  [store delivery-id correlation]
  (await
   (with-writer!
    store
    (^:async fn []
      (let [receipt {:receipt/type :review-workflow-run-correlated
                     :receipt/recorded-at (runtime/now-timestamp)
                     :delivery/id delivery-id
                     :correlation correlation}
            recorded (await (record-ledger-receipt!
                             store "dispatches" dispatch-receipt-types
                             receipt))
            canonical (:receipt recorded)]
        (when-not (and (= delivery-id (:delivery/id canonical))
                       (= "review-workflow-run-correlated"
                          (receipt-type canonical)))
          (conflict! "workflow run projection has an invalid immutable identity"
                     {:delivery/id delivery-id}))
        (when-not (same-wire-value? (:correlation canonical) correlation)
          (conflict! "delivery ID has a different workflow run correlation"
                     {:delivery/id delivery-id}))
        canonical)))))

(defn ^:async read-workflow-run-correlation [store delivery-id]
  (await
   (with-writer!
    store
    (^:async fn []
      (let [receipt (-> (await (fs/read-text
                                (workflow-run-file store delivery-id)))
                        edn/read-one)]
        (when-not (and (= delivery-id (:delivery/id receipt))
                       (= "review-workflow-run-correlated"
                          (receipt-type receipt)))
          (conflict! "workflow run projection has an invalid immutable identity"
                     {:delivery/id delivery-id}))
        (await (require-ledger-receipt!
                store "dispatches" dispatch-receipt-types receipt
                :workflow-run-correlation-not-durable)))))))

(defn ^:async find-workflow-run-correlation
  [store repository-id workflow-run-id run-attempt]
  (await
   (with-writer!
    store
    (^:async fn []
      (let [events (await (projection-events
                           store :workflow-runs
                           "review-workflow-run-correlated"))
            matches (filterv #(and (= repository-id
                                      (get-in % [:correlation :command
                                                 :repository-id]))
                                   (= workflow-run-id
                                      (get-in % [:correlation :workflow-run
                                                 :id]))
                                   (= run-attempt
                                      (get-in % [:correlation
                                                 :expected-run-attempt])))
                             events)]
        (when (< 1 (count matches))
          (conflict! "workflow run ID has multiple durable correlations"
                     {:repository-id repository-id
                      :workflow-run-id workflow-run-id
                      :run-attempt run-attempt}))
        (when-let [receipt (first matches)]
          (await (require-ledger-receipt!
                  store "dispatches" dispatch-receipt-types receipt
                  :workflow-run-correlation-not-durable))))))))

(defn ^:async find-code-review-correlation
  "Return the newest durable code-review run for the exact repository/PR/head.
  The gate workflow receives this run ID rather than trusting a same-name check."
  [store repository repository-id pr-number pr-node-id pr-base-sha pr-head-sha
   pr-merge-sha]
  (await
   (with-writer!
    store
    (^:async fn []
      (let [events (await (projection-events
                           store :workflow-runs
                           "review-workflow-run-correlated"))
            matches
            (->> events
                 (filter
                  (fn [receipt]
                    (let [dispatch (get-in receipt [:correlation :dispatch])]
                      (and (= :code-review
                              (law/command-type (:command/type dispatch)))
                           (= repository (:repository dispatch))
                           (= repository-id
                              (get-in receipt [:correlation :command
                                               :repository-id]))
                           (= (str pr-number)
                              (get-in dispatch [:inputs :pr_number]))
                           (= pr-node-id
                              (get-in receipt [:correlation :command
                                               :pull-request-node-id]))
                           (= pr-head-sha
                              (get-in dispatch [:inputs :pr_head_sha]))
                           (= pr-base-sha
                              (get-in dispatch [:inputs :pr_base_sha]))
                           (= pr-merge-sha
                              (get-in dispatch [:inputs :pr_merge_sha]))))))
                 (sort-by #(get-in % [:correlation :workflow-run :id]) >)
                 vec)]
        (when-let [receipt (first matches)]
          (await (require-ledger-receipt!
                  store "dispatches" dispatch-receipt-types receipt
                  :workflow-run-correlation-not-durable))))))))

(defn ^:async find-latest-code-review-intent
  "Select the latest canonical code-review dispatch intent in ledger append
  order for one exact PR identity/head. A later uncorrelated intent therefore
  blocks lifecycle reconciliation instead of falling back to an older run."
  [store repository repository-id pr-number pr-node-id pr-base-sha pr-head-sha
   pr-merge-sha]
  (await
   (with-writer!
    store
    (^:async fn []
      (let [events (await (read-ledger-events store "dispatches"))
            matches
            (filterv
             (fn [receipt]
               (let [dispatch (:dispatch receipt)]
                 (and (= "review-dispatch-intent" (receipt-type receipt))
                      (= :code-review
                         (law/command-type (:command/type dispatch)))
                      (= repository (:repository dispatch))
                      (= repository-id (:repository-id dispatch))
                      (= (str pr-number)
                         (get-in dispatch [:inputs :pr_number]))
                      (= pr-node-id (:pull-request-node-id dispatch))
                      (= pr-head-sha
                         (get-in dispatch [:inputs :pr_head_sha]))
                      (= pr-base-sha
                         (get-in dispatch [:inputs :pr_base_sha]))
                      (= pr-merge-sha
                         (get-in dispatch [:inputs :pr_merge_sha])))))
             events)]
        (when-let [receipt (last matches)]
          (let [projection
                (-> (await (fs/read-text
                            (outbox-file store (:delivery/id receipt))))
                    edn/read-one)]
            (when-not (same-wire-value? receipt projection)
              (conflict!
               "latest code-review intent disagrees with its projection"
               {:delivery/id (:delivery/id receipt)}))
            (await (require-ledger-receipt!
                    store "dispatches" dispatch-receipt-types receipt
                    :dispatch-intent-not-durable)))))))))

(defn ^:async record-gate-terminal-intent!
  "Persist the desired exact Check Run conclusion before the idempotent PATCH."
  [store delivery-id intent]
  (await
   (with-writer!
    store
    (^:async fn []
      (let [receipt {:receipt/type :review-gate-terminal-intent
                     :receipt/recorded-at (runtime/now-timestamp)
                     :delivery/id delivery-id
                     :intent intent}
            recorded (await (record-ledger-receipt!
                             store "dispatches" dispatch-receipt-types
                             receipt))
            canonical (:receipt recorded)]
        (when-not (and (= delivery-id (:delivery/id canonical))
                       (= "review-gate-terminal-intent"
                          (receipt-type canonical)))
          (conflict! "gate terminal intent has an invalid immutable identity"
                     {:delivery/id delivery-id}))
        (when-not (same-wire-value? (:intent canonical) intent)
          (conflict! "delivery ID has a different gate terminal intent"
                     {:delivery/id delivery-id}))
        canonical)))))

(defn ^:async read-gate-terminal-intent [store delivery-id]
  (await
   (with-writer!
    store
    (^:async fn []
      (let [receipt (-> (await (fs/read-text
                                (gate-terminal-intent-file store delivery-id)))
                        edn/read-one)]
        (when-not (and (= delivery-id (:delivery/id receipt))
                       (= "review-gate-terminal-intent"
                          (receipt-type receipt)))
          (conflict! "gate terminal intent has an invalid immutable identity"
                     {:delivery/id delivery-id}))
        (await (require-ledger-receipt!
                store "dispatches" dispatch-receipt-types receipt
                :gate-terminal-intent-not-durable)))))))

(defn ^:async complete!
  [store delivery-id result]
  (await
   (with-writer!
    store
    (^:async fn []
      (let [receipt {:receipt/type :review-command-completed
                     :receipt/recorded-at (runtime/now-timestamp)
                     :delivery/id delivery-id
                     :result result}
            recorded (await (record-ledger-receipt!
                             store "dispatches" dispatch-receipt-types
                             receipt))
            canonical (:receipt recorded)]
        (when-not (and (= delivery-id (:delivery/id canonical))
                       (= "review-command-completed"
                          (receipt-type canonical)))
          (conflict! "completion projection has an invalid immutable identity"
                     {:delivery/id delivery-id}))
        (when-not (same-wire-value? (:result canonical) result)
          (conflict! "delivery ID has a different terminal result"
                     {:delivery/id delivery-id}))
        (remove-pending-delivery! store delivery-id)
        (:created? recorded))))))

(defn ^:async record-attempt-failure!
  [store delivery-id stage error-code]
  (await
   (with-writer!
    store
    (fn []
      (append-event! store "attempts"
                     {:receipt/type :review-attempt-failed
                      :receipt/recorded-at (runtime/now-timestamp)
                      :delivery/id delivery-id
                      :stage stage
                      :error/code error-code})))))

(defn ^:async pending-delivery-ids
  [store]
  (await
   (with-writer!
    store :deliveries
    (^:async fn []
      ;; Repair only the bounded set of journal-first writes that failed to
      ;; publish their derived projection in this process. Restart recovery
      ;; handles the equivalent crash window from disk.
      (await (repair-dirty-projections! store))
      (let [cache (delivery-cache! store)]
        ;; The ordered map contains only live queued dispositions, so replay
        ;; work scales with pending commands rather than historical receipts.
        (loop [remaining (seq (:pending cache))
               result []]
          (if-let [[_ delivery-id] (first remaining)]
            (let [canonical (get-in (delivery-cache! store)
                                    [:by-id delivery-id])
                  _ (when-not (= :queued (delivery-disposition canonical))
                      (conflict! "pending cache contains a non-queued delivery"
                                 {:delivery/id delivery-id}))
                  _ (await (publish-tracked-projection! store canonical))
                  projection
                  (-> (await (fs/read-text (delivery-file store delivery-id)))
                      edn/read-one)
                  _ (when-not (same-wire-value? canonical projection)
                      (conflict!
                       "delivery projection and cached journal receipt disagree"
                       {:delivery/id delivery-id}))
                  outbox? (await
                           (fs/path-exists? (outbox-file store delivery-id)))
                  dispatch-call-begun?
                  (await (fs/path-exists?
                          (dispatch-call-file store delivery-id)))
                  completed? (await
                              (fs/path-exists?
                               (dispatch-file store delivery-id)))
                  replayable? (and (or (not outbox?)
                                       (not dispatch-call-begun?))
                                   (not completed?))
                  ;; A journal-first dispatch-call marker whose projection was
                  ;; repaired above is no longer safe to execute, but it still
                  ;; needs worker-level fail-closed terminalization. Keep that
                  ;; fact visible until the worker records its completion.
                  recoverable? (and dispatch-call-begun?
                                    (not completed?))
                  pending? (or replayable? recoverable?)]
              (when-not pending?
                (remove-pending-delivery! store delivery-id))
              (recur (next remaining)
                     (cond-> result pending? (conj delivery-id))))
            result)))))))

(defn ^:async uncertain-outbox-ids
  "Return workflow calls begun without terminal completion. A durable intent
  or prepared gate check remains safely replayable until this last boundary."
  [store]
  (await
   (with-writer!
    store
    (^:async fn []
      (let [names (await (fs/entries (get-in store [:paths :dispatch-calls])))
            dispatched (await
                        (read-ledger-index
                         store "dispatches" dispatch-receipt-types))]
        (loop [remaining (seq (keep delivery-id-from-file-name (sort names)))
               uncertain []]
          (if-let [delivery-id (first remaining)]
            (let [call (-> (await (fs/read-text
                                   (dispatch-call-file store delivery-id)))
                           edn/read-one)
                  _ (when-not (and (= delivery-id (:delivery/id call))
                                   (= "review-dispatch-call-begun"
                                      (receipt-type call)))
                      (conflict!
                       "dispatch call projection has an invalid immutable identity"
                       {:delivery/id delivery-id}))
                  canonical (get dispatched (receipt-identity call))
                  _ (when-not canonical
                      (conflict! "dispatch call has no canonical ledger receipt"
                                 {:delivery/id delivery-id}))
                  _ (when-not (same-wire-value? canonical call)
                      (conflict! "dispatch call and ledger receipt disagree"
                                 {:delivery/id delivery-id}))
                  completed? (await
                              (fs/path-exists?
                               (dispatch-file store delivery-id)))]
              (recur (next remaining)
                     (cond-> uncertain (not completed?) (conj delivery-id))))
            uncertain)))))))

(defn ^:async readiness [store]
  (await
   (with-writer!
    store
    (^:async fn []
      (loop [remaining (seq (:paths store))
             partitions {}]
        (if-let [[partition directory] (first remaining)]
          (recur (next remaining)
                 (assoc partitions partition
                        (await (fs/durable-writable? directory))))
          (let [ledgers
                (loop [remaining ["deliveries" "dispatches" "attempts"]
                       result {}]
                  (if-let [ledger (first remaining)]
                    (recur (next remaining)
                           (assoc result (keyword ledger)
                                  (await (fs/durable-appendable?
                                          (ledger-file store ledger)))))
                    result))
                writable (and (await (fs/writable? (:root store)))
                              (every? true? (vals partitions))
                              (every? true? (vals ledgers)))
                delivery-cache-ready? (some? @(:delivery-cache* store))
                projections-clean? (empty? @(:dirty-projections* store))
                ready? (and writable delivery-cache-ready?
                            projections-clean?)]
            {:ready? ready?
             :state {:writable? writable
                     :delivery-cache-ready? delivery-cache-ready?
                     :projections-clean? projections-clean?
                     :partitions partitions
                     :ledgers ledgers}})))))))
