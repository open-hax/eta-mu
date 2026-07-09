(ns eta-mu.domain.fork-tax-test
  (:require [clojure.string :as str]
            [cljs.test :refer [deftest is testing]]
            [eta-mu.domain.fork-tax :as fork-tax]))

(deftest make-tag-name-test
  (testing "tag name strips separators from timestamp"
    (is (= "Π-20260709T121314Z" (fork-tax/make-tag-name "2026-07-09T12:13:14.123Z")))))

(deftest commit-message-test
  (testing "commit message includes tag name"
    (is (= "Π Π-20260709T121314Z" (fork-tax/commit-message "Π-20260709T121314Z")))))

(deftest partition-status-owned-test
  (testing "classifies owned paths"
    (let [entries [{:path "/repo/src/foo.cljs" :status " M"}
                   {:path "/repo/other/bar.cljs" :status " M"}]
          result (fork-tax/partition-status entries ["/repo/src"])]
      (is (= 1 (count (:owned result))))
      (is (= 1 (count (:concurrent result))))
      (is (zero? (count (:blocked result)))))))

(deftest partition-status-blocked-test
  (testing "classifies node_modules and dist as blocked"
    (let [entries [{:path "/repo/node_modules/x/index.js" :status " M"}
                   {:path "/repo/dist/main.js" :status " M"}]
          result (fork-tax/partition-status entries ["/repo"])]
      (is (= 2 (count (:blocked result))))
      (is (zero? (count (:owned result)))))))

(deftest build-state-sexp-test
  (testing "state sexp includes repo and tag"
    (let [plan {:repo-root "/repo"
                :branch "main"
                :sha "abc123"
                :tag-name "Π-1"
                :owned [{:path "/repo/a.cljs"}]
                :concurrent []
                :blocked []}
          sexp (fork-tax/build-state-sexp plan)]
      (is (str/includes? sexp "Π-state"))
      (is (str/includes? sexp "abc123"))
      (is (str/includes? sexp "Π-1")))))

(deftest build-last-md-test
  (testing "last markdown includes owned paths"
    (let [plan {:repo-root "/repo"
                :branch "main"
                :sha "abc123"
                :tag-name "Π-1"
                :owned [{:path "/repo/a.cljs"}]
                :concurrent [{:path "/repo/b.cljs"}]
                :blocked []}
          md (fork-tax/build-last-md plan)]
      (is (str/includes? md "Π Handoff"))
      (is (str/includes? md "a.cljs"))
      (is (str/includes? md "b.cljs")))))
