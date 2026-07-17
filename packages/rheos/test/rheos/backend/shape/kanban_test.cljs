(ns rheos.backend.shape.kanban-test
  (:require [cljs.test :refer [deftest testing is]]
            [rheos.backend.shape.kanban :as shape]))

(deftest valid-task
  (testing "A well-formed task passes validation"
    (let [task {:uuid "x" :title "X" :slug "x" :status "todo" :priority "P1"
                :labels ["bug"] :created-at "2026-06-08T00:00:00.000Z" :content "# X" :source-path "/x.md"}]
      (is (shape/valid? shape/Task task)))))

(deftest invalid-task-missing-required
  (testing "Task missing required fields fails validation"
    (is (not (shape/valid? shape/Task {:title "X"})))))

(deftest status-order-is-complete
  (testing "StatusOrder contains all canonical statuses"
    (is (= 12 (count shape/StatusOrder)))
    (is (some #(= "icebox" %) shape/StatusOrder))
    (is (some #(= "done" %) shape/StatusOrder))))
