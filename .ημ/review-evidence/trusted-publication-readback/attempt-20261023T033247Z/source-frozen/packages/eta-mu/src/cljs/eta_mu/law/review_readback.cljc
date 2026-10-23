;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.law.review-readback
  "Portable native readback shapes. Shape never authenticates a publisher."
  (:require [eta-mu.law.review-publication :as publication]))

(def tuple-keys [:pr-number :state :draft? :base-sha :head-sha :merge-sha
                 :merge-parents :head-tree :merge-tree :base-ancestor? :mergeable?])

(defn raw-review? [x]
  (and (map? x) (publication/positive? (:id x))))

(defn raw-comment? [x]
  (and (map? x) (publication/positive? (:id x))))

(defn raw-status? [x]
  (and (map? x) (publication/positive? (:id x)) (string? (:context x))
       (contains? #{"pending" "success" "failure" "error"} (:state x))
       (string? (:created_at x))))

(defn unique-rows? [rows]
  (= (count rows) (count (distinct (map :id rows)))))

(defn native-time? [now value]
  (and (publication/natural? now) (publication/natural? value) (<= value now)))

(defn same-tuple? [expected observed]
  (= (select-keys expected tuple-keys) (select-keys observed tuple-keys)))
