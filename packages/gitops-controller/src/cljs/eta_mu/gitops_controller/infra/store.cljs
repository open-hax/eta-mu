(ns eta-mu.gitops-controller.infra.store
  "Append-only delivery and dispatch evidence with immutable ID projections."
  (:require [clojure.string :as str]
            [eta-mu.gitops-controller.extern.fs :as fs]
            [eta-mu.gitops-controller.extern.json :as json]
            [eta-mu.gitops-controller.extern.runtime :as runtime]
            [eta-mu.gitops-controller.law.webhook :as law]))

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

(defn create [root]
  {:root root
   :paths (paths root)
   ;; All ledger/projection mutations in one controller process are serialized.
   ;; Production still runs one controller replica per state root; this queue is
   ;; the same-process half of that single-writer contract.
   :writer-tail* (atom (js/Promise.resolve nil))})

(defn ^:async initialize! [{:keys [paths] :as store}]
  (doseq [directory (vals paths)]
    (await (fs/ensure-directory! directory)))
  store)

(defn- delivery-file [{:keys [paths]} delivery-id]
  (fs/join (:deliveries paths) (str delivery-id ".json")))

(defn- outbox-file [{:keys [paths]} delivery-id]
  (fs/join (:outbox paths) (str delivery-id ".json")))

(defn- dispatch-file [{:keys [paths]} delivery-id]
  (fs/join (:dispatches paths) (str delivery-id ".json")))

(defn- gate-check-file [{:keys [paths]} delivery-id]
  (fs/join (:gate-checks paths) (str delivery-id ".json")))

(defn- dispatch-call-file [{:keys [paths]} delivery-id]
  (fs/join (:dispatch-calls paths) (str delivery-id ".json")))

(defn- workflow-run-file [{:keys [paths]} delivery-id]
  (fs/join (:workflow-runs paths) (str delivery-id ".json")))

(defn- gate-terminal-intent-file [{:keys [paths]} delivery-id]
  (fs/join (:gate-terminal-intents paths) (str delivery-id ".json")))

(defn- ledger-file [{:keys [paths]} name]
  (fs/join (:ledgers paths) (str name ".ndjson")))

(defn- wire-value [value]
  (-> value json/encode json/decode))

(defn- receipt-type [receipt]
  (let [value (:receipt/type receipt)]
    (if (keyword? value) (name value) value)))

(defn- receipt-identity [receipt]
  [(receipt-type receipt) (:delivery/id receipt)])

(defn- same-wire-value? [left right]
  (= (wire-value left) (wire-value right)))

(defn- conflict!
  [message data]
  (throw (ex-info message (merge {:error/code :immutable-state-conflict}
                                 data))))

(defn- ^:async with-writer! [store operation]
  (let [release* (atom nil)
        gate (js/Promise. (fn [resolve _reject]
                            (reset! release* resolve)))
        predecessor @(:writer-tail* store)]
    ;; JavaScript cannot yield between this read and reset, so each caller gets
    ;; the previous gate and publishes its own before any asynchronous work.
    (reset! (:writer-tail* store) gate)
    (await predecessor)
    (try
      (await (operation))
      (finally
        (@release* nil)))))

(defn- delivery-id-from-file-name [name]
  (when (str/ends-with? name ".json")
    (let [delivery-id (subs name 0 (- (count name) 5))]
      (when (law/delivery-id? delivery-id) delivery-id))))

(defn- decode-ledger-line [ledger line-number line]
  (when (str/blank? line)
    (conflict! "ledger contains a blank complete record"
               {:ledger ledger :line line-number}))
  (try
    (json/decode line)
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
    (when-not (contains? allowed-types (receipt-type event))
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
                                (fs/join directory (str delivery-id ".json"))))
                        json/decode)]
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
    "webhook-admitted" (delivery-file store (:delivery/id receipt))
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
    (when-not (await (fs/write-exclusive! file (json/encode receipt)))
      (let [existing (-> (await (fs/read-text file)) json/decode)]
        (when-not (same-wire-value? existing receipt)
          (conflict! "projection conflicts with append-only ledger receipt"
                     {:receipt/identity (receipt-identity receipt)}))))))

(defn ^:async append-event! [store ledger event]
  (await (fs/append-line! (ledger-file store ledger) (json/encode event))))

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

(defn- ^:async ensure-ledger-receipt!
  [store ledger allowed-types receipt]
  (let [identity (receipt-identity receipt)
        indexed (await (read-ledger-index store ledger allowed-types))]
    (if-let [existing (get indexed identity)]
      (when-not (same-wire-value? existing receipt)
        (conflict! "ledger receipt conflicts with its immutable projection"
                   {:ledger ledger :receipt/identity identity}))
      (await (append-event! store ledger receipt)))
    ;; An admission/effect caller receives success only after reading back the
    ;; exact canonical bytes from the durable ledger.
    (await (require-ledger-receipt! store ledger allowed-types receipt
                                    :ledger-receipt-not-durable))))

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

(defn- ^:async reconcile-ledger!
  [store {:keys [ledger projections types]}]
  (let [ledger-index (await (read-ledger-index store ledger types true))
        projection-index (await (read-projection-index
                                 store ledger projections))]
    (doseq [[identity projection] projection-index]
      (when-let [ledger-event (get ledger-index identity)]
        (when-not (same-wire-value? projection ledger-event)
          (conflict! "projection and ledger receipts disagree"
                     {:ledger ledger :receipt/identity identity}))))
    (let [missing-ledger (remove #(contains? ledger-index (key %))
                                 projection-index)
          missing-projections (remove #(contains? projection-index (key %))
                                      ledger-index)]
      (doseq [[_ projection] (sort-by (comp pr-str key) missing-ledger)]
        (await (append-event! store ledger projection)))
      (doseq [[_ ledger-event]
              (sort-by (comp pr-str key) missing-projections)]
        (await (publish-projection! store ledger-event)))
      ;; Startup does not advance to replay on assumed writes: it reopens both
      ;; sides and proves the repaired state exactly.
      (assert-indexes-equal!
       ledger
       (await (read-ledger-index store ledger types))
       (await (read-projection-index store ledger projections)))
      {:ledger-appends (count missing-ledger)
       :projection-restores (count missing-projections)})))

(defn ^:async reconcile-ledgers!
  "Repair crash gaps before replay under the controller's exclusive startup
  phase. Only an unterminated final NDJSON tail is quarantined; any complete
  corrupt record or conflicting immutable evidence fails startup."
  [store]
  (await
   (with-writer!
    store
    (^:async fn []
      ;; Attempts have no projection, but their full records must still parse.
      (let [attempts (await (read-ledger-events store "attempts" true))]
        (doseq [[index event] (map-indexed vector attempts)]
          (when-not (and (= "review-attempt-failed" (receipt-type event))
                         (law/delivery-id? (:delivery/id event)))
            (conflict! "attempts ledger contains an invalid complete receipt"
                       {:ledger "attempts" :line (inc index)}))))
      (loop [remaining [{:ledger "deliveries"
                         :projections [[:deliveries "webhook-admitted"]]
                         :types #{"webhook-admitted"}}
                        {:ledger "dispatches"
                         :projections
                         [[:outbox "review-dispatch-intent"]
                          [:gate-checks "review-gate-check-prepared"]
                          [:dispatch-calls "review-dispatch-call-begun"]
                          [:workflow-runs "review-workflow-run-correlated"]
                          [:gate-terminal-intents
                           "review-gate-terminal-intent"]
                          [:dispatches "review-command-completed"]]
                         :types dispatch-receipt-types}]
             totals {:ledger-appends 0 :projection-restores 0}]
        (if-let [specification (first remaining)]
          (let [result (await (reconcile-ledger! store specification))]
            (recur (next remaining)
                   (merge-with + totals result)))
          totals))))))

(defn ^:async accept-delivery!
  [store command]
  (await
   (with-writer!
    store
    (^:async fn []
      (let [receipt {:receipt/type :webhook-admitted
                     :receipt/recorded-at (runtime/now-timestamp)
                     :delivery/id (:delivery-id command)
                     :command command}
            file (delivery-file store (:delivery-id command))
            created? (await (fs/write-exclusive! file (json/encode receipt)))
            canonical (if created?
                        receipt
                        (-> (await (fs/read-text file)) json/decode))]
        (when-not (and (= (:delivery-id command) (:delivery/id canonical))
                       (= "webhook-admitted" (receipt-type canonical)))
          (conflict! "delivery projection has an invalid immutable identity"
                     {:delivery/id (:delivery-id command)}))
        (when-not (same-wire-value? (:command canonical) command)
          (conflict! "delivery ID was replayed with a different command"
                     {:delivery/id (:delivery-id command)
                      :error/code :delivery-payload-mismatch}))
        (await (ensure-ledger-receipt!
                store "deliveries" #{"webhook-admitted"} canonical))
        {:accepted? created?
         :duplicate? (not created?)
         :receipt canonical})))))

(defn ^:async read-delivery [store delivery-id]
  (await
   (with-writer!
    store
    (^:async fn []
      (let [receipt (-> (await (fs/read-text
                                (delivery-file store delivery-id)))
                        json/decode)]
        (when-not (and (= delivery-id (:delivery/id receipt))
                       (= "webhook-admitted" (receipt-type receipt)))
          (conflict! "delivery projection has an invalid immutable identity"
                     {:delivery/id delivery-id}))
        (await (require-ledger-receipt!
                store "deliveries" #{"webhook-admitted"} receipt
                :admission-not-durable))
        receipt)))))

(defn ^:async read-dispatch-intent [store delivery-id]
  (await
   (with-writer!
    store
    (^:async fn []
      (let [receipt (-> (await (fs/read-text (outbox-file store delivery-id)))
                        json/decode)]
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
                        json/decode)]
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
          (let [receipt (-> (await (fs/read-text file)) json/decode)]
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
            file (outbox-file store delivery-id)
            created? (await (fs/write-exclusive! file (json/encode intent)))
            canonical (if created?
                        intent
                        (-> (await (fs/read-text file)) json/decode))]
        (when-not (and (= delivery-id (:delivery/id canonical))
                       (= "review-dispatch-intent"
                          (receipt-type canonical)))
          (conflict! "dispatch projection has an invalid immutable identity"
                     {:delivery/id delivery-id}))
        (when-not (same-wire-value? (:dispatch canonical) dispatch)
          (conflict! "delivery ID has a different dispatch intent"
                     {:delivery/id delivery-id}))
        (await (ensure-ledger-receipt!
                store "dispatches" dispatch-receipt-types
                canonical))
        created?)))))

(defn ^:async read-gate-check [store delivery-id]
  (await
   (with-writer!
    store
    (^:async fn []
      (let [receipt (-> (await (fs/read-text
                                (gate-check-file store delivery-id)))
                        json/decode)]
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
            file (gate-check-file store delivery-id)
            created? (await (fs/write-exclusive! file (json/encode receipt)))
            canonical (if created?
                        receipt
                        (-> (await (fs/read-text file)) json/decode))]
        (when-not (and (= delivery-id (:delivery/id canonical))
                       (= "review-gate-check-prepared"
                          (receipt-type canonical)))
          (conflict! "gate check projection has an invalid immutable identity"
                     {:delivery/id delivery-id}))
        (when-not (same-wire-value? (:gate-check canonical) gate-check)
          (conflict! "delivery ID has a different gate check receipt"
                     {:delivery/id delivery-id}))
        (await (ensure-ledger-receipt!
                store "dispatches" dispatch-receipt-types canonical))
        canonical)))))

(defn ^:async read-dispatch-call [store delivery-id]
  (await
   (with-writer!
    store
    (^:async fn []
      (let [receipt (-> (await (fs/read-text
                                (dispatch-call-file store delivery-id)))
                        json/decode)]
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
  (await (fs/path-exists? (dispatch-call-file store delivery-id))))

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
            file (dispatch-call-file store delivery-id)
            created? (await (fs/write-exclusive! file (json/encode receipt)))
            canonical (if created?
                        receipt
                        (-> (await (fs/read-text file)) json/decode))]
        (when-not (and (= delivery-id (:delivery/id canonical))
                       (= "review-dispatch-call-begun"
                          (receipt-type canonical)))
          (conflict! "dispatch call projection has an invalid immutable identity"
                     {:delivery/id delivery-id}))
        (when-not (same-wire-value? (:dispatch canonical) dispatch)
          (conflict! "delivery ID has a different workflow dispatch call"
                     {:delivery/id delivery-id}))
        (await (ensure-ledger-receipt!
                store "dispatches" dispatch-receipt-types canonical))
        created?)))))

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
            file (workflow-run-file store delivery-id)
            created? (await (fs/write-exclusive! file (json/encode receipt)))
            canonical (if created?
                        receipt
                        (-> (await (fs/read-text file)) json/decode))]
        (when-not (and (= delivery-id (:delivery/id canonical))
                       (= "review-workflow-run-correlated"
                          (receipt-type canonical)))
          (conflict! "workflow run projection has an invalid immutable identity"
                     {:delivery/id delivery-id}))
        (when-not (same-wire-value? (:correlation canonical) correlation)
          (conflict! "delivery ID has a different workflow run correlation"
                     {:delivery/id delivery-id}))
        (await (ensure-ledger-receipt!
                store "dispatches" dispatch-receipt-types canonical))
        canonical)))))

(defn ^:async read-workflow-run-correlation [store delivery-id]
  (await
   (with-writer!
    store
    (^:async fn []
      (let [receipt (-> (await (fs/read-text
                                (workflow-run-file store delivery-id)))
                        json/decode)]
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
                    json/decode)]
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
            file (gate-terminal-intent-file store delivery-id)
            created? (await (fs/write-exclusive! file (json/encode receipt)))
            canonical (if created?
                        receipt
                        (-> (await (fs/read-text file)) json/decode))]
        (when-not (and (= delivery-id (:delivery/id canonical))
                       (= "review-gate-terminal-intent"
                          (receipt-type canonical)))
          (conflict! "gate terminal intent has an invalid immutable identity"
                     {:delivery/id delivery-id}))
        (when-not (same-wire-value? (:intent canonical) intent)
          (conflict! "delivery ID has a different gate terminal intent"
                     {:delivery/id delivery-id}))
        (await (ensure-ledger-receipt!
                store "dispatches" dispatch-receipt-types canonical))
        canonical)))))

(defn ^:async read-gate-terminal-intent [store delivery-id]
  (await
   (with-writer!
    store
    (^:async fn []
      (let [receipt (-> (await (fs/read-text
                                (gate-terminal-intent-file store delivery-id)))
                        json/decode)]
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
            file (dispatch-file store delivery-id)
            created? (await (fs/write-exclusive! file (json/encode receipt)))
            canonical (if created?
                        receipt
                        (-> (await (fs/read-text file)) json/decode))]
        (when-not (and (= delivery-id (:delivery/id canonical))
                       (= "review-command-completed"
                          (receipt-type canonical)))
          (conflict! "completion projection has an invalid immutable identity"
                     {:delivery/id delivery-id}))
        (when-not (same-wire-value? (:result canonical) result)
          (conflict! "delivery ID has a different terminal result"
                     {:delivery/id delivery-id}))
        (await (ensure-ledger-receipt!
                store "dispatches" dispatch-receipt-types
                canonical))
        created?)))))

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
    store
    (^:async fn []
      (let [names (await (fs/entries (get-in store [:paths :deliveries])))
            projection-ids (set (keep delivery-id-from-file-name names))
            admitted (->> (await (read-ledger-events store "deliveries"))
                          (filterv #(= "webhook-admitted"
                                       (receipt-type %))))
            admitted-ids (mapv :delivery/id admitted)]
        (when-not (= (count admitted-ids) (count (set admitted-ids)))
          (conflict! "deliveries ledger repeats an admitted delivery identity"
                     {}))
        ;; Projection-first admission can leave an unledgered file after an
        ;; append failure. It remains invisible until startup reconciliation;
        ;; a canonical ledger receipt without its projection is structural.
        (when-not (every? projection-ids admitted-ids)
          (conflict! "deliveries ledger has no matching projection"
                     {:projection-count (count projection-ids)
                      :ledger-count (count admitted-ids)}))
        ;; Ledger append order is the canonical operator-intent order. Random
        ;; delivery GUID filename order must never reorder review commands after
        ;; restart.
        (loop [remaining (seq admitted)
               pending []]
          (if-let [canonical (first remaining)]
            (let [delivery-id (:delivery/id canonical)
                  projection
                  (-> (await (fs/read-text (delivery-file store delivery-id)))
                      json/decode)
                  _ (when-not (and (= delivery-id (:delivery/id projection))
                                   (= "webhook-admitted"
                                      (receipt-type projection)))
                      (conflict!
                       "delivery projection has an invalid immutable identity"
                       {:delivery/id delivery-id}))
                  _ (when-not (same-wire-value? canonical projection)
                      (conflict!
                       "delivery projection and ledger receipt disagree"
                       {:delivery/id delivery-id}))
                  outbox? (await
                           (fs/path-exists? (outbox-file store delivery-id)))
                  dispatch-call-begun?
                  (await (fs/path-exists?
                          (dispatch-call-file store delivery-id)))
                  completed? (await
                              (fs/path-exists?
                               (dispatch-file store delivery-id)))]
              (recur (next remaining)
                     (cond-> pending (and (or (not outbox?)
                                              (not dispatch-call-begun?))
                                          (not completed?))
                       (conj delivery-id))))
            pending)))))))

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
                           json/decode)
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
                              (every? true? (vals ledgers)))]
            {:ready? writable
             :state {:writable? writable
                     :partitions partitions
                     :ledgers ledgers}})))))))
