(ns rheos.backend.domain.events-test
  (:require [cljs.test :refer [deftest testing is]]
            [promethean.openplanner-protocols :as protocols]
            [rheos.backend.domain.events :as events]))

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
      (is (= "breakdown" (:to result)))
      (is (nil? (:correlation/status result))))))

(deftest envelope->kanban-event-correlation
  (testing "Envelope includes correlation status when present"
    (let [envelope {:event/type "kanban.file-changed" :session/id "board"
                    :event/time "2026-06-08T00:00:00.000Z"
                    :payload {:task-id "t1" :source "watcher" :agent "eta-mu"
                              :write-id "wid" :correlation/status "correlated"}}
          result (events/envelope->kanban-event envelope)]
      (is (= "correlated" (:correlation/status result)))
      (is (= "wid" (:write-id result)))
      (is (= "file-changed" (:type result))))))

(deftest ^:async emit-file-changed-records-correlation
  (testing "file-changed event carries correlation status"
    (let [ledger (reify protocols/EventAdmission
                   (append-event! [_ envelope]
                     (js/Promise.resolve envelope))
                   (append-events! [_ envelopes]
                     (js/Promise.resolve (vec envelopes)))
                   (query-events [_ _] (js/Promise.resolve #js []))
                   (watch-events [_ _ _] #js {:close! (fn [])}))
          captured (atom nil)
          unsub (events/subscribe! #(reset! captured %))]
      (try
        (await (events/emit-file-changed! ledger "board" "t1" "wid" "correlated"))
        (is (= "file-changed" (:type @captured)))
        (is (= "correlated" (:correlation/status @captured)))
        (is (= "wid" (:write-id @captured)))
        (finally
          (unsub))))))

(deftest ^:async emit-drift-detected-records-correlation
  (testing "drift-detected event carries drift correlation status"
    (let [ledger (reify protocols/EventAdmission
                   (append-event! [_ envelope]
                     (js/Promise.resolve envelope))
                   (append-events! [_ envelopes]
                     (js/Promise.resolve (vec envelopes)))
                   (query-events [_ _] (js/Promise.resolve #js []))
                   (watch-events [_ _ _] #js {:close! (fn [])}))
          captured (atom nil)
          unsub (events/subscribe! #(reset! captured %))]
      (try
        (await (events/emit-drift-detected! ledger "board" "t1" nil))
        (is (= "drift-detected" (:type @captured)))
        (is (= "drift" (:correlation/status @captured)))
        (is (string? (:write-id @captured)))
        (finally
          (unsub))))))
