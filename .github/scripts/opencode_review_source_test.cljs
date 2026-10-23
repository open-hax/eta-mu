;; SPDX-License-Identifier: GPL-3.0-or-later
(ns opencode-review-source-test
  "Read-only Git object reconstruction controls; inert fixture facts confer no native authority."
  (:require [cljs.test :as test :refer [async deftest is]]
            [clojure.string :as str]
            [nbb.core :as nbb]
            [eta-mu.law.review-source :as law]
            [eta-mu.domain.review-verification :as verification]
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

(defn fixture!
  ([] (fixture! "sha1"))
  ([format]
  (let [root (.mkdtempSync fs (.join path (.tmpdir os) "eta-review-source-"))
        canary (.join path root "textconv-ran")
        hook-canary (.join path root "hook-ran")]
    (try
      (git! root (cond-> ["init" "-b" "main"] (= format "sha256") (conj "--object-format=sha256")))
      (git! root ["config" "user.name" "Fixture"])
      (git! root ["config" "user.email" "fixture@example.invalid"])
      (let [object-format (git! root ["rev-parse" "--show-object-format"])]
      (write! root "base.txt" "base\n")
      (git! root ["add" "--all"])
      (git! root ["commit" "-m" "base"])
      (let [base (git! root ["rev-parse" "HEAD"])
            base-tree (git! root ["rev-parse" "HEAD^{tree}"])]
        (write! root ".gitattributes" "*.txt diff=poison\n")
        (write! root "base.txt" "changed λμ\nlast-without-newline")
        (write! root "目录/new\nline.bin" (.from js/Buffer (clj->js [0 255 10 128 13 10])))
        (git! root ["add" "--all"])
        (git! root ["commit" "-m" "head"])
        (let [head (git! root ["rev-parse" "HEAD"])
              head-tree (git! root ["rev-parse" "HEAD^{tree}"])
              merge (git! root ["commit-tree" head-tree "-p" base "-p" head "-m" "test merge"])
              wrong-parent-merge (git! root ["commit-tree" head-tree "-p" head "-m" "wrong parent"])
              wrong-tree-merge (git! root ["commit-tree" base-tree "-p" base "-p" head "-m" "wrong tree"])
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
              archive-diff {:base64 (.toString diff "base64") :size (.-length diff) :sha256 (sha256 diff)}
              preview-bytes (if (> (.-length diff) 300000)
                              (.concat js/Buffer #js [(.subarray diff 0 300000)
                                                      (.from js/Buffer
                                                             (str "\n[eta-mu review] diff truncated at 300000 bytes (was "
                                                                  (.-length diff) ").\n") "utf8")])
                              diff)
              archive-preview {:base64 (.toString preview-bytes "base64")
                               :size (.-length preview-bytes) :sha256 (sha256 preview-bytes)}]
          ;; These local settings attempt candidate-selected process execution.
          (write! root "poison-textconv.sh" (str "#!/bin/sh\ntouch " canary "\ncat\n"))
          (.chmodSync fs (.join path root "poison-textconv.sh") 493)
          (write! root "hooks/pre-commit" (str "#!/bin/sh\ntouch " hook-canary "\nexit 1\n"))
          (.chmodSync fs (.join path root "hooks/pre-commit") 493)
          (git! root ["config" "diff.external" (.join path root "poison-textconv.sh")])
          (git! root ["config" "diff.poison.textconv" (.join path root "poison-textconv.sh")])
          (git! root ["config" "core.hooksPath" (.join path root "hooks")])
          {:root root :canary canary :hook-canary hook-canary
           :tuple tuple :native-context native :manifest manifest
           :archive-diff archive-diff :archive-preview archive-preview :diff diff
           :diff-base diff-base :merge merge :wrong-parent-merge wrong-parent-merge
           :wrong-tree-merge wrong-tree-merge :object-format object-format})))
      (catch :default e
        (.rmSync fs root #js {:recursive true :force true})
        (throw e))))))

(defn ^:async reconstruct [request]
  (if-let [f (resolve 'eta-mu.infra.review-source/reconstruct!)]
    (await (f request))
    {:status :unimplemented :code :source-port-missing}))

(defn request [f]
  {:object-store (git-dir (:root f)) :tuple (:tuple f) :native-context (:native-context f)
   :manifest (:manifest f) :archive-diff (:archive-diff f) :archive-preview (:archive-preview f)
   :bounds {:output-bytes 10485760 :operation-ms 10000}})

(defn ^:async real-history-controls [done]
  (let [f (fixture!)]
    (try
      (let [observed (await (reconstruct (request f)))]
        (is (= :observed (:status observed)) (pr-str observed))
        (is (= (:diff-base f) (:diff-base-sha observed)))
        (is (= (.-length (:diff f)) (:bytes (:full-diff observed))))
        (is (= (sha256 (:diff f)) (:sha256 (:full-diff observed))))
        (is (= (.toString (:diff f) "base64") (:full-diff-base64 observed)))
        (is (= (:diff-base f) (get-in observed [:manifest :diff_base_sha])))
        (is (= (get-in f [:manifest :provenance :repository])
               (get-in observed [:manifest :provenance :repository])))
        (is (nil? (get-in observed [:manifest :provenance :workflow_sha]))
            "unavailable workflow source provenance must not be copied from the artifact")
        (is (false? (:complete? observed)) "missing original event/source custody stays incomplete")
        (is (some #{:original-event-sha :caller-workflow-source-custody} (:missing observed)))
        (is (false? (.existsSync fs (:canary f))) "diff must not execute external/textconv drivers")
        (is (false? (.existsSync fs (:hook-canary f))) "object inspection must not execute hooks")
        (is (= (:merge-sha (:tuple f)) (get-in observed [:native-provenance :tuple :merge-sha])))
        (is (= (:object-format f) (get-in observed [:git-provenance :object-format])))
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

(defn ^:async refusal-controls [done]
  (let [f (fixture!)
        req (request f)
        bad-merge (repeated 40 "f")
        other-diff (.from js/Buffer "candidate-authored-diff" "utf8")
        bad-archive {:base64 (.toString other-diff "base64") :size (.-length other-diff)
                     :sha256 (sha256 other-diff)}
        cases [[(assoc-in req [:tuple :merge-parents] [(:base-sha (:tuple f)) (repeated 40 "f")]) :source-topology]
               [(assoc-in req [:tuple :merge-sha] (:wrong-parent-merge f)) :source-topology]
               [(assoc-in req [:tuple :merge-sha] (:wrong-tree-merge f)) :source-topology]
               [(assoc-in req [:tuple :merge-tree] (repeated 40 "e")) :source-topology]
               [(assoc-in req [:tuple :base-ancestor?] false) :source-topology]
               [(assoc-in req [:tuple :merge-sha] bad-merge) :source-object]
               [(assoc-in req [:tuple :head-sha] "--upload-pack=touch") :source-request]
               [(assoc-in req [:manifest :head_sha] (repeated 40 "f")) :source-manifest-mismatch]
               [(assoc req :archive-diff bad-archive) :source-archive-mismatch]
               [(assoc req :object-store (.join path (:root f) "missing.git")) :source-object-store]
               [(assoc-in req [:bounds :output-bytes] 100) :source-output-bytes]
               [(assoc-in req [:bounds :operation-ms] 1) :source-time]]]
    (try
      (doseq [[bad expected] cases]
        (let [result (await (reconstruct bad))]
          (is (= :refused (:status result)) (str expected " " (pr-str result)))
          (is (= expected (:code result)) (str "refusal cause " (pr-str result)))
          (is (false? (.existsSync fs (:canary f))))
          (is (false? (.existsSync fs (:hook-canary f))))))
      (let [native-stale (assoc-in req [:native-context :run-id] 100)
            manifest-stale (assoc-in req [:manifest :provenance :run_id] "100")
            preview-stale (assoc-in req [:archive-preview :sha256] (repeated 64 "f"))]
        (doseq [bad [native-stale manifest-stale preview-stale]]
          (is (= :refused (:status (await (reconstruct bad)))))))
      (catch :default e (is false (str e)))
      (finally (.rmSync fs (:root f) #js {:recursive true :force true}) (done)))))

(deftest immutable-object-and-archive-mismatches-refuse-without-execution
  (async done (refusal-controls done)))

(defn ^:async sha256-object-control [done]
  (let [f (fixture! "sha256")]
    (try
      (let [observed (await (reconstruct (request f)))]
        (is (= :observed (:status observed)) (pr-str observed))
        (is (= "sha256" (get-in observed [:git-provenance :object-format])))
        (is (= 64 (count (:head-sha (:tuple f)))))
        (is (false? (:complete? observed))))
      (catch :default e (is false (str e)))
      (finally (.rmSync fs (:root f) #js {:recursive true :force true}) (done)))))

(deftest sha256-object-format-is-supported-when-git-supports-it
  (async done (sha256-object-control done)))

(defn ^:async empty-diff-control [done]
  (let [f (fixture!)
        base (:base-sha (:tuple f))
        tree (git! (:root f) ["rev-parse" (str base "^{tree}")])]
    (try
      (let [head (git! (:root f) ["commit-tree" tree "-p" base "-m" "no-change head"])
            merge (git! (:root f) ["commit-tree" tree "-p" base "-p" head "-m" "empty review input"])
            hash (sha256 (.alloc js/Buffer 0))
            preview {:base64 "" :size 0 :sha256 hash}
            manifest (-> (:manifest f)
                         (assoc :base_sha base :head_sha head :diff_base_sha base)
                         (assoc :full_diff {:path "basehead.diff" :bytes 0 :sha256 hash}))
            request (-> (request f)
                        (assoc :manifest manifest :archive-diff preview :archive-preview preview)
                        (assoc :tuple (assoc (:tuple f) :base-sha base :head-sha head :merge-sha merge
                                             :head-tree tree :merge-tree tree
                                             :merge-parents [base head] :base-ancestor? true)))
            observed (await (reconstruct request))]
        (is (= :observed (:status observed)) (pr-str observed))
        (is (= 0 (get-in observed [:full-diff :bytes])))
        (is (= hash (get-in observed [:full-diff :sha256])))
        (is (= "" (:full-diff-base64 observed))))
      (catch :default e (is false (str e)))
      (finally (.rmSync fs (:root f) #js {:recursive true :force true}) (done)))))

(deftest empty-diff-is-a-complete-byte-observation
  (async done (empty-diff-control done)))

(defn ^:async executable-resolution-control [done]
  (let [f (fixture!)
        previous-path (aget (.-env js/process) "PATH")
        bin (.join path (:root f) "fake-bin")
        marker (.join path (:root f) "fake-git-ran")
        fake (.join path bin "git")]
    (try
      (.mkdirSync fs bin #js {:recursive true})
      (write! (:root f) "fake-bin/git"
              (str "#!/bin/sh\ntouch " marker "\nexec /usr/bin/git \"$@\"\n"))
      (.chmodSync fs fake 493)
      (aset (.-env js/process) "PATH" (str bin ":/usr/bin:/bin"))
      (let [observed (await (reconstruct (request f)))]
        (is (= :observed (:status observed)) (pr-str observed))
        (is (false? (.existsSync fs marker))
            "trusted Git execution must not resolve the executable through inherited PATH")
        (is (= "/usr/bin/git" (get-in observed [:git-provenance :executable]))))
      (catch :default e (is false (str e)))
      (finally
        (aset (.-env js/process) "PATH" previous-path)
        (.rmSync fs (:root f) #js {:recursive true :force true})
        (done)))))

(deftest inherited-path-cannot-select-the-git-executable
  (async done (executable-resolution-control done)))

(defn ^:async malformed-header-control [done]
  (let [f (fixture!) root (:root f) req (request f) tuple (:tuple f)]
    (try
      (let [raw (git! root ["cat-file" "commit" (:merge-sha tuple)])
            separator (.indexOf raw "\n\n")
            header (subs raw 0 separator)
            rows (str/split header #"\n")
            tree-line (first (filter #(str/starts-with? % "tree ") rows))
            parent-line (first (filter #(str/starts-with? % "parent ") rows))
            cases [[(conj (vec rows) "parent not-an-object-id") "malformed parent"]
                   [(conj (vec rows) tree-line) "duplicate tree"]
                   [(conj (vec rows) parent-line) "duplicate parent"]]]
        (doseq [[bad-header label] cases]
          (let [rewritten (str (str/join "\n" bad-header) (subs raw separator))
                result (.spawnSync cp "git" #js ["-C" root "hash-object" "-t" "commit" "-w" "--stdin"]
                                   #js {:input rewritten :encoding "utf8" :timeout 10000 :maxBuffer 1048576
                                        :env #js {:PATH "/usr/bin:/bin" :HOME root
                                                  :GIT_CONFIG_NOSYSTEM "1" :GIT_CONFIG_GLOBAL "/dev/null"}})
                altered (assoc-in req [:tuple :merge-sha] (.trim (.-stdout result)))
                observed (await (reconstruct altered))]
            (is (= 0 (.-status result)) (str label " fixture write"))
            (is (= :refused (:status observed)) (str label " " (pr-str observed)))
            (is (= :source-object (:code observed)) (str label " must fail at object parsing"))))
        (let [extended (str header "\ngpgsig -----BEGIN PGP SIGNATURE-----\n signed-body"
                            "\nx-extra preserved-value" (subs raw separator))
              result (.spawnSync cp "git" #js ["-C" root "hash-object" "-t" "commit" "-w" "--stdin"]
                                 #js {:input extended :encoding "utf8" :timeout 10000 :maxBuffer 1048576
                                      :env #js {:PATH "/usr/bin:/bin" :HOME root
                                                :GIT_CONFIG_NOSYSTEM "1" :GIT_CONFIG_GLOBAL "/dev/null"}})
              altered (assoc-in req [:tuple :merge-sha] (.trim (.-stdout result)))
              observed (await (reconstruct altered))]
          (is (= 0 (.-status result)) "extended-header fixture write")
          (is (= :observed (:status observed))
              "valid multiline signature and additional headers remain accepted")))
      (catch :default e (is false (str e)))
      (finally (.rmSync fs root #js {:recursive true :force true}) (done)))))

(deftest malformed-structural-commit-headers-refuse-but-extra-headers-survive
  (async done (malformed-header-control done)))

(defn ^:async native-execution-custody-controls [done]
  (let [f (fixture!)
        base (request f)
        coordinates (-> base
                        (assoc-in [:tuple :event-sha] (repeated 40 "f"))
                        (assoc-in [:native-context :workflow-sha] (repeated 40 "a"))
                        (assoc-in [:native-context :workflow-ref]
                                  "owner/repo/.github/workflows/caller.yml@refs/pull/7/merge"))
        claim {:verified? true :authenticated? true :status :verified :origin :github}
        cases [[:absent base false]
               [:coordinate-strings-only coordinates true]
               [:top-level-claim (assoc coordinates :native-execution-custody claim) true]
               [:nested-claim (assoc-in coordinates [:native-context :native-execution-custody] claim) true]
               [:boolean-claim (assoc coordinates :native-execution-custody true) true]
               [:claimed-completion (assoc coordinates :complete? true :missing []
                                           :native-execution-custody {:verified? true :capability :caller-supplied}) true]]]
    (try
      (doseq [[label input coordinates?] cases]
        (let [observed (await (reconstruct input))
              now (.now js/Date)]
          (is (= :observed (:status observed)) (str label " " (pr-str observed)))
          (is (false? (:complete? observed)) (str label " has no admitted native execution capability"))
          (is (some #{:native-execution-custody} (:missing observed))
              (str label " must retain missing authenticated custody independently of coordinate shape"))
          (is (= (not coordinates?) (boolean (some #{:original-event-sha} (:missing observed))))
              (str label " coordinate presence and authentication are distinct"))
          (is (= (not coordinates?) (boolean (some #{:caller-workflow-source-custody} (:missing observed))))
              (str label " caller coordinates remain a separate structural observation"))
          (is (= (.toString (:diff f) "base64") (:full-diff-base64 observed)))
          (is (= (sha256 (:diff f)) (get-in observed [:full-diff :sha256])))
          (is (nil? (get-in observed [:manifest :provenance :workflow_sha]))
              "Untrusted archive/request claims cannot populate independently expected workflow provenance")
          (is (= :native-reconstruction-incomplete
                 (verification/reconstruction-error observed {:expires-at-ms (+ now 60000)}
                                                    now {:observation-max-age-ms 300000}))
              (str label " existing verification admission gate refuses this partial source"))
          (is (not (contains? observed :verification)))
          (is (false? (.existsSync fs (:canary f))))
          (is (false? (.existsSync fs (:hook-canary f))))))
      (let [invalid (await (reconstruct (assoc-in coordinates [:tuple :event-sha] :unknown)))]
        (is (= :refused (:status invalid)))
        (is (= :source-request (:code invalid)) "The existing event-SHA shape restriction remains"))
      (catch :default e (is false (str e)))
      (finally (.rmSync fs (:root f) #js {:recursive true :force true}) (done)))))

(deftest actual-source-coordinates-and-caller-flags-never-clear-native-execution-custody
  (async done (native-execution-custody-controls done)))

(defmethod test/report [::test/default :end-run-tests] [result]
  (when-not (test/successful? result) (set! (.-exitCode js/process) 1)))
(when (.existsSync fs "packages/eta-mu/src/cljs/eta_mu/infra/review_source.cljs")
  (nbb/await (nbb/load-file "packages/eta-mu/src/cljs/eta_mu/infra/review_source.cljs")))
(test/run-tests 'opencode-review-source-test)
