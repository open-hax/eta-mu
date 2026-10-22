;; SPDX-License-Identifier: GPL-3.0-or-later
(ns opencode-review-intent-test
  "Causal contract for the Clio-backed publication-intent adapter.
  Fixtures in this suite are inert and never establish source custody."
  (:require [cljs.test :as test :refer [deftest is testing]]
            [nbb.core :as nbb]
            [clojure.string :as str]
            ["node:fs" :as fs]))

(defn- resolve-api [namespace symbol-name]
  (resolve (symbol namespace symbol-name)))

(defn- call-api [namespace symbol-name & args]
  (when-let [f (resolve-api namespace symbol-name)]
    (apply f args)))

(defn- load-source-if-present [path]
  (when (.existsSync fs path)
    (nbb/await (nbb/load-file path))))

(deftest portable-intent-api-is-present
  (doseq [[namespace symbol-name]
          [["eta-mu.law.review-intent" "intent-event?"]
           ["eta-mu.shape.review-intent" "lock-stream"]
           ["eta-mu.domain.review-intent" "replay"]
           ["eta-mu.domain.review-intent" "transition"]
           ["eta-mu.infra.review-intent" "transition!"]]]
    (testing (str namespace "/" symbol-name)
      (is (fn? (resolve-api namespace symbol-name))
          "The publisher intent component is currently missing."))))

(load-source-if-present ".github/scripts/opencode_review_publish_test.cljs")

(def stream-key [41 (apply str (repeat 40 "4")) "eta-mu/trusted-review-publication-v1"])
(def intent-key-a [:review-publication/v1 41 22])
(def intent-key-b [:review-publication/v1 41 23])
(def binding-a {:intent-key intent-key-a :lock-key stream-key})
(def binding-b {:intent-key intent-key-b :lock-key stream-key})
(def reservation-id "00000000-0000-4000-8000-000000000001")
(def started-id "00000000-0000-4000-8000-000000000002")
(def observed-id "00000000-0000-4000-8000-000000000003")
(defn- event [event-id event-seq causes intent-key binding state intent-version]
  {:event/id event-id
   :event/type :review-intent/transition
   :event/stream "review-publication-lock/fixture"
   :event/seq event-seq
   :event/causes causes
   :event/actor "inert-publisher"
   :event/subject "review-publication-lock/fixture"
   :event/at "2026-10-22T00:00:00.000Z"
   :event/data {:lock-key stream-key :intent-key intent-key :binding binding
                :state state :intent-version intent-version}})

(def reserved-a (event reservation-id 1 [] intent-key-a binding-a :reserved 0))
(def started-a (event started-id 2 [reservation-id] intent-key-a binding-a :post-started 1))
(def observed-a (event observed-id 3 [started-id] intent-key-a binding-a :observed 2))

(defn- publisher-context [target-pr]
  (let [fixture (resolve 'opencode-review-publish-test/fixture)
        context (fixture)]
    (if (= target-pr 22)
      context
      (-> context
          (assoc-in [:snapshot :tuple :pr-number] target-pr)
          (assoc-in [:snapshot :verification :tuple :pr-number] target-pr)))))

(defn- installation []
  (let [root (.mkdtempSync fs "/tmp/eta-mu-review-intent-")
        ledger-file (str root "/publication.edn")]
    (.writeFileSync fs ledger-file "" "utf8")
    {:schema-directory (str root "/schemas")
     :ledger-file ledger-file
     :test-root root}))

(defn- transition! [store context command]
  (if-let [f (resolve-api "eta-mu.infra.review-intent" "transition!")]
    (nbb/await (f store context command))
    {:status :missing-adapter}))

(defn- event-count [store]
  (->> (.readFileSync fs (:ledger-file store) "utf8")
       str/split-lines
       (remove str/blank?)
       count))

(deftest shared-stream-replay-keeps-intent-version-separate-from-stream-sequence
  (let [lock-stream (call-api "eta-mu.shape.review-intent" "lock-stream" stream-key)
        replay (call-api "eta-mu.domain.review-intent" "replay" stream-key
                         [reserved-a started-a observed-a])]
    (is (= lock-stream
           (call-api "eta-mu.shape.review-intent" "lock-stream" stream-key)))
    (is (string? lock-stream))
    (is (= :replayed (:status replay)))
    (is (= 4 (:next-seq replay)))
    (is (= 2 (get-in replay [:intents intent-key-a :version])))
    (is (= :observed (get-in replay [:intents intent-key-a :state])))))

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
        context-b (publisher-context 23)
        admitted-b (call-api "eta-mu.domain.review-publication" "admit" context-b)
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
  (let [path "/tmp/review-intent-invalid-admission.edn"
        before "sentinel-ledger-bytes\n"]
    (.writeFileSync fs path before "utf8")
    (try
      (let [result (nbb/await
                    (call-api "eta-mu.infra.review-intent" "transition!"
                              {:schema-directory "/tmp/review-intent-invalid-schemas"
                               :ledger-file path}
                              {:now-ms 1}
                              {:state :reserved}))]
        (is (= :refused (:status result)))
        (is (= before (.readFileSync fs path "utf8"))))
      (finally (.unlinkSync fs path)))))

(load-source-if-present "packages/eta-mu/src/cljs/eta_mu/law/review_intent.cljc")
(load-source-if-present "packages/eta-mu/src/cljs/eta_mu/shape/review_intent.cljc")
(load-source-if-present "packages/eta-mu/src/cljs/eta_mu/domain/review_intent.cljc")
(load-source-if-present "packages/eta-mu/src/cljs/eta_mu/extern/review_intent.cljs")
(load-source-if-present "packages/eta-mu/src/cljs/eta_mu/infra/review_intent.cljs")

(when (= nbb/*file* (nbb/invoked-file))
  (test/run-tests 'opencode-review-intent-test))
