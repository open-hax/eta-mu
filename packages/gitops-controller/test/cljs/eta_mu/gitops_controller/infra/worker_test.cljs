(ns eta-mu.gitops-controller.infra.worker-test
  (:require ["node:fs/promises" :as node-fs]
            [cljs.test :refer [deftest is testing]]
            [eta-mu.gitops-controller.domain.admission :as admission]
            [eta-mu.gitops-controller.extern.crypto :as crypto]
            [eta-mu.gitops-controller.extern.fs :as fs]
            [eta-mu.gitops-controller.extern.http :as http]
            [eta-mu.gitops-controller.infra.authority :as authority]
            [eta-mu.gitops-controller.infra.effect-lease :as effect-lease]
            [eta-mu.gitops-controller.infra.github :as github]
            [eta-mu.gitops-controller.infra.store :as store]
            [eta-mu.gitops-controller.infra.worker :as worker]))

(def delivery-id "9eb17352-284c-4b55-879d-0d07f353fdee")
(def payload-sha256 (apply str (repeat 64 "a")))

(def command
  {:delivery-id delivery-id
   :payload/sha256 payload-sha256
   :command-id delivery-id
   :capability :gitops/review
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

(def active-effect-lease
  {:status! #(js/Promise.resolve
              {:state :active :effects-allowed? true})
   :authorize! #(js/Promise.resolve
                 {:allowed? true
                  :basis :active-deployment
                  :lease {:state :active :effects-allowed? true}})})

(defn policy [mode revision]
  {:mode mode
   :controller-app-login "eta-mu-controller[bot]"
   :policy-revision revision
   :review-label "eta-mu:review"
   :probe-label "eta-mu:probe"
   :workflow "opencode-code-review.yml"
   :gate-workflow "review-resolution-gate.yml"
   :review-workflow-id 7001
   :gate-workflow-id 7002
   :effect-lease active-effect-lease
   :repository-allowlist #{"open-hax/eta-mu"}
   :installation-allowlist #{77}})

(def review-policy (policy :review-dispatch "review-policy-v1"))
(def observe-policy
  (dissoc (policy :observe-only "observe-policy-v1")
          :controller-app-login
          :review-workflow-id
          :gate-workflow-id
          :effect-lease))

(defn admitted-command [current-policy]
  (assoc command
         :command/type :code-review
         :admission {:version 2
                     :mode (:mode current-policy)
                     :policy-revision (:policy-revision current-policy)
                     :command/type :code-review
                     :review-label (:review-label current-policy)
                     :workflow (:workflow current-policy)}))

(defn ^:async replace-marker! [root marker contents]
  (let [temporary (fs/join root "active-marker.next")]
    (await (fs/write-exclusive! temporary contents))
    (await (.rename node-fs temporary marker))
    (await (fs/sync-directory! root))))

(def ^:private dispatch-projection-partitions
  [:outbox
   :gate-checks
   :dispatch-calls
   :workflow-runs
   :gate-terminal-intents
   :dispatches])

(defn- ^:async remove-dispatch-projections! [state-store delivery-id]
  (doseq [partition dispatch-projection-partitions]
    (await (fs/remove-file-if-present!
            (fs/join (get-in state-store [:paths partition])
                     (str delivery-id ".edn"))))))

(def ^:private failing-projection-write-context* (atom nil))

(defn- ^:async fail-projection-write-once! [file contents]
  (let [{:keys [write-exclusive! target fail-once?*]}
        @failing-projection-write-context*]
    (if (and (= target file)
             (compare-and-set! fail-once?* true false))
      (throw (ex-info "synthetic projection publication failure"
                      {:error/code :synthetic-projection-failure}))
      (await (write-exclusive! file contents)))))

(def ^:private blocking-projection-write-context* (atom nil))

(defn- ^:async block-after-projection-write-once! [file contents]
  (let [{:keys [write-exclusive! target block-once?* published!* release]}
        @blocking-projection-write-context*
        created? (await (write-exclusive! file contents))]
    (when (and (= target file)
               (compare-and-set! block-once?* true false))
      (@published!* true)
      (await release))
    created?))

(def ^:private marker-race-context* (atom nil))

(defn- ^:async block-before-dispatch-call-once!
  [state-store delivery-id dispatch]
  (let [{:keys [begin-dispatch-call! block-begin-once?* begin-ready!*
                begin-release]}
        @marker-race-context*]
    (when (compare-and-set! block-begin-once?* true false)
      (@begin-ready!* true)
      (await begin-release))
    (await (begin-dispatch-call! state-store delivery-id dispatch))))

(defn- ^:async block-after-pending-read-once! [state-store]
  (let [{:keys [pending-delivery-ids block-pending-once?* pending-ready!*
                pending-release]}
        @marker-race-context*
        delivery-ids (await (pending-delivery-ids state-store))]
    (when (compare-and-set! block-pending-once?* true false)
      (@pending-ready!* true)
      (await pending-release))
    delivery-ids))

(def current-pull-request
  {:number 321
   :node-id "PR_kwDOExample"
   :repository "open-hax/eta-mu"
   :repository-id 42
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
   :default-branch "main"
   :labels #{"eta-mu:review"}})

(def gate-check-id 4567)

(defn ^:async invoke-authorizer! [value key]
  (when-let [callback (get (meta value) key)]
    (await (callback)))
  true)

(defn ^:async prepare-review-gate! [_installation-id expected]
  (await (invoke-authorizer! expected :authorize-create!))
  (js/Promise.resolve
   {:id gate-check-id
    :node-id "CR_kwDOGate"
    :name (:name expected)
    :merge-sha (:merge-sha expected)
    :status "in_progress"
    :external-id (:external-id expected)
    :details-url (:details-url expected)
    :app-id 123
    :app-slug "eta-mu-controller"}))

(deftest ^:async removed-review-label-before-github-write-revokes-command
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        refetches* (atom 0)
        write-authorizations* (atom 0)
        check-writes* (atom 0)
        dispatches* (atom 0)
        github
        {:prepare-review-gate!
         (^:async fn [_ expected]
           (swap! write-authorizations* inc)
           (await (invoke-authorizer! expected :authorize-create!))
           (swap! check-writes* inc)
           {:id gate-check-id})
         :fetch-pull-request!
         (fn [_]
           (let [refetch (swap! refetches* inc)]
             (js/Promise.resolve
              (cond-> current-pull-request
                (< 1 refetch) (assoc :labels #{})))))
         :actor-permission!
         (fn [_]
           (js/Promise.resolve {:permission "write"
                                :user-id 9
                                :user-login "operator"}))
         :dispatch-review!
         (^:async fn [_ dispatch]
           (swap! write-authorizations* inc)
           (await (invoke-authorizer! dispatch :authorize-dispatch!))
           (swap! dispatches* inc)
           {:workflow-run-id 987
            :run-url "https://api.github.test/runs/987"
            :html-url "https://github.test/runs/987"})}
        queue-worker
        (worker/create
         {:store state-store
          :github github
          :authority (authority/github-port github)
          :policy review-policy
          :replay-interval-ms 600000})]
    (try
      (await (store/initialize! state-store))
      (await (worker/start! queue-worker))
      (await (store/accept-delivery! state-store
                                     (admitted-command review-policy)))
      (await (worker/process-delivery! queue-worker delivery-id))
      (is (= 2 @refetches*))
      (is (zero? @write-authorizations*))
      (is (zero? @check-writes*))
      (is (zero? @dispatches*))
      (is (false? (await (store/gate-check-recorded?
                          state-store delivery-id))))
      (is (false? (await (store/dispatch-call-begun?
                          state-store delivery-id))))
      (is (= [delivery-id]
             (await (store/pending-delivery-ids state-store))))
      (finally
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async collaborator-permission-is-refreshed-before-every-start-command-write
  (doseq [revocation-boundary [:cancel :create :dispatch :never]]
    (let [root (await (fs/temporary-directory!))
          state-store (store/create root)
          permission* (atom "write")
          permission-reads* (atom [])
          writes* (atom [])
          github
          {:fetch-pull-request! (fn [_] (js/Promise.resolve current-pull-request))
           :actor-permission!
           (fn [actual-command]
             (swap! permission-reads* conj [(:sender-id actual-command) @permission*])
             (js/Promise.resolve {:permission @permission*
                                  :user-id 9 :user-login "operator"}))
           :prepare-review-gate!
           (^:async fn [_ expected]
             ;; Preparing one gate can first cancel its predecessor, then
             ;; create the replacement. Each mutation has its own callback.
             (doseq [[boundary callback] [[:cancel :authorize-cancel!]
                                         [:create :authorize-create!]]]
               (when (= boundary revocation-boundary)
                 (reset! permission* "read"))
               (await (invoke-authorizer! expected callback))
               (swap! writes* conj boundary))
             {:id gate-check-id :node-id "CR_kwDOGate"
              :name (:name expected) :merge-sha (:merge-sha expected)
              :status "in_progress" :external-id (:external-id expected)
              :details-url (:details-url expected)
              :app-id 123 :app-slug "eta-mu-controller"})
           :dispatch-review!
           (^:async fn [_ dispatch]
             (when (= :dispatch revocation-boundary)
               (reset! permission* "read"))
             (await (invoke-authorizer! dispatch :authorize-dispatch!))
             (swap! writes* conj :dispatch)
             {:workflow-run-id 987 :run-url "https://api.github.test/runs/987"
              :html-url "https://github.test/runs/987"})}
          queue-worker (worker/create
                        {:store state-store :github github
                         :authority (authority/github-port github)
                         :policy review-policy :replay-interval-ms 600000})]
      (try
        (await (store/initialize! state-store))
        (await (worker/start! queue-worker))
        (await (store/accept-delivery! state-store
                                      (admitted-command review-policy)))
        (await (worker/process-delivery! queue-worker delivery-id))
        (is (= (case revocation-boundary
                 :cancel [] :create [:cancel] :dispatch [:cancel :create]
                 :never [:cancel :create :dispatch])
               @writes*)
            (name revocation-boundary))
        (is (= (case revocation-boundary :cancel 2 :create 3 4)
               (count @permission-reads*)))
        (is (= [9 "write"] (first @permission-reads*)))
        (is (= [9 (if (= :never revocation-boundary) "write" "read")]
               (last @permission-reads*)))
        (is (= (= :never revocation-boundary)
               (await (store/dispatch-call-begun? state-store delivery-id))))
        (is (= (= :never revocation-boundary)
               (await (store/completed? state-store delivery-id))))
        (when-not (= :never revocation-boundary)
          (is (= :actor-authority-revoked
                 (get-in (worker/status queue-worker) [:last-error :error/code])))
          (is (= [delivery-id] (await (store/pending-delivery-ids state-store)))))
        (is (false? (:fatal? (worker/status queue-worker))))
        (finally
          (worker/stop! queue-worker)
          (await (fs/remove-tree! root)))))))

(deftest ^:async observe-only-write-authorizer-stops-before-all-dynamic-reads
  (let [refetches* (atom 0)
        lease-requests* (atom 0)
        authorize!
        (worker/write-authorizer
         {:mode :observe-only
          :github
          {:fetch-pull-request!
           (fn [_]
             (swap! refetches* inc)
             (js/Promise.resolve current-pull-request))}
          :effect-lease
          {:authorize!
           (fn [_]
             (swap! lease-requests* inc)
             (js/Promise.resolve {:allowed? true}))}}
         delivery-id command {} true)
        error (try
                (await (authorize!))
                nil
                (catch :default value value))]
    (is (= :github-mutation-disabled (:error/code (ex-data error))))
    (is (zero? @refetches*))
    (is (zero? @lease-requests*))))

(defn fetch-code-review-run!
  [{:keys [workflow-run-id]}]
  (js/Promise.resolve
   {:id workflow-run-id
    :node-id (str "WFR_" workflow-run-id)
    :workflow-id 7001
    :repository "open-hax/eta-mu"
    :repository-id 42
    :path ".github/workflows/opencode-code-review.yml@main"
    :event "workflow_dispatch"
    :status "queued"
    :conclusion nil
    :head-sha "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    :head-branch "main"
    :run-attempt 1
    :url (str "https://api.github.test/runs/" workflow-run-id)
    :html-url (str "https://github.test/runs/" workflow-run-id)
    :actor-id 501
    :actor-login "eta-mu-controller[bot]"
    :triggering-actor-id 501
    :triggering-actor-login "eta-mu-controller[bot]"}))

(defn ^:async fetch-gate-review-run!
  [{:keys [workflow-run-id]}]
  (assoc (await (fetch-code-review-run!
                 {:workflow-run-id workflow-run-id}))
         :workflow-id 7002
         :path ".github/workflows/review-resolution-gate.yml@main"))

(defn review-dispatch-intent
  ([] (review-dispatch-intent delivery-id))
  ([command-id]
   {:command/type :code-review
   :event "pull_request"
   :action "labeled"
   :repository "open-hax/eta-mu"
   :repository-id 42
   :pull-request-node-id "PR_kwDOExample"
   :workflow "opencode-code-review.yml"
   :workflow-id 7001
   :ref "main"
   :gate-check
   {:name "eta-mu-review-gate"
    :repository "open-hax/eta-mu"
    :repository-id 42
    :pr-number 321
    :pr-node-id "PR_kwDOExample"
    :base-branch "main"
    :base-sha "1111111111111111111111111111111111111111"
    :head-sha "0123456789abcdef0123456789abcdef01234567"
    :merge-sha "2222222222222222222222222222222222222222"
    :delivery-id command-id
    :external-id
    (str "eta-mu-review-gate/v2:" command-id
         ":321:0123456789abcdef0123456789abcdef01234567"
         ":1111111111111111111111111111111111111111"
         ":2222222222222222222222222222222222222222")
    :details-url "https://github.com/open-hax/eta-mu/pull/321"}
   :inputs {:pr_number "321"
            :pr_base_sha "1111111111111111111111111111111111111111"
            :pr_head_sha "0123456789abcdef0123456789abcdef01234567"
            :pr_merge_sha "2222222222222222222222222222222222222222"
            :command_id command-id}}))

(defn completion-command
  [completion-id run-id workflow-id workflow-file conclusion]
  (:command
   (admission/decide
    review-policy
    {:delivery-id completion-id
     :payload/sha256 payload-sha256
     :event "workflow_run"
     :action "completed"
     :installation-id 77
     :repository-id 42
     :repository "open-hax/eta-mu"
     :workflow-definition-id workflow-id
     :workflow-definition-path (str ".github/workflows/" workflow-file)
     :workflow-run-id run-id
     :workflow-run-node-id (str "WFR_" run-id)
     :workflow-run-workflow-id workflow-id
     :workflow-run-path (str ".github/workflows/" workflow-file)
     :workflow-run-event "workflow_dispatch"
     :workflow-run-status "completed"
     :workflow-run-conclusion conclusion
     :workflow-run-head-sha "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
     :workflow-run-head-branch "main"
     :workflow-run-run-attempt 1
     :workflow-run-url (str "https://api.github.test/runs/" run-id)
     :workflow-run-html-url (str "https://github.test/runs/" run-id)
     :workflow-run-actor-id 501
     :workflow-run-actor-login "eta-mu-controller[bot]"
     :workflow-run-triggering-actor-id 501
     :workflow-run-triggering-actor-login "eta-mu-controller[bot]"
     :sender-id 501
     :sender-login "eta-mu-controller[bot]"})))

(defn base-push-command [current-policy]
  (:command
   (admission/decide
    current-policy
    (-> command
        (dissoc :command-id :capability :label
                :pull-request-number :pull-request-node-id)
        (assoc :event "push" :action "updated"
               :push-ref "refs/heads/main" :repository-default-branch "main"
               :push-before-sha "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
               :push-after-sha (:base-sha current-pull-request)
               :push-deleted? false)))))

(deftest ^:async base-push-recovers-partial-durable-fan-out-without-duplicate-effects
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        restarted-store (store/create root)
        parent (base-push-command review-policy)
        pull-requests [{:pull-request-number 321 :pull-request-node-id "PR_kwDOExample"}
                       {:pull-request-number 322 :pull-request-node-id "PR_second"}]
        enumeration-count* (atom 0)
        prepared* (atom [])
        dispatch-count* (atom 0)
        github {:list-open-pull-requests!
                (fn [_]
                  (swap! enumeration-count* inc)
                  (js/Promise.resolve (if (= 1 @enumeration-count*)
                                        pull-requests
                                        (vec (reverse pull-requests)))))
                :fetch-pull-request!
                (fn [child]
                  (js/Promise.resolve
                   (assoc current-pull-request
                          :number (:pull-request-number child)
                          :node-id (:pull-request-node-id child)
                          :labels #{})))
                :prepare-review-gate!
                (^:async fn [installation-id expected]
                  (swap! prepared* conj (:pr-number expected))
                  (await (prepare-review-gate! installation-id expected)))
                :dispatch-review! (fn [& _]
                                    (swap! dispatch-count* inc))}
        worker-options {:github github
                        :authority (authority/github-port github)
                        :policy review-policy :replay-interval-ms 600000}
        first-worker (worker/create (assoc worker-options :store state-store))
        restarted-worker (worker/create (assoc worker-options :store restarted-store))
        child-admissions* (atom 0)
        accept! store/accept-delivery!]
    (try
      (await (store/initialize! state-store))
      (await (store/accept-delivery! state-store parent))
      (with-redefs [store/accept-delivery!
                    (^:async fn [target child]
                      (when (= 2 (swap! child-admissions* inc))
                        (throw (ex-info "interrupted child admission"
                                        {:error/code :synthetic-child-admission-failure})))
                      (await (accept! target child)))]
        (await (worker/start! first-worker)))
      (is (false? (await (store/completed? state-store delivery-id))))
      (is (= 2 (count (await (store/pending-delivery-ids state-store)))))
      (is (empty? @prepared*))
      (worker/stop! first-worker)
      (await (store/initialize! restarted-store))
      (await (worker/start! restarted-worker))
      (await (worker/replay-pending! restarted-worker))
      (await (worker/replay-pending! restarted-worker))
      (is (= 2 @enumeration-count*))
      (is (= [321 322] (vec (sort @prepared*))))
      (is (zero? @dispatch-count*))
      (is (empty? (await (store/pending-delivery-ids restarted-store))))
      (is (= 3 (count (await (fs/entries
                             (get-in restarted-store [:paths :deliveries]))))))
      (is (= :gate-refresh-queued
             (get-in (await (store/read-completion restarted-store delivery-id))
                     [:result :outcome])))
      (doseq [pull-request pull-requests]
        (let [child-id (worker/base-push-child-id parent pull-request)
              child (:command (await (store/read-delivery restarted-store child-id)))
              completion (await (store/read-completion restarted-store child-id))]
          (is (= delivery-id (:parent-delivery-id child)))
          (is (= payload-sha256 (:payload/sha256 child)))
          (is (= :gate-invalidated (get-in completion [:result :outcome])))
          (is (false? (await (store/dispatch-call-begun? restarted-store child-id))))))
      (finally
        (worker/stop! first-worker)
        (worker/stop! restarted-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async base-push-enumeration-failure-remains-pending-without-effects
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        parent (base-push-command review-policy)
        queue-worker
        (worker/create
         {:store state-store :policy review-policy :authority {}
          :replay-interval-ms 600000
          :github {:list-open-pull-requests!
                   (fn [_] (js/Promise.reject
                            (ex-info "bounded enumeration exceeded"
                                     {:error/code :base-push-enumeration-limit})))}})]
    (try
      (await (store/initialize! state-store))
      (await (store/accept-delivery! state-store parent))
      (await (worker/start! queue-worker))
      (await (worker/replay-pending! queue-worker))
      (is (= [delivery-id] (await (store/pending-delivery-ids state-store))))
      (is (false? (await (store/completed? state-store delivery-id))))
      (is (false? (await (store/dispatch-intent-recorded? state-store delivery-id))))
      (is (= :base-push-enumeration-limit
             (get-in (worker/status queue-worker) [:last-error :error/code])))
      (finally
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async base-push-child-must-match-its-durable-parent-before-github
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        parent (base-push-command review-policy)
        pull-request {:pull-request-number 321 :pull-request-node-id "PR_kwDOExample"}
        child-id (worker/base-push-child-id parent pull-request)
        child (assoc (admission/base-push-child review-policy parent child-id pull-request)
                     :push-after-sha "3333333333333333333333333333333333333333")
        github-calls* (atom 0)
        queue-worker (worker/create
                      {:store state-store :policy review-policy :authority {}
                       :github {:fetch-pull-request! (fn [_] (swap! github-calls* inc))}
                       :replay-interval-ms 600000})]
    (try
      (await (store/initialize! state-store))
      (await (worker/start! queue-worker))
      (await (store/accept-delivery! state-store parent))
      (await (store/accept-delivery! state-store child))
      (let [error (try
                    (await (worker/process-delivery! queue-worker child-id))
                    nil
                    (catch :default error error))]
        (is (= :immutable-state-conflict (:error/code (ex-data error))))
        (is (zero? @github-calls*))
        (is (:fatal? (worker/status queue-worker)))
        (is (false? (await (store/dispatch-intent-recorded? state-store child-id)))))
      (finally
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async renamed-default-branch-terminalizes-the-old-push-without-children
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        calls* (atom 0)
        queue-worker
        (worker/create
         {:store state-store :policy review-policy :authority {}
          :replay-interval-ms 600000
          :github {:list-open-pull-requests!
                   (fn [_]
                     (swap! calls* inc)
                     (throw (ex-info "signed default branch was renamed"
                                     {:error/code :base-push-default-branch-changed
                                      :operation :list-open-pull-requests
                                      :expected-default-branch "main"
                                      :current-default-branch "trunk"})))}})]
    (try
      (await (store/initialize! state-store))
      (await (store/accept-delivery! state-store (base-push-command review-policy)))
      (await (worker/start! queue-worker))
      (await (worker/replay-pending! queue-worker))
      (let [result (:result (await (store/read-completion state-store delivery-id)))]
        (is (= :refused (:outcome result)))
        (is (= :base-push-default-branch-changed (:reason result)))
        (is (= "main" (:expected-default-branch result)))
        (is (= "trunk" (:current-default-branch result)))
        (is (zero? (:pull-request-count result))))
      (is (= 1 @calls*))
      (is (empty? (await (store/pending-delivery-ids state-store))))
      (is (= 1 (count (await (fs/entries (get-in state-store [:paths :deliveries]))))))
      (is (false? (await (store/dispatch-intent-recorded? state-store delivery-id))))
      (finally
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async base-push-observe-only-and-inactive-deployment-never-write-github
  (doseq [[current-policy expected-enumerations expected-pending]
          [[observe-policy 1 0]
           [(assoc review-policy :effect-lease
                   {:status! #(js/Promise.resolve {:state :provisional})
                    :authorize! (fn [_]
                                  (js/Promise.resolve
                                   {:allowed? false :lease {:state :provisional}}))})
            0 1]]]
    (let [root (await (fs/temporary-directory!))
          state-store (store/create root)
          parent (base-push-command current-policy)
          enumerations* (atom 0)
          writes* (atom 0)
          github {:list-open-pull-requests!
                  (fn [_]
                    (swap! enumerations* inc)
                    (js/Promise.resolve
                     [{:pull-request-number 321 :pull-request-node-id "PR_kwDOExample"}]))
                  :fetch-pull-request! (fn [_] (js/Promise.resolve current-pull-request))
                  :prepare-review-gate! (fn [& _] (swap! writes* inc))
                  :dispatch-review! (fn [& _] (swap! writes* inc))}
          queue-worker (worker/create
                        {:store state-store :policy current-policy :github github
                         :authority (authority/github-port github)
                         :replay-interval-ms 600000})]
      (try
        (await (store/initialize! state-store))
        (await (store/accept-delivery! state-store parent))
        (await (worker/start! queue-worker))
        (await (worker/replay-pending! queue-worker))
        (is (= expected-enumerations @enumerations*))
        (is (= expected-pending
               (count (await (store/pending-delivery-ids state-store)))))
        (is (zero? @writes*))
        (finally
          (worker/stop! queue-worker)
          (await (fs/remove-tree! root)))))))

(deftest ^:async worker-refetches-authorizes-and-dispatches-the-exact-head-once
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        calls* (atom [])
        github {:prepare-review-gate! prepare-review-gate!
                :fetch-workflow-run! fetch-code-review-run!
                :fetch-pull-request!
                (fn [actual-command]
                  (swap! calls* conj [:fetch (:delivery-id actual-command)])
                  (js/Promise.resolve current-pull-request))
                :actor-permission!
                (fn [actual-command]
                  (swap! calls* conj [:permission (:sender-id actual-command)])
                  (js/Promise.resolve {:permission "write"
                                       :user-id 9
                                       :user-login "operator"}))
                :dispatch-review!
                (^:async fn [installation-id dispatch]
                  (await (invoke-authorizer! dispatch :authorize-dispatch!))
                  (swap! calls* conj [:dispatch installation-id dispatch])
                  (js/Promise.resolve {:dispatched? true
                                       :workflow-run-id 987
                                       :run-url "https://api.github.test/runs/987"
                                       :html-url "https://github.test/runs/987"}))}
        queue-worker (worker/create
                      {:store state-store
                       :github github
                       :authority (authority/github-port github)
                       :policy review-policy
                       :replay-interval-ms 5000})]
    (try
      (await (store/initialize! state-store))
      (await (store/accept-delivery! state-store
                                     (admitted-command review-policy)))
      (await (worker/start! queue-worker))
      (await (worker/process-delivery! queue-worker delivery-id))
      (let [dispatches (filter #(= :dispatch (first %)) @calls*)
            [_ installation-id dispatch] (first dispatches)
            completion (await (store/read-completion state-store delivery-id))
            correlation (await (store/read-workflow-run-correlation
                                state-store delivery-id))]
        (is (= 1 (count dispatches)))
        (is (= 5 (count (filter #(= :fetch (first %)) @calls*))))
        (is (= 3 (count (filter #(= :permission (first %)) @calls*))))
        (is (= 77 installation-id))
        (is (= {:pr_number "321"
                :pr_base_sha "1111111111111111111111111111111111111111"
                :pr_head_sha "0123456789abcdef0123456789abcdef01234567"
                :pr_merge_sha "2222222222222222222222222222222222222222"
                :command_id delivery-id}
               (:inputs dispatch)))
        (is (= :dispatched (get-in completion [:result :outcome])))
        (is (= 987 (get-in completion [:result :workflow-run-id])))
        (is (= {:id 987
                :url "https://api.github.test/runs/987"
                :html-url "https://github.test/runs/987"}
               (get-in correlation [:correlation :workflow-run])))
        (is (= 7001
               (get-in correlation [:correlation :dispatch :workflow-id])))
        (is (empty? (await (store/pending-delivery-ids state-store)))))
      (finally
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async replay-settles-an-exact-cancelled-gate-superseded-by-a-newer-peer
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        dispatch (review-dispatch-intent)
        durable-gate
        (merge (:gate-check dispatch)
               {:id gate-check-id
                :node-id "CR_cancelled"
                :status "in_progress"
                :app-id 123
                :app-slug "eta-mu-controller"})
        dispatch-count* (atom 0)
        github {:prepare-review-gate!
                (fn [_ _]
                  (js/Promise.resolve
                   (assoc durable-gate
                          :status "completed"
                          :conclusion "cancelled"
                          :superseded? true
                          :superseded-by-check-id (inc gate-check-id))))
                :fetch-pull-request!
                (fn [_] (js/Promise.resolve current-pull-request))
                :actor-permission!
                (fn [_]
                  (js/Promise.resolve {:permission "write"
                                       :user-id 9
                                       :user-login "operator"}))
                :dispatch-review!
                (fn [_ _]
                  (swap! dispatch-count* inc)
                  (js/Promise.reject
                   (ex-info "superseded gate must not dispatch" {})))}
        queue-worker (worker/create
                      {:store state-store
                       :github github
                       :authority (authority/github-port github)
                       :policy review-policy
                       :replay-interval-ms 600000})]
    (try
      (await (store/initialize! state-store))
      (await (store/accept-delivery! state-store
                                     (admitted-command review-policy)))
      (await (store/claim-dispatch! state-store delivery-id dispatch))
      (await (store/record-gate-check! state-store delivery-id durable-gate))
      (await (worker/start! queue-worker))
      (let [completion
            (get-in (await (store/read-completion state-store delivery-id))
                    [:result])
            retained-gate
            (get-in (await (store/read-gate-check state-store delivery-id))
                    [:gate-check])]
        (is (= :gate-superseded (:outcome completion)))
        (is (= gate-check-id (:gate-check-id completion)))
        (is (= (inc gate-check-id)
               (:superseded-by-check-id completion)))
        (is (= "in_progress" (:status retained-gate)))
        (is (zero? @dispatch-count*))
        (is (empty? (await (store/pending-delivery-ids state-store))))
        (is (= {:replayed 0}
               (await (worker/replay-pending! queue-worker)))))
      (finally
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async resolved-thread-dispatches-the-separate-gate-workflow
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        dispatch* (atom nil)
        permission-calls* (atom 0)
        github {:prepare-review-gate! prepare-review-gate!
                :fetch-workflow-run! fetch-gate-review-run!
                :fetch-pull-request!
                (fn [_]
                  (js/Promise.resolve (assoc current-pull-request :labels #{})))
                :actor-permission!
                (fn [_]
                  (swap! permission-calls* inc)
                  (js/Promise.reject
                   (ex-info "review bot is not a collaborator" {})))
                :dispatch-review!
                (^:async fn [_ dispatch]
                  (await (invoke-authorizer! dispatch :authorize-dispatch!))
                  (reset! dispatch* dispatch)
                  (js/Promise.resolve {:workflow-run-id 991
                                       :run-url "https://api.github.test/runs/991"
                                       :html-url "https://github.test/runs/991"}))}
        queue-worker (worker/create
                      {:store state-store
                       :github github
                       :authority (authority/github-port github)
                       :policy review-policy
                       :replay-interval-ms 600000})
        thread-source (-> command
                          (assoc :event "pull_request_review_thread"
                                 :action "resolved"
                                 :review-thread-node-id "PRRT_example"
                                 :sender-id 1234
                                 :sender-login "coderabbitai[bot]")
                          (dissoc :label :capability))
        gate-command (:command (admission/decide review-policy
                                                  thread-source))
        evidence-delivery-id "56a5d98a-87df-4d70-a40c-40a3cf109198"
        evidence-run-id 900]
    (try
      (await (store/initialize! state-store))
      (await (store/claim-dispatch!
              state-store evidence-delivery-id
              (review-dispatch-intent evidence-delivery-id)))
      (await
       (store/record-workflow-run-correlation!
        state-store evidence-delivery-id
        {:command (assoc (admitted-command review-policy)
                         :delivery-id evidence-delivery-id
                         :command-id evidence-delivery-id)
         :dispatch (review-dispatch-intent evidence-delivery-id)
         :gate-check {:id 4500}
         :workflow-run
         (await (fetch-code-review-run!
                 {:workflow-run-id evidence-run-id}))}))
      (await (worker/start! queue-worker))
      (await (store/accept-delivery! state-store gate-command))
      (await (worker/process-delivery! queue-worker delivery-id))
      (let [completion (:result
                        (await (store/read-completion state-store delivery-id)))]
        (is (= :review-gate-reconcile (:command/type @dispatch*)))
        (is (= "review-resolution-gate.yml" (:workflow @dispatch*)))
        (is (= {:pr_number "321"
                :pr_base_sha "1111111111111111111111111111111111111111"
                :pr_head_sha "0123456789abcdef0123456789abcdef01234567"
                :pr_merge_sha "2222222222222222222222222222222222222222"
                :command_id delivery-id
                :gate_check_id (str gate-check-id)
                :evidence_run_id (str evidence-run-id)
                :evidence_command_id evidence-delivery-id}
               (:inputs @dispatch*)))
        (is (= :review-gate-reconcile (:command/type completion)))
        (is (= "pull_request_review_thread" (:event completion)))
        (is (= "resolved" (:action completion)))
        (is (= (str gate-check-id) (:gate-check-id completion)))
        (is (zero? @permission-calls*))
        (is (= 991 (:workflow-run-id completion))))
      (finally
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async lifecycle-gate-waits-for-the-newest-code-review-intent
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        older-id "193cbef4-af2f-4bc0-a73a-f4ac06ecb92c"
        newer-id "d0cfe1b8-4952-4331-8b36-3f53af75d33e"
        older-run-id 900
        newer-run-id 901
        prepared* (atom 0)
        dispatches* (atom [])
        github {:prepare-review-gate!
                (fn [installation-id expected]
                  (swap! prepared* inc)
                  (prepare-review-gate! installation-id expected))
                :fetch-pull-request!
                (fn [_]
                  (js/Promise.resolve (assoc current-pull-request :labels #{})))
                :actor-permission!
                (fn [_]
                  (js/Promise.reject
                   (ex-info "review lifecycle uses signed authority" {})))
                :dispatch-review!
                (^:async fn [_ dispatch]
                  (await (invoke-authorizer! dispatch :authorize-dispatch!))
                  (swap! dispatches* conj dispatch)
                  (js/Promise.resolve {:workflow-run-id 991
                                       :run-url "https://api.github.test/runs/991"
                                       :html-url "https://github.test/runs/991"}))}
        queue-worker (worker/create
                      {:store state-store
                       :github github
                       :authority (authority/github-port github)
                       :policy review-policy
                       :replay-interval-ms 600000})
        lifecycle-source (-> command
                             (assoc :event "pull_request_review_thread"
                                    :action "resolved"
                                    :review-thread-node-id "PRRT_latest"
                                    :sender-id 1234
                                    :sender-login "coderabbitai[bot]")
                             (dissoc :label :capability))
        gate-command (:command (admission/decide review-policy
                                                  lifecycle-source))
        correlation-for
        (fn [source-id run-id]
          {:command (assoc (admitted-command review-policy)
                           :delivery-id source-id
                           :command-id source-id)
           :dispatch (review-dispatch-intent source-id)
           :expected-run-attempt 1
           :gate-check {:id (- run-id 400)}
           :workflow-run {:id run-id
                          :url (str "https://api.github.test/runs/" run-id)
                          :html-url (str "https://github.test/runs/" run-id)}})]
    (try
      (await (store/initialize! state-store))
      (await (store/claim-dispatch! state-store older-id
                                    (review-dispatch-intent older-id)))
      (await (store/record-workflow-run-correlation!
              state-store older-id (correlation-for older-id older-run-id)))
      ;; This later ledger intent has not received GitHub's run details yet.
      (await (store/claim-dispatch! state-store newer-id
                                    (review-dispatch-intent newer-id)))
      (await (worker/start! queue-worker))
      (await (store/accept-delivery! state-store gate-command))
      (await (worker/process-delivery! queue-worker delivery-id))
      (testing "older success cannot create or dispatch the lifecycle gate"
        (is (zero? @prepared*))
        (is (empty? @dispatches*))
        (is (= [delivery-id]
               (await (store/pending-delivery-ids state-store))))
        (is (false? (await (store/gate-check-recorded?
                            state-store delivery-id)))))
      (await (store/record-workflow-run-correlation!
              state-store newer-id (correlation-for newer-id newer-run-id)))
      (await (worker/replay-pending! queue-worker))
      (testing "replay binds only the newest intent's returned run"
        (is (= 1 @prepared*))
        (is (= 1 (count @dispatches*)))
        (is (= (str newer-run-id)
               (get-in (first @dispatches*) [:inputs :evidence_run_id])))
        (is (= newer-id
               (get-in (first @dispatches*)
                       [:inputs :evidence_command_id])))
        (is (= :dispatched
               (get-in (await (store/read-completion
                               state-store delivery-id))
                       [:result :outcome]))))
      (finally
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async pull-request-lifecycle-invalidates-the-merge-gate-without-dispatch
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        invalidation-id "193cbef4-af2f-4bc0-a73a-f4ac06ecb92c"
        prepared* (atom [])
        dispatch-count* (atom 0)
        permission-count* (atom 0)
        github {:prepare-review-gate!
                (^:async fn [installation-id expected]
                  (swap! prepared* conj expected)
                  (await (prepare-review-gate! installation-id expected)))
                :fetch-pull-request!
                (fn [_] (js/Promise.resolve
                         (assoc current-pull-request :labels #{})))
                :actor-permission!
                (fn [_]
                  (swap! permission-count* inc)
                  (js/Promise.reject
                   (ex-info "defensive invalidation needs no collaborator role"
                            {})))
                :dispatch-review!
                (^:async fn [_ dispatch]
                  (await (invoke-authorizer! dispatch :authorize-dispatch!))
                  (swap! dispatch-count* inc)
                  (js/Promise.resolve {:workflow-run-id 999}))}
        queue-worker (worker/create
                      {:store state-store
                       :github github
                       :authority (authority/github-port github)
                       :policy review-policy
                       :replay-interval-ms 600000})
        source (-> command
                   (assoc :delivery-id invalidation-id
                          :action "synchronize")
                   (dissoc :label :capability))
        invalidation (:command (admission/decide review-policy source))]
    (try
      (await (store/initialize! state-store))
      (await (store/accept-delivery! state-store invalidation))
      (await (worker/start! queue-worker))
      (await (worker/process-delivery! queue-worker invalidation-id))
      (await (worker/process-delivery! queue-worker invalidation-id))
      (let [result (:result
                    (await (store/read-completion state-store
                                                  invalidation-id)))
            intent (:dispatch
                    (await (store/read-dispatch-intent state-store
                                                       invalidation-id)))]
        (is (= 1 (count @prepared*)))
        (is (zero? @dispatch-count*))
        (is (zero? @permission-count*))
        (is (= :gate-invalidated (:outcome result)))
        (is (= :review-gate-invalidate
               (keyword (:command/type intent))))
        (is (= (:merge-sha current-pull-request)
               (get-in intent [:gate-check :merge-sha])))
        (is (false? (await (store/dispatch-call-begun?
                            state-store invalidation-id))))
        (is (false? (await (store/workflow-run-correlation-recorded?
                            state-store invalidation-id)))))
      (finally
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async indeterminate-test-merge-remains-pending-until-refetch
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        current* (atom (assoc current-pull-request
                              :mergeable? nil :merge-sha nil))
        prepared* (atom 0)
        dispatch-count* (atom 0)
        github {:prepare-review-gate!
                (^:async fn [installation-id expected]
                  (swap! prepared* inc)
                  (await (prepare-review-gate! installation-id expected)))
                :fetch-pull-request! (fn [_] (js/Promise.resolve @current*))
                :actor-permission!
                (fn [_]
                  (js/Promise.resolve {:permission "write"
                                       :user-id 9
                                       :user-login "operator"}))
                :dispatch-review!
                (^:async fn [_ dispatch]
                  (await (invoke-authorizer! dispatch :authorize-dispatch!))
                  (swap! dispatch-count* inc)
                  (js/Promise.resolve {:workflow-run-id 987
                                       :run-url
                                       "https://api.github.test/runs/987"
                                       :html-url
                                       "https://github.test/runs/987"}))}
        queue-worker (worker/create
                      {:store state-store
                       :github github
                       :authority (authority/github-port github)
                       :policy review-policy
                       :replay-interval-ms 600000})]
    (try
      (await (store/initialize! state-store))
      (await (store/accept-delivery! state-store
                                     (admitted-command review-policy)))
      (await (worker/start! queue-worker))
      (await (worker/process-delivery! queue-worker delivery-id))
      (is (= [delivery-id]
             (await (store/pending-delivery-ids state-store))))
      (is (zero? @prepared*))
      (is (zero? @dispatch-count*))
      (reset! current* current-pull-request)
      (await (worker/replay-pending! queue-worker))
      (is (= 1 @prepared*))
      (is (= 1 @dispatch-count*))
      (is (= :dispatched
             (get-in (await (store/read-completion state-store delivery-id))
                     [:result :outcome])))
      (finally
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async workflow-completion-waits-for-test-merge-then-updates-the-gate
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        source-id "808f730f-136f-457d-b629-ceccdcf7766b"
        completion-id "56a5d98a-87df-4d70-a40c-40a3cf109198"
        run-id 991
        run-path "open-hax/eta-mu/.github/workflows/review-resolution-gate.yml@main"
        fetched-runs* (atom 0)
        terminal-call* (atom nil)
        current* (atom (assoc current-pull-request
                              :labels #{}
                              :mergeable? nil
                              :merge-sha nil))
        original-command (assoc command
                                :delivery-id source-id
                                :command-id source-id
                                :command/type :review-gate-reconcile)
        dispatch {:command/type :review-gate-reconcile
                  :event "pull_request_review_thread"
                  :action "resolved"
                  :repository "open-hax/eta-mu"
                  :repository-id 42
                  :pull-request-node-id "PR_kwDOExample"
                  :workflow "review-resolution-gate.yml"
                  :workflow-id 7002
                  :ref "main"
                  :inputs {:pr_number "321"
                           :pr_base_sha (:base-sha current-pull-request)
                           :pr_head_sha (:head-sha current-pull-request)
                           :pr_merge_sha (:merge-sha current-pull-request)
                           :command_id source-id
                           :gate_check_id (str gate-check-id)
                           :evidence_run_id "900"
                           :evidence_command_id delivery-id}}
        gate-check (merge (:gate-check (review-dispatch-intent source-id))
                          {:id gate-check-id
                           :node-id "CR_kwDOGate"
                           :app-id 123
                           :app-slug "eta-mu-controller"
                           :status "in_progress"})
        completed-run (assoc (await (fetch-gate-review-run!
                                     {:workflow-run-id run-id}))
                             :path run-path
                             :status "completed"
                             :conclusion "success")
        adapter (github/port {:github-api-url "https://api.github.test"
                              :github-app-id 123 :github-private-key "mocked-signing"
                              :mode :review-dispatch})
        github {:fetch-workflow-run!
                (^:async fn [request]
                  (with-redefs
                    [crypto/github-app-jwt (fn [& _] "test-jwt")
                     http/request!
                     (fn [{:keys [url method]}]
                       (if (= "POST" method)
                         {:ok? true :status 201 :body {:token "test-token"}}
                         (do
                           (is (= "https://api.github.test/repos/open-hax/eta-mu/actions/runs/991"
                                  url))
                           (swap! fetched-runs* inc)
                           {:ok? true :status 200
                            :body {:id run-id :node_id "WFR_991" :workflow_id 7002
                                   :repository {:id 42 :full_name "open-hax/eta-mu"}
                                   :path run-path :event "workflow_dispatch"
                                   :status "completed" :conclusion "success"
                                   :head_sha (:head-sha completed-run)
                                   :head_branch "main" :run_attempt 1
                                   :url (:url completed-run)
                                   :html_url (:html-url completed-run)
                                   :actor {:id 501 :login "eta-mu-controller[bot]"}
                                   :triggering_actor
                                   {:id 501 :login "eta-mu-controller[bot]"}}})))]
                    (await ((:fetch-workflow-run! adapter) request))))
                :fetch-pull-request! (fn [_]
                                       (js/Promise.resolve @current*))
                :complete-review-gate!
                (^:async fn [installation-id request]
                  (await ((:authorize-patch! request)))
                  (reset! terminal-call*
                          {:installation-id installation-id
                           :request request})
                  (js/Promise.resolve {:updated? true}))}
        queue-worker (worker/create
                      {:store state-store
                       :github github
                       :authority {}
                       :policy review-policy
                       :replay-interval-ms 600000})
        completion (:command
                    (admission/decide
                     review-policy
                     (assoc (completion-command completion-id run-id 7002
                                                "review-resolution-gate.yml"
                                                "success")
                            :workflow-run-path run-path)))]
    (try
      (await (store/initialize! state-store))
      (await
       (store/record-workflow-run-correlation!
        state-store source-id
        {:command original-command
         :dispatch (assoc dispatch :gate-check gate-check)
         :expected-run-attempt 1
         :gate-check gate-check
         :workflow-run {:id run-id
                        :url (:url completed-run)
                        :html-url (:html-url completed-run)}}))
      (await (store/accept-delivery! state-store completion))
      (await (worker/start! queue-worker))
      (await (worker/process-delivery! queue-worker completion-id))
      (is (nil? @terminal-call*))
      (is (false? (await (store/completed? state-store completion-id))))
      (is (= [completion-id]
             (await (store/pending-delivery-ids state-store))))
      (reset! current* (assoc current-pull-request :labels #{}))
      (await (worker/replay-pending! queue-worker))
      (let [result (:result
                    (await (store/read-completion state-store completion-id)))
            terminal-receipt (await (store/read-gate-terminal-intent
                                     state-store completion-id))
            intent (get-in @terminal-call* [:request :terminal-intent])]
        (is (<= 2 @fetched-runs*))
        (is (= run-path
               (get-in (await (store/read-delivery state-store completion-id))
                       [:command :workflow-run-path])))
        (is (= 77 (:installation-id @terminal-call*)))
        (is (= gate-check-id
               (get-in @terminal-call* [:request :gate-check :id])))
        (is (= "success" (get-in intent [:patch :conclusion])))
        (is (= "https://github.test/runs/991/attempts/1"
               (get-in intent [:patch :details-url])))
        (is (= source-id (:source-delivery-id intent)))
        (is (= intent (:intent terminal-receipt)))
        (is (= :gate-completed (:outcome result)))
        (is (= gate-check-id (:gate-check-id result))))
      (finally
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async code-review-terminalization-ignores-removed-label-and-issuer-permission
  (doseq [scenario [:removed-label :tuple-drift :revoked-lease]]
    (let [root (await (fs/temporary-directory!))
          state-store (store/create root)
          source-id "808f730f-136f-457d-b629-ceccdcf7766b"
          completion-id "56a5d98a-87df-4d70-a40c-40a3cf109198"
          run-id 991
          current* (atom (assoc current-pull-request :labels #{}))
          lease-allowed?* (atom true)
          permission-reads* (atom 0)
          terminal-patches* (atom [])
          original-command (assoc (admitted-command review-policy)
                                  :delivery-id source-id :command-id source-id)
          dispatch (review-dispatch-intent source-id)
          gate-check (merge (:gate-check dispatch)
                            {:id gate-check-id :node-id "CR_kwDOGate"
                             :app-id 123 :app-slug "eta-mu-controller"
                             :status "in_progress"})
          completed-run (assoc (await (fetch-code-review-run!
                                      {:workflow-run-id run-id}))
                               :status "completed" :conclusion "success")
          github {:fetch-workflow-run! (fn [request]
                                        (is (= {:installation-id 77
                                                :repository "open-hax/eta-mu"
                                                :repository-id 42
                                                :workflow-run-id run-id}
                                               request))
                                        (js/Promise.resolve completed-run))
                  :fetch-pull-request! (fn [_] (js/Promise.resolve @current*))
                  :actor-permission!
                  (fn [_]
                    (swap! permission-reads* inc)
                    (js/Promise.resolve {:permission "read"
                                         :user-id 9 :user-login "operator"}))
                  :complete-review-gate!
                  (^:async fn [_ request]
                    (case scenario
                      :tuple-drift (swap! current* assoc :base-sha
                                          "3333333333333333333333333333333333333333")
                      :revoked-lease (reset! lease-allowed?* false)
                      nil)
                    (await ((:authorize-patch! request)))
                    (swap! terminal-patches* conj (:terminal-intent request))
                    {:updated? true})}
          current-policy (assoc review-policy :effect-lease
                                {:status! #(js/Promise.resolve {:state :active})
                                 :authorize! (fn [_]
                                               (js/Promise.resolve
                                                {:allowed? @lease-allowed?*
                                                 :lease {:state :active}}))})
          queue-worker (worker/create
                        {:store state-store :github github
                         :authority (authority/github-port github)
                         :policy current-policy :replay-interval-ms 600000})
          completion (completion-command completion-id run-id 7001
                                         "opencode-code-review.yml" "success")]
      (try
        (await (store/initialize! state-store))
        (await
         (store/record-workflow-run-correlation!
          state-store source-id
          {:command original-command :dispatch (assoc dispatch :gate-check gate-check)
           :expected-run-attempt 1 :gate-check gate-check
           :workflow-run {:id run-id :url (:url completed-run)
                          :html-url (:html-url completed-run)}}))
        (await (worker/start! queue-worker))
        (await (store/accept-delivery! state-store completion))
        (await (worker/process-delivery! queue-worker completion-id))
        (is (zero? @permission-reads*))
        (is (= (= :removed-label scenario)
               (await (store/completed? state-store completion-id)))
            (name scenario))
        (if (= :removed-label scenario)
          (do
            (is (= 1 (count @terminal-patches*)))
            (is (= "failure" (get-in (first @terminal-patches*) [:patch :conclusion])))
            (is (= source-id (:source-delivery-id (first @terminal-patches*))))
            (is (= :gate-completed
                   (get-in (await (store/read-completion state-store completion-id))
                           [:result :outcome]))))
          (do
            (is (empty? @terminal-patches*))
            (is (= [completion-id] (await (store/pending-delivery-ids state-store))))
            (is (= (if (= :tuple-drift scenario)
                     :pull-request-context-changed :effect-lease-revoked)
                   (get-in (worker/status queue-worker) [:last-error :error/code])))))
        (finally
          (worker/stop! queue-worker)
          (await (fs/remove-tree! root)))))))

(deftest ^:async older-workflow-completion-closes-gate-after-partial-supersession-and-refusal
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        successor-id "808f730f-136f-457d-b629-ceccdcf7766b"
        completion-id "56a5d98a-87df-4d70-a40c-40a3cf109198"
        labels* (atom [{:name "eta-mu:review"}])
        checks* (atom {})
        next-check-id* (atom 4566)
        old-cancel-failures* (atom 2)
        patch-attempts* (atom [])
        dispatches* (atom 0)
        adapter (github/port {:github-api-url "https://api.github.test"
                              :github-app-id 123 :github-private-key "mocked-signing"
                              :mode :review-dispatch})
        queue-worker (worker/create
                      {:store state-store :policy review-policy :github adapter
                       :authority (authority/github-port adapter)
                       :replay-interval-ms 600000})
        current-repository {:id 42 :full_name "open-hax/eta-mu" :default_branch "main"}
        successor (assoc (admitted-command review-policy)
                         :delivery-id successor-id :command-id successor-id)]
    (try
      (with-redefs
        [crypto/github-app-jwt (fn [& _] "test-jwt")
         http/request!
         (fn [{:keys [url method body]}]
           (cond
             (.endsWith url "/access_tokens")
             {:ok? true :status 201 :body {:token "test-token"}}

             (.endsWith url "/pulls/321")
             {:ok? true :status 200
              :body {:number 321 :node_id "PR_kwDOExample"
                     :state "open" :draft false :mergeable true
                     :merge_commit_sha (:merge-sha current-pull-request)
                     :head {:sha (:head-sha current-pull-request) :repo current-repository}
                     :base {:ref "main" :sha (:base-sha current-pull-request)}
                     :html_url (:html-url current-pull-request) :labels @labels*}}

             (.endsWith url "/repos/open-hax/eta-mu")
             {:ok? true :status 200 :body current-repository}

             (.endsWith url "/permission")
             {:ok? true :status 200
              :body {:permission "write" :user {:id 9 :login "operator"}}}

             (.includes url "/commits/")
             {:ok? true :status 200 :body {:check_runs (vec (vals @checks*))}}

             (and (= "POST" method) (.endsWith url "/check-runs"))
             (let [id (swap! next-check-id* inc)
                   check (assoc body :id id :node_id (str "CR_" id) :conclusion nil
                                :app {:id 123 :slug "eta-mu-controller"})]
               (swap! checks* assoc id check)
               {:ok? true :status 201 :body check})

             (.includes url "/check-runs/")
             (let [id (if (.endsWith url "/4567") 4567 4568)]
               (if (= "GET" method)
                 {:ok? true :status 200 :body (get @checks* id)}
                 (do
                   (swap! patch-attempts* conj [id (:conclusion body)])
                   (if (and (= 4567 id) (pos? @old-cancel-failures*))
                     (do (swap! old-cancel-failures* dec)
                         {:ok? false :status 503 :body {}})
                     (let [updated (merge (get @checks* id) body)]
                       (swap! checks* assoc id updated)
                       {:ok? true :status 200 :body updated})))))

             (.endsWith url "/dispatches")
             (do
               (swap! dispatches* inc)
               {:ok? true :status 200
                :body {:workflow_run_id 987 :run_url "https://api.github.test/runs/987"
                       :html_url "https://github.test/runs/987"}})

             (.endsWith url "/actions/runs/987")
             {:ok? true :status 200
              :body {:id 987 :node_id "WFR_987" :workflow_id 7001
                     :repository current-repository
                     :path ".github/workflows/opencode-code-review.yml@main"
                     :event "workflow_dispatch" :status "completed" :conclusion "success"
                     :head_sha "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
                     :head_branch "main" :run_attempt 1
                     :url "https://api.github.test/runs/987"
                     :html_url "https://github.test/runs/987"
                     :actor {:id 501 :login "eta-mu-controller[bot]"}
                     :triggering_actor {:id 501 :login "eta-mu-controller[bot]"}}}

             :else (throw (ex-info "unexpected GitHub fixture request"
                                  {:method method :url url}))))]
        (await (store/initialize! state-store))
        (await (worker/start! queue-worker))
        (await (store/accept-delivery! state-store (admitted-command review-policy)))
        (await (worker/process-delivery! queue-worker delivery-id))
        (is (= 1 @dispatches*))
        (await (store/accept-delivery! state-store successor))
        (await (worker/process-delivery! queue-worker successor-id))
        (is (= "in_progress" (:status (get @checks* 4567))))
        (is (= "in_progress" (:status (get @checks* 4568))))
        (is (false? (await (store/completed? state-store successor-id))))
        (reset! labels* [])
        (await (worker/process-delivery! queue-worker successor-id))
        (is (= :refused
               (get-in (await (store/read-completion state-store successor-id))
                       [:result :outcome])))
        (is (= "cancelled" (:conclusion (get @checks* 4568))))
        (is (= "in_progress" (:status (get @checks* 4567))))
        (await (store/accept-delivery!
                state-store (completion-command completion-id 987 7001
                                                "opencode-code-review.yml" "success")))
        (await (worker/process-delivery! queue-worker completion-id))
        (is (false? (await (store/completed? state-store completion-id))))
        (is (= [completion-id] (await (store/pending-delivery-ids state-store))))
        (is (= "in_progress" (:status (get @checks* 4567))))
        (await (worker/replay-pending! queue-worker))
        (let [result (:result (await (store/read-completion state-store completion-id)))]
          (is (= :gate-superseded (:outcome result)))
          (is (= 4568 (:superseded-by-check-id result)))
          (is (= "cancelled" (:conclusion result)))
          (is (true? (:updated result))))
        (is (= "cancelled" (:conclusion (get @checks* 4567))))
        (is (= "cancelled" (:conclusion (get @checks* 4568))))
        (is (empty? (await (store/pending-delivery-ids state-store))))
        (await (worker/process-delivery! queue-worker completion-id))
        (is (= [[4567 "cancelled"] [4568 "cancelled"]
                [4567 "cancelled"] [4567 "cancelled"]]
               @patch-attempts*))
        (is (= 1 @dispatches*)))
      (finally
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async uncorrelated-completion-remains-replayable-without-effects
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        completion-id "56a5d98a-87df-4d70-a40c-40a3cf109198"
        completion (completion-command completion-id 991 7002
                                       "review-resolution-gate.yml"
                                       "success")
        queue-worker (worker/create
                      {:store state-store
                       :github {}
                       :authority {}
                       :policy review-policy
                       :replay-interval-ms 600000})]
    (try
      (await (store/initialize! state-store))
      (await (store/accept-delivery! state-store completion))
      (await (worker/start! queue-worker))
      (await (worker/process-delivery! queue-worker completion-id))
      (is (= [completion-id]
             (await (store/pending-delivery-ids state-store))))
      (await (worker/replay-pending! queue-worker))
      (is (= [completion-id]
             (await (store/pending-delivery-ids state-store))))
      (is (false? (await (store/completed? state-store completion-id))))
      (finally
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async effect-lease-defers-ordinary-work-allows-canary-and-revokes
  (let [root (await (fs/temporary-directory!))
        state-root (fs/join root "state")
        marker (fs/join root ".active-release")
        canary-id "56a5d98a-87df-4d70-a40c-40a3cf109198"
        rollback-id "808f730f-136f-457d-b629-ceccdcf7766b"
        lease (effect-lease/port
               {:deployment-id "101-1"
                :active-marker-file marker
                :canary-delivery-ids #{canary-id}})
        current-policy (assoc review-policy :effect-lease lease)
        state-store (store/create state-root)
        calls* (atom {:fetch 0 :permission 0 :dispatch 0})
        github {:prepare-review-gate! prepare-review-gate!
                :fetch-workflow-run! fetch-code-review-run!
                :fetch-pull-request!
                (fn [_]
                  (swap! calls* update :fetch inc)
                  (js/Promise.resolve current-pull-request))
                :actor-permission!
                (fn [_]
                  (swap! calls* update :permission inc)
                  (js/Promise.resolve {:permission "write"
                                       :user-id 9
                                       :user-login "operator"}))
                :dispatch-review!
                (^:async fn [_ dispatch]
                  (await (invoke-authorizer! dispatch :authorize-dispatch!))
                  (swap! calls* update :dispatch inc)
                  (js/Promise.resolve {:workflow-run-id 987
                                       :run-url "https://api.github.test/runs/987"
                                       :html-url "https://github.test/runs/987"}))}
        queue-worker (worker/create
                      {:store state-store
                       :github github
                       :authority (authority/github-port github)
                       :policy current-policy
                       :replay-interval-ms 600000})]
    (try
      (await (store/initialize! state-store))
      (await (worker/start! queue-worker))
      (await (store/accept-delivery! state-store
                                     (admitted-command current-policy)))
      (await (worker/process-delivery! queue-worker delivery-id))
      (testing "a provisional candidate performs no GitHub call or claim"
        (is (= {:fetch 0 :permission 0 :dispatch 0} @calls*))
        (is (= [delivery-id]
               (await (store/pending-delivery-ids state-store))))
        (is (empty? (await (fs/entries
                            (get-in state-store [:paths :outbox])))))
        (is (= :provisional
               (get-in (worker/status queue-worker) [:effect-lease :state]))))
      (testing "atomic activation replays the pending effect exactly once"
        (await (fs/write-exclusive! marker "101-1\n"))
        (await (worker/replay-pending! queue-worker))
        (await (worker/replay-pending! queue-worker))
        (is (= {:fetch 5 :permission 3 :dispatch 1} @calls*))
        (is (= :dispatched
               (get-in (await (store/read-completion state-store delivery-id))
                       [:result :outcome]))))
      (testing "rollback revokes ordinary effects without a restart"
        (await (replace-marker! root marker "100-1\n"))
        (let [rolled-command (-> (admitted-command current-policy)
                                 (assoc :delivery-id rollback-id
                                        :command-id rollback-id))]
          (await (store/accept-delivery! state-store rolled-command))
          (await (worker/process-delivery! queue-worker rollback-id))
          (is (= {:fetch 5 :permission 3 :dispatch 1} @calls*))
          (is (= [rollback-id]
                 (await (store/pending-delivery-ids state-store))))))
      (testing "an exact deployment canary GUID is the only provisional bypass"
        (let [canary-command (-> (admitted-command current-policy)
                                 (assoc :delivery-id canary-id
                                        :command-id canary-id))]
          (await (store/accept-delivery! state-store canary-command))
          (await (worker/process-delivery! queue-worker canary-id))
          (is (= {:fetch 10 :permission 6 :dispatch 2} @calls*))
          (is (= :dispatched
                 (get-in (await (store/read-completion state-store canary-id))
                         [:result :outcome])))))
      (finally
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async ingress-probe-is-terminal-and-effect-free-in-every-lease-state
  (doseq [[scenario mode marker-text]
          [[:observe :observe-only nil]
           [:provisional :review-dispatch nil]
           [:active :review-dispatch "201-1\n"]]]
    (let [root (await (fs/temporary-directory!))
          state-root (fs/join root "state")
          marker (fs/join root ".active-release")
          lease (effect-lease/port
                 {:deployment-id "201-1"
                  :active-marker-file marker
                  :canary-delivery-ids #{}})
          current-policy (assoc (policy mode (str (name scenario) "-policy"))
                                :effect-lease lease)
          state-store (store/create state-root)
          dispatch-count* (atom 0)
          github {:prepare-review-gate! prepare-review-gate!
                :fetch-workflow-run! fetch-code-review-run!
                :fetch-pull-request!
                  (fn [_]
                    (js/Promise.resolve
                     (update current-pull-request :labels conj "eta-mu:probe")))
                  :actor-permission!
                  (fn [_]
                    (js/Promise.resolve {:permission "write"
                                         :user-id 9
                                         :user-login "operator"}))
                  :dispatch-review!
                  (^:async fn [_ dispatch]
                    (await (invoke-authorizer! dispatch :authorize-dispatch!))
                    (swap! dispatch-count* inc)
                    (js/Promise.resolve {:workflow-run-id 1}))}
          queue-worker (worker/create
                        {:store state-store
                         :github github
                         :authority (authority/github-port github)
                         :policy current-policy
                         :replay-interval-ms 600000})
          probe-source (-> command
                           (assoc :label "eta-mu:probe")
                           (dissoc :capability))
          probe-command (:command (admission/decide current-policy
                                                     probe-source))]
      (try
        (await (store/initialize! state-store))
        (when marker-text
          (await (fs/write-exclusive! marker marker-text)))
        (await (worker/start! queue-worker))
        (is (:accepted? (await (store/accept-delivery! state-store
                                                       probe-command))))
        (is (:duplicate? (await (store/accept-delivery! state-store
                                                        probe-command))))
        (await (worker/process-delivery! queue-worker delivery-id))
        (await (worker/process-delivery! queue-worker delivery-id))
        (let [result (:result
                      (await (store/read-completion state-store delivery-id)))]
          (is (= :probed (:outcome result)))
          (is (= :ingress-probe (:command/type result)))
          (is (= "eta-mu:probe" (:label result)))
          (is (= "0123456789abcdef0123456789abcdef01234567"
                 (:pr-head-sha result)))
          (is (= mode (keyword (:mode result)))))
        (is (zero? @dispatch-count*))
        (is (empty? (await (fs/entries
                            (get-in state-store [:paths :outbox])))))
        (finally
          (worker/stop! queue-worker)
          (await (fs/remove-tree! root)))))))

(deftest ^:async uncertain-dispatch-is-held-instead-of-replayed
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        dispatch-count* (atom 0)
        github {:prepare-review-gate! prepare-review-gate!
                :fetch-workflow-run! fetch-code-review-run!
                :fetch-pull-request!
                (fn [_] (js/Promise.resolve current-pull-request))
                :actor-permission!
                (fn [_]
                  (js/Promise.resolve {:permission "write"
                                       :user-id 9
                                       :user-login "operator"}))
                :dispatch-review!
                (^:async fn [_ dispatch]
                  (await (invoke-authorizer! dispatch :authorize-dispatch!))
                  (swap! dispatch-count* inc)
                  (js/Promise.reject
                   (ex-info "synthetic transport loss"
                            {:error/code :synthetic-transport-loss})))}
        queue-worker (worker/create
                      {:store state-store
                       :github github
                       :authority (authority/github-port github)
                       :policy review-policy
                       :replay-interval-ms 5000})]
    (try
      (await (store/initialize! state-store))
      (await (store/accept-delivery! state-store
                                     (admitted-command review-policy)))
      (await (worker/start! queue-worker))
      (await (worker/process-delivery! queue-worker delivery-id))
      (let [completion (await (store/read-completion state-store delivery-id))]
        (testing "the durable intent prevents a second external effect"
          (is (= 1 @dispatch-count*))
          (is (= :held (get-in completion [:result :outcome])))
          (is (= :dispatch-outcome-uncertain
                 (get-in completion [:result :reason])))))
      (finally
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async live-repair-holds-a-journal-first-dispatch-call
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        dispatch-invocations* (atom 0)
        github-posts* (atom 0)
        write-exclusive! fs/write-exclusive!
        fail-once?* (atom true)
        dispatch-call-file
        (fs/join (get-in state-store [:paths :dispatch-calls])
                 (str delivery-id ".edn"))
        dispatch-ledger (fs/join root "ledgers" "dispatches.nd-edn")
        github {:prepare-review-gate! prepare-review-gate!
                :fetch-workflow-run! fetch-code-review-run!
                :fetch-pull-request!
                (fn [_] (js/Promise.resolve current-pull-request))
                :actor-permission!
                (fn [_]
                  (js/Promise.resolve {:permission "write"
                                       :user-id 9
                                       :user-login "operator"}))
                :dispatch-review!
                (^:async fn [_ dispatch]
                  (swap! dispatch-invocations* inc)
                  (await (invoke-authorizer! dispatch :authorize-dispatch!))
                  (swap! github-posts* inc)
                  {:dispatched? true
                   :workflow-run-id 987
                   :run-url "https://api.github.test/runs/987"
                   :html-url "https://github.test/runs/987"})}
        queue-worker (worker/create
                      {:store state-store
                       :github github
                       :authority (authority/github-port github)
                       :policy review-policy
                       :replay-interval-ms 600000})]
    (reset! failing-projection-write-context*
            {:write-exclusive! write-exclusive!
             :target dispatch-call-file
             :fail-once?* fail-once?*})
    (try
      (await (store/initialize! state-store))
      (await (worker/start! queue-worker))
      (await (store/accept-delivery! state-store
                                     (admitted-command review-policy)))
      (with-redefs [fs/write-exclusive! fail-projection-write-once!]
        (await (worker/process-delivery! queue-worker delivery-id)))
      (testing "the call boundary reached the journal but not its projection"
        (is (= 1 @dispatch-invocations*))
        (is (zero? @github-posts*))
        (is (true? (:running? (worker/status queue-worker))))
        (is (false? (await (fs/path-exists? dispatch-call-file))))
        (is (= 1 (count (re-seq #":review-dispatch-call-begun"
                                (await (fs/read-text dispatch-ledger)))))))
      (testing "live repair terminalizes the command before ordinary replay"
        (is (= {:replayed 1}
               (await (worker/replay-pending! queue-worker))))
        (let [completion (await (store/read-completion
                                 state-store delivery-id))]
          (is (= :held (get-in completion [:result :outcome])))
          (is (= :dispatch-outcome-uncertain
                 (get-in completion [:result :reason]))))
        (is (= {:replayed 0}
               (await (worker/replay-pending! queue-worker))))
        (is (= 1 @dispatch-invocations*))
        (is (zero? @github-posts*))
        (is (= 1 (count (re-seq #":review-dispatch-call-begun"
                                (await (fs/read-text dispatch-ledger))))))
        (is (= 1 (count (re-seq #":review-command-completed"
                                (await (fs/read-text dispatch-ledger)))))))
      (finally
        (reset! failing-projection-write-context* nil)
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async marker-race-between-enumeration-and-processing-is-held
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        dispatch-invocations* (atom 0)
        github-posts* (atom 0)
        write-exclusive! fs/write-exclusive!
        begin-dispatch-call! store/begin-dispatch-call!
        pending-delivery-ids store/pending-delivery-ids
        fail-projection-once?* (atom true)
        block-begin-once?* (atom true)
        block-pending-once?* (atom true)
        begin-ready!* (atom nil)
        begin-release!* (atom nil)
        pending-ready!* (atom nil)
        pending-release!* (atom nil)
        begin-ready (js/Promise. (fn [resolve _]
                                   (reset! begin-ready!* resolve)))
        begin-release (js/Promise. (fn [resolve _]
                                     (reset! begin-release!* resolve)))
        pending-ready (js/Promise. (fn [resolve _]
                                     (reset! pending-ready!* resolve)))
        pending-release (js/Promise. (fn [resolve _]
                                       (reset! pending-release!* resolve)))
        dispatch-call-file
        (fs/join (get-in state-store [:paths :dispatch-calls])
                 (str delivery-id ".edn"))
        completion-file
        (fs/join (get-in state-store [:paths :dispatches])
                 (str delivery-id ".edn"))
        dispatch-ledger (fs/join root "ledgers" "dispatches.nd-edn")
        github {:prepare-review-gate! prepare-review-gate!
                :fetch-workflow-run! fetch-code-review-run!
                :fetch-pull-request!
                (fn [_] (js/Promise.resolve current-pull-request))
                :actor-permission!
                (fn [_]
                  (js/Promise.resolve {:permission "write"
                                       :user-id 9
                                       :user-login "operator"}))
                :dispatch-review!
                (^:async fn [_ dispatch]
                  (swap! dispatch-invocations* inc)
                  (await (invoke-authorizer! dispatch :authorize-dispatch!))
                  (swap! github-posts* inc)
                  {:workflow-run-id 987
                   :run-url "https://api.github.test/runs/987"
                   :html-url "https://github.test/runs/987"})}
        queue-worker (worker/create
                      {:store state-store
                       :github github
                       :authority (authority/github-port github)
                       :policy review-policy
                       :replay-interval-ms 600000})]
    (reset! failing-projection-write-context*
            {:write-exclusive! write-exclusive!
             :target dispatch-call-file
             :fail-once?* fail-projection-once?*})
    (reset! marker-race-context*
            {:begin-dispatch-call! begin-dispatch-call!
             :pending-delivery-ids pending-delivery-ids
             :block-begin-once?* block-begin-once?*
             :block-pending-once?* block-pending-once?*
             :begin-ready!* begin-ready!*
             :begin-release begin-release
             :pending-ready!* pending-ready!*
             :pending-release pending-release})
    (try
      (await (store/initialize! state-store))
      (await (worker/start! queue-worker))
      (await (store/accept-delivery! state-store
                                     (admitted-command review-policy)))
      (with-redefs [fs/write-exclusive! fail-projection-write-once!
                    store/begin-dispatch-call!
                    block-before-dispatch-call-once!
                    store/pending-delivery-ids block-after-pending-read-once!]
        (let [processing (worker/process-delivery! queue-worker delivery-id)]
          (await begin-ready)
          (let [replaying (worker/replay-pending! queue-worker)]
            ;; Replay has enumerated this delivery while no marker exists. The
            ;; original owner then durably appends the marker, fails projection
            ;; publication, and releases ownership before replay processes it.
            (await pending-ready)
            (@begin-release!* true)
            (await processing)
            (is (false? (await (fs/path-exists? dispatch-call-file))))
            (is (false? (await (fs/path-exists? completion-file))))
            (@pending-release!* true)
            (is (= {:replayed 1} (await replaying)))
            (let [completion (await (store/read-completion
                                     state-store delivery-id))]
              (is (= :held (get-in completion [:result :outcome])))
              (is (= :dispatch-outcome-uncertain
                     (get-in completion [:result :reason])))))))
      (is (= 1 @dispatch-invocations*))
      (is (zero? @github-posts*))
      (is (= {:replayed 0}
             (await (worker/replay-pending! queue-worker))))
      (is (= 1 (count (re-seq #":review-dispatch-call-begun"
                              (await (fs/read-text dispatch-ledger))))))
      (is (= 1 (count (re-seq #":review-command-completed"
                              (await (fs/read-text dispatch-ledger))))))
      (finally
        (reset! failing-projection-write-context* nil)
        (reset! marker-race-context* nil)
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async failure-to-persist-an-uncertain-call-disables-until-recovery
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        dispatch-started-resolve* (atom nil)
        dispatch-reject* (atom nil)
        dispatch-started
        (js/Promise. (fn [resolve _]
                       (reset! dispatch-started-resolve* resolve)))
        dispatch-count* (atom 0)
        github {:prepare-review-gate! prepare-review-gate!
                :fetch-pull-request!
                (fn [_] (js/Promise.resolve current-pull-request))
                :actor-permission!
                (fn [_]
                  (js/Promise.resolve {:permission "write"
                                       :user-id 9
                                       :user-login "operator"}))
                :dispatch-review!
                (^:async fn [_ dispatch]
                  (await (invoke-authorizer! dispatch :authorize-dispatch!))
                  (swap! dispatch-count* inc)
                  (@dispatch-started-resolve* true)
                  (js/Promise.
                   (fn [_ reject]
                     (reset! dispatch-reject* reject))))}
        queue-worker (worker/create
                      {:store state-store
                       :github github
                       :authority (authority/github-port github)
                       :policy review-policy
                       :replay-interval-ms 600000})
        restarted-worker (worker/create
                          {:store state-store
                           :github github
                           :authority (authority/github-port github)
                           :policy review-policy
                           :replay-interval-ms 600000})
        dispatch-ledger (fs/join root "ledgers" "dispatches.nd-edn")]
    (try
      (await (store/initialize! state-store))
      (await (worker/start! queue-worker))
      (await (store/accept-delivery! state-store
                                     (admitted-command review-policy)))
      (let [processing (worker/process-delivery! queue-worker delivery-id)]
        (await dispatch-started)
        (let [dispatch-ledger-contents (await (fs/read-text dispatch-ledger))]
          (await (remove-dispatch-projections! state-store delivery-id))
          (await (fs/remove-file-if-present! dispatch-ledger))
          (await (fs/ensure-directory! dispatch-ledger))
          (@dispatch-reject*
           (ex-info "synthetic transport loss"
                    {:error/code :synthetic-transport-loss}))
          (let [failure (try
                          (await processing)
                          nil
                          (catch :default error error))]
            (is (= :completion-not-durable
                   (:error/code (ex-data failure))))
            (is (true? (:fatal? (worker/status queue-worker))))
            (is (false? (:running? (worker/status queue-worker)))))
          (is (= 1 @dispatch-count*))
          (await (fs/remove-tree! dispatch-ledger))
          (is (await (fs/write-exclusive! dispatch-ledger
                                          dispatch-ledger-contents)))
          (await (worker/start! restarted-worker))
          (let [startup (get-in (worker/status restarted-worker)
                                [:startup :evidence])]
            (is (= 0 (get-in startup [:reconciliation :ledger-appends])))
            (is (= :held
                   (get-in (await (store/read-completion state-store delivery-id))
                           [:result :outcome])))
            (is (= 1 @dispatch-count*)))))
      (finally
        (worker/stop! queue-worker)
        (worker/stop! restarted-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async completion-is-not-terminal-until-its-ledger-receipt-is-proven
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        dispatch-started-resolve* (atom nil)
        dispatch-release* (atom nil)
        dispatch-started
        (js/Promise. (fn [resolve _]
                       (reset! dispatch-started-resolve* resolve)))
        dispatch-count* (atom 0)
        github {:prepare-review-gate! prepare-review-gate!
                :fetch-workflow-run! fetch-code-review-run!
                :fetch-pull-request!
                (fn [_] (js/Promise.resolve current-pull-request))
                :actor-permission!
                (fn [_]
                  (js/Promise.resolve {:permission "write"
                                       :user-id 9
                                       :user-login "operator"}))
                :dispatch-review!
                (^:async fn [_ dispatch]
                  (await (invoke-authorizer! dispatch :authorize-dispatch!))
                  (swap! dispatch-count* inc)
                  (@dispatch-started-resolve* true)
                  (js/Promise.
                   (fn [resolve _]
                     (reset! dispatch-release* resolve))))}
        queue-worker (worker/create
                      {:store state-store
                       :github github
                       :authority (authority/github-port github)
                       :policy review-policy
                       :replay-interval-ms 600000})
        restarted-worker (worker/create
                          {:store state-store
                           :github github
                           :authority (authority/github-port github)
                           :policy review-policy
                           :replay-interval-ms 600000})
        dispatch-ledger (fs/join root "ledgers" "dispatches.nd-edn")]
    (try
      (await (store/initialize! state-store))
      (await (worker/start! queue-worker))
      (await (store/accept-delivery! state-store
                                     (admitted-command review-policy)))
      (let [processing (worker/process-delivery! queue-worker delivery-id)]
        (await dispatch-started)
        ;; Preserve the proven journal while replacing its path with a
        ;; directory to inject failure before completion can become durable.
        (let [dispatch-ledger-contents (await (fs/read-text dispatch-ledger))]
          (await (remove-dispatch-projections! state-store delivery-id))
          (await (fs/remove-file-if-present! dispatch-ledger))
          (await (fs/ensure-directory! dispatch-ledger))
          (@dispatch-release* {:workflow-run-id 987
                               :run-url "https://api.github.test/runs/987"
                               :html-url "https://github.test/runs/987"})
          (is (some? (try
                       (await processing)
                       nil
                       (catch :default error error))))
          (is (= 1 @dispatch-count*))
          (is (true? (:fatal? (worker/status queue-worker))))
          (await (fs/remove-tree! dispatch-ledger))
          (is (false? (await (store/completed? state-store delivery-id))))
          (is (await (fs/write-exclusive! dispatch-ledger
                                          dispatch-ledger-contents)))
          (await (worker/start! restarted-worker))
          (let [startup (get-in (worker/status restarted-worker)
                                [:startup :evidence])]
            (is (= 0 (get-in startup [:reconciliation :ledger-appends])))
            (is (true? (await (store/completed? state-store delivery-id))))
            (is (= :held
                   (get-in (await (store/read-completion state-store delivery-id))
                           [:result :outcome]))))))
      (finally
        (worker/stop! queue-worker)
        (worker/stop! restarted-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async observe-only-persists-the-plan-without-a-mutating-call
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        dispatch-count* (atom 0)
        github {:prepare-review-gate! prepare-review-gate!
                :fetch-workflow-run! fetch-code-review-run!
                :fetch-pull-request!
                (fn [_] (js/Promise.resolve current-pull-request))
                :actor-permission!
                (fn [_]
                  (js/Promise.resolve {:permission "write"
                                       :user-id 9
                                       :user-login "operator"}))
                :dispatch-review!
                (^:async fn [_ dispatch]
                  (await (invoke-authorizer! dispatch :authorize-dispatch!))
                  (swap! dispatch-count* inc)
                  (js/Promise.resolve
                   {:dispatched? true
                    :workflow-run-id 987
                    :run-url "https://api.github.test/runs/987"
                    :html-url "https://github.test/runs/987"}))}
        queue-worker (worker/create
                      {:store state-store
                       :github github
                       :authority (authority/github-port github)
                       :policy observe-policy
                       :replay-interval-ms 5000})]
    (try
      (await (store/initialize! state-store))
      (await (store/accept-delivery! state-store
                                     (admitted-command observe-policy)))
      (await (worker/start! queue-worker))
      (let [completion (await (store/read-completion state-store delivery-id))]
        (is (= :observe-only (:mode (worker/status queue-worker))))
        (is (zero? @dispatch-count*))
        (is (= :observed (get-in completion [:result :outcome])))
        (is (= "0123456789abcdef0123456789abcdef01234567"
               (get-in completion [:result :dispatch :inputs :pr_head_sha]))))
      (finally
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async observe-only-downgrade-replay-never-cancels-a-durable-gate
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        dispatch (review-dispatch-intent)
        durable-gate
        (merge (:gate-check dispatch)
               {:id gate-check-id
                :node-id "CR_legacy"
                :status "in_progress"
                :app-id 123
                :app-slug "eta-mu-controller"})
        mutation-count* (atom 0)
        github {:cancel-review-gate!
                (fn [& _]
                  (swap! mutation-count* inc)
                  (js/Promise.reject
                   (ex-info "observe-only must not cancel GitHub state" {})))}
        current-policy (assoc observe-policy
                              :canary-delivery-ids #{delivery-id})
        queue-worker (worker/create
                      {:store state-store
                       :github github
                       :authority {}
                       ;; Deliberately inject a stale active lease to prove the
                       ;; worker's observe-only mode fence dominates it.
                       :effect-lease active-effect-lease
                       :policy current-policy
                       :replay-interval-ms 600000})]
    (try
      (await (store/initialize! state-store))
      ;; Simulate state durably prepared by the former review-dispatch
      ;; deployment before Services rolls the controller back to observe-only.
      (await (store/accept-delivery! state-store
                                     (admitted-command review-policy)))
      (await (store/claim-dispatch! state-store delivery-id dispatch))
      (await (store/record-gate-check! state-store delivery-id durable-gate))
      (await (worker/start! queue-worker))
      (let [completion
            (get-in (await (store/read-completion state-store delivery-id))
                    [:result])]
        (is (= :refused (:outcome completion)))
        (is (= :admission-policy-changed (:reason completion)))
        (is (zero? @mutation-count*))
        (is (= :active
               (get-in (worker/status queue-worker)
                       [:effect-lease :state])))
        (is (true? (await (store/gate-check-recorded?
                           state-store delivery-id))))
        (is (empty? (await (store/pending-delivery-ids state-store)))))
      (finally
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async replay-resumes-an-intent-before-the-workflow-call-boundary
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        dispatch-count* (atom 0)
        github {:prepare-review-gate! prepare-review-gate!
                :fetch-workflow-run! fetch-code-review-run!
                :fetch-pull-request!
                (fn [_] (js/Promise.resolve current-pull-request))
                :actor-permission!
                (fn [_]
                  (js/Promise.resolve {:permission "write"
                                       :user-id 9
                                       :user-login "operator"}))
                :dispatch-review!
                (^:async fn [_ dispatch]
                  (await (invoke-authorizer! dispatch :authorize-dispatch!))
                  (swap! dispatch-count* inc)
                  (js/Promise.resolve {:dispatched? true}))}
        queue-worker (worker/create
                      {:store state-store
                       :github github
                       :authority (authority/github-port github)
                       :policy review-policy
                       :replay-interval-ms 5000})
        dispatch (review-dispatch-intent)]
    (try
      (await (store/initialize! state-store))
      (await (store/accept-delivery! state-store
                                     (admitted-command review-policy)))
      (await (store/claim-dispatch! state-store delivery-id dispatch))
      (await (worker/start! queue-worker))
      (let [completion (await (store/read-completion state-store delivery-id))
            recovery (get-in (worker/status queue-worker)
                             [:startup :evidence])]
        (is (= {:reconciliation {:ledger-appends 0
                                 :projection-restores 0}
                :held 0
                :replayed 1
                :effect-lease {:state :active
                               :effects-allowed? true}}
               recovery))
        (is (= 1 @dispatch-count*))
        (is (= :dispatched (get-in completion [:result :outcome])))
        (is (= gate-check-id
               (get-in (await (store/read-gate-check state-store delivery-id))
                       [:gate-check :id]))))
      (finally
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async replay-refuses-a-durable-intent-after-the-pr-head-advances
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        dispatch-count* (atom 0)
        cancelled* (atom nil)
        github {:prepare-review-gate! prepare-review-gate!
                :cancel-review-gate!
                (^:async fn [installation-id gate reason]
                  (await (invoke-authorizer! gate :authorize-cancel!))
                  (reset! cancelled* {:installation-id installation-id
                                      :gate gate :reason reason})
                  (js/Promise.resolve {:cancelled? false :absent? true}))
                :fetch-pull-request!
                (fn [_]
                  (js/Promise.resolve
                   (assoc current-pull-request
                          :head-sha
                          "fedcba9876543210fedcba9876543210fedcba98")))
                :actor-permission!
                (fn [_]
                  (js/Promise.resolve {:permission "write"
                                       :user-id 9
                                       :user-login "operator"}))
                :dispatch-review!
                (^:async fn [_ dispatch]
                  (await (invoke-authorizer! dispatch :authorize-dispatch!))
                  (swap! dispatch-count* inc)
                  (js/Promise.resolve {:workflow-run-id 987
                                       :run-url "https://api.github.test/runs/987"
                                       :html-url "https://github.test/runs/987"}))}
        queue-worker (worker/create
                      {:store state-store
                       :github github
                       :authority (authority/github-port github)
                       :policy review-policy
                       :replay-interval-ms 600000})]
    (try
      (await (store/initialize! state-store))
      (await (store/accept-delivery! state-store
                                     (admitted-command review-policy)))
      (await (store/claim-dispatch! state-store delivery-id
                                    (review-dispatch-intent)))
      (await (worker/start! queue-worker))
      (let [completion (:result
                        (await (store/read-completion state-store delivery-id)))]
        (is (zero? @dispatch-count*))
        (is (= 77 (:installation-id @cancelled*)))
        (is (= :refused (:outcome completion)))
        (is (= :durable-dispatch-intent-stale (:reason completion)))
        (is (false? (:fatal? (worker/status queue-worker))))
        (is (true? (:running? (worker/status queue-worker)))))
      (finally
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async revoked-issuer-still-allows-defensive-cancellation-of-a-pending-gate
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        permission-reads* (atom 0)
        cancellations* (atom [])
        dispatch (review-dispatch-intent)
        github
        {:fetch-pull-request! (fn [_] (js/Promise.resolve current-pull-request))
         :actor-permission!
         (fn [_]
           (swap! permission-reads* inc)
           (js/Promise.resolve {:permission "read"
                                :user-id 9 :user-login "operator"}))
         :cancel-review-gate!
         (^:async fn [_ gate _]
           (await (invoke-authorizer! gate :authorize-cancel!))
           (swap! cancellations* conj (:id gate))
           {:cancelled? true})}
        queue-worker (worker/create
                      {:store state-store :github github
                       :authority (authority/github-port github)
                       :policy review-policy :replay-interval-ms 600000})]
    (try
      (await (store/initialize! state-store))
      (await (store/accept-delivery! state-store (admitted-command review-policy)))
      (await (store/claim-dispatch! state-store delivery-id dispatch))
      (await (store/record-gate-check!
              state-store delivery-id
              (assoc (:gate-check dispatch) :id gate-check-id
                     :node-id "CR_kwDOGate" :status "in_progress"
                     :app-id 123 :app-slug "eta-mu-controller")))
      (await (worker/start! queue-worker))
      (let [result (:result (await (store/read-completion state-store delivery-id)))]
        (is (= :refused (:outcome result)))
        (is (= :actor-not-authorized (:reason result)))
        (is (= [gate-check-id] @cancellations*))
        (is (= 1 @permission-reads*))
        (is (false? (await (store/dispatch-call-begun? state-store delivery-id))))
        (is (false? (:fatal? (worker/status queue-worker)))))
      (finally
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async same-process-in-flight-ownership-admits-one-execution
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        fetch-count* (atom 0)
        fetch-started-resolve* (atom nil)
        fetch-release* (atom nil)
        fetch-started
        (js/Promise. (fn [resolve _]
                       (reset! fetch-started-resolve* resolve)))
        dispatch-count* (atom 0)
        github {:prepare-review-gate! prepare-review-gate!
                :fetch-workflow-run! fetch-code-review-run!
                :fetch-pull-request!
                (fn [_]
                  (let [fetch-number (swap! fetch-count* inc)]
                    (if (= 1 fetch-number)
                      (do
                        (@fetch-started-resolve* true)
                        (js/Promise.
                         (fn [resolve _]
                           (reset! fetch-release* resolve))))
                      (js/Promise.resolve current-pull-request))))
                :actor-permission!
                (fn [_]
                  (js/Promise.resolve {:permission "write"
                                       :user-id 9
                                       :user-login "operator"}))
                :dispatch-review!
                (^:async fn [_ dispatch]
                  (await (invoke-authorizer! dispatch :authorize-dispatch!))
                  (swap! dispatch-count* inc)
                  (js/Promise.resolve {:workflow-run-id 987
                                       :run-url "https://api.github.test/runs/987"
                                       :html-url "https://github.test/runs/987"}))}
        queue-worker (worker/create
                      {:store state-store
                       :github github
                       :authority (authority/github-port github)
                       :policy review-policy
                       :replay-interval-ms 600000})]
    (try
      (await (store/initialize! state-store))
      (await (worker/start! queue-worker))
      (await (store/accept-delivery! state-store
                                     (admitted-command review-policy)))
      (let [first-processing
            (worker/process-delivery! queue-worker delivery-id)]
        (await fetch-started)
        (await (worker/process-delivery! queue-worker delivery-id))
        (is (= 1 (:in-flight (worker/status queue-worker))))
        (is (= 1 @fetch-count*))
        (@fetch-release* current-pull-request)
        (await first-processing)
        (is (= 1 @dispatch-count*))
        (is (= :dispatched
               (get-in (await (store/read-completion state-store delivery-id))
                       [:result :outcome]))))
      (finally
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async an-existing-pre-call-intent-is-resumed-without-duplication
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        dispatch-count* (atom 0)
        github {:prepare-review-gate! prepare-review-gate!
                :fetch-workflow-run! fetch-code-review-run!
                :fetch-pull-request!
                (fn [_] (js/Promise.resolve current-pull-request))
                :actor-permission!
                (fn [_]
                  (js/Promise.resolve {:permission "write"
                                       :user-id 9
                                       :user-login "operator"}))
                :dispatch-review!
                (^:async fn [_ dispatch]
                  (await (invoke-authorizer! dispatch :authorize-dispatch!))
                  (swap! dispatch-count* inc)
                  (js/Promise.resolve {:workflow-run-id 987}))}
        queue-worker (worker/create
                      {:store state-store
                       :github github
                       :authority (authority/github-port github)
                       :policy review-policy
                       :replay-interval-ms 600000})
        dispatch (review-dispatch-intent)]
    (try
      (await (store/initialize! state-store))
      (await (worker/start! queue-worker))
      (await (store/accept-delivery! state-store
                                     (admitted-command review-policy)))
      (is (true? (await (store/claim-dispatch! state-store delivery-id
                                               dispatch))))
      (await (worker/process-delivery! queue-worker delivery-id))
      (is (= 1 @dispatch-count*))
      (is (true? (await (store/completed? state-store delivery-id))))
      (finally
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async worker-startup-recovery-has-exclusive-lifecycle-ownership
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        queue-worker (worker/create
                      {:store state-store
                       :github {}
                       :authority {}
                       :policy observe-policy
                       :replay-interval-ms 600000})]
    (try
      (await (store/initialize! state-store))
      (await (worker/start! queue-worker))
      (let [second-start-error
            (try
              (await (worker/start! queue-worker))
              nil
              (catch :default error error))
            live-recovery-error
            (try
              (await (worker/recover-startup! queue-worker))
              nil
              (catch :default error error))]
        (is (= :worker-already-started
               (:error/code (ex-data second-start-error))))
        (is (= :startup-recovery-not-exclusive
               (:error/code (ex-data live-recovery-error))))
        (is (true? (:running? (worker/status queue-worker)))))
      (finally
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async periodic-replay-cannot-hold-a-live-dispatch
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        projection-published-resolve* (atom nil)
        projection-release-resolve* (atom nil)
        projection-published
        (js/Promise. (fn [resolve _]
                       (reset! projection-published-resolve* resolve)))
        projection-release
        (js/Promise. (fn [resolve _]
                       (reset! projection-release-resolve* resolve)))
        write-exclusive! fs/write-exclusive!
        block-once?* (atom true)
        dispatch-call-file
        (fs/join (get-in state-store [:paths :dispatch-calls])
                 (str delivery-id ".edn"))
        completion-file
        (fs/join (get-in state-store [:paths :dispatches])
                 (str delivery-id ".edn"))
        dispatch-count* (atom 0)
        github {:prepare-review-gate! prepare-review-gate!
                :fetch-workflow-run! fetch-code-review-run!
                :fetch-pull-request!
                (fn [_] (js/Promise.resolve current-pull-request))
                :actor-permission!
                (fn [_]
                  (js/Promise.resolve {:permission "write"
                                       :user-id 9
                                       :user-login "operator"}))
                :dispatch-review!
                (^:async fn [_ dispatch]
                  (await (invoke-authorizer! dispatch :authorize-dispatch!))
                  (swap! dispatch-count* inc)
                  {:workflow-run-id 987
                   :run-url "https://api.github.test/runs/987"
                   :html-url "https://github.test/runs/987"})}
        queue-worker (worker/create
                      {:store state-store
                       :github github
                       :authority (authority/github-port github)
                       :policy review-policy
                       :replay-interval-ms 5000})]
    (reset! blocking-projection-write-context*
            {:write-exclusive! write-exclusive!
             :target dispatch-call-file
             :block-once?* block-once?*
             :published!* projection-published-resolve*
             :release projection-release})
    (try
      (await (store/initialize! state-store))
      (await (worker/start! queue-worker))
      (await (store/accept-delivery! state-store
                                     (admitted-command review-policy)))
      (with-redefs [fs/write-exclusive! block-after-projection-write-once!]
        (let [processing (worker/process-delivery! queue-worker delivery-id)]
          ;; The immutable call projection is visible, but its original owner
          ;; has not resumed to remove the pending cache entry or invoke GitHub.
          (await projection-published)
          (is (true? (await (fs/path-exists? dispatch-call-file))))
          (is (= {:replayed 1}
                 (await (worker/replay-pending! queue-worker))))
          (is (= 1 (:in-flight (worker/status queue-worker))))
          (is (false? (await (fs/path-exists? completion-file))))
          (is (zero? @dispatch-count*))
          (@projection-release-resolve* true)
          (await processing)
          (is (= 1 @dispatch-count*))
          (is (= :dispatched
                 (get-in (await (store/read-completion
                                 state-store delivery-id))
                         [:result :outcome])))))
      (finally
        (reset! blocking-projection-write-context* nil)
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async shutdown-before-dispatch-keeps-the-durable-command-pending
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        authorization-started-resolve* (atom nil)
        authorization-release* (atom nil)
        authorization-started
        (js/Promise. (fn [resolve _]
                       (reset! authorization-started-resolve* resolve)))
        dispatch-count* (atom 0)
        github {:prepare-review-gate! prepare-review-gate!
                :fetch-workflow-run! fetch-code-review-run!
                :fetch-pull-request!
                (fn [_] (js/Promise.resolve current-pull-request))
                :actor-permission!
                (fn [_]
                  (@authorization-started-resolve* true)
                  (js/Promise.
                   (fn [resolve _]
                     (reset! authorization-release* resolve))))
                :dispatch-review!
                (^:async fn [_ dispatch]
                  (await (invoke-authorizer! dispatch :authorize-dispatch!))
                  (swap! dispatch-count* inc)
                  (js/Promise.resolve {:workflow-run-id 987
                                       :run-url "https://api.github.test/runs/987"
                                       :html-url "https://github.test/runs/987"}))}
        queue-worker (worker/create
                      {:store state-store
                       :github github
                       :authority (authority/github-port github)
                       :policy review-policy
                       :replay-interval-ms 600000})]
    (try
      (await (store/initialize! state-store))
      (await (worker/start! queue-worker))
      (await (store/accept-delivery! state-store
                                     (admitted-command review-policy)))
      (let [processing (worker/process-delivery! queue-worker delivery-id)]
        (await authorization-started)
        (worker/stop! queue-worker)
        (@authorization-release* {:permission "write"
                                  :user-id 9
                                  :user-login "operator"})
        (await processing)
        (is (zero? @dispatch-count*))
        (is (= [delivery-id]
               (await (store/pending-delivery-ids state-store)))))
      (finally
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async startup-cannot-promote-observe-only-evidence-into-dispatch
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        github-call-count* (atom 0)
        github {:prepare-review-gate! prepare-review-gate!
                :fetch-workflow-run! fetch-code-review-run!
                :fetch-pull-request!
                (fn [_]
                  (swap! github-call-count* inc)
                  (js/Promise.resolve current-pull-request))
                :actor-permission!
                (fn [_]
                  (swap! github-call-count* inc)
                  (js/Promise.resolve {:permission "write"
                                       :user-id 9
                                       :user-login "operator"}))
                :dispatch-review!
                (^:async fn [_ dispatch]
                  (await (invoke-authorizer! dispatch :authorize-dispatch!))
                  (swap! github-call-count* inc)
                  (js/Promise.resolve {:workflow-run-id 987
                                       :run-url "https://api.github.test/runs/987"
                                       :html-url "https://github.test/runs/987"}))}
        queue-worker (worker/create
                      {:store state-store
                       :github github
                       :authority (authority/github-port github)
                       :policy review-policy
                       :replay-interval-ms 5000})]
    (try
      (await (store/initialize! state-store))
      (await (store/accept-delivery! state-store
                                     (admitted-command observe-policy)))
      (await (worker/start! queue-worker))
      (let [worker-status (worker/status queue-worker)
            completion (await (store/read-completion state-store delivery-id))]
        (is (true? (:running? worker-status)))
        (is (true? (get-in worker-status [:startup :complete?])))
        (is (true? (get-in worker-status [:startup :recovered?])))
        (is (= 1 (get-in worker-status
                         [:startup :evidence :replayed])))
        (is (zero? @github-call-count*))
        (is (= :refused (get-in completion [:result :outcome])))
        (is (= :admission-policy-changed
               (get-in completion [:result :reason]))))
      (finally
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async startup-repairs-admission-evidence-before-replay
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        fetch-count* (atom 0)
        github {:prepare-review-gate! prepare-review-gate!
                :fetch-workflow-run! fetch-code-review-run!
                :fetch-pull-request!
                (fn [_]
                  (swap! fetch-count* inc)
                  (js/Promise.resolve current-pull-request))
                :actor-permission!
                (fn [_]
                  (js/Promise.resolve {:permission "write"
                                       :user-id 9
                                       :user-login "operator"}))}
        queue-worker (worker/create
                      {:store state-store
                       :github github
                       :authority (authority/github-port github)
                       :policy observe-policy
                       :replay-interval-ms 600000})]
    (try
      (await (store/initialize! state-store))
      (await (store/accept-delivery! state-store
                                     (admitted-command observe-policy)))
      (await (fs/remove-file-if-present!
              (fs/join root "deliveries" (str delivery-id ".edn"))))
      (await (worker/start! queue-worker))
      (let [startup (get-in (worker/status queue-worker) [:startup :evidence])
            completion (await (store/read-completion state-store delivery-id))]
        (is (= 0 (get-in startup [:reconciliation :ledger-appends])))
        (is (= 1 (get-in startup [:reconciliation
                                  :projection-restores])))
        (is (= 1 (:replayed startup)))
        (is (= 1 @fetch-count*))
        (is (= :observed (get-in completion [:result :outcome]))))
      (finally
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async failed-startup-recovery-never-reports-running
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        queue-worker (worker/create
                      {:store state-store
                       :github {}
                       :authority {}
                       :policy observe-policy
                       :replay-interval-ms 5000})]
    (try
      (await (store/initialize! state-store))
      (let [delivery-ledger (fs/join root "ledgers" "deliveries.nd-edn")]
        (await (fs/remove-file-if-present! delivery-ledger))
        (is (await (fs/write-exclusive! delivery-ledger "{\n"))))
      (let [error (try
                    (await (worker/start! queue-worker))
                    nil
                    (catch :default caught caught))
            worker-status (worker/status queue-worker)]
        (is (some? error))
        (is (false? (:running? worker-status)))
        (is (true? (get-in worker-status [:startup :complete?])))
        (is (false? (get-in worker-status [:startup :recovered?])))
        (is (= :startup-recovery
               (get-in worker-status [:last-error :stage]))))
      (finally
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async unexpected-startup-replay-failure-cannot-be-cleared-to-ready
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        github {:prepare-review-gate! prepare-review-gate!
                :fetch-workflow-run! fetch-code-review-run!
                :fetch-pull-request!
                (fn [_]
                  (js/Promise.reject (js/Error. "synthetic adapter defect")))}
        queue-worker (worker/create
                      {:store state-store
                       :github github
                       :authority {}
                       :policy observe-policy
                       :replay-interval-ms 600000})]
    (try
      (await (store/initialize! state-store))
      (await (store/accept-delivery! state-store
                                     (admitted-command observe-policy)))
      (let [error (try
                    (await (worker/start! queue-worker))
                    nil
                    (catch :default caught caught))
            worker-status (worker/status queue-worker)]
        (is (some? error))
        (is (false? (:running? worker-status)))
        (is (true? (:fatal? worker-status)))
        (is (false? (get-in worker-status [:startup :recovered?]))))
      (finally
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))

(deftest ^:async malformed-durable-command-revokes-worker-readiness
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        queue-worker (worker/create
                      {:store state-store
                       :github {}
                       :authority {}
                       :policy observe-policy
                       :replay-interval-ms 600000})]
    (try
      (await (store/initialize! state-store))
      (await (worker/start! queue-worker))
      (is (true? (:running? (worker/status queue-worker))))
      (await (fs/write-exclusive!
              (fs/join root "deliveries" (str delivery-id ".edn"))
              "{"))
      (let [error (try
                    (await (worker/process-delivery! queue-worker delivery-id))
                    nil
                    (catch :default caught caught))
            worker-status (worker/status queue-worker)]
        (is (= :immutable-state-conflict
               (:error/code (ex-data error))))
        (is (false? (:running? worker-status)))
        (is (= :immutable-state-conflict
               (get-in worker-status [:last-error :error/code]))))
      (finally
        (worker/stop! queue-worker)
        (await (fs/remove-tree! root))))))
