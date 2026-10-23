;; SPDX-License-Identifier: GPL-3.0-or-later
(ns opencode-review-intent-test
  "Causal contract for the Clio-backed publication-intent adapter.
  Fixtures in this suite are inert and never establish source custody."
  (:require [cljs.test :as test :refer [deftest is testing]]
            [cljs.reader :as reader]
            [clio.infra.runtime :as clio-runtime]
            [clio.law.schema :as clio-schema-law]
            [nbb.core :as nbb]
            [clojure.string :as str]
            ["node:fs" :as fs]
            ["node:path" :as path]))

(def test-root (.resolve path (.dirname path (.resolve path nbb/*file*)) "../.."))

(defn- resolve-api [namespace symbol-name]
  (resolve (symbol namespace symbol-name)))

(defn- call-api [namespace symbol-name & args]
  (when-let [f (resolve-api namespace symbol-name)]
    (apply f args)))

(defn- load-source-if-present [relative-path]
  (let [source (.resolve path test-root relative-path)]
    (when (.existsSync fs source)
      (nbb/await (nbb/load-file source)))))

(deftest portable-intent-api-is-present
  (doseq [[namespace symbol-name]
          [["eta-mu.law.review-intent" "intent-event?"]
           ["eta-mu.shape.review-intent" "lock-stream"]
           ["eta-mu.domain.review-intent" "replay"]
           ["eta-mu.domain.review-intent" "transition"]
           ["eta-mu.infra.review-intent" "transition!"]]]
    (testing (str namespace "/" symbol-name)
      (is (some? (resolve-api namespace symbol-name))
          "The publisher intent component is currently missing."))))

(load-source-if-present ".github/scripts/opencode_review_publish_test.cljs")
(load-source-if-present "packages/eta-mu/src/cljs/eta_mu/law/review_intent.cljc")
(load-source-if-present "packages/eta-mu/src/cljs/eta_mu/shape/review_intent.cljc")
(load-source-if-present "packages/eta-mu/src/cljs/eta_mu/domain/review_intent.cljc")
(load-source-if-present "packages/eta-mu/src/cljs/eta_mu/extern/review_intent.cljs")
(load-source-if-present "packages/eta-mu/src/cljs/eta_mu/infra/review_intent.cljs")
(load-source-if-present "packages/eta-mu/src/cljs/eta_mu/infra/review_intent_worker.cljs")

(def reservation-id "00000000-0000-4000-8000-000000000001")
(def started-id "00000000-0000-4000-8000-000000000002")
(def observed-id "00000000-0000-4000-8000-000000000003")
(defn- event [event-id event-seq causes intent-key binding state intent-version stream-key]
  {:event/id event-id
   :event/type :eta-mu.review-intent/transition
   :event/stream (call-api "eta-mu.shape.review-intent" "lock-stream" stream-key)
   :event/seq event-seq
   :event/causes causes
   :event/actor "inert-publisher"
   :event/subject "review-publication-lock/fixture"
   :event/at "2026-10-22T00:00:00.000Z"
   :event/data {:lock-key stream-key :intent-key intent-key :binding binding
                :state state :intent-version intent-version
                :owner (when (= state :post-started) "inert-worker")
                :claim-id (when (= state :post-started) "inert-claim")}})

(defn- publisher-context [target-pr]
  (let [fixture (resolve 'opencode-review-publish-test/fixture)
        context (fixture)
        now (.now js/Date)
        refresh (fn refresh [value]
                  (cond
                    (map? value)
                    (reduce-kv (fn [result key item]
                                 (assoc result key
                                        (cond
                                          (contains? #{:now-ms :observed-at-ms :completed-at-ms} key) (- now 1000)
                                          (= :expires-at-ms key) (+ now 60000)
                                          :else (refresh item)))) {} value)
                    (vector? value) (mapv refresh value)
                    :else value))
        context (refresh context)]
    (if (= target-pr 22)
      context
      (-> context
          (assoc-in [:snapshot :tuple :pr-number] target-pr)
          (assoc-in [:snapshot :verification :tuple :pr-number] target-pr)))))

(def context-a (publisher-context 22))
(def context-b (publisher-context 23))
(def admission-a (call-api "eta-mu.domain.review-publication" "admit" context-a))
(def admission-b (call-api "eta-mu.domain.review-publication" "admit" context-b))
(def binding-a (:binding admission-a))
(def binding-b (:binding admission-b))
(def stream-key (:lock-key binding-a))
(def intent-key-a (:intent-key binding-a))
(def intent-key-b (:intent-key binding-b))
(def reserved-a (event reservation-id 1 [] intent-key-a binding-a :reserved 0 stream-key))
(def started-a (event started-id 2 [reservation-id] intent-key-a binding-a :post-started 1 stream-key))
(def observed-a (event observed-id 3 [started-id] intent-key-a binding-a :observed 2 stream-key))

(defn- installation []
  (let [root (.mkdtempSync fs "/tmp/eta-mu-review-intent-")
        ledger-file (str root "/publication.edn")]
    (.writeFileSync fs ledger-file "" "utf8")
    (let [stat (.statSync fs ledger-file #js {:bigint true})]
      {:schema-directory (str root "/schemas")
       :ledger-file ledger-file
       :partition-device (str (.-dev stat))
       :partition-inode (str (.-ino stat))
       :expected-lock-key stream-key
       :test-root root})))

(defn- event-count [store]
  (->> (.readFileSync fs (:ledger-file store) "utf8")
       str/split-lines
       (remove str/blank?)
       count))

(deftest shared-stream-replay-keeps-intent-version-separate-from-stream-sequence
  (let [lock-stream (call-api "eta-mu.shape.review-intent" "lock-stream" stream-key)
        replay (call-api "eta-mu.domain.review-intent" "replay" stream-key
                         [reserved-a started-a observed-a])]
    (is (every? #(call-api "eta-mu.law.review-intent" "intent-event?" %)
                [reserved-a started-a observed-a])
        (pr-str [reserved-a started-a observed-a]))
    (is (= lock-stream
           (call-api "eta-mu.shape.review-intent" "lock-stream" stream-key)))
    (is (call-api "eta-mu.law.review-intent" "lock-key?" stream-key) (pr-str stream-key))
    (is (string? lock-stream))
    (is (= :replayed (:status replay)) (pr-str replay))
    (is (= 4 (:next-seq replay)))
    (is (= 2 (get-in replay [:intents intent-key-a :version])))
    (is (= :observed (get-in replay [:intents intent-key-a :state])))))

(deftest cljc-identity-laws-have-exact-cross-runtime-number-and-hash-shapes
  (is (true? (call-api "eta-mu.law.review-intent" "natural?" 1.0))
      "An integral floating EDN value canonicalizes as the same safe integer on both hosts.")
  (is (true? (call-api "eta-mu.law.review-intent" "natural?" 0.0)))
  (is (false? (call-api "eta-mu.law.review-intent" "natural?" 1.5)))
  (is (true? (call-api "eta-mu.law.review-intent" "lock-key?"
                       [123 "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" "ctx"]))
      "Valid SHA-256-width object IDs are accepted on NBB and Babashka.")
  (let [sha (apply str (repeat 64 "a"))
        stream (resolve-api "eta-mu.shape.review-intent" "lock-stream")]
    (is (= (stream [41 sha "ctx"]) (stream [41.0 sha "ctx"]))
        "Canonical Clio stream identity is stable for integer-valued double inputs.")
    (is (true? (call-api "eta-mu.law.review-intent" "lock-key?"
                         [9007199254740991 sha "ctx"]))
        "The shared safe-integer bound is accepted with SHA-256 object IDs.")))

(deftest replay-and-transition-use-portable-numeric-identity
  (let [numeric-binding (-> binding-a
                            (assoc-in [:lock-key 0] 41.0)
                            (update :intent-key assoc 1 41.0))
        numeric-admission (assoc admission-a :binding numeric-binding)
        numeric-reservation (-> reserved-a
                                (assoc :event/seq 1.0)
                                (assoc :event/stream (call-api "eta-mu.shape.review-intent" "lock-stream"
                                                               [41.0 (second stream-key) (nth stream-key 2)]))
                                (assoc-in [:event/data :intent-version] 0.0)
                                (assoc-in [:event/data :binding] numeric-binding))
        replay (call-api "eta-mu.domain.review-intent" "replay" stream-key [numeric-reservation])
        transition (call-api "eta-mu.domain.review-intent" "transition"
                             numeric-admission replay
                             {:state :post-started :expected-version 0.0
                              :owner "inert-worker" :claim-id "numeric-claim"})]
    (is (true? (call-api "eta-mu.law.review-intent" "intent-event?"
                         numeric-reservation)))
    (is (= :replayed (:status replay)) (pr-str replay))
    (is (= 2 (:next-seq replay)))
    (is (= 0 (get-in replay [:intents intent-key-a :version])))
    (is (= :append (:status transition)) (pr-str transition))
    (is (= 1 (:intent-version transition)))))

(deftest installation-root-is-derived-from-the-loaded-trusted-module
  (let [store (dissoc (installation) :installation-root)
        result (try
                 (call-api "eta-mu.infra.review-intent" "transition!"
                           (assoc store :installation-root "/tmp/caller-selected-installation")
                           context-a {:state :reserved})
                 (catch :default error {:status :exception :message (.-message error)}))]
    (is (= :appended (:status result)) (pr-str result))
    (is (= 1 (event-count store)))))

(deftest configured-partition-uses-exact-decimal-bigint-identity
  (let [store (installation)
        stat (.statSync fs (:ledger-file store) #js {:bigint true})
        guarded-store (assoc store
                             :partition-device (str (.-dev stat))
                             :partition-inode (str (.-ino stat)))
        result (call-api "eta-mu.infra.review-intent" "transition!"
                         guarded-store context-a {:state :reserved})]
    (is (= :appended (:status result)) (pr-str result))
    (is (= 1 (event-count store)))))

(deftest guarded-clio-append-refuses-replaced-descriptor-identity
  (let [store (installation)
        original-path (str (:ledger-file store) ".original")
        replacement "replacement inode must remain untouched\n"
        identity [(:partition-device store) (:partition-inode store)]
        schema-id :eta-mu.review-intent/transition
        event-data {:event/stream (call-api "eta-mu.shape.review-intent" "lock-stream" stream-key)
                    :event/seq 1 :event/causes []
                    :event/actor "inert-publisher" :event/subject "inert-lock"
                    :event/data (:event/data reserved-a)}
        runtime (clio-runtime/open (:schema-directory store)
                                   {schema-id (clio-schema-law/event-schema
                                               schema-id
                                               (deref (resolve-api "eta-mu.shape.review-intent"
                                                                   "event-data-schema")))})
        _ (.renameSync fs (:ledger-file store) original-path)
        _ (.writeFileSync fs (:ledger-file store) replacement "utf8")
        result (try
                 (clio-runtime/append! runtime (:ledger-file store) schema-id event-data
                                       {:expected-file-identity identity})
                 (catch :default error {:status :refused :reason (:clio/error (ex-data error))}))]
    (is (= :refused (:status result)) (pr-str result))
    (is (= replacement (.readFileSync fs (:ledger-file store) "utf8"))
        "The replaced path receives no event when its descriptor identity differs.")
    (is (= "" (.readFileSync fs original-path "utf8"))
        "The originally checked inode remains the untouched empty partition.")))

(deftest capability-issuance-is-not-a-public-receipt-mint-port
  (is (nil? (resolve-api "eta-mu.extern.review-intent" "issue-after-recheck!"))
      "Callers cannot turn a returned append receipt into a capability."))

(deftest extern-policy-and-vault-boundary-isolated-from-production
  (let [extern-file (.resolve path test-root
                              "packages/eta-mu/src/cljs/eta_mu/extern/review_intent.cljs")
        extern-source (.readFileSync fs extern-file "utf8")
        isolated-vault (call-api "eta-mu.extern.review-intent" "new-opaque-vault")]
    (is (not (str/includes? extern-source "eta-mu.domain.review-publication"))
        "The extern namespace must not depend on publisher domain policy.")
    (is (nil? (resolve-api "eta-mu.extern.review-intent" "transition-child!"))
        "The extern layer cannot perform the domain recheck or mint accepted capability.")
    (is (map? isolated-vault) "Extern exposes only a factory for an isolated vault instance.")
    (when (map? isolated-vault)
      (let [token ((:put! isolated-vault) {:kind :capability :binding binding-a})]
        (is (false? (call-api "eta-mu.infra.review-intent" "consume-capability!"
                              token binding-a))
            "A token from a caller-created vault cannot enter the private production vault.")))))

(deftest caller-created-vault-cannot-authorize-recovery
  (let [store (installation)
        vault (call-api "eta-mu.extern.review-intent" "new-opaque-vault")
        token ((:put! vault) {:kind :recovery :store store :recovery {:event :absent}})
        result (call-api "eta-mu.infra.review-intent" "recover!" store token)]
    (is (= :refused (:status result)) (pr-str result))
    (is (= 0 (event-count store)) "A token from another vault cannot append an absent event.")))

(deftest worker-response-fields-cannot-smuggle-capability
  (let [store (installation)
        forged (js/Symbol "worker-forged-capability")
        worker-var (resolve-api "eta-mu.extern.review-intent" "run-fixed-worker!")
        result (call-api "cljs.core" "with-redefs-fn"
                {worker-var (fn [_] {:status :replayed :state :post-started
                                    :capability forged :capability-issued? true})}
                #(call-api "eta-mu.infra.review-intent" "transition!"
                           store context-a {:state :reserved}))]
    (is (= :replayed (:status result)) (pr-str result))
    (is (false? (:capability-issued? result)))
    (is (not (contains? result :capability)))
    (is (false? (call-api "eta-mu.infra.review-intent" "consume-capability!"
                          forged binding-a)))))

(deftest clock-failure-refuses-before-worker-and-at-ack-without-capability
  (let [store (installation)
        clock-var (resolve-api "eta-mu.extern.review-intent" "clock-ms")
        worker-var (resolve-api "eta-mu.extern.review-intent" "run-fixed-worker!")
        calls (atom 0)
        before (call-api "cljs.core" "with-redefs-fn"
                {clock-var (fn [] (throw (js/Error. "injected initial clock failure")))
                 worker-var (fn [_] (swap! calls inc) {:status :appended})}
                #(call-api "eta-mu.infra.review-intent" "transition!"
                           store context-a {:state :reserved}))]
    (is (= :refused (:status before)) (pr-str before))
    (is (zero? @calls) "A failed initial admission clock starts no worker.")
    (let [ticks (atom 0)
          after (call-api "cljs.core" "with-redefs-fn"
                 {clock-var (fn [] (if (= 1 (swap! ticks inc))
                                     (.now js/Date)
                                     (throw (js/Error. "injected ACK clock failure"))))
                  worker-var (fn [_] {:status :appended :state :post-started})}
                 #(call-api "eta-mu.infra.review-intent" "transition!"
                            store context-a {:state :post-started :expected-version 0
                                             :owner "inert-worker"}))]
      (is (= :unknown (:status after)) (pr-str after))
      (is (= :ack-recheck (:reason after)))
      (is (false? (:capability-issued? after)))
      (is (not (contains? after :capability))))))

(defn- capture-launch-result [f]
  (try (f)
       (catch :default error
         {:test/escaped? true :test/error (:intent/error (ex-data error))})))

(defn- with-unavailable-worker-installation [store f]
  (let [root (str (:test-root store) "/unavailable-installation")
        package-directory (str root "/packages/eta-mu")]
    (.mkdirSync fs package-directory #js {:recursive true})
    (.writeFileSync fs (str package-directory "/package.json") "{\"dependencies\":{}}" "utf8")
    (call-api "cljs.core" "with-redefs-fn"
              {(resolve-api "eta-mu.extern.review-intent" "installation-root") root} f)))

(deftest actual-transition-worker-preflight-failures-are-structured-refusals
  (doseq [cause [:installation :input-bound]]
    (let [store (installation)
          context (cond-> context-a
                    (= :input-bound cause) (assoc :preflight-padding (apply str (repeat 70000 "x"))))
          launch #(call-api "eta-mu.infra.review-intent" "transition!"
                            store context {:state :post-started :expected-version 0 :owner "preflight-control"})
          result (capture-launch-result
                   #(if (= :installation cause)
                      (with-unavailable-worker-installation store launch)
                      (launch)))]
      (is (= :refused (:status result)) (pr-str result))
      (is (= :worker-preflight (:reason result)) (pr-str result))
      (is (= cause (:error result)))
      (is (false? (:capability-issued? result)))
      (is (not-any? #(contains? result %) [:capability :recovery :recovery-receipt]))
      (is (zero? (event-count store)) "The actual host preflight did not append anything."))))

(deftest actual-recovery-worker-preflight-failures-preserve-unknown-outcome
  (doseq [cause [:installation :input-bound]]
    (let [store (installation)
          recovery (cond-> {:ledger/path (:ledger-file store) :event reserved-a}
                     (= :input-bound cause) (assoc :preflight-padding (apply str (repeat 70000 "x"))))
          launch #(call-api "eta-mu.infra.review-intent" "recover!" store recovery)
          result (capture-launch-result
                   #(if (= :installation cause)
                      (with-unavailable-worker-installation store launch)
                      (launch)))]
      (is (= :unknown (:status result)) (pr-str result))
      (is (= :worker-preflight (:reason result)) (pr-str result))
      (is (= cause (:error result)))
      (is (false? (:capability-issued? result)))
      (is (not-any? #(contains? result %) [:capability :recovery :recovery-receipt]))
      (is (zero? (event-count store))))))

(deftest unclassified-worker-launch-errors-remain-unknown-without-new-authority
  (doseq [error [(js/Error. "injected possibly-started worker failure")
                 (ex-info "injected unclassified worker failure"
                          {:intent/error :unclassified :clio/append-recovery {:event reserved-a}})]
          operation [:transition :recover]]
    (let [store (installation)
          result (capture-launch-result
                   #(call-api "cljs.core" "with-redefs-fn"
                     {(resolve-api "eta-mu.extern.review-intent" "run-fixed-worker!")
                      (fn [_] (throw error))}
                     (fn []
                       (if (= :transition operation)
                         (call-api "eta-mu.infra.review-intent" "transition!" store context-a
                                   {:state :post-started :expected-version 0 :owner "uncertain-launch"})
                         (call-api "eta-mu.infra.review-intent" "recover!" store
                                   {:ledger/path (:ledger-file store) :event reserved-a})))))]
      (is (= :unknown (:status result)) (pr-str result))
      (is (= :worker-invocation (:reason result)) (pr-str result))
      (is (false? (:capability-issued? result)))
      (is (not-any? #(contains? result %) [:capability :recovery :recovery-receipt])))))

(defn- actual-uncertain-worker [store request]
  (let [runner (.resolve path test-root ".github/scripts/opencode_review_intent_uncertain_test.mjs")
        result (.spawnSync (js/require "node:child_process") (.-execPath js/process) #js [runner]
                           #js {:cwd test-root :encoding "utf8" :timeout 12000 :maxBuffer 2097152
                                :env #js {:HOME "/tmp" :PATH "/usr/bin:/bin" :LANG "C.UTF-8"
                                          :LC_ALL "C.UTF-8" :NODE_OPTIONS ""}
                                :input (js/JSON.stringify #js {:root test-root
                                                               :workerRequest (pr-str request)
                                                               :ledgerDirectory (:test-root store)})})
        wrapper (js/JSON.parse (.-stdout result))]
    (is (= 0 (.-status result)) (str (.-stderr result) (.-stdout result)))
    (is (= 0 (.-status wrapper)) (str (.-stderr wrapper) (.-stdout wrapper)))
    (reader/read-string (.-stdout wrapper))))

(deftest opaque-recovery-authorization-survives-known-and-uncertain-launch-failures
  (let [store (installation)
        worker-var (resolve-api "eta-mu.extern.review-intent" "run-fixed-worker!")
        uncertain (call-api "cljs.core" "with-redefs-fn"
                    {worker-var #(actual-uncertain-worker store %)}
                    #(call-api "eta-mu.infra.review-intent" "transition!" store context-a {:state :reserved}))
        token (:recovery-receipt uncertain)
        unavailable (capture-launch-result
                      #(with-unavailable-worker-installation store
                         (fn [] (call-api "eta-mu.infra.review-intent" "recover!" store token))))
        generic (capture-launch-result
                  #(call-api "cljs.core" "with-redefs-fn"
                    {worker-var (fn [_] (throw (js/Error. "injected recovery launch failure")))}
                    (fn [] (call-api "eta-mu.infra.review-intent" "recover!" store token))))]
    (is (= :unknown (:status uncertain)))
    (is (some? token) "The genuine visible append uncertainty is held by an opaque authorization.")
    (is (not (map? token)))
    (is (nil? (:recovery uncertain)))
    (doseq [result [unavailable generic]]
      (is (= :unknown (:status result)) (pr-str result))
      (is (false? (:capability-issued? result)))
      (is (not-any? #(contains? result %) [:capability :recovery :recovery-receipt])))
    (let [recovered (call-api "eta-mu.infra.review-intent" "recover!" store token)
          repeated (call-api "eta-mu.infra.review-intent" "recover!" store token)]
      (is (= :replayed (:status recovered)) (pr-str recovered))
      (is (= :already-present (:append-result recovered)))
      (is (false? (:capability-issued? recovered)))
      (is (= :refused (:status repeated)))
      (is (= 1 (event-count store)) "Launch failures did not add an event or consume the existing authorization."))))

(deftest fixed-worker-keeps-raw-host-io-at-the-extern-boundary
  (let [worker-file (.resolve path test-root
                              "packages/eta-mu/src/cljs/eta_mu/infra/review_intent_worker.cljs")
        source (.readFileSync fs worker-file "utf8")]
    (doseq [host-operation ["node:fs" "js/Buffer" "js/TextDecoder" "js/process"
                           ".readSync" ".writeSync"]]
      (is (not (str/includes? source host-operation))
          (str "Worker infra must compose shaped host I/O instead of " host-operation ".")))))

(deftest canonical-replay-refuses-gaps-wrong-predecessors-and-cross-lock-events
  (doseq [history [[reserved-a (assoc started-a :event/seq 3)]
                   [reserved-a (assoc started-a :event/causes [])]
                   [reserved-a (assoc started-a :event/data
                                      (assoc (:event/data started-a) :lock-key [99 "wrong" "context"]))]]]
    (is (= :refused (:status (call-api "eta-mu.domain.review-intent" "replay" stream-key history)))))
  (is (false? (call-api "eta-mu.law.review-intent" "intent-event?"
                        (assoc-in reserved-a [:event/data :intent-version] -1)))))

(deftest same-merge-intents-share-one-stream-and-serialize-different-prs
  (let [replay (call-api "eta-mu.domain.review-intent" "replay" stream-key
                         [reserved-a started-a observed-a])
        admitted-b admission-b
        reservation (call-api "eta-mu.domain.review-intent" "transition" admitted-b replay
                              {:state :reserved :binding binding-b})
        stale-claim (call-api "eta-mu.domain.review-intent" "transition" admitted-b replay
                              {:state :post-started :binding binding-a :expected-version 1
                               :owner "inert" :claim-id "inert"})]
    (is (= (call-api "eta-mu.shape.review-intent" "lock-stream" stream-key)
           (call-api "eta-mu.shape.review-intent" "lock-stream" stream-key)))
    (is (= 4 (:event-seq reservation)))
    (is (= 0 (:intent-version reservation)))
    (is (= :refused (:status stale-claim)))))


(deftest transition-law-refuses-invalid-admission-before-any-port-call
  (let [admission (call-api "eta-mu.domain.review-publication" "admit" {:now-ms 1})
        replay (call-api "eta-mu.domain.review-intent" "replay" stream-key [])
        proposal (call-api "eta-mu.domain.review-intent" "transition" admission replay
                           {:state :reserved :binding binding-a})]
    (is (= :refused (:status admission)) "Incomplete native custody never admits an intent.")
    (is (= :refused (:status proposal)) "Invalid admission must produce no append proposal.")))

(deftest invalid-source-admission-refuses-before-changing-clio-partition
  (let [path (str (.mkdtempSync fs "/tmp/review-intent-invalid-") "/partition.edn")
        before "sentinel-ledger-bytes\n"]
    (.writeFileSync fs path before "utf8")
    (try
      (let [result (nbb/await
                    (call-api "eta-mu.infra.review-intent" "transition!"
                              {:schema-directory (str path ".schemas")
                               :ledger-file path
                               :partition-device (str (.-dev (.statSync fs path #js {:bigint true})))
                               :partition-inode (str (.-ino (.statSync fs path #js {:bigint true})))
                               :expected-lock-key stream-key
                               }
                              {:now-ms 1}
                              {:state :reserved}))]
        (is (= :refused (:status result)))
        (is (= before (.readFileSync fs path "utf8"))))
      (finally (.unlinkSync fs path)))))

(deftest actual-clio-partition-persists-fresh-reservation-and-replay-refuses-duplicate
  (let [store (installation)
        first-result (call-api "eta-mu.infra.review-intent" "transition!"
                               store context-a {:state :reserved})
        second-result (call-api "eta-mu.infra.review-intent" "transition!"
                                store context-a {:state :reserved})]
    (is (= :appended (:status first-result)) (pr-str first-result))
    (is (= :reserved (:state first-result)))
    (is (= :refused (:status second-result)) (pr-str second-result))
    (is (= 1 (event-count store)) "The canonical Clio partition has one durable reservation.")))

(deftest unexpected-append-errors-preserve-uncertainty-through-the-worker-entry
  (doseq [error [(js/Error. "injected native append error")
                 (ex-info "injected missing tag" {})
                 (ex-info "injected numeric tag" {:clio/error 17})
                 (ex-info "injected string tag" {:clio/error "unexpected"})
                 (ex-info "injected map tag" {:clio/error {:unexpected true}})]]
    (let [store (installation)
          recovery {:ledger/path (:ledger-file store) :event reserved-a}
          error (if (ex-data error)
                  (ex-info (ex-message error) (assoc (ex-data error) :clio/append-recovery recovery))
                  error)
          request {:operation :transition :store store :context context-a :binding binding-a
                   :command {:state :reserved :binding binding-a}}
          output (atom nil)
          result (call-api "cljs.core" "with-redefs-fn"
                   {(resolve-api "clio.infra.runtime" "append!") (fn [& _] (throw error))
                    (resolve-api "eta-mu.extern.review-intent" "read-worker-input!") (fn [] (pr-str request))
                    (resolve-api "eta-mu.extern.review-intent" "write-worker-output!") #(reset! output %)}
                   #(call-api "eta-mu.infra.review-intent-worker" "entry"))]
      (is (= :unknown (:status result)) (pr-str result))
      (is (= :append-outcome (:reason result)) (pr-str result))
      (is (= (or (:clio/error (ex-data error)) :append-error) (:error result)))
      (is (= (:clio/append-recovery (ex-data error)) (:recovery result)))
      (is (false? (:capability-issued? result)))
      (is (= result (reader/read-string @output)) "The bounded worker emits the same uncertainty response."))))

(deftest named-clio-admission-errors-remain-refusals-at-the-worker-entry
  (doseq [[error-type reason] [[:clio.schema/invalid :event-schema]
                              [:clio.event/invalid :event-schema]
                              [:clio.ledger/id-collision :event-id-collision]]]
    (let [store (installation)
          request {:operation :transition :store store :context context-a :binding binding-a
                   :command {:state :reserved :binding binding-a}}
          result (call-api "cljs.core" "with-redefs-fn"
                   {(resolve-api "clio.infra.runtime" "append!")
                    (fn [& _] (throw (ex-info "injected classified error" {:clio/error error-type})))
                    (resolve-api "eta-mu.extern.review-intent" "read-worker-input!") (fn [] (pr-str request))
                    (resolve-api "eta-mu.extern.review-intent" "write-worker-output!") (fn [_] nil)}
                   #(call-api "eta-mu.infra.review-intent-worker" "entry"))]
      (is (= {:status :refused :reason reason} result) (pr-str result)))))

(deftest independent-workers-race-on-one-canonical-stream-slot
  (let [store (installation)
        barrier (str (:test-root store) "/two-process-barrier")
        make-request (fn [context binding]
                       (pr-str {:operation :transition
                                :store (select-keys store [:schema-directory :ledger-file
                                                           :partition-device :partition-inode
                                                           :expected-lock-key])
                                :context context :binding binding
                                :command {:state :reserved :binding binding}}))
        input (js/JSON.stringify
               #js {:root test-root :barrier barrier
                    :requests #js [(make-request context-a binding-a)
                                   (make-request context-b binding-b)]})
        launcher (.resolve path test-root ".github/scripts/opencode_review_intent_process_test.mjs")
        result (.spawnSync (js/require "node:child_process") (.-execPath js/process)
                           #js [launcher]
                           #js {:cwd test-root :env #js {:HOME "/tmp" :PATH "/usr/bin:/bin"
                                                         :LANG "C.UTF-8" :LC_ALL "C.UTF-8"
                                                         :NODE_OPTIONS ""}
                                :input input :encoding "utf8" :timeout 12000
                                :maxBuffer 2097152 :killSignal "SIGKILL"})
        output (try (js/JSON.parse (.-stdout result)) (catch :default _ nil))
        results (when (and output (= "complete" (.-status output)))
                  (mapv (fn [entry] (reader/read-string (.-stdout entry)))
                        (array-seq (.-results output))))
        proposals (when (and output (= "complete" (.-status output)))
                    (mapv reader/read-string (array-seq (.-proposals output))))]
    (is (= 0 (.-status result)) (str (.-stderr result) " " (.-stdout result)))
    (is (= "complete" (.-status output)) (str (.-stdout result)))
    (is (= 1 (count (filter #(= :appended (:status %)) results))) (pr-str results))
    (is (= 1 (count (filter #(= :refused (:status %)) results))) (pr-str results))
    (is (= [{:event-seq 1 :causes [] :intent-version 0}
            {:event-seq 1 :causes [] :intent-version 0}]
           proposals) (pr-str proposals))
    (is (= 1 (event-count store)) "Both independent workers derived the first slot; only one appended.")))

(deftest fresh-post-started-append-issues-only-private-single-use-capability
  (let [store (installation)
        reservation (call-api "eta-mu.infra.review-intent" "transition!"
                              store context-a {:state :reserved})
        started (call-api "eta-mu.infra.review-intent" "transition!"
                          store context-a {:state :post-started :expected-version 0
                                           :owner "inert-worker"})
        repeated (call-api "eta-mu.infra.review-intent" "transition!"
                           store context-a {:state :post-started :expected-version 0
                                            :owner "inert-worker"})
        consume (fn [token binding]
                  (call-api "eta-mu.infra.review-intent" "consume-capability!" token binding))]
    (is (= :appended (:status reservation)))
    (is (= :appended (:status started)) (pr-str started))
    (is (true? (:capability-issued? started)))
    (is (false? (:capability-issued? repeated)))
    (is (= :refused (:status repeated)) (pr-str repeated))
    (is (true? (consume (:capability started) binding-a)))
    (is (false? (consume (:capability started) binding-a)) "A second use is refused.")
    (is (false? (consume (:capability started) binding-b)) "A different binding cannot use the token.")
    (is (false? (consume (js/Symbol "forged") binding-a)) "A caller-forged token is refused.")
    (is (nil? (resolve-api "eta-mu.extern.review-intent" "issue-after-recheck!"))
        "A shaped/manual append receipt cannot reach a public mint function.")))

(deftest same-inode-alias-is-accepted-but-copied-partition-is-refused
  (let [store (installation)
        alias (str (:test-root store) "/publication-hardlink.edn")
        copy (str (:test-root store) "/publication-copy.edn")]
    (.linkSync fs (:ledger-file store) alias)
    (.copyFileSync fs (:ledger-file store) copy)
    (let [alias-result (call-api "eta-mu.infra.review-intent" "transition!"
                                 (assoc store :ledger-file alias) context-a {:state :reserved})
          copied-result (call-api "eta-mu.infra.review-intent" "transition!"
                                  (assoc store :ledger-file copy) context-b {:state :reserved})]
      (is (= :appended (:status alias-result)) (pr-str alias-result))
      (is (= :refused (:status copied-result)) (pr-str copied-result))
      (is (= 1 (event-count store)) "The hard-link alias observes the same single partition."))))

(deftest caller-shaped-recovery-cannot-inject-absent-events
  (let [store (installation)
        reservation (call-api "eta-mu.infra.review-intent" "transition!"
                              store context-a {:state :reserved})
        stored-event (reader/read-string
                      (str/trim (.readFileSync fs (:ledger-file store) "utf8")))
        visible (call-api "eta-mu.infra.review-intent" "recover!" store
                          {:ledger/path (:ledger-file store) :event stored-event})
        recovery-event (-> stored-event
                           (assoc :event/id "00000000-0000-4000-8000-000000000099"
                                  :event/seq 2 :event/causes [(:event/id stored-event)])
                           (assoc-in [:event/data :state] :post-started)
                           (assoc-in [:event/data :intent-version] 1)
                           (assoc-in [:event/data :owner] "recovery-only")
                           (assoc-in [:event/data :claim-id] "recovery-only-claim"))
        forged (call-api "eta-mu.infra.review-intent" "recover!" store
                         {:ledger/path (:ledger-file store) :event recovery-event})
        fake-receipt (call-api "eta-mu.infra.review-intent" "recover!" store
                               (js/Symbol "forged-recovery"))]
    (is (nil? (:recovery reservation))
        "A successful Clio append does not expose a synthetic recovery candidate.")
    (is (= :replayed (:status visible)) (pr-str visible))
    (is (= :already-present (:append-result visible)))
    (is (false? (:capability-issued? visible)))
    (is (= :refused (:status forged)) (pr-str forged))
    (is (= :refused (:status fake-receipt)) (pr-str fake-receipt))
    (is (= 1 (event-count store)) "An absent caller-supplied event never enters the canonical partition.")))

(deftest real-visible-append-durability-uncertainty-recovers-exact-event
  (let [store (installation)
        runner (.resolve path test-root ".github/scripts/opencode_review_intent_uncertain_test.mjs")
        worker-request (pr-str {:operation :transition
                                :store (select-keys store [:schema-directory :ledger-file
                                                           :partition-device :partition-inode
                                                           :expected-lock-key])
                                :context context-a :binding binding-a
                                :command {:state :reserved :binding binding-a}})
        runner-result (.spawnSync (js/require "node:child_process") (.-execPath js/process)
                                  #js [runner]
                                  #js {:cwd test-root :env #js {:HOME "/tmp" :PATH "/usr/bin:/bin"
                                                               :LANG "C.UTF-8" :LC_ALL "C.UTF-8"
                                                               :NODE_OPTIONS ""}
                                       :input (js/JSON.stringify #js {:root test-root
                                                                     :workerRequest worker-request
                                                                     :ledgerDirectory
                                                                     (.dirname path (:ledger-file store))})
                                       :encoding "utf8" :timeout 12000 :maxBuffer 2097152
                                       :killSignal "SIGKILL"})
        wrapper (try (js/JSON.parse (.-stdout runner-result)) (catch :default _ nil))
        uncertain (when (= 0 (.-status wrapper)) (reader/read-string (.-stdout wrapper)))
        recovery (:recovery uncertain)
        recovered (call-api "eta-mu.infra.review-intent" "recover!" store recovery)]
    (is (= 0 (.-status runner-result)) (str (.-stderr runner-result) " " (.-stdout runner-result)))
    (is (= :unknown (:status uncertain))
        (str (pr-str uncertain) " worker-stderr=" (.-stderr wrapper)
             " worker-stdout=" (.-stdout wrapper)
             " input=" (.-workerInputStart wrapper) "/" (.-workerInputLength wrapper)))
    (is (= :append-outcome (:reason uncertain)))
    (is (map? recovery) "The owning Clio append error returns its exact retry candidate.")
    (is (false? (:capability-issued? uncertain)))
    (is (= 1 (event-count store)) "Clio's bytes are visible although the parent-directory fence failed.")
    (is (= :replayed (:status recovered)) (pr-str recovered))
    (is (= :already-present (:append-result recovered)))
    (is (false? (:capability-issued? recovered)))
    (let [retried (call-api "eta-mu.infra.review-intent" "recover!" store recovery)]
      (is (= :replayed (:status retried)) (pr-str retried))
      (is (= :already-present (:append-result retried)))
      (is (false? (:capability-issued? retried)))
      (is (= 1 (event-count store))
          "Repeating the exact visible event is idempotent and never issues a capability."))))

(defn- started-installation []
  (let [store (installation)
        reservation (call-api "eta-mu.infra.review-intent" "transition!"
                              store context-a {:state :reserved})
        started (call-api "eta-mu.infra.review-intent" "transition!"
                          store context-a {:state :post-started :expected-version 0
                                           :owner "outcome-worker"})]
    (is (= :appended (:status reservation)) (pr-str reservation))
    (is (= :appended (:status started)) (pr-str started))
    [store started]))

(defn- unknown! [store receipt]
  (call-api "eta-mu.infra.review-intent" "record-unknown!" store context-a receipt))

(deftest durable-unknown-transition-preserves-exact-started-claim
  (let [projection (call-api "eta-mu.domain.review-intent" "replay" stream-key
                             [reserved-a started-a])
        command {:state :post-unknown :expected-version 1
                 :owner "inert-worker" :claim-id "inert-claim"}
        proposal (call-api "eta-mu.domain.review-intent" "transition"
                           admission-a projection command)]
    (is (= :append (:status proposal)) (pr-str proposal))
    (is (= {:lock-key stream-key :intent-key intent-key-a :binding binding-a
            :state :post-unknown :intent-version 2
            :owner "inert-worker" :claim-id "inert-claim"}
           (:event-data proposal)))
    (is (= 3 (:event-seq proposal)))
    (is (= [started-id] (:causes proposal)))
    (doseq [bad [(assoc command :owner "other") (assoc command :claim-id "other")
                 (dissoc command :owner) (dissoc command :claim-id)
                 (assoc command :expected-version 0) (assoc command :expected-version 2)]]
      (is (= :refused (:status (call-api "eta-mu.domain.review-intent" "transition"
                                        admission-a projection bad))) (pr-str bad)))
    (doseq [history [[] [reserved-a] [reserved-a started-a observed-a]]]
      (is (= :refused (:status
                       (call-api "eta-mu.domain.review-intent" "transition" admission-a
                                 (call-api "eta-mu.domain.review-intent" "replay" stream-key history)
                                 command)))))
    (is (= :refused (:status (call-api "eta-mu.domain.review-intent" "transition"
                                      admission-b projection command))))))

(deftest unknown-replay-retains-claim-and-keeps-the-shared-slot-active
  (let [unknown (-> (event observed-id 3 [started-id] intent-key-a binding-a
                          :post-unknown 2 stream-key)
                    (assoc-in [:event/data :owner] "inert-worker")
                    (assoc-in [:event/data :claim-id] "inert-claim"))
        history [reserved-a started-a unknown]
        projection (call-api "eta-mu.domain.review-intent" "replay" stream-key history)]
    (is (= :replayed (:status projection)))
    (is (= "inert-worker" (get-in projection [:intents intent-key-a :owner])))
    (is (= "inert-claim" (get-in projection [:intents intent-key-a :claim-id])))
    (is (= :refused (:status (call-api "eta-mu.domain.review-intent" "transition"
                                      admission-b projection {:state :reserved}))))
    (doseq [bad [(assoc-in unknown [:event/data :owner] "substituted")
                 (assoc-in unknown [:event/data :claim-id] "substituted")
                 (assoc-in unknown [:event/data :owner] nil)
                 (assoc-in unknown [:event/data :claim-id] nil)]]
      (is (= :refused (:status (call-api "eta-mu.domain.review-intent" "replay"
                                        stream-key [reserved-a started-a bad]))) (pr-str bad)))))

(deftest real-opaque-outcome-survives-wire-consumption-and-journals-once
  (let [[store started] (started-installation)
        receipt (:outcome-receipt started)
        capability (:capability started)]
    (is (some? receipt))
    (is (not (map? receipt)))
    (is (true? (call-api "eta-mu.infra.review-intent" "consume-capability!" capability binding-a)))
    (let [result (unknown! store receipt)
          events (mapv reader/read-string
                       (remove str/blank? (str/split-lines
                                           (.readFileSync fs (:ledger-file store) "utf8"))))
          projection (call-api "eta-mu.domain.review-intent" "replay" stream-key events)]
      (is (= :appended (:status result)) (pr-str result))
      (is (= :post-unknown (:state result)))
      (is (false? (:capability-issued? result)))
      (is (not-any? #(contains? result %) [:capability :outcome-receipt]))
      (is (= 3 (event-count store)))
      (is (= :post-unknown (get-in projection [:intents intent-key-a :state])))
      (is (= "outcome-worker" (get-in projection [:intents intent-key-a :owner])))
      (is (= (:claim-id started) (get-in projection [:intents intent-key-a :claim-id])))
      (is (= :refused (:status (unknown! store receipt))))
      (is (= :refused (:status
                       (call-api "eta-mu.infra.review-intent" "transition!"
                                 store context-b {:state :reserved}))))
      (is (false? (call-api "eta-mu.infra.review-intent" "consume-capability!" capability binding-a))))))

(deftest forged-and-cross-store-outcomes-cannot-retire-wire-authority
  (let [[store started] (started-installation)
        other (installation)
        vault (call-api "eta-mu.extern.review-intent" "new-opaque-vault")
        fake ((:put! vault) {:kind :outcome :store store :binding binding-a
                             :claim-id (:claim-id started) :expected-version 1})]
    (doseq [[target receipt] [[store fake] [store (js/Symbol "forged")]
                             [other (:outcome-receipt started)]
                             [store {:claim-id (:claim-id started) :expected-version 1
                                     :owner "outcome-worker" :authorized? true}]]]
      (is (= :refused (:status (unknown! target receipt))) (pr-str receipt)))
    (is (= 2 (event-count store)))
    (is (= 0 (event-count other)))
    (is (true? (call-api "eta-mu.infra.review-intent" "consume-capability!"
                        (:capability started) binding-a)))
    (is (= :appended (:status (unknown! store (:outcome-receipt started)))))))

(deftest admitted-outcome-retires-wire-authority-before-uncertain-worker-launch
  (let [[store started] (started-installation)
        worker-var (resolve-api "eta-mu.extern.review-intent" "run-fixed-worker!")
        calls (atom 0)
        result (call-api "cljs.core" "with-redefs-fn"
                        {worker-var (fn [_]
                                      (swap! calls inc)
                                      (is (false? (call-api "eta-mu.infra.review-intent" "consume-capability!"
                                                           (:capability started) binding-a)))
                                      (throw (js/Error. "uncertain outcome launch")))}
                        #(unknown! store (:outcome-receipt started)))]
    (is (= 1 @calls))
    (is (= :unknown (:status result)) (pr-str result))
    (is (false? (:capability-issued? result)))
    (is (= 2 (event-count store)))
    (is (false? (call-api "eta-mu.infra.review-intent" "consume-capability!"
                         (:capability started) binding-a)))
    (is (= :appended (:status (unknown! store (:outcome-receipt started)))))
    (is (= 3 (event-count store)))))

(deftest actual-outcome-append-uncertainty-recovers-without-new-post-authority
  (let [[store started] (started-installation)
        worker-var (resolve-api "eta-mu.extern.review-intent" "run-fixed-worker!")
        result (call-api "cljs.core" "with-redefs-fn"
                        {worker-var #(actual-uncertain-worker store %)}
                        #(unknown! store (:outcome-receipt started)))]
    (is (= :unknown (:status result)) (pr-str result))
    (is (= :append-outcome (:reason result)))
    (is (= 3 (event-count store)))
    (is (some? (:recovery-receipt result)))
    (is (false? (:capability-issued? result)))
    (is (false? (call-api "eta-mu.infra.review-intent" "consume-capability!"
                         (:capability started) binding-a)))
    (let [recovered (call-api "eta-mu.infra.review-intent" "recover!" store (:recovery-receipt result))]
      (is (= :replayed (:status recovered)) (pr-str recovered))
      (is (false? (:capability-issued? recovered)))
      (is (not-any? #(contains? recovered %) [:capability :outcome-receipt])))
    (is (= :refused (:status (unknown! store (:outcome-receipt started)))))
    (is (= 3 (event-count store)))))

(deftest worker-observations-cannot-smuggle-outcome-authority
  (let [store (installation)
        forged (js/Symbol "worker-outcome")
        worker-var (resolve-api "eta-mu.extern.review-intent" "run-fixed-worker!")
        result (call-api "cljs.core" "with-redefs-fn"
                        {worker-var (fn [_] {:status :replayed :state :post-started
                                            :outcome-receipt forged :outcome-issued? true})}
                        #(call-api "eta-mu.infra.review-intent" "transition!"
                                   store context-a {:state :reserved}))]
    (is (not (contains? result :outcome-receipt)))
    (is (not (true? (:outcome-issued? result))))
    (is (= :refused (:status (unknown! store forged))))
    (is (= 0 (event-count store)))))

(deftest public-transition-cannot-submit-caller-outcomes
  (let [[store started] (started-installation)]
    (doseq [state [:post-unknown :observed :ambiguous-absence]]
      (let [result (call-api "eta-mu.infra.review-intent" "transition!"
                             store context-a {:state state :expected-version 1
                                              :claim-id (:claim-id started) :owner "outcome-worker"
                                              :outcome-receipt (:outcome-receipt started)
                                              :authenticated? true})]
        (is (= :refused (:status result)) (pr-str result))))
    (is (= 2 (event-count store)))
    (is (true? (call-api "eta-mu.infra.review-intent" "consume-capability!"
                        (:capability started) binding-a)))))

(deftest fresh-started-acknowledgment-must-match-claim-and-version
  (doseq [change [#(dissoc % :claim-id) #(assoc % :claim-id "different-claim")
                  #(dissoc % :intent-version) #(assoc % :intent-version 0)
                  #(assoc % :intent-version 2)]]
    (let [store (installation)
          worker-var (resolve-api "eta-mu.extern.review-intent" "run-fixed-worker!")
          result (call-api "cljs.core" "with-redefs-fn"
                          {worker-var (fn [request]
                                        (change {:status :appended :state :post-started
                                                 :claim-id (get-in request [:command :claim-id])
                                                 :intent-version 1}))}
                          #(call-api "eta-mu.infra.review-intent" "transition!"
                                     store context-a {:state :post-started :expected-version 0
                                                      :owner "ack-control"}))]
      (is (= :unknown (:status result)) (pr-str result))
      (is (false? (:capability-issued? result)))
      (is (not-any? #(contains? result %) [:capability :outcome-receipt])))))

(deftest valid-outcome-retires-wire-authority-even-on-known-preflight-refusal
  (let [[store started] (started-installation)
        result (with-unavailable-worker-installation store
                 #(unknown! store (:outcome-receipt started)))]
    (is (= :refused (:status result)) (pr-str result))
    (is (= :worker-preflight (:reason result)))
    (is (false? (:capability-issued? result)))
    (is (false? (call-api "eta-mu.infra.review-intent" "consume-capability!"
                         (:capability started) binding-a)))
    (is (= :appended (:status (unknown! store (:outcome-receipt started)))))))

(when (= nbb/*file* (nbb/invoked-file))
  (test/run-tests 'opencode-review-intent-test))
