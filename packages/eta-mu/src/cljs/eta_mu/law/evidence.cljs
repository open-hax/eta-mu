(ns eta-mu.law.evidence
  "Closed Malli contracts for exact-head evidence lanes and their deterministic
   aggregate decision.

   These schemas describe admissible data only. They do not execute reviewers,
   read artifacts, or publish provider outcomes."
  (:require [malli.core :as m]))

(def non-empty-string
  [:string {:min 1}])

(def artifact-ref-schema
  [:map {:closed true}
   [:artifact/kind :keyword]
   [:artifact/hash non-empty-string]
   [:artifact/location {:optional true} [:map-of :keyword :any]]])

(def review-target-schema
  [:map {:closed true}
   [:repository/id [:or :int non-empty-string]]
   [:pull-request/object-id non-empty-string]
   [:head non-empty-string]
   [:snapshot/hash non-empty-string]
   [:dependency-closure/hash non-empty-string]])

(def producer-schema
  [:map {:closed true}
   [:actor/binding non-empty-string]
   [:attestation/hash non-empty-string]])

(def finding-schema
  [:map {:closed true}
   [:finding/id non-empty-string]
   [:finding/status [:enum :confirmed :contradicted :retracted]]
   [:finding/disposition [:enum :blocking :advisory]]
   [:finding/severity [:enum :critical :high :medium :low :info]]
   [:finding/claim non-empty-string]
   [:finding/path {:optional true} non-empty-string]
   [:finding/line {:optional true} :int]
   [:finding/failure-trace {:optional true} non-empty-string]
   [:finding/evidence [:vector artifact-ref-schema]]
   [:finding/contradicts {:optional true} [:vector non-empty-string]]])

(def lane-result-schema
  [:map {:closed true}
   [:schema/version [:= 1]]
   [:evidence/lane :keyword]
   [:evidence/lane-revision non-empty-string]
   [:evidence/producer producer-schema]
   [:review/target review-target-schema]
   [:review/episode non-empty-string]
   [:coverage/status
    [:enum :complete :partial :blocked :unavailable :timed-out :stale]]
   [:coverage/inspected [:vector artifact-ref-schema]]
   [:findings [:vector finding-schema]]])

(def aggregate-request-schema
  "The outer request is closed, while lane values are validated independently.
   This lets the fold report one malformed lane as unavailable evidence without
   losing the otherwise valid exact-head target."
  [:map {:closed true}
   [:schema/version [:= 1]]
   [:required/lanes [:vector {:min 1} :keyword]]
   [:review/target review-target-schema]
   [:review/episode non-empty-string]
   [:lane/results [:vector :any]]])

(def finding-counts-schema
  [:map {:closed true}
   [:blocking :int]
   [:advisory :int]
   [:contradicted :int]])

(def aggregate-decision-schema
  [:map {:closed true}
   [:schema/version [:= 1]]
   [:aggregate/status
    [:enum :approved
     :advisory
     :evidence-blocked
     :evidence-conflicted
     :evidence-unavailable]]
   [:review/target {:optional true} review-target-schema]
   [:review/episode {:optional true} non-empty-string]
   [:required/lanes [:vector :keyword]]
   [:complete/lanes [:vector :keyword]]
   [:missing/lanes [:vector :keyword]]
   [:finding/counts finding-counts-schema]
   [:findings [:vector finding-schema]]
   [:problems [:vector :string]]])

(defn valid-artifact-ref? [x]
  (m/validate artifact-ref-schema x))

(defn valid-finding? [x]
  (m/validate finding-schema x))

(defn valid-lane-result? [x]
  (m/validate lane-result-schema x))

(defn explain-lane-result [x]
  (m/explain lane-result-schema x))

(defn valid-aggregate-request? [x]
  (m/validate aggregate-request-schema x))

(defn explain-aggregate-request [x]
  (m/explain aggregate-request-schema x))

(defn valid-aggregate-decision? [x]
  (m/validate aggregate-decision-schema x))
