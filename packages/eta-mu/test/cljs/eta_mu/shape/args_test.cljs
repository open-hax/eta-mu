(ns eta-mu.shape.args-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.shape.args :as args]))

(deftest parse-empty-test
  (testing "empty input yields empty positional and flags"
    (is (= {:positional [] :flags {}} (args/parse [])))))

(deftest parse-positionals-test
  (testing "collects positional tokens"
    (is (= {:positional ["kanban" "list"] :flags {}}
             (args/parse ["kanban" "list"])))))

(deftest parse-boolean-flag-test
  (testing "--flag without value becomes true"
    (is (= {:positional [] :flags {"help" true}}
             (args/parse ["--help"])))))

(deftest parse-value-flag-test
  (testing "--flag value consumes next token"
    (is (= {:positional [] :flags {"tasks-dir" "./tasks"}}
             (args/parse ["--tasks-dir" "./tasks"])))))

(deftest parse-equals-flag-test
  (testing "--flag=value captures inline value"
    (is (= {:positional [] :flags {"port" "8080"}}
             (args/parse ["--port=8080"])))))

(deftest parse-mixed-test
  (testing "mixes positionals and flags"
    (is (= {:positional ["kanban" "find" "abc"]
             :flags {"tasks-dir" "./tasks" "verbose" true}}
             (args/parse ["kanban" "find" "abc" "--tasks-dir" "./tasks" "--verbose"])))))

(deftest parse-flag-followed-by-flag-test
  (testing "two boolean flags are both parsed"
    (is (= {:positional [] :flags {"foo" true "bar" true}}
             (args/parse ["--foo" "--bar"])))))
(deftest help-and-version-predicates-test
  (testing "detects help and version flags"
    (is (args/help? (args/parse ["--help"])))
    (is (args/help? (args/parse ["-h"])))
    (is (args/version? (args/parse ["--version"])))
    (is (args/version? (args/parse ["-v"])))))
