(ns eta-mu.gitops-controller.shape.effect-lease
  "Pure decoding of the Services-owned effect-lease marker."
  (:require [eta-mu.gitops-controller.law.webhook :as law]))

(defn active-marker-deployment
  "Return the deployment ID from an exact LF-terminated marker, or nil."
  [text]
  (when (law/active-marker? text)
    (subs text 0 (dec (count text)))))
