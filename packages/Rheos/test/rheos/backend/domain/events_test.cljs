(ns eta-mu.kanban.events-test
  (:require [cljs.test :refer [deftest testing is]]
            [eta-mu.kanban.events :as events]))

(deftest generate-write-id-format
  (testing "Write ID is a non-empty string"
    (let [wid (events/generate-write-id)]
      (is (string? wid))
      (is (pos? (count wid))))))

(deftest generate-write-id-unique
  (testing "Two write IDs are different"
    (is (not= (events/generate-write-id) (events/generate-write-id)))))

(deftest envelope->kanban-event-basic
  (testing "Envelope converts to kanban event"
    (let [envelope {:event/type "kanban.status-change" :session/id "board"
                    :event/time "2026-06-08T00:00:00.000Z"
                    :payload {:task-id "t1" :from "incoming" :to "breakdown" :source "cli" :agent "eta-mu"}}
          result (events/envelope->kanban-event envelope)]
      (is (= "board" (:board result)))
      (is (= "t1" (:task-id result)))
      (is (= "incoming" (:from result)))
      (is (= "breakdown" (:to result))))))
