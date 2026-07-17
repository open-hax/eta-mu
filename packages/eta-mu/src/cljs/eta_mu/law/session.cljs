(ns eta-mu.law.session
  "Malli schema for the persisted agent session artifact.

  A session artifact is one EDN map stored at
  `<eta-mu-home>/sessions/<session-id>.edn`. It persists the canonical
  turn-processor message transcript plus the metadata needed to resume:
  model, system prompt, and the cwd the session started in. Tools are
  deliberately excluded — they carry execute fns and are re-attached from
  the live registry on resume."
  (:require [malli.core :as m]
            [eta-mu.turn-processor.law.message :as message]))

(def model-schema
  [:map
   [:id [:string {:min 1}]]
   [:provider [:string {:min 1}]]])

(def session-artifact-schema
  [:map
   [:version [:= 1]]
   [:session-id [:string {:min 1}]]
   [:cwd [:string {:min 1}]]
   [:created-at [:string {:min 1}]]
   [:updated-at [:string {:min 1}]]
   [:model model-schema]
   [:system-prompt string?]
   [:messages [:vector message/agent-message-schema]]])

(defn valid-artifact? [x]
  (m/validate session-artifact-schema x))

(defn explain-artifact [x]
  (m/explain session-artifact-schema x))
