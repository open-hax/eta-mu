;; SPDX-License-Identifier: GPL-3.0-or-later
(ns opencode-review-collection-test
  "Causal inert controls for the read-only native metadata collector."
  (:require [cljs.test :as test :refer [async deftest is testing]]
            [cljs.reader :as reader]
            [eta-mu.law.review-collection :as law]
            [eta-mu.extern.review-collection :as host]
            [eta-mu.shape.review-collection :as shape]
            [eta-mu.infra.review-collection :as collection]
            [clojure.string :as str]
            ["node:child_process" :as cp]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]))

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
(declare run!event)
(defn run!test
  ([registry transport] (run!test registry transport 100))
  ([registry transport page-size]
   (run!event registry transport page-size :schedule)))
(defn run!event [registry transport page-size event]
  (collection/collect-with! {:registry registry :target-id 41 :pr-number 7 :run-id 99
                             :mode :ordinary :event event :bounds {:requests 50 :pages 40 :bytes 100000
                                                                   :page-size page-size :operation-ms 2000}}
                            transport))
(def native-shas {:base (sha "b") :head (sha "c") :merge (sha "d") :tree (sha "e")})
(def future-time "2030-01-01T00:00:00Z")
(def seen-urls (atom []))
(def seen-requests (atom []))
(defn raw-pull-file
  ([filename status] (raw-pull-file filename status {}))
  ([filename status extras]
   (merge {:sha (sha "a") :filename filename :status status
           :additions 1 :blob_url "https://github.com/owner/repo/blob/file"
           :changes 2 :contents_url "https://api.github.com/repos/owner/repo/contents/file"
           :deletions 0 :raw_url "https://github.com/owner/repo/raw/file"}
          extras)))
(defn fake-native [alter]
  (fn [{:keys [url] :as request}]
    (swap! seen-urls conj url)
    (swap! seen-requests conj request)
    (let [body
          (cond
            (= url "https://api.github.com/repos/owner/repo")
            {:id 41 :full_name "owner/repo" :private false}
            (.endsWith url "/pulls/7")
            {:number 7 :state "open" :draft false :mergeable true :changed_files 2
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
             :event "pull_request"
             :status "completed" :conclusion "success"
             :pull_requests [] :referenced_workflows []}
            (.endsWith url "/actions/runs/99/attempts/2")
            {:id 99 :repository {:id 41 :full_name "owner/repo" :private false}
             :workflow_id 51 :run_attempt 2 :head_sha (:head native-shas)
             :event "pull_request"
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
            (.includes url "/pulls/7/files?")
            [(raw-pull-file "src/a.cljs" "modified" {:patch "@@ -1 +1 @@\n-a\n+b"})
             (raw-pull-file "src/b.cljs" "renamed" {:previous_filename "src/old.cljs"
                                                       :patch "@@ -1 +1 @@\n-c\n+d"})]
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
  (is (law/request? {:method :get :url "https://api.github.com/repos/owner/repo/pulls/7/files?per_page=100&page=1"}))
  (is (not (law/request? {:method :get :url "https://api.github.com/repos/owner/repo/pulls/7/files?redirect=https://evil.invalid"})))
  (is (not (law/request? {:method :get :url "https://api.github.com/repos/owner/repo/pulls/7/files?page=1&per_page=100"})))
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
    (is (= [{:sha (sha "a") :filename "src/a.cljs" :status :modified :additions 1
             :blob-url "https://github.com/owner/repo/blob/file" :changes 2
             :contents-url "https://api.github.com/repos/owner/repo/contents/file" :deletions 0
             :raw-url "https://github.com/owner/repo/raw/file"
             :patch "@@ -1 +1 @@\n-a\n+b" :patch-state :available}
            {:sha (sha "a") :filename "src/b.cljs" :status :renamed :additions 1
             :blob-url "https://github.com/owner/repo/blob/file" :changes 2
             :contents-url "https://api.github.com/repos/owner/repo/contents/file" :deletions 0
             :raw-url "https://github.com/owner/repo/raw/file"
             :previous-filename "src/old.cljs" :patch "@@ -1 +1 @@\n-c\n+d" :patch-state :available}]
           (get-in result [:native :files :items]))
        "Required native metadata and patch bytes are retained without fetching response URLs")
    (is (= 2 (get-in result [:native :files :total-count])))
    (is (= 2 (get-in result [:native :files :received])))
    (is (true? (get-in result [:native :files :patches-available?])))
    (is (= :unverified (get-in result [:native :files :patch-text-completeness])))
    (is (= 2 (count (filter #(.includes % "/pulls/7/files?") @seen-urls)))
        "The changed-file array is read during both snapshot passes")
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
  (let [result (await (run!event (assoc-in registry [:targets 0 :enabled?] true)
                                 (fake-native (fn [url body]
                                                (if (.endsWith url "/actions/runs/99")
                                                  (assoc body :pull_requests [{:number 7
                                                                               :base {:sha (:base native-shas)}
                                                                               :head {:sha (:head native-shas)}}])
                                                  body)))
                                 100 :workflow-run))]
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

(defn ^:async github-link-pagination-control [done]
  (let [registry (-> registry
                     (assoc-in [:targets 0 :enabled?] true)
                     (assoc-in [:targets 0 :producer :required-jobs] ["producer" "second"]))
        base (fake-native (fn [_ body] body))
        requested (atom [])
        transport
        (fn [{:keys [url] :as request}]
          (swap! requested conj url)
          (let [response (base request)]
            (cond
              (.endsWith url "/jobs?per_page=2&page=1")
              (assoc response :data (assoc (:data response) :total_count 2)
                     :next-url "https://api.github.com/repositories/41/actions/runs/99/attempts/2/jobs?page=2&per_page=2")
              (.endsWith url "/jobs?per_page=2&page=2")
              (assoc response :data {:total_count 2
                                     :jobs [{:id 102 :run_id 99 :run_attempt 2 :name "second"
                                             :status "completed" :conclusion "success"}]})
              (.endsWith url "/artifacts?per_page=2&page=1")
              (assoc response :data (assoc (:data response) :total_count 2)
                     :next-url "https://api.github.com/repositories/41/actions/runs/99/artifacts?page=2&per_page=2")
              (.endsWith url "/artifacts?per_page=2&page=2")
              (assoc response :data {:total_count 2
                                     :artifacts [{:id 202 :name "second" :size_in_bytes 10 :expired false
                                                  :digest (str "sha256:" (apply str (repeat 64 "e")))
                                                  :created_at "2026-10-20T00:00:00Z" :expires_at future-time
                                                  :workflow_run {:id 99 :head_sha (:head native-shas)}}]})
              :else response)))]
    (try
      (let [result (await (run!test registry transport 2))]
        (is (= :pending (:status result)) "Both native pages are observations, not publication approval")
        (is (= true (get-in result [:native :run :jobs :complete?])))
        (is (= true (get-in result [:native :run :artifacts :complete?])))
        (is (= 2 (get-in result [:native :run :jobs :pages])))
        (is (= 2 (get-in result [:native :run :artifacts :pages])))
        (is (= 32 (count @requested)) "Two full snapshots reconstruct every local request")
        (is (not-any? #(clojure.string/includes? % "/repositories/41/") @requested)
            "Supplied Link URLs are validated as metadata and never fetched")
        (is (every? #(and (clojure.string/includes? % "?per_page=2&page=")
                          (clojure.string/includes? % "/repos/owner/repo/"))
                    (filter #(clojure.string/includes? % "?per_page=") @requested))
            "Requests use the local canonical route and query construction"))
      (catch :default e (is false (str e)))
      (finally (done)))))
(deftest github-link-pagination-normalizes-route-and-query-order
  (async done (github-link-pagination-control done)))

(defn ^:async pull-file-pagination-control [done]
  (let [base (fake-native (fn [_ body] body))
        transport (fn [{:keys [url] :as request}]
                    (let [response (base request)]
                      (if (.includes url "/pulls/7/files?")
                        (let [rows (:data response)]
                          (if (.endsWith url "page=1")
                            (assoc response :data [(first rows)]
                                   :next-url "https://api.github.com/repositories/41/pulls/7/files?page=2&per_page=1")
                            (assoc response :data [(second rows)])))
                        response)))
        result (await (run!test (assoc-in registry [:targets 0 :enabled?] true) transport 1))]
    (is (= :pending (:status result)))
    (is (= 2 (get-in result [:native :files :pages])))
    (is (= 2 (get-in result [:native :files :received])))
    (is (= ["src/a.cljs" "src/b.cljs"] (mapv :filename (get-in result [:native :files :items]))))
    (is (law/pagination-link? (host/decode-pagination-link
                               "https://api.github.com/repositories/41/pulls/7/files?page=2&per_page=1")
                              41 "https://api.github.com/repos/owner/repo/pulls/7/files" 1 1)
        "Numeric repository routes preserve the exact PR-files suffix")
    (done)))
(deftest pull-files-collect-through-numeric-repository-link-pages
  (async done (pull-file-pagination-control done)))

(defn ^:async absent-patch-control [done]
  (let [base (fake-native (fn [_ body] body))
        transport (fn [{:keys [url] :as request}]
                    (let [response (base request)]
                      (if (.includes url "/pulls/7/files?")
                        (update response :data (fn [rows] (mapv #(case (:filename %)
                                                                  "src/a.cljs" (dissoc % :patch)
                                                                  "src/b.cljs" (assoc % :patch nil)
                                                                  %) rows)))
                        response)))
        result (await (run!test (assoc-in registry [:targets 0 :enabled?] true) transport))
        files (get-in result [:native :files :items])
        file (first files)]
    (is (= :pending (:status result)) "Missing patches stay an incomplete observation, not qualification")
    (is (false? (get-in result [:native :files :patches-available?])))
    (is (= :unverified (get-in result [:native :files :patch-text-completeness])))
    (is (= :missing (:patch-state file)))
    (is (not (contains? file :patch)) "An absent native patch is never fabricated as empty text")
    (is (= :null (:patch-state (second files))))
    (is (not (contains? (second files) :patch)) "A native null patch stays absent from semantic data")
    (is (= [{:reason :patch-unavailable :files [{:filename "src/a.cljs" :patch-state :missing}
                                                 {:filename "src/b.cljs" :patch-state :null}]}]
           (get-in result [:native :files :unsupported])))
    (done)))
(deftest unavailable-native-patch-remains-explicitly-unsupported
  (async done (absent-patch-control done)))

(defn ^:async changed-files-drift-control [done]
  (let [calls (atom 0)
        base (fake-native (fn [_ body] body))
        transport (fn [{:keys [url] :as request}]
                    (let [response (base request)]
                      (if (.includes url "/pulls/7/files?")
                        (update response :data (fn [rows]
                                                 (if (= 1 (swap! calls inc)) rows
                                                     (mapv #(update % :patch str "\nchanged") rows))))
                        response)))
        result (await (run!test (assoc-in registry [:targets 0 :enabled?] true) transport))]
    (is (= :refused (:status result)))
    (is (= :snapshot-drift (:reason result)))
    (is (= 2 @calls) "The exact PR-file list and patch bytes must agree across passes")
    (done)))
(deftest changed-file-patch-drift-between-source-passes-refuses
  (async done (changed-files-drift-control done)))

(defn ^:async changed-count-drift-control [done]
  (let [pull-reads (atom 0)
        base (fake-native (fn [_ body] body))
        transport (fn [{:keys [url] :as request}]
                    (let [response (base request)]
                      (cond
                        (.endsWith url "/pulls/7")
                        (let [read-number (swap! pull-reads inc)]
                          (if (= read-number 2) (update response :data assoc :changed_files 1) response))
                        (.includes url "/pulls/7/files?")
                        (if (= 2 @pull-reads) (update response :data #(subvec % 0 1)) response)
                        :else response)))
        result (await (run!test (assoc-in registry [:targets 0 :enabled?] true) transport))]
    (is (= :refused (:status result)))
    (is (= :snapshot-drift (:reason result)))
    (is (= 2 @pull-reads) "Each observed changed_files count must agree with its complete native file array")
    (done)))
(deftest changed-count-drift-between-native-passes-refuses
  (async done (changed-count-drift-control done)))

(defn ^:async empty-pull-files-control [done]
  (let [base (fake-native (fn [_ body] body))
        transport (fn [{:keys [url] :as request}]
                    (let [response (base request)]
                      (cond
                        (.endsWith url "/pulls/7") (update response :data assoc :changed_files 0)
                        (.includes url "/pulls/7/files?") (assoc response :data [])
                        :else response)))
        result (await (run!test (assoc-in registry [:targets 0 :enabled?] true) transport))]
    (is (= :pending (:status result)))
    (is (true? (get-in result [:native :files :complete?])))
    (is (= [] (get-in result [:native :files :items])))
    (is (= 0 (get-in result [:native :files :received])))
    (is (true? (get-in result [:native :files :patches-available?])))
    (done)))
(deftest zero-changed-files-is-a-complete-empty-array-observation
  (async done (empty-pull-files-control done)))

(defn ^:async oversized-pull-file-page-control [done]
  (let [base (fake-native (fn [_ body] body))
        result (await (run!test (assoc-in registry [:targets 0 :enabled?] true)
                                (fn [request]
                                  (let [response (base request)]
                                    (if (.includes (:url request) "/pulls/7/files?")
                                      (assoc response :data (vec (concat (:data response) (:data response))))
                                      response))) 1))]
    (is (= :refused (:status result)))
    (is (= :pull-files-shape (:reason result)))
    (done)))
(deftest pull-files-refuse-array-pages-larger-than-requested-size
  (async done (oversized-pull-file-page-control done)))

(deftest pull-file-law-enforces-count-identity-status-and-rename-shape
  (is (law/changed-file-count? 0))
  (is (law/changed-file-count? 3000))
  (is (not (law/changed-file-count? 3001)))
  (let [valid (raw-pull-file "a" "modified" {:patch ""})]
    (is (law/unique-pull-files? [valid] 1))
    (is (not (law/unique-pull-files? [valid (assoc valid :status "added")] 2)))
    (is (not (law/raw-pull-file? (dissoc valid :sha))))
    (is (not (law/raw-pull-file? (dissoc valid :filename))))
    (is (not (law/raw-pull-file? (dissoc valid :status))))
    (is (not (law/raw-pull-file? (dissoc valid :additions))))
    (is (not (law/raw-pull-file? (dissoc valid :blob_url))))
    (is (not (law/raw-pull-file? (dissoc valid :changes))))
    (is (not (law/raw-pull-file? (dissoc valid :contents_url))))
    (is (not (law/raw-pull-file? (dissoc valid :deletions))))
    (is (not (law/raw-pull-file? (dissoc valid :raw_url))))
    (is (not (law/raw-pull-file? (assoc valid :sha "bad"))))
    (is (law/raw-pull-file? (assoc valid :sha (apply str (repeat 64 "b"))))
        "Both SHA-1 and SHA-256 blob object IDs are accepted")
    (is (not (law/raw-pull-file? (assoc valid :additions -1))))
    (is (not (law/raw-pull-file? (assoc valid :changes "2"))))
    (is (not (law/raw-pull-file? (assoc valid :deletions -1))))
    (is (not (law/raw-pull-file? (assoc valid :blob_url " "))))
    (is (not (law/raw-pull-file? (assoc valid :contents_url nil))))
    (is (not (law/raw-pull-file? (assoc valid :raw_url ""))))
    (is (not (law/raw-pull-file? (assoc valid :status "unrecognized"))))
    (is (not (law/raw-pull-file? (assoc valid :filename " "))))
    (is (law/raw-pull-file? (assoc valid :changes 99)) "No arithmetic relationship is imposed")
    (is (law/raw-pull-file? (raw-pull-file "a" "renamed" {:patch "x"})))
    (is (not (law/raw-pull-file? (assoc valid :previous_filename "a"))))
    (is (law/raw-pull-file? (raw-pull-file "a" "copied" {:patch "x"})))
    (is (law/raw-pull-file? (assoc valid :status "changed")))
    (is (law/raw-pull-file? (assoc valid :status "unchanged")))
    (is (law/raw-pull-file? (assoc valid :previous_filename "b")))
    (is (not (law/raw-pull-file? (assoc valid :previous_filename ""))))
    (is (not (law/raw-pull-file? (assoc valid :previous_filename nil)))))
  (is (law/pagination-link? (host/decode-pagination-link
                             "https://api.github.com/repositories/41/pulls/7/files?page=2&per_page=1")
                            41 "https://api.github.com/repos/owner/repo/pulls/7/files" 1 1))
  (is (not (law/pagination-link? (host/decode-pagination-link
                                  "https://api.github.com/repositories/41/pulls/8/files?page=2&per_page=1")
                                 41 "https://api.github.com/repos/owner/repo/pulls/7/files" 1 1))))

(deftest production-get-decodes-link-header-before-collection
  (let [directory (.mkdtempSync fs (.join path (.tmpdir os) "eta-collection-link-header-"))
        preload (.join path directory "fetch-preload.mjs")
        runner (.join path directory "host-probe.cljs")
        target "https://api.github.com/repos/owner/repo/actions/runs/99/attempts/2/jobs?per_page=2&page=2"
        source-root (.resolve path (.dirname path (:file (meta #'host/get!))) "../..")
        classpath (str source-root ":" (.resolve path "packages/eta-mu/src/cljs"))
        preload-source (str "globalThis.__linkProbeCalls = [];\n"
                            "globalThis.fetch = async (input) => {\n"
                            "  const url = String(input); globalThis.__linkProbeCalls.push(url);\n"
                            "  const headers = new Headers();\n"
                            "  if (url.endsWith('page=1')) headers.set('Link', '<" target
                            ">; rel=\"next\", <https://api.github.com/repos/owner/repo/actions/runs/99/attempts/2/jobs?per_page=2&page=4>; rel=\"last\"');\n"
                            "  if (url.endsWith('page=4')) headers.set('Link', '<unterminated; rel=\"next\"');\n"
                            "  const response = new Response('{\"jobs\":[]}', {status: 200, headers});\n"
                            "  Object.defineProperty(response, 'url', {value: url}); return response;\n"
                            "};\n")
        runner-source (str "(ns link-header-host-probe (:require [nbb.core :as nbb] [eta-mu.extern.review-collection :as host]))\n"
                           "(defn ^:async run []\n"
                           "  (let [linked (await (host/get! {:method :get :url \"https://api.github.com/repos/owner/repo/actions/runs/99/attempts/2/jobs?per_page=2&page=1\" :timeout-ms 2000 :max-bytes 1024}))\n"
                           "        absent (await (host/get! {:method :get :url \"https://api.github.com/repos/owner/repo/actions/runs/99/attempts/2/jobs?per_page=2&page=3\" :timeout-ms 2000 :max-bytes 1024}))\n"
                           "        malformed (try (await (host/get! {:method :get :url \"https://api.github.com/repos/owner/repo/actions/runs/99/attempts/2/jobs?per_page=2&page=4\" :timeout-ms 2000 :max-bytes 1024})) (catch :default e {:error (:code (ex-data e))}))]\n"
                           "    (println (pr-str {:link-status (:status linked) :next-url (:next-url linked) :no-link-status (:status absent) :no-next-url (:next-url absent) :malformed-error (:error malformed) :calls (.join (.-__linkProbeCalls js/globalThis) \"|\")}))))\n"
                           "(nbb/await (run))\n")]
    (try
      (.writeFileSync fs preload preload-source)
      (.writeFileSync fs runner runner-source)
      (let [result (.spawnSync cp "packages/eta-mu/node_modules/.bin/nbb"
                               #js ["-cp" classpath runner]
                               #js {:cwd (.cwd js/process) :encoding "utf8" :timeout 15000
                                    :maxBuffer 100000
                                    :env #js {:PATH (aget (.-env js/process) "PATH")
                                              :HOME directory
                                              :NODE_OPTIONS (str "--import=" preload)}})
            stdout (.-stdout result) stderr (.-stderr result)]
        (is (= 0 (.-status result)) (str stdout stderr))
        (is (str/includes? stdout target) "The actual host transport returns the parsed next Link URL")
        (is (str/includes? stdout ":no-next-url nil") "A response without Link remains a terminal page")
        (is (str/includes? stdout ":malformed-error :pagination-link")
            "A malformed declared next relation is refused by the actual host transport")
        (is (= (str/join "|" (map #(str "https://api.github.com/repos/owner/repo/actions/runs/99/attempts/2/jobs?per_page=2&page=" %)
                                  [1 3 4]))
               (:calls (reader/read-string stdout)))
            "Only the three local GET requests were issued"))
      (finally (.rmSync fs directory #js {:recursive true :force true})))))

(defn ^:async malformed-link-with-complete-total-control [done]
  (let [result (await
                (run!test (assoc-in registry [:targets 0 :enabled?] true)
                         (fn [{:keys [url] :as request}]
                           (let [response ((fake-native (fn [_ body] body)) request)]
                             (if (.endsWith url "/jobs?per_page=100&page=1")
                               (assoc response :data (assoc (:data response) :total_count 1)
                                      :next-url "not-an-absolute-pagination-url")
                               response)))))]
    (is (= :refused (:status result)) "An invalid present Link cannot be interpreted as end-of-pages")
    (is (some? (:reason result)))
    (done)))
(deftest malformed-present-link-cannot-be-treated-as-terminal
  (async done (malformed-link-with-complete-total-control done)))

(defn ^:async rejected-link-control [done link]
  (let [result (await
                (run!test (assoc-in registry [:targets 0 :enabled?] true)
                         (fn [{:keys [url]}]
                           (let [response ((fake-native (fn [_ body] body)) {:url url})]
                             (if (.endsWith url "/jobs?per_page=100&page=1")
                               (assoc response :data (assoc (:data response) :total_count 2)
                                      :next-url link)
                               response)))))]
    (is (= :refused (:status result)))
    (is (some? (:reason result)) "Malformed or foreign links fail closed")
    (is (not-any? #(= link (:url %)) (:native-reads result))
        "A supplied pagination URL is never used as a request")
    (done)))
(deftest github-link-rejects-foreign-host-wrong-repository-and-route
  (async done
    (let [links ["https://evil.invalid/repositories/41/actions/runs/99/attempts/2/jobs?page=2&per_page=100"
                 "https://api.github.com/repositories/42/actions/runs/99/attempts/2/jobs?page=2&per_page=100"
                 "https://api.github.com/repositories/41/actions/runs/100/attempts/2/jobs?page=2&per_page=100"
                 "https://api.github.com/repositories/41/actions/runs/99/attempts/2/artifacts?page=2&per_page=100"
                 "https://api.github.com/repositories/41/actions/runs/99/attempts/2/jobs?page=2&per_page=100&x=1"
                 "https://api.github.com/repositories/41/actions/runs/99/attempts/2/jobs?page=2&page=2&per_page=100"
                 "https://api.github.com/repositories/41/actions/runs/99/attempts/2/jobs?page=2"
                 "https://api.github.com/repositories/41/actions/runs/99/attempts/2/jobs?page=3&per_page=100"
                 "https://user@api.github.com/repositories/41/actions/runs/99/attempts/2/jobs?page=2&per_page=100"
                 "https://api.github.com/repositories/41/actions/runs/99/attempts/2/jobs?page=2&per_page=100#fragment"
                 "http://api.github.com/repositories/41/actions/runs/99/attempts/2/jobs?page=2&per_page=100"]]
      (letfn [(step [remaining]
                (if-let [link (first remaining)]
                  (rejected-link-control (fn [] (step (next remaining))) link)
                  (done)))]
        (step links)))))

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
            (fn [url body] (if (.endsWith url "/actions/runs/99") (assoc body :event "workflow_dispatch") body))
            :run-association]
           [:workflow-run-producer-event
            (fn [url body] (if (.endsWith url "/actions/runs/99") (assoc body :event "workflow_run") body))
            :run-association]
           [:mismatched-attempt-event
            (fn [url body] (if (.endsWith url "/attempts/2") (assoc body :event "workflow_run") body))
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

(defn attempt-status-transport [status conclusion]
  (fake-native
   (fn [url body]
     (cond
       (.endsWith url "/actions/runs/99")
       (assoc body :pull_requests [{:number 7
                                    :base {:sha (:base native-shas)}
                                    :head {:sha (:head native-shas)}}])
       (.endsWith url "/actions/runs/99/attempts/2")
       (assoc body :status status :conclusion conclusion)
       :else body))))

(defn ^:async attempt-summary-mismatch-control [done status conclusion]
  (let [result (await (run!test (assoc-in registry [:targets 0 :enabled?] true)
                                (attempt-status-transport status conclusion)))]
    (is (= :refused (:status result)) (pr-str result))
    (is (= :run-association (:reason result)) (pr-str result))
    (is (= [] (:effects result)))
    (done)))
(deftest completed-failure-attempt-cannot-match-successful-summary
  (async done (attempt-summary-mismatch-control done "completed" "failure")))
(deftest active-attempt-cannot-match-completed-success-summary
  (async done (attempt-summary-mismatch-control done "in_progress" nil)))

(defn producer-event-transport [producer-event]
  (fake-native
   (fn [url body]
     (cond
       (.endsWith url "/actions/runs/99")
       (assoc body :event producer-event
              :pull_requests [{:number 7 :base {:sha (:base native-shas)} :head {:sha (:head native-shas)}}])
       (.endsWith url "/actions/runs/99/attempts/2")
       (assoc body :event producer-event)
       :else body))))

(defn ^:async unsupported-producer-event-control [done collector-event producer-event]
  (let [result (await (run!event (assoc-in registry [:targets 0 :enabled?] true)
                                 (producer-event-transport producer-event) 100 collector-event))]
    (is (= :refused (:status result)) (pr-str result))
    (is (= :run-association (:reason result)) (pr-str result))
    (is (= [] (:effects result)))
    (done)))
(deftest schedule-producer-run-is-outside-supported-event-source
  (async done (unsupported-producer-event-control done :schedule "schedule")))
(deftest workflow-run-producer-run-is-outside-supported-event-source
  (async done (unsupported-producer-event-control done :workflow-run "workflow_run")))

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
