(ns eta-mu.gitops-controller.domain.admission
  "Pure policy for turning a valid webhook command into operator intent."
  (:require [eta-mu.gitops-controller.law.webhook :as law]))

(defn- mode-keyword [value]
  (if (string? value) (keyword value) value))

(defn- source-command-type [command]
  (cond
    (law/code-review-command? command) :code-review
    (law/review-gate-reconcile-command? command) :review-gate-reconcile
    (law/review-gate-invalidation-command? command) :review-gate-invalidate
    (law/workflow-run-completion-command? command) :review-gate-completion
    (law/ingress-probe-command? command) :ingress-probe
    (law/issue-probe-command? command) :issue-probe
    :else nil))

(defn- workflow-binding-for
  [{:keys [workflow gate-workflow review-workflow-id gate-workflow-id]}
   command-type command]
  (case command-type
    :code-review {:workflow workflow :workflow-id review-workflow-id}
    :review-gate-reconcile {:workflow gate-workflow
                            :workflow-id gate-workflow-id}
    :review-gate-invalidate {:workflow nil :workflow-id nil}
    :review-gate-completion
    (cond
      (= review-workflow-id (:workflow-definition-id command))
      {:workflow workflow :workflow-id review-workflow-id}

      (= gate-workflow-id (:workflow-definition-id command))
      {:workflow gate-workflow :workflow-id gate-workflow-id}

      :else nil)
    :ingress-probe {:workflow nil :workflow-id nil}
    :issue-probe {:workflow nil :workflow-id nil}
    nil))

(defn current-policy-decision
  "Re-admit durable intent against the current policy. A configuration change
  may only tighten authority; it can never promote old observe-only evidence
  into a mutating workflow dispatch."
  [{:keys [mode policy-revision project-id review-label probe-label
           repository-allowlist installation-allowlist] :as policy}
   {:keys [repository installation-id label admission] :as command}]
  (let [admitted-mode (mode-keyword (:mode admission))
        current-mode (mode-keyword mode)
        command-type (law/command-type (:command/type command))
        admitted-command-type (law/command-type
                               (:command/type admission))
        expected-command-type (source-command-type command)
        expected-capability (law/command-capability command-type)
        {:keys [workflow workflow-id]}
        (workflow-binding-for policy command-type command)
        expected-workflow workflow
        expected-workflow-id workflow-id]
    (cond
      (or (not= 2 (:version admission))
          (not (contains? law/controller-modes admitted-mode))
          (not (law/non-blank-string? (:policy-revision admission)))
          (not (law/command-type? command-type))
          (not= command-type admitted-command-type)
          (not= command-type expected-command-type)
          (not= expected-capability (law/capability (:capability command)))
          (and (= :issue-probe command-type)
               (or (not (law/project-id? project-id))
                   (not (law/project-id? (:project-id admission)))))
          (and (contains? #{:code-review :review-gate-reconcile
                            :review-gate-completion}
                          command-type)
               (or (not (law/workflow-file? (:workflow admission)))
                   (not (law/workflow-file? expected-workflow))
                   (and (or (= :review-dispatch current-mode)
                            (= :review-gate-completion command-type))
                        (not (law/positive-integer?
                              expected-workflow-id))))))
      {:allowed? false :reason :admission-policy-unbound}

      (or (not= admitted-mode current-mode)
          (not= (:policy-revision admission) policy-revision))
      {:allowed? false :reason :admission-policy-changed}

      (not (contains? repository-allowlist repository))
      {:allowed? false :reason :repository-authorization-revoked}

      (not (contains? installation-allowlist installation-id))
      {:allowed? false :reason :installation-authorization-revoked}

      (and (= :code-review command-type)
           (or (not= label review-label)
               (not= label (:review-label admission))))
      {:allowed? false :reason :command-label-policy-changed}

      (and (= :ingress-probe command-type)
           (or (not= label probe-label)
               (not= label (:probe-label admission))))
      {:allowed? false :reason :probe-label-policy-changed}

      (and (= :issue-probe command-type)
           (or (not= label probe-label)
               (not= label (:probe-label admission))
               (not= project-id (:project-id admission))))
      {:allowed? false :reason :issue-probe-policy-changed}

      (and (contains? #{:code-review :review-gate-reconcile
                        :review-gate-completion}
                      command-type)
           (not= expected-workflow (:workflow admission)))
      {:allowed? false :reason :command-workflow-policy-changed}

      (and (= :review-gate-completion command-type)
           (or (not= expected-workflow-id (:workflow-definition-id command))
               (not= expected-workflow-id
                     (:workflow-run-workflow-id command))
               (not (law/workflow-definition-path?
                     expected-workflow (:workflow-definition-path command)))
               (not (law/workflow-run-webhook-path?
                     expected-workflow (:workflow-run-head-branch command)
                     (:workflow-run-path command)))))
      {:allowed? false :reason :command-workflow-policy-changed}

      :else
      {:allowed? true
       :mode current-mode
       :command/type command-type
       :workflow expected-workflow
       :workflow-id expected-workflow-id})))

(defn- admit
  [{:keys [mode policy-revision project-id review-label probe-label] :as policy}
   command command-type capability]
  (let [{:keys [workflow]} (workflow-binding-for policy command-type command)
        selected-workflow workflow]
    {:admitted? true
     :command
     (assoc command
            :command-id (:delivery-id command)
            :command/type command-type
            :capability (law/capability capability)
            :admission
            (cond-> {:version 2
                     :mode mode
                     :policy-revision policy-revision
                     :command/type command-type}
              (contains? #{:code-review :review-gate-reconcile
                           :review-gate-completion}
                         command-type)
              (assoc :workflow selected-workflow)

              (= :code-review command-type)
              (assoc :review-label review-label)

              (contains? #{:ingress-probe :issue-probe} command-type)
              (assoc :probe-label probe-label)

              (= :issue-probe command-type)
              (assoc :project-id project-id)))}))

(defn decide
  [{:keys [review-label probe-label repository-allowlist installation-allowlist]
    :as policy}
   command]
  (cond
    (not (law/webhook-base-source? command))
    {:admitted? false :reason :invalid-command}

    (not (contains? repository-allowlist (:repository command)))
    {:admitted? false :reason :repository-not-allowed}

    (not (contains? installation-allowlist (:installation-id command)))
    {:admitted? false :reason :installation-not-allowed}

    (not (law/managed-event? (:event command)))
    {:admitted? false :ignored? true :reason :unmanaged-event}

    (not (law/non-blank-string? (:action command)))
    {:admitted? false :reason :invalid-command}

    (= "issues" (:event command))
    (cond
      (not (law/issue-webhook-source? command))
      {:admitted? false :reason :invalid-command}

      (:issue-pull-request? command)
      {:admitted? false :reason :pull-request-is-not-an-issue}

      (not= "labeled" (:action command))
      {:admitted? false :ignored? true :reason :unmanaged-action}

      (not (law/non-blank-string? (:label command)))
      {:admitted? false :reason :invalid-command-label}

      (= probe-label (:label command))
      (admit policy command :issue-probe :gitops/probe)

      :else
      {:admitted? false :ignored? true :reason :unmanaged-label})

    (= "pull_request" (:event command))
    (cond
      (not (law/pull-request-webhook-source? command))
      {:admitted? false :reason :invalid-command}

      (law/review-gate-invalidation-command? command)
      (admit policy command :review-gate-invalidate
             :gitops/invalidate-review-gate)

      (not= "labeled" (:action command))
      {:admitted? false :ignored? true :reason :unmanaged-action}

      (not (law/non-blank-string? (:label command)))
      {:admitted? false :reason :invalid-command-label}

      (= review-label (:label command))
      (admit policy command :code-review :gitops/review)

      (= probe-label (:label command))
      (admit policy command :ingress-probe :gitops/probe)

      :else
      {:admitted? false :ignored? true :reason :unmanaged-label})

    (contains? law/gate-reconcile-actions (:event command))
    (cond
      (not (law/pull-request-webhook-source? command))
      {:admitted? false :reason :invalid-command}

      (not (law/gate-reconcile-action? (:event command) (:action command)))
      {:admitted? false :ignored? true :reason :unmanaged-action}

      (not (law/non-blank-string? (law/gate-reconcile-source-id command)))
      {:admitted? false :reason :invalid-review-event}

      :else
      (admit policy command :review-gate-reconcile
             :gitops/reconcile-review-gate))

    (= "workflow_run" (:event command))
    (cond
      (not= "completed" (:action command))
      {:admitted? false :ignored? true :reason :unmanaged-action}

      (not (law/webhook-source? command))
      {:admitted? false :reason :invalid-command}

      :else
      (let [{:keys [workflow workflow-id]}
            (workflow-binding-for policy :review-gate-completion command)]
        (cond
          (or (nil? workflow)
              (not= workflow-id (:workflow-definition-id command))
              (not= workflow-id (:workflow-run-workflow-id command))
              (not (law/workflow-definition-path?
                    workflow
                    (:workflow-definition-path command)))
              (not (law/workflow-run-webhook-path?
                    workflow
                    (:workflow-run-head-branch command)
                    (:workflow-run-path command))))
          {:admitted? false :ignored? true :reason :unmanaged-workflow}

          (or (not= (:controller-app-login policy)
                    (:workflow-run-actor-login command))
              (not= (:controller-app-login policy)
                    (:workflow-run-triggering-actor-login command))
              (not= (:workflow-run-actor-id command)
                    (:workflow-run-triggering-actor-id command))
              (not= 1 (:workflow-run-run-attempt command)))
          {:admitted? false :ignored? true :reason :untrusted-workflow-actor}

          :else
          (admit policy command :review-gate-completion
                 :gitops/complete-review-gate))))

    :else
    {:admitted? false :ignored? true :reason :unmanaged-event}))
