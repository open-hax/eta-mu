(ns eta-mu.domain.router-test
  (:require [clojure.string :as str]
            [cljs.test :refer [deftest is testing]]
            [eta-mu.domain.router :as router]
            [eta-mu.shape.args :as args]))

(def test-registry
  {"agent"     {:name "agent"
                :description "Agent"
                :handler (fn [x] [:agent x])}
   "kanban"    {:name "kanban"
                :description "Kanban"
                :handler (fn [x] [:kanban x])}
   "git"       {:name "git"
                :description "Git"
                :subcommands {"status" {:name "status"
                                        :description "Status"
                                        :handler (fn [x] [:git-status x])}}}
   "contracts" {:name "contracts"
                :description "Contracts"
                :subcommands {"output" {:name "output"
                                        :description "Output gate"
                                        :handler (fn [x] [:output x])}}}})

(deftest default-to-agent-test
  (testing "no positional args dispatch to agent"
    (let [result (router/resolve-dispatch test-registry (args/parse []))]
      (is (= :dispatch (:type result)))
      (is (= ["agent"] (:path result)))
      (is (= [] (:args result))))))

(deftest dispatch-leaf-test
  (testing "dispatch a leaf command with remaining args"
    (let [result (router/resolve-dispatch test-registry (args/parse ["kanban" "list"]))]
      (is (= :dispatch (:type result)))
      (is (= ["kanban"] (:path result)))
      (is (= ["list"] (:args result))))))

(deftest dispatch-nested-leaf-test
  (testing "dispatch a nested leaf command"
    (let [result (router/resolve-dispatch test-registry (args/parse ["git" "status"]))]
      (is (= :dispatch (:type result)))
      (is (= ["git" "status"] (:path result)))
      (is (= [] (:args result))))))

(deftest group-without-subcommand-test
  (testing "group without subcommand shows help"
    (let [result (router/resolve-dispatch test-registry (args/parse ["git"]))]
      (is (= :help (:type result))))))

(deftest help-flag-test
  (testing "--help returns help at the current path"
    (let [result (router/resolve-dispatch test-registry (args/parse ["git" "status" "--help"]))]
      (is (= :help (:type result)))
      (is (= ["git" "status"] (:path result))))))

(deftest top-level-help-test
  (testing "top-level --help returns help with empty path"
    (let [result (router/resolve-dispatch test-registry (args/parse ["--help"]))]
      (is (= :help (:type result)))
      (is (= [] (:path result))))))

(deftest version-flag-test
  (testing "--version returns version descriptor"
    (is (= :version (:type (router/resolve-dispatch test-registry (args/parse ["--version"])))))))

(deftest unknown-command-test
  (testing "unknown command returns error"
    (let [result (router/resolve-dispatch test-registry (args/parse ["unknown"]))]
      (is (= :error (:type result)))
      (is (= "Unknown command: unknown" (:message result))))))

(deftest render-help-contains-commands-test
  (testing "help text lists commands"
    (let [help (router/render-help test-registry [])]
      (is (clojure.string/includes? help "AGENT"))
      (is (clojure.string/includes? help "KANBAN"))
      (is (clojure.string/includes? help "GIT")))))

(deftest render-help-nested-test
  (testing "help for a group shows subcommands"
    (let [help (router/render-help test-registry ["git"])]
      (is (clojure.string/includes? help "STATUS")))))

(deftest raw-args-after-path-test
  (testing "flags after the command path survive with order intact"
    (is (= ["search-tasks" "--query" "sol"]
           (router/raw-args-after-path ["kanban" "search-tasks" "--query" "sol"] ["kanban"]))))
  (testing "nested command paths are consumed"
    (is (= ["--verbose"]
           (router/raw-args-after-path ["git" "status" "--verbose"] ["git" "status"]))))
  (testing "flags interleaved before path components are skipped"
    (is (= ["read-board"]
           (router/raw-args-after-path ["--quiet" "kanban" "read-board"] ["kanban"]))))
  (testing "empty path returns all tokens"
    (is (= ["kanban" "list"] (router/raw-args-after-path ["kanban" "list"] []))))
  (testing "unconsumed path yields no args"
    (is (= [] (router/raw-args-after-path ["kanban"] ["kanban" "missing"])))))
