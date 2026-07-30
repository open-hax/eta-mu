(ns eta-mu.fork-tax.api
  "Authoritative programmatic API for Fork Tax."
  (:require [eta-mu.fork-tax.domain.event :as event]
            [eta-mu.fork-tax.domain.handoff :as handoff]
            [eta-mu.fork-tax.law.handoff :as law]))

(def package-name law/package-name)
(def package-version law/package-version)
(def schema-documents law/schema-documents)
(def schema-registry law/schemas)
(def current-schemas law/current-versions)

(defn build-event [metadata payload]
  (event/build-event metadata payload))

(defn partition-status [entries owned-paths]
  (handoff/partition-status entries owned-paths))
