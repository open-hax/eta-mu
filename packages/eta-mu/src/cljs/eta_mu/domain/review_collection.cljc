;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.domain.review-collection
  "Pure enrollment, completeness, and tuple decisions for native collection."
  (:require [eta-mu.law.review-publication :as publication]
            [eta-mu.law.review-collection :as law]))

(defn enrollment [registry target-id mode event fixture-id]
  (cond
    (not (publication/registry? registry)) :registry
    (not (law/registry-target registry target-id)) :target
    (and (= mode :ordinary) (contains? #{:schedule :workflow-run} event)
         (true? (:enabled? (law/registry-target registry target-id)))
         (false? (:fixture? (law/registry-target registry target-id)))
         (nil? fixture-id)) :accepted
    (and (= mode :qualification-only) (= event :workflow-dispatch)
         (true? (:fixture? (law/registry-target registry target-id)))
         (= fixture-id target-id)) :accepted
    :else :enrollment))

(defn stable-observation? [first-pass second-pass] (= first-pass second-pass))

(defn tuple-decision [tuple]
  (cond
    (= :unknown (:mergeable? tuple)) :pending
    (not (true? (:mergeable? tuple))) :mergeability
    (not (and (= :open (:state tuple)) (false? (:draft? tuple)))) :pull-state
    (not (and (= [(:base-sha tuple) (:head-sha tuple)] (:merge-parents tuple))
              (= (:head-tree tuple) (:merge-tree tuple))
              (true? (:base-ancestor? tuple)))) :integration-tuple
    :else :accepted))

(defn run-association [run pr-number tuple]
  (let [associations (:pull-requests run)
        matching (filter #(= pr-number (:number %)) associations)]
    (cond
      (empty? associations) :unknown
      (not= 1 (count matching)) :mismatch
      (not= (:head-sha tuple) (get-in (first matching) [:head :sha])) :mismatch
      (not= (:base-sha tuple) (get-in (first matching) [:base :sha])) :mismatch
      (not= (:head-sha tuple) (:head-sha run)) :mismatch
      :else :verified)))
