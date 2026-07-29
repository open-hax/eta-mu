(ns eta-mu.fork-tax.api
  "Authoritative programmatic API for Fork Tax."
  (:require [eta-mu.fork-tax.domain.event :as event]
            [eta-mu.fork-tax.domain.handoff :as handoff]
            [eta-mu.fork-tax.generated.registry :as registry]))

(def schema-registry registry/schemas)
(def current-schemas registry/current-versions)

(defn build-event [metadata payload]
  (event/build-event metadata payload))

(defn partition-status [entries owned-paths]
  (handoff/partition-status entries owned-paths))
