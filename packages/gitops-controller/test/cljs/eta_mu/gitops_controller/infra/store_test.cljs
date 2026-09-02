(ns eta-mu.gitops-controller.infra.store-test
  (:require ["node:fs/promises" :as node-fs]
            [clojure.string :as str]
            [cljs.test :refer [deftest is testing]]
            [eta-mu.gitops-controller.extern.fs :as fs]
            [eta-mu.gitops-controller.infra.store :as store]
            [eta-mu.gitops-controller.shape.edn :as edn]))

(def delivery-id "9eb17352-284c-4b55-879d-0d07f353fdee")
(def payload-sha256 (apply str (repeat 64 "a")))

(def command
  {:delivery-id delivery-id
   :payload/sha256 payload-sha256
   :command-id delivery-id
   :command/type :code-review
   :capability :gitops/review
   :event "pull_request"
   :action "labeled"
   :label "eta-mu:review"
   :installation-id 77
   :repository-id 42
   :repository "open-hax/eta-mu"
   :pull-request-number 321
   :pull-request-node-id "PR_kwDOExample"
   :sender-id 9
   :sender-login "operator"
   :admission {:version 2
               :mode :observe-only
               :policy-revision "observe-policy-v1"
               :command/type :code-review
               :review-label "eta-mu:review"
               :workflow "opencode-code-review.yml"}})

(def ignored-command
  (dissoc command :command-id :command/type :capability :admission))

(defn ^:async block-dispatch-append!
  [append-line! block-once?* started!* release file line expected-position]
  (when (and (str/ends-with? file "dispatches.nd-edn")
             (compare-and-set! block-once?* true false))
    (@started!* nil)
    (await release))
  (await (append-line! file line expected-position)))

(defn ^:async fail-after-readback!
  [append-line! fail-once?* file line expected-position]
  (let [result (await (append-line! file line expected-position))]
    (when (compare-and-set! fail-once?* true false)
      (throw (ex-info "injected post-readback failure"
                      {:error/code :injected-readback-failure})))
    result))

(deftest ^:async immutable-publication-is-complete-and-no-replace
  (let [root (await (fs/temporary-directory!))
        file (fs/join root "immutable.json")
        left (str "{\"side\":\"left\",\"padding\":\""
                  (apply str (repeat 32768 "l")) "\"}")
        right (str "{\"side\":\"right\",\"padding\":\""
                   (apply str (repeat 32768 "r")) "\"}")]
    (try
      (let [results (js->clj
                     (await
                      (js/Promise.all
                       #js [(fs/write-exclusive! file left)
                            (fs/write-exclusive! file right)])))
            published (await (fs/read-text file))
            names (await (fs/entries root))]
        (is (= 1 (count (filter true? results))))
        (is (contains? #{left right} published))
        (is (= ["immutable.json"] names)))
      (finally
        (await (fs/remove-tree! root))))))

(deftest ^:async existence-checks-fail-closed-on-errors-other-than-missing
  (let [root (await (fs/temporary-directory!))
        ordinary-file (fs/join root "not-a-directory")]
    (try
      (await (fs/write-exclusive! ordinary-file "present"))
      (is (true? (await (fs/path-exists? ordinary-file))))
      (is (false? (await (fs/path-exists? (fs/join root "missing")))))
      (let [error (try
                    (await (fs/path-exists?
                            (fs/join ordinary-file "child")))
                    nil
                    (catch :default caught caught))]
        (is (= "ENOTDIR" (.-code error))))
      (finally
        (await (fs/remove-tree! root))))))

(deftest ^:async durable-directory-creation-resyncs-existing-owned-ancestry
  (let [anchor (await (fs/temporary-directory!))
        state-root (fs/join anchor "state")
        ledger-directory (fs/join state-root "ledgers")
        synchronized* (atom [])
        sync! (^:async fn [directory]
                (swap! synchronized* conj directory)
                (await (fs/sync-directory! directory)))]
    (try
      ;; Simulate directories left visible by a process that died before fsync.
      (await (.mkdir node-fs ledger-directory #js {:recursive true}))
      (await (fs/ensure-directory! ledger-directory anchor sync!))
      (is (= [ledger-directory state-root anchor] @synchronized*))
      (finally
        (await (fs/remove-tree! anchor))))))

(deftest ^:async duplicate-deliveries-must-have-identical-payloads
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)]
    (try
      (await (store/initialize! state-store))
      (is (:accepted? (await (store/accept-delivery! state-store command))))
      (is (:duplicate? (await (store/accept-delivery! state-store command))))
      (let [error (try
                    (await (store/accept-delivery!
                            state-store (assoc command :sender-id 10)))
                    nil
                    (catch :default caught caught))]
        (is (= :delivery-payload-mismatch
               (:error/code (ex-data error)))))
      (finally
        (await (fs/remove-tree! root))))))

(deftest ^:async delivery-guid-alone-is-the-immutable-dedupe-key
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        different-hash (apply str (repeat 64 "b"))]
    (try
      (await (store/initialize! state-store))
      (is (:accepted? (await (store/ignore-delivery!
                              state-store ignored-command
                              :unmanaged-label))))
      (let [disposition-error
            (try
              (await (store/accept-delivery! state-store command))
              nil
              (catch :default caught caught))
            payload-error
            (try
              (await (store/ignore-delivery!
                      state-store
                      (assoc ignored-command :payload/sha256 different-hash)
                      :unmanaged-label))
              nil
              (catch :default caught caught))
            lines (str/split-lines
                   (await (fs/read-text
                           (fs/join root "ledgers" "deliveries.nd-edn"))))
            receipt (await (store/read-delivery state-store delivery-id))]
        (is (= :delivery-payload-mismatch
               (:error/code (ex-data disposition-error))))
        (is (= :delivery-payload-mismatch
               (:error/code (ex-data payload-error))))
        (is (= 1 (count lines)))
        (is (= "ignored" (some-> (:disposition receipt) name)))
        (is (empty? (await (store/pending-delivery-ids state-store)))))
      (finally
        (await (fs/remove-tree! root))))))

(deftest ^:async native-edn-types-are-part-of-immutable-evidence
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        projection-file (fs/join root "deliveries" (str delivery-id ".edn"))]
    (try
      (await (store/initialize! state-store))
      (await (store/accept-delivery! state-store command))
      (let [receipt (-> (await (fs/read-text projection-file)) edn/read-one)]
        ;; JSON equivalence would collapse :queued and "queued". Native EDN
        ;; evidence must reject that type substitution during reconciliation.
        (await (.writeFile node-fs projection-file
                           (edn/encode (assoc receipt :disposition "queued"))
                           "utf8")))
      (let [error (try
                    (await (store/reconcile-ledgers! state-store))
                    nil
                    (catch :default caught caught))]
        (is (= :immutable-state-conflict
               (:error/code (ex-data error)))))
      (finally
        (await (fs/remove-tree! root))))))

(deftest ^:async journal-and-projection-cannot-agree-on-a-cross-wired-command
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        other-id "10000000-0000-4000-8000-000000000002"
        projection-file (fs/join root "deliveries" (str delivery-id ".edn"))
        ledger-file (fs/join root "ledgers" "deliveries.nd-edn")]
    (try
      (await (store/initialize! state-store))
      (await (store/accept-delivery! state-store command))
      (let [receipt (-> (await (fs/read-text projection-file)) edn/read-one)
            cross-wired (-> receipt
                            (assoc-in [:command :delivery-id] other-id)
                            (assoc-in [:command :command-id] other-id))
            encoded (edn/encode cross-wired)]
        ;; Even matching journal/projection bytes cannot authorize a command
        ;; whose nested identity differs from its outer delivery GUID.
        (await (.writeFile node-fs ledger-file (str encoded "\n") "utf8"))
        (await (.writeFile node-fs projection-file encoded "utf8")))
      (let [error (try
                    (await (store/initialize! (store/create root)))
                    nil
                    (catch :default caught caught))]
        (is (= :immutable-state-conflict
               (:error/code (ex-data error)))))
      (finally
        (await (fs/remove-tree! root))))))

(deftest ^:async concurrent-admission-has-one-projection-and-one-ledger-record
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)]
    (try
      (await (store/initialize! state-store))
      (let [results (js->clj
                     (await
                      (js/Promise.all
                       #js [(store/accept-delivery! state-store command)
                            (store/accept-delivery! state-store command)])))
            ledger-lines
            (str/split-lines
             (await (fs/read-text
                     (fs/join root "ledgers" "deliveries.nd-edn"))))]
        (is (= 1 (count (filter :accepted? results))))
        (is (= 1 (count (filter :duplicate? results))))
        (is (= 1 (count ledger-lines)))
        (is (= [delivery-id]
               (await (store/pending-delivery-ids state-store)))))
      (finally
        (await (fs/remove-tree! root))))))

(deftest ^:async delivery-admission-does-not-wait-on-the-other-writer
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        dispatch-id "30000000-0000-4000-8000-000000000003"
        admission-id "40000000-0000-4000-8000-000000000004"
        append-line! fs/append-line!
        block-once?* (atom true)
        started!* (atom nil)
        release!* (atom nil)
        started (js/Promise. (fn [resolve _reject]
                               (reset! started!* resolve)))
        release (js/Promise. (fn [resolve _reject]
                               (reset! release!* resolve)))]
    (try
      (await (store/initialize! state-store))
      (with-redefs
        [fs/append-line!
         ;; Preserve the fixed-arity CLJS ABI at the redefined Var boundary;
         ;; the delegated implementation remains a modern async function.
         (fn [file line expected-position]
           (block-dispatch-append!
            append-line! block-once?* started!* release
            file line expected-position))]
        (let [blocked-write (store/claim-dispatch!
                             state-store dispatch-id {:operation :blocked})]
          (try
            (await started)
            (let [admission (store/accept-delivery!
                             state-store
                             (assoc command
                                    :delivery-id admission-id
                                    :command-id admission-id))
                  timeout (js/Promise.
                           (fn [resolve _reject]
                             (js/setTimeout #(resolve :timed-out) 1000)))
                  result (await (js/Promise.race #js [admission timeout]))]
              (is (not= :timed-out result))
              (is (true? (:accepted? result)))
              (is (= [admission-id]
                     (await (store/pending-delivery-ids state-store)))))
            (finally
              (@release!* nil)
              (await blocked-write)))))
      (finally
        (await (fs/remove-tree! root))))))

(deftest ^:async pending-replay-preserves-ledger-arrival-not-guid-order
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        first-id "f0000000-0000-4000-8000-000000000001"
        second-id "10000000-0000-4000-8000-000000000002"
        with-id (fn [id] (assoc command :delivery-id id :command-id id))]
    (try
      (await (store/initialize! state-store))
      (await (store/accept-delivery! state-store (with-id first-id)))
      (await (store/accept-delivery! state-store (with-id second-id)))
      (is (= [first-id second-id]
             (await (store/pending-delivery-ids state-store))))
      (finally
        (await (fs/remove-tree! root))))))

(deftest ^:async ambiguous-append-failure-requires-restart-before-retry
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        ledger-file (fs/join root "ledgers" "deliveries.nd-edn")
        projection-file (fs/join root "deliveries" (str delivery-id ".edn"))
        append-line! fs/append-line!
        fail-once?* (atom true)]
    (try
      (await (store/initialize! state-store))
      (with-redefs
        [fs/append-line!
         ;; Preserve the fixed-arity CLJS ABI at the redefined Var boundary;
         ;; the delegated implementation remains a modern async function.
         (fn [file line expected-position]
           (fail-after-readback!
            append-line! fail-once?* file line expected-position))]
        (is (= :injected-readback-failure
               (:error/code
                (ex-data
                 (try
                   (await (store/accept-delivery! state-store command))
                   nil
                   (catch :default error error)))))))
      (is (= 1 (count (str/split-lines (await (fs/read-text ledger-file))))))
      (is (false? (await (fs/path-exists? projection-file))))
      (is (false? (:ready? (await (store/readiness state-store)))))
      (is (false? (get-in (await (store/readiness state-store))
                          [:state :delivery-cache-ready?])))
      (is (= :delivery-cache-not-ready
             (:error/code
              (ex-data
               (try
                 (await (store/accept-delivery! state-store command))
                 nil
                 (catch :default error error))))))
      (is (= 1 (count (str/split-lines (await (fs/read-text ledger-file))))))
      (let [restarted (store/create root)]
        (await (store/initialize! restarted))
        (is (:ready? (await (store/readiness restarted))))
        (is (:duplicate? (await (store/accept-delivery! restarted command))))
        (is (= [delivery-id]
               (await (store/pending-delivery-ids restarted))))
        (is (= (await (store/read-delivery restarted delivery-id))
               (edn/read-one
                (first (str/split-lines
                        (await (fs/read-text ledger-file))))))))
      (finally
        (await (fs/remove-tree! root))))))

(deftest ^:async periodic-replay-restores-a-journal-first-projection-gap
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        projection-file (fs/join root "deliveries" (str delivery-id ".edn"))]
    (try
      (await (store/initialize! state-store))
      (await (fs/ensure-directory! projection-file))
      (is (some? (try
                   (await (store/accept-delivery! state-store command))
                   nil
                   (catch :default error error))))
      (is (= 1 (count (str/split-lines
                       (await (fs/read-text
                               (fs/join root "ledgers"
                                        "deliveries.nd-edn")))))))
      (let [readiness (await (store/readiness state-store))]
        (is (false? (:ready? readiness)))
        (is (false? (get-in readiness [:state :projections-clean?]))))
      (await (fs/remove-tree! projection-file))
      (is (= [delivery-id]
             (await (store/pending-delivery-ids state-store))))
      (is (true? (await (fs/path-exists? projection-file))))
      (let [readiness (await (store/readiness state-store))]
        (is (true? (:ready? readiness)))
        (is (true? (get-in readiness [:state :projections-clean?]))))
      (let [restarted (store/create root)]
        (await (store/initialize! restarted))
        (is (= {:ledger-appends 0 :projection-restores 0}
               (await (store/reconcile-ledgers! restarted))))
        (is (= [delivery-id]
               (await (store/pending-delivery-ids restarted))))
        (is (:duplicate? (await (store/accept-delivery! restarted command)))))
      (finally
        (await (fs/remove-tree! root))))))

(deftest ^:async admission-and-replay-do-not-rescan-historical-deliveries
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        second-id "10000000-0000-4000-8000-000000000002"
        ignored-id "20000000-0000-4000-8000-000000000003"
        with-id (fn [id] (assoc command :delivery-id id :command-id id))]
    (try
      (await (store/initialize! state-store))
      (await (store/accept-delivery! state-store command))
      (with-redefs
        [fs/read-complete-text!
         (fn [_file _repair-unterminated-tail?]
           (throw (ex-info "historical journal rescan"
                           {:error/code :historical-journal-rescan})))]
        (is (:accepted? (await (store/accept-delivery!
                               state-store (with-id second-id)))))
        (is (:accepted? (await (store/ignore-delivery!
                               state-store
                               (assoc ignored-command :delivery-id ignored-id)
                               :unmanaged-event))))
        (is (:duplicate? (await (store/accept-delivery!
                                state-store command))))
        (is (= delivery-id
               (:delivery/id (await (store/read-delivery
                                     state-store delivery-id)))))
        (is (= [delivery-id second-id]
               (await (store/pending-delivery-ids state-store)))))
      (finally
        (await (fs/remove-tree! root))))))

(deftest ^:async startup-quarantines-only-an-unterminated-final-ledger-tail
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        ledger-file (fs/join root "ledgers" "deliveries.nd-edn")
        torn-tail "{:receipt/type :webhook-received"
        original* (atom nil)]
    (try
      (await (store/initialize! state-store))
      (await (store/accept-delivery! state-store command))
      (reset! original* (await (fs/read-text ledger-file)))
      (await (.appendFile node-fs ledger-file torn-tail "utf8"))
      (is (= {:ledger-appends 0 :projection-restores 0}
             (await (store/reconcile-ledgers! state-store))))
      (is (= @original* (await (fs/read-text ledger-file))))
      (let [quarantine-files
            (filter #(str/includes? % ".unterminated-tail.")
                    (await (fs/entries (fs/join root "ledgers"))))]
        (is (= 1 (count quarantine-files)))
        (is (= torn-tail
               (await (fs/read-text
                       (fs/join root "ledgers"
                                (first quarantine-files)))))))
      (is (= delivery-id
             (get-in (await (store/read-delivery state-store delivery-id))
                     [:command :delivery-id])))
      (finally
        (await (fs/remove-tree! root))))))

(deftest ^:async complete-or-middle-ledger-corruption-is-fatal
  (doseq [suffix ["{\n"
                  (str "{\n" (edn/encode {:receipt/type :unexpected
                                          :delivery/id delivery-id}) "\n")]]
    (let [root (await (fs/temporary-directory!))
          state-store (store/create root)
          ledger-file (fs/join root "ledgers" "deliveries.nd-edn")]
      (try
        (await (store/initialize! state-store))
        (await (store/accept-delivery! state-store command))
        (await (.appendFile node-fs ledger-file suffix "utf8"))
        (let [error (try
                      (await (store/reconcile-ledgers! state-store))
                      nil
                      (catch :default caught caught))]
          (is (= :immutable-state-conflict
                 (:error/code (ex-data error))))
          (is (= suffix
                 (subs (await (fs/read-text ledger-file))
                       (- (count (await (fs/read-text ledger-file)))
                          (count suffix))))))
        (finally
          (await (fs/remove-tree! root)))))))

(deftest ^:async startup-reconciliation-trusts-only-the-journal
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        delivery-file (fs/join root "deliveries" (str delivery-id ".edn"))
        ledger-file (fs/join root "ledgers" "deliveries.nd-edn")]
    (try
      (await (store/initialize! state-store))
      (await (store/accept-delivery! state-store command))
      (testing "an orphan projection cannot manufacture receipt authority"
        (let [journal (await (fs/read-text ledger-file))]
          (await (fs/remove-file-if-present! ledger-file))
          (let [error (try
                        (await (store/reconcile-ledgers! state-store))
                        nil
                        (catch :default caught caught))]
            (is (= :immutable-state-conflict
                   (:error/code (ex-data error)))))
          (is (await (fs/write-exclusive! ledger-file journal)))))
      (testing "a ledger receipt missing its derived projection is restored"
        (await (fs/remove-file-if-present! delivery-file))
        (is (= {:ledger-appends 0 :projection-restores 1}
               (await (store/reconcile-ledgers! state-store))))
        (is (= delivery-id
               (get-in (await (store/read-delivery state-store delivery-id))
                       [:command :delivery-id]))))
      (testing "orphan publication temp files never become queue entries"
        (await
         (fs/write-exclusive!
          (fs/join root "deliveries"
                   (str "." delivery-id ".orphan.tmp"))
          "partial"))
        (is (= [delivery-id]
               (await (store/pending-delivery-ids state-store)))))
      (finally
        (await (fs/remove-tree! root))))))

(deftest ^:async legacy-json-state-is-rejected-before-native-journal-creation
  (let [root (await (fs/temporary-directory!))
        legacy-ledger (fs/join root "ledgers" "deliveries.ndjson")
        legacy-projection (fs/join root "deliveries"
                                   (str delivery-id ".json"))
        native-ledger (fs/join root "ledgers" "deliveries.nd-edn")]
    (try
      (await (fs/ensure-directory! (fs/join root "ledgers")))
      (await (fs/ensure-directory! (fs/join root "deliveries")))
      (is (await (fs/write-exclusive! legacy-ledger "{}\n")))
      (is (await (fs/write-exclusive! legacy-projection "{}")))
      (let [error (try
                    (await (store/initialize! (store/create root)))
                    nil
                    (catch :default caught caught))]
        (is (= :legacy-state-unsupported
               (:error/code (ex-data error))))
        (is (= #{legacy-ledger legacy-projection}
               (set (:legacy/paths (ex-data error))))))
      (is (= "{}\n" (await (fs/read-text legacy-ledger))))
      (is (= "{}" (await (fs/read-text legacy-projection))))
      (is (false? (await (fs/path-exists? native-ledger))))
      (finally
        (await (fs/remove-tree! root))))))

(deftest ^:async clean-state-initializes-the-native-nd-edn-journal
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)]
    (try
      (await (store/initialize! state-store))
      (is (true? (await (fs/path-exists?
                         (fs/join root "ledgers" "deliveries.nd-edn")))))
      (is (empty? (await (store/pending-delivery-ids state-store))))
      (is (:ready? (await (store/readiness state-store))))
      (finally
        (await (fs/remove-tree! root))))))

(deftest ^:async readiness-probes-every-required-state-partition
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)]
    (try
      (await (store/initialize! state-store))
      (let [result (await (store/readiness state-store))]
        (is (:ready? result))
        (is (= {:deliveries true :dispatches true :attempts true}
               (get-in result [:state :ledgers]))))
      (let [attempts-ledger (fs/join root "ledgers" "attempts.nd-edn")]
        (await (fs/remove-file-if-present! attempts-ledger))
        (await (fs/ensure-directory! attempts-ledger))
        (let [result (await (store/readiness state-store))]
          (is (false? (:ready? result)))
          (is (false? (get-in result [:state :ledgers :attempts]))))
        (await (fs/remove-tree! attempts-ledger))
        (is (:ready? (await (store/readiness state-store)))))
      (await (fs/remove-tree! (fs/join root "outbox")))
      (let [result (await (store/readiness state-store))]
        (is (false? (:ready? result)))
        (is (false? (get-in result [:state :partitions :outbox]))))
      (finally
        (await (fs/remove-tree! root))))))
