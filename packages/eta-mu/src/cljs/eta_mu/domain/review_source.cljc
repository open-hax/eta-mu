;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.domain.review-source
  "Pure binding of independently reconstructed Git bytes to untrusted archive claims."
  (:require [eta-mu.law.review-source :as law]
            [eta-mu.law.review-publication :as publication]))

(def preview-limit-bytes 300000)

(defn- preview-description [bytes]
  {:path "pr.diff" :limit_bytes preview-limit-bytes :truncated (> bytes preview-limit-bytes)})

(defn expected-manifest [request source]
  (let [tuple (:tuple request)
        native (:native-context request)
        full-diff (:full-diff source)
        provenance {:repository (:repository native)
                    :pull_request (str (:pr-number native))
                    :run_id (str (:run-id native))
                    :run_attempt (str (:run-attempt native))}]
    {:schema "open-hax.review-input/v1"
     :base_sha (:base-sha tuple) :head_sha (:head-sha tuple)
     :diff_base_sha (:diff-base-sha source)
     :full_diff full-diff
     :preview (preview-description (:bytes full-diff))
     :provenance provenance}))

(defn- supported-manifest [manifest]
  (select-keys manifest [:schema :base_sha :head_sha :diff_base_sha :full_diff :preview]))

(defn- supported-provenance [manifest]
  (select-keys (:provenance manifest) [:repository :pull_request :run_id :run_attempt]))

(defn source-matches? [request source expected]
  (let [candidate (:manifest request)]
    (and (law/manifest? candidate)
         (= (supported-manifest expected) (supported-manifest candidate))
         (= (:provenance expected) (supported-provenance candidate))
         (= (:full-diff-base64 source) (get-in request [:archive-diff :base64]))
         (= (:preview-base64 source) (get-in request [:archive-preview :base64])))))

(defn missing-custody [request]
  (let [tuple (:tuple request)
        native (:native-context request)]
    (cond-> []
      (not (law/tuple? tuple)) (conj :native-tuple)
      (not (publication/commit? (:event-sha tuple))) (conj :original-event-sha)
      (not (and (publication/commit? (:workflow-sha native))
                (publication/text? (:workflow-ref native))))
      (conj :caller-workflow-source-custody))))

(defn observation [request source]
  (let [manifest (expected-manifest request source)
        missing (missing-custody request)]
    (when-not (source-matches? request source manifest)
      (throw (ex-info "Archive review input differs from reconstructed Git bytes"
                      {:code :source-manifest-mismatch})))
    {:status :observed :complete? false :missing missing
     :unsupported [:tools :changed-files :input-verification]
     :diff-base-sha (:diff-base-sha source)
     :full-diff-base64 (:full-diff-base64 source)
     :full-diff (:full-diff source) :preview-base64 (:preview-base64 source)
     :manifest manifest :tuple (:tuple request)
     :native-provenance (:native-provenance source)
     :git-provenance (:git-provenance source)}))
