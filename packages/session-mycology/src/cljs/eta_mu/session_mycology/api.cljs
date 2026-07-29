(ns eta-mu.session-mycology.api
  "Authoritative programmatic API for Session Mycology."
  (:require [eta-mu.session-mycology.domain.event :as event]
            [eta-mu.session-mycology.law.reflection :as law]))

(def package-name law/package-name)
(def package-version law/package-version)
(def schema-documents law/schema-documents)
(def schema-registry law/schemas)
(def current-schemas law/current-versions)

(defn build-event [metadata payload]
  (event/build-event metadata payload))
