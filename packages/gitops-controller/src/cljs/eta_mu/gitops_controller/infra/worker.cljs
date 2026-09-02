(ns eta-mu.gitops-controller.infra.worker
  "Single-writer durable queue worker for revision-bound review dispatch.

  One application composition owns a state root. The in-memory `:in-flight`
  set rejects overlapping work inside that process; immutable filesystem claims
  remain a fail-closed backstop and never grant a competing invocation authority
  to write a terminal result."
  (:require [eta-mu.gitops-controller.domain.admission :as admission]
            [eta-mu.gitops-controller.domain.issue :as issue]
            [eta-mu.gitops-controller.domain.review :as review]
            [eta-mu.gitops-controller.extern.runtime :as runtime]
            [eta-mu.gitops-controller.infra.store :as store]
            [eta-mu.gitops-controller.law.webhook :as law]))

(defn create
  [{:keys [store github authority effect-lease mode workflow policy
           replay-interval-ms]}]
  (let [effective-policy (or policy {:mode mode :workflow workflow})
        effective-mode (or (:mode effective-policy) mode :observe-only)
        effective-workflow (or (:workflow effective-policy) workflow)
        effective-effect-lease (or effect-lease
                                   (:effect-lease effective-policy))]
    (when-not (contains? law/controller-modes effective-mode)
      (throw (ex-info "invalid controller mode" {:mode effective-mode})))
    (when (and mode (not= mode effective-mode))
      (throw (ex-info "worker mode conflicts with current policy"
                      {:mode mode :policy-mode effective-mode})))
    (when (and workflow (not= workflow effective-workflow))
      (throw (ex-info "worker workflow conflicts with current policy"
                      {:workflow workflow
                       :policy-workflow effective-workflow})))
    (when (and (= :review-dispatch effective-mode)
               (not (and (fn? (:status! effective-effect-lease))
                         (fn? (:authorize! effective-effect-lease)))))
      (throw (ex-info "review-dispatch mode requires an effect-lease port"
                      {:error/code :effect-lease-required})))
    {:store store
     :github github
     :authority authority
     :effect-lease effective-effect-lease
     :policy (assoc effective-policy
                    :mode effective-mode
                    :workflow effective-workflow)
     :mode effective-mode
     :workflow effective-workflow
     :replay-interval-ms replay-interval-ms
     :state* (atom {:running? false
                    :starting? false
                    :fatal? false
                    :startup {:complete? false
                              :recovered? false}
                    :in-flight #{}
                    :effect-owner nil
                    :effect-lease {:state (if effective-effect-lease
                                            :unchecked
                                            :not-applicable)
                                   :effects-allowed? false}
                    :dependency {:github :unchecked}
                    :last-error nil})
     :timer* (atom nil)}))

(defn status [worker]
  (let [state @(:state* worker)]
    {:mode (:mode worker)
     :running? (:running? state)
     :starting? (:starting? state)
     :fatal? (:fatal? state)
     :startup (:startup state)
     :in-flight (count (:in-flight state))
     :effect-lease (:effect-lease state)
     :dependency (:dependency state)
     :last-error (:last-error state)}))

(defn- error-code [error]
  (or (:error/code (ex-data error)) :unexpected-worker-failure))

(def ^:private structural-error-codes
  #{:admission-not-durable
    :completion-not-durable
    :immutable-state-conflict
    :ledger-quarantine-conflict
    :ledger-receipt-not-durable
    :unexpected-worker-failure})

(defn- disable! [worker]
  (when-let [timer @(:timer* worker)]
    (runtime/cancel! timer)
    (reset! (:timer* worker) nil))
  (swap! (:state* worker) assoc
         :running? false
         :starting? false
         :fatal? true))

(defn- enabled-state? [state]
  (and (not (:fatal? state))
       (or (:running? state) (:starting? state))))

(defn- ensure-enabled! [worker]
  (when-not (enabled-state? @(:state* worker))
    (throw (ex-info "controller worker is disabled"
                    {:error/code :worker-disabled}))))

(defn- enter! [worker delivery-id]
  (let [entered? (atom false)]
    (swap! (:state* worker)
           (fn [state]
             (if (or (not (enabled-state? state))
                     (contains? (:in-flight state) delivery-id))
               state
               (do
                 (reset! entered? true)
                 (update state :in-flight conj delivery-id)))))
    @entered?))

(defn- leave! [worker delivery-id]
  (swap! (:state* worker) update :in-flight disj delivery-id))

(defn- enter-effect! [worker delivery-id]
  (let [entered? (atom false)]
    (swap! (:state* worker)
           (fn [state]
             (if (or (not (enabled-state? state))
                     (:effect-owner state))
               state
               (do
                 (reset! entered? true)
                 (assoc state :effect-owner delivery-id)))))
    @entered?))

(defn- leave-effect! [worker delivery-id]
  (swap! (:state* worker)
         (fn [state]
           (if (= delivery-id (:effect-owner state))
             (assoc state :effect-owner nil)
             state))))

(defn- dependency! [worker value]
  (swap! (:state* worker) assoc :dependency {:github value}))

(defn ^:async refresh-effect-lease! [worker]
  (let [lease-status
        (if-let [status! (get-in worker [:effect-lease :status!])]
          (await (status!))
          {:state :not-applicable :effects-allowed? false})]
    (swap! (:state* worker) assoc :effect-lease lease-status)
    lease-status))

(defn- ^:async authorize-effect! [worker delivery-id]
  (let [decision (await ((get-in worker [:effect-lease :authorize!])
                         delivery-id))]
    (swap! (:state* worker) assoc
           :effect-lease (assoc (:lease decision) :basis (:basis decision)))
    decision))

(defn- mutating-command? [command]
  (contains? #{:code-review :review-gate-reconcile
               :review-gate-invalidate
               :review-gate-completion}
             (law/command-type (:command/type command))))

(defn- durable-dispatch-current? [durable planned]
  (= (select-keys durable
                  [:event :action :repository :workflow :workflow-id :ref :gate-check
                   :inputs])
     (select-keys planned
                  [:event :action :repository :workflow :workflow-id :ref :gate-check
                   :inputs])))

(defn- result-context
  ([mode command]
   (result-context mode command nil))
  ([mode command plan]
   (let [dispatch (:dispatch plan)
         probe (:probe plan)]
     (cond-> {:command/type (law/command-type (:command/type command))
              :event (:event command)
              :action (:action command)
              :repository (:repository command)
              :pr-number (:pull-request-number command)
              :command-id (:command-id command)
              :mode mode}
       (:label command) (assoc :label (:label command))
       (or dispatch probe)
       (assoc :pr-head-sha (or (get-in dispatch [:inputs :pr_head_sha])
                               (:pr-head-sha probe)))
       (get-in dispatch [:inputs :pr_base_sha])
       (assoc :pr-base-sha (get-in dispatch [:inputs :pr_base_sha]))
       (get-in dispatch [:inputs :pr_merge_sha])
       (assoc :pr-merge-sha (get-in dispatch [:inputs :pr_merge_sha]))
       dispatch
       (assoc :workflow (:workflow dispatch)
              :ref (:ref dispatch))
       (get-in dispatch [:inputs :gate_check_id])
       (assoc :gate-check-id (get-in dispatch [:inputs :gate_check_id]))))))

(defn- issue-result-context [mode command]
  {:command/type :issue-probe
   :event (:event command)
   :action (:action command)
   :label (:label command)
   :repository (:repository command)
   :repository-id (:repository-id command)
   :installation-id (:installation-id command)
   :issue-number (:issue-number command)
   :issue-node-id (:issue-node-id command)
   :sender-id (:sender-id command)
   :sender-login (:sender-login command)
   :command-id (:command-id command)
   :mode mode})

(defn- ^:async record-attempt-failure-safely!
  [worker delivery-id stage code]
  (try
    (await (store/record-attempt-failure! (:store worker)
                                          delivery-id stage code))
    (catch :default ledger-error
      (runtime/error!
       (str "eta-mu could not record worker failure: "
            (name (error-code ledger-error)))))))

(defn- ^:async latest-evidence-correlation
  [store command plan]
  (when-let [intent
             (await
              (store/find-latest-code-review-intent
               store (:repository command) (:repository-id command)
               (:pull-request-number command) (:pull-request-node-id command)
               (get-in plan [:dispatch :inputs :pr_base_sha])
               (get-in plan [:dispatch :inputs :pr_head_sha])
               (get-in plan [:dispatch :inputs :pr_merge_sha])))]
    (let [source-delivery-id (:delivery/id intent)]
      (when (await (store/workflow-run-correlation-recorded?
                    store source-delivery-id))
        (let [correlation
              (await (store/read-workflow-run-correlation
                      store source-delivery-id))]
          (when-not (and (= (:dispatch intent)
                            (get-in correlation [:correlation :dispatch]))
                         (= source-delivery-id
                            (get-in correlation
                                    [:correlation :command :command-id])))
            (throw
             (ex-info
              "latest code-review intent has the wrong run correlation"
              {:error/code :immutable-state-conflict
               :delivery-id source-delivery-id})))
          correlation)))))

(defn- ^:async ensure-current-dispatch!
  [{:keys [github] :as worker} command dispatch]
  (ensure-enabled! worker)
  (let [current (await ((:fetch-pull-request! github) command))]
    (dependency! worker :available)
    (when-not (review/dispatch-command-current? command dispatch current)
      (throw
       (ex-info "pull-request or command context changed before GitHub effect"
                {:error/code :pull-request-context-changed
                 :repository (:repository command)
                 :pr-number (:pull-request-number command)})))
    current))

(def ^:private superseded-gate-identity-keys
  [:id :name :merge-sha :external-id :app-id :delivery-id])

(defn- ^:async complete-superseded-gate!
  [store mode delivery-id command plan gate-check]
  (when-not (and (= "completed" (:status gate-check))
                 (= "cancelled" (:conclusion gate-check))
                 (law/positive-integer? (:id gate-check))
                 (law/positive-integer?
                  (:superseded-by-check-id gate-check))
                 (< (:id gate-check) (:superseded-by-check-id gate-check)))
    (throw (ex-info "invalid superseded review gate evidence"
                    {:error/code :invalid-review-gate-check
                     :gate-check-id (:id gate-check)})))
  (when (await (store/gate-check-recorded? store delivery-id))
    (let [durable (:gate-check
                   (await (store/read-gate-check store delivery-id)))]
      (when-not (= (select-keys durable superseded-gate-identity-keys)
                   (select-keys gate-check superseded-gate-identity-keys))
        (throw (ex-info "superseded gate disagrees with durable identity"
                        {:error/code :immutable-state-conflict
                         :delivery-id delivery-id})))))
  (await
   (store/complete!
    store delivery-id
    (merge (result-context mode command plan)
           {:outcome :gate-superseded
            :gate-check-id (:id gate-check)
            :superseded-by-check-id (:superseded-by-check-id gate-check)}))))

(defn write-authorizer
  "Return a callback that revalidates all dynamic GitHub write authority."
  [worker delivery-id command dispatch require-current?]
  (^:async fn []
    (when-not (= :review-dispatch (:mode worker))
      (throw (ex-info "GitHub mutation is disabled outside review-dispatch mode"
                      {:error/code :github-mutation-disabled})))
    (when require-current?
      (await (ensure-current-dispatch! worker command dispatch)))
    ;; The dynamic Services marker is the final remote-independent read before
    ;; the adapter mutates GitHub.
    (let [lease (await (authorize-effect! worker delivery-id))]
      (ensure-enabled! worker)
      (when-not (:allowed? lease)
        (throw (ex-info "effect lease was revoked before GitHub write"
                        {:error/code :effect-lease-revoked})))
      true)))

(defn- ^:async execute-dispatch!
  [{:keys [store github mode] :as worker} delivery-id command plan
   stage* call-begun?* dispatch*]
  (ensure-enabled! worker)
  ;; The marker is dynamic Services state. Re-read after GitHub validation,
  ;; immediately before the immutable dispatch claim, so rollback revokes
  ;; future effects.
  (reset! stage* :effect-lease)
  (let [lease-decision (await (authorize-effect! worker delivery-id))]
    (when (:allowed? lease-decision)
      (ensure-enabled! worker)
      (reset! stage* :claim-dispatch)
      ;; An intent without a workflow-call marker is safe to replay. Check Run
      ;; creation is idempotently reconciled by its immutable external_id.
      (await (store/claim-dispatch! store delivery-id (:dispatch plan)))
      (ensure-enabled! worker)
      (let [command-type (law/command-type (:command/type command))
            invalidation? (= :review-gate-invalidate command-type)
            _ (when (= :review-gate-reconcile command-type)
                (reset! stage* :resolve-latest-code-review-intent))
            evidence-receipt
            (when (= :review-gate-reconcile command-type)
              (await (latest-evidence-correlation store command plan)))]
        ;; Rollback may revoke authority while the idempotent Check operation
        ;; is in flight. A lifecycle event must first bind the newest durable
        ;; exact-PR/head code-review intent in ledger arrival order. If that
        ;; intent has no returned run yet, keep the lifecycle command pending
        ;; before creating/cancelling any gate; never fall back to an older run.
        (when (or (not= :review-gate-reconcile command-type)
                  evidence-receipt)
          (reset! stage* :validate-prepared-merge-context)
          (await (ensure-current-dispatch! worker command (:dispatch plan)))
          (reset! stage* :prepare-review-gate)
          (let [gate-write-authorizer
                (write-authorizer worker delivery-id command
                                  (:dispatch plan) true)
                expected-gate
                (with-meta (get-in plan [:dispatch :gate-check])
                  {:authorize-create! gate-write-authorizer
                   :authorize-cancel! gate-write-authorizer})
                gate-check
                (await ((:prepare-review-gate! github)
                        (:installation-id command)
                        expected-gate))]
            (if (:superseded? gate-check)
              (await (complete-superseded-gate!
                      store mode delivery-id command plan gate-check))
              (let [_ (reset! stage* :record-review-gate)
                    gate-receipt (await (store/record-gate-check!
                                         store delivery-id gate-check))
                    evidence-correlation (:correlation evidence-receipt)
                    final-dispatch
                    (cond-> (:dispatch plan)
                      (= :review-gate-reconcile command-type)
                      (assoc-in [:inputs :gate_check_id]
                                (str (get-in gate-receipt [:gate-check :id])))

                      evidence-correlation
                      (assoc-in [:inputs :evidence_run_id]
                                (str (get-in evidence-correlation
                                             [:workflow-run :id])))

                      evidence-correlation
                      (assoc-in [:inputs :evidence_command_id]
                                (get-in evidence-correlation
                                        [:dispatch :inputs :command_id])))
                    final-plan (assoc plan :dispatch final-dispatch)]
                (reset! dispatch* final-dispatch)
                (if invalidation?
                  (await
                   (store/complete!
                    store delivery-id
                    (merge (result-context mode command final-plan)
                           {:outcome :gate-invalidated
                            :gate-check-id (get-in gate-receipt
                                                   [:gate-check :id])})))
                  ;; Re-read the Services marker and exact merge context before
                  ;; crossing the non-idempotent workflow-dispatch boundary.
                  (do
                    (reset! stage* :pre-dispatch-effect-lease)
                    (let [final-lease
                          (await (authorize-effect! worker delivery-id))]
                      (when (:allowed? final-lease)
                        (ensure-enabled! worker)
                        (reset! stage* :validate-dispatch-merge-context)
                        (await (ensure-current-dispatch!
                                worker command final-dispatch))
                        (reset! stage* :dispatch-review)
                        (let [base-authorizer
                              (write-authorizer worker delivery-id command
                                                final-dispatch true)
                              authorized-dispatch
                              (with-meta final-dispatch
                                {:authorize-dispatch!
                                 (^:async fn []
                                   (await (base-authorizer))
                                   ;; This marker is persisted only after the
                                   ;; adapter reaches its immediate pre-POST
                                   ;; boundary. A denied lease cannot create a
                                   ;; false uncertain-call receipt.
                                   (reset! stage* :begin-dispatch-call)
                                   (let [created?
                                         (await
                                          (store/begin-dispatch-call!
                                           store delivery-id final-dispatch))]
                                     ;; A false return proves the same durable
                                     ;; non-idempotent boundary as a fresh
                                     ;; marker. Set the catch-path fact before
                                     ;; refusing to invoke GitHub again.
                                     (reset! call-begun?* true)
                                     (when-not created?
                                       (throw
                                        (ex-info
                                         "workflow dispatch call was already begun"
                                         {:error/code
                                          :dispatch-outcome-uncertain}))))
                                   (ensure-enabled! worker)
                                   true)})
                              dispatch-result
                              (await ((:dispatch-review! github)
                                      (:installation-id command)
                                      authorized-dispatch))
                              workflow-run
                              {:id (:workflow-run-id dispatch-result)
                               :url (:run-url dispatch-result)
                               :html-url (:html-url dispatch-result)}]
                          ;; Persist the only non-reconstructible response
                          ;; identity before any secondary API read.
                          (reset! stage* :correlate-returned-workflow-run)
                          (await
                           (store/record-workflow-run-correlation!
                            store delivery-id
                            {:command command
                             :dispatch final-dispatch
                             :expected-run-attempt 1
                             :gate-check (merge
                                          (get-in final-dispatch [:gate-check])
                                          (get-in gate-receipt [:gate-check]))
                             :workflow-run workflow-run}))
                          (reset! stage* :complete-dispatch)
                          (await
                           (store/complete!
                            store delivery-id
                            (merge (result-context mode command final-plan)
                                   {:outcome :dispatched
                                    :workflow-run workflow-run}
                                   (select-keys dispatch-result
                                                [:workflow-run-id :run-url
                                                 :html-url])))))))))))))))))

(defn- ^:async cancel-stale-intent!
  [{:keys [store github mode] :as worker} delivery-id command plan durable
   stage*]
  (when-not (await (store/dispatch-call-begun? store delivery-id))
    (reset! stage* :cancel-stale-review-gate)
    (await ((:cancel-review-gate! github)
            (:installation-id command)
            (with-meta (:gate-check durable)
              {:authorize-cancel!
               (write-authorizer worker delivery-id command durable false)})
            "The pull-request head or command context changed before workflow dispatch."))
    (await
     (store/complete!
      store delivery-id
      (merge (result-context mode command plan)
             {:outcome :refused
              :reason :durable-dispatch-intent-stale
              :durable-pr-base-sha (get-in durable [:inputs :pr_base_sha])
              :durable-pr-head-sha (get-in durable [:inputs :pr_head_sha])
              :durable-pr-merge-sha (get-in durable
                                            [:inputs :pr_merge_sha])})))))

(defn- ^:async durable-gate-for-delivery
  [store delivery-id]
  (when (await (store/dispatch-intent-recorded? store delivery-id))
    (let [dispatch (:dispatch
                    (await (store/read-dispatch-intent store delivery-id)))
          receipt (when (await (store/gate-check-recorded? store delivery-id))
                    (await (store/read-gate-check store delivery-id)))]
      {:dispatch dispatch
       :gate-check (merge (:gate-check dispatch) (:gate-check receipt))})))

(defn- ^:async complete-pre-dispatch-refusal!
  "Cancel an exact durable pending gate before recording a refusal. A durable
  call-begun marker is never rewritten as a pre-dispatch refusal."
  [{:keys [store github mode] :as worker} delivery-id command result stage*]
  (if (await (store/dispatch-call-begun? store delivery-id))
    nil
    (do
      ;; A downgrade replay may carry a gate prepared by a prior mutation-mode
      ;; deployment. Observe-only records the refusal but never PATCHes that
      ;; historical GitHub object, even if an old marker or canary is active.
      (when (= :review-dispatch mode)
        (when-let [{:keys [dispatch gate-check]}
                   (await (durable-gate-for-delivery store delivery-id))]
          (reset! stage* :cancel-gate-before-refusal)
          (await
           ((:cancel-review-gate! github)
            (:installation-id command)
            (with-meta gate-check
              {:authorize-cancel!
               (write-authorizer worker delivery-id command dispatch false)})
            "The admitted command was refused before workflow dispatch."))))
      (await (store/complete! store delivery-id result)))))

(defn- ^:async complete-correlated-gate!
  [{:keys [store github policy] :as worker} delivery-id command correlation
   source-delivery-id original-command stage*]
  (reset! stage* :fetch-completed-workflow-run)
  (let [workflow-run
        (await
         ((:fetch-workflow-run! github)
          {:installation-id (:installation-id command)
           :repository (:repository command)
           :workflow-run-id (:workflow-run-id command)}))
        _ (reset! stage* :fetch-completion-pull-request)
        current-pull-request
        (await ((:fetch-pull-request! github) original-command))
        plan (review/trusted-workflow-completion-plan
              command correlation source-delivery-id workflow-run
              current-pull-request
              (:controller-app-login policy))]
    (dependency! worker :available)
    (if-not (:planned? plan)
      ;; GitHub may report mergeable:null while it computes the test merge.
      ;; Leave that signed completion pending for periodic replay; all
      ;; definitive workflow or pull-request drift remains terminally refused.
      (when-not (= :pull-request-test-merge-not-ready (:reason plan))
        (await
         (store/complete!
          store delivery-id
          {:outcome :refused
           :command/type :review-gate-completion
           :workflow-run-id (:workflow-run-id command)
           :reason (:reason plan)})))
      (do
        (reset! stage* :record-gate-terminal-intent)
        (await (store/record-gate-terminal-intent!
                store delivery-id (:terminal-intent plan)))
        ;; Re-read the dynamic marker immediately before the idempotent PATCH.
        (reset! stage* :pre-complete-effect-lease)
        (let [final-lease (await (authorize-effect! worker source-delivery-id))]
          (when (:allowed? final-lease)
            (ensure-enabled! worker)
            (reset! stage* :complete-review-gate)
            (let [result
                  (await
                   ((:complete-review-gate! github)
                    (:installation-id command)
                    {:gate-check (:gate-check plan)
                     :workflow-run (:workflow-run plan)
                     :terminal-intent (:terminal-intent plan)
                     :authorize-patch!
                     (^:async fn []
                       (await
                        ((write-authorizer
                          worker source-delivery-id original-command
                          (:dispatch correlation) true))))}))]
              (await
               (store/complete!
                store delivery-id
                {:outcome (if (:superseded? result)
                            :gate-superseded
                            :gate-completed)
                 :command/type :review-gate-completion
                 :workflow-run-id (:workflow-run-id command)
                 :source-delivery-id source-delivery-id
                 :gate-check-id (get-in plan
                                        [:terminal-intent :gate-check-id])
                 :conclusion (get-in plan
                                     [:terminal-intent :patch :conclusion])
                 :updated (:updated? result)})))))))))

(defn- ^:async process-workflow-completion!
  [{:keys [store mode] :as worker} delivery-id command stage*]
  (reset! stage* :resolve-workflow-run-correlation)
  (if-let [receipt
           (await (store/find-workflow-run-correlation
                   store (:repository-id command)
                   (:workflow-run-id command)
                   (:workflow-run-run-attempt command)))]
    (let [correlation (:correlation receipt)
          source-delivery-id (:delivery/id receipt)
          original-command (:command correlation)]
      (cond
        (not= :review-dispatch mode)
        (await
         (store/complete!
          store delivery-id
          {:outcome :observed
           :command/type :review-gate-completion
           :workflow-run-id (:workflow-run-id command)}))

        (or (not= (:repository command) (:repository original-command))
            (not= (:repository-id command) (:repository-id original-command))
            (not= (:installation-id command)
                  (:installation-id original-command)))
        (await
         (store/complete!
          store delivery-id
          {:outcome :refused
           :command/type :review-gate-completion
           :reason :workflow-run-correlation-scope-changed}))

        :else
        (do
          ;; Provisional completion inherits only the correlated source command
          ;; (including a canary GUID), never the unpredictable callback GUID.
          (reset! stage* :completion-effect-lease)
          (let [lease (await (authorize-effect! worker source-delivery-id))]
            (when (:allowed? lease)
              (await (complete-correlated-gate!
                      worker delivery-id command correlation
                      source-delivery-id original-command stage*)))))))
    ;; GitHub can deliver workflow_run:completed before the dispatch response's
    ;; run identity is durably projected. With actor/path/workflow admission
    ;; already bounded, leave unmatched completion evidence pending until a
    ;; durable correlation appears; future retention policy may garbage collect
    ;; it without granting effects.
    nil))

(defn- ^:async process-issue-probe!
  [{:keys [store github authority mode policy] :as worker}
   delivery-id command stage*]
  (reset! stage* :fetch-issue)
  (let [current-issue (await ((:fetch-issue! github) command))
        _ (reset! stage* :authorize-actor)
        authority-decision (await ((:authorize! authority) command))
        plan (issue/plan command current-issue authority-decision policy)]
    (dependency! worker :available)
    (await
     (store/complete!
      store delivery-id
      (if (:planned? plan)
        (merge (issue-result-context mode command)
               {:outcome :probed
                :probe (:probe plan)})
        (merge (issue-result-context mode command)
               {:outcome :refused
                :reason (:reason plan)}))))))

(defn- ^:async process-current-command!
  [{:keys [store github authority mode] :as worker} delivery-id command
   policy-decision stage* call-begun?* dispatch*]
  (reset! stage* :fetch-pull-request)
  (let [current-pull-request
        (await ((:fetch-pull-request! github) command))
        _ (reset! stage* :authorize-actor)
        authority-decision (await ((:authorize! authority) command))
        planned (review/plan command current-pull-request authority-decision
                             (:workflow policy-decision))
        plan (if-let [dispatch (:dispatch planned)]
               (assoc planned :dispatch
                      (assoc dispatch :workflow-id
                             (:workflow-id policy-decision)))
               planned)]
    (reset! dispatch* (:dispatch plan))
    (dependency! worker :available)
    (cond
      (not (:planned? plan))
      (when-not (= :pull-request-test-merge-not-ready (:reason plan))
        (await
         (complete-pre-dispatch-refusal!
          worker delivery-id command
          (merge (result-context mode command plan)
                 {:outcome :refused :reason (:reason plan)})
          stage*)))

      (= :ingress-probe (law/command-type (:command/type command)))
      (await
       (store/complete!
        store delivery-id
        (merge (result-context mode command plan) {:outcome :probed})))

      (= :observe-only mode)
      (await
       (store/complete!
        store delivery-id
        (merge (result-context mode command plan)
               {:outcome :observed :dispatch (:dispatch plan)})))

      :else
      (let [intent-recorded?
            (await (store/dispatch-intent-recorded? store delivery-id))
            durable (when intent-recorded?
                      (:dispatch
                       (await (store/read-dispatch-intent store delivery-id))))]
        (if (and durable
                 (not (durable-dispatch-current? durable (:dispatch plan))))
          (await (cancel-stale-intent! worker delivery-id command plan durable
                                       stage*))
          (await (execute-dispatch! worker delivery-id command plan
                                    stage* call-begun?* dispatch*)))))))

(defn- uncertain-completion [dispatch]
  {:outcome :held
   :reason :dispatch-outcome-uncertain
   :command/type (law/command-type (:command/type dispatch))
   :event (:event dispatch)
   :action (:action dispatch)
   :repository (:repository dispatch)
   :workflow (:workflow dispatch)
   :ref (:ref dispatch)
   :pr-number (js/Number (get-in dispatch [:inputs :pr_number]))
   :pr-base-sha (get-in dispatch [:inputs :pr_base_sha])
   :pr-head-sha (get-in dispatch [:inputs :pr_head_sha])
   :pr-merge-sha (get-in dispatch [:inputs :pr_merge_sha])
   :command-id (get-in dispatch [:inputs :command_id])})

(defn- ^:async hold-uncertain! [worker delivery-id startup?]
  (let [call (await (store/read-dispatch-call
                     (:store worker) delivery-id))
        result (cond-> (uncertain-completion (:dispatch call))
                 startup? (assoc :recovered-on-startup true))]
    (await (store/complete! (:store worker) delivery-id result))))

(defn ^:async process-delivery!
  [{:keys [store mode policy] :as worker} delivery-id]
  (when (enter! worker delivery-id)
    (let [stage* (atom :load-delivery)
          call-begun?* (atom false)
          effect-entered?* (atom false)
          command* (atom nil)
          dispatch* (atom nil)]
      (try
        ;; Classify the non-idempotent boundary only after acquiring this
        ;; delivery's owner. No concurrent invocation can publish the marker
        ;; between this check and ordinary processing in the single-replica
        ;; composition.
        (when-not
         (or (await (store/completed? store delivery-id))
             (when (await (store/dispatch-call-begun? store delivery-id))
               (reset! stage* :recover-uncertain-dispatch)
               (await (hold-uncertain! worker delivery-id false))
               true))
          (let [receipt (await (store/read-delivery store delivery-id))
                command (:command receipt)
                policy-decision (admission/current-policy-decision
                                 policy command)
                completion-command?
                (= :review-gate-completion
                   (law/command-type (:command/type command)))
                effect-command? (mutating-command? command)]
            (reset! command* command)
            ;; Refusal cleanup is itself a mutating defensive effect, so the
            ;; same single-writer exclusion applies before policy branching.
            (when (or (not effect-command?)
                      (enter-effect! worker delivery-id))
              (when effect-command?
                (reset! effect-entered?* true))
              (if-not (:allowed? policy-decision)
                (await
                 (complete-pre-dispatch-refusal!
                  worker delivery-id command
                  (merge (result-context mode command)
                         {:outcome :refused
                          :reason (:reason policy-decision)})
                  stage*))
                ;; Only one mutating command may cross admission at a time in
                ;; this single-replica composition. A competing delivery stays
                ;; pending and is picked up by periodic replay.
                  (let [lease-required? (and (= :review-dispatch mode)
                                             effect-command?
                                             (not completion-command?))
                        initial-lease
                        (when lease-required?
                          (reset! stage* :preflight-effect-lease)
                          (await (authorize-effect! worker delivery-id)))]
                    ;; A provisional candidate deliberately leaves ordinary work
                    ;; pending before any GitHub call. Activation causes periodic
                    ;; replay; a configured deployment canary is the sole bypass.
                    (when (or (not lease-required?) (:allowed? initial-lease))
                      (if completion-command?
                        (await (process-workflow-completion!
                                worker delivery-id command stage*))
                        (if (= :issue-probe
                               (law/command-type (:command/type command)))
                          (await
                           (process-issue-probe!
                            worker delivery-id command stage*))
                          (await
                           (process-current-command!
                            worker delivery-id command policy-decision
                            stage* call-begun?* dispatch*))))))))))
        (catch :default error
          (let [code (error-code error)
                stage @stage*]
            (await (record-attempt-failure-safely! worker delivery-id
                                                   stage code))
            (swap! (:state* worker) assoc
                   :dependency {:github :degraded}
                   :last-error {:delivery-id delivery-id
                                :stage stage
                                :error/code code})
            (when (contains? structural-error-codes code)
              (disable! worker))
            (when (and @call-begun?*
                       (not (await (store/completed? store delivery-id))))
              (try
                (await
                 (store/complete!
                  store delivery-id
                  (merge
                   (result-context mode @command* {:dispatch @dispatch*})
                   {:outcome :held
                    :reason :dispatch-outcome-uncertain
                    :error/code code})))
                (catch :default completion-error
                  (swap! (:state* worker) assoc
                         :dependency {:github :degraded}
                         :last-error
                         {:delivery-id delivery-id
                          :stage :persist-uncertain-completion
                          :error/code :completion-not-durable})
                  (disable! worker)
                  (throw
                   (ex-info
                    "eta-mu could not persist uncertain completion"
                    {:error/code :completion-not-durable
                     :cause/code (error-code completion-error)}
                    completion-error)))))
            (when (contains? structural-error-codes code)
              (throw error))))
        (finally
          (when @effect-entered?*
            (leave-effect! worker delivery-id))
          (leave! worker delivery-id))))))

(defn- ^:async process-safely! [worker delivery-id scheduled-stage]
  (try
    (await (process-delivery! worker delivery-id))
    (catch :default error
      (let [code (error-code error)]
        (swap! (:state* worker) assoc
               :last-error {:delivery-id delivery-id
                            :stage scheduled-stage
                            :error/code code})
        (disable! worker)
        (runtime/error! (str "eta-mu scheduled worker failed: "
                             (name code)))))))

(defn enqueue! [worker delivery-id]
  (runtime/schedule!
   #(process-safely! worker delivery-id :scheduled-delivery))
  nil)

(defn ^:async recover-uncertain! [worker]
  (let [delivery-ids (await
                      (store/uncertain-outbox-ids (:store worker)))]
    (doseq [delivery-id delivery-ids]
      (await (hold-uncertain! worker delivery-id true)))
    (count delivery-ids)))

(defn ^:async replay-pending! [worker]
  (let [delivery-ids (await (store/pending-delivery-ids (:store worker)))]
    (doseq [delivery-id delivery-ids]
      (await (process-delivery! worker delivery-id)))
    {:replayed (count delivery-ids)}))

(defn- ^:async replay-safely! [worker]
  (try
    (await (replay-pending! worker))
    (catch :default error
      (let [code (error-code error)]
        (swap! (:state* worker) assoc
               :last-error {:stage :replay-pending
                            :error/code code})
        (disable! worker)
        (runtime/error! (str "eta-mu replay failed: " (name code)))))))

(defn ^:async recover-startup! [worker]
  (let [state @(:state* worker)]
    (when-not (and (:starting? state)
                   (not (:running? state))
                   (empty? (:in-flight state)))
      (throw (ex-info "startup recovery requires exclusive lifecycle ownership"
                      {:error/code :startup-recovery-not-exclusive}))))
  (let [reconciliation (await (store/reconcile-ledgers! (:store worker)))
        held-count (await (recover-uncertain! worker))
        replay (await (replay-pending! worker))]
    {:reconciliation reconciliation
     :held held-count
     :replayed (:replayed replay)}))

(defn ^:async start! [worker]
  (let [claimed? (atom false)]
    (swap! (:state* worker)
           (fn [state]
             (if (or (:running? state)
                     (:starting? state)
                     (seq (:in-flight state)))
               state
               (do
                 (reset! claimed? true)
                 (assoc state
                        :running? false
                        :starting? true
                        :fatal? false
                        :startup {:complete? false :recovered? false})))))
    (when-not @claimed?
      (throw (ex-info "controller worker is already active"
                      {:error/code :worker-already-started}))))
  (try
    (let [recovery (await (recover-startup! worker))
          lease-status (await (refresh-effect-lease! worker))]
      (when (:fatal? @(:state* worker))
        (throw (ex-info "startup recovery disabled the worker"
                        {:error/code :startup-recovery-failed})))
      (swap! (:state* worker) assoc
             :running? true
             :starting? false
             :startup {:complete? true
                       :recovered? true
                       :evidence (assoc recovery :effect-lease lease-status)}
             :last-error nil)
      (reset! (:timer* worker)
              (runtime/every! (:replay-interval-ms worker)
                              #(replay-safely! worker)))
      worker)
    (catch :default error
      (let [code (error-code error)]
        (swap! (:state* worker) assoc
               :running? false
               :starting? false
               :fatal? true
               :startup {:complete? true :recovered? false}
               :last-error {:stage :startup-recovery
                            :error/code code})
        (throw error)))))

(defn stop! [worker]
  (when-let [timer @(:timer* worker)]
    (runtime/cancel! timer))
  (reset! (:timer* worker) nil)
  (swap! (:state* worker) assoc :running? false :starting? false)
  worker)
