(ns eta-mu.law.evidence-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.law.evidence :as law]))

(def ^:private target
  {:repository/id 654321
   :pull-request/object-id "PR_kwDOexample"
   :head "0123456789abcdef"
   :snapshot/hash "sha256:snapshot"
   :dependency-closure/hash "sha256:closure"})

(def ^:private artifact
  {:artifact/kind :diff
   :artifact/hash "sha256:diff"
   :artifact/location {:path "src/example.cljs"}})

(def ^:private finding
  {:finding/id "finding:contract:1"
   :finding/status :confirmed
   :finding/disposition :blocking
   :finding/severity :high
   :finding/claim "The resource cannot be instantiated."
   :finding/path "src/example.cljs"
   :finding/line 42
   :finding/failure-trace "Malli rejected the unresolved schema."
   :finding/evidence [artifact]})

(def ^:private lane-result
  {:schema/version 1
   :evidence/lane :contracts
   :evidence/lane-revision "sha256:contracts-v1"
   :evidence/producer
   {:actor/binding "axxium:binding:contracts-reviewer"
    :attestation/hash "sha256:attestation"}
   :review/target target
   :review/episode "axxium:episode:review-1"
   :coverage/status :complete
   :coverage/inspected [artifact]
   :findings [finding]})

(deftest lane-result-contract-test
  (testing "one exact-head result with retained finding evidence validates"
    (is (law/valid-lane-result? lane-result)))
  (testing "the closed contract rejects unknown fields"
    (is (not (law/valid-lane-result?
              (assoc lane-result :ambient/github-token "secret")))))
  (testing "identity, revision, coverage, and evidence are required"
    (is (not (law/valid-lane-result?
              (dissoc lane-result :review/episode))))
    (is (not (law/valid-lane-result?
              (dissoc lane-result :evidence/lane-revision))))
    (is (not (law/valid-lane-result?
              (dissoc lane-result :coverage/status))))
    (is (not (law/valid-lane-result?
              (update lane-result :findings
                      #(mapv (fn [item]
                               (dissoc item :finding/evidence))
                             %))))))
  (testing "diagnostics survive a malformed lane"
    (is (some? (law/explain-lane-result
                (assoc lane-result :coverage/status :probably-complete))))))

(deftest aggregate-contract-test
  (let [request {:schema/version 1
                 :required/lanes [:contracts :tests :ci-provenance]
                 :review/target target
                 :review/episode "axxium:episode:review-1"
                 :lane/results [lane-result]}]
    (testing "the outer request accepts independently validated lane values"
      (is (law/valid-aggregate-request? request)))
    (testing "the request itself remains closed and exact-head bound"
      (is (not (law/valid-aggregate-request?
                (assoc request :publication/token "secret"))))
      (is (not (law/valid-aggregate-request?
                (update request :review/target dissoc :head)))))))
