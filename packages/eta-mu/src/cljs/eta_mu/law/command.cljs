(ns eta-mu.law.command
  "Registry contracts for eta-mu CLI commands.

  Commands are data. A leaf command has :handler. A group command has :subcommands.
  The law namespace only describes the shape; it does not perform dispatch."
  (:require [malli.core :as m]))

(def ^:private Command
  "Recursive command shape. Embedded in the Registry schema via :registry."
  [:map {:closed false}
   [:name :string]
   [:description :string]
   [:hidden? {:optional true} :boolean]
   [:handler {:optional true} [:=> [:cat [:vector :string]] :any]]
   [:subcommands {:optional true} [:map-of :string [:ref ::Command]]]])

(def Registry
  "Top-level command registry."
  [:schema {:registry {::Command Command}}
   [:map-of :string [:ref ::Command]]])

(defn valid-registry? [x]
  (m/validate Registry x))

(defn explain-registry [x]
  (m/explain Registry x))
