;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.law.positive-cohort-assessment
  "Pure local submission carrier. Canonical cohort law owns body admission.")

(defn admissible-submission? [submission]
  (and (= "APPROVE" (:event submission))
       (vector? (:comments submission))
       (empty? (:comments submission))))
