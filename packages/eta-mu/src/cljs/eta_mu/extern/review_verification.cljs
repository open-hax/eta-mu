;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.extern.review-verification
  "Hash-sealed immutable modules and disposable credential-free NBB workers.
  Installation paths are boot capabilities, never archive-selected machinery."
  (:require [eta-mu.law.review-verification :as law]
            [eta-mu.shape.review-verification :as shape]
            [nbb.core :as nbb] [cljs.reader :as reader] [clojure.string :as str]
            ["node:fs" :as fs] ["node:path" :as path] ["node:os" :as os]
            ["node:crypto" :as crypto] ["node:module" :refer [createRequire]]
            ["node:worker_threads" :as threads :refer [Worker]]))
(defonce ^:private runtimes (atom {}))
(defonce ^:private workers (atom #{}))
(defn wall-ms [] (.now js/Date))
(defn- monotonic [] (.now js/performance))
(defn- fail! [code] (throw (ex-info "Immutable review verification refused" {:code code})))
(defn- digest [bytes] (.digest (.update (.createHash crypto "sha256") bytes) "hex"))
(defn- regular-bytes [file maximum]
  (let [stat (.lstatSync fs file)]
    (when-not (and (.isFile stat) (not (.isSymbolicLink stat))
                   (= (.realpathSync fs file) (.resolve path file))
                   (<= (.-size stat) maximum)) (fail! :runtime-file))
    (.readFileSync fs file)))
(defn- installed! [root]
  (let [raw (regular-bytes (.join path root "runtime.json") 16384)]
    (when-not (= (:build-descriptor-sha256 law/descriptor) (digest raw)) (fail! :runtime-build))
    (let [manifest (js->clj (js/JSON.parse (.toString raw "utf8")) :keywordize-keys true)]
      (when-not (= (str (:node-major manifest)) (first (str/split (.-node (.-versions js/process)) #"\.")))
        (fail! :runtime-node))
      {:manifest manifest :raw raw
       :files (mapv (fn [{:keys [file bytes sha256]}]
                      (let [content (regular-bytes (.join path root file) 1048576)]
                        (when-not (and (= bytes (.-length content)) (= sha256 (digest content)))
                          (fail! :runtime-file-digest))
                        [file content])) (:files manifest))})))
(defn open-runtime!
  "Provisioning boundary: only this exact admitted descriptor/file closure can
  be sealed. No test fixture/default path, environment-selected code or upload
  is selected here. Returns an opaque local capability; proves no adoption."
  [installation descriptor]
  (if-not (= law/descriptor descriptor)
    (shape/refused :runtime-descriptor)
    (let [owned (atom nil)]
      (try
        (let [installation (.resolve path installation)
              {:keys [raw files]} (installed! installation)
              temp-root (.mkdtempSync fs (.join path (.tmpdir os) "eta-immutable-review-runtime-"))
              _ (reset! owned temp-root)
              root (.realpathSync fs temp-root)
              _ (reset! owned root)
              _ (.chmodSync fs root 448)
              _ (.writeFileSync fs (.join path root "runtime.json") raw #js {:flag "wx" :mode 256})]
          (doseq [[name bytes] files]
            (let [file (.join path root name)]
              (.mkdirSync fs (.dirname path file) #js {:recursive true :mode 448})
              (.writeFileSync fs file bytes #js {:flag "wx" :mode 256})))
          (installed! root)
          (let [token (str (random-uuid))]
            (swap! runtimes assoc token root)
            {:status :ready :runtime token :descriptor law/descriptor
             :qualification :local-source-byte-capability}))
        (catch :default e
          (when @owned (.rmSync fs @owned #js {:recursive true :force true}))
          (shape/refused (or (:code (ex-data e)) :runtime-host)))))))
(defn close-runtime! [runtime]
  (when-let [root (get @runtimes runtime)]
    (.rmSync fs root #js {:recursive true :force true})
    (swap! runtimes dissoc runtime))
  {:status :closed})
(defn resources [] {:runtimes (count @runtimes) :workers (count @workers)})
(defn- base64-bytes [encoded]
  (when-not (string? encoded) (fail! :member-bytes))
  (let [bytes (.from js/Buffer encoded "base64")]
    (when-not (= encoded (.toString bytes "base64")) (fail! :member-bytes)) bytes))
(defn- member [members name]
  (let [value (get members name) bytes (base64-bytes (:base64 value))]
    (when-not (and (= (:size value) (.-length bytes)) (= (:sha256 value) (digest bytes)))
      (fail! :member-bytes)) bytes))
(defn- fatal-text [bytes]
  (.decode (js/TextDecoder. "utf-8" #js {:fatal true :ignoreBOM true}) bytes))
(defn- runtime-api [root]
  (let [require (createRequire (.join path root "review-invocation.cjs"))]
    {:verifier (require (.join path root "review-invocation.cjs"))
     :publisher (require (.join path root "publish-opencode-review.cjs"))
     :recovery (require (.join path root "run-opencode-review-recovery.mjs"))}))
(defn- strict-value [strict bytes] (strict (fatal-text bytes)))
(defn- inspect-members [strict members]
  (doseq [name law/mandatory-members] (when-not (contains? members name) (fail! :verification-members)))
  (let [raw (member members "basehead.diff") preview (when (get members "pr.diff") (member members "pr.diff"))
        manifest (member members "input-manifest.json")]
    (cond-> {:status :inspected :manifest (strict-value strict manifest)
             :manifest-identity {:bytes (.-length manifest) :sha256 (digest manifest)}
             :archive-diff {:base64 (.toString raw "base64") :size (.-length raw) :sha256 (digest raw)}}
      preview (assoc :archive-preview {:base64 (.toString preview "base64") :size (.-length preview) :sha256 (digest preview)}))))
(defn- ^:async replay-recovery! [root members recovery-module selected verifier prepared]
  ;; Replay retained data through production admission, never invoke a model.
  ;; Process outcomes are compared data, not authentication of native execution.
  (let [records (:attempts selected) scratch (.mkdtempSync fs (.join path root "replay-"))
        count-attempts (count records)]
    (try
      (when-not (= (vec (range 1 (inc count-attempts))) (mapv :attempt records)) (fail! :recovery-order))
      (.writeFileSync fs (.join path scratch "basehead.diff") (member members "basehead.diff"))
      (let [replayed
            (await (.runReviewRecovery recovery-module
                    #js {:evidenceDirectory scratch :basePrompt "Validate retained invocation data only; no execution."
                         :expectedContext prepared :verifierSha256 (:verifier-sha256 law/descriptor)
                         :verifyReviewInvocation (.-verifyReviewInvocation verifier)
                         :reviewTools (.-reviewTools prepared) :modelDiscovery (clj->js (:model_discovery selected))
                         :invokeAttempt
                         (fn [invocation]
                           (let [attempt (.-attempt invocation) record (nth records (dec attempt))
                                 response-name (str "model-response-attempt-" attempt ".txt")
                                 stderr-name (str "opencode-stderr-attempt-" attempt ".log")
                                 response (member members response-name) stderr (member members stderr-name)
                                 submission-name (if (= attempt count-attempts) "submission.json"
                                                   (str "submission-attempt-" attempt ".json"))]
                             (when-not (and (= attempt (:attempt record))
                                            (= response-name (:response_file record)) (= stderr-name (:stderr_file record))
                                            (= (digest response) (:response_sha256 record)) (= (digest stderr) (:stderr_sha256 record)))
                               (fail! :recovery-captures))
                             (.writeFileSync fs (.-responseFile invocation) response)
                             (.writeFileSync fs (.-stderrFile invocation) stderr)
                             (when (= "present" (:submission_state record))
                               (.writeFileSync fs (.join path scratch "submission.json") (member members submission-name)))
                             (clj->js
                              (cond-> {:exitCode (:exit_code record)}
                                (contains? record :timeout_ms)
                                (assoc :timeoutMs (:timeout_ms record) :timedOut (:timed_out record)
                                       :signal (:exit_signal record) :parentSignal (:parent_signal record)
                                       :pid (:process_id record) :cleanupComplete (:cleanup_complete record)
                                       :capturesClosed (:captures_closed record) :terminationSignals (:termination_signals record))))))}))
            replayed (js->clj replayed :keywordize-keys true)]
        (when-not (= (select-keys selected [:recovery_reason :attempts :accepted_invocation :model_discovery])
                     (select-keys replayed [:recovery_reason :attempts :accepted_invocation :model_discovery]))
          (fail! :recovery-lifecycle)))
      (finally (.rmSync fs scratch #js {:recursive true :force true})))))
(defn- ^:async verify-members [root strict {:keys [verifier publisher recovery]} physical expected]
  (let [members (:members physical) manifest-raw (member members "input-manifest.json")
        manifest (strict-value strict manifest-raw) full (member members "basehead.diff")
        input-proof-raw (member members "input-verification.json")
        input-proof (strict-value strict input-proof-raw)
        registry (vec (remove str/blank? (str/split-lines (fatal-text (member members "metadata/exposed-tools.txt")))))
        recovery-raw (member members "recovery.json") selected (strict-value strict recovery-raw)
        accepted (:accepted_invocation selected) attempt (:attempt accepted)
        response-name (str "model-response-attempt-" attempt ".txt")
        witness (get-in accepted [:canonical_verdict :acceptedInvocation :submissionFile])]
    (when-not (and (= manifest (:manifest expected))
                   (= (digest manifest-raw) (:manifest_sha256 input-proof))
                   (.equals full (base64-bytes (:full-diff-base64 expected)))
                   (= registry (:tools expected)) (= input-proof (:input-verification expected)))
      (fail! :reconstructed-input-mismatch))
    (when-not (and (= "open-hax.review-recovery/v1" (:schema selected)) (= 2 (:max_attempts selected))
                   (#{1 2} attempt) (= attempt (count (:attempts selected)))
                   (= attempt (:attempt (last (:attempts selected))))
                   (= 0 (:exit_code (last (:attempts selected))))
                   (= "completed" (:invocation_state (last (:attempts selected))))
                   (= (:response_sha256 accepted) (:response_sha256 (last (:attempts selected))))
                   (= (:submission_sha256 accepted) (:submission_sha256 (last (:attempts selected))))
                   (= response-name (:response_file accepted)) (= "submission.json" (:submission_file accepted))
                   (= (:verifier-sha256 law/descriptor) (:verifier_sha256 accepted))
                   (string? witness) (not (str/blank? witness))) (fail! :accepted-invocation))
    (let [response (member members response-name) submission (member members "submission.json")
          envelope (strict-value strict submission)
          prepared (.prepareReviewInvocationContext verifier full manifest-raw (clj->js registry) witness)
          verdict (.verifyReviewInvocation verifier response submission prepared)
          decoded (js->clj verdict :keywordize-keys true)]
      (when-not (and (true? (:ok decoded)) (:acceptedInvocation decoded)
                     (= decoded (:canonical_verdict accepted)) (= (:sessionID decoded) (:session_id accepted))
                     (= (digest response) (:response_sha256 accepted))
                     (= (digest submission) (:submission_sha256 accepted))
                     (= (digest (js/JSON.stringify prepared)) (:expected_context_sha256 accepted)))
        (fail! :canonical-invocation))
      (await (replay-recovery! root members recovery selected verifier prepared))
      (let [stage (.mkdtempSync fs (.join path root "data-"))
            ]
        (try
          (doseq [name (conj law/discovery-files "submission.json")]
            (let [raw (member members name)]
              (when (str/ends-with? name ".json") (strict-value strict raw))
              (.writeFileSync fs (.join path stage name) raw #js {:flag "wx" :mode 256})))
          (.verifyModelDiscoveryArtifacts recovery stage (clj->js selected) (:expected-opencode-version expected))
          (let [index (js/Map.)
                _ (doseq [{:keys [filename patch]} (:changed-files expected)]
                    (.set index filename (.addedRightLines publisher patch)))
                native-envelope (.readSubmission publisher #js {:submissionFile (.join path stage "submission.json")})
                _ (.validateEnvelope publisher native-envelope index)
                payload (shape/native-payload envelope)]
            (when (>= (wall-ms) (get-in physical [:artifact :expires-at-ms])) (fail! :archive-native-binding))
            {:status :verified :effects [] :forbidden-effects []
             :qualification :local-source-byte-verification
             :limits [:native-reconstruction-port :protected-custody :default-adoption :hosted-identity :publication]
             :verification {:origin :trusted-independent-verifier :result :verified
                            :sources (:sources expected) :tuple (:tuple expected)
                            :artifact-id (get-in physical [:artifact :id]) :artifact-sha256 (get-in physical [:artifact :sha256])
                            :run-id (get-in expected [:run :id]) :attempt (get-in expected [:run :attempt])
                            :full-input (digest full) :input-verification (digest input-proof-raw)
                            :trace (digest response) :submission (digest submission)
                            :invocation (digest (js/JSON.stringify (.-accepted_invocation (js/JSON.parse (fatal-text recovery-raw))))) :discovery (digest (member members "model-discovery.json"))
                            :context (digest (js/JSON.stringify prepared)) :submission-envelope envelope
                            :publisher-validation {:origin :trusted-publisher-validator :result :verified
                                                   :module-source (:muse-source law/descriptor) :module-sha256 law/publisher-sha256
                                                   :submission-sha256 (digest submission)
                                                   :payload payload}
                            :page-count (:pageCount decoded) :verified-page-count (:pageCount decoded)
                            :completed-at-ms (wall-ms)}})
          (finally (.rmSync fs stage #js {:recursive true :force true})))))))
(defn ^:async worker-call!
  "Internal fixed worker entry; no request-selected namespace/code/config."
  [root operation payload]
  (try
    (when (or (.-isMainThread threads) (not= "eta-mu.review-verification.worker/v1" (some-> (.-workerData threads) .-mode)))
      (fail! :verification-runtime))
    (when (some #(some? (aget (.-env js/process) %)) ["GH_TOKEN" "GITHUB_TOKEN" "OPENAI_API_KEY" "ETA_MU_APP_PRIVATE_KEY"])
      (fail! :credential-environment))
    (installed! root)
    ;; NBB lacks cljs.core/js-invoke. Bind only that host compatibility
    ;; operation before loading the unchanged pinned source. JSON policy is
    ;; still Muse's exact strict-json; canonical verification uses the CJS.
    (await (nbb/load-string "(ns eta-mu.extern.review-invocation) (defn js-invoke [object method & args] (.apply (aget object method) object (to-array args)))"))
    (doseq [file law/strict-source-files] (await (nbb/load-file (.join path root file))))
    (let [strict (resolve 'eta-mu.extern.review-invocation/strict-json)
          api (runtime-api root)]
      (when-not strict (fail! :runtime-strict-json))
      (case operation
        :inspect (inspect-members strict (get-in payload [:physical :members]))
        :verify (await (verify-members root strict api (:physical payload) (:expected payload)))
        (shape/refused :verification-operation)))
    (catch :default e (shape/refused (or (:code (ex-data e)) :immutable-verification)))))
(defn- accepted-runtime []
  (let [source (:file (meta #'open-runtime!))]
    (when-not (and (string? source) (.isAbsolute path source)) (fail! :verification-runtime))
    (let [package-root (.resolve path (.dirname path source) "../../../..")
          file (.join path package-root "package.json") package (js/JSON.parse (.readFileSync fs file "utf8"))
          require (createRequire file)]
      {:nbb (.resolve require "nbb") :version (aget (.-dependencies package) "nbb")
       :classpath (.join path package-root "src/cljs")})))
(def ^:private worker-source
  "const {parentPort,workerData}=require('node:worker_threads');const {pathToFileURL}=require('node:url');
(async()=>{try{const api=await import(pathToFileURL(workerData.nbb).href);if(api.version()!==workerData.version)throw Error('runtime');
api.addClassPath(workerData.classpath);api.addClassPath(workerData.root+'/muse-src');
const run=await api.loadString(\"(require '[eta-mu.extern.review-verification :as host] '[cljs.reader :as reader]) (defn ^:async run [root op data] (let [result (await (host/worker-call! root (reader/read-string op) (reader/read-string data)))] (pr-str result))) (fn [root op data] (run root op data))\",{disableConfig:true});
const denied=[];const deny=name=>()=>{denied.push(name);throw Error('forbidden effect');};
for(const [name,methods] of [['node:child_process',['spawn','spawnSync','exec','execSync','execFile','execFileSync','fork']],['node:http',['request','get']],['node:https',['request','get']],['node:net',['connect','createConnection']],['node:tls',['connect']]]){const mod=require(name);for(const method of methods)mod[method]=deny(name+'.'+method);}globalThis.fetch=deny('fetch');require('node:module').syncBuiltinESMExports();
const value=await run(workerData.root,workerData.operation,workerData.payload);if(denied.length)throw Error('forbidden effect');parentPort.postMessage({ok:true,result:value});
}catch(_){parentPort.postMessage({ok:false});}})();")
(defn ^:async invoke! [runtime operation payload bounds]
  (if-let [root (get @runtimes runtime)]
    (let [start (monotonic) maximum (:operation-ms bounds) timer (atom nil) worker (atom nil)]
      (try
        (let [{:keys [nbb version classpath]} (accepted-runtime)
              w (Worker. worker-source #js {:eval true :env #js {} :execArgv #js []
                                           :resourceLimits #js {:maxOldGenerationSizeMb 128 :maxYoungGenerationSizeMb 32 :stackSizeMb 8}
                                           :workerData #js {:mode "eta-mu.review-verification.worker/v1"
                                                            :nbb nbb :version version :classpath classpath :root root
                                                            :operation (pr-str operation) :payload (pr-str payload)}})
              _ (reset! worker w) _ (swap! workers conj w)
              raw (await (js/Promise.
                          (fn [resolve reject]
                            (reset! timer (js/setTimeout #(reject (ex-info "Verifier deadline" {:code :verification-operation-time})) maximum))
                            (.once w "message" (fn [m] (if (.-ok m) (resolve (.-result m)) (reject (ex-info "Verifier worker" {:code :verification-runtime})))))
                            (.once w "error" (fn [_] (reject (ex-info "Verifier worker" {:code :verification-runtime}))))
                            (.once w "exit" (fn [_] (reject (ex-info "Verifier worker exited" {:code :verification-runtime})))))))
              result (reader/read-string raw)]
          (if (>= (- (monotonic) start) maximum) (shape/refused :verification-operation-time) result))
        (catch :default e (shape/refused (or (:code (ex-data e)) :verification-runtime)))
        (finally
          (let [_ (when @timer (js/clearTimeout @timer))
                _ (when @worker (await (.terminate @worker)))]
            (when @worker (swap! workers disj @worker))))))
    (shape/refused :runtime-capability)))
