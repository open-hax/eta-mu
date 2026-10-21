;; SPDX-License-Identifier: GPL-3.0-or-later
(ns opencode-review-collection-test
  "Causal inert controls for the read-only native metadata collector."
  (:require [cljs.test :as test :refer [async deftest is testing]]
            [eta-mu.law.review-collection :as law]
            [eta-mu.extern.review-collection :as host]
            [eta-mu.shape.review-collection :as shape]
            [eta-mu.infra.review-collection :as collection]))

(defn sha [c] (apply str (repeat 40 c)))
(def registry {:source-sha (sha "a")
               :targets [{:repository {:id 41 :full-name "owner/repo" :public? true}
                          :enabled? false :fixture? false
                          :sources {:caller (sha "a") :eta (sha "b") :muse (sha "c")
                                    :verifier (apply str (repeat 64 "d")) :build (apply str (repeat 64 "e"))}
                          :publisher {:app-id 3152464 :actor {:id 7 :login "publisher[bot]" :type :bot}}
                          :producer {:id 51 :path ".github/workflows/producer.yml" :source-sha (sha "a")
                                     :required-jobs ["producer"] :commands [["pnpm" "test"]]}
                          :setup {:repository-id 41 :default-sha (sha "b") :app-id 3152464
                                  :proof (apply str (repeat 64 "f"))
                                  :custody-proof (apply str (repeat 64 "1"))
                                  :protection-proof (apply str (repeat 64 "2"))
                                  :permissions #{:statuses-write :pull-requests-write}}
                          :hosted-proof {:source-sha (sha "b") :sha256 (apply str (repeat 64 "3"))}
                          :status-policy {:max-writes 1 :observation-max-age-ms 100000}}]})
(defn run!test
  ([registry transport] (run!test registry transport 100))
  ([registry transport page-size]
   (collection/collect-with! {:registry registry :target-id 41 :pr-number 7 :run-id 99
                              :mode :ordinary :event :schedule :bounds {:requests 50 :pages 40 :bytes 100000
                                                                        :page-size page-size :operation-ms 2000}}
                             transport)))
(def native-shas {:base (sha "b") :head (sha "c") :merge (sha "d") :tree (sha "e")})
(def future-time "2030-01-01T00:00:00Z")
(def seen-urls (atom []))
(def seen-requests (atom []))
(defn fake-native [alter]
  (fn [{:keys [url] :as request}]
    (swap! seen-urls conj url)
    (swap! seen-requests conj request)
    (let [body
          (cond
            (= url "https://api.github.com/repos/owner/repo")
            {:id 41 :full_name "owner/repo" :private false}
            (.endsWith url "/pulls/7")
            {:number 7 :state "open" :draft false :mergeable true
             :base {:sha (:base native-shas) :ref "main"
                    :repo {:id 41 :full_name "owner/repo" :private false}}
             :head {:sha (:head native-shas)
                    :repo {:id 52 :full_name "contrib/repo" :private false}}}
            (.endsWith url "/git/ref/heads/main")
            {:ref "refs/heads/main" :object {:type "commit" :sha (:base native-shas)}}
            (.endsWith url "/git/ref/pull/7/merge")
            {:ref "refs/pull/7/merge" :object {:type "commit" :sha (:merge native-shas)}}
            (.endsWith url (str "/commits/" (:base native-shas)))
            {:sha (:base native-shas) :commit {:tree {:sha (:tree native-shas)}}}
            (.endsWith url (str "/commits/" (:head native-shas)))
            {:sha (:head native-shas) :commit {:tree {:sha (:tree native-shas)}}}
            (.endsWith url (str "/commits/" (:merge native-shas)))
            {:sha (:merge native-shas) :parents [{:sha (:base native-shas)} {:sha (:head native-shas)}]
             :commit {:tree {:sha (:tree native-shas)}}}
            (.includes url "/compare/")
            {:status "ahead" :merge_base_commit {:sha (:base native-shas)}}
            (.endsWith url "/actions/runs/99")
            {:id 99 :repository {:id 41 :full_name "owner/repo" :private false}
             :workflow_id 51 :run_attempt 2 :head_sha (:head native-shas)
             :event "schedule"
             :status "completed" :conclusion "success"
             :pull_requests [] :referenced_workflows []}
            (.endsWith url "/actions/runs/99/attempts/2")
            {:id 99 :repository {:id 41 :full_name "owner/repo" :private false}
             :workflow_id 51 :run_attempt 2 :head_sha (:head native-shas)
             :event "schedule"
             :status "completed" :conclusion "success"
             :pull_requests [] :referenced_workflows []}
            (.endsWith url "/actions/workflows/51")
            {:id 51 :path ".github/workflows/producer.yml"}
            (.includes url "/actions/runs/99/attempts/2/jobs?")
            {:total_count 1 :jobs [{:id 101 :run_id 99 :run_attempt 2 :name "producer"
                                    :status "completed" :conclusion "success"}]}
            (.includes url "/actions/runs/99/artifacts?")
            {:total_count 1 :artifacts [{:id 201 :name "candidate" :size_in_bytes 10 :expired false
                          :digest (str "sha256:" (apply str (repeat 64 "f")))
                          :created_at "2026-10-20T00:00:00Z" :expires_at future-time
                          :workflow_run {:id 99 :head_sha (:head native-shas)}}]}
            :else {:unknown-url url})
          body (alter url body)]
      {:status :ok :data body :bytes 100 :next-url nil})))

(defn ^:async disabled-control [done]
  (let [calls (atom [])
        result (await (run!test registry (fn [request] (swap! calls conj request) {})))]
    (is (= :refused (:status result)))
    (is (= :enrollment (:reason result)))
    (is (empty? @calls))
    (done)))
(deftest disabled-target-refuses-before-any-native-read
  (async done (disabled-control done)))

(deftest accepted-source-native-shapes-reject-incomplete-or-conflicting-facts
  (is (law/native-repository? {:id 41 :full-name "owner/repo" :public? true}))
  (is (law/native-repository? {:id 42 :full-name "owner/repo" :public? true}))
  (is (law/raw-repository? {:id 41 :full_name "owner/repo" :private false}))
  (is (nil? (shape/repository {:id 41 :full_name "owner/repo"})))
  (is (law/raw-run? {:id 99 :run_attempt 1 :repository {:id 41 :full_name "owner/repo" :private false} :workflow_id 51
                     :head_sha (sha "a") :status "completed" :conclusion "success"}))
  (is (not (law/raw-run? {:id 99 :run_attempt 1 :repository {:id 41 :full_name "owner/repo" :private false} :workflow_id 51
                          :head_sha "unknown" :status "completed" :conclusion "success"})))
  (is (law/raw-job? {:id 1 :run_id 99 :run_attempt 2 :name "producer" :status "completed" :conclusion "success"} 99 2))
  (is (not (law/raw-job? {:id 1 :run_id 98 :run_attempt 2 :name "producer" :status "completed" :conclusion "success"} 99 2)))
  (is (law/raw-artifact? {:id 1 :name "bundle" :size_in_bytes 2 :created_at "2026-10-20"
                          :expires_at future-time :expired false :digest (str "sha256:" (apply str (repeat 64 "a")))}))
  (is (not (law/raw-artifact? {:id 1 :name "bundle" :size_in_bytes 0 :expired false})))
  (let [native-bundle {:id 39563090634 :path ".github/workflows/sandbox-bundle.yml"
                       :head_sha "6a796582d74f93c1a1f18ca5c89eb3a0b19445eb"
                       :workflow_id 321657236 :run_attempt 1 :status "in_progress" :conclusion nil
                       :repository {:id 1189985055 :full_name "open-hax/eta-mu" :private false}
                       :pull_requests [] :referenced_workflows []}
        normalized (shape/run native-bundle {:id 321657236 :path (:path native-bundle)})]
    (is (law/raw-run? native-bundle))
    (is (= 1189985055 (:repository-id normalized)))
    (is (= "6a796582d74f93c1a1f18ca5c89eb3a0b19445eb" (:head-sha normalized)))
    (is (nil? (:event-sha normalized)))
    (is (nil? (:workflow-source-sha normalized))))
  (is (not (law/native-run? {:id 99 :attempt 1 :repository-id 42})))
  (is (not (law/complete-pages? {:pages 2 :received 1 :next? true})))
  (is (law/complete-pages? {:pages 2 :received 2 :next? false}))
  (is (not (law/native-artifact? {:id 12 :run-id 99 :size-bytes 3 :expired? true}))))

(defn ^:async malformed-control [done]
  (let [calls (atom 0)
        result (await (run!test (assoc registry :targets [{:repository {:id 41}}])
                                (fn [_] (swap! calls inc) {})))]
    (is (= :refused (:status result)))
    (is (= :registry (:reason result)))
    (is (zero? @calls))
    (done)))
(deftest source-preflight-refuses-malformed-registry-without-transport
  (async done (malformed-control done)))

(defn ^:async invalid-fixture-mode-control [done]
  (let [calls (atom [])
        request {:registry (assoc-in registry [:targets 0 :enabled?] true)
                 :target-id 41 :pr-number 7 :run-id 99 :bounds {:requests 50 :pages 40 :bytes 100000
                                                                 :page-size 100 :operation-ms 2000}
                 :mode :qualification-only :event :workflow-dispatch :fixture-id 42}
        result (await (collection/collect-with! request (fn [r] (swap! calls conj r) {})))]
    (is (= :refused (:status result)))
    (is (= :enrollment (:reason result)))
    (is (empty? @calls))
    (done)))
(deftest invalid-fixture-mode-refuses-before-any-native-read
  (async done (invalid-fixture-mode-control done)))

(deftest production-registry-is-anchored-to-source-and-absent-registry-refuses
  (let [{:keys [status reason]} (host/read-registry!)]
    (is (= :refused status))
    (is (= :registry reason))))

(deftest transport-request-law-rejects-injected-url-and-non-get
  (is (law/request? {:method :get :url "https://api.github.com/repos/owner/repo/pulls/7"}))
  (is (law/request? {:method :get :url "https://api.github.com/repos/owner/repo/git/ref/pull/7/merge"}))
  (is (not (law/request? {:method :get :url "https://api.github.com/repos/owner/repo/git/ref/pulls/7/merge"})))
  (is (not (law/request? {:method :post :url "https://api.github.com/repos/owner/repo/pulls/7"})))
  (is (not (law/request? {:method :get :url "https://evil.invalid/repos/owner/repo/pulls/7"})))
  (is (not (law/request? {:method :get :url "https://api.github.com/repos/owner/repo/pulls/7?redirect=https://evil.invalid"}))))

(defn ^:async positive-native-control [done]
  (reset! seen-urls [])
  (reset! seen-requests [])
  (let [result (await (run!test (assoc-in registry [:targets 0 :enabled?] true)
                                (fake-native (fn [_ body] body))))]
    (is (= :pending (:status result)) (str (pr-str result) " URLs=" (pr-str @seen-urls)))
    (is (= :run-pr-association (:reason result)))
    (is (= [] (:effects result)))
    (is (= (:base native-shas) (get-in result [:native :tuple :base-sha])))
    (is (= (:head native-shas) (get-in result [:native :tuple :head-sha])))
    (is (= [(:base native-shas) (:head native-shas)] (get-in result [:native :tuple :merge-parents])))
    (is (= 201 (get-in result [:native :run :artifacts :items 0 :id])))
    (is (= :unverified (get-in result [:native :run :workflow-source-custody])))
    (is (= :unverified (get-in result [:completeness :verifier-input])))
    (is (nil? (get-in result [:native :tuple :event-sha])))
    (is (nil? (get-in result [:native :run :event-sha])))
    (is (nil? (get-in result [:native :run :workflow-source-sha])))
    (is (not (law/native-run? (get-in result [:native :run]))))
    (is (= :unobserved (get-in result [:completeness :original-event-sha])))
    (is (= 2 (:snapshot-passes result)) "Two complete source observations execute")
    (is (some #(.endsWith % "/git/ref/pull/7/merge") @seen-urls)
        "The native singular pull merge-ref endpoint is read")
    (is (some #(.includes % "/attempts/2/jobs?") @seen-urls)
        "Jobs are read for the exact native attempt")
    (is (some #(.endsWith % "/actions/runs/99/attempts/2") @seen-urls)
        "The exact run attempt endpoint is read")
    (is (every? #(= :get (:method %)) @seen-requests) "The collector only issues GET requests")
    (is (every? #(law/request? {:method (:method %) :url (:url %)}) (:native-reads result))
        "Returned request provenance contains only fixed GitHub GET routes")
    (is (= (count @seen-requests) (count (:native-reads result)))
        "Every native request identity is retained")
    (is (every? #(and (pos? (:timeout-ms %)) (pos? (:max-bytes %))) (:native-reads result))
        "Each request records finite time and response-byte bounds")
    (is (= :pending (:qualification result)) "Metadata collection does not qualify publication")
    (done)))
(deftest actual-native-shaped-read-collects-two-stable-snapshots
  (async done (positive-native-control done)))

(defn ^:async associated-metadata-control [done]
  (let [result (await (run!test (assoc-in registry [:targets 0 :enabled?] true)
                                (fake-native (fn [url body]
                                               (if (.endsWith url "/actions/runs/99")
                                                 (assoc body :pull_requests [{:number 7
                                                                              :base {:sha (:base native-shas)}
                                                                              :head {:sha (:head native-shas)}}])
                                                 body)))))]
    (is (= :collected (:status result)))
    (is (= :pending (:qualification result)))
    (is (= :source-custody-incomplete (:reason result)))
    (is (nil? (get-in result [:native :tuple :event-sha])))
    (is (map? (get-in result [:native :tuple :raw :merge-commit])))
    (is (map? (get-in result [:native :run :artifacts :raw-items 0])))
    (done)))
(deftest associated-metadata-still-does-not-qualify-source-custody
  (async done (associated-metadata-control done)))

(defn ^:async complete-pagination-control [done]
  (let [registry (-> registry
                     (assoc-in [:targets 0 :enabled?] true)
                     (assoc-in [:targets 0 :producer :required-jobs] ["producer" "second"]))
        base (fake-native (fn [_ body] body))
        transport
        (fn [{:keys [url] :as request}]
          (let [response (base request)]
            (cond
              (.endsWith url "/jobs?per_page=2&page=1")
              (assoc response :data (assoc (:data response) :total_count 2)
                     :next-url "https://api.github.com/repos/owner/repo/actions/runs/99/attempts/2/jobs?per_page=2&page=2")
              (.endsWith url "/jobs?per_page=2&page=2")
              (assoc response :data {:total_count 2
                                     :jobs [{:id 102 :run_id 99 :run_attempt 2 :name "second"
                                             :status "completed" :conclusion "success"}]})
              (.endsWith url "/artifacts?per_page=2&page=1")
              (assoc response :data (assoc (:data response) :total_count 2)
                     :next-url "https://api.github.com/repos/owner/repo/actions/runs/99/artifacts?per_page=2&page=2")
              (.endsWith url "/artifacts?per_page=2&page=2")
              (assoc response :data {:total_count 2
                                     :artifacts [{:id 202 :name "second" :size_in_bytes 10 :expired false
                                                  :digest (str "sha256:" (apply str (repeat 64 "e")))
                                                  :created_at "2026-10-20T00:00:00Z" :expires_at future-time
                                                  :workflow_run {:id 99 :head_sha (:head native-shas)}}]})
              :else response)))]
    (try
      (let [result (await (run!test registry transport 2))]
        (is (= :pending (:status result)))
        (is (= true (get-in result [:native :run :jobs :complete?])))
        (is (= true (get-in result [:native :run :artifacts :complete?])))
        (is (= 2 (get-in result [:native :run :jobs :pages])))
        (is (= 2 (get-in result [:native :run :artifacts :pages])))
        (is (= 2 (count (get-in result [:native :run :jobs :items]))))
        (is (= 2 (count (get-in result [:native :run :artifacts :items])))))
      (catch :default e (is false (str e)))
      (finally (done)))))
(deftest jobs-and-artifacts-require-complete-bounded-pagination
  (async done (complete-pagination-control done)))

(defn ^:async base-drift-control [done]
  (let [result (await (run!test (assoc-in registry [:targets 0 :enabled?] true)
                                (fake-native (fn [url body]
                                               (if (.endsWith url "/git/ref/heads/main")
                                                 (assoc-in body [:object :sha] (sha "1")) body)))))]
    (is (= :refused (:status result)))
    (is (= :base-drift (:reason result)))
    (is (= [] (:effects result)))
    (done)))
(deftest live-base-must-match-pr-reported-base
  (async done (base-drift-control done)))

(defn ^:async forged-next-control [done]
  (let [result (await
                (run!test (assoc-in registry [:targets 0 :enabled?] true)
                         (fn [{:keys [url]}]
                           (let [result ((fake-native (fn [_ body] body)) {:url url})]
                             (if (.includes url "/jobs?")
                               (assoc result :next-url "https://evil.invalid/steal") result)))))]
    (is (= :refused (:status result)))
    (is (= :pagination (:reason result)))
    (done)))
(deftest pagination-link-cannot-change-api-route
  (async done (forged-next-control done)))

(defn ^:async tuple-drift-control [done]
  (let [pr-count (atom 0)
        result (await (run!test (assoc-in registry [:targets 0 :enabled?] true)
                                (fake-native (fn [url body]
                                               (if (.endsWith url "/pulls/7")
                                                 (if (= 2 (swap! pr-count inc)) (assoc body :mergeable nil) body)
                                                 body)))))]
    (is (= :refused (:status result)))
    (is (= :snapshot-drift (:reason result)))
    (done)))
(deftest tuple-must-remain-stable-across-both-full-passes
  (async done (tuple-drift-control done)))

(defn ^:async unknown-mergeability-control [done]
  (let [result (await (run!test (assoc-in registry [:targets 0 :enabled?] true)
                                (fake-native (fn [url body]
                                               (cond
                                                 (.endsWith url "/pulls/7") (assoc body :mergeable nil)
                                                 (.endsWith url "/actions/runs/99")
                                                 (assoc body :pull_requests [{:number 7
                                                                              :base {:sha (:base native-shas)}
                                                                              :head {:sha (:head native-shas)}}])
                                                 :else body)))))]
    (is (= :pending (:status result)))
    (is (= :mergeability (:reason result)))
    (done)))
(deftest unknown-mergeability-remains-pending
  (async done (unknown-mergeability-control done)))

(defn ^:async invalid-run-control [done]
  (doseq [[label alter reason]
          [[:wrong-workflow
            (fn [url body] (if (.endsWith url "/actions/runs/99") (assoc body :workflow_id 52) body))
            :run-association]
           [:wrong-repository
            (fn [url body] (if (.endsWith url "/actions/runs/99") (assoc-in body [:repository :id] 42) body))
            :run-association]
           [:wrong-head-with-empty-pr-association
            (fn [url body] (if (.endsWith url "/actions/runs/99") (assoc body :head_sha (sha "1")) body))
            :run-association]
           [:wrong-event
            (fn [url body] (if (.endsWith url "/actions/runs/99") (assoc body :event "pull_request") body))
            :run-association]
           [:wrong-pr-number
            (fn [url body] (if (.endsWith url "/pulls/7") (assoc body :number 8) body))
            :repository]
           [:wrong-attempt
            (fn [url body] (if (.endsWith url "/attempts/2") (assoc body :run_attempt 1) body))
            :run-association]
           [:failed-job
            (fn [url body] (if (.includes url "/jobs?") (assoc-in body [:jobs 0 :conclusion] "failure") body))
            :run-association]
           [:skipped-job
            (fn [url body] (if (.includes url "/jobs?")
                            (-> body (assoc-in [:jobs 0 :status] "completed")
                                (assoc-in [:jobs 0 :conclusion] "skipped")) body))
            :run-association]
           [:missing-job
            (fn [url body] (if (.includes url "/jobs?") (assoc body :jobs [] :total_count 0) body))
            :run-association]
           [:duplicate-job
            (fn [url body] (if (.includes url "/jobs?")
                            (-> body (assoc :total_count 2)
                                (update :jobs conj (assoc (first (:jobs body)) :id 102))) body))
            :run-association]
           [:bad-artifact-digest
            (fn [url body] (if (.includes url "/artifacts?")
                             (assoc-in body [:artifacts 0 :digest] "sha256:bad") body))
            :artifact]
           [:expired-artifact
            (fn [url body] (if (.includes url "/artifacts?")
                             (assoc-in body [:artifacts 0 :expires_at] "2000-01-01T00:00:00Z") body))
            :artifact]
           [:wrong-artifact-run
            (fn [url body] (if (.includes url "/artifacts?")
                             (assoc-in body [:artifacts 0 :workflow_run :id] 98) body))
            :run-association]
           [:wrong-artifact-head
            (fn [url body] (if (.includes url "/artifacts?")
                             (assoc-in body [:artifacts 0 :workflow_run :head_sha] (sha "1")) body))
            :run-association]
           [:truncated-page
            (fn [url body] (if (.includes url "/jobs?") (assoc body :total_count 2) body))
            :pagination-truncated]]]
    (let [result (await (run!test (assoc-in registry [:targets 0 :enabled?] true)
                                  (fake-native alter)))]
      (testing (name label)
        (is (= :refused (:status result)))
        (is (= reason (:reason result))))))
  (done))
(deftest native-run-jobs-and-artifacts-must-match-identities
  (async done (invalid-run-control done)))

(defn ^:async request-budget-control [done]
  (let [calls (atom 0)
        request {:registry (assoc-in registry [:targets 0 :enabled?] true) :target-id 41 :pr-number 7 :run-id 99
                 :mode :ordinary :event :schedule
                 :bounds {:requests 1 :pages 1 :bytes 10000 :page-size 100 :operation-ms 2000}}
        native (fake-native (fn [_ body] body))
        result (await (collection/collect-with! request
                                                (fn [r] (swap! calls inc) (native r))))]
    (is (= :refused (:status result)))
    (is (= :overbudget (:reason result)))
    (is (= 1 @calls))
    (is (= 1 (count (:native-reads result))))
    (is (= [] (:effects result)))
    (done)))
(deftest request-budget-is-finite-and-refuses-before-overrun
  (async done (request-budget-control done)))

(def original-failure-report (get-method test/report [::test/default :fail]))
(defmethod test/report [::test/default :fail] [result]
  (set! (.-exitCode js/process) 1)
  (original-failure-report result))
(defmethod test/report [::test/default :end-run-tests] [result]
  (when-not (test/successful? result) (set! (.-exitCode js/process) 1)))
(test/run-tests 'opencode-review-collection-test)
