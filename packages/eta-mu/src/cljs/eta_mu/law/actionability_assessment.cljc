;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.law.actionability-assessment
  "Pure actionability submission admissibility; no transport or publication effects.")

(defn admissible-submission?
  "Preserve the existing empty-comments carrier predicate without an event restriction."
  [invocation]
  (and (vector? (get-in invocation [:submission :comments]))
                         (empty? (get-in invocation [:submission :comments]))))
