;; SPDX-License-Identifier: GPL-3.0-or-later
(ns opencode-actionability-assessment-test
  "Inert complete native records; no GitHub, model, token or live write."
  (:require [eta-mu.infra.actionability-assessment :as assessment]
            [eta-mu.extern.actionability-host :as host]
            [pr-flow.actionability :as actionability]
            ["node:fs" :as fs] ["node:path" :as path] ["node:os" :as os]
            ["node:module" :as module] ["node:crypto" :as crypto] [clojure.string :as str]))

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
             :workflow-ref "open-hax/eta-mu/.github/workflows/opencode-actionability-assessment.yml@refs/heads/main"}
        facts {"repos/open-hax/eta-mu" {:id 5 :full_name "open-hax/eta-mu" :default_branch "main"}
               "repos/open-hax/eta-mu/actions/runs/31" {:id 31 :run_attempt 1 :head_sha sha :repository {:id 5 :full_name "open-hax/eta-mu"}}
               "repos/open-hax/eta-mu/branches/main" {:protected true :commit {:sha sha}}
               "repos/open-hax/eta-mu/actions/runs/31/attempts/1/jobs"
               [{:jobs [{:name "Prepare actionability input" :status "completed" :conclusion "success"}
                        {:name "Assess complete actionability input" :status "completed" :conclusion "success"}]}]}
        read (fn [f] (fn [_ resource & _] (get f resource)))]
    (check "actual-shaped direct default protected run binding" (host/verify-run! (read facts) cfg true) nil)
    (doseq [c [(assoc cfg :run-attempt 2) (assoc cfg :workflow-ref "open-hax/eta-mu/.github/workflows/opencode-actionability-assessment.yml@refs/heads/feature")
               (assoc cfg :eta-revision (apply str (repeat 40 "e")))]]
      (check "wrong host run/source coordinate refuses" (refused #(host/verify-run! (read facts) c true)) :host-run-source))
    (doseq [f [(assoc-in facts ["repos/open-hax/eta-mu/branches/main" :protected] false)
               (assoc-in facts ["repos/open-hax/eta-mu/actions/runs/31" :repository :id] 6)]]
      (check "unprotected or foreign native host binding refuses" (refused #(host/verify-run! (read f) cfg true)) :host-run-source))
    (check "unfinished assessor job refuses before mutation"
           (refused #(host/verify-run! (read (assoc-in facts ["repos/open-hax/eta-mu/actions/runs/31/attempts/1/jobs" 0 :jobs 1 :conclusion] nil)) cfg true))
           :trusted-job-completion)))

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

(defn ^:async main []
  (let [_pin-check (check "unadopted source pins cannot run a live phase" (refused assessment/require-protected-dependencies!) :unadopted-dependency-pins)
        _run-check (run-controls)
        _transport-check (await (transport-controls))
        positive (await (publish-case (fn [d c _] [d c]) 1 true))
        adverse (await (check-adverse adverse-controls))
        existing (await (publish-case (fn [d c state]
                                      (swap! state update :issues conj (issue 7002 bot "2026-10-11T01:01:00Z" (:summary (setup))))
                                      [d c]) 0 true))
        uncertain (await (publish-case (fn [d c _]
                        [(assoc d :post! (fn [r n body]
                                          ((:post! d) r n body) {:outcome :uncertain})) c]) 1 true))
        wrong-id (await (publish-case (fn [d c _] [(assoc d :post! (fn [r n b] ((:post! d) r n b) {:outcome :posted :record {:id 1}})) c]) 1 false))
        wrong-get (await (publish-case (fn [d c _] [(assoc d :get-comment! (fn [id] (assoc ((:get-comment! d) id) :body "changed"))) c]) 1 false))
        changed-context (await (publish-case (fn [d c s] [(assoc d :post! (fn [r n b] (let [result ((:post! d) r n b)]
                                                              (swap! s assoc-in [:thread :isResolved] true) result))) c]) 1 false))]
    (check "complete sequential asynchronous cases" (and positive adverse existing uncertain wrong-id wrong-get changed-context (> @checks 100)) true)
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
  (try (await (main)) (catch :default e
                        (.error js/console (.-message e) (pr-str (ex-data e)))
                        (host/fail-exit! e))))
(entry)
