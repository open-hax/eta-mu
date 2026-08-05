(ns rheos.backend.infra.github-issues-test
  (:require [cljs.test :refer [deftest is testing]]
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
    (testing "manually closed active issue stays closed"
      (is (= "closed" (:state (first (:operations manual-plan)))))))

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
