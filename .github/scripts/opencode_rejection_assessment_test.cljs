;; SPDX-License-Identifier: GPL-3.0-or-later
(ns opencode-rejection-assessment-test
  "Inert injected host controls. No native Bot/source/crypto agreement is supplied by fixtures."
  (:require [cljs.test :refer [deftest is async run-tests]] [clojure.string :as str]
            [nbb.core :as nbb] ["node:path" :as path]
            [eta-mu.infra.rejection-assessment :as assessment]
            [eta-mu.extern.actionability-host :as host] [pr-flow.law :as law]))

;; Use the existing complete native rejection fixture's actual proposal/source,
;; while all enclosing repository/page/POST objects below are explicitly inert.
(def fixture (host/read-json (str (host/env "CANONICAL_CHECKOUT")
                                "/skills/pr-flow/scripts/fixtures/native-opencode-rejection.json")))
(def config {:repo "fixture/inert" :repository-database-id 3 :pr-number 1 :head (:head fixture)
             :thread-id (:thread_id fixture) :root-comment-id (get-in fixture [:root :databaseId])
             :proposal-id (get-in fixture [:proposal :databaseId])
             :policy {:review/identities law/default-reviewer-identities}
             :provenance {:repository "fixture/inert" :pull_request "1" :run_id "2" :run_attempt "1"
                          :workflow_sha (apply str (repeat 40 "d"))
                          :workflow_ref "fixture/inert/workflow@refs/heads/main"}})
(def protocol "Inert protocol carrier; canonical source-backed body predicates are called directly.")
(def inventory {:head (:head fixture) :sha256 (apply str (repeat 64 "e")) :files []})
(def accepted (apply str (repeat 64 "f")))
(def summary
  (str "Rejection agreement for " (:head fixture) ":\nFinding: " (:thread_id fixture)
       " comment" (get-in fixture [:root :databaseId])
       "\nReason: I traced the exact source and retained run controls; the claimed missing provenance does not hold for the bound evidence."
       "\nEvidence: .github/workflows/opencode-code-review.yml:95; https://example.invalid/inert-source"))
(defn fixture-deps []
  (let [issues (atom []) proposal (atom (:proposal fixture)) effects (atom [])
        read (fn [& args]
               (let [endpoint (second args)]
                 (cond
                   (= endpoint "graphql")
                   {:data {:repository {:id "R_inert" :databaseId 3 :nameWithOwner "fixture/inert"
                                         :pullRequest {:id "PR_inert" :number 1 :state "OPEN" :isDraft false
                                                       :headRefOid (:head fixture) :author {:login (:pr_author fixture)}
                                                       :reviewThreads {:pageInfo {:hasNextPage false :endCursor nil}
                                                                       :nodes [{:id (:thread_id fixture) :isResolved false :isOutdated false
                                                                                :path ".github/workflows/opencode-code-review.yml" :line 95
                                                                                :comments {:totalCount 2 :pageInfo {:hasNextPage false}
                                                                                           :nodes [(:root fixture) @proposal]}}]}}}}}
                   (= endpoint "repos/fixture/inert/issues/1/comments") [@issues]
                   (str/includes? endpoint "/permission") {:permission "admin"}
                   :else (throw (ex-info "Unexpected inert read" {:args args})))))
        deps {:read-json read :history-text "" :protected-history-text ""
              :history-source {:source-kind "inert-fixture" :source-sha256 (host/sha256 "")}
              :protocol-text protocol
              :verify-sources! #(swap! effects conj :source-guard)
              :verify-run! #(swap! effects conj :run-guard) :inventory! (fn [] inventory)
              :publisher-proof! (fn [] {:user assessment/expected-publisher
                                       :repositories [{:id 3 :full_name "fixture/inert"}]})
              :accepted-sha256 accepted
              :get-comment! (fn [id] (first (filter #(= id (:id %)) @issues)))}]
    {:issues issues :proposal proposal :effects effects :deps deps}))
(defn ready [{:keys [deps] :as control}]
  (let [snapshot (assessment/collect deps config) request (assessment/request! snapshot (:proposal-id config))
        source (:manifest (assessment/prepare-input snapshot inventory request "" protocol (:provenance config)))]
    (assoc control :source source :deps (assoc deps :verify-invocation!
      (fn [] {:accepted-sha256 accepted :source source :submission {:event "APPROVE" :comments [] :summary summary}})))))
(defn refusal-code [f]
  (try (f) nil (catch :default e (:code (ex-data e)))))

(deftest fixed-purpose-binds-full-conversation-and-no-current-head-default
  (let [{:keys [deps source]} (ready (fixture-deps))
        snapshot (assessment/collect deps config)]
    (is (= "open-hax.rejection-assessment-input/v1" (:schema source)))
    (is (= "rejection-assessment" (:purpose source)))
    (is (= "rejection-assessment-input.txt" (get-in source [:full_input :path])))
    (is (= (:proposal-id config) (:proposal_id source)))
    (is (= snapshot (assessment/rebind-input deps config source)))
    (doseq [s [(assoc source :schema "open-hax.actionability-input/v1")
               (assoc source :purpose "actionability") (assoc source :proposal_id 1)
               (assoc source :context_sha256 (apply str (repeat 64 "a")))
               (assoc-in source [:target :root_comment_id] 1)
               (assoc-in source [:full_input :path] "actionability-input.txt")
               (assoc-in source [:provenance :run_attempt] "2")]]
      (is (= :fresh-input-binding (refusal-code #(assessment/rebind-input deps config s)))))
    (is (= :root-coordinate (refusal-code #(assessment/collect deps (assoc config :root-comment-id 1)))))))

(deftest missing-history-and-edited-or-wrong-proposal-fail-before-publication
  (let [{:keys [deps proposal source]} (ready (fixture-deps))]
    (doseq [changed [(assoc deps :history-text nil) (assoc deps :history-text "not-edn(")
                     (assoc deps :protected-history-text nil)
                     (assoc deps :protected-history-text "{} {}")]]
      (is (= :history-source-reconciliation (refusal-code #(assessment/collect changed config)))))
    (is (= :canonical-proposal (refusal-code #(assessment/request! (assessment/collect deps config) 1))))
    (swap! proposal update :body str "\nNative edit after prepared input.")
    (is (= :fresh-input-binding (refusal-code #(assessment/rebind-input deps config source)))))
  (let [{:keys [deps issues source]} (ready (fixture-deps))]
    (swap! issues conj {:id 99001 :body "Inert unrelated native conversation addition."
                       :user {:login "inert-user" :type "User"}
                       :created_at "2026-10-03T11:40:00Z" :updated_at "2026-10-03T11:40:00Z"
                       :html_url "https://example.invalid/inert-conversation/99001"})
    (is (= :fresh-input-binding (refusal-code #(assessment/rebind-input deps config source))))))

(deftest complete-history-carrier-keeps-exact-selected-bytes-and-source-coordinates
  (let [source "{:origin \"inert-unrelated-receipt\" :decisions []}\n"
        cli "Inert selected CLI source bytes."
        pins {:canonical (apply str (repeat 40 "d"))}
        selection {:kind "installed-cli" :source-file "/inert/selected-ledger.edn" :cli-file "/inert/pr.cljs"
                   :expected-sha (host/sha256 source) :expected-cli-sha (host/sha256 cli)}
        bytes (atom {(:source-file selection) source (:cli-file selection) cli})
        carriers (atom {}) coordinate (atom nil)
        acquire #(assessment/acquire-history-input selection config pins "/inert/evidence" %)]
    (with-redefs [host/read-bytes (fn [p] (get @bytes p))
                  host/read-text (fn [p preserve?] (is (true? preserve?))
                                   (or (get @bytes p) (get @carriers p)))
                  host/read-json (fn [_] @coordinate)]
      (let [first-input (acquire true)]
        (is (= source (:text first-input)))
        (is (= "protected-checkout" (get-in (assessment/acquire-history-input
                                              (assoc selection :kind "protected-checkout") config pins "/inert/evidence" true)
                                            [:coordinate :source-kind])))
        (is (= (:expected-sha selection) (get-in first-input [:coordinate :source-sha256])))
        (is (= (:source-file selection) (get-in first-input [:coordinate :source-file])))
        (is (= (:cli-file selection) (get-in first-input [:coordinate :cli-file])))
        (is (= (select-keys config [:repo :repository-database-id :pr-number :head :thread-id :root-comment-id :proposal-id])
               (get-in first-input [:coordinate :target])))
        (reset! coordinate (:coordinate first-input))
        (reset! carriers {"/inert/evidence/history-source.edn" source})
        (is (= first-input (acquire false)))
        (swap! carriers assoc "/inert/evidence/history-source.edn" "")
        (is (= :history-source-custody (refusal-code #(acquire false))))
        (reset! carriers {"/inert/evidence/history-source.edn" source})
        (swap! coordinate assoc-in [:target :head] (apply str (repeat 40 "a")))
        (is (= :history-source-custody (refusal-code #(acquire false))))
        (reset! coordinate (:coordinate first-input))
        (swap! bytes assoc (:source-file selection) (str source "; in-place source edit\n"))
        (is (= :history-source-custody (refusal-code #(acquire true))))
        (swap! bytes assoc (:source-file selection) source)
        (swap! bytes assoc (:cli-file selection) (str cli " edit"))
        (is (= :history-source-custody (refusal-code #(acquire false)))))))
  (let [{:keys [deps]} (fixture-deps)
        retained "{:origin \"inert-unrelated-receipt\" :decisions []}\n"
        observed (str (pr-str {:origin "pr-flow-actionability-observation"
                              :decisions [{:purpose :thread-actionability :repo-id "R_inert"}]}) "\n")]
    (is (= [] (:history (assessment/collect deps config))))
    (is (= [] (:history (assessment/collect (assoc deps :history-text retained) config))))
    (is (= :history-source-reconciliation
           (refusal-code #(assessment/collect (assoc deps :history-text observed) config))))
    (is (= :history-source-reconciliation
           (refusal-code #(assessment/collect (assoc deps :protected-history-text observed) config))))
    (let [both (assoc deps :history-text observed :protected-history-text observed)]
      (is (= [{:purpose :thread-actionability :repo-id "R_inert"}] (:history (assessment/collect both config)))))
    (let [snapshot (assessment/collect (assoc deps :history-text retained) config)
          material (assessment/conversation-material snapshot retained)]
      (is (= retained (:history-source-text material)))
      (is (= "" (:protected-history-source-text material)))
      (is (= (:history-source deps) (:history-source material))))))

(defn check [label actual expected] (is (= expected actual) label))
(defn verify-rejection-run! [read cfg publish?]
  (host/verify-run! read cfg publish? assessment/host-route))

(deftest current-c3-native-run-and-producer-controls
  (let [sha (apply str (repeat 40 "d"))
        cfg {:run-repo "open-hax/eta-mu" :run-id 31 :run-attempt 1 :workflow-sha sha :eta-revision sha :direct? true
             :workflow-ref "open-hax/eta-mu/.github/workflows/opencode-rejection-assessment.yml@refs/heads/main"
             :job-workflow-sha sha
             :job-workflow-ref "open-hax/eta-mu/.github/workflows/opencode-rejection-assessment.yml@refs/heads/main"
             :prepare-check-run-id 101 :assess-check-run-id 102}
        facts {"repos/open-hax/eta-mu" {:id 5 :full_name "open-hax/eta-mu" :default_branch "main"}
               "repos/open-hax/eta-mu/actions/runs/31" {:id 31 :run_attempt 1 :head_sha sha :repository {:id 5 :full_name "open-hax/eta-mu"}}
               "repos/open-hax/eta-mu/branches/main" {:protected true :commit {:sha sha}}
               "repos/open-hax/eta-mu/actions/runs/31/attempts/1/jobs"
               [{:jobs [{:name "Prepare rejection input" :status "completed" :conclusion "success"
                         :run_id 31 :check_run_url "https://api.github.com/repos/open-hax/eta-mu/check-runs/101"}
                        {:name "Assess complete rejection input" :status "completed" :conclusion "success"
                         :run_id 31 :check_run_url "https://api.github.com/repos/open-hax/eta-mu/check-runs/102"}]}]}
        read (fn [f] (fn [_ resource & _] (get f resource)))]
    (check "actual-shaped direct default protected run binding" (verify-rejection-run! (read facts) cfg true) nil)
    (let [called (assoc cfg :direct? false)
          referenced [{:sha sha :path (str "open-hax/eta-mu/.github/workflows/opencode-rejection-assessment.yml@" sha)}]
          called-facts (-> facts
                           (assoc-in ["repos/open-hax/eta-mu/actions/runs/31" :referenced_workflows] referenced)
                           (assoc (str "repos/open-hax/eta-mu/compare/" sha "...main") {:status "identical"}))
          foreign (assoc called :run-repo "open-hax/knoxx")
          foreign-facts (assoc called-facts
                              "repos/open-hax/knoxx" {:id 9 :full_name "open-hax/knoxx"}
                              "repos/open-hax/knoxx/actions/runs/31"
                              {:id 31 :run_attempt 1 :repository {:id 9 :full_name "open-hax/knoxx"}
                               :referenced_workflows referenced})]
      (check "same owning repository admits exact reusable source" (verify-rejection-run! (read called-facts) called false) nil)
      (doseq [changed [(assoc called :job-workflow-sha (apply str (repeat 40 "e")))
                       (assoc called :job-workflow-ref "open-hax/eta-mu/.github/workflows/other.yml@refs/heads/main")
                       (assoc called :job-workflow-ref "open-hax/eta-mu/.github/workflows/opencode-rejection-assessment.yml@")
                       (assoc called :job-workflow-sha nil)]]
        (check "a matching sibling aggregate never authenticates the current reusable job"
               (refusal-code #(verify-rejection-run! (read called-facts) changed false)) :host-run-source))
      (check "foreign caller refuses repository-scoped publication lock bypass"
             (refusal-code #(verify-rejection-run! (read foreign-facts) foreign false)) :host-run-source))
    (doseq [c [(assoc cfg :run-attempt 2) (assoc cfg :workflow-ref "open-hax/eta-mu/.github/workflows/opencode-rejection-assessment.yml@refs/heads/feature")
               (assoc cfg :eta-revision (apply str (repeat 40 "e")))]]
      (check "wrong host run/source coordinate refuses" (refusal-code #(verify-rejection-run! (read facts) c true)) :host-run-source))
    (doseq [f [(assoc-in facts ["repos/open-hax/eta-mu/branches/main" :protected] false)
               (assoc-in facts ["repos/open-hax/eta-mu/actions/runs/31" :repository :id] 6)]]
      (check "unprotected or foreign native host binding refuses" (refusal-code #(verify-rejection-run! (read f) cfg true)) :host-run-source))
    (check "unfinished assessor job refuses before mutation"
           (refusal-code #(verify-rejection-run! (read (assoc-in facts ["repos/open-hax/eta-mu/actions/runs/31/attempts/1/jobs" 0 :jobs 1 :conclusion] nil)) cfg true))
           :trusted-job-completion)
    (let [resource "repos/open-hax/eta-mu/actions/runs/31/attempts/1/jobs"
          sibling-jobs [{:name "Sibling / Prepare rejection input" :status "completed" :conclusion "success"
                         :run_id 31 :check_run_url "https://api.github.com/repos/open-hax/eta-mu/check-runs/201"}
                        {:name "Sibling / Assess complete rejection input" :status "completed" :conclusion "success"
                         :run_id 31 :check_run_url "https://api.github.com/repos/open-hax/eta-mu/check-runs/202"}]
          multiple (update-in facts [resource 0 :jobs] into sibling-jobs)]
      (check "same-run sibling invocation does not make the exact required jobs ambiguous"
             (verify-rejection-run! (read multiple) cfg true) nil)
      (doseq [changed [(assoc cfg :prepare-check-run-id nil) (assoc cfg :prepare-check-run-id 0)]]
        (check "missing native prepare coordinate refuses"
               (refusal-code #(verify-rejection-run! (read multiple) changed true)) :host-run-source))
      (doseq [changed [(assoc cfg :assess-check-run-id nil) (assoc cfg :assess-check-run-id 101)
                       (assoc cfg :assess-check-run-id 999)]]
        (check "missing or mismatched exact assessor coordinate refuses"
               (refusal-code #(verify-rejection-run! (read multiple) changed true)) :trusted-job-completion))
      (doseq [changed [(assoc-in multiple [resource 0 :jobs 1 :conclusion] "failure")
                       (assoc-in multiple [resource 0 :jobs 1 :run_id] 32)
                       (assoc-in multiple [resource 0 :jobs 1 :check_run_url] "https://api.github.com/repos/open-hax/knoxx/check-runs/102")
                       (update-in multiple [resource 0 :jobs] conj (get-in multiple [resource 0 :jobs 1]))]]
        (check "sibling success cannot replace failed, foreign, absent or duplicated selected evidence"
               (refusal-code #(verify-rejection-run! (read changed) cfg true)) :trusted-job-completion)))))

(defn post-record [body]
  ;; Explicit inert post/readback record, never passed off as actual provenance.
  {:id 99002 :node_id "inert-issue-record" :body body :user assessment/expected-publisher
   :created_at "2026-10-03T11:40:00Z" :updated_at "2026-10-03T11:40:00Z"
   :html_url "https://example.invalid/inert-issue/99002"})
(defn ^:async async-controls []
  (let [{:keys [deps issues]} (ready (fixture-deps)) count (atom 0)
        post (fn [_ _ body] (swap! count inc)
               (let [record (post-record body)] (swap! issues conj record) {:outcome :posted :record record}))
        result (await (assessment/publish (assoc deps :post! post) config))]
    (is (= :observed (:status result))) (is (= 1 @count))
    (is (false? (:admitted result)))
    (is (= (post-record summary) (:native-record result)))
    (is (false? (:native-agreement-admitted result)))
    (is (false? (:settlement-performed result))) (is (false? (:resolution-performed result)))
    (is (false? (:review-credit result))))
  (doseq [[variant expected-code] [[:digest :trusted-invocation-digest]
                                 [:principal :publisher-repository-or-principal]
                                 [:adverse :adverse-submission] [:comments :adverse-submission]
                                 [:summary :prospective-body] [:source :inert-source-drift]
                                 [:run :inert-producer-drift] [:history :history-source-reconciliation]
                                 [:inventory :input-source-head] [:permission :canonical-proposal]]]
    (let [{:keys [deps]} (ready (fixture-deps)) count (atom 0)
          d (case variant
              :digest (assoc deps :accepted-sha256 nil)
              :principal (assoc deps :publisher-proof! (fn [] {:user (assoc assessment/expected-publisher :type "User")
                                                             :repositories [{:id 3 :full_name "fixture/inert"}]}))
              :adverse (update deps :verify-invocation! (fn [f] #(assoc-in (f) [:submission :event] "REQUEST_CHANGES")))
              :comments (update deps :verify-invocation! (fn [f] #(assoc-in (f) [:submission :comments] [{:body "inert finding"}])))
              :summary (update deps :verify-invocation! (fn [f] #(assoc-in (f) [:submission :summary] "I agree.")))
              :source (assoc deps :verify-sources! #(host/refuse! :inert-source-drift))
              :run (assoc deps :verify-run! #(host/refuse! :inert-producer-drift))
              :history (assoc deps :history-text nil)
              :inventory (assoc deps :inventory! #(assoc inventory :head (apply str (repeat 40 "a"))))
              :permission (update deps :read-json
                                  (fn [read] (fn [& args]
                                               (if (str/includes? (str (second args)) "/permission")
                                                 {:permission "read"} (apply read args))))))]
      (try (await (assessment/publish (assoc d :post! (fn [& _] (swap! count inc))) config))
           (is false "Adverse fixture must refuse")
           (catch :default e
             (is (= expected-code (:code (ex-data e))) (str "Expected refusal for " variant))
             (is (= 0 @count))))))
  (let [{:keys [deps issues]} (ready (fixture-deps)) count (atom 0)
        result (await (assessment/publish
                      (assoc deps :post! (fn [_ _ body]
                                           (swap! count inc) (swap! issues conj (post-record body))
                                           {:outcome :uncertain :http-status 503})) config))]
    (is (= :observed (:status result))) (is (= :uncertain (:outcome result)))
    (is (= 1 @count)) (is (false? (:retry-performed result)))
    (is (= {:outcome :uncertain :http-status 503} (:actual-write-outcome result))))
  (let [{:keys [deps issues]} (ready (fixture-deps)) count (atom 0)
        result (await (assessment/publish
                      (assoc deps :post! (fn [_ _ body]
                                           (swap! count inc) (swap! issues conj (post-record body)
                                                                           {:id 99003 :body "Inert concurrent conversation."
                                                                            :user {:login "inert-user" :type "User"}
                                                                            :created_at "2026-10-03T11:40:00Z" :updated_at "2026-10-03T11:40:00Z"
                                                                            :html_url "https://example.invalid/inert-conversation/99003"})
                                           {:outcome :posted :record (post-record body)})) config))]
    (is (= :unestablished (:status result))) (is (= :fresh-input-binding (:refusal-code result)))
    (is (= 99002 (get-in result [:actual-post-response :id])))
    (is (= 1 @count)) (is (false? (:retry-performed result))))
  (let [{:keys [deps]} (ready (fixture-deps)) count (atom 0)
        result (await (assessment/publish (assoc deps :post! (fn [& _] (swap! count inc) {:outcome :uncertain})) config))]
    (is (= :unestablished (:status result))) (is (= 1 @count))
    (is (= :uncertain-native-write (:refusal-code result))))
  (doseq [variant [:duplicates :get-mismatch :refused]]
    (let [{:keys [deps issues]} (ready (fixture-deps)) count (atom 0)
          d (if (= variant :get-mismatch)
              (assoc deps :get-comment! (fn [_] (assoc (post-record summary) :body "inert changed GET body"))) deps)
          result (await (assessment/publish
                        (assoc d :post! (fn [_ _ body]
                                         (swap! count inc)
                                         (when-not (= variant :refused) (swap! issues conj (post-record body)))
                                         (when (= variant :duplicates)
                                           (swap! issues conj (assoc (post-record body) :id 99004 :node_id "inert-duplicate"
                                                                     :html_url "https://example.invalid/inert-issue/99004")))
                                         {:outcome (if (= variant :refused) :refused :uncertain)})) config))]
      (is (= :unestablished (:status result)))
      (is (= 1 @count)) (is (false? (:retry-performed result)))
      (is (false? (:admitted result)))
      (is (= (case variant :duplicates :uncertain-native-write :get-mismatch :native-get-mismatch
                          :refused :native-write-refused) (:refusal-code result)))))
  (let [{:keys [deps issues]} (fixture-deps) count (atom 0)
        _ (swap! issues conj (post-record summary))
        {:keys [deps]} (ready {:deps deps :issues issues})
        result (await (assessment/publish (assoc deps :post! (fn [& _] (swap! count inc))) config))]
    (is (= :observed (:status result))) (is (= :already-observed (:outcome result)))
    (is (= 0 @count)) (is (false? (:write-performed result)))))

(defn ^:async complete-async-controls
  "Await inert controls and complete the test on success or reported error."
  [done]
  (try
    (await (async-controls))
    (done)
    (catch :default e
      (is false (str "Unexpected inert async control error: " (ex-message e)))
      (done))))

(deftest inert-async-one-shot-native-observation-controls
  (async done
    (complete-async-controls done)))
(deftest actual-protected-pin-agreement-and-adverse-refusal
  (let [expected {:canonical "5cea3e51a15d19277bd642147292c11b82de5369"
                  :muse "b7e4f98f550780a7b484b1525f53ad2934e29dad"}]
    (is (= expected assessment/dependency-pins))
    (is (= expected (assessment/require-protected-dependencies!)))
    (doseq [pins [(assoc expected :canonical nil) (assoc expected :muse nil)
                 (assoc expected :canonical "main") (assoc expected :muse "unknown")
                 (assoc expected :canonical (apply str (repeat 39 "a")))
                 (assoc expected :muse (apply str (repeat 40 "A")))]]
      (with-redefs [assessment/dependency-pins pins]
        (is (= :unadopted-dependency-pins
               (refusal-code #(assessment/require-protected-dependencies!))))))))

(def post-get-variants [:unchanged :root :proposal-body :proposal-chronology :issue-chronology :permission])

(defn ^:async final-get-context-controls []
  ;; The normal registered executor builds and binds this exact pinned verifier.
  ;; Missing setup is a separate failure, never a causal publisher RED.
  (let [verifier (host/env "ETA_MU_REJECTION_VERIFIER_FILE")
        expected (host/env "ETA_MU_REJECTION_VERIFIER_SHA256")
        compiled-bound? (= expected (host/sha256 (host/read-bytes verifier)))]
    (is (and (string? expected) (re-matches #"[0-9a-f]{64}" expected) compiled-bound?)
        "The actual source-built pinned Muse verifier is present and bound")
    (doseq [branch [:recovery :posted :uncertain] variant post-get-variants]
      (let [{:keys [deps issues proposal]} (fixture-deps)
            changes (atom {}) gets (atom []) posts (atom 0) diagnostic (atom nil)
            recovery? (= :recovery branch) healthy? (= :unchanged variant)
            _ (when recovery? (swap! issues conj (post-record summary)))
            read (:read-json deps)
            guarded (assoc deps :read-json
                           (fn [& args]
                             (let [actual (apply read args) endpoint (second args)]
                               (cond
                                 (and (= endpoint "graphql") (:root-body @changes))
                                 (assoc-in actual [:data :repository :pullRequest :reviewThreads :nodes 0 :comments :nodes 0 :body]
                                           (:root-body @changes))
                                 (and (str/includes? endpoint "/permission") (:permission @changes))
                                 {:permission (:permission @changes)}
                                 :else actual))))
            {:keys [deps]} (ready {:deps guarded :issues issues})
            result (try
                     {:value
                      (await (assessment/publish
                              (assoc deps
                                     :post! (fn [_ _ body]
                                              (swap! posts inc)
                                              (let [record (post-record body)]
                                                (swap! issues conj record)
                                                (if (= :uncertain branch)
                                                  {:outcome :uncertain :http-status 503}
                                                  {:outcome :posted :record record})))
                                     :get-comment! (fn [id]
                                                     (let [actual ((:get-comment! deps) id)
                                                           expected (first (filter #(= id (:id %)) @issues))
                                                           before [@changes @proposal @issues]]
                                                       (swap! gets conj id)
                                                       (case variant
                                                         :root (swap! changes assoc :root-body "A real defect appeared during the final GET; fix it.")
                                                         :proposal-body (swap! proposal update :body str "\nInert proposal edit during final GET.")
                                                         :proposal-chronology (swap! proposal assoc :updatedAt "2026-10-03T11:39:01Z")
                                                         :issue-chronology (swap! issues conj
                                                                                 {:id 99003 :node_id "inert-later-issue"
                                                                                  :body "Inert unrelated issue append during final GET."
                                                                                  :user {:login "inert-later-writer" :type "User"}
                                                                                  :created_at "2026-10-03T11:40:01Z" :updated_at "2026-10-03T11:40:01Z"
                                                                                  :html_url "https://example.invalid/inert-issue/99003"})
                                                         :permission (swap! changes assoc :permission "read")
                                                         :unchanged nil)
                                                       (reset! diagnostic
                                                               {:record-id id :exact-record-returned? (= expected actual)
                                                                :native-state-changed? (not= before [@changes @proposal @issues])})
                                                       actual))) config))}
                     (catch :default e {:refused (:code (ex-data e)) :error (ex-message e)}))
            value (:value result)
            setup-ok? (and compiled-bound? (= [99002] @gets) (= (if recovery? 0 1) @posts)
                           (true? (:exact-record-returned? @diagnostic))
                           (= (not healthy?) (:native-state-changed? @diagnostic)))]
        (is setup-ok? (str "Actual unchanged GET and mutation boundary reached: " branch "/" variant))
        (if healthy?
          (do
            (is (= :observed (:status value)))
            (is (= (if recovery? :already-observed (if (= :uncertain branch) :uncertain :posted)) (:outcome value)))
            (is (= (not recovery?) (:write-performed value)))
            (is (= (post-record summary) (:native-record value)))
            (is (false? (:admitted value)))
            (is (false? (:native-agreement-admitted value)))
            (is (false? (:settlement-performed value)))
            (is (false? (:resolution-performed value)))
            (is (false? (:review-credit value))))
          (if recovery?
            (do
              (is (some? (:refused result)) "Recovery refuses changed context after actual GET")
              (is (nil? value) "Recovery returns no stale observed success")
              (is (= 0 @posts) "Recovery performs no POST"))
            (do
              (is (= :unestablished (:status value)))
              (is (= (if (= :uncertain branch) :uncertain :posted) (:outcome value)))
              (is (= (if (= :uncertain branch) {:outcome :uncertain :http-status 503} {:outcome :posted})
                     (:actual-write-outcome value)))
              (is (true? (:write-intent-performed value)))
              (is (false? (:retry-performed value)))
              (is (false? (:admitted value)))
              (is (false? (:native-agreement-admitted value)))
              (is (false? (:settlement-performed value)))
              (is (false? (:resolution-performed value)))
              (is (false? (:review-credit value)))
              (when (= :posted branch)
                (is (= (post-record summary) (:actual-post-response value)))))))
        (host/output! (merge {:control "inert-rejection-post-get-context/v1" :branch branch :variant variant
                              :actual-get-ids @gets :actual-posts @posts :compiled-verifier-bound? compiled-bound?
                              :setup-ok? setup-ok? :returned-status (:status value) :refusal-code (:refused result)}
                             @diagnostic))))))

(defn ^:async complete-final-get-context-controls [done]
  (try
    (await (final-get-context-controls))
    (catch :default e
      (is false (str "Unexpected inert final GET setup/control error: " (ex-message e))))
    (finally (done))))

(deftest final-get-must-recollect-complete-context-in-recovery-and-after-one-write
  (async done
    (complete-final-get-context-controls done)))


(def actual-entry-file
  (.resolve path (.dirname path nbb/*file*) "opencode_rejection_assessment.cljs"))

(defn ^:async actual-entry-target-controls []
  ;; nbb.core/load-file is the pinned runtime API. Load the real entry in its
  ;; effect-free pins phase, then call its actual config with bounded inputs.
  (let [pins-output (atom [])
        canonical (host/env "CANONICAL_CHECKOUT")]
    (let [alter-root! (resolve 'alter-var-root)
          original-argv @#'host/argv
          original-output @#'host/output!]
      ;; Keep the pins-only host seam installed through load-file's asynchronous
      ;; evaluation, then restore exact original roots before any config control.
      (try
        (alter-root! #'host/argv (constantly (fn [] ["pins"])))
        (alter-root! #'host/output! (constantly (fn [value] (swap! pins-output conj value))))
        (await (nbb/load-file actual-entry-file))
        (finally
          (alter-root! #'host/output! (constantly original-output))
          (alter-root! #'host/argv (constantly original-argv)))))
    (is (= [assessment/dependency-pins] @pins-output))
    (let [config! (resolve 'opencode-rejection-assessment/config)
          sha (apply str (repeat 40 "d"))
          inputs {"TARGET_REPOSITORY" "riatzukiza/foresight" "TARGET_REPOSITORY_ID" "1401243952"
                  "TARGET_HEAD_SHA" (:head fixture) "CANONICAL_CHECKOUT" canonical
                  "GITHUB_WORKFLOW_SHA" sha "ETA_SOURCE_SHA" sha
                  "REJECTION_JOB_WORKFLOW_SHA" sha
                  "REJECTION_JOB_WORKFLOW_REF" "open-hax/eta-mu/.github/workflows/opencode-rejection-assessment.yml@refs/heads/main"
                  "REJECTION_PREPARE_CHECK_RUN_ID" "101" "GITHUB_EVENT_NAME" "workflow_dispatch"
                  "TARGET_THREAD_ID" "PRRT_inert" "TARGET_PR_NUMBER" "39"
                  "GITHUB_RUN_ID" "31" "GITHUB_RUN_ATTEMPT" "1"
                  "TARGET_ROOT_COMMENT_ID" "4282820009" "TARGET_PROPOSAL_ID" "7"
                  "GITHUB_REPOSITORY" "open-hax/eta-mu"
                  "GITHUB_WORKFLOW_REF" "open-hax/eta-mu/.github/workflows/opencode-rejection-assessment.yml@refs/heads/main"}]
      (is (some? config!) "the actual entry config Var loaded")
      (doseq [[repo id] [["open-hax/eta-mu" "3"] ["open-hax/another-installed-repo" "3"]
                        ["riatzukiza/foresight" "1401243952"]]]
        (with-redefs [host/env (fn [name] (get (assoc inputs "TARGET_REPOSITORY" repo "TARGET_REPOSITORY_ID" id) name))]
          (let [actual (try
                         (select-keys (config!) [:repo :repository-database-id])
                         (catch :default error
                           (if (= :host-input (:code (ex-data error)))
                             {:refused :host-input}
                             (throw error))))]
            (is (= {:repo repo :repository-database-id (parse-long id)} actual)
                (str "actual config admits " repo "/" id)))))
      (doseq [[repo id] [["riatzukiza/foresight" "1401243953"] ["riatzukiza/other" "1401243952"]
                        ["another/foresight" "1401243952"] ["riatzukiza/foresight,other" "1401243952"]
                        ["riatzukiza/foresight\nopen-hax/eta-mu" "1401243952"]
                        ["riatzukiza/foresight" ""] ["riatzukiza/foresight" "01401243952"]]]
        (with-redefs [host/env (fn [name] (get (assoc inputs "TARGET_REPOSITORY" repo "TARGET_REPOSITORY_ID" id) name))]
          (is (contains? #{:host-input :native-coordinate :missing-host-input}
                         (refusal-code config!))
              (str "actual config refuses " repo "/" id)))))))

(defn ^:async complete-actual-entry-target-controls [done]
  (try
    (await (actual-entry-target-controls))
    (catch :default error
      (is false (str "Unexpected actual-entry target setup error: " (ex-message error))))
    (finally (done))))

(deftest actual-entry-admits-only-exact-personal-Foresight-native-tuple
  (async done
    (complete-actual-entry-target-controls done)))

(run-tests 'opencode-rejection-assessment-test)
