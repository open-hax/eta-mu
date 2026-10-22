;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.infra.review-collection
  "Bounded read-only collection of native GitHub metadata; never publication proof."
  (:require [eta-mu.law.review-collection :as law]
            [eta-mu.law.review-publication :as publication]
            [eta-mu.shape.review-collection :as shape]
            [eta-mu.domain.review-collection :as domain]
            [eta-mu.extern.review-collection :as host]
            [clojure.string :as str]))

(defn- refused [reason] {:status :refused :reason reason :effects []})
(defn- status-code [e] (or (:code (ex-data e)) :native-read))

(defn ^:async read-one! [transport bounds start state url]
  (let [{:keys [requests pages bytes]} @state
        page-request? (str/includes? url "?per_page=")
        remaining (int (- (:operation-ms bounds) (- (host/monotonic-now) start)))]
    (when (or (>= requests (:requests bounds)) (and page-request? (>= pages (:pages bounds)))
              (not (publication/positive? remaining)) (>= bytes (:bytes bounds)))
      (throw (ex-info "Native read budget exhausted" {:code :overbudget})))
    (let [request {:method :get :url url :timeout-ms (min 5000 remaining)
                   :max-bytes (min 1000000 (- (:bytes bounds) bytes))}
          _ (when-not (law/request? request)
              (throw (ex-info "Native request is outside the fixed API" {:code :request :url url})))
          _ (swap! state #(-> % (update :requests inc)
                              (update :request-log conj (select-keys request [:method :url :timeout-ms :max-bytes]))))
          response (await (transport request))
          response-bytes (:bytes response)]
      (when-not (= :ok (:status response))
        (throw (ex-info "Native read unavailable" {:code (or (:reason response) :native-read)})))
      (when (or (not (publication/positive? response-bytes))
                (> (+ bytes response-bytes) (:bytes bounds))
                (>= (- (host/monotonic-now) start) (:operation-ms bounds)))
        (throw (ex-info "Native response exceeds bound" {:code :overbudget})))
      (swap! state #(-> % (cond-> page-request? (update :pages inc))
                        (update :bytes + response-bytes)))
      (select-keys response [:data :next-url]))))

(defn- make-reader [transport bounds start]
  (let [state (atom {:requests 0 :request-log [] :pages 0 :bytes 0})]
    {:state state :get (partial read-one! transport bounds start state)}))

(defn- ^:async pages! [read url field bounds repository-id]
  (loop [page 1 result [] expected-total nil]
    (let [page-url (str url "?per_page=" (:page-size bounds) "&page=" page)
          response (await (read page-url))
          data (:data response)
          rows (get data field)
          total-count (:total_count data)
          next-url (:next-url response)
          next-link (when (some? next-url) (host/decode-pagination-link next-url))]
      (when-not (and (vector? rows) (publication/natural? total-count)
                     (or (nil? expected-total) (= expected-total total-count)))
        (throw (ex-info "Native page shape or total count" {:code :native-shape})))
      (let [all (into result rows)]
        (when-not (and (every? #(publication/positive? (:id %)) all)
                       (= (count all) (count (distinct (map :id all)))))
          (throw (ex-info "Native pagination repeated or omitted an ID" {:code :pagination-identity})))
        (if (some? next-url)
          (if (law/pagination-link? next-link repository-id url page (:page-size bounds))
            (recur (inc page) all total-count)
            (throw (ex-info "Native pagination link mismatch" {:code :pagination})))
          (if (= total-count (count all))
            {:items all :complete? true :pages page :received page :next? false :total-count total-count}
            (throw (ex-info "Native pagination truncated" {:code :pagination-truncated}))))))))

(defn- ^:async tuple! [read entry n]
  (let [name (get-in entry [:repository :full-name])
        repository (-> (await (read (str "https://api.github.com/repos/" name))) :data)
        pr (-> (await (read (str "https://api.github.com/repos/" name "/pulls/" n))) :data)
        repo (get-in pr [:base :repo])
        head-repo (get-in pr [:head :repo])
        base-ref (get-in pr [:base :ref])
        _ (when-not (and (string? base-ref) (re-matches #"[A-Za-z0-9._/-]+" base-ref)
                         (not (str/includes? base-ref "..")))
            (throw (ex-info "Unusable base ref" {:code :ref})))
        live-base (-> (await (read (str "https://api.github.com/repos/" name "/git/ref/heads/" base-ref))) :data)
        base (:sha (:object live-base)) head (get-in pr [:head :sha])
        merge-ref (-> (await (read (str "https://api.github.com/repos/" name "/git/ref/pull/" n "/merge"))) :data)
        merge (:sha (:object merge-ref))
        base-commit (-> (await (read (str "https://api.github.com/repos/" name "/commits/" base))) :data)
        head-commit (-> (await (read (str "https://api.github.com/repos/" name "/commits/" head))) :data)
        merge-commit (-> (await (read (str "https://api.github.com/repos/" name "/commits/" merge))) :data)
        ancestry (-> (await (read (str "https://api.github.com/repos/" name "/compare/" base "..." head))) :data)
        parents (mapv :sha (:parents merge-commit))]
    (when-not (and (= n (:number pr))
                   (law/raw-repository? repository) (law/raw-repository? repo) (law/raw-repository? head-repo)
                   (= (get-in entry [:repository :id]) (:id repository) (:id repo))
                   (= (get-in entry [:repository :full-name]) (:full_name repository) (:full_name repo))
                   (= (get-in entry [:repository :full-name]) (:full_name repo)))
      (throw (ex-info "PR repository mismatch" {:code :repository})))
    (when-not (and (= (get-in pr [:base :sha]) base)
                   (= (str "refs/heads/" base-ref) (:ref live-base))
                   (= "commit" (get-in live-base [:object :type]))
                   (= (str "refs/pull/" n "/merge") (:ref merge-ref))
                   (= "commit" (get-in merge-ref [:object :type]))
                   (publication/commit? (:sha (:object merge-ref)))
                   (= base (get-in merge-commit [:parents 0 :sha]))
                   (= head (get-in merge-commit [:parents 1 :sha]))
                   (= 2 (count parents))
                   (= base (:sha base-commit)) (= head (:sha head-commit)) (= merge (:sha merge-commit))
                   (publication/commit? (get-in head-commit [:commit :tree :sha]))
                   (publication/commit? (get-in base-commit [:commit :tree :sha]))
                   (publication/commit? (get-in merge-commit [:commit :tree :sha])))
      (throw (ex-info "Live base ref diverged from PR tuple" {:code :base-drift})))
    {:pr-number (:number pr) :state (keyword (:state pr)) :draft? (:draft pr)
     :base-sha base :head-sha head :event-sha nil
     :merge-sha merge :merge-parents parents :head-tree (get-in head-commit [:commit :tree :sha])
     :base-tree (get-in base-commit [:commit :tree :sha])
     :merge-tree (get-in merge-commit [:commit :tree :sha])
     :base-ancestor? (and (= base (get-in ancestry [:merge_base_commit :sha]))
                          (contains? #{"ahead" "identical"} (:status ancestry)))
     :mergeable? (case (:mergeable pr) true true false false nil :unknown :unknown)
     :native-repository (shape/repository repository)
     :raw {:repository repository :pull-request pr :base-ref live-base :merge-ref merge-ref
           :base-commit base-commit :head-commit head-commit :merge-commit merge-commit
           :ancestry ancestry}}))

(defn- ^:async run-and-artifacts! [read entry n run-id tuple bounds]
  (let [name (get-in entry [:repository :full-name])
        run (-> (await (read (str "https://api.github.com/repos/" name "/actions/runs/" run-id))) :data)
        workflow-id (or (:workflow_id run) (:workflow-id run))
        workflow (-> (await (read (str "https://api.github.com/repos/" name "/actions/workflows/" workflow-id))) :data)
        attempt-number (or (:run_attempt run) (:run-attempt run))
        attempt (-> (await (read (str "https://api.github.com/repos/" name "/actions/runs/" run-id
                                      "/attempts/" attempt-number))) :data)
        normalized-run (shape/run attempt workflow)
        pull-requests (:pull_requests run)
        pull (first (filter #(= n (:number %)) pull-requests))
        jobs (await (pages! read (str "https://api.github.com/repos/" name "/actions/runs/" run-id
                                       "/attempts/" attempt-number "/jobs") :jobs bounds
                              (get-in entry [:repository :id])))
        artifacts (await (pages! read (str "https://api.github.com/repos/" name "/actions/runs/" run-id "/artifacts") :artifacts bounds
                                   (get-in entry [:repository :id])))
        native-artifacts (:items artifacts)
        required (set (get-in entry [:producer :required-jobs]))
        job-rows (:items jobs)
        job-names (map :name job-rows)
        now (host/wall-now)
        selected (filter #(and (law/raw-artifact? %)
                               (false? (:expired %))
                               (> (host/parse-date-ms (:expires_at %)) now)) native-artifacts)
        normalized-artifacts
        (mapv (fn [artifact]
                (let [value (shape/artifact artifact run-id (host/parse-date-ms (:expires_at artifact)))]
                  (when-not value (throw (ex-info "Native artifact invalid" {:code :artifact})))
                  (assoc value :created-at (:created_at artifact)))) selected)]
    (when-not (and
                   (= (:id run) run-id) (= (get-in run [:repository :id]) (get-in entry [:repository :id]))
                   ;; Collector enrollment triggers (schedule/workflow_run) are distinct from
                   ;; the producer run event. This port supports direct pull_request runs only;
                   ;; workflow_call and other producer sources remain unsupported.
                   (= "pull_request" (:event run))
                   (= (:event attempt) (:event run))
                   (law/raw-repository? (:repository run))
                   (= (:head_sha run) (:head-sha tuple))
                   (= (:id attempt) run-id) (= (:run_attempt attempt) attempt-number)
                   (= (get-in attempt [:repository :id]) (get-in run [:repository :id]))
                   (= (:workflow_id attempt) workflow-id) (= (:head_sha attempt) (:head_sha run))
                   (law/raw-run? attempt)
                   (= workflow-id (get-in entry [:producer :id]))
                   (= workflow-id (:id workflow))
                   (= (:path workflow) (get-in entry [:producer :path]))
                   (= :completed (keyword (:status run))) (= :success (keyword (:conclusion run)))
                   (= (:status attempt) (:status run)) (= (:conclusion attempt) (:conclusion run))
                   (= "completed" (:status attempt)) (= "success" (:conclusion attempt))
                   (= (count job-rows) (count (distinct job-names)))
                   (= required (set job-names))
                   (every? #(and (law/raw-job? % run-id attempt-number)
                                 (= "completed" (:status %)) (= "success" (:conclusion %))) job-rows)
                   (= (count job-rows) (count (distinct (map :id job-rows))))
                   (= (count native-artifacts) (count (filter law/raw-artifact? native-artifacts)))
                   (every? #(and (= run-id (get-in % [:workflow_run :id]))
                                 (= (:head_sha attempt) (get-in % [:workflow_run :head_sha]))) native-artifacts)
                   (= (count selected) (count normalized-artifacts))
                   (or (empty? pull-requests)
                       (and (= 1 (count (filter #(= n (:number %)) pull-requests)))
                            (= (:base-sha tuple) (get-in pull [:base :sha]))
                            (= (:head-sha tuple) (get-in pull [:head :sha]))
                            (= (:head-sha tuple) (:head_sha run)))))
      (throw (ex-info "Run association mismatch" {:code :run-association})))
    (when (empty? normalized-artifacts)
      (throw (ex-info "No live artifact associated with run" {:code :artifact})))
    (when-not (and (= [(:base-sha tuple) (:head-sha tuple)] (:merge-parents tuple))
                   (= (:head-tree tuple) (:merge-tree tuple)) (:base-ancestor? tuple))
      (throw (ex-info "Integration commit mismatch" {:code :integration-tuple})))
    (when-not (and (publication/positive? (:attempt normalized-run))
                   (law/native-repository? (:native-repository tuple)))
      (throw (ex-info "Native run shape invalid" {:code :run-shape})))
    {:id (:id run) :attempt (:attempt normalized-run) :repository-id (:repository-id normalized-run)
     :workflow-id (:workflow-id normalized-run) :workflow-path (:workflow-path normalized-run)
     :head-sha (:head-sha normalized-run)
     :attempt-metadata {:run-id (:id attempt) :attempt-number attempt-number
                        :head-sha (:head_sha attempt) :raw attempt}
     :pull-requests pull-requests
     :pr-association (domain/run-association
                      {:pull-requests pull-requests :head-sha (:head_sha run)} n tuple)
     :event-sha nil :workflow-source-sha nil
     :pr-number n :status (keyword (:status run)) :conclusion (keyword (:conclusion run))
     :jobs {:items (:items jobs) :complete? (:complete? jobs) :pages (:pages jobs)}
     :artifacts {:items normalized-artifacts
                 :raw-items native-artifacts
                 :complete? (:complete? artifacts) :pages (:pages artifacts)}
     :workflow-source-custody :unverified
     :command-evidence :unverified
     :referenced-workflow-bytes :unverified
     :referenced-workflows (:referenced-workflows normalized-run)
     :run-metadata run}))

(defn- ^:async observation [read entry n run-id bounds]
  (let [tuple (await (tuple! read entry n))
        run (await (run-and-artifacts! read entry n run-id tuple bounds))]
    {:tuple tuple :run run :repository (:native-repository tuple)}))

(defn ^:async collect-with!
  "Testable collector over an inert transport. Transport outputs are fixture data,
  not authenticated provenance; only the production fixed GET port is native."
  [{:keys [registry target-id pr-number run-id bounds mode event fixture-id registry-provenance]} transport]
  (let [entry (law/registry-target registry target-id)
        enrollment (domain/enrollment registry target-id mode event fixture-id)]
    (cond
      (= :registry enrollment) (refused :registry)
      (= :target enrollment) (refused :enrollment)
      (not= :accepted enrollment) (refused :enrollment)
      (not (and (law/bounds? bounds) (publication/positive? pr-number) (publication/positive? run-id)))
      (refused :request)
      :else
      (let [start (host/monotonic-now)
            {:keys [get state]} (make-reader transport bounds start)]
        (try
          (let [first-pass (await (observation get entry pr-number run-id bounds))
                second-pass (await (observation get entry pr-number run-id bounds))]
            (if (not (domain/stable-observation? first-pass second-pass))
              (refused :snapshot-drift)
              {:status (if (or (= :pending (domain/tuple-decision (:tuple first-pass)))
                              (= :unknown (get-in first-pass [:run :pr-association]))) :pending :collected)
               :qualification :pending
               :reason (cond
                         (= :unknown (get-in first-pass [:run :pr-association])) :run-pr-association
                         (= :pending (domain/tuple-decision (:tuple first-pass))) :mergeability
                         (not= :accepted (domain/tuple-decision (:tuple first-pass)))
                         (domain/tuple-decision (:tuple first-pass))
                         :else :source-custody-incomplete)
               :observed-at-ms (host/wall-now) :native first-pass
               :snapshot-passes 2
              :completeness {:original-event-sha :unobserved :run-pr-association (get-in first-pass [:run :pr-association])
                              :registry-source-sha :unverified
                              :workflow-source-sha :unobserved :referenced-workflow-bytes :unverified
                              :verifier-input :unverified :commands :unverified :setup :not-collected
                              :private-token-scope :not-established}
              :registry-provenance registry-provenance
               :native-reads (:request-log @state)
               :budgets (dissoc @state :request-log) :effects []}))
          (catch :default e (assoc (refused (status-code e))
                                   :native-reads (:request-log @state)
                                   :budgets (dissoc @state :request-log))))))))

(defn ^:async production-read! [request]
  (await (host/get! request)))

(defn ^:async collect!
  "Production entry: read the fixed accepted registry path then issue fixed GETs."
  [request]
  (let [{:keys [registry status reason bytes sha256]} (host/read-registry!)]
    (if (= :refused status)
      (refused reason)
      (await (collect-with! (assoc request :registry registry
                                    :registry-provenance {:source-file-bytes bytes
                                                          :source-file-sha256 sha256
                                                          :declared-source-sha (:source-sha registry)
                                                          :adoption :unverified})
                            production-read!)))))
