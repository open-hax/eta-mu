(ns eta-mu.gitops-controller.infra.issue-probe-test
  (:require [cljs.test :refer [deftest is]]
            [eta-mu.gitops-controller.domain.admission :as admission]
            [eta-mu.gitops-controller.extern.fs :as fs]
            [eta-mu.gitops-controller.infra.authority :as authority]
            [eta-mu.gitops-controller.infra.store :as store]
            [eta-mu.gitops-controller.infra.worker :as worker]))

(def delivery-id "9eb17352-284c-4b55-879d-0d07f353fdee")

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

(def source
  {:delivery-id delivery-id
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

(def current-issue
  {:number 320
   :node-id "I_kwDOExample"
   :repository "open-hax/eta-mu"
   :repository-id 42
   :state "open"
   :pull-request? false
   :html-url "https://github.com/open-hax/eta-mu/issues/320"
   :labels #{"status:incoming" "eta-mu:probe" "priority:P0"}
   :canonical-task-uuid "eta-mu-webhook-review-controller"
   :canonical-task-marker-count 1
   :default-branch "main"
   :default-branch-ref "refs/heads/main"
   :default-branch-sha "0123456789abcdef0123456789abcdef01234567"
   :default-branch-object-type "commit"
   :repository-archived? false
   :repository-disabled? false})

(deftest ^:async issue-probe-terminates-without-any-mutation-port
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        calls* (atom {:fetch-issue 0
                      :fetch-pull-request 0
                      :permission 0})
        github
        {:fetch-issue!
         (fn [_]
           (swap! calls* update :fetch-issue inc)
           (js/Promise.resolve current-issue))
         :fetch-pull-request!
         (fn [_]
           (swap! calls* update :fetch-pull-request inc)
           (js/Promise.reject (ex-info "unexpected pull request fetch" {})))
         :actor-permission!
         (fn [_]
           (swap! calls* update :permission inc)
           (js/Promise.resolve {:permission "write"
                                :user-id 9
                                :user-login "operator"}))}
        make-worker
        #(worker/create
          {:store state-store
           :github github
           :authority (authority/github-port github)
           :policy policy
           :replay-interval-ms 600000})
        first-worker (make-worker)
        restarted-worker (make-worker)
        command (:command (admission/decide policy source))]
    (try
      (await (store/initialize! state-store))
      (await (worker/start! first-worker))
      (is (:accepted? (await (store/accept-delivery! state-store command))))
      (is (:duplicate? (await (store/accept-delivery! state-store command))))
      (worker/stop! first-worker)
      (await (worker/start! restarted-worker))
      (await (worker/process-delivery! restarted-worker delivery-id))
      (let [result
            (:result (await (store/read-completion state-store delivery-id)))]
        (is (= "probed" (:outcome result)))
        (is (= "issue-probe" (:command/type result)))
        (is (= 320 (:issue-number result)))
        (is (= "I_kwDOExample" (:issue-node-id result)))
        (is (= 9 (:sender-id result)))
        (is (= 77 (:installation-id result)))
        (is (= {:permission "write"
                :user-id 9
                :user-login "operator"
                :identity-matches? true}
               (get-in result [:probe :authorization])))
        (is (= "eta-mu-webhook-review-controller"
               (get-in result [:probe :issue :task-uuid])))
        (is (= ["eta-mu:probe" "priority:P0" "status:incoming"]
               (get-in result [:probe :issue :labels])))
        (is (= "0123456789abcdef0123456789abcdef01234567"
               (get-in result [:probe :project :revision])))
        (is (= "observe-policy-v1"
               (get-in result [:probe :project :policy-revision])))
        (is (= [] (get-in result [:probe :effects]))))
      (is (= {:fetch-issue 1
              :fetch-pull-request 0
              :permission 1}
             @calls*))
      (is (empty? (await (fs/entries
                          (get-in state-store [:paths :outbox])))))
      (is (empty? (await (store/pending-delivery-ids state-store))))
      (finally
        (worker/stop! first-worker)
        (worker/stop! restarted-worker)
        (await (fs/remove-tree! root))))))
