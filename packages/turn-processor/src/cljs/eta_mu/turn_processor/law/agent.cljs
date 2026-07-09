(ns eta-mu.turn-processor.law.agent
  "Malli schemas for agent context and configuration.

  This layer describes shapes, not runtime wiring. Execute hooks and stream
  functions belong in infra."
  (:require [malli.core :as m]
            [eta-mu.turn-processor.law.message :as message]
            [eta-mu.turn-processor.law.tool :as tool]))

(def thinking-level-schema
  [:enum :off :minimal :low :medium :high :xhigh])

(def agent-context-schema
  "Snapshot of context passed into the turn processor."
  [:map
   [:system-prompt string?]
   [:messages [:vector message/agent-message-schema]]
   [:tools {:optional true} [:vector tool/tool-schema]]])

(def tool-execution-mode-schema
  [:enum :sequential :parallel])

(def agent-loop-config-schema
  "Pure description of the turn-loop configuration.

  Note: the execute side (convert-to-llm, stream-fn, hooks) is provided by
  infra at runtime and is not part of this schema."
  [:map
   [:model any?]
   [:thinking-level {:optional true} thinking-level-schema]
   [:tool-execution {:optional true} tool-execution-mode-schema]])

(defn valid-context? [x]
  (m/validate agent-context-schema x))

(defn explain-context [x]
  (m/explain agent-context-schema x))

(defn valid-config? [x]
  (m/validate agent-loop-config-schema x))

(defn explain-config [x]
  (m/explain agent-loop-config-schema x))
