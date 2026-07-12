(ns eta-mu.law.tools-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.law.tools :as law]))

(deftest read-args-schema-test
  (testing "accepts a valid read args map"
    (is (law/valid-args? law/read-args-schema {:path "a.txt" :offset 1 :limit 10})))
  (testing "rejects a read args map missing path"
    (is (not (law/valid-args? law/read-args-schema {:offset 1})))))

(deftest bash-args-schema-test
  (testing "accepts a valid bash args map"
    (is (law/valid-args? law/bash-args-schema {:command "ls" :timeout 5})))
  (testing "rejects a blank command"
    (is (not (law/valid-args? law/bash-args-schema {:command ""})))))

(deftest edit-args-schema-test
  (testing "accepts a valid edit args map"
    (is (law/valid-args? law/edit-args-schema {:path "a.txt" :old_text "x" :new_text "y"})))
  (testing "rejects an edit args map missing old_text"
    (is (not (law/valid-args? law/edit-args-schema {:path "a.txt" :new_text "y"})))))

(deftest write-args-schema-test
  (testing "accepts a valid write args map"
    (is (law/valid-args? law/write-args-schema {:path "a.txt" :content "hi"})))
  (testing "rejects a write args map missing content"
    (is (not (law/valid-args? law/write-args-schema {:path "a.txt"})))))
