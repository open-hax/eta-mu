(ns rheos.backend.infra.github-issues-test
  (:require [clojure.string :as str]
            [cljs.test :refer [deftest is testing]]
            [rheos.backend.infra.github-issues :as github]))

(defn- task
  ([uuid status]
   (task uuid status (str "Task " uuid)))
  ([uuid status title]
   {:uuid uuid
    :title title
    :slug uuid
    :status status
    :priority "P1"
    :labels ["sync"]
    :created-at "2026-08-05T00:00:00.000Z"
    :content (str "# " title "\n\nBody")
    :source-path (str "/repo/kanban/tasks/" uuid ".md")}))

(defn- issue-for [number task state previous-status]
  {:number number
   :title (:title task)
   :body (github/build-issue-body (assoc task :status previous-status) "/repo")
   :state state
   :labels (github/desired-labels (assoc task :status previous-status))})

(deftest creates-open-issue-from-canonical-task
  (let [plan (github/plan-sync [(task "a" "incoming")]
                               {:labels [] :issues []}
                               {:cwd "/repo"})]
    (is (= 4 (get-in plan [:summary :create-labels])))
    (is (= 1 (get-in plan [:summary :create-issues])))
    (is (= :create-issue (:type (last (:operations plan)))))
    (is (= ["kanban" "status:incoming" "priority:P1" "sync"]
           (:labels (last (:operations plan)))))))

(deftest closes-done-task-as-completed
  (let [t (task "a" "done")
        existing (issue-for 7 t "open" "review")
        plan (github/plan-sync [t]
                               {:labels (mapv (fn [name] {:name name}) (github/desired-labels t))
                                :issues [existing]}
                               {:cwd "/repo"})
        op (first (:operations plan))]
    (is (= :update-issue (:type op)))
    (is (= "closed" (:state op)))
    (is (= "completed" (:state-reason op)))))

(deftest reopens-only-managed-reactivation
  (let [t (task "a" "incoming")
        managed-closed (issue-for 7 t "closed" "done")
        manual-closed (issue-for 8 t "closed" "incoming")
        managed-plan (github/plan-sync [t]
                                       {:labels (mapv (fn [name] {:name name}) (github/desired-labels t))
                                        :issues [managed-closed]}
                                       {:cwd "/repo"})
        manual-plan (github/plan-sync [t]
                                      {:labels (mapv (fn [name] {:name name}) (github/desired-labels t))
                                       :issues [manual-closed]}
                                      {:cwd "/repo"})]
    (testing "done -> incoming reopens"
      (is (= "open" (:state (first (:operations managed-plan))))))
    (testing "manually closed active issue stays closed without a synthetic update"
      (is (empty? (:operations manual-plan))))))

(deftest skips-new-closed-tasks
  (let [plan (github/plan-sync [(task "a" "done")]
                               {:labels [] :issues []}
                               {:cwd "/repo"})]
    (is (= 1 (get-in plan [:summary :skipped-closed-tasks])))
    (is (zero? (get-in plan [:summary :create-issues])))))

(deftest excludes-metadata-markdown
  (let [readme (assoc (task "readme" "incoming")
                      :source-path "/repo/kanban/README.md")
        plan (github/plan-sync [readme] {:labels [] :issues []} {:cwd "/repo"})]
    (is (= 1 (get-in plan [:summary :excluded-tasks])))
    (is (empty? (:operations plan)))))

(deftest rejects-duplicate-task-uuids
  (is (thrown-with-msg? js/Error #"Duplicate Rheos task UUID"
                        (github/plan-sync [(task "a" "incoming")
                                           (assoc (task "a" "todo")
                                                  :source-path "/repo/kanban/tasks/other.md")]
                                          {:labels [] :issues []}
                                          {:cwd "/repo"}))))

(deftest reconciles-only-projector-owned-labels-with-delta-requests
  (let [current (assoc (task "a" "review") :labels ["domain:new"])
        previous (assoc current :status "incoming" :labels ["domain:old"])
        issue {:number 7
               :title (:title current)
               :body (github/build-issue-body previous "/repo")
               :state "open"
               :labels ["kanban"
                        "status:incoming"
                        "priority:P1"
                        "domain:old"
                        "human-context"
                        "eta-mu:review"
                        "deploy"]}
        repo-labels (->> (concat (github/desired-labels current) ["domain:old"])
                         distinct
                         (mapv (fn [name] {:name name})))
        plan (github/plan-sync [current]
                               {:labels repo-labels :issues [issue]}
                               {:cwd "/repo"})
        operation (first (:operations plan))
        requests (github/operation-requests "open-hax/eta-mu" operation)
        patch-request (first (filter #(= "PATCH" (:method %)) requests))]
    (is (= :update-issue (:type operation)))
    (is (= ["status:review" "domain:new"] (:add-labels operation)))
    (is (= ["status:incoming" "domain:old"] (:remove-labels operation)))
    (is (= 4 (:write-count operation)))
    (is (not (contains? operation :labels)))
    (is (= ["POST" "DELETE" "DELETE" "PATCH"] (mapv :method requests)))
    (is (= {:labels ["status:review" "domain:new"]}
           (:body (first requests))))
    (is (not (contains? (:body patch-request) :labels)))
    (is (= "PATCH" (:method (last requests))))
    (is (some #(str/ends-with? (:url %) "/labels/status%3Aincoming") requests))
    (is (some #(str/ends-with? (:url %) "/labels/domain%3Aold") requests))))

(deftest partial-label-reconciliation-remains-recoverable-until-body-patch
  (let [current (assoc (task "a" "review") :labels ["domain:new"])
        previous (assoc current :status "incoming" :labels ["domain:old"])
        previous-body (github/build-issue-body previous "/repo")
        repo-labels (->> (concat (github/desired-labels current) ["domain:old"])
                         distinct
                         (mapv (fn [name] {:name name})))
        plan-after-add (github/plan-sync
                        [current]
                        {:labels repo-labels
                         :issues [{:number 7
                                   :title (:title current)
                                   :body previous-body
                                   :state "open"
                                   :labels ["kanban" "status:incoming" "status:review"
                                            "priority:P1" "domain:old" "domain:new"]}]}
                        {:cwd "/repo"})
        retry-after-add (first (:operations plan-after-add))
        plan-after-deletes (github/plan-sync
                            [current]
                            {:labels repo-labels
                             :issues [{:number 7
                                       :title (:title current)
                                       :body previous-body
                                       :state "open"
                                       :labels (github/desired-labels current)}]}
                            {:cwd "/repo"})
        retry-after-deletes (first (:operations plan-after-deletes))]
    (testing "a failure after additive writes still retries named stale-label deletes"
      (is (empty? (:add-labels retry-after-add)))
      (is (= ["status:incoming" "domain:old"] (:remove-labels retry-after-add)))
      (is (= "PATCH" (:method (last (github/operation-requests
                                      "open-hax/eta-mu"
                                      retry-after-add))))))
    (testing "a failure after deletes retries only the still-stale managed body"
      (is (empty? (:add-labels retry-after-deletes)))
      (is (empty? (:remove-labels retry-after-deletes)))
      (is (= ["PATCH"]
             (mapv :method
                   (github/operation-requests "open-hax/eta-mu"
                                              retry-after-deletes)))))))

(deftest real-board-reserved-deploy-task-label-is-safe
  (let [deploy-task (assoc (task "ci-main-gate-after-services-removal" "done")
                           :labels ["tasks" "ci" "deploy" "monorepo" "blocker"])
        desired (github/desired-labels deploy-task)
        current-issue (assoc (issue-for 9 deploy-task "closed" "done")
                             :state-reason "completed"
                             :labels (conj desired "deploy"))
        plan (github/plan-sync [deploy-task]
                               {:labels (mapv (fn [name] {:name name})
                                              (conj desired "deploy"))
                                :issues [current-issue]}
                               {:cwd "/repo"})]
    (is (= ["kanban" "status:done" "priority:P1"
            "tasks" "ci" "monorepo" "blocker"]
           desired))
    (is (empty? (:operations plan)))))

(deftest write-budget-never-slices-a-logical-issue-reconciliation
  (let [first-operation {:type :update-issue :issue-number 1 :write-count 2}
        second-operation {:type :update-issue :issue-number 2 :write-count 3}
        selection (github/select-operations-within-write-budget
                   [first-operation second-operation]
                   4)]
    (is (= [first-operation] (:selected selection)))
    (is (= [second-operation] (:deferred selection)))
    (is (= 2 (:selected-writes selection)))
    (is (= 3 (:deferred-writes selection)))))

(deftest undersized-write-budget-refuses-all-writes-instead-of-starving
  (let [stale-labels (mapv #(str "domain:stale-" %) (range 51))
        current (assoc (task "large-label-delta" "review")
                       :labels ["domain:new"])
        previous (assoc current :labels stale-labels)
        issue {:number 77
               :title (:title current)
               :body (github/build-issue-body previous "/repo")
               :state "open"
               :labels (vec (concat ["kanban" "status:review" "priority:P1"]
                                    stale-labels))}
        repo-labels (->> (concat (github/desired-labels current) stale-labels)
                         distinct
                         (mapv (fn [name] {:name name})))
        oversized-operation (-> (github/plan-sync [current]
                                                    {:labels repo-labels
                                                     :issues [issue]}
                                                    {:cwd "/repo"})
                                :operations
                                first)
        prefix-operation {:type :create-label
                          :name "unrelated"
                          :write-count 1}
        applied (atom [])
        error (try
                (let [selection (github/select-operations-within-write-budget
                                 [prefix-operation oversized-operation]
                                 50)]
                  (doseq [operation (:selected selection)]
                    (swap! applied conj operation))
                  nil)
                (catch :default cause cause))]
    (is (= 53 (:write-count oversized-operation))
        "one add, 51 named deletes, and the managed-body patch stay one operation")
    (is (some? error))
    (is (re-find #"issue #77 requires 53 API writes" (.-message error)))
    (is (re-find #"--max-writes is 50" (.-message error)))
    (is (re-find #"Increase --max-writes to at least 53" (.-message error)))
    (is (empty? @applied)
        "the complete plan is rejected before even a fitting prefix operation can write")))
