;; SPDX-License-Identifier: GPL-3.0-or-later
(ns kanban-sync-workflow-test
  (:require [cljs.test :as t :refer [deftest is]]
            [clojure.edn :as edn]
            [nbb.core :as nbb]
            ["node:child_process" :as cp]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]
            ["yaml" :as yaml]))

(def workflows-directory (path/resolve (path/dirname nbb/*file*) "../workflows"))

(defn workflow [name]
  (js->clj (yaml/parse (fs/readFileSync (path/join workflows-directory name) "utf8"))
           :keywordize-keys true))

(defn steps [document job]
  (get-in document [:jobs job :steps]))

(defn step-index [entries name]
  (first (keep-indexed (fn [index step] (when (= name (:name step)) index)) entries)))

(deftest shared-runtime-order
  (let [entries (steps (workflow "kanban-sync.yml") :github-issue-sync)
        install (step-index entries "Install Clojure CLI")
        verify (step-index entries "Verify Clojure CLI")
        build (step-index entries "Build Rheos projection executables")]
    (is (and (number? install) (number? verify) (number? build)
             (< install verify build))
        "Install and verify the CLI before invoking shadow-cljs")
    (is (= "clojure -Sdescribe" (:run (get entries verify))))
    (is (= "pnpm --dir .eta-mu/packages/rheos exec shadow-cljs release cli github-sync"
           (:run (get entries build))))))

(deftest shared-runtime-pin
  (let [entries (steps (workflow "kanban-sync.yml") :github-issue-sync)
        install (get entries (step-index entries "Install Clojure CLI"))]
    (is (= "DeLaGuardo/setup-clojure@3fe9b3ae632c6758d0b7757b0838606ef4287b08"
           (:uses install)))
    (is (= "1.12.5.1654" (str (get-in install [:with :cli]))))))

(deftest owning-ci-runtime-pin
  (let [entries (steps (workflow "rheos-github-sync-ci.yml") :rheos-github-sync)
        install (get entries (step-index entries "Install Clojure CLI and clj-kondo"))]
    (is (= "DeLaGuardo/setup-clojure@3fe9b3ae632c6758d0b7757b0838606ef4287b08"
           (:uses install)))
    (is (= "1.12.5.1654" (str (get-in install [:with :cli]))))))

(defn git-read-programs
  "Read the owning and projected YAML programs and their canonical toolchain."
  []
  (let [entries (steps (workflow "rheos-github-sync-ci.yml") :rheos-github-sync)
        registry (edn/read-string
                  (fs/readFileSync (path/resolve workflows-directory "../../contracts/workflows/resources.edn") "utf8"))]
    [(->> entries (filter #(contains? (:env %) :CREDENTIALS_AVAILABLE)) first :run)
     (->> (steps (workflow "rheos.yml") :test)
          (filter #(contains? (:env %) :CREDENTIALS_AVAILABLE)) first :run)
     (->> (:toolchains registry) vals (apply concat)
          (filter #(contains? (:step/env %) :CREDENTIALS_AVAILABLE)) first :step/run)]))

(deftest dependency-contract-regressions-select-owning-ci
  (let [paths (get-in (workflow "rheos-github-sync-ci.yml") [:on :pull_request :paths])
        contract (edn/read-string
                   (fs/readFileSync (path/resolve workflows-directory "../../contracts/workflows/ci.edn") "utf8"))
        rheos (first (filter #(= "rheos" (:contract/id %)) (:resources contract)))
        job (first (:workflow/jobs rheos))]
    (doseq [changed-path ["contracts/workflows/resources.edn" "contracts/workflows/ci.edn"
                          ".github/workflows/rheos.yml"]]
      (is (some #{changed-path} paths) (str "Owning CI must select " changed-path)))
    (is (some #(= :git-deps (:step/use %)) (:job/steps job)))
    (is (= ["katamorph"] (get-in job [:job/gate :gate/needs-repos]))
        "Public dependencies still require repository reachability")))

(defn execute-git-read-program
  "Execute one authored shell program without access to ambient Git credentials."
  [program available token cleanup]
  (let [directory (fs/mkdtempSync (path/join (os/tmpdir) "rheos-public-git-"))
        config (path/join directory "gitconfig")
        environment #js {:PATH "/usr/bin:/bin"
                         :HOME directory :XDG_CONFIG_HOME directory
                         :GIT_CONFIG_NOSYSTEM "1" :GIT_CONFIG_SYSTEM "/dev/null"
                         :GIT_CONFIG_GLOBAL config :GIT_TERMINAL_PROMPT "0"
                         :CREDENTIALS_AVAILABLE available :DEPENDENCY_TOKEN token}]
    (try
      (let [result (cp/spawnSync "bash" #js ["--noprofile" "--norc" "-e" "-o" "pipefail" "-c" (or program "exit 97")]
                                 #js {:env environment :encoding "utf8" :timeout 5000})
            configuration (if (fs/existsSync config) (fs/readFileSync config "utf8") "")
            cleanup-result (cp/spawnSync "bash" #js ["--noprofile" "--norc" "-e" "-o" "pipefail" "-c" cleanup]
                                         #js {:env environment :encoding "utf8" :timeout 5000})]
        {:status (.-status result)
         :output (str (.-stdout result) (.-stderr result))
         :configuration configuration
         :cleanup-status (.-status cleanup-result)
         :clean-configuration (if (fs/existsSync config) (fs/readFileSync config "utf8") "")})
      (finally (fs/rmSync directory #js {:recursive true :force true})))))

(deftest public-dependency-reads-without-app-credentials
  (let [entries (steps (workflow "rheos-github-sync-ci.yml") :rheos-github-sync)
        cleanup (:run (first (filter #(= "Remove private Git authorization" (:name %)) entries)))]
    (doseq [program (git-read-programs)
            available ["false" ""]]
      (let [result (execute-git-read-program program available "" cleanup)]
        (is (zero? (:status result)) (:output result))
        (is (= "" (:configuration result)) "Anonymous reads must not create an authorization header")
        (is (zero? (:cleanup-status result)))))))

(deftest authenticated-dependency-reads-retain-token-validation-and-cleanup
  (let [entries (steps (workflow "rheos-github-sync-ci.yml") :rheos-github-sync)
        cleanup (:run (first (filter #(= "Remove private Git authorization" (:name %)) entries)))
        token "fixture-not-a-real-token"
        encoded (.toString (js/Buffer.from (str "x-access-token:" token)) "base64")]
    (doseq [program (git-read-programs)]
      (let [missing (execute-git-read-program program "true" "" cleanup)
            valid (execute-git-read-program program "true" token cleanup)]
        (is (= 1 (:status missing)) "Declared credentials with no minted token remain a hard failure")
        (is (= "" (:configuration missing)))
        (is (zero? (:status valid)) (:output valid))
        (is (.includes (:configuration valid) (str "AUTHORIZATION: basic " encoded)))
        (is (not (.includes (:output valid) token)) "Never log a credential")
        (is (not (.includes (:output valid) encoded)) "Never log the encoded authorization")
        (is (zero? (:cleanup-status valid)))
        (is (not (.includes (:clean-configuration valid) "AUTHORIZATION")))))))

(defmethod t/report [:cljs.test/default :end-run-tests] [summary]
  (when (pos? (+ (:fail summary) (:error summary)))
    (set! (.-exitCode js/process) 1)))

(t/run-tests 'kanban-sync-workflow-test)
