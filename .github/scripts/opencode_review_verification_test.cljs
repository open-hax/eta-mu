;; SPDX-License-Identifier: GPL-3.0-or-later
(ns opencode-review-verification-test
  "Actual pinned Muse code and archives; inert reconstruction is not native custody."
  (:require [cljs.test :as t :refer [deftest is async]] [nbb.core :as nbb]
            [clojure.string :as str] ["node:fs" :as fs] ["node:path" :as path]
            ["node:os" :as os] ["node:crypto" :as crypto] ["node:zlib" :as zlib]))
(def muse "c1369c223cf3c57e3e31934a6d746bfcdfe73f5a")
(def eta "6a796582d74f93c1a1f18ca5c89eb3a0b19445eb")
(def verifier-sha "d9fea235fddec9581ba1be959e596f32b82588f78cef5fd76d55f04d24b91030")
(def build-sha "1fd734d89c4b18dce24a6a87c6024561382b52531285b020fded67e2410d6e8a")
(def capsule (str ".github/fixtures/review-publication-verifier/" muse))
(def descriptor {:muse-source muse :eta-source eta :verifier-sha256 verifier-sha :build-descriptor-sha256 build-sha})
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
(defn expected [members]
  (let [m (data (get members "input-manifest.json")) p (:provenance m) b (:base_sha m) h (:head_sha m)]
    {:status :reconstructed :observed-at-ms (.now js/Date) :full-diff-base64 (.toString (get members "basehead.diff") "base64")
     :manifest m :tools tools :expected-opencode-version "1.18.18"
     :sources {:caller (:workflow_sha p) :eta eta :muse muse :verifier verifier-sha :build build-sha}
     :tuple {:pr-number 1 :base-sha b :head-sha h :event-sha (:workflow_sha p) :merge-sha (apply str (repeat 40 "e")) :merge-parents [b h]
             :head-tree (apply str (repeat 40 "f")) :merge-tree (apply str (repeat 40 "f")) :base-ancestor? true :mergeable? true :state :open :draft? false}
     :run {:id 2 :attempt 1} :changed-files [{:filename "notes.txt" :patch "@@ -1 +1 @@\n-old\n+😀\n"}]
     :input-verification {:schema "open-hax.review-input-verification/v1" :input_verified true :base_sha b :head_sha h :full_diff (:full_diff m) :provenance p}}))
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
    (let [members (originals) boot (await (call :open-runtime! capsule descriptor))]
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
              (is (= "APPROVE" (get-in r [:verification :publisher-validation :payload :event])))
              (is (= [] (get-in r [:verification :publisher-validation :payload :comments])))
              (is (= [] (:effects r))) (is (= [] (:forbidden-effects r)))
              (is (= :local-source-byte-verification (:qualification r))))
            (doseq [[label m] [[:malformed (assoc members "submission.json" (.from js/Buffer "{"))]
                              [:duplicate (update members "submission.json" #(let [s (.toString %)] (.from js/Buffer (str "{\"schema\":\"forged\"," (subs s 1)))))]
                              [:utf8 (assoc members "submission.json" (.from js/Buffer #js [255]))]
                              [:trace (assoc members "model-response-attempt-1.txt" (.from js/Buffer "{}\n"))]
                              [:context (change-json members "recovery.json" #(assoc-in % [:accepted_invocation :expected_context_sha256] (apply str (repeat 64 "a"))))]
                              [:witness (change-json members "recovery.json" #(assoc-in % [:accepted_invocation :canonical_verdict :acceptedInvocation :submissionFile] "/collector-local/submission.json"))]
                              [:discovery (change-json members "model-discovery.json" #(assoc % :selected_model "opencode/forged"))]]]
              (let [r (await (scenario runtime m identity identity))] (is (= :refused (:status r)) (str label " " (pr-str r))) (is (not (contains? r :verification))) (is (= [] (:effects r)))))
            (doseq [[label f] [[:G #(update % :tuple dissoc :event-sha)] [:unknown-G #(assoc-in % [:tuple :event-sha] :unknown)]
                              [:caller #(update % :sources dissoc :caller)] [:source #(assoc-in % [:sources :muse] :unknown)]
                              [:diff #(update % :full-diff-base64 str "AAAA")] [:manifest #(assoc-in % [:manifest :head_sha] (apply str (repeat 40 "a")))]
                              [:stale #(assoc % :observed-at-ms (- (.now js/Date) 300001))]
                              [:partial #(assoc % :status :observed :complete? false :missing [:original-event-sha :caller-workflow-source-custody] :unsupported [:tools :changed-files :input-verification])]]]
              (let [r (await (scenario runtime members identity f))] (is (= :refused (:status r)) (str label " " (pr-str r))) (is (not (contains? r :verification)))))
            (let [r (await (scenario runtime members #(assoc-in % [:archive :artifact :sha256] (apply str (repeat 64 "0"))) identity))]
              (is (= :refused (:status r))) (is (= :archive-native-binding (:code r))))
            (let [r (await (scenario runtime members #(assoc % :publisher-validation {:payload {:event "COMMENT"}}) identity))] (is (= :refused (:status r))) (is (not (contains? r :verification))))
            (finally (await (call :close-runtime! runtime))))))
      (let [r (await (call :open-runtime! capsule (assoc descriptor :muse-source (apply str (repeat 40 "a")))))] (is (= :refused (:status r))) (is (= :runtime-descriptor (:code r)))))
    (catch :default e (is false (str e)))
    (finally (done))))
(deftest actual-pinned-verifier-causal-controls (async done (controls done)))
(defmethod t/report [::t/default :end-run-tests] [r] (when-not (t/successful? r) (set! (.-exitCode js/process) 1)))
(when (.existsSync fs "packages/eta-mu/src/cljs/eta_mu/infra/review_verification.cljs") (nbb/await (nbb/load-file "packages/eta-mu/src/cljs/eta_mu/infra/review_verification.cljs")))
(t/run-tests 'opencode-review-verification-test)
