(ns eta-mu.turn-processor.law.tool
  "Malli schemas for tools seen by the turn processor.

  The execute function is not part of the law schema; it is provided by infra at
  runtime."
  (:require [malli.core :as m]))

(def tool-execution-mode-schema
  [:enum :sequential :parallel])

(def tool-schema
  "A tool is a named operation with a description and a parameter schema."
  [:map
   [:name [:string {:min 1}]]
   [:label [:string {:min 1}]]
   [:description [:string {:min 1}]]
   [:parameters any?]
   [:execution-mode {:optional true} tool-execution-mode-schema]])

(defn valid-tool? [x]
  (m/validate tool-schema x))

(defn explain-tool [x]
  (m/explain tool-schema x))
