;; SPDX-License-Identifier: GPL-3.0-or-later
(ns opencode-actionability-assessment-test
  "Inert complete native records; no GitHub, model, token or live write."
  (:require [eta-mu.infra.actionability-assessment :as assessment]
            [eta-mu.extern.actionability-host :as host]
            [pr-flow.actionability :as actionability]
            ["node:fs" :as fs] ["node:path" :as path] ["node:os" :as os]
            ["node:module" :as module] ["node:crypto" :as crypto]
            ["node:child_process" :as child-process] [clojure.string :as str]))

(def checks (atom 0))
(defn check [label actual expected]
  (swap! checks inc)
  (when-not (= actual expected) (throw (ex-info label {:actual actual :expected expected}))))
(defn refused [f]
  (try (f) nil (catch :default e (or (:code (ex-data e)) :decoded-source-refusal))))
(def tools ["review_begin" "review_read_diff_chunk" "review_assess_diff_chunk"
            "review_record_evidence" "review_propose_finding" "review_classify_finding" "review_status" "review_submit"])
(def stages ["deterministic" "map-change" "generate-candidates" "adversarial-validate" "publish"])
(def bot {:login "eta-mu-ai[bot]" :id 270021952 :node_id "BOT_kgDOEBg1QA" :type "Bot"})
(def fixture (first (:snapshots (host/read-json (host/env "ACTIONABILITY_NATIVE_FIXTURE")))))
(def policy (:flow/defaults (host/read-edn (host/env "ACTIONABILITY_POLICY_FILE"))))
(def repository (:repository fixture))
(def native-pr (:pr fixture))
(def provenance {:repository "open-hax/eta-mu" :pull_request "387" :run_id "31" :run_attempt "1"
                 :workflow_sha (apply str (repeat 40 "d"))
                 :workflow_ref "open-hax/eta-mu/.github/workflows/opencode-actionability-assessment.yml@refs/heads/main"})
(def config {:repo (:nameWithOwner repository) :repository-database-id (:databaseId repository)
             :pr-number (:number native-pr) :head (:headRefOid native-pr) :thread-id (get-in fixture [:thread :id])
             :policy policy :provenance provenance})
(def inventory {:head (:head config) :sha256 (host/sha256 "inert immutable source inventory")
                :files [{:path "src/inert.cljc" :text ";; inert selected source only"}]})

(defn reader [state & args]
  (case (second args)
    "graphql" {:data {:repository (assoc (:repository @state) :pullRequest
                                   (assoc (:pr @state) :reviewThreads
                                          {:nodes [(:thread @state)] :pageInfo {:hasNextPage false :endCursor nil}}))}}
    "repos/open-hax/knoxx/issues/387/comments" [(:issues @state)]
    "repos/open-hax/knoxx/collaborators/riatzukiza/permission" {:permission (:permission @state)}
    (throw (ex-info "Unexpected inert read" {:args args}))))
(defn issue [id user time body]
  {:id id :node_id (str "IC_fixture_" id) :user user :body body :created_at time :updated_at time
   :html_url (str "https://github.com/open-hax/knoxx/pull/387#issuecomment-" id)})
(defn setup []
  (let [state (atom (assoc fixture :issues [] :permission "write"))
        deps {:read-json (partial reader state) :history-text ""}
        thread (:selected (assessment/collect deps config))
        binding (actionability/context-binding thread)
        author (:author native-pr)
        proposal (issue 7001 {:login (:login author) :id (:databaseId author) :node_id (:id author) :type "User"}
                        "2026-10-11T01:00:00Z"
                        (str "Actionability proposal v1 for " (:head config) ":\n" (pr-str binding)))
        _ (swap! state assoc :issues [proposal])
        selected (:selected (assessment/collect deps config))
        summary (str "Actionability assessment v1 for " (:head config) ":\n"
                     (pr-str (into binding [7001 (host/sha256 (:body proposal)) "informational"
                              "complete-context/no-defect/no-request/no-question"
                              "Inert independent test assessment of all complete native context and selected immutable source; no defect, request or question."
                              "The original native body, exact hunk and src/inert.cljc are test evidence only."])))
        prospective (actionability/assessment-publication selected summary bot)]
    (check "real canonical prospective API supports the explicitly synthetic unresolved case" (:eligible? prospective) true)
    {:state state :deps deps :summary summary :prospective prospective}))

(defn invocation-fixture [snapshot summary directory]
  (let [input (assessment/prepare-input snapshot inventory 7001 provenance)
        file (host/env "ETA_MU_ACTIONABILITY_VERIFIER_FILE")
        sha (host/env "ETA_MU_ACTIONABILITY_VERIFIER_SHA256")
        _ (check "actual candidate CJS identity" (host/sha256 (host/read-bytes file)) sha)
        require (.createRequire module file) verifier (require file)
        submission-file (host/join directory "submission.json")
        context (.prepareReviewInvocationContext verifier (:text input) (host/json (:manifest input)) (clj->js tools) submission-file)
        pages (js->clj (.-pages context) :keywordize-keys true)
        notes (mapv #(assoc % :note (str "Inert complete native carrier page " (:id %) ".")) pages)
        source (:manifest input)
        submission {:schema "open-hax.github-review/v1" :event "COMMENT" :comments [] :summary summary
                    :input-source source :input-assessments notes
                    :input-coverage {:chunks (count pages) :delivered (count pages) :assessed (count pages) :missing []}}
        events (atom []) session "inert-native-host-session"
        call! (fn [tool input output]
                (let [n (inc (count @events))]
                  (swap! events conj {:type "tool_use" :timestamp n :sessionID session
                                     :part {:type "tool" :id (str "part-" n) :callID (str "call-" n) :sessionID session :tool tool
                                            :state {:status "completed" :input input :output (host/json output)}}})))
        text (:text input)]
    (call! "review_begin" {} {:ok? true :stage (first stages) :stages stages :input-source source
                             :diff-stats {:files 1 :bytes (count text) :truncated? false}
                             :input-coverage {:chunks (count pages) :delivered 0 :assessed 0 :missing (mapv :id pages)}})
    (doseq [[i p] (map-indexed vector pages)]
      (call! "review_read_diff_chunk" {:id (:id p)} {:ok? true :chunk (assoc p :text (subs text (:start p) (:end p)))})
      (call! "review_assess_diff_chunk" {:id (:id p) :note (:note (nth notes i))}
             {:ok? true :chunk-id (:id p) :coverage {:chunks (count pages) :delivered (inc i) :assessed (inc i)
                                                  :missing (mapv :id (subvec notes (inc i)))}}))
    (doseq [stage stages] (call! "review_record_evidence" {:stage stage :note "Inert completed stage."} {:ok? true}))
    (call! "review_submit" {:summary summary} {:ok? true :event "COMMENT" :file submission-file :inline-comments 0})
    (swap! events conj {:type "step_finish" :timestamp (inc (count @events)) :sessionID session
                       :part {:type "step-finish" :id "stop" :sessionID session :reason "stop"}})
    (let [response (str (apply str (map #(str (host/json %) "\n") @events)))
          raw (.verifyReviewInvocation verifier response (host/json submission) context)
          verdict (js->clj raw :keywordize-keys true)
          accepted {:attempt 1 :session_id session :response_file "model-response-attempt-1.txt" :submission_file "submission.json"
                    :verifier_sha256 sha :response_sha256 (host/sha256 response) :submission_sha256 (host/sha256 (host/json submission))
                    :expected_context_sha256 (host/sha256 (js/JSON.stringify context)) :canonical_verdict verdict}]
      (check "actual Muse strict trace accepts complete inert pages/stages/terminal" (:ok verdict) true)
      (doseq [[name content] [["actionability-input.txt" text] ["input-manifest.json" (host/json source)]
                             ["tools.txt" (str (str/join "\n" tools) "\n")]
                             ["submission.json" (host/json submission)] ["model-response-attempt-1.txt" response]
                             ["recovery.json" (host/json {:schema "open-hax.review-recovery/v1" :max_attempts 2
                                                         :attempts [{:attempt 1 :invocation_state "completed" :exit_code 0}]
                                                         :accepted_invocation accepted})]]]
        (host/write-text! (host/join directory name) content))
      (host/invocation directory file sha))))

(defn public-proof []
  (host/publisher-proof
   (fn [_ resource] (case resource "app" {:id 1 :slug "eta-mu-ai"}
                         "app/installations/2" {:id 2 :app_id 1 :permissions {:issues "write"}}))
   (fn [_ resource & _] (case resource "installation/repositories" [{:total_count 1 :repositories [{:id (:databaseId repository) :full_name (:nameWithOwner repository)}]}]
                               "users/eta-mu-ai[bot]" bot)) "1" "2" "eta-mu-ai"))

(defn ^:async publish-case [change expected-writes expect-success?]
  (let [{:keys [state deps summary]} (setup)
        directory (.mkdtempSync fs (.join path (.tmpdir os) "eta-native-publication-"))
        writes (atom []) gets (atom [])]
    (try
      (let [snapshot (assessment/collect deps config)
            invocation (invocation-fixture snapshot summary directory)
            dependencies (assoc deps :verify-sources! (fn [] true) :verify-run! (fn [] true)
                                :verify-invocation! #(host/invocation directory (host/env "ETA_MU_ACTIONABILITY_VERIFIER_FILE") (host/env "ETA_MU_ACTIONABILITY_VERIFIER_SHA256"))
                                :corrupt-response! #(.appendFileSync fs (host/join directory "model-response-attempt-1.txt") "broken terminal bytes\n")
                                :corrupt-submission! #(.appendFileSync fs (host/join directory "submission.json") "not JSON")
                                :corrupt-full-input! #(.appendFileSync fs (host/join directory "actionability-input.txt") "changed raw input bytes")
                                :inventory! (fn [] inventory)
                                :accepted-sha256 (:accepted-sha256 invocation) :publisher-proof! public-proof
                                :post! (fn [repo n body]
                                         (swap! writes conj [repo n body])
                                         (let [record (issue 7002 bot "2026-10-11T01:01:00Z" body)]
                                           (swap! state update :issues conj record)
                                           {:outcome :posted :record record}))
                                :get-comment! (fn [id] (swap! gets conj id) (first (filter #(= id (:id %)) (:issues @state)))))
            [modified cfg] (change dependencies config state)
            result (try {:value (await (assessment/publish modified cfg))}
                        (catch :default e {:refused (or (:code (ex-data e)) :decoded-source-refusal)}))]
        (check "publication write count" (count @writes) expected-writes)
        (check "publication success/refusal" (contains? result :value) expect-success?)
        (when expect-success?
          (check "actual canonical readback qualified" (get-in result [:value :status]) :qualified)
          (check "unresolved conversation remains unresolved" (get-in result [:value :resolved?]) false)
          (check "unresolved conversation remains unsettled" (get-in result [:value :settled?]) false)
          (check "zero native resolution credit" (get-in result [:value :native-resolution-performed]) false)
          (check "zero ordinary review credit" (get-in result [:value :review-credit]) false)
          (check "actual GET readback" @gets [7002]))
        result)
      (finally (.rmSync fs directory #js {:recursive true :force true})))))

(def adverse-controls [(fn [d c _] [(assoc d :history-text nil) c])
                  (fn [d c _] [(assoc d :history-text "{:broken") c])
                  (fn [d c _] [d (assoc c :head (apply str (repeat 40 "f")))])
                  (fn [d c _] [d (assoc c :repository-database-id 1)])
                  (fn [d c _] [d (assoc c :thread-id "unknown")])
                  (fn [d c s] (swap! s assoc :permission "read") [d c])
                  (fn [d c s] (swap! s assoc-in [:thread :comments :pageInfo :hasNextPage] true) [d c])
                  (fn [d c s] (swap! s assoc-in [:thread :comments :nodes 0 :body] "A real defect; fix it.") [d c])
                  (fn [d c s] (swap! s update-in [:issues 0 :body] str " changed") [d c])
                  (fn [d c _] ((:corrupt-response! d)) [d c])
                  (fn [d c _] ((:corrupt-submission! d)) [d c])
                  (fn [d c _] ((:corrupt-full-input! d)) [d c])
                  (fn [d c _] [(assoc d :accepted-sha256 (apply str (repeat 64 "0"))) c])
                  (fn [d c _] [(update d :verify-invocation! (fn [v] #(assoc-in (v) [:source :context_sha256] (apply str (repeat 64 "0"))))) c])
                  (fn [d c _] [(assoc d :inventory! #(assoc inventory :sha256 (host/sha256 "changed"))) c])
                  (fn [d c _] [(update d :verify-invocation! (fn [v] #(assoc-in (v) [:submission :summary] "unsupported positive prose"))) c])
                  (fn [d c _] [(update d :verify-invocation! (fn [v] #(assoc-in (v) [:submission :comments] [{:body "A genuine confirmed finding remains adverse"}]))) c])
                  (fn [d c _] [(assoc d :publisher-proof! #(assoc (public-proof) :user (assoc bot :id 3))) c])
                  (fn [d c _] [(assoc d :publisher-proof! #(assoc (public-proof) :repositories [])) c])
                  (fn [d c _] [(assoc d :verify-run! #(host/refuse! :host-run-source)) c])
                  (fn [d c _] [(assoc d :verify-sources! #(host/refuse! :source-pin)) c])])

(defn ^:async check-adverse [remaining]
  (if-let [mutate (first remaining)]
    (let [_ (await (publish-case mutate 0 false))]
      (await (check-adverse (next remaining))))
    :complete))

(defn run-controls []
  (let [sha (apply str (repeat 40 "d"))
        cfg {:run-repo "open-hax/eta-mu" :run-id 31 :run-attempt 1 :workflow-sha sha :eta-revision sha :direct? true
             :workflow-ref "open-hax/eta-mu/.github/workflows/opencode-actionability-assessment.yml@refs/heads/main"
             :job-workflow-sha sha
             :job-workflow-ref "open-hax/eta-mu/.github/workflows/opencode-actionability-assessment.yml@refs/heads/main"
             :prepare-check-run-id 101 :assess-check-run-id 102}
        facts {"repos/open-hax/eta-mu" {:id 5 :full_name "open-hax/eta-mu" :default_branch "main"}
               "repos/open-hax/eta-mu/actions/runs/31" {:id 31 :run_attempt 1 :head_sha sha :repository {:id 5 :full_name "open-hax/eta-mu"}}
               "repos/open-hax/eta-mu/branches/main" {:protected true :commit {:sha sha}}
               "repos/open-hax/eta-mu/actions/runs/31/attempts/1/jobs"
               [{:jobs [{:name "Prepare actionability input" :status "completed" :conclusion "success"
                         :run_id 31 :check_run_url "https://api.github.com/repos/open-hax/eta-mu/check-runs/101"}
                        {:name "Assess complete actionability input" :status "completed" :conclusion "success"
                         :run_id 31 :check_run_url "https://api.github.com/repos/open-hax/eta-mu/check-runs/102"}]}]}
        read (fn [f] (fn [_ resource & _] (get f resource)))]
    (check "actual-shaped direct default protected run binding" (host/verify-run! (read facts) cfg true) nil)
    (let [called (assoc cfg :direct? false)
          referenced [{:sha sha :path (str "open-hax/eta-mu/.github/workflows/opencode-actionability-assessment.yml@" sha)}]
          called-facts (-> facts
                           (assoc-in ["repos/open-hax/eta-mu/actions/runs/31" :referenced_workflows] referenced)
                           (assoc (str "repos/open-hax/eta-mu/compare/" sha "...main") {:status "identical"}))
          foreign (assoc called :run-repo "open-hax/knoxx")
          foreign-facts (assoc called-facts
                              "repos/open-hax/knoxx" {:id 9 :full_name "open-hax/knoxx"}
                              "repos/open-hax/knoxx/actions/runs/31"
                              {:id 31 :run_attempt 1 :repository {:id 9 :full_name "open-hax/knoxx"}
                               :referenced_workflows referenced})]
      (check "same owning repository admits exact reusable source" (host/verify-run! (read called-facts) called false) nil)
      (doseq [changed [(assoc called :job-workflow-sha (apply str (repeat 40 "e")))
                       (assoc called :job-workflow-ref "open-hax/eta-mu/.github/workflows/other.yml@refs/heads/main")
                       (assoc called :job-workflow-ref "open-hax/eta-mu/.github/workflows/opencode-actionability-assessment.yml@")
                       (assoc called :job-workflow-sha nil)]]
        (check "a matching sibling aggregate never authenticates the current reusable job"
               (refused #(host/verify-run! (read called-facts) changed false)) :host-run-source))
      (check "foreign caller refuses repository-scoped publication lock bypass"
             (refused #(host/verify-run! (read foreign-facts) foreign false)) :host-run-source))
    (doseq [c [(assoc cfg :run-attempt 2) (assoc cfg :workflow-ref "open-hax/eta-mu/.github/workflows/opencode-actionability-assessment.yml@refs/heads/feature")
               (assoc cfg :eta-revision (apply str (repeat 40 "e")))]]
      (check "wrong host run/source coordinate refuses" (refused #(host/verify-run! (read facts) c true)) :host-run-source))
    (doseq [f [(assoc-in facts ["repos/open-hax/eta-mu/branches/main" :protected] false)
               (assoc-in facts ["repos/open-hax/eta-mu/actions/runs/31" :repository :id] 6)]]
      (check "unprotected or foreign native host binding refuses" (refused #(host/verify-run! (read f) cfg true)) :host-run-source))
    (check "unfinished assessor job refuses before mutation"
           (refused #(host/verify-run! (read (assoc-in facts ["repos/open-hax/eta-mu/actions/runs/31/attempts/1/jobs" 0 :jobs 1 :conclusion] nil)) cfg true))
           :trusted-job-completion)
    (let [resource "repos/open-hax/eta-mu/actions/runs/31/attempts/1/jobs"
          sibling-jobs [{:name "Sibling / Prepare actionability input" :status "completed" :conclusion "success"
                         :run_id 31 :check_run_url "https://api.github.com/repos/open-hax/eta-mu/check-runs/201"}
                        {:name "Sibling / Assess complete actionability input" :status "completed" :conclusion "success"
                         :run_id 31 :check_run_url "https://api.github.com/repos/open-hax/eta-mu/check-runs/202"}]
          multiple (update-in facts [resource 0 :jobs] into sibling-jobs)]
      (check "same-run sibling invocation does not make the exact required jobs ambiguous"
             (host/verify-run! (read multiple) cfg true) nil)
      (doseq [changed [(assoc cfg :prepare-check-run-id nil) (assoc cfg :prepare-check-run-id 0)]]
        (check "missing native prepare coordinate refuses"
               (refused #(host/verify-run! (read multiple) changed true)) :host-run-source))
      (doseq [changed [(assoc cfg :assess-check-run-id nil) (assoc cfg :assess-check-run-id 101)
                       (assoc cfg :assess-check-run-id 999)]]
        (check "missing or mismatched exact assessor coordinate refuses"
               (refused #(host/verify-run! (read multiple) changed true)) :trusted-job-completion))
      (doseq [changed [(assoc-in multiple [resource 0 :jobs 1 :conclusion] "failure")
                       (assoc-in multiple [resource 0 :jobs 1 :run_id] 32)
                       (assoc-in multiple [resource 0 :jobs 1 :check_run_url] "https://api.github.com/repos/open-hax/knoxx/check-runs/102")
                       (update-in multiple [resource 0 :jobs] conj (get-in multiple [resource 0 :jobs 1]))]]
        (check "sibling success cannot replace failed, foreign, absent or duplicated selected evidence"
               (refused #(host/verify-run! (read changed) cfg true)) :trusted-job-completion)))))

(defn ^:async transport-controls []
  (let [calls (atom [])
        fetch (fn [url options]
                (swap! calls conj [url options])
                (js/Promise.resolve
                 (js/Response. (js/ReadableStream. #js {:start (fn [controller]
                                                               (.enqueue controller (js/Buffer.from "{\"id\":"))
                                                               (.enqueue controller (js/Buffer.from "7002}"))
                                                               (.close controller))})
                               #js {:status 201})))
        result (await (host/post-comment! "open-hax/knoxx" 387 "inert body" "inert-token" fetch))]
    (check "asynchronous multi-chunk native response completes" result {:outcome :posted :record {:id 7002}})
    (check "one inert mutation request" (count @calls) 1)
    (check "native mutation target" (ffirst @calls) "https://api.github.com/repos/open-hax/knoxx/issues/387/comments")
    (check "transport does not follow redirects" (.-redirect (second (first @calls))) "error")))

(defn removed-source-controls []
  (let [directory (.mkdtempSync fs (.join path (.tmpdir os) "eta-removed-preimage-"))
        git (fn [& args]
              (let [result (.spawnSync child-process "git"
                                       (clj->js (into ["--no-pager" "-c" "core.hooksPath=/dev/null"
                                                        "-c" "commit.gpgSign=false" "-c" "init.templateDir="
                                                        "-c" "user.name=Inert fixture" "-c" "user.email=inert@example.invalid"
                                                        "-C" directory] args))
                                       #js {:env #js {:PATH (host/env "PATH") :HOME directory :LANG "C.UTF-8"
                                                      :GIT_CONFIG_NOSYSTEM "1" :GIT_CONFIG_GLOBAL "/dev/null"}
                                            :encoding "utf8" :timeout 15000 :maxBuffer 1048576})]
                (when-not (= 0 (.-status result))
                  (throw (ex-info "Owned Git fixture preparation failed" {:args args :status (.-status result)})))
                (str/trim (.-stdout result))))
        original "original merge-base preimage ημ\n"
        collect (fn [head base]
                  (host/source-inventory
                   (fn [_ resource & _]
                     (case resource
                       "repos/synthetic/native-context/pulls/1" {:number 1 :state "open" :head {:sha head} :base {:sha base} :changed_files 2}
                       "repos/synthetic/native-context/pulls/1/files?per_page=100"
                       [[{:filename "gone.cljc" :status "removed"} {:filename "kept.cljc" :status "modified"}]]
                       (throw (ex-info "Unexpected owned inventory read" {:resource resource}))))
                   directory "synthetic/native-context" 1 head))]
    (try
      (.chmodSync fs directory 448)
      (git "init" "--initial-branch=base")
      (.writeFileSync fs (.join path directory "gone.cljc") original)
      (.writeFileSync fs (.join path directory "kept.cljc") "original current file\n")
      (git "add" "--all") (git "commit" "-m" "Owned common ancestor")
      (let [ancestor (git "rev-parse" "HEAD") ancestor-tree (git "rev-parse" "HEAD^{tree}")]
        (git "checkout" "-b" "topic")
        (.unlinkSync fs (.join path directory "gone.cljc"))
        (.writeFileSync fs (.join path directory "kept.cljc") "topic immutable source\n")
        (git "add" "--all") (git "commit" "-m" "Owned removal candidate")
        (let [head (git "rev-parse" "HEAD") topic-tree (git "rev-parse" "HEAD^{tree}")]
          (git "checkout" "base")
          (.writeFileSync fs (.join path directory "gone.cljc") "advancing base changed this file\n")
          (git "add" "--all") (git "commit" "-m" "Owned advancing base")
          (let [base (git "rev-parse" "HEAD")]
            (git "checkout" "--detach" head)
            (let [before (git "status" "--porcelain=v1")
                  index (.readFileSync fs (.join path directory ".git/index")) inventory (collect head base)]
              (check "advancing base preimage uses exact merge base" (:merge-base inventory) ancestor)
              (check "removed source reads ancestor bytes, not changed base bytes" (get-in inventory [:removed-files 0 :text]) original)
              (check "removed preimage byte digest is exact" (get-in inventory [:removed-files 0 :sha256]) (host/sha256 original))
              (check "preimage commit is bound inside aggregate manifest" (get-in inventory [:manifest 7 1]) ancestor)
              (check "inventory keeps native advancing base coordinate" (:base inventory) base)
              (check "current source remains exact candidate bytes" (get-in inventory [:files 0 :text]) "topic immutable source\n")
              (check "inventory does not change selected checkout" (git "rev-parse" "HEAD") head)
              (check "inventory leaves raw fixture index bytes unchanged" (.equals index (.readFileSync fs (.join path directory ".git/index"))) true)
              (check "inventory leaves checkout status unchanged" (git "status" "--porcelain=v1") before)))
          (git "checkout" "base") (.unlinkSync fs (.join path directory "gone.cljc"))
          (git "add" "--all") (git "commit" "-m" "Owned base also removes file")
          (let [base (git "rev-parse" "HEAD")]
            (git "checkout" "--detach" head)
            (check "base-tip removal cannot erase PR preimage" (get-in (collect head base) [:removed-files 0 :text]) original)
            (check "missing base object refuses" (refused #(collect head (apply str (repeat 40 "e")))) :source-object))
          ;; Synthetic criss-cross ancestry has two real merge bases; selecting
          ;; either would claim an unqualified preimage. No product Git is used.
          (let [left (git "commit-tree" ancestor-tree "-p" ancestor "-m" "Owned left")
                right (git "commit-tree" ancestor-tree "-p" ancestor "-m" "Owned right")
                left-merge (git "commit-tree" topic-tree "-p" left "-p" right "-m" "Owned left merge")
                right-merge (git "commit-tree" ancestor-tree "-p" right "-p" left "-m" "Owned right merge")]
            (git "checkout" "--detach" left-merge)
            (check "multiple actual merge bases refuse preimage selection"
                   (refused #(collect left-merge right-merge)) :source-merge-base)
            (check "ambiguous ancestry leaves selected checkout unchanged" (git "rev-parse" "HEAD") left-merge))))
      (finally (.rmSync fs directory #js {:recursive true :force true})))))

(defn immutable-object-controls
  "Owned actual Git objects only; no native call, nested repository or symlink target read."
  []
  (let [directory (.mkdtempSync fs (.join path (.tmpdir os) "eta-immutable-objects-"))
        git (fn [& args]
              (let [result (.spawnSync child-process "git"
                             (clj->js (into ["--no-pager" "-c" "core.fsmonitor=false"
                                            "-c" "user.name=Inert fixture" "-c" "user.email=inert@example.invalid"
                                            "-C" directory] args))
                             #js {:env #js {:PATH (host/env "PATH") :HOME directory :LANG "C.UTF-8"
                                            :GIT_CONFIG_NOSYSTEM "1" :GIT_CONFIG_GLOBAL "/dev/null"}
                                  :encoding "utf8" :timeout 15000 :maxBuffer 1048576})]
                (when-not (= 0 (.-status result))
                  (throw (ex-info "Owned Git object fixture preparation failed" {:args args :status (.-status result)})))
                (str/trim (.-stdout result))))
        binary (js/Buffer.from #js [255 0 128 65])
        link-target "\ufeff../../../inert-dangling-target-must-not-be-opened"
        text "immutable regular ημ\n"]
    (try
      (.chmodSync fs directory 448)
      (git "init" "--initial-branch=fixture")
      (.writeFileSync fs (.join path directory "regular.cljc") text)
      (git "add" "--" "regular.cljc") (git "commit" "-m" "Owned gitlink target identity")
      (let [target (git "rev-parse" "HEAD")]
        (.writeFileSync fs (.join path directory "executable.sh") text #js {:mode 493})
        (.writeFileSync fs (.join path directory "binary.dat") binary)
        (.writeFileSync fs (.join path directory "binary-executable") binary #js {:mode 493})
        (.symlinkSync fs link-target (.join path directory "link"))
        (.symlinkSync fs (js/Buffer.from #js [255 128]) (.join path directory "raw-link"))
        (git "add" "--" "executable.sh" "binary.dat" "binary-executable" "link" "raw-link")
        (git "update-index" "--add" "--cacheinfo" (str "160000," target ",submodule"))
        (git "commit" "-m" "Owned binary symlink and gitlink carrier")
        (let [head (git "rev-parse" "HEAD") paths ["regular.cljc" "executable.sh" "binary.dat" "binary-executable" "link" "raw-link" "submodule"]
              before (git "status" "--porcelain=v1") index (.readFileSync fs (.join path directory ".git/index"))
              attempted (mapv (fn [p]
                                (try {:path p :value (host/immutable-source directory head [p])}
                                     (catch :default e {:path p :refused (or (:code (ex-data e)) :decoded-source-refusal)}))) paths)
              _supported (check "each ordinary Git object kind is supported independently"
                                (mapv :refused attempted) [nil nil nil nil nil nil nil])
              selected (host/immutable-source directory head paths)
              entries (into {} (map (juxt :path identity) (:files selected)))
              inventory (host/source-inventory
                         (fn [_ resource & _]
                           (case resource
                             "repos/synthetic/native-context/pulls/1" {:number 1 :state "open" :head {:sha head} :base {:sha target} :changed_files 7}
                             "repos/synthetic/native-context/pulls/1/files?per_page=100"
                             [(mapv (fn [p] {:filename p :status "modified"}) paths)]
                             (throw (ex-info "Unexpected owned object inventory read" {:resource resource}))))
                         directory "synthetic/native-context" 1 head)]
          (check "all selected changed Git objects retain exact order" (mapv :path (:files inventory)) paths)
          (check "object-kind/carrier identities are explicit in versioned manifest" (first (:manifest selected)) 2)
          (check "regular UTF8 text is retained" (get-in entries ["regular.cljc" :text]) text)
          (check "executable UTF8 text is retained" (get-in entries ["executable.sh" :text]) text)
          (doseq [[p mode] [["regular.cljc" "100644"] ["executable.sh" "100755"] ["binary.dat" "100644"] ["binary-executable" "100755"] ["link" "120000"] ["raw-link" "120000"] ["submodule" "160000"]]]
            (check "Git mode is exact" (get-in entries [p :git-mode]) mode)
            (check "Git object identity is exact" (get-in entries [p :blob]) (git "rev-parse" (str head ":" p))))
          (check "symlink target text reaches complete input without following the target"
                 (get-in entries ["link" :text]) link-target)
          (check "dangling symlink is never followed" (.existsSync fs (.join path directory "link")) false)
          (check "UTF8 symlink projection preserves every byte including initial BOM"
                 (.equals (js/Buffer.from (get-in entries ["link" :text]) "utf8") (js/Buffer.from link-target "utf8")) true)
          (check "non-UTF8 symlink projection exposes exact base64"
                 (get-in entries ["raw-link" :content-base64]) (.toString (js/Buffer.from #js [255 128]) "base64"))
          (check "non-UTF8 dangling symlink is never followed" (.existsSync fs (.join path directory "raw-link")) false)
          (doseq [p ["binary.dat" "binary-executable" "raw-link" "submodule"]]
            (check "nontext carrier has no text projection" (contains? (entries p) :text) false))
          (doseq [[p bytes] [["binary.dat" binary] ["binary-executable" binary] ["link" (js/Buffer.from link-target "utf8")] ["raw-link" (js/Buffer.from #js [255 128])]]]
            (check "raw blob carrier type" (get-in entries [p :object-type]) "blob")
            (check "raw blob carrier label" (get-in entries [p :byte-carrier]) "blob")
            (check "raw blob carrier byte size" (get-in entries [p :bytes]) (.-length bytes))
            (check "raw blob carrier SHA256" (get-in entries [p :sha256]) (host/sha256 bytes)))
          (doseq [p ["binary.dat" "binary-executable"]]
            (check "non-UTF8 regular/executable blobs expose exact base64"
                   (get-in entries [p :content-base64]) (.toString binary "base64"))
            (let [serialized (js->clj (js/JSON.parse (host/json inventory)) :keywordize-keys true)
                  record (first (filter #(= p (:path %)) (:files serialized)))
                  decoded (js/Buffer.from (:content-base64 record) "base64")]
              (check "complete source JSON carries reconstructible binary bytes" (.equals binary decoded) true)
              (check "binary carrier digest survives full-input serialization" (host/sha256 decoded) (:sha256 record))))
          (check "gitlink has commit object type" (get-in entries ["submodule" :object-type]) "commit")
          (check "gitlink carrier is explicitly object-ID bytes" (get-in entries ["submodule" :byte-carrier]) "gitlink-object-id")
          (check "gitlink ASCII object-ID carrier is 40 bytes" (get-in entries ["submodule" :bytes]) 40)
          (check "gitlink SHA256 hashes its actual object-ID carrier" (get-in entries ["submodule" :sha256]) (host/sha256 (js/Buffer.from target "ascii")))
          (check "gitlink never initializes a nested checkout" (.existsSync fs (.join path directory "submodule")) false)
          (check "missing source refuses" (refused #(host/immutable-source directory head ["absent"])) :source-entry)
          (check "wrong checkout identity refuses" (refused #(host/immutable-source directory head paths target)) :source-selection)
          (check "object reads preserve actual checkout HEAD" (git "rev-parse" "HEAD") head)
          (check "object reads preserve exact raw fixture index" (.equals index (.readFileSync fs (.join path directory ".git/index"))) true)
          (check "object reads preserve fixture status" (git "status" "--porcelain=v1") before)))
      (finally (.rmSync fs directory #js {:recursive true :force true})))))

(defn ^:async http-status-controls [remaining]
  (when-let [status (first remaining)]
    (let [calls (atom 0)
          result (await (host/post-comment! "open-hax/knoxx" 387 "inert body" "inert-token"
                                           (fn [_ _] (swap! calls inc)
                                             (js/Promise.resolve (js/Response. "inert response" #js {:status status})))))]
      (check "ambiguous server outcome versus definitive client refusal"
             result {:outcome (if (<= 500 status 599) :uncertain :refused) :http-status status})
      (check "HTTP error preserves one POST intent without retry" @calls 1)
      (await (http-status-controls (next remaining))))))

(defn server-error-case [status alter]
  (fn [d c state]
    [(assoc d :post! (fn [r n body]
                      (host/post-comment! r n body "inert-token"
                                          (fn [_ _]
                                            ((:post! d) r n body)
                                            (alter state body)
                                            (js/Promise.resolve (js/Response. "inert server failure" #js {:status status})))))) c]))

(defn ^:async server-error-controls []
  (await (publish-case (server-error-case 502 (fn [_ _] nil)) 1 true))
  (await (publish-case (server-error-case 504 (fn [state _] (swap! state update :issues pop))) 1 false))
  (await (publish-case (server-error-case 503 (fn [state body]
                              (swap! state update :issues conj (issue 7003 bot "2026-10-11T01:01:01Z" body)))) 1 false))
  (await (publish-case (server-error-case 500 (fn [state _]
                              (swap! state update-in [:issues 1 :body] str " changed"))) 1 false))
  :complete)

(def expected-dependency-pins
  {:canonical "80b8993bbd43cf0265c5e558c678845edc8929d9" :muse "45c7a8d572bf44202f52cae2aa8c0f771736a617"})
(defn dependency-pin-controls
  "Check exact protected source agreement and retain nil/malformed shape refusal."
  []
  (check "source pins match the protected dependency commits" assessment/dependency-pins expected-dependency-pins)
  (check "well-formed source pins pass the shape guard" (assessment/require-protected-dependencies!) expected-dependency-pins)
  (doseq [key [:canonical :muse]
          value [nil "" "main" "malformed" (apply str (repeat 39 "a")) (apply str (repeat 40 "A"))]]
    (with-redefs [assessment/dependency-pins (assoc expected-dependency-pins key value)]
      (check "nil or malformed dependency pins refuse"
             (refused assessment/require-protected-dependencies!) :unadopted-dependency-pins)))
  :complete)

(defn ^:async main []
  (let [_pin-check (dependency-pin-controls)
        _run-check (run-controls)
        _source-check (removed-source-controls)
         _object-check (immutable-object-controls)
        _transport-check (await (transport-controls))
        _http-check (await (http-status-controls [500 502 503 504 599 400 401 403 404 422 429]))
        positive (await (publish-case (fn [d c _] [d c]) 1 true))
        adverse (await (check-adverse adverse-controls))
        existing (await (publish-case (fn [d c state]
                                      (swap! state update :issues conj (issue 7002 bot "2026-10-11T01:01:00Z" (:summary (setup))))
                                      [d c]) 0 true))
        uncertain (await (publish-case (fn [d c _]
                        [(assoc d :post! (fn [r n body]
                                          ((:post! d) r n body) {:outcome :uncertain})) c]) 1 true))
        server-cases (await (server-error-controls))
        wrong-id (await (publish-case (fn [d c _] [(assoc d :post! (fn [r n b] ((:post! d) r n b) {:outcome :posted :record {:id 1}})) c]) 1 false))
        wrong-get (await (publish-case (fn [d c _] [(assoc d :get-comment! (fn [id] (assoc ((:get-comment! d) id) :body "changed"))) c]) 1 false))
        changed-context (await (publish-case (fn [d c s] [(assoc d :post! (fn [r n b] (let [result ((:post! d) r n b)]
                                                              (swap! s assoc-in [:thread :isResolved] true) result))) c]) 1 false))]
    (check "complete sequential asynchronous cases" (and positive adverse existing uncertain server-cases wrong-id wrong-get changed-context (> @checks 100)) true)
  (doseq [alter [(fn [r] (assoc r :app_id 3)) (fn [r] (assoc-in r [:permissions :issues] "read"))]]
    (check "native App/installation/grant mismatch refuses"
           (refused #(host/publisher-proof
                      (fn [_ r] (if (= r "app") {:id 1 :slug "eta-mu-ai"} (alter {:id 2 :app_id 1 :permissions {:issues "write"}})))
                      (fn [_ r & _] (if (= r "installation/repositories") [{:total_count 0 :repositories []}] bot)) "1" "2" "eta-mu-ai"))
           :publisher-native-mapping))
  (let [keys (.generateKeyPairSync crypto "rsa" #js {:modulusLength 2048})
        pem (.export (.-privateKey keys) #js {:type "pkcs8" :format "pem"})
        jwt (host/app-jwt "1" pem 1000) pieces (str/split jwt #"\.")]
    (check "publisher-only disposable RSA signature"
           (.verify crypto "RSA-SHA256" (js/Buffer.from (str/join "." (take 2 pieces)))
                    (.-publicKey keys) (js/Buffer.from (last pieces) "base64url")) true)
    (check "JWT claims are finite" (js->clj (js/JSON.parse (.toString (js/Buffer.from (second pieces) "base64url"))) :keywordize-keys true)
           {:iat 940 :exp 1480 :iss "1"})
    (check "invalid private key refuses without a key body" (refused #(host/app-jwt "1" "inert-invalid-key" 1000)) :publisher-credentials))
  (host/output! {:tests "actual NBB/canonical/Muse source with inert transport" :checks @checks :failed 0
                 :transport "supplied inert callbacks" :model "not invoked" :credentials "inert test values only" :node (.-version js/process)})))
(defn ^:async entry []
  (try
    (let [only (first (host/argv))]
      (if (nil? only)
        (await (main))
        (do
          (case only
            "dependency-pins" (dependency-pin-controls)
            "host-run" (run-controls)
            "removed-source" (removed-source-controls)
             "immutable-objects" (immutable-object-controls)
            "http-transport" (await (http-status-controls [500 502 503 504 599 400 401 403 404 422 429]))
            "server-readback" (await (server-error-controls))
            (throw (ex-info "Unknown owned test selector" {:only only})))
          (host/output! {:tests "focused inert actionability host control" :only only :checks @checks :failed 0
                         :native-or-model-credit false}))))
    (catch :default e
      (.error js/console (.-message e) (pr-str (ex-data e)))
      (host/fail-exit! e))))
(entry)
