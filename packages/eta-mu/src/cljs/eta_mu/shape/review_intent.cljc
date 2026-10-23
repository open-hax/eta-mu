;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.shape.review-intent
  "Portable identity and catalog shapes for the Clio publication stream."
  (:require [clio.shape.canonical :as canonical]
            [eta-mu.law.review-intent :as law]
            [clojure.string :as str]))

(def event-type :eta-mu.review-intent/transition)

(defn lock-stream [lock-key]
  (when (law/lock-key? lock-key)
    (str "review-publication-lock/" (canonical/canonical-edn lock-key))))

(def event-data-schema
  [:map {:closed true}
    [:lock-key :any]
    [:intent-key :any]
    [:binding :any]
    [:state [:enum :reserved :post-started :post-unknown :ambiguous-absence :observed]]
    [:intent-version [:int {:min 0}]]
    [:owner [:maybe :string]]
    [:claim-id [:maybe :string]]])

(defn valid-stream? [key stream]
  (and (law/lock-key? key) (string? stream) (= stream (lock-stream key))
       (not (str/blank? stream))))
