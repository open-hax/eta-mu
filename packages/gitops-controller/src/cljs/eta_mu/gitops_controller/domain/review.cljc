(ns eta-mu.gitops-controller.domain.review
  "Pure revision binding for review, gate reconciliation, and ingress probes."
  (:require [eta-mu.gitops-controller.law.webhook :as law]
            [eta-mu.gitops-controller.shape.webhook :as shape]))

(defn gate-retirement-plan
  "Retire durable gates only while the same authoritative PR is closed,
  literally draft, or targets a non-default base. Its old test merge may vanish."
  [command current]
  (cond
    (not (law/current-pull-request? current))
    {:planned? false :reason :invalid-current-pull-request}

    (not (and (= (:repository command) (:repository current))
              (= (:repository-id command) (:repository-id current))
              (= (:repository current) (:head-repository current))
              (= (:repository-id current) (:head-repository-id current))
              (= (:pull-request-number command) (:number current))
              (= (:pull-request-node-id command) (:node-id current))))
    {:planned? false :reason :pull-request-identity-changed}

    (= "closed" (:state current))
    {:planned? true :reason :pull-request-not-open}

    (true? (:draft? current))
    {:planned? true :reason :pull-request-is-draft}

    (not= (:base-branch current) (:default-branch current))
    {:planned? true :reason :pull-request-base-is-not-default}

    :else
    {:planned? false :reason :pull-request-still-reviewable}))

(defn gate-retirement-dispatch?
  "Select an exact durable gate identity for the target repository and PR,
  including earlier heads and commands whose workflow is already in flight."
  [command dispatch]
  (let [gate (:gate-check dispatch)
        inputs (:inputs dispatch)]
    (and (contains? #{:code-review :review-gate-reconcile :review-gate-invalidate}
                    (shape/command-type (:command/type dispatch)))
         (= (:repository command) (:repository dispatch) (:repository gate))
         (= (:repository-id command) (:repository-id dispatch) (:repository-id gate))
         (= (:pull-request-node-id command) (:pull-request-node-id dispatch)
            (:pr-node-id gate))
         (= (:pull-request-number command) (:pr-number gate))
         (= (str (:pull-request-number command)) (:pr_number inputs))
         (= law/review-gate-check-name (:name gate))
         (law/non-blank-string? (:ref dispatch))
         (= (:ref dispatch) (:base-branch gate))
         (law/delivery-id? (:command_id inputs))
         (= (:command_id inputs) (:delivery-id gate))
         (law/commit-sha? (:pr_head_sha inputs))
         (law/commit-sha? (:pr_base_sha inputs))
         (law/commit-sha? (:pr_merge_sha inputs))
         (= (:pr_head_sha inputs) (:head-sha gate))
         (= (:pr_base_sha inputs) (:base-sha gate))
         (= (:pr_merge_sha inputs) (:merge-sha gate))
         (= (shape/review-gate-external-id
             (:command_id inputs) (:pr-number gate) (:head-sha gate)
             (:base-sha gate) (:merge-sha gate))
            (:external-id gate)))))

(defn current-review-gate-check?
  "Require a controller-owned v2 gate for the same PR/base/head/merge tuple
  before ordering peer checks fetched from the expected repository. A new
  valid delivery may supersede an older delivery for that exact tuple."
  [github-app-id expected check-run]
  (let [identity (shape/parse-review-gate-external-id (:external-id check-run))
        expected-identity (shape/parse-review-gate-external-id (:external-id expected))
        scope {:pr-number-text (str (:pr-number expected))
               :head-sha (:head-sha expected)
               :base-sha (:base-sha expected)
               :merge-sha (:merge-sha expected)}]
    (and (law/positive-integer? github-app-id)
         (law/positive-integer? (:id check-run))
         (law/positive-integer? (:pr-number expected))
         (= github-app-id (:app-id check-run))
         (law/non-blank-string? (:app-slug check-run))
         (= law/review-gate-check-name (:name expected) (:name check-run))
         (= (:merge-sha expected) (:merge-sha check-run))
         (some? identity)
         (some? expected-identity)
         (= scope (dissoc expected-identity :delivery-id)
            (dissoc identity :delivery-id)))))

(defn matching-review-gate-identity? [github-app-id external-id check-run]
  (and (= external-id (:external-id check-run))
       (= github-app-id (:app-id check-run))))

(defn review-gate-check-identity? [github-app-id expected check-run]
  (and (law/positive-integer? (:id check-run))
       (or (nil? (:id expected)) (= (:id expected) (:id check-run)))
       (= (:name expected) (:name check-run))
       (= (:merge-sha expected) (:merge-sha check-run))
       (matching-review-gate-identity? github-app-id (:external-id expected) check-run)
       (law/non-blank-string? (:app-slug check-run))))

(defn expected-review-gate-check? [github-app-id expected check-run]
  (and (review-gate-check-identity? github-app-id expected check-run)
       (= (:details-url expected) (:details-url check-run))
       (= "in_progress" (:status check-run))
       (nil? (:conclusion check-run))))

(defn terminal-review-gate? [github-app-id gate-check patch check-run output]
  (and (review-gate-check-identity? github-app-id gate-check check-run)
       (= "completed" (:status check-run))
       (= (:conclusion patch) (:conclusion check-run))
       (= (:details-url patch) (:details-url check-run))
       (= (:external-id patch) (:external-id check-run))
       (= (get-in patch [:output :title]) (:title output))
       (= (get-in patch [:output :summary]) (:summary output))))

(defn newest-current-review-gate-check [github-app-id expected runs]
  (->> runs
       (filter #(current-review-gate-check? github-app-id expected %))
       (sort-by :id >)
       first))

(defn superseded-pending-review-gate?
  [github-app-id expected current-check candidate]
  (and (current-review-gate-check? github-app-id expected candidate)
       (not= (:id current-check) (:id candidate))
       (< (:id candidate) (:id current-check))
       (contains? #{"queued" "in_progress"} (:status candidate))))

(defn trusted-dispatched-workflow-run?
  [dispatch workflow-run controller-app-login]
  (and (law/positive-integer? (:id workflow-run))
       (law/non-blank-string? (:node-id workflow-run))
       (= (:workflow-id dispatch) (:workflow-id workflow-run))
       (= (:repository dispatch) (:repository workflow-run))
       (= (:repository-id dispatch) (:repository-id workflow-run))
       (law/workflow-run-path? (:repository dispatch)
                               (:workflow dispatch) (:ref dispatch)
                               (:path workflow-run))
       (= "workflow_dispatch" (:event workflow-run))
       (contains? #{"queued" "in_progress" "completed"}
                  (:status workflow-run))
       (law/commit-sha? (:head-sha workflow-run))
       (= (:ref dispatch) (:head-branch workflow-run))
       (= 1 (:run-attempt workflow-run))
       (= controller-app-login (:actor-login workflow-run))
       (= controller-app-login (:triggering-actor-login workflow-run))
       (law/positive-integer? (:actor-id workflow-run))
       (= (:actor-id workflow-run) (:triggering-actor-id workflow-run))
       (law/non-blank-string? (:url workflow-run))
       (law/non-blank-string? (:html-url workflow-run))
       (if (= "completed" (:status workflow-run))
         (contains? law/workflow-run-conclusions (:conclusion workflow-run))
         (nil? (:conclusion workflow-run)))))

(defn- workflow-attempt-url [workflow-run]
  (str (:html-url workflow-run) "/attempts/" (:run-attempt workflow-run)))

(defn- dispatch-pull-request-identity-current?
  "Prove every stable part of the pull-request tuple independently from
  GitHub's asynchronously computed test-merge fields."
  [dispatch current-pull-request]
  (let [gate-check (:gate-check dispatch)]
    (and (law/current-pull-request? current-pull-request)
         (= "open" (:state current-pull-request))
         (not (:draft? current-pull-request))
         (= (:repository dispatch) (:repository current-pull-request))
         (= (:repository-id dispatch) (:repository-id current-pull-request))
         (= (:repository current-pull-request)
            (:head-repository current-pull-request))
         (= (:repository-id current-pull-request)
            (:head-repository-id current-pull-request))
         (= (:pull-request-node-id dispatch) (:node-id current-pull-request))
         (= (get-in dispatch [:inputs :pr_number])
            (str (:number current-pull-request)))
         (= (:ref dispatch) (:default-branch current-pull-request))
         (= (:ref dispatch) (:base-branch current-pull-request))
         (= (get-in dispatch [:inputs :pr_base_sha])
            (:base-sha current-pull-request))
         (= (get-in dispatch [:inputs :pr_head_sha])
            (:head-sha current-pull-request))
         (= (:pr-number gate-check) (:number current-pull-request))
         (= (:pr-node-id gate-check) (:node-id current-pull-request))
         (= (:base-branch gate-check) (:base-branch current-pull-request))
         (= (:base-sha gate-check) (:base-sha current-pull-request))
         (= (:head-sha gate-check) (:head-sha current-pull-request)))))

(defn- dispatch-test-merge-pending?
  [dispatch current-pull-request]
  (and (dispatch-pull-request-identity-current?
        dispatch current-pull-request)
       (or (nil? (:mergeable? current-pull-request))
           (and (true? (:mergeable? current-pull-request))
                (nil? (:merge-sha current-pull-request))))))

(defn dispatch-current-pull-request?
  "Prove that a durable dispatch still names the current, mergeable test-merge
  revision for one exact pull request on its repository default branch."
  [dispatch current-pull-request]
  (let [gate-check (:gate-check dispatch)]
    (and (dispatch-pull-request-identity-current?
          dispatch current-pull-request)
         (true? (:mergeable? current-pull-request))
         (law/commit-sha? (:merge-sha current-pull-request))
         (= (get-in dispatch [:inputs :pr_merge_sha])
            (:merge-sha current-pull-request))
         (= (:merge-sha gate-check) (:merge-sha current-pull-request)))))

(defn dispatch-command-current?
  "Prove the immutable pull-request tuple and any revocable command authority
  immediately before a GitHub effect."
  [command dispatch current-pull-request]
  (and (dispatch-current-pull-request? dispatch current-pull-request)
       (or (not= :code-review
                 (shape/command-type (:command/type command)))
           (contains? (:labels current-pull-request) (:label command)))))

(defn- webhook-matches-refetched-run? [command dispatch workflow-run]
  (and (= (:workflow-run-id command) (:id workflow-run))
       (= (:workflow-run-node-id command) (:node-id workflow-run))
       (= (:workflow-run-workflow-id command) (:workflow-id workflow-run))
       (law/workflow-run-webhook-path?
        (:repository dispatch) (:workflow dispatch) (:ref dispatch)
        (:workflow-run-path command))
       (= (:workflow-run-event command) (:event workflow-run))
       (= (:workflow-run-status command) (:status workflow-run))
       (= (:workflow-run-conclusion command) (:conclusion workflow-run))
       (= (:workflow-run-head-sha command) (:head-sha workflow-run))
       (= (:workflow-run-head-branch command) (:head-branch workflow-run))
       (= (:workflow-run-run-attempt command) (:run-attempt workflow-run))
       (= (:workflow-run-url command) (:url workflow-run))
       (= (:workflow-run-html-url command) (:html-url workflow-run))
       (= (:workflow-run-actor-id command) (:actor-id workflow-run))
       (= (:workflow-run-actor-login command) (:actor-login workflow-run))
       (= (:workflow-run-triggering-actor-id command)
          (:triggering-actor-id workflow-run))
       (= (:workflow-run-triggering-actor-login command)
          (:triggering-actor-login workflow-run))))

(defn trusted-workflow-completion-plan
  [command correlation source-delivery-id current-workflow-run current-pull-request
   controller-app-login]
  (let [dispatch (:dispatch correlation)
        original-run (:workflow-run correlation)
        gate-check (:gate-check correlation)]
    (cond
      (not (contains? #{:code-review :review-gate-reconcile}
                      (shape/command-type (:command/type dispatch))))
      {:planned? false :reason :workflow-run-is-not-review-related}

      (not (trusted-dispatched-workflow-run?
            dispatch current-workflow-run controller-app-login))
      {:planned? false :reason :untrusted-workflow-run}

      (not= (:workflow-run-id command) (:id current-workflow-run))
      {:planned? false :reason :workflow-run-identity-changed}

      (not= "completed" (:status current-workflow-run))
      {:planned? false :reason :workflow-run-not-completed}

      (not= (select-keys original-run [:id :url :html-url])
            (select-keys current-workflow-run [:id :url :html-url]))
      {:planned? false :reason :workflow-run-binding-changed}

      (not (webhook-matches-refetched-run?
            command dispatch current-workflow-run))
      {:planned? false :reason :workflow-run-webhook-mismatch}

      (not (dispatch-pull-request-identity-current?
            dispatch current-pull-request))
      {:planned? false :reason :pull-request-merge-context-changed}

      (dispatch-test-merge-pending? dispatch current-pull-request)
      {:planned? false :reason :pull-request-test-merge-not-ready}

      (not (dispatch-current-pull-request? dispatch current-pull-request))
      {:planned? false :reason :pull-request-merge-context-changed}

      :else
      (let [gate-workflow? (= :review-gate-reconcile
                              (shape/command-type (:command/type dispatch)))
            conclusion (if (and gate-workflow?
                                (= "success"
                                   (:conclusion current-workflow-run)))
                         "success"
                         "failure")
            details-url (workflow-attempt-url current-workflow-run)
            title (cond
                    (= "success" conclusion)
                    "Review evidence and resolution gate passed"

                    gate-workflow?
                    "Review evidence or resolution gate failed"

                    :else
                    "Code review ended without a completed gate reconciliation")
            summary (str "Trusted workflow run [" (:id current-workflow-run)
                         "](" details-url ") completed with `"
                         (:conclusion current-workflow-run)
                         "` for pull request #" (:pr-number gate-check) ".")]
        {:planned? true
         :terminal-intent
         {:source-delivery-id source-delivery-id
          :completion-delivery-id (:command-id command)
          :workflow-run-id (:id current-workflow-run)
          :workflow-run-attempt (:run-attempt current-workflow-run)
          :repository (:repository gate-check)
          :repository-id (:repository-id dispatch)
          :pr-number (:pr-number gate-check)
          :pr-node-id (:pull-request-node-id dispatch)
          :pr-head-sha (:head-sha gate-check)
          :pr-merge-sha (:merge-sha gate-check)
          :base-branch (:base-branch gate-check)
          :base-sha (:base-sha gate-check)
          :gate-check-id (:id gate-check)
          :patch {:name (:name gate-check)
                  :status "completed"
                  :conclusion conclusion
                  :details-url details-url
                  :external-id (:external-id gate-check)
                  :output {:title title :summary summary}}}
         :gate-check gate-check
         :workflow-run current-workflow-run}))))

(defn plan
  [command current-pull-request authority-decision workflow]
  (let [command-type (shape/command-type (:command/type command))]
    (cond
    (not (law/command-type? command-type))
    {:planned? false :reason :invalid-command-type}

    (not (law/current-pull-request? current-pull-request))
    {:planned? false :reason :invalid-current-pull-request}

    (not= (:repository command) (:repository current-pull-request))
    {:planned? false :reason :repository-changed}

    (not= (:repository-id command) (:repository-id current-pull-request))
    {:planned? false :reason :repository-identity-changed}

    (or (not= (:repository current-pull-request)
              (:head-repository current-pull-request))
        (not= (:repository-id current-pull-request)
              (:head-repository-id current-pull-request)))
    {:planned? false :reason :fork-pull-request-not-supported}

    (not= (:pull-request-number command) (:number current-pull-request))
    {:planned? false :reason :pull-request-changed}

    (not= (:pull-request-node-id command) (:node-id current-pull-request))
    {:planned? false :reason :pull-request-identity-changed}

    (not= "open" (:state current-pull-request))
    {:planned? false :reason :pull-request-not-open}

    (:draft? current-pull-request)
    {:planned? false :reason :pull-request-is-draft}

    (and (law/base-push-child-command? command)
         (not= (:repository-default-branch command)
               (:default-branch current-pull-request)))
    {:planned? false :reason :push-default-branch-changed}

    (not= (:default-branch current-pull-request)
          (:base-branch current-pull-request))
    {:planned? false :reason :pull-request-base-is-not-default}

    (or (nil? (:mergeable? current-pull-request))
        (nil? (:merge-sha current-pull-request)))
    {:planned? false :reason :pull-request-test-merge-not-ready}

    (or (not (true? (:mergeable? current-pull-request)))
        (not (law/commit-sha? (:merge-sha current-pull-request))))
    {:planned? false :reason :pull-request-not-mergeable}

    (and (contains? #{:code-review :ingress-probe} command-type)
         (not (contains? (:labels current-pull-request) (:label command))))
    {:planned? false :reason :command-label-no-longer-present}

    (not (:authorized? authority-decision))
    {:planned? false :reason :actor-not-authorized}

    (= :ingress-probe command-type)
    {:planned? true
     :command/type command-type
     :probe {:repository (:repository command)
             :pr-number (:number current-pull-request)
             :pr-head-sha (:head-sha current-pull-request)
             :command-id (:command-id command)}}

    :else
    (let [pull-request-number (:number current-pull-request)
          head-sha (:head-sha current-pull-request)
          merge-sha (:merge-sha current-pull-request)
          delivery-id (:command-id command)]
      {:planned? true
       :command/type command-type
       :dispatch
       {:command/type command-type
        :event (:event command)
        :action (:action command)
        :repository (:repository command)
        :repository-id (:repository-id command)
        :pull-request-node-id (:pull-request-node-id command)
        :workflow workflow
        :ref (:default-branch current-pull-request)
        :gate-check
        {:name law/review-gate-check-name
         :repository (:repository command)
         :repository-id (:repository-id command)
         :pr-number pull-request-number
         :pr-node-id (:node-id current-pull-request)
         :base-branch (:base-branch current-pull-request)
         :base-sha (:base-sha current-pull-request)
         :head-sha head-sha
         :merge-sha merge-sha
         :delivery-id delivery-id
         :external-id (shape/review-gate-external-id
                       delivery-id pull-request-number head-sha
                       (:base-sha current-pull-request) merge-sha)
         :details-url (:html-url current-pull-request)}
        :inputs {:pr_number (str pull-request-number)
                 :pr_base_sha (:base-sha current-pull-request)
                 :pr_head_sha head-sha
                 :pr_merge_sha merge-sha
                 :command_id delivery-id}}}))))
