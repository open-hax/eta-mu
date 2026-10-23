;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.domain.review-verification
  "Complete reconstruction is a required port obligation, never an origin flag."
  (:require [eta-mu.law.review-verification :as law]))
(defn refuse [code] {:status :refused :code code :effects []})
(defn reconstruction-error [expected artifact now bounds]
  (let [source (:sources expected) tuple (:tuple expected)
        manifest (:manifest expected) provenance (:provenance manifest)
        proof (:input-verification expected) review-attempt (:attempt artifact)]
    (cond
      (>= now (:expires-at-ms artifact)) :archive-native-binding
      (not (law/reconstruction? expected)) :native-reconstruction-incomplete
      (or (> (:observed-at-ms expected) now)
          (> (- now (:observed-at-ms expected)) (:observation-max-age-ms bounds))) :native-observation-stale
      (not= (:eta source) (:eta-source law/descriptor)) :runtime-source
      (not= (:muse source) (:muse-source law/descriptor)) :runtime-source
      (not= (:verifier source) (:verifier-sha256 law/descriptor)) :runtime-source
      (not= (:build source) (:build-descriptor-sha256 law/descriptor)) :runtime-build
      (not= [(:id (:run expected)) (:attempt (:run expected))]
            [(:run-id artifact) (:attempt artifact)]) :native-artifact-binding
      (not= [(:base-sha tuple) (:head-sha tuple)] [(:base_sha manifest) (:head_sha manifest)]) :native-input-binding
      (not= (:event-sha tuple) (:caller source) (:workflow_sha provenance)) :native-source-binding
      (not (and (= [(str (:pr-number tuple)) (str (:run-id artifact))]
                    [(:pull_request provenance) (:run_id provenance)])
                (law/producer-attempt-within? (:run_attempt provenance) review-attempt)
                (= provenance (:provenance proof))
                (= (assoc provenance :run_attempt (str review-attempt)) (:verification_provenance proof))
                (= (select-keys manifest [:base_sha :head_sha :diff_base_sha :full_diff])
                   (select-keys proof [:base_sha :head_sha :diff_base_sha :full_diff]))
                (= (str "review-evidence-" (:pr-number tuple) "-" (:run-id artifact) "-"
                        (:run_attempt provenance))
                   (:evidence_artifact_name proof)))) :native-input-binding
      :else nil)))
