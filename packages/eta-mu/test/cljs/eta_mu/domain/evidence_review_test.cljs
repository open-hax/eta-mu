(ns eta-mu.domain.evidence-review-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.domain.evidence-review :as review]
            [eta-mu.law.evidence-review :as law]))

(defn- digest
  [character]
  (str "sha256:" (apply str (repeat 64 character))))

(def snapshot
  {:schema/version 1
   :review/repository-id 123456
   :review/pull-request 42
   :review/head (apply str (repeat 40 "a"))
   :review/snapshot-hash (digest "b")
   :review/dependency-closure-hash (digest "c")
   :review/episode "axxium:episode:review-42"})

(def required-lanes
  #{:contracts-schema :tests-failures :ci-provenance})

(def lane-revisions
  {:contracts-schema (digest "1")
   :tests-failures (digest "2")
   :ci-provenance (digest "3")})

(def artifact-digests
  {:contracts-schema (digest "4")
   :tests-failures (digest "5")
   :ci-provenance (digest "6")})

(defn- artifact
  [lane]
  {:artifact/kind :lane-manifest
   :artifact/hash (get artifact-digests lane)
   :artifact/location {:path (str "evidence/" (name lane) ".edn")
                       :line-start 1
                       :line-end 1}})

(defn- lane-result
  ([lane]
   (lane-result lane {}))
  ([lane overrides]
   (merge snapshot
          {:evidence/lane lane
           :evidence/lane-revision (get lane-revisions lane)
           :evidence/producer
           {:producer/actor-binding (str "axxium:binding:" (name lane))
            :producer/profile-revision (digest "7")
            :producer/workflow-revision (apply str (repeat 40 "8"))
            :producer/attestation-hash (digest "9")}
           :coverage/status :complete
           :coverage/inspected [(artifact lane)]
           :findings []}
          overrides)))

(defn- finding
  ([lane]
   (finding lane {}))
  ([lane overrides]
   (merge {:finding/id (digest "d")
           :finding/status :confirmed
           :finding/disposition :blocking
           :finding/severity :high
           :finding/scope :changed-line
           :finding/path "src/example.cljs"
           :finding/line 73
           :finding/claim "The declared contract cannot be resolved."
           :finding/failure-trace "Validator exited 1 at src/example.cljs:73."
           :finding/evidence [(artifact lane)]
           :finding/confidence 0.98}
          overrides)))

(deftest complete-required-lanes-succeed
  (let [results (mapv lane-result required-lanes)
        verdict (review/aggregate-verdict snapshot required-lanes results)]
    (testing "success requires every required lane to be complete"
      (is (= :success (:aggregate/conclusion verdict)))
      (is (empty? (:aggregate/reasons verdict)))
      (is (every? #(= :complete (:coverage/status %))
                  (:aggregate/lane-statuses verdict)))
      (is (law/valid-aggregate-verdict? verdict)))))

(deftest incomplete-evidence-blocks-without-inventing-a-defect
  (let [verdict (review/aggregate-verdict
                 snapshot
                 required-lanes
                 [(lane-result :contracts-schema)
                  (lane-result :tests-failures
                               {:coverage/status :unavailable
                                :coverage/inspected []})])]
    (testing "missing and unavailable lanes remain explicit"
      (is (= :blocked (:aggregate/conclusion verdict)))
      (is (contains? (set (:aggregate/reasons verdict))
                     :missing-required-lane))
      (is (contains? (set (:aggregate/reasons verdict))
                     :unavailable-required-lane))
      (is (empty? (:aggregate/confirmed-blockers verdict))))))

(deftest sound-blocker-outranks-silent-lanes
  (let [blocker (finding :contracts-schema)
        verdict (review/aggregate-verdict
                 snapshot
                 required-lanes
                 [(lane-result :contracts-schema {:findings [blocker]})
                  (lane-result :tests-failures
                               {:coverage/status :unavailable
                                :coverage/inspected []})])]
    (testing "one retained, supported blocker fails even when other lanes are incomplete"
      (is (= :failure (:aggregate/conclusion verdict)))
      (is (= [blocker] (:aggregate/confirmed-blockers verdict)))
      (is (contains? (set (:aggregate/reasons verdict)) :confirmed-blocker)))))

(deftest unsupported-blocker-is-rejected-not-promoted
  (let [unsupported (-> (finding :contracts-schema)
                        (dissoc :finding/failure-trace)
                        (assoc :finding/evidence
                               [{:artifact/kind :validator-output
                                 :artifact/hash (digest "e")}]))
        verdict (review/aggregate-verdict
                 snapshot
                 #{:contracts-schema}
                 [(lane-result :contracts-schema {:findings [unsupported]})])]
    (testing "a blocker without a trace or retained artifact cannot fail the code"
      (is (= :blocked (:aggregate/conclusion verdict)))
      (is (= [{:rejection/reason :unsupported-finding
               :evidence/lane :contracts-schema}]
             (:aggregate/rejections verdict)))
      (is (empty? (:aggregate/confirmed-blockers verdict))))))

(deftest stale-or-foreign-results-are-rejected
  (let [stale (assoc (lane-result :contracts-schema)
                     :review/head
                     (apply str (repeat 40 "f")))
        verdict (review/aggregate-verdict
                 snapshot #{:contracts-schema} [stale])]
    (testing "matching a mutable PR number is not enough; the exact snapshot must match"
      (is (= :blocked (:aggregate/conclusion verdict)))
      (is (= :rejected
             (-> verdict :aggregate/lane-statuses first :coverage/status)))
      (is (= :review-snapshot-mismatch
             (-> verdict :aggregate/rejections first :rejection/reason))))))

(deftest duplicates-are-idempotent-but-conflicts-block
  (let [complete (lane-result :contracts-schema)
        duplicate-verdict (review/aggregate-verdict
                           snapshot #{:contracts-schema} [complete complete])
        conflicting (assoc complete
                           :coverage/status :partial
                           :coverage/reason :artifact-budget-exhausted)
        conflict-verdict (review/aggregate-verdict
                          snapshot #{:contracts-schema} [complete conflicting])]
    (testing "byte-equal redelivery is idempotent"
      (is (= :success (:aggregate/conclusion duplicate-verdict))))
    (testing "two distinct results for one lane are preserved as a conflict"
      (is (= :blocked (:aggregate/conclusion conflict-verdict)))
      (is (= :conflicted
             (-> conflict-verdict
                 :aggregate/lane-statuses
                 first
                 :coverage/status)))
      (is (= :conflicting-lane-results
             (-> conflict-verdict
                 :aggregate/rejections
                 first
                 :rejection/reason))))))

(deftest contradictions-survive-aggregation
  (let [blocker (finding :contracts-schema)
        contradiction (assoc blocker
                             :finding/id (digest "e")
                             :finding/status :contradicted
                             :finding/failure-trace
                             "Replay fixture disproved the proposed failure trace.")
        verdict (review/aggregate-verdict
                 snapshot
                 #{:contracts-schema}
                 [(lane-result :contracts-schema
                               {:findings [contradiction blocker]})])]
    (testing "contradictory evidence is retained rather than counted as a vote"
      (is (= :failure (:aggregate/conclusion verdict)))
      (is (= [contradiction] (:aggregate/contradictions verdict)))
      (is (= [blocker] (:aggregate/confirmed-blockers verdict))))))

(deftest aggregation-is-order-independent
  (let [results (mapv lane-result required-lanes)
        forward (review/aggregate-verdict snapshot required-lanes results)
        reverse-order (review/aggregate-verdict snapshot required-lanes (vec (reverse results)))]
    (testing "parallel completion order cannot change the verdict"
      (is (= forward reverse-order)))))
