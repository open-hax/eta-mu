;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.domain.review-readback
  "Compare complete native observations using existing publication semantics.
  Matching data never supplies an authenticated installation association."
  (:require [eta-mu.domain.review-publication :as publication]
            [eta-mu.law.review-readback :as law]))

(defn assess [now binding intent native]
  (let [review (:review native) rows (get-in native [:history :statuses])
        expected-publisher (:publisher binding) expected-actor (:actor expected-publisher)
        review-content? (and (publication/review-content-bound? binding intent review)
                             (= expected-actor (:actor review))
                             (= (:receipt-url intent) (:receipt-url review)))
        history-content? (every? #(and (publication/status-content-bound? now binding %)
                                      (= expected-actor (:actor %))) rows)
        identities (concat [(:identity review)]
                           (map :identity (:comments review))
                           (map :identity rows))
        conflicting? (some #(and (= :observed (:app-state %))
                                  (not= expected-publisher (:publisher %))) identities)
        reason (cond
                 (not (law/same-tuple? (:tuple binding) (get-in native [:tuple :before]))) :tuple-drift
                 (not review-content?) :native-review-readback
                 (not history-content?) :status-history
                 conflicting? :publisher-identity
                 :else :authentication-not-established)]
    {:status (if (= :authentication-not-established reason) :observed :refused)
     :reason reason :qualification :unsupported :effects []
     :comparison {:review-content (if review-content? :matched :mismatch)
                  :status-content (if history-content? :matched :mismatch)
                  :publisher-authentication :unsupported}
     :unsupported [:publisher-installation-association :original-event-custody]}))
