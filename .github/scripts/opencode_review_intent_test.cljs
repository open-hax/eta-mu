;; SPDX-License-Identifier: GPL-3.0-or-later
(ns opencode-review-intent-test
  "Causal contract for the Clio-backed publication-intent adapter.
  Fixtures in this suite are inert and never establish source custody."
  (:require [cljs.test :as test :refer [deftest is testing]]
            [cljs.reader :as reader]
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
    (let [stat (.statSync fs ledger-file)]
      {:schema-directory (str root "/schemas")
       :ledger-file ledger-file
       :partition-device (.-dev stat)
       :partition-inode (.-ino stat)
       :expected-lock-key stream-key
       :installation-root test-root
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
  (is (false? (call-api "eta-mu.law.review-intent" "natural?" 1.0))
      "An integral floating value is not an integer port value.")
  (is (true? (call-api "eta-mu.law.review-intent" "lock-key?"
                       [123 "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" "ctx"]))
      "Valid SHA-256-width object IDs are accepted on NBB and Babashka."))

(deftest installation-root-is-derived-from-the-loaded-trusted-module
  (let [store (dissoc (installation) :installation-root)
        result (try
                 (call-api "eta-mu.infra.review-intent" "transition!"
                           (assoc store :installation-root "/tmp/caller-selected-installation")
                           context-a {:state :reserved})
                 (catch :default error {:status :exception :message (.-message error)}))]
    (is (= :appended (:status result)) (pr-str result))
    (is (= 1 (event-count store)))))

(deftest capability-issuance-is-not-a-public-receipt-mint-port
  (is (nil? (resolve-api "eta-mu.extern.review-intent" "issue-after-recheck!"))
      "Callers cannot turn a returned append receipt into a capability."))

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
                               :partition-device (.-dev (.statSync fs path))
                               :partition-inode (.-ino (.statSync fs path))
                               :expected-lock-key stream-key
                               :installation-root test-root}
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

(deftest independent-workers-race-on-one-canonical-stream-slot
  (let [store (installation)
        barrier (str (:test-root store) "/two-process-barrier")
        make-request (fn [context binding worker-id]
                       (pr-str {:operation :transition
                                :store (select-keys store [:schema-directory :ledger-file
                                                           :partition-device :partition-inode
                                                           :expected-lock-key])
                                :context context :binding binding
                                :command {:state :reserved :binding binding}
                                :test/barrier {:directory barrier :worker-id worker-id}}))
        input (js/JSON.stringify
               #js {:root test-root :barrier barrier
                    :requests #js [(make-request context-a binding-a "a")
                                   (make-request context-b binding-b "b")]})
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
    (is (false? (:capability-issued?
                 (call-api "eta-mu.extern.review-intent" "issue-after-recheck!"
                           (js/Symbol "forged-receipt") binding-a)))
        "A shaped/manual append receipt cannot mint a capability.")))

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
        recovery-event (-> stored-event
                           (assoc :event/id "00000000-0000-4000-8000-000000000099"
                                  :event/seq 2 :event/causes [(:event/id stored-event)])
                           (assoc-in [:event/data :state] :post-started)
                           (assoc-in [:event/data :intent-version] 1)
                           (assoc-in [:event/data :owner] "recovery-only")
                           (assoc-in [:event/data :claim-id] "recovery-only-claim"))
        forged (call-api "eta-mu.infra.review-intent" "recover!" store
                         {:ledger/path (:ledger-file store) :event recovery-event})]
    (is (nil? (:recovery reservation))
        "A successful Clio append does not expose a synthetic recovery candidate.")
    (is (= :refused (:status forged)) (pr-str forged))
    (is (= 1 (event-count store)) "An absent caller-supplied event never enters the canonical partition.")))

(when (= nbb/*file* (nbb/invoked-file))
  (test/run-tests 'opencode-review-intent-test))
