(ns eta-mu.gitops-controller.domain.admission-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.gitops-controller.domain.admission :as admission]
            [eta-mu.gitops-controller.domain.authority :as authority]
            [eta-mu.gitops-controller.domain.review :as review]
            [eta-mu.gitops-controller.law.webhook :as law]
            [eta-mu.gitops-controller.shape.webhook :as shape]))

(def command
  {:delivery-id "9eb17352-284c-4b55-879d-0d07f353fdee"
   :payload/sha256 (apply str (repeat 64 "a"))
   :event "pull_request"
   :action "labeled"
   :label "eta-mu:review"
   :installation-id 77
   :repository-id 42
   :repository "open-hax/eta-mu"
   :pull-request-number 321
   :pull-request-node-id "PR_kwDOExample"
   :sender-id 9
   :sender-login "operator"})

(def config
  {:mode :review-dispatch
   :policy-revision "review-policy-v1"
   :review-label "eta-mu:review"
   :probe-label "eta-mu:probe"
   :workflow "opencode-code-review.yml"
   :gate-workflow "review-resolution-gate.yml"
   :review-workflow-id 7001
   :gate-workflow-id 7002
   :controller-app-login "eta-mu-controller[bot]"
   :repository-allowlist #{"open-hax/eta-mu"}
   :installation-allowlist #{77}})

(deftest admission-requires-the-managed-command-and-both-allowlists
  (testing "the configured review label becomes a deterministic command"
    (is (= {:admitted? true
            :command (assoc command
                            :command-id (:delivery-id command)
                            :command/type :code-review
                            :capability :gitops/review
                            :admission
                            {:version 2
                             :mode :review-dispatch
                             :policy-revision "review-policy-v1"
                             :command/type :code-review
                             :review-label "eta-mu:review"
                             :workflow "opencode-code-review.yml"})}
           (admission/decide config command))))
  (testing "unmanaged and reserved labels are not interpreted"
    (let [decision (admission/decide config (assoc command :label "deploy"))]
      (is (:ignored? decision))
      (is (= :unmanaged-label (:reason decision)))))
  (testing "repository and installation allowlists are independent"
    (is (= :repository-not-allowed
           (:reason (admission/decide
                     config (assoc command :repository "open-hax/other")))))
    (is (= :installation-not-allowed
           (:reason (admission/decide
                     config (assoc command :installation-id 78)))))))

(deftest durable-admission-never-gains-authority-from-a-restart
  (let [admitted (:command (admission/decide config command))]
    (is (:allowed? (admission/current-policy-decision config admitted)))
    (is (= :admission-policy-changed
           (:reason
            (admission/current-policy-decision
             (assoc config :mode :observe-only
                    :policy-revision "observe-policy-v1")
             admitted))))
    (is (= :repository-authorization-revoked
           (:reason
            (admission/current-policy-decision
             (assoc config :repository-allowlist #{}) admitted))))
    (is (= :admission-policy-unbound
           (:reason
            (admission/current-policy-decision
             config (assoc admitted
                           :capability :gitops/reconcile-review-gate)))))))

(deftest observe-only-admission-does-not-require-mutation-workflow-ids
  (let [observe-config (-> config
                           (assoc :mode :observe-only
                                  :policy-revision "observe-policy-v1")
                           (dissoc :review-workflow-id
                                   :gate-workflow-id
                                   :controller-app-login))
        review (:command (admission/decide observe-config command))
        reconcile-source (-> command
                             (assoc :event "pull_request_review_thread"
                                    :action "resolved"
                                    :review-thread-node-id "PRRT_example")
                             (dissoc :label))
        reconcile (:command
                   (admission/decide observe-config reconcile-source))]
    (is (:allowed?
         (admission/current-policy-decision observe-config review)))
    (is (:allowed?
         (admission/current-policy-decision observe-config reconcile)))))

(deftest review-gate-events-and-probe-have-distinct-durable-authority
  (let [thread-command (-> command
                           (assoc :event "pull_request_review_thread"
                                  :action "resolved"
                                  :review-thread-node-id "PRRT_example")
                           (dissoc :label))
        gate (:command (admission/decide config thread-command))
        probe (:command (admission/decide
                         config (assoc command :label "eta-mu:probe")))]
    (is (= :review-gate-reconcile (:command/type gate)))
    (is (= :gitops/reconcile-review-gate (:capability gate)))
    (is (= "review-resolution-gate.yml"
           (get-in gate [:admission :workflow])))
    (is (= :review-gate-reconcile
           (:command/type (admission/current-policy-decision config gate))))
    (is (= :ingress-probe (:command/type probe)))
    (is (= :gitops/probe (:capability probe)))
    (is (nil? (get-in probe [:admission :workflow])))
    (is (:allowed? (admission/current-policy-decision config probe)))
    (is (= :invalid-review-event
           (:reason (admission/decide
                     config (dissoc thread-command :review-thread-node-id)))))))

(deftest every-gate-invalidating-webhook-has-event-specific-identity
  (doseq [[event action identity-key identity]
          [["pull_request_review" "submitted" :review-node-id "PRR_example"]
           ["pull_request_review" "dismissed" :review-node-id "PRR_example"]
           ["pull_request_review_comment" "created"
            :review-comment-node-id "PRRC_example"]
           ["pull_request_review_comment" "deleted"
            :review-comment-node-id "PRRC_example"]
           ["pull_request_review_thread" "resolved"
            :review-thread-node-id "PRRT_example"]
           ["pull_request_review_thread" "unresolved"
            :review-thread-node-id "PRRT_example"]]]
    (let [source (-> command
                     (assoc :event event :action action identity-key identity)
                     (dissoc :label))
          decision (admission/decide config source)]
      (is (:admitted? decision) (str event ":" action))
      (is (= :review-gate-reconcile
             (get-in decision [:command :command/type])))
      (is (= :invalid-review-event
             (:reason (admission/decide config
                                        (dissoc source identity-key)))))))
  (is (:ignored? (admission/decide
                  config
                  (-> command
                      (assoc :event "pull_request_review_comment"
                             :action "edited"
                             :review-comment-node-id "PRRC_example")
                      (dissoc :label))))))

(deftest defensive-pull-request-lifecycle-events-mint-no-workflow-authority
  (doseq [action ["opened" "reopened" "synchronize" "ready_for_review"]]
    (let [source (-> command
                     (assoc :action action)
                     (dissoc :label))
          admitted (:command (admission/decide config source))]
      (is (= :review-gate-invalidate (:command/type admitted)))
      (is (= :gitops/invalidate-review-gate (:capability admitted)))
      (is (nil? (get-in admitted [:admission :workflow])))
      (is (:allowed? (admission/current-policy-decision config admitted)))
      (is (:authorized?
           (authority/signed-review-event-decision
            (authority/request admitted))))))
  (is (= :review-gate-invalidate
         (get-in (admission/decide
                  config (-> command
                             (assoc :action "edited"
                                    :base-ref-before "release")
                             (dissoc :label)))
                 [:command :command/type])))
  (is (:ignored? (admission/decide
                  config (-> command
                             (assoc :action "edited")
                             (dissoc :label)))))
  (is (:ignored? (admission/decide
                  config (-> command
                             (assoc :action "closed")
                             (dissoc :label))))))

(deftest gate-reconciliation-plan-is-exact-head-and-label-independent
  (let [thread-command (-> command
                           (assoc :event "pull_request_review_thread"
                                  :action "resolved"
                                  :review-thread-node-id "PRRT_example")
                           (dissoc :label))
        admitted (:command (admission/decide config thread-command))
        current {:number 321
                 :node-id "PR_kwDOExample"
                 :repository "open-hax/eta-mu"
                 :repository-id 42
                 :default-branch "main"
                 :head-repository "open-hax/eta-mu"
                 :head-repository-id 42
                 :state "open"
                 :draft? false
                 :mergeable? true
                 :base-branch "main"
                 :base-sha "1111111111111111111111111111111111111111"
                 :head-sha "0123456789abcdef0123456789abcdef01234567"
                 :merge-sha "2222222222222222222222222222222222222222"
                 :html-url "https://github.com/open-hax/eta-mu/pull/321"
                 :labels #{}}
        plan (review/plan admitted current {:authorized? true}
                          "review-resolution-gate.yml")]
    (is (:planned? plan))
    (is (= :review-gate-reconcile
           (get-in plan [:dispatch :command/type])))
    (is (= "review-resolution-gate.yml"
           (get-in plan [:dispatch :workflow])))
    (is (= {:name "eta-mu-review-gate"
            :repository "open-hax/eta-mu"
            :repository-id 42
            :pr-number 321
            :pr-node-id "PR_kwDOExample"
            :base-branch "main"
            :base-sha "1111111111111111111111111111111111111111"
            :head-sha "0123456789abcdef0123456789abcdef01234567"
            :merge-sha "2222222222222222222222222222222222222222"
            :delivery-id "9eb17352-284c-4b55-879d-0d07f353fdee"
            :external-id
            (str "eta-mu-review-gate/v2:"
                 "9eb17352-284c-4b55-879d-0d07f353fdee:321:"
                 "0123456789abcdef0123456789abcdef01234567:"
                 "1111111111111111111111111111111111111111:"
                 "2222222222222222222222222222222222222222")
            :details-url "https://github.com/open-hax/eta-mu/pull/321"}
           (get-in plan [:dispatch :gate-check])))
    (is (= {:pr_number "321"
            :pr_base_sha "1111111111111111111111111111111111111111"
            :pr_head_sha "0123456789abcdef0123456789abcdef01234567"
            :pr_merge_sha "2222222222222222222222222222222222222222"
            :command_id "9eb17352-284c-4b55-879d-0d07f353fdee"}
           (get-in plan [:dispatch :inputs])))))

(deftest authority-binds-permission-to-the-webhook-actor-id
  (let [request (authority/request (assoc command :capability :gitops/review))]
    (is (:authorized? (authority/decision
                       request {:permission "write"
                                :user-id 9
                                :user-login "operator"})))
    (is (false? (:authorized? (authority/decision
                               request {:permission "write"
                                        :user-id 10
                                        :user-login "operator"}))))
    (is (false? (:authorized? (authority/decision
                               request {:permission "read"
                                        :user-id 9
                                        :user-login "operator"})))))
  (let [gate-request
        (authority/request
         (assoc command :capability :gitops/reconcile-review-gate))]
    (is (:authorized? (authority/signed-review-event-decision gate-request)))
    (is (false? (:authorized?
                 (authority/decision gate-request
                                     {:permission "admin"
                                      :user-id 9
                                      :user-login "operator"}))))))

(deftest review-plan-uses-only-refetched-pull-request-revision
  (let [admitted (:command (admission/decide config command))
        current {:number 321
                 :node-id "PR_kwDOExample"
                 :repository "open-hax/eta-mu"
                 :repository-id 42
                 :default-branch "main"
                 :head-repository "open-hax/eta-mu"
                 :head-repository-id 42
                 :state "open"
                 :draft? false
                 :mergeable? true
                 :base-branch "main"
                 :base-sha "1111111111111111111111111111111111111111"
                 :head-sha "0123456789abcdef0123456789abcdef01234567"
                 :merge-sha "2222222222222222222222222222222222222222"
                 :html-url "https://github.com/open-hax/eta-mu/pull/321"
                 :labels #{"eta-mu:review"}}
        allowed {:authorized? true}
        planned (review/plan admitted current allowed
                             "opencode-code-review.yml")]
    (is (:planned? planned))
    (is (= {:pr_number "321"
            :pr_base_sha "1111111111111111111111111111111111111111"
            :pr_head_sha "0123456789abcdef0123456789abcdef01234567"
            :pr_merge_sha "2222222222222222222222222222222222222222"
            :command_id "9eb17352-284c-4b55-879d-0d07f353fdee"}
           (get-in planned [:dispatch :inputs])))
    (testing "a non-default PR base is refused"
      (is (= :pull-request-base-is-not-default
             (:reason (review/plan
                       admitted (assoc current :base-branch "release") allowed
                       "opencode-code-review.yml")))))
    (testing "PR and base identity are independently bound"
      (let [dispatch (:dispatch planned)]
        (is (review/dispatch-current-pull-request? dispatch current))
        (is (false?
             (review/dispatch-current-pull-request?
              dispatch (assoc current :number 322 :node-id "PR_other"))))
        (is (false?
             (review/dispatch-current-pull-request?
              dispatch
              (assoc current
                     :base-sha "3333333333333333333333333333333333333333"
                     :merge-sha
                     "4444444444444444444444444444444444444444"))))))
    (testing "the command label must still exist on the refetched PR"
      (is (= :command-label-no-longer-present
             (:reason (review/plan admitted (assoc current :labels #{})
                                   allowed "opencode-code-review.yml")))))
    (is (= :pull-request-is-draft
           (:reason (review/plan admitted (assoc current :draft? true)
                                 allowed "opencode-code-review.yml"))))
    (is (= :repository-identity-changed
           (:reason (review/plan admitted (assoc current :repository-id 43)
                                 allowed "opencode-code-review.yml"))))
    (is (= :fork-pull-request-not-supported
           (:reason (review/plan admitted
                                 (assoc current
                                        :head-repository "contributor/eta-mu"
                                        :head-repository-id 99)
                                 allowed "opencode-code-review.yml"))))))

(deftest refetched-shape-separates-pull-request-and-repository-authority
  (let [current
        (shape/github-pull-request->current
         {:number 321
          :node_id "PR_kwDOExample"
          :html_url "https://github.com/open-hax/eta-mu/pull/321"
          :state "open"
          :draft false
          :mergeable true
          :merge_commit_sha "2222222222222222222222222222222222222222"
          :labels [{:name "eta-mu:review"} {:name "needs-docs"}]
          :head {:sha "0123456789abcdef0123456789abcdef01234567"
                 :repo {:full_name "open-hax/eta-mu" :id 42}}
          :base {:ref "attacker-controlled"
                 :sha "1111111111111111111111111111111111111111"
                 :repo {:full_name "open-hax/eta-mu" :id 42
                        :default_branch "attacker-controlled"}}}
         {:full_name "open-hax/eta-mu"
          :id 42
          :default_branch "main"})]
    (is (= "main" (:default-branch current)))
    (is (= #{"eta-mu:review" "needs-docs"} (:labels current)))
    (is (= "attacker-controlled" (:base-branch current)))
    (is (law/current-pull-request? current))))

(deftest current-workflow-dispatch-response-contract
  (let [receipt {:workflow-run-id 987
                 :run-url "https://api.github.test/runs/987"
                 :html-url "https://github.test/runs/987"}]
    (is (law/workflow-dispatch-response? 200 receipt))
    (is (false? (law/workflow-dispatch-response? 204 receipt)))
    (is (false? (law/workflow-dispatch-response?
                 200 (dissoc receipt :workflow-run-id))))))

(deftest command-configuration-is-namespaced-and-file-bounded
  (is (law/command-label? "eta-mu:review"))
  (is (law/review-command-label? "eta-mu:review"))
  (is (false? (law/review-command-label? "eta-mu:deploy")))
  (is (false? (law/command-label? "deploy")))
  (is (false? (law/command-label? "eta-mu:review now")))
  (is (law/workflow-file? "eta-mu-review.yml"))
  (is (false? (law/workflow-file? "../eta-mu-review.yml")))
  (is (false? (law/workflow-file? "deploy"))))

(defn workflow-completion-source
  ([workflow-id workflow-file]
   (workflow-completion-source workflow-id workflow-file "success"))
  ([workflow-id workflow-file conclusion]
   {:delivery-id "56a5d98a-87df-4d70-a40c-40a3cf109198"
    :payload/sha256 (apply str (repeat 64 "b"))
    :event "workflow_run"
    :action "completed"
    :installation-id 77
    :repository-id 42
    :repository "open-hax/eta-mu"
    :workflow-definition-id workflow-id
    :workflow-definition-path (str ".github/workflows/" workflow-file)
    :workflow-run-id 991
    :workflow-run-node-id "WFR_gate"
    :workflow-run-workflow-id workflow-id
    :workflow-run-path (str ".github/workflows/" workflow-file)
    :workflow-run-event "workflow_dispatch"
    :workflow-run-status "completed"
    :workflow-run-conclusion conclusion
    :workflow-run-head-sha "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    :workflow-run-head-branch "main"
    :workflow-run-run-attempt 1
    :workflow-run-url "https://api.github.test/runs/991"
    :workflow-run-html-url "https://github.test/runs/991"
    :workflow-run-actor-id 501
    :workflow-run-actor-login "eta-mu-controller[bot]"
    :workflow-run-triggering-actor-id 501
    :workflow-run-triggering-actor-login "eta-mu-controller[bot]"
    :sender-id 501
    :sender-login "eta-mu-controller[bot]"}))

(deftest workflow-completion-admission-is-workflow-and-app-bound
  (doseq [[workflow-id workflow-file]
          [[7001 "opencode-code-review.yml"]
           [7002 "review-resolution-gate.yml"]]]
    (let [source (workflow-completion-source workflow-id workflow-file)
          bare (admission/decide config source)
          qualified (admission/decide
                     config (assoc source :workflow-run-path
                                   (str ".github/workflows/" workflow-file
                                        "@main")))]
      (is (:admitted? bare))
      (is (:admitted? qualified))
      (is (= :review-gate-completion
             (get-in bare [:command :command/type])))
      (is (:allowed?
           (admission/current-policy-decision config (:command bare))))))
  (is (= :unmanaged-workflow
         (:reason (admission/decide
                   config (assoc (workflow-completion-source
                                  7002 "review-resolution-gate.yml")
                                 :workflow-run-workflow-id 7001)))))
  (is (= :untrusted-workflow-actor
         (:reason (admission/decide
                   config (assoc (workflow-completion-source
                                  7002 "review-resolution-gate.yml")
                                 :workflow-run-triggering-actor-login
                                 "attacker"))))))

(deftest workflow-completion-plans-one-immutable-controller-check-patch
  (let [head "0123456789abcdef0123456789abcdef01234567"
        source-id "9eb17352-284c-4b55-879d-0d07f353fdee"
        completion (workflow-completion-source
                    7002 "review-resolution-gate.yml")
        dispatch {:command/type :review-gate-reconcile
                  :repository "open-hax/eta-mu"
                  :repository-id 42
                  :pull-request-node-id "PR_kwDOExample"
                  :workflow "review-resolution-gate.yml"
                  :workflow-id 7002
                  :ref "main"
                  :inputs {:pr_number "321"
                           :pr_base_sha
                           "1111111111111111111111111111111111111111"
                           :pr_head_sha head
                           :pr_merge_sha
                           "2222222222222222222222222222222222222222"}}
        gate {:id 4567
              :name "eta-mu-review-gate"
              :repository "open-hax/eta-mu"
              :repository-id 42
              :pr-number 321
              :pr-node-id "PR_kwDOExample"
              :base-branch "main"
              :base-sha "1111111111111111111111111111111111111111"
              :head-sha head
              :merge-sha "2222222222222222222222222222222222222222"
              :external-id
              (law/review-gate-external-id
               source-id 321 head
               "1111111111111111111111111111111111111111"
               "2222222222222222222222222222222222222222")
              :details-url "https://github.com/open-hax/eta-mu/pull/321"}
        run {:id 991
             :node-id "WFR_gate"
             :workflow-id 7002
             :repository "open-hax/eta-mu"
             :repository-id 42
             :path ".github/workflows/review-resolution-gate.yml@main"
             :event "workflow_dispatch"
             :status "completed"
             :conclusion "success"
             :head-sha "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
             :head-branch "main"
             :run-attempt 1
             :url "https://api.github.test/runs/991"
             :html-url "https://github.test/runs/991"
             :actor-id 501
             :actor-login "eta-mu-controller[bot]"
             :triggering-actor-id 501
             :triggering-actor-login "eta-mu-controller[bot]"}
        pull {:number 321
              :node-id "PR_kwDOExample"
              :repository "open-hax/eta-mu"
              :repository-id 42
              :default-branch "main"
              :head-repository "open-hax/eta-mu"
              :head-repository-id 42
              :state "open"
              :draft? false
              :mergeable? true
              :base-branch "main"
              :base-sha "1111111111111111111111111111111111111111"
              :head-sha head
              :merge-sha "2222222222222222222222222222222222222222"
              :html-url "https://github.com/open-hax/eta-mu/pull/321"
              :labels #{}}
        correlation {:dispatch (assoc dispatch :gate-check gate)
                     :gate-check gate
                     :workflow-run {:id 991
                                    :url (:url run)
                                    :html-url (:html-url run)}}
        plan (review/trusted-workflow-completion-plan
              completion correlation source-id run pull
              "eta-mu-controller[bot]")]
    (is (:planned? plan))
    (is (= "success"
           (get-in plan [:terminal-intent :patch :conclusion])))
    (is (= "https://github.test/runs/991/attempts/1"
           (get-in plan [:terminal-intent :patch :details-url])))
    (testing "a successful code-review run cannot green its own gate"
      (is (= "failure"
             (get-in (review/trusted-workflow-completion-plan
                      (assoc completion
                             :workflow-definition-id 7001
                             :workflow-definition-path
                             ".github/workflows/opencode-code-review.yml"
                             :workflow-run-workflow-id 7001
                             :workflow-run-path
                             ".github/workflows/opencode-code-review.yml")
                      (assoc correlation :dispatch
                             (assoc dispatch
                                    :command/type :code-review
                                    :workflow "opencode-code-review.yml"
                                    :workflow-id 7001
                                    :gate-check gate))
                      source-id
                      (assoc run :workflow-id 7001
                             :path
                             ".github/workflows/opencode-code-review.yml@main")
                      pull "eta-mu-controller[bot]")
                     [:terminal-intent :patch :conclusion]))))
    (testing "transient test-merge computation is distinct from tuple drift"
      (is (= :pull-request-test-merge-not-ready
             (:reason (review/trusted-workflow-completion-plan
                       completion correlation source-id run
                       (assoc pull :mergeable? nil :merge-sha nil)
                       "eta-mu-controller[bot]"))))
      (is (= :pull-request-merge-context-changed
             (:reason (review/trusted-workflow-completion-plan
                       completion correlation source-id run
                       (assoc pull :mergeable? false :merge-sha nil)
                       "eta-mu-controller[bot]"))))
      (is (= :pull-request-merge-context-changed
             (:reason (review/trusted-workflow-completion-plan
                       completion correlation source-id run
                       (assoc pull
                              :node-id "PR_other"
                              :mergeable? nil
                              :merge-sha nil)
                       "eta-mu-controller[bot]")))))))
