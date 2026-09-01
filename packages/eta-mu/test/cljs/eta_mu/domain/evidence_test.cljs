(ns eta-mu.domain.evidence-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.domain.evidence :as evidence]
            [eta-mu.law.evidence :as law]))

(def ^:private target
  {:repository/id 654321
   :pull-request/object-id "PR_kwDOexample"
   :head "0123456789abcdef"
   :snapshot/hash "sha256:snapshot"
   :dependency-closure/hash "sha256:closure"})

(def ^:private episode
  "axxium:episode:review-1")

(def ^:private required-lanes
  [:contracts :tests :ci-provenance])

(defn- artifact
  [lane]
  {:artifact/kind lane
   :artifact/hash (str "sha256:" (name lane))
   :artifact/location {:lane lane}})

(defn- lane-result
  ([lane]
   (lane-result lane []))
  ([lane findings]
   {:schema/version 1
    :evidence/lane lane
    :evidence/lane-revision (str "sha256:" (name lane) "-v1")
    :evidence/producer
    {:actor/binding (str "axxium:binding:" (name lane) "-reviewer")
     :attestation/hash (str "sha256:" (name lane) "-attestation")}
    :review/target target
    :review/episode episode
    :coverage/status :complete
    :coverage/inspected [(artifact lane)]
    :findings findings}))

(defn- request
  [results]
  {:schema/version 1
   :required/lanes required-lanes
   :review/target target
   :review/episode episode
   :lane/results results})

(defn- clean-results
  []
  (mapv lane-result required-lanes))

(def ^:private advisory-finding
  {:finding/id "finding:docs:1"
   :finding/status :confirmed
   :finding/disposition :advisory
   :finding/severity :low
   :finding/claim "The operator diagram omits the retry state."
   :finding/path "docs/workflow.md"
   :finding/line 18
   :finding/evidence [(artifact :docs)]})

(def ^:private blocking-finding
  {:finding/id "finding:contracts:1"
   :finding/status :confirmed
   :finding/disposition :blocking
   :finding/severity :high
   :finding/claim "The resource cannot be instantiated."
   :finding/path "contracts/github.edn"
   :finding/line 12
   :finding/failure-trace "Malli rejected the unresolved schema."
   :finding/evidence [(artifact :contracts)]})

(deftest clean-complete-evidence-is-approved
  (let [decision (evidence/aggregate-verdict (request (clean-results)))]
    (is (= :approved (:aggregate/status decision)))
    (is (= [:ci-provenance :contracts :tests]
           (:complete/lanes decision)))
    (is (empty? (:missing/lanes decision)))
    (is (empty? (:findings decision)))
    (is (empty? (:problems decision)))
    (is (law/valid-aggregate-decision? decision))))

(deftest supported-findings-determine-advisory-or-blocked
  (testing "a retained advisory does not become an approval"
    (let [results (assoc (clean-results)
                         0 (lane-result :contracts [advisory-finding]))
          decision (evidence/aggregate-verdict (request results))]
      (is (= :advisory (:aggregate/status decision)))
      (is (= {:blocking 0 :advisory 1 :contradicted 0}
             (:finding/counts decision)))))
  (testing "one supported blocker blocks despite other clean lanes"
    (let [results (assoc (clean-results)
                         0 (lane-result :contracts [blocking-finding]))
          decision (evidence/aggregate-verdict (request results))]
      (is (= :evidence-blocked (:aggregate/status decision)))
      (is (= {:blocking 1 :advisory 0 :contradicted 0}
             (:finding/counts decision))))))

(deftest unsupported-or-incomplete-evidence-fails-closed
  (testing "a blocking claim without a concrete failure trace is unavailable"
    (let [unsupported (dissoc blocking-finding :finding/failure-trace)
          results (assoc (clean-results)
                         0 (lane-result :contracts [unsupported]))
          decision (evidence/aggregate-verdict (request results))]
      (is (= :evidence-unavailable (:aggregate/status decision)))
      (is (some #(re-find #"failure trace" %) (:problems decision)))))
  (testing "a required partial lane is not silence-as-success"
    (let [results (assoc (clean-results)
                         1 (assoc (lane-result :tests)
                                  :coverage/status :partial))
          decision (evidence/aggregate-verdict (request results))]
      (is (= :evidence-unavailable (:aggregate/status decision)))
      (is (some #(re-find #"not complete" %) (:problems decision)))))
  (testing "a complete lane cannot claim it inspected nothing"
    (let [results (assoc (clean-results)
                         2 (assoc (lane-result :ci-provenance)
                                  :coverage/inspected []))
          decision (evidence/aggregate-verdict (request results))]
      (is (= :evidence-unavailable (:aggregate/status decision)))
      (is (some #(re-find #"inspected no retained artifacts" %)
                (:problems decision)))))
  (testing "a malformed lane result is retained as unavailable evidence"
    (let [results (assoc (clean-results)
                         1 (assoc (lane-result :tests)
                                  :coverage/status :probably-complete))
          decision (evidence/aggregate-verdict (request results))]
      (is (= :evidence-unavailable (:aggregate/status decision)))
      (is (some #(re-find #"closed schema" %) (:problems decision)))
      (is (law/valid-aggregate-decision? decision)))))

(deftest missing-duplicate-and-stale-lanes-fail-closed
  (testing "a required lane must be present"
    (let [decision (evidence/aggregate-verdict
                    (request (mapv lane-result [:contracts :tests])))]
      (is (= :evidence-unavailable (:aggregate/status decision)))
      (is (= [:ci-provenance] (:missing/lanes decision)))))
  (testing "duplicate lane results are ambiguous rather than votes"
    (let [decision (evidence/aggregate-verdict
                    (request (conj (clean-results)
                                   (lane-result :contracts))))]
      (is (= :evidence-unavailable (:aggregate/status decision)))
      (is (some #(re-find #"duplicated" %) (:problems decision)))))
  (testing "a result for another exact head is stale input"
    (let [stale-result (assoc-in (lane-result :tests)
                                 [:review/target :head]
                                 "different-head")
          results (assoc (clean-results) 1 stale-result)
          decision (evidence/aggregate-verdict (request results))]
      (is (= :evidence-unavailable (:aggregate/status decision)))
      (is (some #(re-find #"does not match" %) (:problems decision))))))

(deftest contradictions-remain-visible
  (let [contradicted
        {:finding/id "finding:tests:contradiction"
         :finding/status :contradicted
         :finding/disposition :blocking
         :finding/severity :high
         :finding/claim "Two trusted artifacts disagree about the executed tree."
         :finding/evidence [(artifact :tests)]
         :finding/contradicts ["finding:tests:pass"]}
        results (assoc (clean-results)
                       1 (lane-result :tests [contradicted]))
        decision (evidence/aggregate-verdict (request results))]
    (is (= :evidence-conflicted (:aggregate/status decision)))
    (is (= 1 (get-in decision [:finding/counts :contradicted])))
    (is (some #(re-find #"contradiction" %) (:problems decision)))))

(deftest aggregation-is-order-invariant-and-deduplicates-identical-findings
  (let [results [(lane-result :tests [advisory-finding])
                 (lane-result :ci-provenance)
                 (lane-result :contracts [advisory-finding])]
        forward (evidence/aggregate-verdict (request results))
        reversed (evidence/aggregate-verdict (request (vec (reverse results))))]
    (is (= forward reversed))
    (is (= :advisory (:aggregate/status forward)))
    (is (= 1 (count (:findings forward))))
    (is (= 1 (get-in forward [:finding/counts :advisory])))))

(deftest malformed-outer-request-is-unavailable-not-an-exception
  (let [decision (evidence/aggregate-verdict
                  (dissoc (request (clean-results)) :review/target))]
    (is (= :evidence-unavailable (:aggregate/status decision)))
    (is (= ["aggregate request failed its closed schema"]
           (:problems decision)))
    (is (law/valid-aggregate-decision? decision))))
