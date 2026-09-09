(ns eta-mu.gitops-controller.shape.webhook
  "Pure projections and identity construction for controller webhook data."
  (:require [eta-mu.gitops-controller.law.webhook :as law]))

(defn command-type [value]
  (cond
    (keyword? value) value
    (string? value) (keyword value)
    :else nil))

(defn capability [value]
  (cond
    (keyword? value) value
    (string? value) (keyword value)
    :else nil))

(defn gate-reconcile-source-id
  [{:keys [event review-node-id review-comment-node-id
           review-thread-node-id]}]
  (case event
    "pull_request_review" review-node-id
    "pull_request_review_comment" review-comment-node-id
    "pull_request_review_thread" review-thread-node-id
    nil))

(defn review-gate-external-id
  [delivery-id pull-request-number head-sha base-sha merge-sha]
  (str "eta-mu-review-gate/v2:" delivery-id ":" pull-request-number ":"
       head-sha ":" base-sha ":" merge-sha))

(defn parse-review-gate-external-id
  "Decode only the complete v2 identity; keep the PR number as canonical text
  so untrusted decimal input cannot overflow or round during parsing."
  [value]
  (when (law/review-gate-external-id? value)
    (let [[_ delivery-id pr-number-text head-sha base-sha merge-sha]
          (re-matches law/review-gate-external-id-pattern value)]
      {:delivery-id delivery-id
       :pr-number-text pr-number-text
       :head-sha head-sha
       :base-sha base-sha
       :merge-sha merge-sha})))

(defn github-check-run->receipt [check-run]
  {:id (:id check-run)
   :node-id (:node_id check-run)
   :name (:name check-run)
   :merge-sha (:head_sha check-run)
   :status (:status check-run)
   :conclusion (:conclusion check-run)
   :external-id (:external_id check-run)
   :details-url (:details_url check-run)
   :app-id (get-in check-run [:app :id])
   :app-slug (get-in check-run [:app :slug])})

(defn github-check-run->bound-receipt [expected check-run]
  (merge
   (select-keys expected
                [:repository :repository-id :pr-number :pr-node-id
                 :base-branch :base-sha :head-sha :merge-sha :delivery-id
                 :external-id :details-url :name])
   (github-check-run->receipt check-run)))

(defn github-pull-request-node->identity [pull]
  {:pull-request-number (:number pull)
   :pull-request-node-id (:id pull)})

(defn github-actor-permission->evidence [permission]
  {:permission (:permission permission)
   :user-id (get-in permission [:user :id])
   :user-login (get-in permission [:user :login])})

(defn github-workflow-dispatch->receipt [dispatch]
  {:workflow-run-id (:workflow_run_id dispatch)
   :run-url (:run_url dispatch)
   :html-url (:html_url dispatch)})

(def ^:private canonical-task-marker-pattern
  #"<!--\s*openhax-kanban-sync\s+uuid=\"([^\"]+)\"\s*-->")

(defn canonical-task-marker
  "Return the one canonical Rheos task marker in an issue body. Multiple
  markers, even if they repeat the same UUID, are ambiguous and return nil."
  [body]
  (let [matches (vec (re-seq canonical-task-marker-pattern (or body "")))]
    {:count (count matches)
     :uuid (when (= 1 (count matches))
             (second (first matches)))}))

(defn payload->command
  [envelope payload]
  (cond-> {:delivery-id (:delivery-id envelope)
   :event (:event envelope)
   :action (if (= "push" (:event envelope)) "updated" (:action payload))
   :label (get-in payload [:label :name])
   :installation-id (get-in payload [:installation :id])
   :repository-id (get-in payload [:repository :id])
   :repository (get-in payload [:repository :full_name])
   :issue-number (get-in payload [:issue :number])
   :issue-node-id (get-in payload [:issue :node_id])
   :issue-pull-request? (some? (get-in payload [:issue :pull_request]))
   :pull-request-number (get-in payload [:pull_request :number])
   :pull-request-node-id (get-in payload [:pull_request :node_id])
   :base-ref-before (get-in payload [:changes :base :ref :from])
   :review-node-id (get-in payload [:review :node_id])
   :review-comment-node-id (get-in payload [:comment :node_id])
   :review-thread-node-id (get-in payload [:thread :node_id])
   :workflow-definition-id (get-in payload [:workflow :id])
   :workflow-definition-path (get-in payload [:workflow :path])
   :workflow-run-id (get-in payload [:workflow_run :id])
   :workflow-run-node-id (get-in payload [:workflow_run :node_id])
   :workflow-run-workflow-id (get-in payload [:workflow_run :workflow_id])
   :workflow-run-path (get-in payload [:workflow_run :path])
   :workflow-run-event (get-in payload [:workflow_run :event])
   :workflow-run-status (get-in payload [:workflow_run :status])
   :workflow-run-conclusion (get-in payload [:workflow_run :conclusion])
   :workflow-run-head-sha (get-in payload [:workflow_run :head_sha])
   :workflow-run-head-branch (get-in payload [:workflow_run :head_branch])
   :workflow-run-run-attempt (get-in payload [:workflow_run :run_attempt])
   :workflow-run-url (get-in payload [:workflow_run :url])
   :workflow-run-html-url (get-in payload [:workflow_run :html_url])
   :workflow-run-actor-id (get-in payload [:workflow_run :actor :id])
   :workflow-run-actor-login (get-in payload [:workflow_run :actor :login])
   :workflow-run-triggering-actor-id
   (get-in payload [:workflow_run :triggering_actor :id])
   :workflow-run-triggering-actor-login
   (get-in payload [:workflow_run :triggering_actor :login])
   :sender-id (get-in payload [:sender :id])
   :sender-login (get-in payload [:sender :login])}
    (= "push" (:event envelope))
    (assoc :push-ref (:ref payload)
           :push-before-sha (:before payload)
           :push-after-sha (:after payload)
           :push-deleted? (:deleted payload)
           :repository-default-branch (get-in payload [:repository :default_branch]))))

(defn github-pull-request->current
  [pull-request repository]
  {:number (:number pull-request)
   :node-id (:node_id pull-request)
   :repository (:full_name repository)
   :repository-id (:id repository)
   :default-branch (:default_branch repository)
   :head-repository (get-in pull-request [:head :repo :full_name])
   :head-repository-id (get-in pull-request [:head :repo :id])
   :state (:state pull-request)
   :draft? (:draft pull-request)
   :head-sha (get-in pull-request [:head :sha])
   :merge-sha (:merge_commit_sha pull-request)
   :mergeable? (:mergeable pull-request)
   :base-branch (get-in pull-request [:base :ref])
   :base-sha (get-in pull-request [:base :sha])
   :html-url (:html_url pull-request)
   :labels (->> (:labels pull-request)
                (keep :name)
                set)})

(defn github-issue->current
  [issue repository default-branch-ref]
  (let [{marker-count :count task-uuid :uuid}
        (canonical-task-marker (:body issue))]
    {:number (:number issue)
     :node-id (:node_id issue)
     :repository (:full_name repository)
     :repository-id (:id repository)
     :state (:state issue)
     :pull-request? (some? (:pull_request issue))
     :html-url (:html_url issue)
     :labels (->> (:labels issue)
                  (map :name)
                  set)
     :canonical-task-uuid task-uuid
     :canonical-task-marker-count marker-count
     :default-branch (:default_branch repository)
     :default-branch-ref (:ref default-branch-ref)
     :default-branch-sha (get-in default-branch-ref [:object :sha])
     :default-branch-object-type (get-in default-branch-ref [:object :type])
     :repository-archived? (:archived repository)
     :repository-disabled? (:disabled repository)}))

(defn github-workflow-run->current [workflow-run]
  {:id (:id workflow-run)
   :node-id (:node_id workflow-run)
   :workflow-id (:workflow_id workflow-run)
   :repository (get-in workflow-run [:repository :full_name])
   :repository-id (get-in workflow-run [:repository :id])
   :path (:path workflow-run)
   :event (:event workflow-run)
   :status (:status workflow-run)
   :conclusion (:conclusion workflow-run)
   :head-sha (:head_sha workflow-run)
   :head-branch (:head_branch workflow-run)
   :run-attempt (:run_attempt workflow-run)
   :url (:url workflow-run)
   :html-url (:html_url workflow-run)
   :actor-id (get-in workflow-run [:actor :id])
   :actor-login (get-in workflow-run [:actor :login])
   :triggering-actor-id (get-in workflow-run [:triggering_actor :id])
   :triggering-actor-login (get-in workflow-run [:triggering_actor :login])})
