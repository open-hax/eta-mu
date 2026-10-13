#!/usr/bin/env bb
;; SPDX-License-Identifier: GPL-3.0-or-later
;; Run the registered Node workflow suites and NBB host suites with real pinned
;; canonical fixtures and source-built Muse verifiers. Linux /proc is required
;; by the reviewed early Node network-denial preload. Setup fetch/build traffic
;; is separate from the credential-free, network-denied test processes.
;;
;; Optional local Git object sources (working-tree files are never consumed):
;; ETA_MU_ASSESSMENT_CANONICAL_REPOSITORY / ETA_MU_ASSESSMENT_MUSE_REPOSITORY.
;; Without them, fetch the exact workflow pins from their official public repos.
;; Requires the normal installed workspace dependencies, Git, tar, Bash, Java,
;; Clojure CLI, npm, Node, pnpm and /usr/bin/python3 (inert non-Node control
;; child); unavailable prerequisites fail the gate.

(require '[babashka.fs :as fs]
         '[babashka.process :as p]
         '[cheshire.core :as json]
         '[clojure.java.io :as io]
         '[clojure.string :as str])
(import '[java.nio.file Files LinkOption]
        '[java.nio.file.attribute FileAttribute PosixFilePermissions]
        '[java.security MessageDigest])

(def root (.getCanonicalPath (-> (io/file *file*) .getAbsoluteFile .getParentFile .getParentFile)))
(def preload (str (fs/path root "scripts/assessment-network-deny-preload.cjs")))
(def nbb-command ["pnpm" "--dir" (str (fs/path root "packages/eta-mu")) "exec" "nbb"])
(def eta-classpath (str (fs/path root "packages/eta-mu/src/cljs")))
(def nofollow (into-array LinkOption [LinkOption/NOFOLLOW_LINKS]))

(defn private-directory! [path]
  (fs/create-dirs path)
  (Files/setPosixFilePermissions (fs/path path) (PosixFilePermissions/fromString "rwx------"))
  (str (fs/real-path path)))

(defn sha256 [file]
  (format "%064x" (BigInteger. 1 (.digest (MessageDigest/getInstance "SHA-256")
                                        (Files/readAllBytes (fs/path file))))))

(defn command! [directory environment argv & [string-output?]]
  (let [result @(p/process argv {:dir directory :env environment :in :inherit
                                :out (if string-output? :string :inherit) :err :inherit})]
    (when-not (zero? (:exit result))
      (throw (ex-info "Assessment prerequisite failed" {:command (first argv) :exit (:exit result)})))
    (:out result)))

(defn environment [work]
  ;; An allowlist prevents inherited GitHub/App/model credentials or auth config
  ;; from reaching fixtures, compilers or the public source fetches.
  (let [home (private-directory! (fs/path work "home"))
        temporary (private-directory! (fs/path work "tmp"))
        bin (private-directory! (fs/path work "bin"))
        gh (fs/path bin "gh")]
    (spit (str gh) "#!/bin/sh\necho 'ASSESSMENT_TEST_NATIVE_GH_FORBIDDEN' >&2\nexit 97\n")
    (Files/setPosixFilePermissions gh (PosixFilePermissions/fromString "rwx------"))
    (cond-> {"PATH" (str bin ":" (or (System/getenv "PATH") "/usr/bin:/bin"))
             "HOME" home "TMPDIR" temporary "LANG" "C.UTF-8" "LC_ALL" "C.UTF-8" "TZ" "UTC"
             "XDG_CONFIG_HOME" (str (fs/path home ".config"))
             "GH_CONFIG_DIR" (str (fs/path home ".config/gh"))
             "GIT_CONFIG_NOSYSTEM" "1" "GIT_CONFIG_GLOBAL" "/dev/null"
             "GIT_TERMINAL_PROMPT" "0" "GIT_ASKPASS" "/bin/false" "SSH_ASKPASS" "/bin/false"
             "NODE_PATH" (str (fs/path root "packages/eta-mu/node_modules") ":"
                              (fs/path root "node_modules"))}
      (System/getenv "JAVA_HOME") (assoc "JAVA_HOME" (System/getenv "JAVA_HOME")))))

(defn workflow-inputs [environment]
  ;; Reuse the existing protected profile extractor and YAML library. No copied
  ;; profile script, YAML/header parser, protocol or permission policy lives here.
  (let [expression
        (str "(require '[eta-mu.extern.actionability-host :as host] '[\"yaml\" :as yaml])\n"
             "(let [root (host/env \"ETA_TEST_ROOT\") "
             "read-workflow (fn [name] (js->clj (.parse yaml (host/read-text (host/join root \".github/workflows\" name))) :keywordize-keys true)) "
             "a (read-workflow \"opencode-actionability-assessment.yml\") "
             "r (read-workflow \"opencode-rejection-assessment.yml\") "
             "c (read-workflow \"opencode-positive-cohort-assessment.yml\")] "
             "(host/output! {:actionability {:canonical (get-in a [:env :CANONICAL_REVISION]) :muse (get-in a [:env :MUSE_REVISION])} "
             ":rejection {:canonical (get-in r [:env :CANONICAL_REVISION]) :muse (get-in r [:env :MUSE_REVISION])} "
             ":positive-cohort {:canonical (get-in c [:env :CANONICAL_REVISION]) :muse (get-in c [:env :MUSE_REVISION])} "
             ":profile (host/source-profile-script (host/join root \".github/workflows/opencode-code-review.yml\"))}))")
        result (json/parse-string (command! root (assoc environment "ETA_TEST_ROOT" root)
                                           (into nbb-command ["--classpath" eta-classpath "-e" expression]) true) true)]
    (doseq [purpose [:actionability :rejection :positive-cohort] dependency [:canonical :muse]]
      (when-not (re-matches #"[0-9a-f]{40}" (or (get-in result [purpose dependency]) ""))
        (throw (ex-info "A protected assessment dependency pin is missing" {:purpose purpose :dependency dependency}))))
    (when (str/blank? (:profile result)) (throw (ex-info "Muse profile is missing" {})))
    result))

(defn object-repository! [work environment kind revisions]
  (if-let [local (System/getenv (case kind :canonical "ETA_MU_ASSESSMENT_CANONICAL_REPOSITORY"
                                        :muse "ETA_MU_ASSESSMENT_MUSE_REPOSITORY"))]
    (.getCanonicalPath (io/file local))
    (let [repository (str (fs/path work (str (name kind) ".git")))
          url (case kind :canonical "https://github.com/riatzukiza/.agents.git"
                         :muse "https://github.com/octave-commons/muse.git")]
      (command! work environment ["git" "-c" "core.hooksPath=/dev/null" "init" "--bare" repository])
      (doseq [revision (distinct revisions)]
        (command! work environment ["git" "-c" "core.hooksPath=/dev/null" "-c" "gc.auto=0"
                                    "-C" repository "fetch" "--depth=1" "--no-tags" "--no-write-fetch-head"
                                    "--no-recurse-submodules" url revision]))
      repository)))

(defn archive! [work environment repository kind revision]
  (let [actual (str/trim (command! work environment ["git" "-C" repository "rev-parse"
                                                   "--verify" (str revision "^{commit}")] true))
        target (private-directory! (fs/path work (str (name kind) "-" revision)))
        archive (str target ".tar")]
    (when-not (= revision actual) (throw (ex-info "Pinned commit object differs" {:kind kind})))
    (command! work environment ["git" "-C" repository "archive" "--format=tar" "--output" archive revision])
    (command! work environment ["tar" "-xf" archive "-C" target])
    target))

(defn build-verifier! [environment profile source]
  (println (str "\nBuilding the actual pinned Muse profile: " source))
  (command! source environment ["bash" "--noprofile" "--norc" "-e" "-o" "pipefail" profile])
  (let [file (str (fs/path source ".opencode/dist/review-invocation.cjs"))]
    (when-not (and (fs/regular-file? file {:nofollow-links true}) (pos? (fs/size file)))
      (throw (ex-info "The actual Muse verifier was not built" {})))
    {:file file :sha256 (sha256 file)}))

(defn audit! [directory capture process-pid]
  ;; Keep the reviewed preload's emitted evidence contract. Missing, malformed,
  ;; unrelated or nonzero-denial records cannot turn a suite into a pass.
  (let [files (vec (fs/list-dir directory))
        records (mapv (fn [file]
                        (when-not (and (fs/regular-file? file {:nofollow-links true})
                                       (<= 1 (fs/size file) 65536))
                          (throw (ex-info "Assessment network audit file refused" {:file (str file)})))
                        (let [record (json/parse-string (slurp (str file)) true)]
                          (when-not (and (= 384 (bit-and 511 (Files/getAttribute file "unix:mode" nofollow)))
                                         (= (Files/getAttribute (fs/path directory) "unix:uid" nofollow)
                                            (Files/getAttribute file "unix:uid" nofollow))
                                         (= "eta-mu.test-network-denial/v1" (:schema record))
                                         (= capture (:capture record)) (= 0 (:deniedAttempts record))
                                         (pos-int? (:pid record))
                                         (= (str (:pid record) ".json") (str (fs/file-name file)))
                                         (vector? (:expectedNodeChildren record))
                                         (every? pos-int? (:expectedNodeChildren record))
                                         (vector? (:kernelAncestry record))
                                         (some #(= process-pid (:pid %)) (:kernelAncestry record)))
                            (throw (ex-info "Assessment network audit refused" {:file (str file)})))
                          record)) files)
        ids (set (map :pid records))]
    (when-not (and (seq records) (= (count records) (count ids))
                   (every? ids (mapcat :expectedNodeChildren records)))
      (throw (ex-info "Assessment network audit membership is incomplete" {})))
    (println (str "Network audit: " (count records) " bound Node processes, zero denied attempts."))))

(defn nbb-test-command [canonical test-file]
  ;; cljs.test reports failures without necessarily setting Node's exit code.
  ;; Override only its completion reporter, retaining normal assertion/summary
  ;; reporting. Require completion for the cljs.test suite before process exit.
  (let [cljs-test? (or (str/includes? test-file "rejection") (str/includes? test-file "positive_cohort"))
        completion (if (str/includes? test-file "positive_cohort") "opencode-positive-cohort-assessment/v1" "opencode-rejection-assessment/v1")
        expression (str "(require '[cljs.test :as t] '[nbb.core :as nbb])\n"
                        "(def completed (atom 0))\n"
                        "(defmethod t/report [:cljs.test/default :end-run-tests] [m] "
                        "(swap! completed inc) (when (pos? (+ (:fail m 0) (:error m 0))) (set! (.-exitCode js/process) 1)) "
                        "(println (js/JSON.stringify (clj->js {:completion " (pr-str completion) " :completed? true "
                        ":tests (:test m) :assertions (+ (:pass m 0) (:fail m 0) (:error m 0)) :failed (+ (:fail m 0) (:error m 0))}))))\n"
                        (when cljs-test?
                          "(.on js/process \"exit\" (fn [] (when-not (= 1 @completed) (set! (.-exitCode js/process) 1))))\n")
                        "(nbb/await (nbb/load-file " (pr-str (str (fs/path root test-file))) "))")]
    (into nbb-command ["--classpath" (str eta-classpath ":" (fs/path canonical "skills/pr-flow/scripts"))
                       "-e" expression])))

(defn completed-suite! [output completion]
  (let [records (keep (fn [line] (try (json/parse-string line true) (catch Exception _ nil)))
                      (str/split-lines output))
        results (filter #(= completion (:completion %)) records)
        result (first results)]
    (when-not (and (= 1 (count results)) (true? (:completed? result)) (= 0 (:failed result))
                   (case completion
                     "opencode-actionability-assessment/v1"
                     (and (= "actual NBB/canonical/Muse source with inert transport" (:tests result))
                          (nil? (:only result)) (pos-int? (:checks result)))
                     ("opencode-rejection-assessment/v1" "opencode-positive-cohort-assessment/v1")
                     (and (pos-int? (:tests result)) (pos-int? (:assertions result)))
                     false))
      (throw (ex-info "Assessment NBB suite did not complete" {:completion completion})))))

(defn test-suite! [work environment {:keys [label argv variables completion]}]
  (println (str "\nAssessment suite: " label))
  (let [directory (private-directory! (fs/path work (str "audit-" label)))
        environment (merge environment variables
                           {"ETA_MU_TEST_NETWORK_AUDIT_DIR" directory
                            "ETA_MU_TEST_NETWORK_AUDIT_CAPTURE" label
                            "NODE_OPTIONS" (str "--require " (pr-str preload))})
        child (p/process argv {:dir root :env environment :in :inherit
                               :out (if completion :string :inherit) :err :inherit})
        pid (.pid ^Process (:proc child))
        result @child]
    (when completion (print (:out result)) (flush))
    (try
      (audit! directory label pid)
      (when completion (completed-suite! (:out result) completion))
      (zero? (:exit result))
      (catch Exception error
        (binding [*out* *err*] (println (.getMessage error) (ex-data error)))
        false))))

(defn run-assessments! [work]
  (when-not (fs/executable? "/usr/bin/python3")
    (throw (ex-info "Assessment controls require /usr/bin/python3" {})))
  (when-not (fs/directory? "/proc/self") (throw (ex-info "Assessment audits require Linux /proc" {})))
  (let [environment (environment work)
        ;; Expected-denial controls own distinct audits and exit97 children; run
        ;; outside zero-denial suite admission and before public source/build I/O.
        _denial-controls (command! root environment ["node" "--test" "scripts/assessment-network-deny-preload.test.mjs"])
        {:keys [profile] :as inputs} (workflow-inputs environment)
        script (str (fs/path work "muse-profile.sh"))
        _profile (spit script profile)
        canonical-repository (object-repository! work environment :canonical (map #(get-in inputs [% :canonical]) [:actionability :rejection :positive-cohort]))
        muse-repository (object-repository! work environment :muse (map #(get-in inputs [% :muse]) [:actionability :rejection :positive-cohort]))
        sources (into {} (for [purpose [:actionability :rejection :positive-cohort]]
                           [purpose {:canonical (archive! work environment canonical-repository :canonical (get-in inputs [purpose :canonical]))
                                     :muse (archive! work environment muse-repository :muse (get-in inputs [purpose :muse]))}]))
        verifiers (into {} (for [[purpose {:keys [muse]}] sources]
                             [purpose (build-verifier! environment script muse)]))
        a (get-in sources [:actionability :canonical])
        r (get-in sources [:rejection :canonical])
        c (get-in sources [:positive-cohort :canonical])
        a-env {"ETA_MU_ACTIONABILITY_VERIFIER_FILE" (get-in verifiers [:actionability :file])
               "ETA_MU_ACTIONABILITY_VERIFIER_SHA256" (get-in verifiers [:actionability :sha256])
               "ACTIONABILITY_NATIVE_FIXTURE" (str (fs/path a "skills/pr-flow/scripts/fixtures/native-knoxx387-author-review-context.json"))
               "ACTIONABILITY_POLICY_FILE" (str (fs/path a "skills/pr-flow/flow.edn"))}
        r-env {"ETA_MU_REJECTION_VERIFIER_FILE" (get-in verifiers [:rejection :file])
               "ETA_MU_REJECTION_VERIFIER_SHA256" (get-in verifiers [:rejection :sha256])
               "CANONICAL_CHECKOUT" r}
        c-env {"ETA_MU_POSITIVE_COHORT_VERIFIER_FILE" (get-in verifiers [:positive-cohort :file])
               "ETA_MU_POSITIVE_COHORT_VERIFIER_SHA256" (get-in verifiers [:positive-cohort :sha256])
               "CANONICAL_CHECKOUT" c}
        suites [{:label "actionability-node" :variables a-env :argv ["node" "--test" ".github/scripts/opencode-actionability-assessment-workflow.test.mjs"]}
                {:label "actionability-nbb" :variables a-env :completion "opencode-actionability-assessment/v1"
                 :argv (nbb-test-command a ".github/scripts/opencode_actionability_assessment_test.cljs")}
                {:label "rejection-node" :variables r-env :argv ["node" "--test" ".github/scripts/opencode-rejection-assessment-workflow.test.mjs"]}
                {:label "rejection-nbb" :variables r-env :completion "opencode-rejection-assessment/v1"
                 :argv (nbb-test-command r ".github/scripts/opencode_rejection_assessment_test.cljs")}
                {:label "positive-cohort-node" :variables c-env :argv ["node" "--test" ".github/scripts/opencode-positive-cohort-assessment-workflow.test.mjs"]}
                {:label "positive-cohort-nbb" :variables c-env :completion "opencode-positive-cohort-assessment/v1"
                 :argv (nbb-test-command c ".github/scripts/opencode_positive_cohort_assessment_test.cljs")}]
        results (mapv (fn [suite] [(:label suite) (test-suite! work environment suite)]) suites)]
    (doseq [[label passed?] results] (println (str (if passed? "PASS " "FAIL ") label)))
    (every? second results)))

(let [work (str (.toRealPath (Files/createTempDirectory "eta-mu-assessments-"
                                                      (into-array FileAttribute [(PosixFilePermissions/asFileAttribute
                                                                                   (PosixFilePermissions/fromString "rwx------"))]))
                            (into-array LinkOption [])))
      passed? (try (run-assessments! work)
                   (catch Exception error
                     (binding [*out* *err*] (println (.getMessage error) (ex-data error)))
                     false))]
  (if passed?
    (fs/delete-tree work)
    (binding [*out* *err*] (println (str "Assessment failure artifacts retained at " work))))
  (System/exit (if passed? 0 1)))
