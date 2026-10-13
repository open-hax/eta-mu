;; SPDX-License-Identifier: GPL-3.0-or-later
(ns opencode-actionability-assessment-test
  "Inert complete native records; no GitHub, model, token or live write."
  (:require [eta-mu.infra.actionability-assessment :as assessment]
            [eta-mu.extern.actionability-host :as host]
            [pr-flow.actionability :as actionability]
            [nbb.core :as nbb]
            ["node:fs" :as fs] ["node:path" :as path] ["node:os" :as os]
            ["node:module" :as module] ["node:crypto" :as crypto]
            ["node:child_process" :as child-process] [clojure.string :as str]))

(def test-root (.resolve path (.dirname path nbb/*file*) ".." ".."))

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

(defn stage-model-discovery-fixture!
  "Synthetic retained artifacts exercise the shared verifier, never real acquisition or inference."
  [directory]
  (let [id "mimo-v9.1-flash-free"
        cost {:input 0 :output 0 :cache {:read 0 :write 0}}
        api {:id id :url "https://opencode.ai/inference/v1" :npm "@ai-sdk/openai-compatible"}
        row {:id id :providerID "opencode" :family "mimo" :status "active" :release_date "2026-09-01"
             :api api :cost cost :capabilities {:toolcall true :input {:text true} :output {:text true}}}
        raw {:id id :family "mimo" :status "active" :release_date "2026-09-01" :tool_call true
             :modalities {:input ["text"] :output ["text"]}
             :cost {:input 0 :output 0 :cache_read 0 :cache_write 0}}
        catalog {:opencode {:id "opencode" :api (:url api) :npm (:npm api) :models {id raw}}}
        bytes (host/json catalog) version "1.18.18\n"
        effective (str "opencode/" id "\n" (host/json row) "\n")
        response {:schema "open-hax.review-model-catalog-response/v1"
                  :requested_url "https://models.opencode.ai/api.json" :response_url "https://models.opencode.ai/api.json"
                  :status 200 :body_complete true :json_valid true :aborted false
                  :bytes (host/utf8-length bytes) :sha256 (host/sha256 bytes)}
        source {:file "model-catalog-source.json" :path (host/join directory "model-catalog-source.json")
                :bytes (host/utf8-length bytes) :sha256 (host/sha256 bytes)
                :response_file "model-catalog-source-response.json" :response_sha256 (host/sha256 (host/json response))}
        command (fn [stem args out]
                  {:command (into ["/inert/not-executed/opencode"] args) :cwd "/inert/removed/discovery-work"
                   :exit_code 0 :signal nil :timed_out false :captures_closed true
                   :stdout_file (str stem ".stdout") :stderr_file (str stem ".stderr")
                   :stdout_sha256 (host/sha256 out) :stderr_sha256 (host/sha256 "")})
        proof {:schema "open-hax.review-model-discovery/v1" :mode "latest" :requested_model ""
               :declared_version "1.18.18" :observed_version "1.18.18" :status "selected"
               :binary {:real_path "/inert/not-executed/opencode" :sha256 (apply str (repeat 64 "a"))}
               :discovery_context {:cwd "/inert/removed/discovery-work" :removed true}
               :commands [(command "model-version" ["--version"] version)
                          (command "model-catalog" ["models" "opencode" "--verbose"] effective)]
               :catalog_source source :catalog_sha256 (host/sha256 effective)
               :selected_row row :selected_row_sha256 (host/sha256 (host/json row))
               :selected_source_row_sha256 (host/sha256 (host/json raw)) :selected_model (str "opencode/" id)}
        proof-sha (host/sha256 (host/json proof))
        recovery (-> (host/read-json (host/join directory "recovery.json"))
                     (assoc :model_discovery {:file "model-discovery.json" :sha256 proof-sha :selected_model (:selected_model proof)})
                     (assoc-in [:accepted_invocation :model_discovery_sha256] proof-sha)
                     (assoc-in [:accepted_invocation :model] (:selected_model proof)))]
    (doseq [[name content] [["model-catalog-source.json" bytes] ["model-catalog-source-response.json" (host/json response)]
                           ["model-version.stdout" version] ["model-version.stderr" ""]
                           ["model-catalog.stdout" effective] ["model-catalog.stderr" ""]
                           ["model-discovery.json" (host/json proof)]]]
      (host/write-text! (host/join directory name) content))
    (.writeFileSync fs (host/join directory "recovery.json") (host/json recovery))
    recovery))

(defn checked-native-invocation [directory file sha]
  (let [environment host/env]
    (with-redefs [host/env (fn [name] (case name
                                      "REVIEW_MODEL_DISCOVERY" "opencode-free-mimo-flash-v1"
                                      "REVIEW_EXPECTED_OPENCODE_VERSION" "1.18.18"
                                      "ETA_CHECKOUT" test-root
                                      (environment name)))]
      (host/invocation directory file sha))))

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
      (stage-model-discovery-fixture! directory)
      (checked-native-invocation directory file sha))))

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
                                :verify-invocation! #(checked-native-invocation directory (host/env "ETA_MU_ACTIONABILITY_VERIFIER_FILE") (host/env "ETA_MU_ACTIONABILITY_VERIFIER_SHA256"))
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
            result (try (let [value (await (assessment/publish modified cfg))]
                          (if (= :qualified (:status value))
                            {:value value}
                            {:terminal value :refused (or (:refusal-code value) :unestablished)}))
                        (catch :default e {:refused (or (:code (ex-data e)) :decoded-source-refusal)}))]
        (check "publication write count" (count @writes) expected-writes)
        (check "publication success/refusal" (= :qualified (get-in result [:value :status])) expect-success?)
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

(defn publisher-authentication-change [alter]
  (fn [d c state]
    [(assoc d :publisher-proof!
            (fn []
              (let [proof ((:publisher-proof! d))]
                (alter state)
                proof))) c]))

(defn ^:async publisher-authentication-controls []
  ;; SCI sequences awaited let bindings; every case must finish before completion.
  (let [_positive (await (publish-case (publisher-authentication-change (fn [_] nil)) 1 true))
        thread-change (await (publish-case
                              (publisher-authentication-change
                               #(swap! % assoc-in [:thread :comments :nodes 0 :body] "A real defect; fix it."))
                              0 false))
        proposal-change (await (publish-case
                                (publisher-authentication-change
                                 #(swap! % update-in [:issues 0 :body] str " changed"))
                                0 false))
        proposal-edit (await (publish-case
                              (publisher-authentication-change
                               #(swap! % assoc-in [:issues 0 :updated_at] "2026-10-11T01:00:01Z"))
                              0 false))
        later-proposal (await (publish-case
                               (publisher-authentication-change
                                #(swap! % update :issues conj
                                        (assoc (first (:issues @%)) :id 7003 :node_id "IC_fixture_7003"
                                               :html_url "https://github.com/open-hax/knoxx/pull/387#issuecomment-7003"
                                               :created_at "2026-10-11T01:00:01Z" :updated_at "2026-10-11T01:00:01Z")))
                               0 false))
        source-change (await (publish-case
                              (fn [d c state]
                                ((publisher-authentication-change
                                  #(swap! % assoc :inventory (assoc inventory :sha256 (host/sha256 "changed during authentication"))))
                                 (assoc d :inventory! #(get @state :inventory inventory)) c state))
                              0 false))]
    (check "thread mutation during publisher authentication refuses before POST" (:refused thread-change) :fresh-input-binding)
    (check "proposal mutation during publisher authentication refuses before POST" (:refused proposal-change) :fresh-proposal-binding)
    (check "proposal edit chronology during publisher authentication refuses before POST" (:refused proposal-edit) :pre-write-context-change)
    (check "new latest proposal during publisher authentication refuses before POST" (:refused later-proposal) :pre-write-context-change)
    (check "source inventory mutation during publisher authentication refuses before POST" (:refused source-change) :fresh-input-binding)
    :complete))

(defn native-read-controls
  "Actual gh-json boundary with an owned inert executable, never a native API."
  []
  (let [directory (.mkdtempSync fs (.join path (.tmpdir os) "eta-native-reader-control-"))
        home (.join path directory "home")
        audit (.join path directory "audit.json")
        executable (.join path directory "gh")
        process-env (.-env js/process)
        old-path (aget process-env "PATH")
        network-directory (host/env "ETA_MU_TEST_NETWORK_AUDIT_DIR")
        network-capture (host/env "ETA_MU_TEST_NETWORK_AUDIT_CAPTURE")
        preload-token (second (re-matches #"--require (\"[^\"]+\"|/[^ \t\r\n]+)" (or (host/env "NODE_OPTIONS") "")))
        preload-file (when preload-token (if (str/starts-with? preload-token "\"") (js/JSON.parse preload-token) preload-token))
        node-require (.createRequire module (.join path directory "fixture-loader.cjs"))
        native-process (node-require "node:child_process")
        original-spawn (.-spawnSync native-process)
        spawned (atom [])
        permission-resource "repos/open-hax/another-installed-repo/collaborators/inert/permission"
        run-resource "repos/open-hax/eta-mu/actions/runs/31"
        read-error (fn [token resource]
                     (try (host/gh-json home token "api" resource) nil
                          (catch :default e (ex-data e))))
        cleaned (fn []
                  (let [fixture-audit (host/read-json audit)
                        pid (:pid fixture-audit)
                        record-file (.join path network-directory (str pid ".json"))
                        record (host/read-json record-file)
                        stdout-file (:stdoutFile fixture-audit)]
                    (check "inert gh PID matches the actual completed spawn" pid (peek @spawned))
                    (check "inert gh actual spawn PID is positive" (pos-int? pid) true)
                    (check "inert gh preload audit schema is exact" (:schema record) "eta-mu.test-network-denial/v1")
                    (check "inert gh preload audit uses the owning capture" (:capture record) network-capture)
                    (check "inert gh preload audit binds the actual child PID" (:pid record) pid)
                    (check "inert gh preload audit binds the actual parent PID" (:parentPid record) (.-pid js/process))
                    (check "inert gh fixture parent matches the actual parent" (:parentPid fixture-audit) (.-pid js/process))
                    (check "inert gh actual preload recorded zero network attempts" (:deniedAttempts record) 0)
                    (check "inert gh kernel ancestry binds child and parent"
                           (boolean (some #(and (= pid (:pid %)) (= (.-pid js/process) (:parentPid %))) (:kernelAncestry record))) true)
                    (check "inert gh preload record remains a private owned file"
                           [(bit-and (.-mode (.lstatSync fs record-file)) 511) (.-uid (.lstatSync fs record-file))]
                           [384 (.getuid js/process)])
                    (check "native stdout uses an owned file descriptor" (str/starts-with? (.basename path (.dirname path stdout-file)) "eta-native-read-") true)
                    (check "native stdout descriptor file is removed" (.existsSync fs stdout-file) false)
                    (check "native stdout private directory is removed" (.existsSync fs (.dirname path stdout-file)) false)))]
    (try
      (check "inert gh fixture requires the existing parent audit binding"
             (and (string? network-directory) (.isAbsolute path network-directory)
                  (string? network-capture) (boolean (re-matches #"[a-zA-Z0-9-]+" network-capture))
                  (string? preload-file) (.isAbsolute path preload-file)) true)
      (host/private-directory! network-directory)
      (host/read-bytes preload-file)
      (check "the exact child preload was already loaded by the parent"
             (some? (aget (.-cache node-require) preload-file)) true)
      ;; Test-only observation of actual spawned PIDs; command/args/env/options
      ;; remain unchanged, including the protected host credential allowlist.
      (aset native-process "spawnSync"
            (fn [command arguments options]
              (let [result (.call original-spawn native-process command arguments options)]
                (when (= command "gh") (swap! spawned conj (.-pid result)))
                result)))
      (.syncBuiltinESMExports module)
      (.mkdirSync fs home #js {:mode 448})
      (.writeFileSync fs executable
                      (str "#!" (.-execPath js/process) "\n"
                           "process.env.ETA_MU_TEST_NETWORK_AUDIT_DIR=" (host/json network-directory) ";\n"
                           "process.env.ETA_MU_TEST_NETWORK_AUDIT_CAPTURE=" (host/json network-capture) ";\n"
                           "require(" (host/json preload-file) ");\n"
                           "const AUDIT=" (host/json audit) ";\n"
                           "const fs = require(\"node:fs\");\nconst args = process.argv.slice(2);\nif (args[0] !== \"api\" || args.at(-2) !== \"--hostname\" || args.at(-1) !== \"github.com\") process.exit(97);\nconst resource = args[1];\nconst stdoutFile = fs.readlinkSync(\"/proc/self/fd/1\");\nfs.writeFileSync(AUDIT, JSON.stringify({resource, args, stdoutFile, pid:process.pid, parentPid:process.ppid}));\nif (resource === \"fixture/large\") {\n  if (args.length !== 6 || args[2] !== \"--paginate\" || args[3] !== \"--slurp\") process.exit(96);\n  fs.writeFileSync(1, JSON.stringify([{nodes:[{body:\"x\".repeat(16777216+257), tail:\"last byte eta-mu \\u03b7\\u03bc \\ud83d\\ude00\"}],pageInfo:{hasNextPage:false,endCursor:null}}, {files:[{filename:\"last-page.cljc\"}],complete:true}]));\n} else if (resource === \"repos/open-hax/another-installed-repo/collaborators/inert/permission\") {\n  if (process.env.GH_TOKEN !== \"inert-target-read-token\") { fs.writeSync(2, \"HTTP 404\\n\"); process.exit(1); }\n  fs.writeFileSync(1, JSON.stringify({permission:\"write\",role_name:\"maintain\"}));\n} else if (resource === \"repos/open-hax/eta-mu/actions/runs/31\") {\n  if (process.env.GH_TOKEN !== \"inert-owning-run-token\") { fs.writeSync(2, \"HTTP 404\\n\"); process.exit(1); }\n  fs.writeFileSync(1, JSON.stringify({id:31,repository:{full_name:\"open-hax/eta-mu\"}}));\n} else if (resource === \"fixture/http404\") {\n  fs.writeSync(2, \"HTTP 404\\n\"); process.exit(1);\n} else if (resource === \"fixture/invalid-json\") {\n  fs.writeFileSync(1, \"{incomplete\");\n} else if (resource === \"fixture/partial-error\") {\n  fs.writeFileSync(1, JSON.stringify({permission:\"write\"})); fs.writeSync(2, \"HTTP 503\\n\"); process.exit(1);\n} else process.exit(95);\n")
                      #js {:mode 448 :flag "wx"})
      (aset process-env "PATH" (str directory ":" (or old-path "/usr/bin:/bin")))
      (let [result (host/gh-json home "inert-target-read-token" "api" "fixture/large" "--paginate" "--slurp")
            payload (get-in result [0 :nodes 0 :body])
            expected (.repeat "x" (+ 16777216 257))]
        (check "native response exceeds the predecessor stdout ceiling" (> (host/utf8-length (host/json result)) 16777216) true)
        (check "every slurped native page remains present" (count result) 2)
        (check "large native body retains its exact byte length" (host/utf8-length payload) (+ 16777216 257))
        (check "large native body retains exact content" (host/sha256 payload) (host/sha256 expected))
        (check "native body terminal Unicode is retained" (get-in result [0 :nodes 0 :tail]) "last byte eta-mu ημ 😀")
        (check "native pagination completion remains explicit" (get-in result [0 :pageInfo]) {:hasNextPage false :endCursor nil})
        (check "last native file inventory page is retained" (second result) {:files [{:filename "last-page.cljc"}] :complete true})
        (cleaned))
      (check "target installation can read a writer on another admitted public repository"
             (host/gh-json home "inert-target-read-token" "api" permission-resource)
             {:permission "write" :role_name "maintain"})
      (cleaned)
      (check "owning workflow token cannot substitute for target Metadata access"
             (read-error "inert-owning-run-token" permission-resource) {:code :native-read :status 404})
      (cleaned)
      (check "owning workflow run provenance uses its separate read token"
             (host/gh-json home "inert-owning-run-token" "api" run-resource)
             {:id 31 :repository {:full_name "open-hax/eta-mu"}})
      (cleaned)
      (check "target-only token cannot replace owning workflow run access"
             (read-error "inert-target-read-token" run-resource) {:code :native-read :status 404})
      (cleaned)
      (check "native HTTP refusal preserves its actual status"
             (read-error "inert-target-read-token" "fixture/http404") {:code :native-read :status 404})
      (cleaned)
      (check "successful process with malformed native JSON refuses"
             (read-error "inert-target-read-token" "fixture/invalid-json") {:code :native-json})
      (cleaned)
      (check "partial stdout from a failed process is never accepted"
             (read-error "inert-target-read-token" "fixture/partial-error") {:code :native-read :status 503})
      (cleaned)
      (check "every one of the eight inert gh invocations has a distinct audited spawn"
             [(count @spawned) (count (set @spawned))] [8 8])
      :complete
      (finally
        (aset native-process "spawnSync" original-spawn)
        (.syncBuiltinESMExports module)
        (if (nil? old-path) (js-delete process-env "PATH") (aset process-env "PATH" old-path))
        (.rmSync fs directory #js {:recursive true :force true})))))

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
        old-modified (js/Buffer.from #js [255 0 128 65])
        old-renamed (js/Buffer.from #js [255 0 129 66])
        new-modified (js/Buffer.from #js [255 1 130 67])
        new-renamed (js/Buffer.from #js [255 1 131 68])
        added-binary (js/Buffer.from #js [255 2 132 69])
        collect (fn [head base]
                  (host/source-inventory
                   (fn [_ resource & _]
                     (case resource
                       "repos/synthetic/native-context/pulls/1" {:number 1 :state "open" :head {:sha head} :base {:sha base} :changed_files 5}
                       "repos/synthetic/native-context/pulls/1/files?per_page=100"
                       [[{:filename "gone.cljc" :status "removed"}
                         {:filename "kept.cljc" :status "modified"}
                         {:filename "modified.bin" :status "modified"}
                         {:filename "after-name.bin" :previous_filename "before-name.bin" :status "renamed"}
                         {:filename "added.bin" :status "added"}]]
                       (throw (ex-info "Unexpected owned inventory read" {:resource resource}))))
                   directory "synthetic/native-context" 1 head))]
    (try
      (.chmodSync fs directory 448)
      (git "init" "--initial-branch=base")
      (.writeFileSync fs (.join path directory "gone.cljc") original)
      (.writeFileSync fs (.join path directory "kept.cljc") "original current file\n")
      (.writeFileSync fs (.join path directory "modified.bin") old-modified #js {:mode 493})
      (.writeFileSync fs (.join path directory "before-name.bin") old-renamed)
      (git "add" "--all") (git "commit" "-m" "Owned common ancestor")
      (let [ancestor (git "rev-parse" "HEAD") ancestor-tree (git "rev-parse" "HEAD^{tree}")]
        (git "checkout" "-b" "topic")
        (.unlinkSync fs (.join path directory "gone.cljc"))
        (.writeFileSync fs (.join path directory "kept.cljc") "topic immutable source\n")
        (.writeFileSync fs (.join path directory "modified.bin") new-modified)
        (.chmodSync fs (.join path directory "modified.bin") 420)
        (.renameSync fs (.join path directory "before-name.bin") (.join path directory "after-name.bin"))
        (.writeFileSync fs (.join path directory "after-name.bin") new-renamed)
        (.chmodSync fs (.join path directory "after-name.bin") 493)
        (.writeFileSync fs (.join path directory "added.bin") added-binary)
        (git "add" "--all") (git "commit" "-m" "Owned removal candidate")
        (let [head (git "rev-parse" "HEAD") topic-tree (git "rev-parse" "HEAD^{tree}")]
          (git "checkout" "base")
          (.writeFileSync fs (.join path directory "gone.cljc") "advancing base changed this file\n")
          (.writeFileSync fs (.join path directory "modified.bin") (js/Buffer.from #js [255 9 140 70]))
          (.writeFileSync fs (.join path directory "before-name.bin") (js/Buffer.from #js [255 9 141 71]))
          (git "add" "--all") (git "commit" "-m" "Owned advancing base")
          (let [base (git "rev-parse" "HEAD")]
            (git "checkout" "--detach" head)
            (let [before (git "status" "--porcelain=v1")
                  index (.readFileSync fs (.join path directory ".git/index")) inventory (collect head base)]
              (check "complete ancestor manifest includes every non-added native preimage"
                     (mapv first (get-in inventory [:manifest 7 2]))
                     ["gone.cljc" "kept.cljc" "modified.bin" "before-name.bin"])
              (check "complete preimage source order follows original native file order"
                     (mapv :path (:preimage-files inventory))
                     ["gone.cljc" "kept.cljc" "modified.bin" "before-name.bin"])
              (check "removed-only projection preserves its established contract"
                     (mapv :path (:removed-files inventory)) ["gone.cljc"])
              (check "added binary has no ancestor preimage"
                     (some #(= "added.bin" (:path %)) (:preimage-files inventory)) nil)
              (let [serialized (js->clj (js/JSON.parse (host/json inventory)) :keywordize-keys true)
                    before (into {} (map (juxt :path identity) (:preimage-files serialized)))
                    after (into {} (map (juxt :path identity) (:files serialized)))]
                (doseq [[p bytes mode] [["modified.bin" old-modified "100755"]
                                       ["before-name.bin" old-renamed "100644"]]]
                  (check "binary preimage has exact merge-base mode" (get-in before [p :git-mode]) mode)
                  (check "binary preimage binds actual immutable ancestor object"
                         (get-in before [p :blob]) (git "rev-parse" (str ancestor ":" p)))
                  (check "binary preimage is raw blob carrier" (get-in before [p :byte-carrier]) "blob")
                  (check "binary preimage bytes survive complete input JSON"
                         (get-in before [p :content-base64]) (.toString bytes "base64"))
                  (check "binary preimage byte length is exact" (get-in before [p :bytes]) (.-length bytes))
                  (check "binary preimage SHA256 is exact" (get-in before [p :sha256]) (host/sha256 bytes))
                  (check "binary preimage has no invented UTF8 text" (contains? (before p) :text) false))
                (doseq [[p bytes mode] [["modified.bin" new-modified "100644"]
                                       ["after-name.bin" new-renamed "100755"]
                                       ["added.bin" added-binary "100644"]]]
                  (check "head binary mode is exact" (get-in after [p :git-mode]) mode)
                  (check "head binary object is exact" (get-in after [p :blob]) (git "rev-parse" (str head ":" p)))
                  (check "head binary complete JSON payload is exact" (get-in after [p :content-base64]) (.toString bytes "base64"))
                  (check "head binary SHA256 is exact" (get-in after [p :sha256]) (host/sha256 bytes))))
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

(defn owned-source-fixture-git
  "Run only explicit Git fixture commands under a private disposable checkout."
  [directory]
  (fn [& args]
    (let [result (.spawnSync child-process "git"
                            (clj->js (into ["--no-pager" "-c" "core.hooksPath=/dev/null"
                                           "-c" "commit.gpgSign=false" "-c" "init.templateDir="
                                           "-c" "user.name=Inert fixture" "-c" "user.email=inert@example.invalid"
                                           "-C" directory] args))
                            #js {:env #js {:PATH (host/env "PATH") :HOME directory :LANG "C.UTF-8"
                                           :GIT_CONFIG_NOSYSTEM "1" :GIT_CONFIG_GLOBAL "/dev/null"
                                           :GIT_OPTIONAL_LOCKS "0"}
                                 :encoding "utf8" :timeout 15000 :maxBuffer 1048576})]
      (when-not (= 0 (.-status result))
        (throw (ex-info "Owned source fixture preparation failed" {:args args :status (.-status result)})))
      (str/trim (.-stdout result)))))

(defn copied-source-controls
  "Copied destinations bind their actual merge-base source, never an absent destination."
  []
  (let [directory (.mkdtempSync fs (.join path (.tmpdir os) "eta-copied-preimage-"))
        git (owned-source-fixture-git directory)
        bytes (js/Buffer.from #js [255 0 128 65])
        collect (fn [head base file]
                  (host/source-inventory
                   (fn [_ resource & _]
                     (case resource
                       "repos/synthetic/native-context/pulls/1" {:number 1 :state "open" :head {:sha head} :base {:sha base} :changed_files 1}
                       "repos/synthetic/native-context/pulls/1/files?per_page=100" [[file]]
                       (throw (ex-info "Unexpected copied inventory read" {:resource resource}))))
                   directory "synthetic/native-context" 1 head))]
    (try
      (.chmodSync fs directory 448)
      (git "init" "--initial-branch=fixture")
      (.writeFileSync fs (.join path directory "source.bin") bytes)
      (git "add" "--" "source.bin") (git "commit" "-m" "Owned copy source")
      (let [base (git "rev-parse" "HEAD")]
        (.copyFileSync fs (.join path directory "source.bin") (.join path directory "copied.bin"))
        (git "add" "--" "copied.bin") (git "commit" "-m" "Owned copied destination")
        (let [head (git "rev-parse" "HEAD")
              index (.readFileSync fs (.join path directory ".git/index"))
              status (git "status" "--porcelain=v1")
              file {:filename "copied.bin" :previous_filename "source.bin" :status "copied"}
              inventory (collect head base file)
              preimage (first (:preimage-files inventory))
              current (first (:files inventory))]
          (check "copied destination is absent at the actual merge base" (git "ls-tree" base "--" "copied.bin") "")
          (check "copied inventory preserves its native status and source path" (:changed-files inventory) [file])
          (check "copy source is the complete preimage path" (mapv :path (:preimage-files inventory)) ["source.bin"])
          (check "copy destination remains the selected current path" (mapv :path (:files inventory)) ["copied.bin"])
          (check "copy source is bound to actual merge-base object" (:blob preimage) (git "rev-parse" (str base ":source.bin")))
          (check "copy destination is bound to actual head object" (:blob current) (git "rev-parse" (str head ":copied.bin")))
          (doseq [record [preimage current]]
            (check "copied binary bytes are lossless" (:content-base64 record) (.toString bytes "base64"))
            (check "copied binary byte size is exact" (:bytes record) (.-length bytes))
            (check "copied binary SHA256 is exact" (:sha256 record) (host/sha256 bytes)))
          (check "copied file does not become a removed projection" (:removed-files inventory) nil)
          (doseq [previous [nil "" " \t" 1]]
            (check "copied source name must be a nonblank native string"
                   (refused #(collect head base (assoc file :previous_filename previous))) :source-file-inventory))
          (check "missing copied source object is refused, never treated as added"
                 (refused #(collect head base (assoc file :previous_filename "missing.bin"))) :source-entry)
          (check "copy source existing only at head cannot supply a merge-base preimage"
                 (refused #(collect head base (assoc file :previous_filename "copied.bin"))) :source-entry)
          (check "copy reads preserve checkout HEAD" (git "rev-parse" "HEAD") head)
          (check "copy reads preserve exact raw index" (.equals index (.readFileSync fs (.join path directory ".git/index"))) true)
          (check "copy reads preserve checkout status" (git "status" "--porcelain=v1") status)))
      (finally (.rmSync fs directory #js {:recursive true :force true})))))

(defn large-inventory-controls
  "Use a real owned PR tree above the native files cap; preserve every immutable byte."
  []
  (let [directory (.mkdtempSync fs (.join path (.tmpdir os) "eta-large-inventory-"))
        git (owned-source-fixture-git directory)
        added-paths (mapv #(str "bulk/added-" (.padStart (str %) 4 "0") ".cljc") (range 3001))
        unusual " leading\tline\nημ "
        source-bytes (js/Buffer.from #js [255 0 128 65])
        old-bytes (js/Buffer.from #js [255 0 129 66])
        new-bytes (js/Buffer.from #js [255 1 130 67])
        native-files (mapv #(hash-map :filename % :status "added") (take 3000 added-paths))
        files-api-reads (atom 0)
        decode host/decode-git-name-status
        collect (fn [head base & [changed-count pages]]
                  (host/source-inventory
                   (fn [_ resource & _]
                     (case resource
                       "repos/synthetic/native-context/pulls/1"
                       {:number 1 :state "open" :head {:sha head} :base {:sha base}
                        :changed_files (or changed-count 3006)}
                       "repos/synthetic/native-context/pulls/1/files?per_page=100"
                       (do (swap! files-api-reads inc)
                           (or pages (mapv vec (partition-all 100 native-files))))
                       (throw (ex-info "Unexpected large inventory read" {:resource resource}))))
                   directory "synthetic/native-context" 1 head))]
    (try
      (.chmodSync fs directory 448)
      (git "init" "--initial-branch=fixture")
      (.writeFileSync fs (.join path directory "gone.cljc") "removed immutable source\n")
      (.writeFileSync fs (.join path directory "modified.bin") old-bytes #js {:mode 493})
      (.writeFileSync fs (.join path directory "before-name.bin") source-bytes)
      (.writeFileSync fs (.join path directory "copy-source.bin") source-bytes)
      (git "add" "--all") (git "commit" "-m" "Owned large inventory ancestor")
      (let [base (git "rev-parse" "HEAD") base-tree (git "rev-parse" "HEAD^{tree}")]
        (.mkdirSync fs (.join path directory "bulk"))
        (doseq [p added-paths] (.writeFileSync fs (.join path directory p) (str ";; inert exact source " p "\n")))
        (.writeFileSync fs (.join path directory unusual) "inert unusual path\n")
        (.unlinkSync fs (.join path directory "gone.cljc"))
        (.writeFileSync fs (.join path directory "modified.bin") new-bytes)
        (.chmodSync fs (.join path directory "modified.bin") 420)
        (.renameSync fs (.join path directory "before-name.bin") (.join path directory "after-name.bin"))
        (.copyFileSync fs (.join path directory "copy-source.bin") (.join path directory "copied.bin"))
        (git "add" "--all") (git "commit" "-m" "Owned native API cap successor")
        (let [head (git "rev-parse" "HEAD") head-tree (git "rev-parse" "HEAD^{tree}")
              index (.readFileSync fs (.join path directory ".git/index"))
              status (git "status" "--porcelain=v1")
              inventory (collect head base)
              current (into {} (map (juxt :path identity) (:files inventory)))
              before (into {} (map (juxt :path identity) (:preimage-files inventory)))
              descriptors (into {} (map (juxt :filename identity) (:changed-files inventory)))
              proof (:source-provenance inventory)
              raw (js/Buffer.from (:content-base64 proof) "base64")]
          ;; Native rename accounting differs from explicit no-renames Git
          ;; accounting. Neither count nor the truncated native list filters
          ;; the independently derived complete immutable changed tree.
          (check "above-cap inventory includes every Git change beyond 3000 native records" (count (:changed-files inventory)) 3007)
          (check "native count remains observed metadata independent of Git descriptor count" (:native-changed-files proof) 3006)
          (check "large inventory does not fetch the capped files API" @files-api-reads 0)
          (check "files API non-fetch is retained explicitly" (:native-files-api proof) "not-requested-above-cap")
          (check "every added file beyond the native cap retains complete immutable source"
                 (mapv #(get-in current [% :text]) added-paths)
                 (mapv #(str ";; inert exact source " % "\n") added-paths))
          (check "unusual changed path survives real Git framing without normalization"
                 (get-in current [unusual :text]) "inert unusual path\n")
          (check "all live changed paths retain exact sorted Git order"
                 (mapv :path (:files inventory))
                 (vec (sort (concat added-paths [unusual "after-name.bin" "copied.bin" "modified.bin"]))))
          (check "no-renames fallback retains both old source and new destination"
                 [(get-in descriptors ["before-name.bin" :status]) (get-in descriptors ["after-name.bin" :status])]
                 ["removed" "added"])
          (check "copy destination is added without an invented unchanged source relationship"
                 (descriptors "copied.bin") {:filename "copied.bin" :status "added"})
          (check "unchanged copy source is not misrepresented as a changed preimage" (contains? before "copy-source.bin") false)
          (check "all actual removed and modified preimages are retained"
                 (mapv :path (:preimage-files inventory)) ["before-name.bin" "gone.cljc" "modified.bin"])
          (check "removed-only projection includes rename removal and original removal"
                 (mapv :path (:removed-files inventory)) ["before-name.bin" "gone.cljc"])
          (doseq [[p bytes mode commit record] [["modified.bin" old-bytes "100755" base before]
                                               ["before-name.bin" source-bytes "100644" base before]
                                               ["modified.bin" new-bytes "100644" head current]
                                               ["after-name.bin" source-bytes "100644" head current]
                                               ["copied.bin" source-bytes "100644" head current]]]
            (check "above-cap binary bytes remain exact lossless carriers" (get-in record [p :content-base64]) (.toString bytes "base64"))
            (check "above-cap immutable object identity is exact" (get-in record [p :blob]) (git "rev-parse" (str commit ":" p)))
            (check "above-cap exact Git mode is preserved" (get-in record [p :git-mode]) mode)
            (check "above-cap binary SHA256 is exact" (get-in record [p :sha256]) (host/sha256 bytes)))
          (check "large inventory binds the exact merge base even for added records" (:merge-base proof) base)
          (check "large inventory provenance uses its versioned immutable Git carrier" (:schema proof) "open-hax.git-source-inventory/v1")
          (check "large inventory has an explicit versioned aggregate manifest" (first (:manifest inventory)) 2)
          (check "complete raw NUL Git carrier is bound to the descriptor sequence"
                 (decode raw) (:changed-files inventory))
          (check "complete raw Git carrier byte count is exact" (:bytes proof) (.-length raw))
          (check "complete raw Git carrier digest is exact" (:sha256 proof) (host/sha256 raw))
          (check "retained provenance is inside the aggregate source digest" (peek (:manifest inventory)) proof)
          (check "complete aggregate digest is exact" (:sha256 inventory) (host/sha256 (pr-str (:manifest inventory))))
          (doseq [carrier ["" "A\u0000unfinished" "A\u0000one\u0000trailing\u0000"
                           "R100\u0000old\u0000new\u0000" "X\u0000one\u0000"
                           "A\u0000\u0000" "A\u0000one\u0000M\u0000one\u0000"]]
            (check "malformed, unsupported or duplicate Git inventory refuses"
                   (refused #(decode (js/Buffer.from carrier "utf8"))) :source-file-inventory))
          (check "invalid UTF8 in Git inventory refuses without replacement"
                 (refused #(decode (js/Buffer.from #js [77 0 255 0]))) :source-file-inventory)
          (check "NUL framing preserves whitespace, tabs, newlines and Unicode paths exactly"
                 (decode (js/Buffer.from "A\u0000 leading\tline\nημ \u0000T\u0000mode.bin\u0000" "utf8"))
                 [{:filename " leading\tline\nημ " :status "added"} {:filename "mode.bin" :status "changed"}])
          (check "BOM bytes within a Git path remain part of its exact name"
                 (decode (js/Buffer.from "A\u0000\ufeffname.cljc\u0000" "utf8"))
                 [{:filename "\ufeffname.cljc" :status "added"}])
          (check "at-cap native count mismatch remains refused on the ordinary REST route"
                 (refused #(collect head base 3000 [[(first native-files)]])) :source-file-inventory)
          (check "above-cap immutable checkout must match native selected head"
                 (refused #(collect base base)) :source-selection)
          (check "above-cap missing immutable base object refuses"
                 (refused #(collect head (apply str (repeat 40 "e")))) :source-object)
          (check "large inventory leaves checkout HEAD unchanged" (git "rev-parse" "HEAD") head)
          (check "large inventory leaves the exact raw index unchanged" (.equals index (.readFileSync fs (.join path directory ".git/index"))) true)
          (check "large inventory leaves checkout status unchanged" (git "status" "--porcelain=v1") status)
          (let [left (git "commit-tree" base-tree "-p" base "-m" "Owned large left")
                right (git "commit-tree" base-tree "-p" base "-m" "Owned large right")
                left-merge (git "commit-tree" head-tree "-p" left "-p" right "-m" "Owned large left merge")
                right-merge (git "commit-tree" base-tree "-p" right "-p" left "-m" "Owned large right merge")]
            (git "checkout" "--detach" left-merge)
            (check "large inventory refuses ambiguous actual merge bases"
                   (refused #(collect left-merge right-merge)) :source-merge-base)
            (check "ambiguous large inventory leaves checkout unchanged" (git "rev-parse" "HEAD") left-merge))))
      :complete
      (finally (.rmSync fs directory #js {:recursive true :force true})))))

(defn large-blob-controls
  "Read actual Git blobs above the old stdout ceiling with exact text and binary carriers."
  []
  (let [directory (.mkdtempSync fs (.join path (.tmpdir os) "eta-large-source-"))
        git (owned-source-fixture-git directory)
        size (inc (* 16 1024 1024))
        text-bytes (js/Buffer.alloc size 97)
        binary-bytes (js/Buffer.alloc size 0)]
    (aset text-bytes (dec size) 98)
    (aset binary-bytes 0 255)
    (aset binary-bytes 1 128)
    (aset binary-bytes (dec size) 65)
    (try
      (.chmodSync fs directory 448)
      (git "init" "--initial-branch=fixture")
      (.writeFileSync fs (.join path directory "large-text.txt") text-bytes)
      (.writeFileSync fs (.join path directory "large-binary.bin") binary-bytes)
      (git "add" "--" "large-text.txt" "large-binary.bin") (git "commit" "-m" "Owned large Git blobs")
      (let [head (git "rev-parse" "HEAD") index (.readFileSync fs (.join path directory ".git/index"))
            status (git "status" "--porcelain=v1")
            selected (host/immutable-source directory head ["large-text.txt" "large-binary.bin"])
            entries (into {} (map (juxt :path identity) (:files selected)))]
        (doseq [[p bytes] [["large-text.txt" text-bytes] ["large-binary.bin" binary-bytes]]]
          (check "fixture exceeds the prior 16MiB stdout capture ceiling" (> (.-length bytes) 16777216) true)
          (check "large blob byte count is exact" (get-in entries [p :bytes]) size)
          (check "large blob SHA256 is exact" (get-in entries [p :sha256]) (host/sha256 bytes))
          (check "large blob binds its actual Git object" (get-in entries [p :blob]) (git "rev-parse" (str head ":" p)))
          (check "large blob carrier remains explicit" (get-in entries [p :byte-carrier]) "blob"))
        (check "large UTF8 text retains every committed byte"
               (.equals text-bytes (js/Buffer.from (get-in entries ["large-text.txt" :text]) "utf8")) true)
        (check "large binary base64 retains every committed byte"
               (.equals binary-bytes (js/Buffer.from (get-in entries ["large-binary.bin" :content-base64]) "base64")) true)
        (check "large binary has no invented UTF8 text" (contains? (entries "large-binary.bin") :text) false)
        (check "large object reads preserve checkout HEAD" (git "rev-parse" "HEAD") head)
        (check "large object reads preserve exact raw index" (.equals index (.readFileSync fs (.join path directory ".git/index"))) true)
        (check "large object reads preserve checkout status" (git "status" "--porcelain=v1") status))
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
                             [(mapv (fn [p] {:filename p :status (if (= p "regular.cljc") "modified" "added")}) paths)]
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
  (let [_qualified (await (publish-case (server-error-case 502 (fn [_ _] nil)) 1 true))
        _absent (await (publish-case (server-error-case 504 (fn [state _] (swap! state update :issues pop))) 1 false))
        _ambiguous (await (publish-case (server-error-case 503 (fn [state body]
                                         (swap! state update :issues conj (issue 7003 bot "2026-10-11T01:01:01Z" body)))) 1 false))
        _changed (await (publish-case (server-error-case 500 (fn [state _]
                                       (swap! state update-in [:issues 1 :body] str " changed"))) 1 false))]
    :complete))

(defn ^:async publisher-readback-controls
  "A committed write keeps its actual outcome when later native readback fails."
  []
  (let [fail-get (fn [_] (throw (ex-info "Inert native readback error" {})))
        posted (await (publish-case (fn [d c _] [(assoc d :get-comment! fail-get) c]) 1 false))
        recollection (await (publish-case
                             (fn [d c _]
                               (let [written (atom false) read (:read-json d) post (:post! d)]
                                 [(assoc d :read-json (fn [& args]
                                                       (if @written
                                                         (throw (ex-info "Inert post-write recollection error" {}))
                                                         (apply read args)))
                                           :post! (fn [r n body]
                                                    (let [result (post r n body)]
                                                      (reset! written true)
                                                      result))) c]))
                             1 false))
        uncertain (await (publish-case
                          (fn [d c _]
                            [(assoc d :get-comment! fail-get
                                      :post! (fn [r n body]
                                               ((:post! d) r n body)
                                               {:outcome :uncertain :http-status 504})) c])
                          1 false))
        callback-threw (await (publish-case
                              (fn [d c _]
                                [(assoc d :get-comment! fail-get
                                          :post! (fn [r n body]
                                                   ((:post! d) r n body)
                                                   (throw (ex-info "Inert committed transport error" {})))) c])
                              1 false))]
    (doseq [result [posted recollection uncertain callback-threw]]
      (let [terminal (:terminal result)]
        (check "post-write failure returns a terminal unestablished record" (:status terminal) :unestablished)
        (check "native readback failure remains the terminal refusal" (:refused result) :native-readback-error)
        (check "post-write terminal retains the one intent" (:write-intent-performed terminal) true)
        (check "post-write terminal never retries" (:retry-performed terminal) false)
        (check "post-write terminal supplies no admission" (:admitted terminal) false)
        (check "post-write terminal supplies no resolution" (:native-resolution-performed terminal) false)
        (check "post-write terminal supplies no review credit" (:review-credit terminal) false)))
    (doseq [result [posted recollection]]
      (let [terminal (:terminal result)]
        (check "successful POST remains posted despite later failure" (:outcome terminal) :posted)
        (check "actual successful transport outcome is retained" (:actual-write-outcome terminal) {:outcome :posted})
        (check "actual posted record ID is retained" (get-in terminal [:actual-post-response :id]) 7002)
        (check "actual posted record principal is retained" (get-in terminal [:actual-post-response :user]) bot)
        (check "actual posted body is retained" (get-in terminal [:actual-post-response :body]) (:summary (setup)))))
    (check "uncertain HTTP outcome remains uncertain" (get-in uncertain [:terminal :outcome]) :uncertain)
    (check "actual uncertain HTTP status is retained"
           (get-in uncertain [:terminal :actual-write-outcome]) {:outcome :uncertain :http-status 504})
    (check "throw after a committed write remains uncertain" (get-in callback-threw [:terminal :outcome]) :uncertain)
    (check "transport boundary throw remains recorded"
           (get-in callback-threw [:terminal :actual-write-outcome]) {:outcome :uncertain :transport-boundary-threw true})
    :complete))

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

(defn model-discovery-controls []
  (let [{:keys [deps summary]} (setup)
        snapshot (assessment/collect deps config)
        directory (.mkdtempSync fs (host/join (.tmpdir os) "eta-model-discovery-control-"))
        file (host/env "ETA_MU_ACTIONABILITY_VERIFIER_FILE")
        sha (host/env "ETA_MU_ACTIONABILITY_VERIFIER_SHA256")]
    (try
      (invocation-fixture snapshot summary directory)
      (check "native accepted invocation retains source-checked discovery"
             (some? (:accepted-sha256 (checked-native-invocation directory file sha))) true)
      (with-redefs [host/env (constantly nil)]
        (check "missing owning workflow mode cannot skip required discovery"
               (refused #(host/invocation directory file sha)) :model-discovery))
      (let [environment host/env
            expected {"REVIEW_MODEL_DISCOVERY" "opencode-free-mimo-flash-v1"
                      "REVIEW_EXPECTED_OPENCODE_VERSION" "1.18.18" "ETA_CHECKOUT" test-root}]
        (doseq [[key value] [["REVIEW_MODEL_DISCOVERY" "unsupported"]
                            ["REVIEW_EXPECTED_OPENCODE_VERSION" "1.19.0"]
                            ["ETA_CHECKOUT" "relative/untrusted"]]]
          (with-redefs [host/env (fn [name] (if (contains? expected name)
                                            (get (assoc expected key value) name) (environment name)))]
            (check "wrong owning mode/version/source path refuses"
                   (refused #(host/invocation directory file sha)) :model-discovery))))
      (let [recovery-file (host/join directory "recovery.json")
            recovery (host/read-json recovery-file)]
        (doseq [changed [(dissoc recovery :model_discovery)
                         (assoc-in recovery [:accepted_invocation :model] "opencode/mimo-v0-flash-free")
                         (assoc-in recovery [:model_discovery :sha256] (apply str (repeat 64 "0")))]]
          (.writeFileSync fs recovery-file (host/json changed))
          (check "missing or mismatched accepted catalog proof refuses"
                 (refused #(checked-native-invocation directory file sha)) :model-discovery))
        (.writeFileSync fs recovery-file (host/json recovery)))
      :complete
      (finally (.rmSync fs directory #js {:recursive true :force true})))))

(defn ^:async main []
  (let [_pin-check (dependency-pin-controls)
        _model-discovery-check (model-discovery-controls)
        _run-check (run-controls)
        _native-read-check (native-read-controls)
        _source-check (removed-source-controls)
        _copied-check (copied-source-controls)
        _large-inventory-check (large-inventory-controls)
        _large-check (large-blob-controls)
         _object-check (immutable-object-controls)
        _transport-check (await (transport-controls))
        _http-check (await (http-status-controls [500 502 503 504 599 400 401 403 404 422 429]))
        positive (await (publish-case (fn [d c _] [d c]) 1 true))
        authentication (await (publisher-authentication-controls))
        adverse (await (check-adverse adverse-controls))
        existing (await (publish-case (fn [d c state]
                                      (swap! state update :issues conj (issue 7002 bot "2026-10-11T01:01:00Z" (:summary (setup))))
                                      [d c]) 0 true))
        uncertain (await (publish-case (fn [d c _]
                        [(assoc d :post! (fn [r n body]
                                          ((:post! d) r n body) {:outcome :uncertain})) c]) 1 true))
        server-cases (await (server-error-controls))
        publisher-readback (await (publisher-readback-controls))
        wrong-id (await (publish-case (fn [d c _] [(assoc d :post! (fn [r n b] ((:post! d) r n b) {:outcome :posted :record {:id 1}})) c]) 1 false))
        wrong-get (await (publish-case (fn [d c _] [(assoc d :get-comment! (fn [id] (assoc ((:get-comment! d) id) :body "changed"))) c]) 1 false))
        changed-context (await (publish-case (fn [d c s] [(assoc d :post! (fn [r n b] (let [result ((:post! d) r n b)]
                                                              (swap! s assoc-in [:thread :isResolved] true) result))) c]) 1 false))]
    (check "complete sequential asynchronous cases" (and positive authentication adverse existing uncertain server-cases publisher-readback wrong-id wrong-get changed-context (> @checks 100)) true)
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
  {:tests "actual NBB/canonical/Muse source with inert transport" :checks @checks :failed 0
   :completion "opencode-actionability-assessment/v1" :completed? true
   :transport "supplied inert callbacks" :model "not invoked" :credentials "inert test values only" :node (.-version js/process)}))
(defn ^:async entry []
  (try
    (let [only (first (host/argv))
          result (if (nil? only)
                   (await (main))
                   (let [_complete (await
                                    (case only
                                      "dependency-pins" (dependency-pin-controls)
                                      "model-discovery" (model-discovery-controls)
                                      "host-run" (run-controls)
                                      "native-read" (native-read-controls)
                                      "removed-source" (removed-source-controls)
                                      "copied-source" (copied-source-controls)
                                      "large-inventory" (large-inventory-controls)
                                      "large-blobs" (large-blob-controls)
                                      "immutable-objects" (immutable-object-controls)
                                      "http-transport" (http-status-controls [500 502 503 504 599 400 401 403 404 422 429])
                                      "server-readback" (server-error-controls)
                                      "publisher-authentication" (publisher-authentication-controls)
                                      "publisher-readback" (publisher-readback-controls)
                                      (throw (ex-info "Unknown owned test selector" {:only only}))))]
                     {:tests "focused inert actionability host control" :only only :checks @checks :failed 0
                      :completion "opencode-actionability-assessment/v1" :completed? true
                      :native-or-model-credit false}))]
      (host/output! result)
      result)
    (catch :default e
      (.error js/console (.-message e) (pr-str (ex-data e)))
      (host/fail-exit! e)
      (throw e))))
;; Mark the final Promise so both the CLI and nbb.core/load-file await this result.
(nbb/await (entry))
