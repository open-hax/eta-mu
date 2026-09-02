(ns eta-mu.gitops-controller.domain.issue-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.gitops-controller.domain.admission :as admission]
            [eta-mu.gitops-controller.domain.issue :as issue]
            [eta-mu.gitops-controller.law.webhook :as law]
            [eta-mu.gitops-controller.shape.webhook :as shape]))

(def issue-source
  {:delivery-id "9eb17352-284c-4b55-879d-0d07f353fdee"
   :payload/sha256 (apply str (repeat 64 "a"))
   :event "issues"
   :action "labeled"
   :label "eta-mu:probe"
   :installation-id 77
   :repository-id 42
   :repository "open-hax/eta-mu"
   :issue-number 320
   :issue-node-id "I_kwDOExample"
   :issue-pull-request? false
   :sender-id 9
   :sender-login "operator"})

(def policy
  {:mode :observe-only
   :project-id "eta-mu"
   :policy-revision "observe-policy-v1"
   :review-label "eta-mu:review"
   :probe-label "eta-mu:probe"
   :workflow "opencode-code-review.yml"
   :gate-workflow "review-resolution-gate.yml"
   :repository-allowlist #{"open-hax/eta-mu"}
   :installation-allowlist #{77}})

(def current-issue
  {:number 320
   :node-id "I_kwDOExample"
   :repository "open-hax/eta-mu"
   :repository-id 42
   :state "open"
   :pull-request? false
   :html-url "https://github.com/open-hax/eta-mu/issues/320"
   :labels #{"eta-mu:probe" "priority:P0" "status:incoming"}
   :canonical-task-uuid "eta-mu-webhook-review-controller"
   :canonical-task-marker-count 1
   :default-branch "main"
   :default-branch-ref "refs/heads/main"
   :default-branch-sha "0123456789abcdef0123456789abcdef01234567"
   :default-branch-object-type "commit"
   :repository-archived? false
   :repository-disabled? false})

(def authorized
  {:authorized? true
   :evidence {:github/permission "write"
              :github/user-id 9
              :github/user-login "operator"
              :identity-matches? true}})

(deftest issue-probe-admission-is-distinct-and-policy-bound
  (let [decision (admission/decide policy issue-source)
        command (:command decision)]
    (is (:admitted? decision))
    (is (= :issue-probe (:command/type command)))
    (is (= :gitops/probe (:capability command)))
    (is (= 320 (:issue-number command)))
    (is (= "I_kwDOExample" (:issue-node-id command)))
    (is (= "eta-mu" (get-in command [:admission :project-id])))
    (is (nil? (get-in command [:admission :workflow])))
    (is (:allowed? (admission/current-policy-decision policy command)))
    (is (= :issue-probe-policy-changed
           (:reason
            (admission/current-policy-decision
             (assoc policy :project-id "other") command)))))
  (testing "review labels and non-labeled issue actions remain unmanaged"
    (is (:ignored? (admission/decide
                    policy (assoc issue-source :label "eta-mu:review"))))
    (is (:ignored? (admission/decide
                    policy (assoc issue-source :action "edited")))))
  (testing "a PR-shaped issue payload is rejected before durable admission"
    (is (= :pull-request-is-not-an-issue
           (:reason
            (admission/decide
             policy (assoc issue-source :issue-pull-request? true)))))
    (let [durable
          (:command (admission/decide policy issue-source))]
      (is (= :admission-policy-unbound
             (:reason
              (admission/current-policy-decision
               policy (assoc durable :issue-pull-request? true)))))))
  (testing "the existing pull-request probe remains a separate command shape"
    (let [pull-request-source
          (-> issue-source
              (assoc :event "pull_request"
                     :pull-request-number 320
                     :pull-request-node-id "PR_kwDOExample")
              (dissoc :issue-number :issue-node-id))]
      (is (= :ingress-probe
             (get-in (admission/decide policy pull-request-source)
                     [:command :command/type]))))))

(deftest issue-probe-plan-is-deterministic-and-write-free
  (let [command (:command (admission/decide policy issue-source))
        planned (issue/plan command current-issue authorized policy)]
    (is (:planned? planned))
    (is (= {:plan/version 1
            :command {:id "9eb17352-284c-4b55-879d-0d07f353fdee"
                      :type :issue-probe
                      :event "issues"
                      :action "labeled"
                      :label "eta-mu:probe"}
            :actor {:id 9 :login "operator"}
            :authorization {:permission "write"
                            :user-id 9
                            :user-login "operator"
                            :identity-matches? true}
            :repository
            {:full-name "open-hax/eta-mu"
             :id 42
             :installation-id 77
             :default-branch "main"
             :default-branch-sha
             "0123456789abcdef0123456789abcdef01234567"}
            :issue
            {:number 320
             :node-id "I_kwDOExample"
             :task-uuid "eta-mu-webhook-review-controller"
             :state "open"
             :labels ["eta-mu:probe" "priority:P0" "status:incoming"]}
            :project
            {:id "eta-mu"
             :policy-revision "observe-policy-v1"
             :revision "0123456789abcdef0123456789abcdef01234567"}
            :effects []}
           (:probe planned)))
    (testing "live identity, issue state, marker, label, and authority fail closed"
      (doseq [[expected changed]
              [[:repository-identity-changed
                (assoc current-issue :repository-id 43)]
               [:issue-identity-changed
                (assoc current-issue :node-id "I_other")]
               [:pull-request-is-not-an-issue
                (assoc current-issue :pull-request? true)]
               [:issue-not-open
                (assoc current-issue :state "closed")]
               [:command-label-no-longer-present
                (assoc current-issue :labels #{"priority:P0"})]
               [:canonical-task-marker-missing
                (assoc current-issue
                       :canonical-task-uuid nil
                       :canonical-task-marker-count 0)]
               [:canonical-task-marker-ambiguous
                (assoc current-issue
                       :canonical-task-uuid nil
                       :canonical-task-marker-count 2)]]]
        (is (= expected
               (:reason
                (issue/plan command changed authorized policy)))))
      (is (= :actor-not-authorized
             (:reason
              (issue/plan command current-issue {:authorized? false}
                          policy))))
      (is (= :authorization-evidence-unbound
             (:reason
              (issue/plan
               command current-issue
               (assoc-in authorized [:evidence :github/user-id] 10)
               policy)))))))

(deftest github-issue-shape-requires-one-canonical-marker-and-full-label-state
  (let [repository {:id 42
                    :full_name "open-hax/eta-mu"
                    :default_branch "main"
                    :archived false
                    :disabled false}
        branch-ref {:ref "refs/heads/main"
                    :object {:type "commit"
                             :sha
                             "0123456789abcdef0123456789abcdef01234567"}}
        base {:number 320
              :node_id "I_kwDOExample"
              :state "open"
              :html_url "https://github.com/open-hax/eta-mu/issues/320"
              :body (str "before\n"
                         "<!-- openhax-kanban-sync "
                         "uuid=\"eta-mu-webhook-review-controller\" -->\n"
                         "after")
              :labels [{:name "eta-mu:probe"}
                       {:name "status:incoming"}
                       {:name "priority:P0"}]}
        current (shape/github-issue->current base repository branch-ref)
        ambiguous
        (shape/github-issue->current
         (update base :body str
                 "\n<!-- openhax-kanban-sync uuid=\"other\" -->")
         repository branch-ref)]
    (is (law/current-issue? current))
    (is (= "eta-mu-webhook-review-controller"
           (:canonical-task-uuid current)))
    (is (= 1 (:canonical-task-marker-count current)))
    (is (= #{"eta-mu:probe" "status:incoming" "priority:P0"}
           (:labels current)))
    (is (= 2 (:canonical-task-marker-count ambiguous)))
    (is (nil? (:canonical-task-uuid ambiguous)))
    (testing "task UUIDs are bounded before entering durable evidence"
      (let [maximum (apply str (repeat 128 "a"))
            oversized (apply str (repeat 129 "a"))
            valid-marker
            "<!-- openhax-kanban-sync uuid=\"valid-task\" -->"
            invalid-marker
            (str "<!-- openhax-kanban-sync uuid=\""
                 oversized "\" -->")
            oversized-current
            (shape/github-issue->current
             (assoc base :body invalid-marker)
             repository branch-ref)
            invalid-first
            (shape/github-issue->current
             (assoc base :body (str invalid-marker "\n" valid-marker))
             repository branch-ref)
            valid-first
            (shape/github-issue->current
             (assoc base :body (str valid-marker "\n" invalid-marker))
             repository branch-ref)
            command (:command (admission/decide policy issue-source))]
        (is (law/task-uuid? maximum))
        (is (false? (law/task-uuid? oversized)))
        (is (= 1 (:canonical-task-marker-count oversized-current)))
        (is (= oversized (:canonical-task-uuid oversized-current)))
        (is (= :canonical-task-uuid-invalid
               (:reason
                (issue/plan command oversized-current authorized policy))))
        (doseq [mixed [invalid-first valid-first]]
          (is (= 2 (:canonical-task-marker-count mixed)))
          (is (nil? (:canonical-task-uuid mixed)))
          (is (= :canonical-task-marker-ambiguous
                 (:reason
                  (issue/plan command mixed authorized policy)))))))))
