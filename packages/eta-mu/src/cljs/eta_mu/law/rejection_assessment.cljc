;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.law.rejection-assessment
  "Pure validation of the local rejection-assessment submission carrier.")

(defn admissible-submission?
  "APPROVE with an actual empty comments vector is the local carrier contract.
   This grants no native review approval or rejection agreement; the canonical
   rejection publication API separately owns substantive body admissibility."
  [submission]
  (and (= "APPROVE" (:event submission))
       (vector? (:comments submission))
       (empty? (:comments submission))))
