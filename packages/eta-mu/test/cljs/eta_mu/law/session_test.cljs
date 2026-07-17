(ns eta-mu.law.session-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.law.session :as law]))

(def ^:private valid-artifact
  {:version 1
   :session-id "20260716-120000-ab12cd"
   :cwd "/tmp/work"
   :created-at "2026-07-16T12:00:00.000Z"
   :updated-at "2026-07-16T12:05:00.000Z"
   :model {:id "gpt-4o-mini" :provider "openai"}
   :system-prompt "You are a helpful assistant."
   :messages [{:role :user :content "hello" :timestamp 1}
              {:role :assistant
               :content [{:type :text :text "hi"}]
               :api "openai" :provider "openai" :model "gpt-4o-mini"
               :usage {:input 1 :output 1 :cache-read 0 :cache-write 0 :total-tokens 2}
               :stop-reason :stop
               :timestamp 2}
              {:role :tool-result
               :tool-call-id "call-1"
               :tool-name "read"
               :content [{:type :text :text "data"}]
               :is-error false
               :timestamp 3}]})

(deftest valid-artifact-test
  (testing "a complete artifact with all three message roles validates"
    (is (law/valid-artifact? valid-artifact))))

(deftest empty-transcript-test
  (testing "a fresh artifact with no messages validates"
    (is (law/valid-artifact? (assoc valid-artifact :messages [])))))

(deftest invalid-artifacts-test
  (testing "missing required keys fail"
    (is (not (law/valid-artifact? (dissoc valid-artifact :session-id))))
    (is (not (law/valid-artifact? (dissoc valid-artifact :messages))))
    (is (not (law/valid-artifact? (dissoc valid-artifact :model)))))
  (testing "a wrong version fails"
    (is (not (law/valid-artifact? (assoc valid-artifact :version 2)))))
  (testing "a malformed message fails"
    (is (not (law/valid-artifact?
              (assoc valid-artifact :messages [{:role :user :content 42 :timestamp 1}])))))
  (testing "explain returns diagnostics for invalid artifacts"
    (is (some? (law/explain-artifact (dissoc valid-artifact :cwd))))))
