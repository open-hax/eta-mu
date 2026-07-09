(ns eta-mu.law.command-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.law.command :as law]))

(def sample-registry
  {"agent" {:name "agent"
            :description "Default agent"
            :handler (fn [_] nil)}
   "git"   {:name "git"
            :description "Git helpers"
            :subcommands {"status" {:name "status"
                                    :description "Show status"
                                    :handler (fn [_] nil)}}}})

(deftest valid-registry-test
  (testing "accepts a valid registry"
    (is (law/valid-registry? sample-registry))))

(deftest invalid-registry-test
  (testing "rejects a registry with a missing description"
    (is (not (law/valid-registry? {"bad" {:name "bad"}})))))

(deftest nested-command-test
  (testing "accepts a nested command group"
    (is (law/valid-registry? {"git" {:name "git"
                                      :description "Git helpers"
                                      :subcommands {"status" {:name "status"
                                                              :description "Status"
                                                              :handler (fn [_] nil)}}}}))))
