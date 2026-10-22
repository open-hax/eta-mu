;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.shape.review-collection
  "Pure normalization from GitHub-shaped maps to native observation maps."
  (:require [eta-mu.law.review-collection :as law]))

(defn repository [raw]
  (let [value {:id (:id raw) :full-name (:full_name raw) :public? (not (:private raw))}]
    (when (and (law/raw-repository? raw) (law/native-repository? value)) value)))

(defn run [raw workflow]
  {:id (:id raw) :attempt (:run_attempt raw)
   :repository-id (get-in raw [:repository :id])
   :workflow-id (or (:workflow_id raw) (:workflow-id raw))
   :workflow-path (:path workflow) :head-sha (or (:head_sha raw) (:head-sha raw))
   :event-sha nil :workflow-source-sha nil
   :referenced-workflows (or (:referenced_workflows raw) (:referenced-workflows raw))
   :raw raw})

(defn artifact [raw run-id expires-at-ms]
  (let [digest (:digest raw)
        value {:id (:id raw) :run-id run-id :size-bytes (:size_in_bytes raw)
               :expires-at-ms expires-at-ms
               :sha256 (when (and (string? digest) (re-matches #"sha256:[0-9a-f]{64}" digest))
                         (subs digest 7))
               :expired? (:expired raw)}]
    (when (law/native-artifact? value) value)))

(defn pull-file [raw]
  (when (law/raw-pull-file? raw)
    (cond-> {:filename (:filename raw)
             :status (keyword (:status raw))
             :patch-state (cond (not (contains? raw :patch)) :missing
                                (nil? (:patch raw)) :null
                                :else :available)}
      (contains? raw :previous_filename) (assoc :previous-filename (:previous_filename raw))
      (string? (:patch raw)) (assoc :patch (:patch raw)))))

(defn pages [count next?]
  {:pages count :received count :next? next?})
