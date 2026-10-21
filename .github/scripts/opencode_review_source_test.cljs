;; SPDX-License-Identifier: GPL-3.0-or-later
(ns opencode-review-source-test
  "Read-only Git object reconstruction controls; inert fixture facts confer no native authority."
  (:require [cljs.test :as test :refer [async deftest is testing]]
            [nbb.core :as nbb]
            [eta-mu.law.review-source :as law]
            ["node:child_process" :as cp]
            ["node:fs" :as fs]
            ["node:path" :as path]
            ["node:os" :as os]
            ["node:crypto" :as crypto]))

(defn sha256 [bytes]
  (.digest (.update (.createHash crypto "sha256") bytes) "hex"))

(defn repeated [n c] (apply str (repeat n c)))
(defn git-dir [root] (.join path root ".git"))

(defn git! [root args]
  (let [result (.spawnSync cp "git" (clj->js (into ["-C" root] args))
                           #js {:encoding "utf8" :timeout 10000 :maxBuffer 1048576
                                :env #js {:PATH (or (aget (.-env js/process) "PATH") "/usr/bin:/bin")
                                          :HOME root :GIT_CONFIG_NOSYSTEM "1"
                                          :GIT_CONFIG_GLOBAL "/dev/null" :GIT_OPTIONAL_LOCKS "0"
                                          :LC_ALL "C.UTF-8" :LANG "C.UTF-8"}})]
    (when-not (= 0 (.-status result))
      (throw (ex-info "Git fixture command failed"
                      {:argv args :status (.-status result) :stderr (.-stderr result)})))
    (.trim (.-stdout result))))

(defn write! [root name bytes]
  (let [target (.join path root name)]
    (.mkdirSync fs (.dirname path target) #js {:recursive true})
    (.writeFileSync fs target bytes)))

(defn fixture! []
  (let [root (.mkdtempSync fs (.join path (.tmpdir os) "eta-review-source-"))
        canary (.join path root "textconv-ran")]
    (try
      (git! root ["init" "-b" "main"])
      (git! root ["config" "user.name" "Fixture"])
      (git! root ["config" "user.email" "fixture@example.invalid"])
      (write! root "base.txt" "base\n")
      (git! root ["add" "--all"])
      (git! root ["commit" "-m" "base"])
      (let [base (git! root ["rev-parse" "HEAD"])]
        (write! root ".gitattributes" "*.txt diff=poison\n")
        (write! root "base.txt" "changed λμ\nlast-without-newline")
        (write! root "目录/new\nline.bin" (.from js/Buffer (clj->js [0 255 10 128 13 10])))
        (git! root ["add" "--all"])
        (git! root ["commit" "-m" "head"])
        (let [head (git! root ["rev-parse" "HEAD"])
              head-tree (git! root ["rev-parse" "HEAD^{tree}"])
              merge (git! root ["commit-tree" head-tree "-p" base "-p" head "-m" "test merge"])
              merge-tree (git! root ["rev-parse" (str merge "^{tree}")])
              diff-base (git! root ["merge-base" base head])
              diff (let [result (.spawnSync cp "git"
                                            #js ["-C" root "--no-pager" "-c" "core.fsmonitor=false"
                                                 "diff" "--no-ext-diff" "--no-textconv" "--find-renames"
                                                 diff-base head "--"]
                                            #js {:encoding nil :timeout 10000 :maxBuffer 10485760
                                                 :env #js {:PATH (or (aget (.-env js/process) "PATH") "/usr/bin:/bin")
                                                           :HOME root :GIT_CONFIG_NOSYSTEM "1"
                                                           :GIT_CONFIG_GLOBAL "/dev/null" :GIT_OPTIONAL_LOCKS "0"
                                                           :LC_ALL "C.UTF-8" :LANG "C.UTF-8"}})]
                      (when-not (= 0 (.-status result))
                        (throw (ex-info "Git fixture diff failed" {:status (.-status result)})))
                      (.-stdout result))
              tuple {:pr-number 7 :state :open :draft? false :mergeable? true
                     :base-sha base :head-sha head :merge-sha merge
                     :merge-parents [base head] :head-tree head-tree :merge-tree merge-tree
                     :base-ancestor? true}
              native {:repository "owner/repo" :pr-number 7 :run-id 99 :run-attempt 1}
              manifest {:schema "open-hax.review-input/v1" :base_sha base :head_sha head
                        :diff_base_sha diff-base
                        :full_diff {:path "basehead.diff" :bytes (.-length diff) :sha256 (sha256 diff)}
                        :preview {:path "pr.diff" :limit_bytes 300000 :truncated false}
                        :provenance {:repository "owner/repo" :pull_request "7" :run_id "99"
                                     :run_attempt "1" :workflow_sha (repeated 40 "a")
                                     :workflow_ref "owner/repo/.github/workflows/opencode-code-review.yml@refs/heads/main"}}
              archive-diff {:base64 (.toString diff "base64") :size (.-length diff) :sha256 (sha256 diff)}]
          ;; These local settings attempt candidate-selected process execution.
          (write! root "poison-textconv.sh" (str "#!/bin/sh\ntouch " canary "\ncat\n"))
          (.chmodSync fs (.join path root "poison-textconv.sh") 493)
          (git! root ["config" "diff.external" (.join path root "poison-textconv.sh")])
          (git! root ["config" "diff.poison.textconv" (.join path root "poison-textconv.sh")])
          (git! root ["config" "core.hooksPath" (.join path root "hooks")])
          {:root root :canary canary :tuple tuple :native-context native :manifest manifest
           :archive-diff archive-diff :diff diff :diff-base diff-base :merge merge}))
      (catch :default e
        (.rmSync fs root #js {:recursive true :force true})
        (throw e)))))

(defn ^:async reconstruct [request]
  (if-let [f (resolve 'eta-mu.infra.review-source/reconstruct!)]
    (await (f request))
    {:status :unimplemented :code :source-port-missing}))

(defn request [f]
  {:object-store (git-dir (:root f)) :tuple (:tuple f) :native-context (:native-context f)
   :manifest (:manifest f) :archive-diff (:archive-diff f)
   :bounds {:output-bytes 10485760 :operation-ms 10000}})

(defn ^:async real-history-controls [done]
  (let [f (fixture!)]
    (try
      (let [observed (await (reconstruct (request f)))]
        (is (= :observed (:status observed)))
        (is (= (:diff-base f) (:diff-base-sha observed)))
        (is (= (.-length (:diff f)) (:bytes (:full-diff observed))))
        (is (= (sha256 (:diff f)) (:sha256 (:full-diff observed))))
        (is (= (.toString (:diff f) "base64") (:content-base64 observed)))
        (is (= (:manifest f) (:expected-manifest observed)))
        (is (false? (:complete? observed)) "missing original event/source custody stays incomplete")
        (is (some #{:original-event-sha :caller-workflow-source-custody} (:missing observed)))
        (is (false? (.existsSync fs (:canary f))) "diff must not execute external/textconv drivers")
        (is (= (:merge-sha (:tuple f)) (get-in observed [:native-provenance :merge-sha])))
        (is (= "sha256" (get-in observed [:git-provenance :object-format])))
        (is (= "--no-textconv" (some #(when (= "--no-textconv" %) %) (get-in observed [:git-provenance :diff-argv])))))
      (catch :default e (is false (str e)))
      (finally (.rmSync fs (:root f) #js {:recursive true :force true}) (done)))))

(deftest full-raw-input-is-reconstructed-from-real-immutable-objects
  (async done (real-history-controls done)))

(deftest portable-source-contracts-support-sha1-sha256-and-refuse-bad-topology
  (let [oid (repeated 40 "a") oid2 (repeated 64 "b")
        tuple {:base-sha oid :head-sha oid :merge-sha oid :head-tree oid :merge-tree oid
               :merge-parents [oid oid] :base-ancestor? true}
        manifest {:schema "open-hax.review-input/v1" :base_sha oid :head_sha oid :diff_base_sha oid
                  :full_diff {:path "basehead.diff" :bytes 0 :sha256 (repeated 64 "c")}
                  :provenance {}}]
    (is (law/tuple? tuple))
    (is (law/tuple? (assoc tuple :base-sha oid2 :merge-parents [oid2 oid2])))
    (is (law/topology? tuple))
    (is (not (law/topology? (assoc tuple :merge-parents [oid (repeated 40 "d")]))))
    (is (not (law/topology? (assoc tuple :merge-tree (repeated 40 "e")))))
    (is (not (law/topology? (assoc tuple :base-ancestor? false))))
    (is (law/manifest? manifest))
    (is (not (law/manifest? (assoc manifest :schema "other"))))
    (is (not (law/manifest? (assoc-in manifest [:full_diff :path] "../basehead.diff"))))
    (is (law/bounds? {:output-bytes 1 :operation-ms 1}))
    (is (not (law/bounds? {:output-bytes 0 :operation-ms 1})))
    (is (not (law/bounds? {:output-bytes (inc law/maximum-output-bytes) :operation-ms 1})))
    (is (not (law/bounds? {:output-bytes 1 :operation-ms (inc law/maximum-operation-ms)})))))

(defmethod test/report [::test/default :end-run-tests] [result]
  (when-not (test/successful? result) (set! (.-exitCode js/process) 1)))
(when (.existsSync fs "packages/eta-mu/src/cljs/eta_mu/infra/review_source.cljs")
  (nbb/await (nbb/load-file "packages/eta-mu/src/cljs/eta_mu/infra/review_source.cljs")))
(test/run-tests 'opencode-review-source-test)
