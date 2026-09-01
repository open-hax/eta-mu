(ns eta-mu.gitops-controller.infra.store-test
  (:require ["node:fs/promises" :as node-fs]
            [clojure.string :as str]
            [cljs.test :refer [deftest is testing]]
            [eta-mu.gitops-controller.extern.fs :as fs]
            [eta-mu.gitops-controller.extern.json :as json]
            [eta-mu.gitops-controller.infra.store :as store]))

(def delivery-id "9eb17352-284c-4b55-879d-0d07f353fdee")

(def command
  {:delivery-id delivery-id
   :command-id delivery-id
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
   :admission {:version 1
               :mode :observe-only
               :policy-revision "observe-policy-v1"
               :review-label "eta-mu:review"
               :workflow "opencode-code-review.yml"}})

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
                     (fs/join root "ledgers" "deliveries.ndjson"))))]
        (is (= 1 (count (filter :accepted? results))))
        (is (= 1 (count (filter :duplicate? results))))
        (is (= 1 (count ledger-lines)))
        (is (= [delivery-id]
               (await (store/pending-delivery-ids state-store)))))
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

(deftest ^:async admission-is-invisible-until-projection-and-ledger-agree
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        ledger-file (fs/join root "ledgers" "deliveries.ndjson")]
    (try
      (await (store/initialize! state-store))
      (testing "an append failure leaves evidence but cannot expose queue work"
        ;; A directory at the ledger path deterministically injects an append
        ;; failure without weakening the filesystem boundary for production.
        (await (fs/ensure-directory! ledger-file))
        (is (some? (try
                     (await (store/accept-delivery! state-store command))
                     nil
                     (catch :default error error))))
        (is (true? (await (fs/path-exists?
                           (fs/join root "deliveries"
                                    (str delivery-id ".json"))))))
        (await (fs/remove-tree! ledger-file))
        (is (empty? (await (store/pending-delivery-ids state-store))))
        (is (= :admission-not-durable
               (:error/code
                (ex-data
                 (try
                   (await (store/read-delivery state-store delivery-id))
                   nil
                   (catch :default error error)))))))
      (testing "a retry repairs and proves the exact receipt before duplicate"
        (let [result (await (store/accept-delivery! state-store command))
              receipt (await (store/read-delivery state-store delivery-id))
              lines (remove str/blank?
                            (str/split-lines (await (fs/read-text ledger-file))))]
          (is (false? (:accepted? result)))
          (is (true? (:duplicate? result)))
          (is (= [delivery-id]
                 (await (store/pending-delivery-ids state-store))))
          (is (= 1 (count lines)))
          (is (= receipt (json/decode (first lines))))))
      (finally
        (await (fs/remove-tree! root))))))

(deftest ^:async startup-quarantines-only-an-unterminated-final-ledger-tail
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        ledger-file (fs/join root "ledgers" "deliveries.ndjson")
        torn-tail "{\"receipt/type\":\"webhook-admitted\""
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
                  (str "{\n" (json/encode {:receipt/type "unexpected"
                                           :delivery/id delivery-id}) "\n")]]
    (let [root (await (fs/temporary-directory!))
          state-store (store/create root)
          ledger-file (fs/join root "ledgers" "deliveries.ndjson")]
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

(deftest ^:async startup-reconciliation-repairs-either-crash-gap
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        delivery-file (fs/join root "deliveries" (str delivery-id ".json"))
        ledger-file (fs/join root "ledgers" "deliveries.ndjson")]
    (try
      (await (store/initialize! state-store))
      (await (store/accept-delivery! state-store command))
      (testing "a durable projection missing its append is restored to the ledger"
        (await (fs/remove-file-if-present! ledger-file))
        (is (= {:ledger-appends 1 :projection-restores 0}
               (await (store/reconcile-ledgers! state-store))))
        (is (= 1 (count (remove str/blank?
                                (str/split-lines
                                 (await (fs/read-text ledger-file))))))))
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

(deftest ^:async readiness-probes-every-required-state-partition
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)]
    (try
      (await (store/initialize! state-store))
      (let [result (await (store/readiness state-store))]
        (is (:ready? result))
        (is (= {:deliveries true :dispatches true :attempts true}
               (get-in result [:state :ledgers]))))
      (let [attempts-ledger (fs/join root "ledgers" "attempts.ndjson")]
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
