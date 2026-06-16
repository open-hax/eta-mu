(ns eta-mu.coding.extern.git-test
  (:require [cljs.test :refer [deftest is testing]]
            [clojure.string :as str]
            [eta-mu.coding.extern.fs :as fs]
            [eta-mu.coding.extern.git :as git]
            [eta-mu.coding.extern.path :as path]
            [eta-mu.coding.extern.process-exec :as proc]))

(defn- temp-dir []
  (path/path-join "/tmp/opencode" (str "git-test-" (random-uuid))))

(defn- run-git-raw
  [cwd args]
  (proc/execute-command {:command "git" :args args :cwd cwd}))

(defn- ^:async with-temp-git-repo
  []
  (let [d (temp-dir)]
    (fs/ensure-directory! d)
    (await (run-git-raw d ["init"]))
    (await (run-git-raw d ["config" "user.email" "test@example.com"]))
    (await (run-git-raw d ["config" "user.name" "Test"]))
    d))

(deftest ^:async git-status-test
  (testing "status returns ok in a fresh repo"
    (let [d (await (with-temp-git-repo))
          res (await (git/git-status d))]
      (is (:ok res))
      (is (= 0 (:exit-code res)))
      (fs/delete-directory! d))))

(deftest ^:async git-commit-test
  (testing "commit writes a log entry"
    (let [d (await (with-temp-git-repo))]
      (fs/write-text-file! (path/path-join d "a.txt") "a")
      (await (run-git-raw d ["add" "a.txt"]))
      (let [res (await (git/git-commit d "initial"))
            log (await (git/git-log d))]
        (is (:ok res))
        (is (= 0 (:exit-code res)))
        (is (re-find #"initial" (:stdout log))))
      (fs/delete-directory! d))))

(deftest ^:async git-branch-test
  (testing "branch returns ok after an initial commit"
    (let [d (await (with-temp-git-repo))]
      (fs/write-text-file! (path/path-join d "a.txt") "a")
      (await (run-git-raw d ["add" "a.txt"]))
      (await (run-git-raw d ["commit" "-m" "init"]))
      (let [res (await (git/git-branch d))]
        (is (:ok res))
        (is (= 0 (:exit-code res))))
      (fs/delete-directory! d))))

(deftest ^:async git-rev-parse-test
  (testing "rev-parse returns a 40-char sha after an initial commit"
    (let [d (await (with-temp-git-repo))]
      (fs/write-text-file! (path/path-join d "a.txt") "a")
      (await (run-git-raw d ["add" "a.txt"]))
      (await (run-git-raw d ["commit" "-m" "init"]))
      (let [res (await (git/git-rev-parse d "HEAD"))]
        (is (:ok res))
        (is (= 0 (:exit-code res)))
        (is (= 40 (count (str/trim (:stdout res))))))
      (fs/delete-directory! d))))
