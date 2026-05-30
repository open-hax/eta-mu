(ns eta-mu.runtime.shape.session
  (:require [eta-mu.runtime.shape.message :as message-shape]))

(defn context-from-external
  [context]
  {:session-id (or (:sessionId context) (:session-id context))
   :cwd (:cwd context)
   :messages (mapv message-shape/message-from-external (or (:messages context) []))
   :active-tool-names (vec (or (:activeToolNames context) (:active-tool-names context) []))
   :metadata (or (:metadata context) {})
   :created-at (or (:createdAt context) (:created-at context))
   :updated-at (or (:updatedAt context) (:updated-at context))})

(defn context->external
  [context]
  {:sessionId (:session-id context)
   :cwd (:cwd context)
   :messages (mapv message-shape/message->external (:messages context))
   :activeToolNames (vec (:active-tool-names context))
   :metadata (:metadata context)
   :createdAt (:created-at context)
   :updatedAt (:updated-at context)})
