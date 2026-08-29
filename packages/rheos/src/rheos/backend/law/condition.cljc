(ns rheos.backend.law.condition
  (:require [katamorph.condition :as shared]))

(defn match? [context condition-value]
  (shared/match? context condition-value))

(defn match-leaf? [context condition-value]
  (shared/match? context condition-value))
