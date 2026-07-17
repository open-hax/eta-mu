(ns rheos.backend.domain.board-test
  (:require [cljs.test :refer [deftest testing is]]
            [rheos.backend.domain.board :as board]))

(deftest build-board-snapshot-empty
  (testing "Empty task list produces empty board with canonical columns"
    (let [snapshot (board/build-board-snapshot [])]
      (is (string? (:generated-at snapshot)))
      (is (= 0 (:total-tasks snapshot)))
      (is (pos? (count (:columns snapshot)))))))

(deftest build-board-snapshot-groups-by-status
  (testing "Tasks are grouped into correct status columns"
    (let [tasks [{:uuid "a" :title "A" :status "todo" :priority "P1" :labels [] :created-at "" :content "" :source-path ""}
                 {:uuid "b" :title "B" :status "todo" :priority "P2" :labels [] :created-at "" :content "" :source-path ""}
                 {:uuid "c" :title "C" :status "done" :priority "P1" :labels [] :created-at "" :content "" :source-path ""}
                 {:uuid "d" :title "D" :status "incoming" :priority "P0" :labels [] :created-at "" :content "" :source-path ""}]
          snapshot (board/build-board-snapshot tasks)
          by-status (into {} (map (fn [col] [(:status col) col]) (:columns snapshot)))]
      (is (= 4 (:total-tasks snapshot)))
      (is (= 2 (:task-count (get by-status "todo"))))
      (is (= 1 (:task-count (get by-status "done"))))
      (is (= 1 (:task-count (get by-status "incoming")))))))

(deftest build-board-snapshot-column-order
  (testing "Canonical statuses appear in defined order"
    (let [tasks [{:uuid "a" :title "A" :status "done" :priority "P3" :labels [] :created-at "" :content "" :source-path ""}
                 {:uuid "b" :title "B" :status "incoming" :priority "P3" :labels [] :created-at "" :content "" :source-path ""}
                 {:uuid "c" :title "C" :status "todo" :priority "P3" :labels [] :created-at "" :content "" :source-path ""}]
          snapshot (board/build-board-snapshot tasks)
          statuses (mapv :status (:columns snapshot))
          incoming-idx (.indexOf statuses "incoming")
          todo-idx (.indexOf statuses "todo")
          done-idx (.indexOf statuses "done")]
      (is (< incoming-idx todo-idx))
      (is (< todo-idx done-idx)))))
