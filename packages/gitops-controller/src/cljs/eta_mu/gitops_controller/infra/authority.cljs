(ns eta-mu.gitops-controller.infra.authority
  "Provisional GitHub-backed implementation of the Axxium authority port."
  (:require [eta-mu.gitops-controller.domain.authority :as authority]))

(defn github-port [github]
  {:authorize!
   (^:async fn [command]
     (let [request (authority/request command)]
       (if (authority/defensive-gate-reconciliation? request)
         ;; GitHub-signed, allowlisted review lifecycle events reproduce the
         ;; old native Actions exposure: even a non-collaborator review bot may
         ;; defensively invalidate/recompute the gate, but cannot run a model.
         (authority/signed-review-event-decision request)
         (let [evidence (await ((:actor-permission! github) command))]
           (authority/decision request evidence)))))})
