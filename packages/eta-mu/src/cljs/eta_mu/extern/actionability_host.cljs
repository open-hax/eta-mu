;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.extern.actionability-host
  "Protected host I/O. No actionability, permission or protocol policy."
  (:require ["node:fs" :as fs] ["node:path" :as path]
            ["node:crypto" :as crypto] ["node:child_process" :as process]
            ["node:module" :as module] ["yaml" :as yaml] [clojure.string :as str]
            [edamame.core :as edamame]))

(defn refuse! [code] (throw (ex-info "Actionability host refused" {:code code})))
(defn sha256 [value]
  (.digest (.update (.createHash crypto "sha256") value) "hex"))
(defn json [value] (js/JSON.stringify (clj->js value)))
(defn utf8-length [value] (js/Buffer.byteLength value "utf8"))
(defn private-directory! [directory]
  (let [s (.lstatSync fs directory)]
    (when-not (and (.isDirectory s) (not (.isSymbolicLink s))
                   (= (.resolve path directory) (.realpathSync fs directory))
                   (= 448 (bit-and (.-mode s) 511))
                   (= (.-uid s) (.getuid js/process)))
      (refuse! :private-directory)))
  directory)
(defn read-bytes [file]
  (when-not (and (.isFile (.lstatSync fs file)) (not (.isSymbolicLink (.lstatSync fs file)))
                 (= (.resolve path file) (.realpathSync fs file)))
    (refuse! :regular-file))
  (.readFileSync fs file))
(defn read-text [file] (.decode (js/TextDecoder. "utf-8" #js {:fatal true}) (read-bytes file)))
(defn read-json [file] (js->clj (js/JSON.parse (read-text file)) :keywordize-keys true))
(defn read-edn [file]
  (let [forms (edamame/parse-string-all (read-text file))]
    (when-not (and (= 1 (count forms)) (map? (first forms))) (refuse! :source-edn))
    (first forms)))
(defn write-json! [file value]
  (.writeFileSync fs file (str (json value) "\n") #js {:mode 384 :flag "wx"}))
(defn write-text! [file value] (.writeFileSync fs file value #js {:mode 384 :flag "wx"}))
(defn join [& parts] (apply path/join parts))
(defn env [name] (aget (.-env js/process) name))
(defn output! [value] (.log js/console (json value)))
(defn files-digest [directory paths]
  (sha256 (json (mapv (fn [p] [p (sha256 (read-bytes (join directory p)))]) paths))))
(defn directory-digest [directory]
  (letfn [(files [relative]
            (mapcat (fn [name]
                      (let [p (if (str/blank? relative) name (str relative "/" name))
                            stat (.lstatSync fs (join directory p))]
                        (cond (.isSymbolicLink stat) (refuse! :artifact-symlink)
                              (.isDirectory stat) (files p)
                              (.isFile stat) [p]
                              :else (refuse! :artifact-file-type))))
                    (.readdirSync fs (join directory relative))))]
    (let [paths (vec (sort (files "")))]
      (when (empty? paths) (refuse! :empty-profile))
      (files-digest directory paths))))
(defn source-profile-script [workflow]
  (let [document (js->clj (.parse yaml (read-text workflow)) :keywordize-keys true)
        steps (get-in document [:jobs :prepare_review_context :steps])
        matches (filter #(= "Compile and verify a read-only Muse review profile" (:name %)) steps)]
    (when-not (and (= 1 (count matches)) (= "bash" (:shell (first matches)))
                   (string? (:run (first matches)))) (refuse! :protected-profile-step))
    (:run (first matches))))
(defn argv [] (vec *command-line-args*))
(defn fail-exit! [e]
  (.error js/console (json {:status "refused" :code (name (or (:code (ex-data e)) :host-error))}))
  (set! (.-exitCode js/process) 1))
(defn- host-environment [home token]
  (private-directory! home)
  #js {:PATH (or (.-PATH (.-env js/process)) "/usr/bin:/bin") :HOME home
       :XDG_CONFIG_HOME (.join path home ".config") :GH_CONFIG_DIR (.join path home ".config/gh")
       :GH_TOKEN token :LANG "C.UTF-8" :LC_ALL "C.UTF-8" :TZ "UTC" :GIT_OPTIONAL_LOCKS "0"})

(defn gh-json
  "Synchronous canonical reader ABI. Token stays in the protected child environment."
  [home token & args]
  (let [r (.spawnSync process "gh" (clj->js (into (vec args) ["--hostname" "github.com"]))
                      #js {:env (host-environment home token) :encoding "utf8"
                           :timeout 15000 :maxBuffer 16777216})]
    (when-not (= 0 (.-status r))
      (let [status (some-> (re-find #"HTTP ([0-9]{3})" (or (.-stderr r) "")) second js/Number)]
        (throw (ex-info "Native read failed" {:code :native-read :status status}))))
    (try (js->clj (js/JSON.parse (.-stdout r)) :keywordize-keys true)
         (catch :default _ (refuse! :native-json)))))

(defn- source-git [checkout & args]
  (let [r (.spawnSync process "git" (clj->js (into ["--no-pager" "--literal-pathspecs" "-c" "core.fsmonitor=false"
                                                   "-C" checkout] args))
                      #js {:env #js {:PATH (or (env "PATH") "/usr/bin:/bin")
                                     :GIT_OPTIONAL_LOCKS "0" :GIT_CONFIG_NOSYSTEM "1"}
                           :timeout 15000 :maxBuffer 16777216})]
    (when-not (= 0 (.-status r)) (refuse! :source-object))
    (.-stdout r)))

(defn- source-merge-base [checkout head base]
  (let [bases (str/split-lines (str/trim (.toString (source-git checkout "merge-base" "--all" head base) "utf8")))]
    ;; Refuse unavailable or ambiguous ancestry rather than select a preimage.
    (when-not (and (= 1 (count bases)) (re-matches #"[0-9a-f]{40}" (first bases)))
      (refuse! :source-merge-base))
    (first bases)))

(defn immutable-source
  "Read selected exact Git objects; never execute candidate source or follow its paths."
  ([checkout head paths] (immutable-source checkout head paths head))
  ([checkout head paths checkout-head]
  (let [run (partial source-git checkout)
        actual (str/trim (.toString (run "rev-parse" "HEAD") "utf8"))]
    (when-not (and (= checkout-head actual) (re-matches #"[0-9a-f]{40}" (or head ""))
                   (vector? paths) (seq paths)
                   (= (count paths) (count (set paths)))
                   (every? #(and (string? %) (not (str/blank? %)) (not (str/includes? % "\u0000"))) paths))
      (refuse! :source-selection))
    (let [files (mapv (fn [p]
                        (let [entry (.toString (run "ls-tree" "-z" head "--" p) "utf8")
                              [_ mode kind object found] (re-matches #"(100644|100755|120000|160000) (blob|commit) ([0-9a-f]{40})\t([^\u0000]+)\u0000" entry)]
                          (when-not (and (= p found)
                                         (if (= "160000" mode) (= "commit" kind) (= "blob" kind)))
                            (refuse! :source-entry))
                          ;; Symlinks are Git blob bytes, never filesystem targets.
                          ;; A gitlink carries only its committed object ID; no
                          ;; nested repository or external commit bytes are read.
                          (let [carrier (if (= "commit" kind) "gitlink-object-id" "blob")
                                bytes (if (= "commit" kind) (js/Buffer.from object "ascii")
                                          (run "cat-file" "blob" object))
                                text (when (#{"100644" "100755" "120000"} mode)
                                       (try (.decode (js/TextDecoder. "utf-8" #js {:fatal true :ignoreBOM true}) bytes)
                                            (catch :default _ nil)))]
                            (cond-> {:path p :git-mode mode :object-type kind :blob object
                                     :byte-carrier carrier :bytes (.-length bytes) :sha256 (sha256 bytes)}
                              (some? text) (assoc :text text)
                              (and (= "blob" kind) (nil? text))
                              (assoc :content-base64 (.toString bytes "base64")))))) paths)
          manifest [2 head (mapv #(mapv % [:path :git-mode :object-type :blob :byte-carrier :bytes :sha256]) files)]]
      {:head head :files files :manifest manifest :sha256 (sha256 (pr-str manifest))}))))

(defn verify-checkouts!
  "Compare trusted full pins with exact clean tracked source; never repair a checkout."
  [checkouts]
  (doseq [[directory pin] checkouts]
    (when-not (and (string? pin) (re-matches #"[0-9a-f]{40}" pin)) (refuse! :source-pin))
    (let [run (fn [& args]
                (.spawnSync process "git" (clj->js (into ["--no-pager" "-c" "core.fsmonitor=false" "-C" directory] args))
                            #js {:env #js {:PATH (or (env "PATH") "/usr/bin:/bin") :GIT_OPTIONAL_LOCKS "0"}
                                 :encoding "utf8" :timeout 15000 :maxBuffer 1048576}))
          head (run "rev-parse" "HEAD")
          dirty (run "diff" "--quiet" "--no-ext-diff" "HEAD")]
      (when-not (and (= 0 (.-status head) (.-status dirty)) (= pin (str/trim (.-stdout head))))
        (refuse! :source-checkout)))))

(defn source-inventory
  "Bind all changed native paths, including removed files, to immutable Git bytes."
  [read checkout repo n head]
  (let [pr (read "api" (str "repos/" repo "/pulls/" n))
        pages (read "api" (str "repos/" repo "/pulls/" n "/files?per_page=100") "--paginate" "--slurp")
        files (when (and (vector? pages) (seq pages) (every? vector? pages)) (vec (mapcat identity pages)))
        paths (mapv :filename files)
        base (get-in pr [:base :sha])]
    (when-not (and (= n (:number pr)) (= "open" (:state pr)) (= head (get-in pr [:head :sha]))
                   (re-matches #"[0-9a-f]{40}" (or base ""))
                   (pos-int? (:changed_files pr)) (= (:changed_files pr) (count files))
                   (= (count paths) (count (set paths))) (every? string? paths)
                   (every? #(#{"added" "modified" "removed" "renamed" "copied" "changed" "unchanged"} (:status %)) files))
      (refuse! :source-file-inventory))
    (let [live (filterv #(not= "removed" (:status %)) files)
          removed (filterv #(= "removed" (:status %)) files)
          current (when (seq live) (immutable-source checkout head (mapv :filename live)))
          merge-base (when (seq removed) (source-merge-base checkout head base))
          old (when (seq removed) (immutable-source checkout merge-base (mapv :filename removed) head))
          manifest [1 repo n head base (mapv #(select-keys % [:filename :previous_filename :status]) files)
                    (:manifest current) (:manifest old)]]
      {:head head :base base :merge-base merge-base :files (:files current) :removed-files (:files old) :changed-files files
       :manifest manifest :sha256 (sha256 (pr-str manifest))})))

(defn verify-run!
  "Bind host-run/caller coordinates separately from target PR coordinates."
  [read config publication?]
  (let [{:keys [run-repo run-id run-attempt workflow-sha workflow-ref eta-revision direct?
                job-workflow-sha job-workflow-ref prepare-check-run-id assess-check-run-id]} config
        repository (read "api" (str "repos/" run-repo))
        run (read "api" (str "repos/" run-repo "/actions/runs/" run-id))
        eta (read "api" "repos/open-hax/eta-mu")
        default (:default_branch eta)
        branch (read "api" (str "repos/open-hax/eta-mu/branches/" default))
        full-ref (str "open-hax/eta-mu/.github/workflows/opencode-actionability-assessment.yml@refs/heads/" default)]
    (when-not (and (= "open-hax/eta-mu" run-repo)
                   (= run-id (:id run)) (= run-attempt (:run_attempt run))
                   (= eta-revision job-workflow-sha)
                   (string? job-workflow-ref)
                   (re-matches #"open-hax/eta-mu/\.github/workflows/opencode-actionability-assessment\.yml@.+" job-workflow-ref)
                   (pos-int? prepare-check-run-id)
                   (true? (:protected branch))
                   (= (:id repository) (get-in run [:repository :id]))
                   (= run-repo (get-in run [:repository :full_name]))
                   (if direct?
                     (and (= "open-hax/eta-mu" run-repo) (= workflow-ref job-workflow-ref full-ref)
                          (= workflow-sha eta-revision (:head_sha run))
                          (= eta-revision (get-in branch [:commit :sha])))
                     (and (some #(and (= eta-revision (:sha %))
                                      (str/starts-with? (:path %) "open-hax/eta-mu/.github/workflows/opencode-actionability-assessment.yml@"))
                                (:referenced_workflows run))
                          (#{"ahead" "identical"}
                           (:status (read "api" (str "repos/open-hax/eta-mu/compare/" eta-revision "..." default)))))))
      (refuse! :host-run-source))
    (when publication?
      (let [pages (read "api" (str "repos/" run-repo "/actions/runs/" run-id "/attempts/" run-attempt "/jobs")
                        "--paginate" "--slurp")
            _ (when-not (and (vector? pages) (seq pages) (every? #(vector? (:jobs %)) pages))
                (refuse! :trusted-job-pages))
            jobs (mapcat :jobs pages)]
        (when-not (and (pos-int? assess-check-run-id) (not= prepare-check-run-id assess-check-run-id))
          (refuse! :trusted-job-completion))
        (doseq [[label check-run-id] [["Prepare actionability input" prepare-check-run-id]
                                     ["Assess complete actionability input" assess-check-run-id]]]
          (let [check-url (str "https://api.github.com/repos/" run-repo "/check-runs/" check-run-id)
                matches (filter #(= check-url (:check_run_url %)) jobs)
                job (first matches)]
            (when-not (and (= 1 (count matches)) (= run-id (:run_id job))
                           (or (= label (:name job)) (str/ends-with? (:name job) (str " / " label)))
                           (= "completed" (:status job)) (= "success" (:conclusion job)))
              (refuse! :trusted-job-completion))))))))

(defn invocation
  "Recompute actual accepted invocation with the selected source-built Muse export."
  [directory verifier-file verifier-sha]
  (let [bytes (read-bytes verifier-file)]
    (when-not (= verifier-sha (sha256 bytes)) (refuse! :verifier-source))
    (let [require (.createRequire module verifier-file)
          verifier (require verifier-file)
          full (read-bytes (.join path directory "actionability-input.txt"))
          manifest (read-bytes (.join path directory "input-manifest.json"))
          tools (vec (remove str/blank? (str/split-lines (read-text (.join path directory "tools.txt")))))
          raw-recovery (js/JSON.parse (read-text (.join path directory "recovery.json")))
          recovery (js->clj raw-recovery :keywordize-keys true)
          accepted (:accepted_invocation recovery)
          response-file (:response_file accepted)]
      (when-not (and (#{"model-response-attempt-1.txt" "model-response-attempt-2.txt"} response-file)
                     (= "submission.json" (:submission_file accepted))) (refuse! :accepted-files))
      (let [submission-file (.join path directory "submission.json")
            prepared (.prepareReviewInvocationContext verifier full manifest (clj->js tools) submission-file)
            response (read-bytes (.join path directory response-file))
            submission (read-bytes submission-file)
            verdict (.verifyReviewInvocation verifier response submission prepared)
            decoded (js->clj verdict :keywordize-keys true)
            last-attempt (last (:attempts recovery))]
        (when-not (and (= verifier-sha (sha256 (read-bytes verifier-file)) (:verifier_sha256 accepted))
                       (= "open-hax.review-recovery/v1" (:schema recovery)) (= 2 (:max_attempts recovery))
                       (= (:attempt accepted) (:attempt last-attempt)) (#{1 2} (:attempt accepted))
                       (= "completed" (:invocation_state last-attempt)) (= 0 (:exit_code last-attempt))
                       (true? (:ok decoded)) (:acceptedInvocation decoded)
                       (= decoded (:canonical_verdict accepted))
                       (= (:sessionID decoded) (:session_id accepted))
                       (= (sha256 response) (:response_sha256 accepted))
                       (= (sha256 submission) (:submission_sha256 accepted))
                       (= (sha256 (js/JSON.stringify prepared)) (:expected_context_sha256 accepted)))
          (refuse! :accepted-invocation))
        {:source (js->clj (.-inputSource prepared) :keywordize-keys true)
         :submission (js->clj (js/JSON.parse (.toString submission "utf8")) :keywordize-keys true)
         :accepted-sha256 (sha256 (js/JSON.stringify (.-accepted_invocation raw-recovery)))
         :verifier-sha256 verifier-sha :verdict decoded}))))

(defn input-source [directory verifier-file verifier-sha]
  (when-not (= verifier-sha (sha256 (read-bytes verifier-file))) (refuse! :verifier-source))
  (let [require (.createRequire module verifier-file) verifier (require verifier-file)
        tools (remove str/blank? (str/split-lines (read-text (join directory "tools.txt"))))
        context (.prepareReviewInvocationContext verifier (read-bytes (join directory "actionability-input.txt"))
                                                (read-bytes (join directory "input-manifest.json"))
                                                (clj->js tools) (join directory "submission.json"))]
    (when-not (= verifier-sha (sha256 (read-bytes verifier-file))) (refuse! :verifier-source))
    (js->clj (.-inputSource context) :keywordize-keys true)))

(defn app-jwt
  "Sign a short-lived publisher-only JWT; callers must never persist or report it."
  [app-id private-key now]
  (try
    (when-not (and (string? app-id) (re-matches #"[1-9][0-9]*" app-id)
                   (js/Number.isSafeInteger (js/Number app-id)) (string? private-key))
      (refuse! :publisher-credentials))
    (let [key (.createPrivateKey crypto private-key)
          _ (when-not (= "rsa" (.-asymmetricKeyType key)) (refuse! :publisher-key-type))
          encode (fn [v] (.toString (js/Buffer.from (json v)) "base64url"))
          unsigned (str (encode {:alg "RS256" :typ "JWT"}) "."
                        (encode {:iat (- now 60) :exp (+ now 480) :iss app-id}))
          signature (.sign crypto "RSA-SHA256" (js/Buffer.from unsigned) key)]
      (str unsigned "." (.toString signature "base64url")))
    (catch :default _ (refuse! :publisher-credentials))))

(defn publisher-proof
  "Read authentic App/installation metadata and token repository access; no mutation."
  [read-jwt read-token app-id installation-id action-slug]
  (when-not (and (string? installation-id) (re-matches #"[1-9][0-9]*" installation-id)
                 (js/Number.isSafeInteger (js/Number installation-id))
                 (string? action-slug) (re-matches #"[a-zA-Z0-9_-]+" action-slug))
    (refuse! :publisher-action-outputs))
  (let [app (read-jwt "api" "app")
        installation (read-jwt "api" (str "app/installations/" installation-id))
        pages (read-token "api" "installation/repositories" "--paginate" "--slurp")
        user (read-token "api" (str "users/" action-slug "[bot]"))]
    (when-not (and (string? app-id) (re-matches #"[1-9][0-9]*" app-id)
                   (js/Number.isSafeInteger (js/Number app-id))
                   (= (js/Number app-id) (:id app) (:app_id installation))
                   (= action-slug (:slug app)) (= (js/Number installation-id) (:id installation))
                   (= "write" (get-in installation [:permissions :issues]))
                   (vector? pages) (seq pages) (every? #(and (vector? (:repositories %))
                                                           (nat-int? (:total_count %))) pages)
                   (= 1 (count (set (map :total_count pages))))
                   (= (:total_count (first pages)) (count (mapcat :repositories pages)))
                   (= (count (mapcat :repositories pages)) (count (set (map :id (mapcat :repositories pages)))))
                   (= (str action-slug "[bot]") (:login user)) (= "Bot" (:type user)))
      (refuse! :publisher-native-mapping))
    {:app-id (:id app) :installation-id (:id installation) :slug (:slug app)
     :issue-grant (get-in installation [:permissions :issues])
     :repositories (vec (mapcat :repositories pages))
     :user (select-keys user [:login :id :node_id :type])}))

(defn actual-publisher-proof
  "AppJWT is ephemeral inside this protected publisher boundary only."
  [home]
  (let [app-id (env "ETA_MU_APP_ID")
        jwt (app-jwt app-id (env "ETA_MU_APP_PRIVATE_KEY") (js/Math.floor (/ (.now js/Date) 1000)))
        token (env "GH_TOKEN")]
    (when-not (and (string? token) (not (str/blank? token))) (refuse! :publisher-token))
    (publisher-proof (partial gh-json home jwt) (partial gh-json home token) app-id
                     (env "ACTIONABILITY_INSTALLATION_ID") (env "ACTIONABILITY_APP_SLUG"))))

(defn- ^:async response-bytes [reader parts size]
  (let [part (await (.read reader))]
    (if (.-done part)
      (js/Buffer.concat (clj->js parts))
      (let [value (.-value part) total (+ size (.-length value))]
        (when (> total 1048576)
          (await (.cancel reader))
          (refuse! :native-response-limit))
        (await (response-bytes reader (conj parts (js/Buffer.from value)) total))))))

(defn ^:async post-comment!
  "One issue-comment write intent, without redirects or application retries."
  ([repo n body token] (await (post-comment! repo n body token js/fetch)))
  ([repo n body token fetch]
  (try
    (let [response (await (fetch (str "https://api.github.com/repos/" repo "/issues/" n "/comments")
                                  #js {:method "POST" :redirect "error"
                                       :signal (.timeout js/AbortSignal 15000)
                                       :headers #js {"Authorization" (str "Bearer " token)
                                                      "Accept" "application/vnd.github+json"
                                                      "Content-Type" "application/json"
                                                      "X-GitHub-Api-Version" "2022-11-28"}
                                       :body (json {:body body})}))]
      (if (.-ok response)
        (let [reader (.getReader (.-body response))
              bytes (await (response-bytes reader [] 0))
              text (.decode (js/TextDecoder. "utf-8" #js {:fatal true}) bytes)]
          {:outcome :posted :record (js->clj (js/JSON.parse text) :keywordize-keys true)})
        ;; A server failure can follow a committed write. Preserve the one
        ;; intent and require the same fresh readback used after transport loss.
        {:outcome (if (<= 500 (.-status response) 599) :uncertain :refused)
         :http-status (.-status response)}))
    (catch :default _ {:outcome :uncertain}))))
