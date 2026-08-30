(ns rheos.backend.domain.task-create-metadata-test
  (:require [cljs.test :refer [deftest is testing]]
            [rheos.backend.domain.task-create :as task-create]))

(deftest frontmatter-pairs-carry-structured-dependencies
  (testing "creation persists an explicit empty dependency vector"
    (let [pairs (task-create/frontmatter-pairs
                 {:uuid "u" :title "T" :status "incoming" :card-type "task"
                  :priority "P1" :dependency [] :write-id "w" :created-at "now"})]
      (is (= [] (second (first (filter #(= :dependency (first %)) pairs)))))))
  (testing "non-empty dependency order is stable"
    (let [pairs (task-create/frontmatter-pairs
                 {:uuid "u" :title "T" :status "incoming" :card-type "task"
                  :priority "P1" :dependency ["d1" "d2"]
                  :write-id "w" :created-at "now"})]
      (is (= ["d1" "d2"]
             (second (first (filter #(= :dependency (first %)) pairs))))))))

(deftest configured-card-dirs-declare-the-creation-vocabulary
  (testing "legacy boards keep task/epic compatibility"
    (is (= #{"task" "epic"} (task-create/card-types {})))
    (is (= "task" (task-create/check-request! {:project {} :title "T"}))))
  (testing "configured keys form a closed repository vocabulary"
    (let [project {:card-dirs {:story "stories" :chore "chores"}}]
      (is (= #{"story" "chore"} (task-create/card-types project)))
      (is (= "story" (task-create/check-request!
                       {:project project :title "T" :card-type "story"})))
      (is (= :usage
             (:kind (ex-data
                     (try (task-create/check-request!
                           {:project project :title "T" :card-type "task"})
                          nil (catch :default e e))))))
      (is (= :usage
             (:kind (ex-data
                     (try (task-create/check-request! {:project project :title "T"})
                          nil (catch :default e e))))))))
  (testing "dependencies must be an ordered vector of nonblank ids"
    (is (= "task" (task-create/check-request!
                    {:project {} :title "T" :dependency []})))
    (is (= "task" (task-create/check-request!
                    {:project {} :title "T" :dependency ["dep-a" "dep-b"]})))
    (doseq [dependency ["dep-a" [""] ["dep-a" " "]]]
      (is (= :usage
             (:kind (ex-data
                     (try (task-create/check-request!
                           {:project {} :title "T" :dependency dependency})
                          nil (catch :default e e)))))))))
