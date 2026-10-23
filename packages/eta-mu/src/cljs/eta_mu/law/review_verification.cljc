;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.law.review-verification
  "Local immutable-code capability contracts, not native custody or adoption."
  (:require [eta-mu.law.review-publication :as publication]))

(def descriptor
  {:muse-source "c1369c223cf3c57e3e31934a6d746bfcdfe73f5a"
   :eta-source "6a796582d74f93c1a1f18ca5c89eb3a0b19445eb"
   :verifier-sha256 "d9fea235fddec9581ba1be959e596f32b82588f78cef5fd76d55f04d24b91030"
   :build-descriptor-sha256 "1fd734d89c4b18dce24a6a87c6024561382b52531285b020fded67e2410d6e8a"})
(def publisher-sha256 "bb75bc57d8eeaf7edbd77f34e9a4da2d319617d06809f9aadfb0d94e7ae6c2c9")
(def strict-source-files
  ["muse-src/eta_mu/shape/git_diff_path.cljc" "muse-src/eta_mu/domain/review.cljc"
   "muse-src/eta_mu/law/review_invocation.cljc" "muse-src/eta_mu/extern/review_invocation.cljs"])
(def discovery-files
  ["model-discovery.json" "model-version.stdout" "model-version.stderr"
   "model-catalog.stdout" "model-catalog.stderr" "model-catalog-source.json"
   "model-catalog-source-response.json"])
(def mandatory-members
  (into ["basehead.diff" "input-manifest.json" "input-verification.json" "recovery.json"
         "submission.json" "metadata/exposed-tools.txt"] discovery-files))
(defn bounds? [x]
  (and (publication/positive? (:operation-ms x))
       (<= (:operation-ms x) 30000)
       (publication/positive? (:observation-max-age-ms x))
       (<= (:observation-max-age-ms x) publication/maximum-observation-age-ms)))
(defn request? [x]
  (and (map? x) (every? #{:archive :bounds :reconstruct! :reconstruction-input} (keys x))
       (map? (:archive x)) (bounds? (:bounds x)) (fn? (:reconstruct! x))))
(defn canonical-positive-decimal? [x]
  (and (string? x) (boolean (re-matches #"[1-9][0-9]*" x))))
(defn producer-attempt-within? [producer review]
  ;; Compare the producer's canonical decimal spelling without parsing an
  ;; untrusted integer or losing precision on either portable host.
  (and (canonical-positive-decimal? producer) (publication/positive? review)
       (let [limit (str review)]
         (or (< (count producer) (count limit))
             (and (= (count producer) (count limit))
                  (not (pos? (compare producer limit))))))))
(defn- provenance? [x]
  (and (map? x)
       (= #{:repository :pull_request :run_id :run_attempt :workflow_sha :workflow_ref}
          (set (keys x)))
       (string? (:repository x))
       (boolean (re-matches #"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+" (:repository x)))
       (every? #(canonical-positive-decimal? (get x %)) [:pull_request :run_id :run_attempt])
       (publication/commit? (:workflow_sha x)) (publication/text? (:workflow_ref x))))
(defn input-proof? [x]
  (and (map? x)
       (= #{:schema :input_verified :verification_stage :base_sha :head_sha :diff_base_sha
            :full_diff :manifest_sha256 :provenance :evidence_artifact_name :verification_provenance}
          (set (keys x)))
       (= "open-hax.review-input-verification/v1" (:schema x))
       (true? (:input_verified x))
       (= "fresh-review-job-before-model" (:verification_stage x))
       (every? #(publication/commit? (get x %)) [:base_sha :head_sha :diff_base_sha])
       (map? (:full_diff x))
       (= #{:path :bytes :sha256} (set (keys (:full_diff x))))
       (= "basehead.diff" (get-in x [:full_diff :path]))
       (publication/natural? (get-in x [:full_diff :bytes]))
       (publication/digest? (get-in x [:full_diff :sha256]))
       (publication/digest? (:manifest_sha256 x))
       (provenance? (:provenance x)) (provenance? (:verification_provenance x))
       (publication/text? (:evidence_artifact_name x))))
(defn reconstruction? [x]
  (and (= :reconstructed (:status x)) (empty? (:missing x)) (empty? (:unsupported x))
       (publication/natural? (:observed-at-ms x))
       (publication/sources? (:sources x)) (publication/tuple? (:tuple x))
       (publication/positive? (get-in x [:run :id]))
       (publication/positive? (get-in x [:run :attempt]))
       (publication/text? (:full-diff-base64 x)) (map? (:manifest x))
       (vector? (:tools x)) (seq (:tools x)) (every? publication/text? (:tools x))
       (= (count (:tools x)) (count (distinct (:tools x))))
       (= "1.18.18" (:expected-opencode-version x))
       (input-proof? (:input-verification x))
       (vector? (:changed-files x))
       (every? #(and (publication/text? (:filename %)) (string? (:patch %))) (:changed-files x))))
