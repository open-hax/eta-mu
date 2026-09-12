(ns axxium.domain.identity-private
  "Pure private SDK reference replacement and scoped reclamation decisions."
  (:require [axxium.domain.identity :as identity]
            [axxium.law.identity :as law]))

(defn replace-transition
  "Replace one SDK credential reference, returning only the superseded reference."
  [state key reference]
  (law/require! (and (string? key) (seq key) (string? reference) (seq reference))
                :invalid-private-state "Private state requires explicit key and reference")
  {:operation :oauth-private-state
   :changes [(identity/put :credentials key {:private-ref reference})]
   :result {:retired-reference (get-in state [:credentials key :private-ref])}})

(defn delete-transition
  "Remove one SDK credential while retaining its reference for post-commit cleanup."
  [state key]
  {:operation :oauth-private-state-deleted
   :changes (when (get-in state [:credentials key]) [(identity/remove-entry :credentials key)])
   :result {:retired-reference (get-in state [:credentials key :private-ref])}})

(defn reclaimable-references
  "Return only supplied references absent from every current credential and challenge."
  [state candidates]
  (let [retained (into #{} (keep :private-ref)
                       (concat (vals (:credentials state)) (vals (:challenges state))))]
    (into [] (comp (filter string?) (distinct) (remove retained)) candidates)))
