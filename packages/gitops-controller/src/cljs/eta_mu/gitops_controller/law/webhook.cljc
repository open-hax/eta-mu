(ns eta-mu.gitops-controller.law.webhook
  "Pure contracts for the narrow webhook command admitted by the controller."
  (:require [clojure.string :as str]))

(def delivery-id-pattern
  #"(?i)^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")

(def signature-pattern
  #"^sha256=[0-9a-f]{64}$")

(def repository-pattern
  #"^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$")

(def command-label-pattern
  #"^eta-mu:[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$")

(def app-bot-login-pattern
  #"^[A-Za-z0-9][A-Za-z0-9-]{0,99}\[bot\]$")

(def project-id-pattern
  #"^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$")

(def task-uuid-pattern
  #"^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$")

(def review-command-label "eta-mu:review")
(def probe-command-label "eta-mu:probe")
(def review-gate-check-name "eta-mu-review-gate")

(def managed-events
  #{"issues"
    "pull_request"
    "pull_request_review"
    "pull_request_review_comment"
    "pull_request_review_thread"
    "workflow_run"})

(def gate-reconcile-actions
  {"pull_request_review" #{"submitted" "dismissed"}
   "pull_request_review_comment" #{"created" "deleted"}
   "pull_request_review_thread" #{"resolved" "unresolved"}})

(def review-gate-invalidation-actions
  #{"opened" "reopened" "synchronize" "ready_for_review"})

(def command-types
  #{:code-review :review-gate-reconcile :review-gate-invalidate
    :review-gate-completion
    :ingress-probe :issue-probe})

(def command-capabilities
  {:code-review :gitops/review
   :review-gate-reconcile :gitops/reconcile-review-gate
   :review-gate-invalidate :gitops/invalidate-review-gate
   :review-gate-completion :gitops/complete-review-gate
   :ingress-probe :gitops/probe
   :issue-probe :gitops/probe})

(def workflow-run-conclusions
  #{"success" "failure" "cancelled" "timed_out" "action_required"
    "neutral" "skipped" "stale" "startup_failure"})

(def deployment-id-pattern
  #"^[1-9][0-9]*-[1-9][0-9]*$")

(def workflow-file-pattern
  #"^[A-Za-z0-9][A-Za-z0-9_.-]{0,126}\.ya?ml$")

(def sha-pattern
  #"^[0-9a-f]{40}$")

(def sha256-pattern
  #"^[0-9a-f]{64}$")

(def allowed-permissions
  #{"admin" "maintain" "write"})

(def controller-modes
  #{:observe-only :review-dispatch})

(def minimum-webhook-secret-length 32)

(defn non-blank-string? [value]
  (and (string? value) (not (str/blank? value))))

(defn positive-integer? [value]
  (and (integer? value) (pos? value)))

(defn delivery-id? [value]
  (and (string? value) (boolean (re-matches delivery-id-pattern value))))

(defn signature? [value]
  (and (string? value) (boolean (re-matches signature-pattern value))))

(defn webhook-secret? [value]
  (and (non-blank-string? value)
       (<= minimum-webhook-secret-length (count (str/trim value)))))

(defn repository-full-name? [value]
  (and (string? value) (boolean (re-matches repository-pattern value))))

(defn command-label? [value]
  (and (string? value) (boolean (re-matches command-label-pattern value))))

(defn app-bot-login? [value]
  (and (string? value) (boolean (re-matches app-bot-login-pattern value))))

(defn project-id? [value]
  (and (string? value) (boolean (re-matches project-id-pattern value))))

(defn task-uuid? [value]
  (and (string? value) (boolean (re-matches task-uuid-pattern value))))

(defn review-command-label? [value]
  (= review-command-label value))

(defn probe-command-label? [value]
  (= probe-command-label value))

(defn workflow-file? [value]
  (and (string? value) (boolean (re-matches workflow-file-pattern value))))

(defn workflow-run-path? [workflow ref value]
  (and (workflow-file? workflow)
       (non-blank-string? ref)
       (= (str ".github/workflows/" workflow "@" ref) value)))

(defn workflow-definition-path? [workflow value]
  (and (workflow-file? workflow)
       (= (str ".github/workflows/" workflow) value)))

(defn workflow-run-webhook-path?
  "Accept the two exact path representations GitHub emits for a workflow_run
  webhook. The authoritative REST refetch still requires path@ref."
  [workflow ref value]
  (and (workflow-file? workflow)
       (non-blank-string? ref)
       (contains? #{(str ".github/workflows/" workflow)
                    (str ".github/workflows/" workflow "@" ref)}
                  value)))

(defn command-type [value]
  (cond
    (keyword? value) value
    (string? value) (keyword value)
    :else nil))

(defn command-type? [value]
  (contains? command-types (command-type value)))

(defn capability [value]
  (cond
    (keyword? value) value
    (string? value) (keyword value)
    :else nil))

(defn command-capability [command-type-value]
  (get command-capabilities (command-type command-type-value)))

(defn managed-event? [value]
  (contains? managed-events value))

(defn code-review-command?
  [{:keys [event action label]}]
  (and (= "pull_request" event)
       (= "labeled" action)
       (= review-command-label label)))

(defn gate-reconcile-action? [event action]
  (contains? (get gate-reconcile-actions event #{}) action))

(defn gate-reconcile-source-id
  [{:keys [event review-node-id review-comment-node-id
           review-thread-node-id]}]
  (case event
    "pull_request_review" review-node-id
    "pull_request_review_comment" review-comment-node-id
    "pull_request_review_thread" review-thread-node-id
    nil))

(defn review-gate-reconcile-command?
  [{:keys [event action] :as command}]
  (and (gate-reconcile-action? event action)
       (non-blank-string? (gate-reconcile-source-id command))))

(defn review-gate-invalidation-command?
  [{:keys [event action base-ref-before]}]
  (and (= "pull_request" event)
       (or (contains? review-gate-invalidation-actions action)
           (and (= "edited" action)
                (non-blank-string? base-ref-before)))))

(defn ingress-probe-command?
  [{:keys [event action label]}]
  (and (= "pull_request" event)
       (= "labeled" action)
       (= probe-command-label label)))

(defn issue-probe-command?
  [{:keys [event action label issue-pull-request?]}]
  (and (= "issues" event)
       (= "labeled" action)
       (= probe-command-label label)
       (false? issue-pull-request?)))

(declare commit-sha?)

(defn workflow-run-completion-command?
  [{:keys [event action workflow-definition-id workflow-definition-path
           workflow-run-id workflow-run-node-id
           workflow-run-workflow-id workflow-run-path workflow-run-event
           workflow-run-status workflow-run-conclusion workflow-run-head-sha
           workflow-run-head-branch workflow-run-run-attempt
           workflow-run-url workflow-run-html-url
           workflow-run-actor-id workflow-run-actor-login
           workflow-run-triggering-actor-id
           workflow-run-triggering-actor-login]}]
  (and (= "workflow_run" event)
       (= "completed" action)
       (positive-integer? workflow-definition-id)
       (non-blank-string? workflow-definition-path)
       (positive-integer? workflow-run-id)
       (non-blank-string? workflow-run-node-id)
       (positive-integer? workflow-run-workflow-id)
       (non-blank-string? workflow-run-path)
       (= "workflow_dispatch" workflow-run-event)
       (= "completed" workflow-run-status)
       (contains? workflow-run-conclusions workflow-run-conclusion)
       (commit-sha? workflow-run-head-sha)
       (non-blank-string? workflow-run-head-branch)
       (positive-integer? workflow-run-run-attempt)
       (non-blank-string? workflow-run-url)
       (non-blank-string? workflow-run-html-url)
       (positive-integer? workflow-run-actor-id)
       (non-blank-string? workflow-run-actor-login)
       (positive-integer? workflow-run-triggering-actor-id)
       (non-blank-string? workflow-run-triggering-actor-login)))

(defn deployment-id? [value]
  (and (string? value)
       (boolean (re-matches deployment-id-pattern value))))

(defn active-marker-deployment
  "Parse the Services-owned marker's exact wire format. Atomic replacement of
  this one LF-terminated line is the only production effect-lease grant."
  [text]
  (when (and (string? text)
             (str/ends-with? text "\n"))
    (let [deployment (subs text 0 (dec (count text)))]
      (when (and (deployment-id? deployment)
                 (= text (str deployment "\n")))
        deployment))))

(defn commit-sha? [value]
  (and (string? value) (boolean (re-matches sha-pattern value))))

(defn payload-sha256? [value]
  (and (string? value) (boolean (re-matches sha256-pattern value))))

(defn review-gate-external-id
  [delivery-id pull-request-number head-sha base-sha merge-sha]
  (str "eta-mu-review-gate/v2:" delivery-id ":" pull-request-number ":"
       head-sha ":" base-sha ":" merge-sha))

(defn webhook-base-source?
  [{:keys [delivery-id event repository installation-id
           repository-id sender-id sender-login payload/sha256]}]
  (and (delivery-id? delivery-id)
       (non-blank-string? event)
       (repository-full-name? repository)
       (positive-integer? installation-id)
       (positive-integer? repository-id)
       (positive-integer? sender-id)
       (non-blank-string? sender-login)
       (payload-sha256? sha256)))

(defn pull-request-webhook-source?
  [{:keys [action pull-request-number pull-request-node-id] :as command}]
  (and (webhook-base-source? command)
       (non-blank-string? action)
       (positive-integer? pull-request-number)
       (non-blank-string? pull-request-node-id)))

(defn issue-webhook-source?
  [{:keys [action issue-number issue-node-id issue-pull-request?] :as command}]
  (and (webhook-base-source? command)
       (non-blank-string? action)
       (positive-integer? issue-number)
       (non-blank-string? issue-node-id)
       (boolean? issue-pull-request?)))

(defn webhook-source?
  [{:keys [event] :as command}]
  (and (webhook-base-source? command)
       (case event
         "workflow_run" (workflow-run-completion-command? command)
         "issues" (issue-webhook-source? command)
         (pull-request-webhook-source? command))))

(def ignored-delivery-reasons
  #{:unmanaged-event :unmanaged-action :unmanaged-label
    :unmanaged-workflow :untrusted-workflow-actor})

(defn- source-matches-command-type? [command-type-value command]
  (case command-type-value
    :code-review (code-review-command? command)
    :review-gate-reconcile (review-gate-reconcile-command? command)
    :review-gate-invalidate (review-gate-invalidation-command? command)
    :review-gate-completion (workflow-run-completion-command? command)
    :ingress-probe (ingress-probe-command? command)
    :issue-probe (issue-probe-command? command)
    false))

(defn admitted-command?
  "Validate the policy-independent structure of a durable queued command."
  [{:keys [delivery-id command-id label admission] :as command}]
  (let [command-type-value (:command/type command)
        command-capability-value (:capability command)
        admission-type (:command/type admission)]
    (and (webhook-source? command)
         (= delivery-id command-id)
         (keyword? command-type-value)
         (keyword? command-capability-value)
         (= command-type-value admission-type)
         (= command-capability-value
            (command-capability command-type-value))
         (source-matches-command-type? command-type-value command)
         (= 2 (:version admission))
         (contains? controller-modes (:mode admission))
         (non-blank-string? (:policy-revision admission))
         (case command-type-value
           :code-review
           (and (= label (:review-label admission))
                (workflow-file? (:workflow admission)))

           (:review-gate-reconcile :review-gate-completion)
           (workflow-file? (:workflow admission))

           :review-gate-invalidate
           (nil? (:workflow admission))

           :ingress-probe
           (and (= label (:probe-label admission))
                (nil? (:workflow admission)))

           :issue-probe
           (and (= label (:probe-label admission))
                (project-id? (:project-id admission))
                (nil? (:workflow admission)))

           false))))

(defn current-issue?
  [{:keys [number node-id repository repository-id state pull-request?
           html-url labels canonical-task-uuid canonical-task-marker-count
           default-branch default-branch-ref default-branch-sha
           default-branch-object-type repository-archived?
           repository-disabled?]}]
  (and (positive-integer? number)
       (non-blank-string? node-id)
       (repository-full-name? repository)
       (positive-integer? repository-id)
       (contains? #{"open" "closed"} state)
       (boolean? pull-request?)
       (non-blank-string? html-url)
       (set? labels)
       (every? non-blank-string? labels)
       (or (nil? canonical-task-uuid) (string? canonical-task-uuid))
       (integer? canonical-task-marker-count)
       (not (neg? canonical-task-marker-count))
       (non-blank-string? default-branch)
       (= (str "refs/heads/" default-branch) default-branch-ref)
       (commit-sha? default-branch-sha)
       (= "commit" default-branch-object-type)
       (boolean? repository-archived?)
       (boolean? repository-disabled?)))

(defn current-pull-request?
  [{:keys [number node-id repository repository-id head-repository
           head-repository-id state draft? head-sha merge-sha mergeable?
           base-branch base-sha html-url default-branch labels]}]
  (and (positive-integer? number)
       (non-blank-string? node-id)
       (repository-full-name? repository)
       (positive-integer? repository-id)
       (non-blank-string? default-branch)
       (repository-full-name? head-repository)
       (positive-integer? head-repository-id)
       (contains? #{"open" "closed"} state)
       (boolean? draft?)
       (commit-sha? head-sha)
       (or (nil? merge-sha) (commit-sha? merge-sha))
       (or (nil? mergeable?) (boolean? mergeable?))
       (non-blank-string? base-branch)
       (commit-sha? base-sha)
       (non-blank-string? html-url)
       (set? labels)
       (every? non-blank-string? labels)))

(defn review-permission? [permission]
  (contains? allowed-permissions permission))

(defn workflow-dispatch-response?
  [status {:keys [workflow-run-id run-url html-url]}]
  (and (= 200 status)
       (positive-integer? workflow-run-id)
       (non-blank-string? run-url)
       (non-blank-string? html-url)))
