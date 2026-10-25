;; SPDX-License-Identifier: GPL-3.0-or-later
(ns kanban-sync-workflow-test
  (:require [cljs.test :as t :refer [deftest is]]
            [nbb.core :as nbb]
            ["node:fs" :as fs]
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

(defmethod t/report [:cljs.test/default :end-run-tests] [summary]
  (when (pos? (+ (:fail summary) (:error summary)))
    (set! (.-exitCode js/process) 1)))

(t/run-tests 'kanban-sync-workflow-test)
