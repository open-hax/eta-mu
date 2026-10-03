(ns eta-mu.law.evidence-review-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.law.evidence-review :as law]))

(defn- digest
  [character]
  (str "sha256:" (apply str (repeat 64 character))))

(def valid-snapshot
  {:schema/version 1
   :review/repository-id 123456
   :review/pull-request 42
   :review/head (apply str (repeat 40 "a"))
   :review/snapshot-hash (digest "b")
   :review/dependency-closure-hash (digest "c")
   :review/episode "axxium:episode:review-42"})

(def artifact
  {:artifact/kind :validator-output
   :artifact/hash (digest "d")
   :artifact/location {:path "src/example.cljs"
                       :line-start 73
                       :line-end 73}})

(def finding
  {:finding/id (digest "e")
   :finding/status :confirmed
   :finding/disposition :blocking
   :finding/severity :high
   :finding/scope :changed-line
   :finding/path "src/example.cljs"
   :finding/line 73
   :finding/claim "The declared contract cannot be resolved."
   :finding/failure-trace "Validator exited 1 at src/example.cljs:73."
   :finding/evidence [artifact]
   :finding/confidence 0.97})

(def lane-result
  (merge valid-snapshot
         {:evidence/lane :contracts-schema
          :evidence/lane-revision :eta-mu.lane/contracts-schema-v1
          :evidence/producer
          {:producer/actor :eta-mu.agent/contracts-schema-reviewer
           :producer/actor-binding "axxium:binding:contracts-schema-reviewer-v1"
           :producer/profile-revision :eta-mu.profile/contracts-schema-reviewer-v1
           :producer/workflow-revision :eta-mu.workflow/github-evidence-lanes-v1
           :producer/attestation-hash (digest "3")}
          :coverage/status :complete
          :coverage/inspected [artifact]
          :findings [finding]}))

(def aggregate-verdict
  (merge valid-snapshot
         {:aggregate/catalog-id :eta-mu/github-evidence-lanes-v1
          :aggregate/catalog-version 1
          :aggregate/conclusion :failure
          :aggregate/reasons [:confirmed-blocker]
          :aggregate/required-lanes #{:contracts-schema}
          :aggregate/lane-statuses
          [{:evidence/lane :contracts-schema
            :coverage/status :complete}]
          :aggregate/rejections []
          :aggregate/findings [finding]
          :aggregate/confirmed-blockers [finding]
          :aggregate/advisories []
          :aggregate/contradictions []}))

(deftest review-snapshot-schema-test
  (testing "an exact-head snapshot with executable closure identity validates"
    (is (law/valid-review-snapshot? valid-snapshot)))
  (testing "mutable or malformed snapshot fields fail closed"
    (is (not (law/valid-review-snapshot?
              (assoc valid-snapshot :review/head "main"))))
    (is (not (law/valid-review-snapshot?
              (assoc valid-snapshot :review/dependency-closure-hash "missing"))))
    (is (not (law/valid-review-snapshot?
              (assoc valid-snapshot :review/repository-name "open-hax/eta-mu")))))
  (testing "invalid snapshots return diagnostics"
    (is (some? (law/explain-review-snapshot
                (dissoc valid-snapshot :review/snapshot-hash))))))

(deftest lane-result-schema-test
  (testing "a closed, producer-bound lane result validates"
    (is (law/valid-lane-result-shape? lane-result)))
  (testing "unknown fields and malformed identities are rejected"
    (is (not (law/valid-lane-result-shape?
              (assoc lane-result :model/said-pass true))))
    (is (not (law/valid-lane-result-shape?
              (assoc-in lane-result
                        [:evidence/producer :producer/workflow-revision]
                        "latest"))))
    (is (not (law/valid-lane-result-shape?
              (dissoc-in lane-result [:evidence/producer :producer/actor]))))
    (is (not (law/valid-lane-result-shape?
              (assoc lane-result :coverage/status :passed)))))
  (testing "invalid lane results return diagnostics"
    (is (some? (law/explain-lane-result
                (dissoc lane-result :review/episode))))))

(deftest aggregate-verdict-schema-test
  (testing "a deterministic, catalog-bound aggregate verdict validates"
    (is (law/valid-aggregate-verdict? aggregate-verdict)))
  (testing "models cannot smuggle publication authority into the verdict"
    (is (not (law/valid-aggregate-verdict?
              (assoc aggregate-verdict :github/publish? true)))))
  (testing "invalid conclusions or missing catalog identity return diagnostics"
    (is (some? (law/explain-aggregate-verdict
                (assoc aggregate-verdict :aggregate/conclusion :approve))))
    (is (some? (law/explain-aggregate-verdict
                (dissoc aggregate-verdict :aggregate/catalog-id))))))
