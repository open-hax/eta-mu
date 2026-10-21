;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.infra.review-source
  "Trusted composition for source bytes; observation is never publication qualification."
  (:require [eta-mu.law.review-source :as law]
            [eta-mu.shape.review-source :as shape]
            [eta-mu.domain.review-source :as domain]
            [eta-mu.extern.review-source :as host]))

(defn- refused [code]
  {:status :refused :complete? false :code code})

(defn ^:async reconstruct!
  "Reconstruct complete raw diff bytes from a trusted Git object store.

  `:object-store` and `:bounds` are trusted installation inputs; tuple and
  native-context are supplied by trusted composition. Manifest/diff members
  are untrusted archive comparisons. Native facts are never inferred from the
  archive or a claimed provenance boolean. The current collector lacks original
  event and caller-workflow source custody, so this result cannot qualify a
  review for verification or publication."
  [request]
  (if-not (law/request? request)
    (refused :source-request)
    (if-not (law/topology? (:tuple request))
      (refused :source-topology)
      (try
        (let [raw (await (host/reconstruct! request))
              source (shape/observation raw)]
          (domain/observation request source))
        (catch :default e
          (assoc (refused (or (:code (ex-data e)) :source-host))
                 :details (dissoc (ex-data e) :code)))))))
