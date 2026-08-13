(ns rheos.backend.law.condition
  (:require [rheos.backend.law.condition.basic :as basic]
            [rheos.backend.law.condition.membership :as membership]))

(defn match-leaf? [context condition]
  (case (:condition/op condition)
    :eq (basic/equal? context condition)
    :not-eq (membership/not-equal? context condition)
    :exists (basic/exists? context condition)
    :in (membership/in? context condition)
    false))
