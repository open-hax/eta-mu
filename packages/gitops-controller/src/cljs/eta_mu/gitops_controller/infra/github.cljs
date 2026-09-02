(ns eta-mu.gitops-controller.infra.github
  "GitHub App REST adapter. All returned data is shaped CLJS data."
  (:require [clojure.string :as str]
            [eta-mu.gitops-controller.extern.crypto :as crypto]
            [eta-mu.gitops-controller.extern.http :as http]
            [eta-mu.gitops-controller.law.webhook :as law]
            [eta-mu.gitops-controller.shape.webhook :as shape]))

(def ^:private actor-permission-token-permissions
  {:metadata "read"})

(def ^:private pull-request-token-permissions
  {:metadata "read"
   :pull_requests "read"})

(def ^:private workflow-run-token-permissions
  {:actions "read"})

(defn- repository-path [repository]
  (->> (str/split repository #"/")
       (map js/encodeURIComponent)
       (str/join "/")))

(defn- headers [token]
  {"accept" "application/vnd.github+json"
   "authorization" (str "Bearer " token)
   "content-type" "application/json"
   "user-agent" "eta-mu-gitops-controller/0.1"
   "x-github-api-version" "2026-03-10"})

(defn- response-error [operation response]
  (ex-info (str "GitHub " operation " failed")
           {:error/code :github-request-failed
            :operation operation
            :status (:status response)}))

(defn- review-gate-error [message data]
  (ex-info message (merge {:error/code :invalid-review-gate-check} data)))

(defn- ensure-review-dispatch! [config operation]
  (when-not (= :review-dispatch (:mode config))
    (throw (ex-info "GitHub mutation is disabled outside review-dispatch mode"
                    {:error/code :github-mutation-disabled
                     :operation operation}))))

(defn- ^:async authorize-write! [callback operation]
  (when-not (fn? callback)
    (throw (review-gate-error
            "GitHub mutation requires an adapter-bound effect lease"
            {:operation operation})))
  (when-not (true? (await (callback)))
    (throw (review-gate-error
            "GitHub mutation effect lease did not authorize the write"
            {:operation operation})))
  true)

(def issue-read-token-permissions
  {:issues "read"
   :contents "read"
   :metadata "read"})

(defn- ^:async installation-token!
  [{:keys [github-api-url github-app-id github-private-key mode]}
   installation-id repository-id permissions]
  (when (and (= :observe-only mode)
             (not (law/positive-integer? repository-id)))
    (throw (ex-info "observe-only token mint requires one repository ID"
                    {:error/code :observe-token-repository-required})))
  (when (and (= :observe-only mode)
             (or (empty? permissions)
                 (not-every? #(= "read" (val %)) permissions)))
    (throw (ex-info "observe-only token mint requires explicit read permissions"
                    {:error/code :observe-token-permissions-required})))
  (let [jwt (crypto/github-app-jwt github-app-id github-private-key)
        request-body
        (if (= :observe-only mode)
          {:repository_ids [repository-id]
           :permissions permissions}
          {})
        response (await
                  (http/request!
                   {:url (str github-api-url "/app/installations/"
                              installation-id "/access_tokens")
                    :method "POST"
                    :headers (headers jwt)
                    :body request-body}))]
    (if (and (:ok? response) (string? (get-in response [:body :token])))
      (get-in response [:body :token])
      (throw (response-error "installation-token" response)))))

(defn- ^:async fetch-pull-request!
  [config {:keys [installation-id repository-id repository
                  pull-request-number]}]
  (let [token (await (installation-token!
                      config installation-id repository-id
                      pull-request-token-permissions))
        pull-request-response
        (await
         (http/request!
          {:url (str (:github-api-url config) "/repos/"
                     (repository-path repository) "/pulls/"
                     pull-request-number)
           :method "GET"
           :headers (headers token)}))]
    (when-not (:ok? pull-request-response)
      (throw (response-error "fetch-pull-request" pull-request-response)))
    (let [repository-response
          (await
           (http/request!
            {:url (str (:github-api-url config) "/repos/"
                       (repository-path repository))
             :method "GET"
             :headers (headers token)}))]
      (if (:ok? repository-response)
        (shape/github-pull-request->current
         (:body pull-request-response) (:body repository-response))
        (throw (response-error "fetch-repository" repository-response))))))

(defn- ^:async fetch-issue!
  [config {:keys [installation-id repository repository-id issue-number]}]
  (let [token
        (await
         (installation-token!
          config installation-id repository-id issue-read-token-permissions))
        issue-response
        (await
         (http/request!
          {:url (str (:github-api-url config) "/repos/"
                     (repository-path repository) "/issues/" issue-number)
           :method "GET"
           :headers (headers token)}))]
    (when-not (:ok? issue-response)
      (throw (response-error "fetch-issue" issue-response)))
    (let [repository-response
          (await
           (http/request!
            {:url (str (:github-api-url config) "/repos/"
                       (repository-path repository))
             :method "GET"
             :headers (headers token)}))]
      (when-not (:ok? repository-response)
        (throw (response-error "fetch-repository" repository-response)))
      (let [default-branch (get-in repository-response
                                   [:body :default_branch])]
        (when-not (law/non-blank-string? default-branch)
          (throw
           (ex-info "GitHub repository has no default branch"
                    {:error/code :invalid-github-response
                     :operation :fetch-repository})))
        (let [ref-response
              (await
               (http/request!
                {:url (str (:github-api-url config) "/repos/"
                           (repository-path repository) "/git/ref/heads/"
                           (js/encodeURIComponent default-branch))
                 :method "GET"
                 :headers (headers token)}))]
          (if (:ok? ref-response)
            (shape/github-issue->current
             (:body issue-response) (:body repository-response)
             (:body ref-response))
            (throw (response-error "fetch-default-branch"
                                   ref-response))))))))

(defn- ^:async actor-permission!
  [config {:keys [installation-id repository-id repository sender-login]}]
  (let [token (await (installation-token!
                      config installation-id repository-id
                      actor-permission-token-permissions))
        response (await
                  (http/request!
                   {:url (str (:github-api-url config) "/repos/"
                              (repository-path repository) "/collaborators/"
                              (js/encodeURIComponent sender-login) "/permission")
                    :method "GET"
                    :headers (headers token)}))]
    (if (and (:ok? response)
             (string? (get-in response [:body :permission]))
             (integer? (get-in response [:body :user :id])))
      {:permission (get-in response [:body :permission])
       :user-id (get-in response [:body :user :id])
       :user-login (get-in response [:body :user :login])}
      (throw (response-error "actor-permission" response)))))

(defn- review-gate-check-identity?
  [{:keys [github-app-id]} expected check-run]
  (and (law/positive-integer? (:id check-run))
       (or (nil? (:id expected)) (= (:id expected) (:id check-run)))
       (= (:name expected) (:name check-run))
       (= (:merge-sha expected) (:head_sha check-run))
       (= (:external-id expected) (:external_id check-run))
       (= github-app-id (get-in check-run [:app :id]))
       (law/non-blank-string? (get-in check-run [:app :slug]))))

(defn- expected-review-gate-check?
  [config expected check-run]
  (and (review-gate-check-identity? config expected check-run)
       (= (:details-url expected) (:details_url check-run))
       (= "in_progress" (:status check-run))
       (nil? (:conclusion check-run))))

(defn- check-run->receipt [check-run]
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

(defn- bound-check-run->receipt [expected check-run]
  (merge
   (select-keys expected
                [:repository :repository-id :pr-number :pr-node-id
                 :base-branch :base-sha :head-sha :merge-sha :delivery-id
                 :external-id :details-url :name])
   (check-run->receipt check-run)))

(defn- ^:async matching-check-runs!
  [config token {:keys [repository merge-sha name external-id]}]
  (loop [page 1]
    (let [response
          (await
           (http/request!
            {:url (str (:github-api-url config) "/repos/"
                       (repository-path repository) "/commits/"
                       (js/encodeURIComponent merge-sha) "/check-runs"
                       "?check_name=" (js/encodeURIComponent name)
                       "&filter=all&per_page=100&page=" page)
             :method "GET"
             :headers (headers token)}))]
      (when-not (:ok? response)
        (throw (response-error "list-review-gate-checks" response)))
      (let [runs (vec (get-in response [:body :check_runs]))
            exact (filterv #(and (= external-id (:external_id %))
                                 (= (:github-app-id config)
                                    (get-in % [:app :id])))
                           runs)]
        (cond
          (seq exact) exact
          (< (count runs) 100) []
          (< page 11) (recur (inc page))
          :else
          (throw (review-gate-error
                  "review gate check lookup exceeded GitHub's bounded ref window"
                  {:repository repository :merge-sha merge-sha})))))))

(defn- ^:async all-current-name-check-runs!
  [config token {:keys [repository merge-sha name]}]
  (loop [page 1
         result []]
    (let [response
          (await
           (http/request!
            {:url (str (:github-api-url config) "/repos/"
                       (repository-path repository) "/commits/"
                       (js/encodeURIComponent merge-sha) "/check-runs"
                       "?check_name=" (js/encodeURIComponent name)
                       "&filter=all&per_page=100&page=" page)
             :method "GET"
             :headers (headers token)}))]
      (when-not (:ok? response)
        (throw (response-error "list-review-gate-checks" response)))
      (let [runs (vec (get-in response [:body :check_runs]))
            accumulated (into result runs)]
        (cond
          (< (count runs) 100) accumulated
          (< page 11) (recur (inc page) accumulated)
          :else
          (throw (review-gate-error
                  "review gate scan exceeded GitHub's bounded ref window"
                  {:repository repository :merge-sha merge-sha})))))))

(defn- current-name-check?
  [config expected check-run]
  (and (law/positive-integer? (:id check-run))
       (= (:github-app-id config) (get-in check-run [:app :id]))
       (= (:name expected) (:name check-run))
       (= (:merge-sha expected) (:head_sha check-run))))

(defn- newest-current-name-check [config expected runs]
  (->> runs
       (filter #(current-name-check? config expected %))
       (sort-by :id >)
       first))

(defn- ^:async cancel-superseded-gates!
  [config token expected current-check runs]
  (doseq [candidate runs]
    (when (and (current-name-check? config expected candidate)
               (not= (:id current-check) (:id candidate))
               (< (:id candidate) (:id current-check))
               (contains? #{"queued" "in_progress"} (:status candidate)))
      (let [_ (await (authorize-write!
                      (-> expected meta :authorize-cancel!)
                      :cancel-superseded-review-gate))
            response
            (await
             (http/request!
              {:url (str (:github-api-url config) "/repos/"
                         (repository-path (:repository expected))
                         "/check-runs/" (:id candidate))
               :method "PATCH"
               :headers (headers token)
               :body {:name (:name expected)
                      :status "completed"
                      :conclusion "cancelled"
                      :completed_at (.toISOString (js/Date.))
                      :output
                      {:title "Superseded review reconciliation"
                       :summary (str "Superseded by webhook delivery `"
                                     (:delivery-id expected) "` for pull request #"
                                     (:pr-number expected) ".")}}}))]
        (when-not (and (:ok? response)
                       (= "completed" (get-in response [:body :status]))
                       (= "cancelled" (get-in response [:body :conclusion])))
          (throw (response-error "cancel-superseded-review-gate"
                                 response)))))))

(defn- ^:async prepare-review-gate!
  [config installation-id expected]
  (ensure-review-dispatch! config :prepare-review-gate)
  (let [token (await (installation-token! config installation-id
                                          (:repository-id expected) nil))
        matches (await (matching-check-runs! config token expected))
        _ (when (< 1 (count matches))
            (throw (review-gate-error
                    "multiple Check Runs share one durable gate identity"
                    {:external-id (:external-id expected)})))
        check-run
        (if-let [existing (first matches)]
          existing
          (let [_ (await (authorize-write!
                          (-> expected meta :authorize-create!)
                          :create-review-gate))
                response
                (await
                 (http/request!
                  {:url (str (:github-api-url config) "/repos/"
                             (repository-path (:repository expected))
                             "/check-runs")
                   :method "POST"
                   :headers (headers token)
                   :body {:name (:name expected)
                          :head_sha (:merge-sha expected)
                          :status "in_progress"
                          :started_at (.toISOString (js/Date.))
                          :external_id (:external-id expected)
                          :details_url (:details-url expected)
                          :output
                          {:title "Webhook review reconciliation pending"
                           :summary
                           (str "Admitted delivery `" (:delivery-id expected)
                                "` for `" (:repository expected) "#"
                                (:pr-number expected) "` at `"
                                (:head-sha expected) "` with test merge `"
                                (:merge-sha expected)
                                "`. Workflow dispatch has not yet completed.")}}}))]
            (if (= 201 (:status response))
              (:body response)
              (throw (response-error "create-review-gate-check" response)))))
        runs (await (all-current-name-check-runs! config token expected))
        newest (newest-current-name-check config expected runs)]
    (cond
      (and (expected-review-gate-check? config expected check-run)
           newest
           (= (:id check-run) (:id newest)))
      (do
        ;; Creating the new in-progress run immediately replaces a stale
        ;; success as the newest same-name/App result. Any older pending run is
        ;; terminally cancelled so it cannot remain an orphaned required check.
        (await (cancel-superseded-gates! config token expected check-run runs))
        (bound-check-run->receipt expected check-run))

      (and (review-gate-check-identity? config expected check-run)
           (= "completed" (:status check-run))
           (= "cancelled" (:conclusion check-run))
           newest
           (< (:id check-run) (:id newest)))
      (assoc (bound-check-run->receipt expected check-run)
             :superseded? true
             :superseded-by-check-id (:id newest))

      :else
      (throw (review-gate-error
              "GitHub returned a review gate Check Run with the wrong identity"
              {:expected expected
               :actual (check-run->receipt check-run)})))))

(defn- ^:async cancel-review-gate!
  [config installation-id expected reason]
  (ensure-review-dispatch! config :cancel-review-gate)
  (let [token (await (installation-token! config installation-id
                                          (:repository-id expected) nil))
        matches (await (matching-check-runs! config token expected))]
    (when (< 1 (count matches))
      (throw (review-gate-error
              "multiple Check Runs share one durable gate identity"
              {:external-id (:external-id expected)})))
    (if-let [check-run (first matches)]
      (do
        (when-not (review-gate-check-identity? config expected check-run)
          (throw (review-gate-error
                  "refusing to cancel a Check Run with the wrong identity"
                  {:expected expected
                   :actual (check-run->receipt check-run)})))
        (if (contains? #{"queued" "in_progress"} (:status check-run))
          (let [_ (await (authorize-write!
                          (-> expected meta :authorize-cancel!)
                          :cancel-review-gate))
                response
                (await
                 (http/request!
                  {:url (str (:github-api-url config) "/repos/"
                             (repository-path (:repository expected))
                             "/check-runs/" (:id check-run))
                   :method "PATCH"
                   :headers (headers token)
                   :body {:name (:name expected)
                          :status "completed"
                          :conclusion "cancelled"
                          :completed_at (.toISOString (js/Date.))
                          :details_url (:details-url expected)
                          :external_id (:external-id expected)
                          :output {:title "Review command became stale"
                                   :summary reason}}}))]
            (when-not (and (:ok? response)
                           (= "completed" (get-in response [:body :status]))
                           (= "cancelled" (get-in response
                                                  [:body :conclusion])))
              (throw (response-error "cancel-review-gate-check" response)))
            {:cancelled? true
             :gate-check (bound-check-run->receipt expected (:body response))})
          {:cancelled? false :already-terminal? true
           :gate-check (bound-check-run->receipt expected check-run)}))
      {:cancelled? false :absent? true})))

(defn- ^:async dispatch-review!
  [config installation-id dispatch]
  (ensure-review-dispatch! config :dispatch-review)
  (let [{:keys [repository workflow ref inputs]} dispatch
        dispatch-authorizer (-> dispatch meta :authorize-dispatch!)
        token (await (installation-token! config installation-id
                                          (:repository-id dispatch) nil))
        _ (await (authorize-write! dispatch-authorizer :dispatch-review))
        response (await
                  (http/request!
                   {:url (str (:github-api-url config) "/repos/"
                              (repository-path repository) "/actions/workflows/"
                              (js/encodeURIComponent workflow) "/dispatches")
                    :method "POST"
                    :headers (headers token)
                    :body {:ref ref
                           :inputs inputs
                           :return_run_details true}}))
        receipt {:workflow-run-id (get-in response [:body :workflow_run_id])
                 :run-url (get-in response [:body :run_url])
                 :html-url (get-in response [:body :html_url])}]
    (if (law/workflow-dispatch-response? (:status response) receipt)
      (assoc receipt :dispatched? true :status 200)
      (throw (response-error "dispatch-review" response)))))

(defn- ^:async fetch-workflow-run!
  [config {:keys [installation-id repository-id repository workflow-run-id]}]
  (let [token (await (installation-token!
                      config installation-id repository-id
                      workflow-run-token-permissions))
        response
        (await
         (http/request!
          {:url (str (:github-api-url config) "/repos/"
                     (repository-path repository) "/actions/runs/"
                     workflow-run-id)
           :method "GET"
           :headers (headers token)}))]
    (if (:ok? response)
      (shape/github-workflow-run->current (:body response))
      (throw (response-error "fetch-workflow-run" response)))))

(defn- terminal-review-gate?
  [config gate-check patch check-run]
  (and (review-gate-check-identity? config gate-check check-run)
       (= "completed" (:status check-run))
       (= (:conclusion patch) (:conclusion check-run))
       (= (:details-url patch) (:details_url check-run))
       (= (:external-id patch) (:external_id check-run))
       (= (get-in patch [:output :title])
          (get-in check-run [:output :title]))
       (= (get-in patch [:output :summary])
          (get-in check-run [:output :summary]))))

(defn- ^:async complete-review-gate!
  [config installation-id
   {:keys [gate-check terminal-intent authorize-patch!]}]
  (ensure-review-dispatch! config :complete-review-gate)
  (let [token (await (installation-token! config installation-id
                                          (:repository-id gate-check) nil))
        patch (:patch terminal-intent)
        response
        (await
         (http/request!
          {:url (str (:github-api-url config) "/repos/"
                     (repository-path (:repository gate-check))
                     "/check-runs/" (:id gate-check))
           :method "GET"
           :headers (headers token)}))]
    (when-not (:ok? response)
      (throw (response-error "get-review-gate-check" response)))
    (let [current (:body response)
          runs (await (all-current-name-check-runs!
                       config token gate-check))
          newest (->> runs
                      (filter #(and (= (:name gate-check) (:name %))
                                    (= (:merge-sha gate-check) (:head_sha %))
                                    (= (:github-app-id config)
                                       (get-in % [:app :id]))))
                      (sort-by :id >)
                      first)]
      (when-not (review-gate-check-identity? config gate-check current)
        (throw (review-gate-error
                "refusing to complete a Check Run with the wrong identity"
                {:expected gate-check
                 :actual (check-run->receipt current)})))
      (if (or (nil? newest) (not= (:id current) (:id newest)))
        {:updated? false :superseded? true
         :gate-check (bound-check-run->receipt gate-check current)}
        (cond
          (terminal-review-gate? config gate-check patch current)
          {:updated? false :already-completed? true
           :gate-check (bound-check-run->receipt gate-check current)}

          (not (and (= "in_progress" (:status current))
                    (nil? (:conclusion current))
                    (= (:details-url gate-check) (:details_url current))))
          (throw (review-gate-error
                  "refusing to replace a terminal review gate conclusion"
                  {:gate-check-id (:id current)
                   :status (:status current)
                   :conclusion (:conclusion current)}))

          :else
          (let [_ (await (authorize-write! authorize-patch!
                                           :complete-review-gate))
                update-response
                (await
                 (http/request!
                  {:url (str (:github-api-url config) "/repos/"
                             (repository-path (:repository gate-check))
                             "/check-runs/" (:id gate-check))
                   :method "PATCH"
                   :headers (headers token)
                   :body {:name (:name gate-check)
                          :status "completed"
                          :conclusion (:conclusion patch)
                          :details_url (:details-url patch)
                          :external_id (:external-id patch)
                          :output (:output patch)}}))
                updated (:body update-response)]
            (when-not (and (:ok? update-response)
                           (terminal-review-gate?
                            config gate-check patch updated))
              (throw (response-error "complete-review-gate-check"
                                     update-response)))
            {:updated? true
             :gate-check (bound-check-run->receipt gate-check updated)}))))))

(defn port [config]
  (let [configured (assoc config
                          :mode (or (:mode config) :observe-only))]
    {:fetch-pull-request! #(fetch-pull-request! configured %)
     :fetch-issue! #(fetch-issue! configured %)
     :actor-permission! #(actor-permission! configured %)
     :prepare-review-gate! #(prepare-review-gate! configured %1 %2)
     :cancel-review-gate! #(cancel-review-gate! configured %1 %2 %3)
     :fetch-workflow-run! #(fetch-workflow-run! configured %)
     :complete-review-gate! #(complete-review-gate! configured %1 %2)
     :dispatch-review! #(dispatch-review! configured %1 %2)}))
