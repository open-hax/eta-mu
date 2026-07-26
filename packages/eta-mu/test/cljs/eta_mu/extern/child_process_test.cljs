(ns eta-mu.extern.child-process-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.extern.child-process :as child]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]))

(defn- make-workspace!
  "Create a throwaway pnpm workspace with one packages/<dir> package."
  [pkg-dir pkg-name]
  (let [root (.mkdtempSync fs (path/join (os/tmpdir) "eta-mu-ws-"))
        pkg-root (path/join root "packages" pkg-dir)]
    (.mkdirSync fs pkg-root #js {:recursive true})
    (.writeFileSync fs (path/join root "pnpm-workspace.yaml") "packages:\n  - packages/*\n")
    (.writeFileSync fs (path/join pkg-root "package.json")
                    (js/JSON.stringify #js {:name pkg-name :version "0.0.0"}))
    {:root root :pkg-root pkg-root}))

(defn- sleep-ms [ms]
  (js/Promise. (fn [resolve] (js/setTimeout resolve ms))))

(deftest ^:async abort-escalates-to-sigkill-test
  (testing "a SIGTERM-ignoring process tree is reclaimed by the SIGKILL escalation"
    ;; The shell ignores SIGTERM and loops, so only SIGKILL can end it early.
    ;; It also self-exits after ~8s, so a regression fails the elapsed-time
    ;; assertion instead of hanging the suite or leaking an orphan.
    (let [controller (js/AbortController.)
          command "trap '' TERM; for i in $(seq 1 40); do sleep 0.2; done"
          started (js/Date.now)
          run (child/exec-shell-capture command 0 (.-signal controller))]
      (await (sleep-ms 300))
      (.abort controller)
      (let [{:keys [exit aborted?]} (await run)
            elapsed (- (js/Date.now) started)]
        (is (true? aborted?))
        (is (= 130 exit))
        ;; SIGTERM alone would leave it running until its own ~8s self-exit;
        ;; escalation happens at terminate-grace-ms (2s).
        (is (< elapsed 6000)
            (str "aborted tree took " elapsed "ms to be reclaimed — "
                 "SIGKILL escalation did not fire"))))))

(deftest workspace-package-root-finds-package-test
  (testing "resolves a workspace package by name from a nested directory"
    (let [{:keys [root pkg-root]} (make-workspace! "rheos" "@eta-mu/rheos")
          nested (path/join root "kanban" "tasks")]
      (.mkdirSync fs nested #js {:recursive true})
      (is (= pkg-root (child/workspace-package-root nested "@eta-mu/rheos")))
      (is (= pkg-root (child/workspace-package-root root "@eta-mu/rheos")))
      (.rmSync fs root #js {:recursive true :force true}))))

(deftest workspace-package-root-misses-test
  (testing "returns nil when the package name does not match"
    (let [{:keys [root]} (make-workspace! "rheos" "@eta-mu/rheos")]
      (is (nil? (child/workspace-package-root root "@open-hax/absent")))
      (.rmSync fs root #js {:recursive true :force true})))
  (testing "returns nil outside any pnpm workspace"
    (let [dir (.mkdtempSync fs (path/join (os/tmpdir) "eta-mu-nows-"))]
      (is (nil? (child/workspace-package-root dir "@eta-mu/rheos")))
      (.rmSync fs dir #js {:recursive true :force true}))))
