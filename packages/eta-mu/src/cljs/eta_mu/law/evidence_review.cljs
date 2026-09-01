(ns eta-mu.law.evidence-review
  "Closed Malli contracts for exact-head evidence lanes and deterministic verdicts.

  These schemas describe admitted review data. They do not execute agents, read
  artifacts, or publish GitHub outcomes."
  (:require [malli.core :as m]))

(def non-empty-string-schema
  [:string {:min 1}])

(def sha256-schema
  [:re #"^sha256:[0-9a-f]{64}$"])

(def git-sha-schema
  [:re #"^[0-9a-f]{40}$"])

(def revision-schema
  [:or git-sha-schema sha256-schema])

(def coverage-status-schema
  [:enum :complete :partial :blocked :unavailable :timed-out :failed :stale])

(def aggregate-lane-status-schema
  [:enum :complete :partial :blocked :unavailable :timed-out :failed :stale
   :missing :rejected :conflicted])

(def artifact-location-schema
  [:map {:closed true}
   [:path {:optional true} non-empty-string-schema]
   [:line-start {:optional true} [:int {:min 1}]]
   [:line-end {:optional true} [:int {:min 1}]]
   [:log-start {:optional true} [:int {:min 1}]]
   [:log-end {:optional true} [:int {:min 1}]]])

(def artifact-ref-schema
  [:map {:closed true}
   [:artifact/kind :keyword]
   [:artifact/hash sha256-schema]
   [:artifact/location {:optional true} artifact-location-schema]])

(def producer-schema
  [:map {:closed true}
   [:producer/actor-binding non-empty-string-schema]
   [:producer/profile-revision revision-schema]
   [:producer/workflow-revision revision-schema]
   [:producer/attestation-hash sha256-schema]])

(def review-snapshot-schema
  [:map {:closed true}
   [:schema/version [:= 1]]
   [:review/repository-id [:int {:min 1}]]
   [:review/pull-request [:int {:min 1}]]
   [:review/head git-sha-schema]
   [:review/snapshot-hash sha256-schema]
   [:review/dependency-closure-hash sha256-schema]
   [:review/episode non-empty-string-schema]])

(def finding-schema
  [:map {:closed true}
   [:finding/id sha256-schema]
   [:finding/status [:enum :confirmed :contradicted :unresolved :rejected]]
   [:finding/disposition [:enum :blocking :advisory]]
   [:finding/severity [:enum :critical :high :medium :low :info]]
   [:finding/scope [:enum :changed-line :repository-invariant]]
   [:finding/path {:optional true} non-empty-string-schema]
   [:finding/line {:optional true} [:int {:min 1}]]
   [:finding/invariant {:optional true} non-empty-string-schema]
   [:finding/claim non-empty-string-schema]
   [:finding/failure-trace {:optional true} non-empty-string-schema]
   [:finding/evidence [:vector artifact-ref-schema]]
   [:finding/confidence number?]])

(def lane-result-schema
  [:map {:closed true}
   [:schema/version [:= 1]]
   [:evidence/lane :keyword]
   [:evidence/lane-revision revision-schema]
   [:evidence/producer producer-schema]
   [:review/repository-id [:int {:min 1}]]
   [:review/pull-request [:int {:min 1}]]
   [:review/head git-sha-schema]
   [:review/snapshot-hash sha256-schema]
   [:review/dependency-closure-hash sha256-schema]
   [:review/episode non-empty-string-schema]
   [:coverage/status coverage-status-schema]
   [:coverage/inspected [:vector artifact-ref-schema]]
   [:coverage/reason {:optional true} :keyword]
   [:coverage/note {:optional true} non-empty-string-schema]
   [:findings [:vector finding-schema]]])

(def lane-status-schema
  [:map {:closed true}
   [:evidence/lane :keyword]
   [:coverage/status aggregate-lane-status-schema]])

(def rejection-schema
  [:map {:closed true}
   [:rejection/reason :keyword]
   [:evidence/lane {:optional true} :keyword]])

(def aggregate-verdict-schema
  [:map {:closed true}
   [:schema/version [:= 1]]
   [:review/repository-id [:int {:min 1}]]
   [:review/pull-request [:int {:min 1}]]
   [:review/head git-sha-schema]
   [:review/snapshot-hash sha256-schema]
   [:review/dependency-closure-hash sha256-schema]
   [:review/episode non-empty-string-schema]
   [:aggregate/conclusion [:enum :success :failure :blocked]]
   [:aggregate/reasons [:vector :keyword]]
   [:aggregate/required-lanes [:set :keyword]]
   [:aggregate/lane-statuses [:vector lane-status-schema]]
   [:aggregate/rejections [:vector rejection-schema]]
   [:aggregate/findings [:vector finding-schema]]
   [:aggregate/confirmed-blockers [:vector finding-schema]]
   [:aggregate/advisories [:vector finding-schema]]
   [:aggregate/contradictions [:vector finding-schema]]])

(defn valid-review-snapshot?
  [value]
  (m/validate review-snapshot-schema value))

(defn explain-review-snapshot
  [value]
  (m/explain review-snapshot-schema value))

(defn valid-lane-result-shape?
  [value]
  (m/validate lane-result-schema value))

(defn explain-lane-result
  [value]
  (m/explain lane-result-schema value))

(defn valid-aggregate-verdict?
  [value]
  (m/validate aggregate-verdict-schema value))

(defn explain-aggregate-verdict
  [value]
  (m/explain aggregate-verdict-schema value))
