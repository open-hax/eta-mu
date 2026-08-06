(ns eta-mu.infra.cli.commands.kanban-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.infra.cli.commands.kanban :as kanban]))

(deftest translate-empty-test
  (testing "no args defaults to board list"
    (let [result (kanban/translate-args [])]
      (is (= ["board" "list"] (:args result)))
      (is (nil? (:formatter result))))))

(deftest translate-native-rheos-test
  (testing "Rheos commands pass through unchanged"
    (let [result (kanban/translate-args ["board" "snapshot" "--out" "board.json"])]
      (is (= ["board" "snapshot" "--out" "board.json"] (:args result)))
      (is (nil? (:formatter result))))
    (let [result (kanban/translate-args ["serve" "--port" "8787"])]
      (is (= ["serve" "--port" "8787"] (:args result))))))

(deftest translate-list-test
  (testing "legacy list maps to read-board with formatter"
    (let [result (kanban/translate-args ["list"])]
      (is (= ["read-board"] (:args result)))
      (is (some? (:formatter result))))
    (let [result (kanban/translate-args ["list" "--verbose"])]
      (is (= ["read-board" "--verbose"] (:args result)))
      (is (some? (:formatter result))))))

(deftest translate-count-test
  (testing "legacy count maps to read-board with formatter"
    (let [result (kanban/translate-args ["count"])]
      (is (= ["read-board"] (:args result)))
      (is (some? (:formatter result))))))

(deftest translate-search-test
  (testing "legacy search maps to search-tasks --query"
    (let [result (kanban/translate-args ["search" "physics"])]
      (is (= ["search-tasks" "--query" "physics"] (:args result)))
      (is (nil? (:formatter result))))))

(deftest translate-find-test
  (testing "legacy find maps to read-task"
    (let [result (kanban/translate-args ["find" "abc-123"])]
      (is (= ["read-task" "abc-123"] (:args result))))))

(deftest translate-content-test
  (testing "legacy content maps to read-task"
    (let [result (kanban/translate-args ["content" "abc-123"])]
      (is (= ["read-task" "abc-123"] (:args result))))))

(deftest translate-comment-test
  (testing "legacy comment maps to add-comment --text"
    (let [result (kanban/translate-args ["comment" "abc-123" "progress note"])]
      (is (= ["add-comment" "abc-123" "--text" "progress note"] (:args result))))))

(deftest translate-frontmatter-status-test
  (testing "legacy frontmatter status maps to status-update --to"
    (let [result (kanban/translate-args ["frontmatter" "abc-123" "status" "in_progress"])]
      (is (= ["status-update" "abc-123" "--to" "in_progress"] (:args result))))))

(deftest translate-frontmatter-non-status-test
  (testing "legacy frontmatter for non-status keys maps to Rheos frontmatter --set"
    ;; This used to throw and tell callers to edit the markdown by hand; Rheos now
    ;; owns descriptive frontmatter, so the bridge routes to it.
    (let [result (kanban/translate-args ["frontmatter" "abc-123" "priority" "P0"])]
      (is (= ["frontmatter" "abc-123" "--set" "priority=P0"] (:args result))))))

(deftest translate-frontmatter-missing-args-test
  (testing "legacy frontmatter still requires uuid, key, and value"
    (is (thrown? js/Error (kanban/translate-args ["frontmatter" "abc-123" "priority"])))))

(deftest passthrough-create-test
  (testing "native Rheos create passes through untouched"
    (let [result (kanban/translate-args ["create" "--title" "New card"])]
      (is (= ["create" "--title" "New card"] (:args result)))
      (is (nil? (:formatter result))))))

(deftest passthrough-projects-test
  (testing "native Rheos projects passes through untouched"
    (is (= ["projects"] (:args (kanban/translate-args ["projects"]))))))

(deftest translate-open-throws-test
  (testing "legacy open is not supported"
    (is (thrown? js/Error (kanban/translate-args ["open" "abc-123"])))))

(deftest translate-sync-throws-test
  (testing "legacy sync is not supported"
    (is (thrown? js/Error (kanban/translate-args ["sync" "trello"])))))

(deftest translate-search-missing-query-test
  (testing "search without query throws"
    (is (thrown? js/Error (kanban/translate-args ["search"])))))
