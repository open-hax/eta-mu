;; SPDX-License-Identifier: GPL-3.0-or-later
(ns opencode-review-verification-test
  "Actual pinned Muse code and archives; inert reconstruction is not native custody."
  (:require [cljs.test :as t :refer [deftest is async]] [nbb.core :as nbb]
            [clojure.string :as str] [cljs.reader :as reader]
            ["node:fs" :as fs] ["node:path" :as path] ["node:child_process" :as cp]
            ["node:os" :as os] ["node:crypto" :as crypto] ["node:zlib" :as zlib] ["node:module" :refer [createRequire]]))
(def muse "c1369c223cf3c57e3e31934a6d746bfcdfe73f5a")
(def eta "6a796582d74f93c1a1f18ca5c89eb3a0b19445eb")
(def verifier-sha "d9fea235fddec9581ba1be959e596f32b82588f78cef5fd76d55f04d24b91030")
(def build-sha "1fd734d89c4b18dce24a6a87c6024561382b52531285b020fded67e2410d6e8a")
(def capsule (str ".github/fixtures/review-publication-verifier/" muse))
(def descriptor {:muse-source muse :eta-source eta :verifier-sha256 verifier-sha :build-descriptor-sha256 build-sha})
;; Eight synthetic review tools exercise the immutable verifier only. This is
;; not the producer's complete 22-tool profile or native execution custody.
(def tools ["review_begin" "review_read_diff_chunk" "review_assess_diff_chunk" "review_record_evidence" "review_propose_finding" "review_classify_finding" "review_status" "review_submit"])
(defn sha [b] (.digest (.update (.createHash crypto "sha256") b) "hex"))
(defn jb [x] (.from js/Buffer (str (js/JSON.stringify (clj->js x)) "\n")))
(defn data [b] (js->clj (js/JSON.parse (.toString b "utf8")) :keywordize-keys true))
(defn originals []
  (let [compressed (.readFileSync fs ".ημ/review-evidence/trusted-publication-core/a037f990af6bba87fad5b1e10ce3d3ae54f2c313aa6ae0ac4dc23803b331ee9b.json.gz") raw (.gunzipSync zlib compressed)]
    (when-not (= "a037f990af6bba87fad5b1e10ce3d3ae54f2c313aa6ae0ac4dc23803b331ee9b" (sha compressed)) (throw (ex-info "Fixture proof changed" {})))
    (into {} (for [row (:files (data raw)) :when (str/starts-with? (:path row) "synthetic-collector-relocated/")
                   :let [b (if (:base64 row) (.from js/Buffer (:base64 row) "base64") (.from js/Buffer (:text row) "utf8"))]]
               (do (when-not (= (:sha256 row) (sha b)) (throw (ex-info "Fixture member changed" {})))
                   [(subs (:path row) (count "synthetic-collector-relocated/")) b])))))
(defn consistent-fixture [members event]
  ;; The original verifier smoke has COMMENT/empty findings. Preserve it as
  ;; publisher-negative; derive a consistent synthetic APPROVE using the real
  ;; immutable compiled verifier, never a supplied/mock canonical verdict.
  (let [file (.resolve path capsule "review-invocation.cjs")
        _ (when-not (= verifier-sha (sha (.readFileSync fs file))) (throw (ex-info "Fixture module changed" {})))
        require (createRequire file) verifier (require file)
        selected (data (get members "recovery.json")) accepted (:accepted_invocation selected)
        response-name (:response_file accepted)
        selected-index (dec (:attempt accepted))
        witness (get-in accepted [:canonical_verdict :acceptedInvocation :submissionFile])
        envelope (assoc (data (get members "submission.json")) :event event)
        submission (jb envelope)
        events (mapv (fn [line] (let [row (data (.from js/Buffer line))]
                                  (if (= "review_submit" (get-in row [:part :tool]))
                                    (update-in row [:part :state :output] #(js/JSON.stringify (clj->js (assoc (data (.from js/Buffer %)) :event event)))) row)))
                     (remove str/blank? (str/split-lines (.toString (get members response-name) "utf8"))))
        response (.from js/Buffer (str (str/join "\n" (map #(js/JSON.stringify (clj->js %)) events)) "\n"))
        prepared (.prepareReviewInvocationContext verifier (get members "basehead.diff") (get members "input-manifest.json") (clj->js tools) witness)
        verdict (js->clj (.verifyReviewInvocation verifier response submission prepared) :keywordize-keys true)
        _ (when-not (:ok verdict) (throw (ex-info "Actual fixture verification failed" verdict)))
        selected (-> selected
                     (update :accepted_invocation assoc :canonical_verdict verdict :response_sha256 (sha response) :submission_sha256 (sha submission))
                     (update-in [:attempts selected-index] assoc :response_sha256 (sha response) :submission_sha256 (sha submission) :canonical_verdict verdict))]
    (assoc members "submission.json" submission response-name response "recovery.json" (jb selected))))
(defn recovered-originals []
  (let [base (originals)
        proof (data (.gunzipSync zlib (.readFileSync fs ".ημ/review-evidence/trusted-publication-core/a037f990af6bba87fad5b1e10ce3d3ae54f2c313aa6ae0ac4dc23803b331ee9b.json.gz")))
        retained (into {} (for [row (:files proof) :when (str/starts-with? (:path row) "synthetic-one-recovery/")
                                :let [b (if (:base64 row) (.from js/Buffer (:base64 row) "base64") (.from js/Buffer (:text row) "utf8"))]]
                            (do (when-not (= (:sha256 row) (sha b)) (throw (ex-info "Recovery fixture changed" {})))
                                [(subs (:path row) (count "synthetic-one-recovery/")) b])))
        binding (:model_discovery (data (get base "recovery.json")))
        recovery (-> (data (get retained "recovery.json")) (assoc :model_discovery binding)
                     (update :accepted_invocation assoc :model_discovery_sha256 (:sha256 binding) :model (:selected_model binding)))]
    (assoc (merge base retained) "recovery.json" (jb recovery))))
(defn header [n fields] (let [b (.alloc js/Buffer n)] (doseq [[at width x] fields] (case width 2 (.writeUInt16LE b x at) 4 (.writeUInt32LE b x at))) b))
(defn join [& xs] (.concat js/Buffer (clj->js xs)))
(defn zip-bytes [members]
  (loop [xs (seq (sort-by key members)) at 0 blocks [] records []]
    (if-let [[name bytes] (first xs)]
      (let [n (.from js/Buffer name) c (.deflateRawSync zlib bytes) crc (.crc32 zlib bytes) size (.-length bytes) cs (.-length c)
            block (join (header 30 [[0 4 67324752] [4 2 20] [6 2 8] [8 2 8] [26 2 (.-length n)]]) n c (header 16 [[0 4 134695760] [4 4 crc] [8 4 cs] [12 4 size]]))
            cd (join (header 46 [[0 4 33639248] [4 2 788] [6 2 20] [8 2 8] [10 2 8] [16 4 crc] [20 4 cs] [24 4 size] [28 2 (.-length n)] [38 4 2175008768] [42 4 at]]) n)]
        (recur (next xs) (+ at (.-length block)) (conj blocks block) (conj records cd)))
      (let [cd (apply join records)] (apply join (concat blocks [cd (header 22 [[0 4 101010256] [8 2 (count records)] [10 2 (count records)] [12 4 (.-length cd)] [16 4 at]])]))))))
(defn ^:async call [name & args]
  (if-let [f (resolve (symbol "eta-mu.infra.review-verification" (clojure.core/name name)))] (await (apply f args)) {:status :unimplemented :code :missing-real-bridge}))
(defn expected-input-proof [members review-attempt]
  (let [manifest-bytes (get members "input-manifest.json")
        manifest (data manifest-bytes) provenance (:provenance manifest)]
    {:schema "open-hax.review-input-verification/v1" :input_verified true
     :verification_stage "fresh-review-job-before-model"
     :base_sha (:base_sha manifest) :head_sha (:head_sha manifest)
     :diff_base_sha (:diff_base_sha manifest) :full_diff (:full_diff manifest)
     :manifest_sha256 (sha manifest-bytes) :provenance provenance
     :evidence_artifact_name (str "review-evidence-" (:pull_request provenance) "-"
                                  (:run_id provenance) "-" (:run_attempt provenance))
     :verification_provenance (assoc provenance :run_attempt (str review-attempt))}))
(defn expected [members]
  (let [m (data (get members "input-manifest.json")) p (:provenance m) b (:base_sha m) h (:head_sha m)]
    {:status :reconstructed :observed-at-ms (.now js/Date) :full-diff-base64 (.toString (get members "basehead.diff") "base64")
     :manifest m :tools tools :expected-opencode-version "1.18.18"
     :sources {:caller (:workflow_sha p) :eta eta :muse muse :verifier verifier-sha :build build-sha}
     :tuple {:pr-number 1 :base-sha b :head-sha h :event-sha (:workflow_sha p) :merge-sha (apply str (repeat 40 "e")) :merge-parents [b h]
             :head-tree (apply str (repeat 40 "f")) :merge-tree (apply str (repeat 40 "f")) :base-ancestor? true :mergeable? true :state :open :draft? false}
     :run {:id 2 :attempt 1} :changed-files [{:filename "notes.txt" :patch "@@ -1 +1 @@\n-old\n+😀\n"}]
     :input-verification (expected-input-proof members 1)}))
(defn ^:async scenario [runtime members request-change expected-change]
  (let [dir (.mkdtempSync fs (.join path (.tmpdir os) "eta-verification-test-")) file (.join path dir "inert.zip") e (expected-change (expected members))
        members (assoc members "input-verification.json" (jb (:input-verification e)) "metadata/exposed-tools.txt" (.from js/Buffer (str (str/join "\n" tools) "\n")))
        bytes (zip-bytes members)
        request {:archive {:path file :artifact {:id 71 :run-id 2 :attempt 1 :size-bytes (.-length bytes) :sha256 (sha bytes) :expires-at-ms (+ (.now js/Date) 3600000)}
                           :bounds {:download-bytes 2000000 :members 32 :member-bytes 1000000 :uncompressed-bytes 3000000 :operation-ms 10000 :decode-ms 3000}
                           :required-members ["basehead.diff" "input-manifest.json" "recovery.json" "submission.json"] :text-members []}
                 :bounds {:operation-ms 10000 :observation-max-age-ms 300000} :reconstruct! (fn [_] e)}]
    (try (.writeFileSync fs file bytes) (await (call :verify! runtime (request-change request))) (finally (.rmSync fs dir #js {:recursive true :force true})))))
(defn change-json [m n f] (update m n #(jb (f (data %)))))
(defn ^:async controls [done]
  (try
    (let [members (consistent-fixture (originals) "APPROVE") boot (await (call :open-runtime! capsule descriptor))]
      (is (= :ready (:status boot)) "Actual immutable runtime is required; no mock verifier")
      (when (= :ready (:status boot))
        (let [runtime (:runtime boot)]
          (try
            (let [r (await (scenario runtime members identity identity))]
              (is (= :verified (:status r)) (pr-str r))
              (is (= :trusted-independent-verifier (get-in r [:verification :origin])))
              (is (= 36 (get-in r [:verification :page-count])))
              (is (= (sha (get members "model-response-attempt-1.txt")) (get-in r [:verification :trace])))
              (is (= (data (get members "submission.json")) (get-in r [:verification :submission-envelope])))
              (is (= (:event (data (get members "submission.json"))) (get-in r [:verification :publisher-validation :payload :event])))
              (is (= [] (get-in r [:verification :publisher-validation :payload :comments])))
              (is (= [] (:effects r))) (is (= [] (:forbidden-effects r)))
              (is (= :local-source-byte-verification (:qualification r))))
            (doseq [[label m] [[:canonical-only (consistent-fixture (originals) "COMMENT")]
                              [:malformed (assoc members "submission.json" (.from js/Buffer "{"))]
                              [:duplicate (update members "submission.json" #(let [s (.toString %)] (.from js/Buffer (str "{\"schema\":\"forged\"," (subs s 1)))))]
                              [:utf8 (assoc members "submission.json" (.from js/Buffer #js [255]))]
                              [:trace (assoc members "model-response-attempt-1.txt" (.from js/Buffer "{}\n"))]
                              [:duplicate-attempts (change-json members "recovery.json" #(-> % (assoc-in [:accepted_invocation :attempt] 2) (assoc :attempts [(assoc (first (:attempts %)) :attempt 2) (assoc (first (:attempts %)) :attempt 2)])))]
                              [:false-recovery-reason (change-json members "recovery.json" #(assoc % :recovery_reason "missing_review_submit"))]
                              [:context (change-json members "recovery.json" #(assoc-in % [:accepted_invocation :expected_context_sha256] (apply str (repeat 64 "a"))))]
                              [:witness (change-json members "recovery.json" #(assoc-in % [:accepted_invocation :canonical_verdict :acceptedInvocation :submissionFile] "/collector-local/submission.json"))]
                              [:discovery (change-json members "model-discovery.json" #(assoc % :selected_model "opencode/forged"))]]]
              (let [r (await (scenario runtime m identity identity))] (is (= :refused (:status r)) (str label " " (pr-str r))) (is (not (contains? r :verification))) (is (= [] (:effects r)))))
            (doseq [[label f] [[:G #(update % :tuple dissoc :event-sha)] [:unknown-G #(assoc-in % [:tuple :event-sha] :unknown)] [:wrong-G #(assoc-in % [:tuple :event-sha] (apply str (repeat 40 "0")))]
                              [:caller #(update % :sources dissoc :caller)] [:wrong-caller #(assoc-in % [:sources :caller] (apply str (repeat 40 "0")))]
                              [:wrong-ETA #(assoc-in % [:sources :eta] (apply str (repeat 40 "0")))]
                              [:wrong-build #(assoc-in % [:sources :build] (apply str (repeat 64 "0")))] [:source #(assoc-in % [:sources :muse] :unknown)]
                              [:diff #(update % :full-diff-base64 str "AAAA")] [:manifest #(assoc-in % [:manifest :head_sha] (apply str (repeat 40 "a")))]
                              [:stale #(assoc % :observed-at-ms (- (.now js/Date) 300001))]
                              [:partial #(assoc % :status :observed :complete? false :missing [:original-event-sha :caller-workflow-source-custody] :unsupported [:tools :changed-files :input-verification])]]]
              (let [r (await (scenario runtime members identity f))] (is (= :refused (:status r)) (str label " " (pr-str r))) (is (not (contains? r :verification)))))
            (let [r (await (scenario runtime members #(assoc-in % [:archive :artifact :sha256] (apply str (repeat 64 "0"))) identity))]
              (is (= :refused (:status r))) (is (= :archive-native-binding (:code r))))
            (let [r (await (scenario runtime members #(assoc % :publisher-validation {:payload {:event "COMMENT"}}) identity))] (is (= :refused (:status r))) (is (not (contains? r :verification))))
            (let [recovered (consistent-fixture (recovered-originals) "APPROVE")
                  good (await (scenario runtime recovered identity identity))
                  duplicate (change-json recovered "recovery.json" #(assoc % :attempts [(last (:attempts %)) (last (:attempts %))]))
                  wrong-reason (change-json recovered "recovery.json" #(assoc % :recovery_reason "invocation_deadline"))]
              (is (= :verified (:status good)) "Actual one-recovery positive is replayed without invoking a model")
              (let [r (await (scenario runtime duplicate identity identity))]
                (is (= :refused (:status r))) (is (= :recovery-order (:code r))))
              (let [r (await (scenario runtime wrong-reason identity identity))]
                (is (= :refused (:status r))) (is (= :recovery-lifecycle (:code r)))))
            (let [uploaded (assoc members "machinery/review-invocation.cjs" (.from js/Buffer "throw Error('uploaded code must remain inert');"))
                  previous (aget (.-env js/process) "GH_TOKEN")]
              (try
                (aset (.-env js/process) "GH_TOKEN" "synthetic-secret-canary-do-not-inherit")
                (let [r (await (scenario runtime uploaded identity identity))]
                  (is (= :verified (:status r)) "Uploaded verifier bytes are never loaded")
                  (is (= [] (:forbidden-effects r))))
                (finally (if previous (aset (.-env js/process) "GH_TOKEN" previous) (js-delete (.-env js/process) "GH_TOKEN")))))
            (doseq [[label f] [[:run #(assoc-in % [:archive :artifact :run-id] 3)]
                              [:attempt #(assoc-in % [:archive :artifact :attempt] 2)]
                              [:oversized-budget #(assoc-in % [:bounds :operation-ms] 30001)]
                              [:timeout #(assoc-in % [:bounds :operation-ms] 1)]]]
              (let [r (await (scenario runtime members f identity))]
                (is (= :refused (:status r)) (str label " " (pr-str r)))
                (is (not (contains? r :verification)))
                (is (= 0 (:workers (await (call :resources)))) "Measures only this adapter's parent-owned workers")))
            (finally (await (call :close-runtime! runtime))))))
      (let [r (await (call :open-runtime! capsule (assoc descriptor :muse-source (apply str (repeat 40 "a")))))] (is (= :refused (:status r))) (is (= :runtime-descriptor (:code r)))))
      (let [dir (.mkdtempSync fs (.join path (.tmpdir os) "eta-runtime-tamper-"))
            copy (.join path dir "runtime")]
        (try
          (.cpSync fs capsule copy #js {:recursive true})
          (.appendFileSync fs (.join path copy "review-invocation.cjs") "\nthrow Error('unchecked runtime');\n")
          (let [r (await (call :open-runtime! copy descriptor))]
            (is (= :refused (:status r))) (is (= :runtime-file-digest (:code r))))
          (finally (.rmSync fs dir #js {:recursive true :force true}))))
      (let [r (await (call :open-runtime! "/nonexistent/immutable-review-capsule" descriptor))]
        (is (= :refused (:status r))))
      (is (= {:runtimes 0 :workers 0} (await (call :resources))))
    (catch :default e (is false (str e)))
    (finally (done))))
(defn ^:async input-custody-controls [done]
  (try
    (let [members (consistent-fixture (originals) "APPROVE")
          boot (await (call :open-runtime! capsule descriptor))]
      (is (= :ready (:status boot)) "The actual pinned runtime must inspect and verify these fixtures")
      (when (= :ready (:status boot))
        (let [runtime (:runtime boot)]
          (try
            (let [same (await (scenario runtime members identity identity))
                  rerun (await (scenario runtime members
                                         #(assoc-in % [:archive :artifact :attempt] 2)
                                         #(-> % (assoc-in [:run :attempt] 2)
                                              (assoc :input-verification (expected-input-proof members 2)))))]
              (is (= :verified (:status same)) (pr-str same))
              (is (= :verified (:status rerun)) (pr-str rerun))
              (is (= [] (:effects rerun)))
              (is (= :local-source-byte-verification (:qualification same)))
              (is (= :local-source-byte-verification (:qualification rerun))))
            (doseq [[label raw partial?]
                    [[:whitespace (.from js/Buffer (str " \n" (js/JSON.stringify (clj->js (data (get members "input-manifest.json"))) nil 2) "\n  ")) false]
                     [:unicode (.from js/Buffer (str "\n" (js/JSON.stringify (clj->js (assoc (data (get members "input-manifest.json")) :diagnostic "μ 😀")) nil 2) "\n")) true]]]
              (let [m (assoc members "input-manifest.json" raw)
                    observed (atom nil)
                    wanted {:bytes (.-length raw) :sha256 (sha raw)}
                    e (cond-> (expected m)
                        partial? (assoc :status :observed :complete? false :missing [:native-execution-custody]))
                    r (await (scenario runtime m
                                       #(assoc % :reconstruction-input {:manifest-identity {:bytes 0 :sha256 (apply str (repeat 64 "0"))}
                                                                       :inert-marker :retained}
                                                 :reconstruct! (fn [input] (reset! observed input) e))
                                       identity))]
                (is (= wanted (:manifest-identity @observed)) (str label " " (pr-str @observed)))
                (is (= :retained (:inert-marker @observed)))
                (is (= (data raw) (:manifest @observed)))
                (if partial?
                  (do (is (= :refused (:status r))) (is (= :native-reconstruction-incomplete (:code r))))
                  (is (= :verified (:status r)) (pr-str r)))))
            (doseq [[label change]
                    [[:missing-stage #(dissoc % :verification_stage)]
                     [:wrong-stage #(assoc % :verification_stage "after-review-and-recovery-before-publication")]
                     [:wrong-schema #(assoc % :schema "self-asserted")]
                     [:unverified #(assoc % :input_verified false)]
                     [:manifest-hash #(assoc % :manifest_sha256 (apply str (repeat 64 "0")))]
                     [:diff-base #(assoc % :diff_base_sha (apply str (repeat 40 "0")))]
                     [:full-diff #(update-in % [:full_diff :bytes] inc)]
                     [:artifact-pr #(assoc % :evidence_artifact_name "review-evidence-2-2-1")]
                     [:artifact-run #(assoc % :evidence_artifact_name "review-evidence-1-3-1")]
                     [:artifact-attempt #(assoc % :evidence_artifact_name "review-evidence-1-2-2")]
                     [:malformed-producer #(assoc-in % [:provenance :run_attempt] "01")]
                     [:future-producer #(assoc-in % [:provenance :run_attempt] "2")]
                     [:producer-run #(assoc-in % [:provenance :run_id] "3")]
                     [:review-attempt #(assoc-in % [:verification_provenance :run_attempt] "2")]
                     [:review-source #(assoc-in % [:verification_provenance :workflow_sha] (apply str (repeat 40 "0")))]]]
              (let [r (await (scenario runtime members identity #(update % :input-verification change)))]
                (is (= :refused (:status r)) (str label " " (pr-str r)))
                (is (not (contains? r :verification)))
                (is (= [] (:effects r)))))
            (finally (await (call :close-runtime! runtime))))))
      (is (= {:runtimes 0 :workers 0} (await (call :resources)))))
    (catch :default e (is false (str e)))
    (finally (done))))
(defn ^:async publisher-differential [done]
  (let [dir (.mkdtempSync fs (.join path (.tmpdir os) "eta-muse-payload-"))
        file (.join path dir "submission.json")
        module-file (.resolve path capsule "publish-opencode-review.cjs")
        expected-sha "bb75bc57d8eeaf7edbd77f34e9a4da2d319617d06809f9aadfb0d94e7ae6c2c9"]
    (try
      (when-not (= expected-sha (sha (.readFileSync fs module-file))) (throw (ex-info "Publisher capsule changed" {})))
      (let [require (createRequire module-file) publisher (require module-file)
            project (resolve 'eta-mu.shape.review-verification/native-payload)]
        (is (ifn? project))
        (when project
          (doseq [[event comments] [["APPROVE" []]
                                    ["COMMENT" [{:path "notes.txt" :line 1 :side "RIGHT" :body "  First 😀\n" :severity "low" :blocking false :confidence 0.9}]]
                                    ["REQUEST_CHANGES" [{:path "notes.txt" :line 2 :side "RIGHT" :body "  Second 😀\n" :severity "high" :blocking true}
                                                        {:path "notes.txt" :line 1 :side "RIGHT" :body "First\n" :severity "low" :blocking false}]]]]
            (let [envelope {:schema "open-hax.github-review/v1" :event event :summary "  Raw Unicode 😀 summary\n" :comments comments}
                  calls (atom [])
                  github #js {:rest #js {:pulls #js {:listFiles "literal-files" :createReview (fn [payload] (swap! calls conj (js->clj payload :keywordize-keys true)) #js {:data #js {:id 1}})}}
                              :paginate (fn [_ _] #js [#js {:filename "notes.txt" :patch "@@ -1 +1,2 @@\n-old\n+one\n+two\n"}])}
                  context #js {:repo #js {:owner "synthetic" :repo "fixture"} :payload #js {:pull_request #js {:number 1 :head #js {:sha (apply str (repeat 40 "b"))}}}}]
              (.writeFileSync fs file (jb envelope))
              (await (.publishReview publisher #js {:github github :context context :core #js {:info (fn [_] nil)} :submissionFile file}))
              (is (= 1 (count @calls)))
              (is (= (project envelope) (select-keys (first @calls) [:event :body :comments])) "Product field projection matches actual immutable Muse")
              (is (= (apply str (repeat 40 "b")) (:commit_id (first @calls))))))))
      (catch :default e (is false (str e)))
      (finally (.rmSync fs dir #js {:recursive true :force true}) (done)))))
(defn ^:async temporary-root-custody [done]
  (let [parent (.realpathSync fs (.mkdtempSync fs (.join path (.tmpdir os) "eta-runtime-parent-")))
        physical (.join path parent "physical")
        alias (.join path parent "alias")
        installation-alias (.join path parent "installation-alias")
        previous-tmp (aget (.-env js/process) "TMPDIR")
        opened (atom nil)]
    (try
      (.mkdirSync fs physical)
      (.symlinkSync fs physical alias "dir")
      (.symlinkSync fs (.resolve path capsule) installation-alias "dir")
      (aset (.-env js/process) "TMPDIR" alias)
      (is (= alias (.tmpdir os)) "The test actually exercises a symlinked temporary parent")
      (let [result (await (call :open-runtime! (.realpathSync fs capsule) descriptor))]
        (reset! opened (:runtime result))
        (is (= :ready (:status result)) (pr-str result))
        (when @opened (await (call :close-runtime! @opened)) (reset! opened nil)))
      (let [result (await (call :open-runtime! installation-alias descriptor))]
        (is (= :refused (:status result)))
        (is (= :runtime-file (:code result)) "Caller-supplied installation aliases remain forbidden"))
      (is (empty? (array-seq (.readdirSync fs physical))) "Copied runtime cleanup retains ownership")
      (is (= {:runtimes 0 :workers 0} (await (call :resources))))
      (catch :default e (is false (str e)))
      (finally
        (when @opened (await (call :close-runtime! @opened)))
        (if previous-tmp (aset (.-env js/process) "TMPDIR" previous-tmp)
            (js-delete (.-env js/process) "TMPDIR"))
        (.rmSync fs parent #js {:recursive true :force true})
        (done)))))
(deftest copied-runtime-canonicalizes-only-its-owned-temp-root
  (async done (temporary-root-custody done)))
(deftest runtime-failure-cleanup-retains-canonical-directory-custody
  (doseq [mode ["canonicalization" "seal-retarget"]]
    (let [parent (.realpathSync fs (.mkdtempSync fs (.join path (.tmpdir os) "eta-runtime-cleanup-")))
          physical (.join path parent "physical") alternate (.join path parent "alternate")
          alias (.join path parent "alias") preload (.join path parent "fault.cjs")
          probe (.join path parent "probe.cljs")]
      (try
        (.mkdirSync fs physical)
        (.mkdirSync fs alternate)
        (.symlinkSync fs physical alias "dir")
        (.writeFileSync
          fs preload
          (str "const fs=require('node:fs'),path=require('node:path');"
               "const parent=" (js/JSON.stringify parent) ",mode=" (js/JSON.stringify mode) ";"
               "const physical=path.join(parent,'physical'),alias=path.join(parent,'alias'),alternate=path.join(parent,'alternate');"
               "const realpath=fs.realpathSync,write=fs.writeFileSync;"
               "fs.realpathSync=function(name,...args){"
               "if(mode==='canonicalization'&&typeof name==='string'&&name.startsWith(alias+'/eta-immutable-review-runtime-'))"
               "throw Error('injected canonicalization failure');return realpath.call(fs,name,...args);};"
               "fs.writeFileSync=function(name,...args){"
               "if(mode==='seal-retarget'&&typeof name==='string'&&name.startsWith(physical+'/eta-immutable-review-runtime-')&&name.endsWith('/runtime.json')){"
               "const owned=path.dirname(name),unrelated=path.join(alternate,path.basename(owned));"
               "fs.mkdirSync(unrelated);write.call(fs,path.join(unrelated,'marker'),'retain');"
               "fs.unlinkSync(alias);fs.symlinkSync(alternate,alias,'dir');globalThis.cleanupProbe={owned,unrelated};"
               "throw Error('injected seal failure after parent retarget');}return write.call(fs,name,...args);};"
               "require('node:module').syncBuiltinESMExports();"))
        (.writeFileSync
          fs probe
          (str "(require '[eta-mu.extern.review-verification :as runtime] '[eta-mu.law.review-verification :as law] '[\"node:fs\" :as fs])\n"
               "(aset (.-env js/process) \"TMPDIR\" " (pr-str alias) ")\n"
               "(let [result (runtime/open-runtime! " (pr-str (.realpathSync fs capsule)) " law/descriptor) "
               "state (js->clj (aget js/globalThis \"cleanupProbe\") :keywordize-keys true)] "
               "(prn {:result result :resources (runtime/resources) :physical-entries "
               "(vec (array-seq (.readdirSync fs " (pr-str physical) "))) "
               ":owned-remains? (when (:owned state) (.existsSync fs (:owned state))) "
               ":unrelated-marker-remains? (when (:unrelated state) "
               "(.existsSync fs (str (:unrelated state) \"/marker\")))}))"))
        (let [result (cp/spawnSync (.-execPath js/process)
                                  #js ["--require" preload
                                       (.resolve path "packages/eta-mu/node_modules/nbb/cli.js")
                                       "-cp" "packages/eta-mu/src/cljs" probe]
                                  #js {:encoding "utf8" :timeout 15000 :maxBuffer 1048576
                                       :env #js {:HOME "/tmp" :PATH "/usr/bin:/bin" :LANG "C.UTF-8"
                                                  :LC_ALL "C.UTF-8" :NODE_OPTIONS ""}})
              observed (when (= 0 (.-status result)) (reader/read-string (.-stdout result)))]
          (is (= 0 (.-status result)) (str mode " " (.-stdout result) (.-stderr result)))
          (is (= :refused (get-in observed [:result :status])) (pr-str observed))
          (is (= {:runtimes 0 :workers 0} (:resources observed)))
          (is (= [] (:physical-entries observed)) "Failure cleanup removes the actual owned directory")
          (when (= mode "seal-retarget")
            (is (false? (:owned-remains? observed)))
            (is (true? (:unrelated-marker-remains? observed))
                "A mutable lexical alias cannot redirect cleanup into another directory")))
        (finally (.rmSync fs parent #js {:recursive true :force true}))))))
(deftest actual-muse-native-payload-projection (async done (publisher-differential done)))
(deftest actual-pinned-verifier-causal-controls (async done (controls done)))
(deftest actual-pinned-input-manifest-and-attempt-custody (async done (input-custody-controls done)))
(defmethod t/report [::t/default :end-run-tests] [r] (when-not (t/successful? r) (set! (.-exitCode js/process) 1)))
(when (.existsSync fs "packages/eta-mu/src/cljs/eta_mu/infra/review_verification.cljs") (nbb/await (nbb/load-file "packages/eta-mu/src/cljs/eta_mu/infra/review_verification.cljs")))
(t/run-tests 'opencode-review-verification-test)
