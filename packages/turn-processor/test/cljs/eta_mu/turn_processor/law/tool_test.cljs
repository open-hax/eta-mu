(ns eta-mu.turn-processor.law.tool-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.turn-processor.law.tool :as tool]))

(deftest valid-tool-test
  (testing "accepts a valid tool"
    (is (tool/valid-tool? {:name "read"
                           :label "Read file"
                           :description "Read a file's contents"
                           :parameters [:map [:path string?]]}))))

(deftest invalid-tool-missing-label-test
  (testing "rejects a tool missing a label"
    (is (not (tool/valid-tool? {:name "read"
                                :description "Read a file"
                                :parameters [:map]})))))

(deftest tool-execution-mode-test
  (testing "accepts parallel execution mode"
    (is (tool/valid-tool? {:name "read"
                           :label "Read"
                           :description "Read"
                           :parameters [:map]
                           :execution-mode :parallel}))))
