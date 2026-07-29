(ns eta-mu.session-mycology.api
  "Authoritative programmatic API for Session Mycology."
  (:require [eta-mu.session-mycology.domain.event :as event]
            [eta-mu.session-mycology.generated.registry :as registry]))

(def schema-registry registry/schemas)
(def current-schemas registry/current-versions)

(defn build-event [metadata payload]
  (event/build-event metadata payload))
