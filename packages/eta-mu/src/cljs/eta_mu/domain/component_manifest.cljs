(ns eta-mu.domain.component-manifest
  "Pure composition of eta-mu and package-owned protocol metadata."
  (:require [eta-mu.fork-tax.law.handoff :as fork-tax]
            [eta-mu.receipt-river.law.receipt :as receipt-river]
            [eta-mu.session-mycology.law.reflection :as session-mycology]))

(def eta-mu-version "1.1.1")

(def manifest
  {:eta-mu/version eta-mu-version
   :components
   {receipt-river/package-name receipt-river/package-version
    session-mycology/package-name session-mycology/package-version
    fork-tax/package-name fork-tax/package-version}
   :schemas
   (merge receipt-river/current-versions
          session-mycology/current-versions
          fork-tax/current-versions)})
