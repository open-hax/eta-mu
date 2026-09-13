(ns document-history.law.revision
  (:require [clio.law.event :as event]
            [clio.law.schema :as schema]
            [malli.core :as m]))

(def document-id [:re #"^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$"])
(def revision-id [:fn event/uuid-string?])
(def content [:map {:closed true}
              [:document/metadata :map]
              [:document/markdown :string]])
(def command [:map {:closed true}
              [:document/id document-id]
              [:document/metadata :map]
              [:document/markdown :string]
              [:revision/parents [:vector revision-id]]
              [:revision/actor [:string {:min 1}]]])
(def catalog
  {:document-history/revision-recorded
   (schema/event-schema :document-history/revision-recorded content)})

(defn require-id! [id]
  (when-not (m/validate document-id id)
    (throw (ex-info "Document id must be a safe path component of 1–100 characters"
                    {:document-history/error :invalid-id})))
  id)

(defn require-command! [value]
  (when-not (and (m/validate command value)
                (= (count (:revision/parents value))
                   (count (distinct (:revision/parents value)))))
    (throw (ex-info "Invalid document revision command"
                    {:document-history/error :invalid-command
                     :errors (m/explain command value)})))
  value)

(defn require-parent! [document-id parent-id parent]
  (when-not parent
    (throw (ex-info "Revision parent is absent from the accepted history"
                    {:document-history/error :unknown-parent :revision/id parent-id})))
  (when-not (= document-id (:event/subject parent))
    (throw (ex-info "Revision parents must belong to the same document"
                    {:document-history/error :cross-document-parent :revision/id parent-id})))
  parent)
