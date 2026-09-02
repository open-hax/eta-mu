(ns eta-mu.gitops-controller.infra.github-test
  (:require ["node:crypto" :as node-crypto]
            [cljs.test :refer [deftest is]]
            [eta-mu.gitops-controller.extern.json :as json]
            [eta-mu.gitops-controller.infra.github :as github]))

(defn- response [status body]
  (js/Response. (when body (json/encode body))
                #js {:status status
                     :headers #js {"content-type" "application/json"}}))

(deftest ^:async workflow-dispatch-uses-the-2026-03-10-run-details-contract
  (let [original-fetch (.-fetch js/globalThis)
        requests* (atom [])
        authorized* (atom 0)
        key-pair (.generateKeyPairSync
                  node-crypto "rsa" #js {:modulusLength 2048})
        private-key (.export (.-privateKey key-pair)
                             #js {:type "pkcs8" :format "pem"})
        config {:github-api-url "https://api.github.test"
                :github-app-id 123
                :github-private-key private-key
                :mode :review-dispatch}
        adapter (github/port config)]
    (set!
     (.-fetch js/globalThis)
     (fn [url options]
       (let [request-number (count @requests*)]
         (swap! requests* conj {:url url :options options})
         (js/Promise.resolve
          (if (zero? request-number)
            (response 201 {:token "installation-token"})
            (response 200 {:workflow_run_id 987
                           :run_url "https://api.github.test/runs/987"
                           :html_url "https://github.test/runs/987"}))))))
    (try
      (let [result
            (await
             ((:dispatch-review! adapter)
              77
              (with-meta
                {:repository "open-hax/eta-mu"
                 :workflow "opencode-code-review.yml"
                 :ref "main"
                 :inputs {:pr_number "321"
                          :pr_base_sha
                          "1111111111111111111111111111111111111111"
                          :pr_head_sha
                          "0123456789abcdef0123456789abcdef01234567"
                          :pr_merge_sha
                          "2222222222222222222222222222222222222222"
                          :command_id
                          "9eb17352-284c-4b55-879d-0d07f353fdee"}}
                {:authorize-dispatch!
                 (fn []
                   (swap! authorized* inc)
                   (js/Promise.resolve true))})))
            dispatch-request (second @requests*)
            token-body (-> (first @requests*) :options (.-body) json/decode)
            body (-> dispatch-request :options (.-body) json/decode)
            request-headers (-> dispatch-request :options (.-headers))]
        (is (= 2 (count @requests*)))
        (is (= {} token-body))
        (is (= "https://api.github.test/repos/open-hax/eta-mu/actions/workflows/opencode-code-review.yml/dispatches"
               (:url dispatch-request)))
        (is (= {:ref "main"
                :inputs {:pr_number "321"
                         :pr_base_sha
                         "1111111111111111111111111111111111111111"
                         :pr_head_sha
                         "0123456789abcdef0123456789abcdef01234567"
                         :pr_merge_sha
                         "2222222222222222222222222222222222222222"
                         :command_id
                         "9eb17352-284c-4b55-879d-0d07f353fdee"}
                :return_run_details true}
               body))
        (is (= "2026-03-10"
               (aget request-headers "x-github-api-version")))
        (is (= 1 @authorized*))
        (is (= 987 (:workflow-run-id result))))
      (finally
        (set! (.-fetch js/globalThis) original-fetch)))))

(deftest ^:async observe-only-tokens-are-repository-scoped-and-mutations-are-disabled
  (let [original-fetch (.-fetch js/globalThis)
        key-pair (.generateKeyPairSync
                  node-crypto "rsa" #js {:modulusLength 2048})
        private-key (.export (.-privateKey key-pair)
                             #js {:type "pkcs8" :format "pem"})
        base-config {:github-api-url "https://api.github.test"
                     :github-app-id 123
                     :github-private-key private-key}
        adapter (github/port (assoc base-config :mode :observe-only))
        default-adapter (github/port base-config)
        requests* (atom [])]
    (set!
     (.-fetch js/globalThis)
     (fn [url options]
       (swap! requests* conj {:url url :options options})
       (js/Promise.resolve
        (if (.endsWith url "/access_tokens")
          (response 201 {:token "installation-token"})
          (response 200 {:permission "write"
                         :user {:id 9 :login "operator"}})))))
    (try
      (await ((:actor-permission! adapter)
              {:installation-id 77
               :repository-id 42
               :repository "open-hax/eta-mu"
               :sender-login "operator"}))
      (let [token-request (first @requests*)
            token-body (-> token-request :options (.-body) json/decode)]
        (is (= {:repository_ids [42]
                :permissions {:metadata "read"}}
               token-body)))
      (doseq [current-adapter [adapter default-adapter]]
        (let [error (try
                      (await ((:dispatch-review! current-adapter)
                              77 {:repository-id 42
                                  :repository "open-hax/eta-mu"}))
                      nil
                      (catch :default value value))]
          (is (= :github-mutation-disabled
                 (:error/code (ex-data error))))))
      (is (= 2 (count @requests*)))
      (finally
        (set! (.-fetch js/globalThis) original-fetch)))))

(deftest ^:async observe-only-pull-read-token-is-operation-scoped
  (let [original-fetch (.-fetch js/globalThis)
        key-pair (.generateKeyPairSync
                  node-crypto "rsa" #js {:modulusLength 2048})
        private-key (.export (.-privateKey key-pair)
                             #js {:type "pkcs8" :format "pem"})
        adapter (github/port {:github-api-url "https://api.github.test"
                              :github-app-id 123
                              :github-private-key private-key
                              :mode :observe-only})
        requests* (atom [])]
    (set!
     (.-fetch js/globalThis)
     (fn [url options]
       (swap! requests* conj {:url url :options options})
       (js/Promise.resolve
        (cond
          (.endsWith url "/access_tokens")
          (response 201 {:token "installation-token"})

          (.endsWith url "/pulls/321")
          (response 200 {:number 321})

          :else
          (response 200 {:id 42
                         :full_name "open-hax/eta-mu"
                         :default_branch "main"})))))
    (try
      (await ((:fetch-pull-request! adapter)
              {:installation-id 77
               :repository-id 42
               :repository "open-hax/eta-mu"
               :pull-request-number 321}))
      (let [token-body (-> @requests* first :options (.-body) json/decode)]
        (is (= {:repository_ids [42]
                :permissions {:metadata "read"
                              :pull_requests "read"}}
               token-body)))
      (finally
        (set! (.-fetch js/globalThis) original-fetch)))))

(deftest ^:async legacy-204-dispatch-is-held-fail-closed
  (let [original-fetch (.-fetch js/globalThis)
        key-pair (.generateKeyPairSync
                  node-crypto "rsa" #js {:modulusLength 2048})
        private-key (.export (.-privateKey key-pair)
                             #js {:type "pkcs8" :format "pem"})
        adapter (github/port {:github-api-url "https://api.github.test"
                              :github-app-id 123
                              :github-private-key private-key
                              :mode :review-dispatch})
        request-count* (atom 0)]
    (set! (.-fetch js/globalThis)
          (fn [_url _options]
            (let [request-number (swap! request-count* inc)]
              (js/Promise.resolve
               (if (= 1 request-number)
                 (response 201 {:token "installation-token"})
                 (response 204 nil))))))
    (try
      (let [error (try
                    (await ((:dispatch-review! adapter)
                            77 (with-meta
                                 {:repository "open-hax/eta-mu"
                                  :workflow "opencode-code-review.yml"
                                  :ref "main"
                                  :inputs {:command_id
                                           "9eb17352-284c-4b55-879d-0d07f353fdee"}}
                                 {:authorize-dispatch!
                                  #(js/Promise.resolve true)})))
                    nil
                    (catch :default value value))]
        (is (= :github-request-failed (:error/code (ex-data error))))
        (is (= 204 (:status (ex-data error)))))
      (finally
        (set! (.-fetch js/globalThis) original-fetch)))))

(deftest ^:async pending-gate-is-created-on-the-test-merge-after-fresh-authorization
  (let [original-fetch (.-fetch js/globalThis)
        events* (atom [])
        key-pair (.generateKeyPairSync
                  node-crypto "rsa" #js {:modulusLength 2048})
        private-key (.export (.-privateKey key-pair)
                             #js {:type "pkcs8" :format "pem"})
        adapter (github/port {:github-api-url "https://api.github.test"
                              :github-app-id 123
                              :github-private-key private-key
                              :mode :review-dispatch})
        base "1111111111111111111111111111111111111111"
        head "0123456789abcdef0123456789abcdef01234567"
        merge-sha "2222222222222222222222222222222222222222"
        command-id "9eb17352-284c-4b55-879d-0d07f353fdee"
        external-id (str "eta-mu-review-gate/v2:" command-id ":321:"
                         head ":" base ":" merge-sha)
        expected {:name "eta-mu-review-gate"
                  :repository "open-hax/eta-mu"
                  :repository-id 42
                  :pr-number 321
                  :pr-node-id "PR_kwDOExample"
                  :base-branch "main"
                  :base-sha base
                  :head-sha head
                  :merge-sha merge-sha
                  :delivery-id command-id
                  :external-id external-id
                  :details-url
                  "https://github.com/open-hax/eta-mu/pull/321"}
        created {:id 4567
                 :node_id "CR_gate"
                 :name "eta-mu-review-gate"
                 :head_sha merge-sha
                 :status "in_progress"
                 :conclusion nil
                 :external_id external-id
                 :details_url (:details-url expected)
                 :app {:id 123 :slug "eta-mu-controller"}}
        foreign (assoc created :id 111 :app {:id 999 :slug "foreign"})]
    (set!
     (.-fetch js/globalThis)
     (fn [url options]
       (swap! events* conj {:event :request
                            :url url
                            :method (.-method options)
                            :body (when-let [body (.-body options)]
                                    (json/decode body))})
       (js/Promise.resolve
        (cond
          (.endsWith url "/access_tokens")
          (response 201 {:token "installation-token"})

          (and (.includes url "/commits/")
               (= 1 (count (filter #(and (= :request (:event %))
                                         (.includes (:url %) "/commits/"))
                                   @events*))))
          (response 200 {:check_runs [foreign]})

          (.endsWith url "/check-runs")
          (response 201 created)

          (.includes url "/commits/")
          (response 200 {:check_runs [created foreign]})

          :else (response 500 {:unexpected url})))))
    (try
      (let [receipt
            (await
             ((:prepare-review-gate! adapter)
              77
              (with-meta expected
                {:authorize-create!
                 (fn []
                   (swap! events* conj {:event :authorize-create})
                   (js/Promise.resolve true))
                 :authorize-cancel!
                 #(js/Promise.resolve true)})))
            post-event (first (filter #(and (= :request (:event %))
                                            (= "POST" (:method %))
                                            (.endsWith (:url %) "/check-runs"))
                                      @events*))
            post-index (.indexOf @events* post-event)
            authorize-index
            (.indexOf @events* {:event :authorize-create})
            post-request (nth @events* post-index)]
        (is (< authorize-index post-index))
        (is (.includes (:url post-request) "/check-runs"))
        (is (= merge-sha (get-in post-request [:body :head_sha])))
        (is (= head (:head-sha receipt)))
        (is (= merge-sha (:merge-sha receipt)))
        (is (= 4567 (:id receipt))))
      (finally
        (set! (.-fetch js/globalThis) original-fetch)))))

(deftest ^:async cancelled-exact-gate-with-a-newer-peer-is-reported-as-superseded
  (let [original-fetch (.-fetch js/globalThis)
        requests* (atom [])
        authorized* (atom 0)
        key-pair (.generateKeyPairSync
                  node-crypto "rsa" #js {:modulusLength 2048})
        private-key (.export (.-privateKey key-pair)
                             #js {:type "pkcs8" :format "pem"})
        adapter (github/port {:github-api-url "https://api.github.test"
                              :github-app-id 123
                              :github-private-key private-key
                              :mode :review-dispatch})
        merge-sha "2222222222222222222222222222222222222222"
        external-id
        (str "eta-mu-review-gate/v2:"
             "9eb17352-284c-4b55-879d-0d07f353fdee:321:"
             "0123456789abcdef0123456789abcdef01234567:"
             "1111111111111111111111111111111111111111:"
             merge-sha)
        expected {:name "eta-mu-review-gate"
                  :repository "open-hax/eta-mu"
                  :repository-id 42
                  :pr-number 321
                  :merge-sha merge-sha
                  :delivery-id "9eb17352-284c-4b55-879d-0d07f353fdee"
                  :external-id external-id
                  :details-url "https://github.com/open-hax/eta-mu/pull/321"}
        cancelled {:id 4567
                   :node_id "CR_cancelled"
                   :name "eta-mu-review-gate"
                   :head_sha merge-sha
                   :status "completed"
                   :conclusion "cancelled"
                   :external_id external-id
                   :details_url (:details-url expected)
                   :app {:id 123 :slug "eta-mu-controller"}}
        newer (assoc cancelled
                     :id 4568
                     :node_id "CR_newer"
                     :status "in_progress"
                     :conclusion nil
                     :external_id "eta-mu-review-gate/v2:newer")]
    (set!
     (.-fetch js/globalThis)
     (fn [url options]
       (swap! requests* conj {:url url :options options})
       (js/Promise.resolve
        (cond
          (.endsWith url "/access_tokens")
          (response 201 {:token "installation-token"})

          (.includes url "/commits/")
          (response 200 {:check_runs [cancelled newer]})

          :else (response 500 {:unexpected url})))))
    (try
      (let [result
            (await
             ((:prepare-review-gate! adapter)
              77
              (with-meta expected
                {:authorize-create!
                 (fn []
                   (swap! authorized* inc)
                   (js/Promise.resolve true))
                 :authorize-cancel!
                 (fn []
                   (swap! authorized* inc)
                   (js/Promise.resolve true))})))]
        (is (:superseded? result))
        (is (= 4567 (:id result)))
        (is (= "completed" (:status result)))
        (is (= "cancelled" (:conclusion result)))
        (is (= 4568 (:superseded-by-check-id result)))
        (is (zero? @authorized*))
        (is (not-any? #(contains? #{"POST" "PATCH"}
                                  (.-method (:options %)))
                      (rest @requests*))))
      (finally
        (set! (.-fetch js/globalThis) original-fetch)))))

(deftest ^:async terminal-update-patches-the-exact-controller-owned-check
  (let [original-fetch (.-fetch js/globalThis)
        requests* (atom [])
        key-pair (.generateKeyPairSync
                  node-crypto "rsa" #js {:modulusLength 2048})
        private-key (.export (.-privateKey key-pair)
                             #js {:type "pkcs8" :format "pem"})
        config {:github-api-url "https://api.github.test"
                :github-app-id 123
                :github-private-key private-key
                :mode :review-dispatch}
        adapter (github/port config)
        head "0123456789abcdef0123456789abcdef01234567"
        base "1111111111111111111111111111111111111111"
        merge-sha "2222222222222222222222222222222222222222"
        external-id (str "eta-mu-review-gate/v2:"
                         "9eb17352-284c-4b55-879d-0d07f353fdee:321:"
                         head ":" base ":" merge-sha)
        gate {:id 4567
              :node-id "CR_gate"
              :name "eta-mu-review-gate"
              :repository "open-hax/eta-mu"
              :repository-id 42
              :pr-number 321
              :pr-node-id "PR_kwDOExample"
              :base-branch "main"
              :base-sha base
              :head-sha head
              :merge-sha merge-sha
              :external-id external-id
              :details-url "https://github.com/open-hax/eta-mu/pull/321"
              :app-id 123
              :app-slug "eta-mu-controller"
              :status "in_progress"}
        patch {:name "eta-mu-review-gate"
               :status "completed"
               :conclusion "success"
               :details-url "https://github.com/open-hax/eta-mu/actions/runs/991/attempts/1"
               :external-id external-id
               :output {:title "Review evidence and resolution gate passed"
                        :summary "Bound workflow completed."}}
        pending {:id 4567
                 :node_id "CR_gate"
                 :name "eta-mu-review-gate"
                 :head_sha merge-sha
                 :status "in_progress"
                 :conclusion nil
                 :external_id external-id
                 :details_url (:details-url gate)
                 :app {:id 123 :slug "eta-mu-controller"}}
        authorized* (atom 0)
        terminal (assoc pending
                        :status "completed"
                        :conclusion "success"
                        :details_url (:details-url patch)
                        :output (:output patch))
        current-check* (atom pending)]
    (set!
     (.-fetch js/globalThis)
     (fn [url options]
       (swap! requests* conj {:url url :options options})
       (js/Promise.resolve
        (cond
          (.endsWith url "/access_tokens")
          (response 201 {:token "installation-token"})

          (.includes url "/commits/")
          (response 200 {:check_runs [@current-check*]})

          (and (.endsWith url "/check-runs/4567")
               (= "GET" (.-method options)))
          (response 200 @current-check*)

          (and (.endsWith url "/check-runs/4567")
               (= "PATCH" (.-method options)))
          (do (reset! current-check* terminal)
              (response 200 terminal))

          :else (response 500 {:unexpected url})))))
    (try
      (let [result (await ((:complete-review-gate! adapter)
                           77 {:gate-check gate
                               :terminal-intent {:patch patch}
                               :authorize-patch!
                               (fn []
                                 (swap! authorized* inc)
                                 (js/Promise.resolve true))}))
            patch-request (last @requests*)
            body (-> patch-request :options (.-body) json/decode)
            replay (await ((:complete-review-gate! adapter)
                           77 {:gate-check gate
                               :terminal-intent {:patch patch}
                               :authorize-patch!
                               (fn []
                                 (swap! authorized* inc)
                                 (js/Promise.resolve true))}))]
        (is (:updated? result))
        (is (= 1 @authorized*))
        (is (:already-completed? replay))
        (is (.endsWith (:url patch-request) "/check-runs/4567"))
        (is (= {:name "eta-mu-review-gate"
                :status "completed"
                :conclusion "success"
                :details_url (:details-url patch)
                :external_id external-id
                :output (:output patch)}
               body))
        (is (not-any? #(and (= "POST" (.-method (:options %)))
                            (.endsWith (:url %) "/check-runs"))
                      @requests*))
        (is (= 1 (count (filter #(= "PATCH" (.-method (:options %)))
                                @requests*)))))
      (finally
        (set! (.-fetch js/globalThis) original-fetch)))))

(deftest ^:async issue-probe-refetches-issue-repository-and-default-branch
  (let [original-fetch (.-fetch js/globalThis)
        requests* (atom [])
        key-pair (.generateKeyPairSync
                  node-crypto "rsa" #js {:modulusLength 2048})
        private-key (.export (.-privateKey key-pair)
                             #js {:type "pkcs8" :format "pem"})
        adapter (github/port {:github-api-url "https://api.github.test"
                              :github-app-id 123
                              :github-private-key private-key})
        sha "0123456789abcdef0123456789abcdef01234567"]
    (set!
     (.-fetch js/globalThis)
     (fn [url options]
       (swap! requests* conj
              {:url url
               :method (.-method options)
               :body (when-let [body (.-body options)]
                       (json/decode body))})
       (js/Promise.resolve
        (cond
          (.endsWith url "/access_tokens")
          (response 201 {:token "installation-token"})

          (.endsWith url "/issues/320")
          (response
           200
           {:number 320
            :node_id "I_kwDOExample"
            :state "open"
            :html_url "https://github.test/open-hax/eta-mu/issues/320"
            :body (str "<!-- openhax-kanban-sync "
                       "uuid=\"eta-mu-webhook-review-controller\" -->")
            :labels [{:name "eta-mu:probe"} {:name "priority:P0"}]})

          (.endsWith url "/repos/open-hax/eta-mu")
          (response 200 {:id 42
                         :full_name "open-hax/eta-mu"
                         :default_branch "main"
                         :archived false
                         :disabled false})

          (.endsWith url "/git/ref/heads/main")
          (response 200 {:ref "refs/heads/main"
                         :object {:type "commit" :sha sha}})

          (.endsWith url "/collaborators/operator/permission")
          (response 200 {:permission "write"
                         :user {:id 9 :login "operator"}})

          :else
          (response 500 {:unexpected url})))))
    (try
      (let [command
            {:event "issues"
             :action "labeled"
             :label "eta-mu:probe"
             :installation-id 77
             :repository "open-hax/eta-mu"
             :repository-id 42
             :issue-number 320
             :sender-login "operator"}
            current
            (await
             ((:fetch-issue! adapter) command))
            permission (await ((:actor-permission! adapter) command))]
        (is (= 6 (count @requests*)))
        (is (= ["POST" "GET" "GET" "GET" "POST" "GET"]
               (mapv :method @requests*)))
        (is (= ["https://api.github.test/app/installations/77/access_tokens"
                "https://api.github.test/repos/open-hax/eta-mu/issues/320"
                "https://api.github.test/repos/open-hax/eta-mu"
                "https://api.github.test/repos/open-hax/eta-mu/git/ref/heads/main"
                "https://api.github.test/app/installations/77/access_tokens"
                (str "https://api.github.test/repos/open-hax/eta-mu/"
                     "collaborators/operator/permission")]
               (mapv :url @requests*)))
        (is (= {:repository_ids [42]
                :permissions {:issues "read"
                              :contents "read"
                              :metadata "read"}}
               (:body (first @requests*))))
        (is (= {:repository_ids [42]
                :permissions {:metadata "read"}}
               (:body (nth @requests* 4))))
        (is (= sha (:default-branch-sha current)))
        (is (= #{"eta-mu:probe" "priority:P0"} (:labels current)))
        (is (false? (:pull-request? current)))
        (is (= {:permission "write"
                :user-id 9
                :user-login "operator"}
               permission)))
      (finally
        (set! (.-fetch js/globalThis) original-fetch)))))
