(ns eta-mu.fork-tax.infra.cli
  "Fork Tax command implementation owned by @eta-mu/fork-tax."
  (:require [clojure.string :as str]
            [eta-mu.fork-tax.domain.event :as event]
            [eta-mu.fork-tax.domain.handoff :as handoff]
            [eta-mu.fork-tax.extern.git :as git]
            [eta-mu.fork-tax.extern.runtime :as runtime]
            [eta-mu.fork-tax.generated.registry :as registry]))

(def ^:private local-git-timeout-ms 30000)
(def ^:private network-git-timeout-ms 120000)

(defn- exit! [code]
  (runtime/exit! code))

(defn- ^:async git-value
  ([cwd args label]
   (await (git-value cwd args label {})))
  ([cwd args label options]
   (let [{:keys [exit stdout stderr]} (await (git/exec-at cwd args options))]
     (if (zero? exit)
       stdout
       (throw (js/Error. (str label " failed: " stderr)))))))

(defn- ^:async collect-state []
  (let [cwd (runtime/current-directory)
        root-result (await (git/exec-at cwd ["rev-parse" "--show-toplevel"]))]
    (when-not (zero? (:exit root-result))
      (throw (js/Error. "Not inside a git repository.")))
    (let [repo-root (:stdout root-result)
          branch (await (git-value repo-root ["rev-parse" "--abbrev-ref" "HEAD"]
                                   "git branch"))
          sha (await (git-value repo-root ["rev-parse" "HEAD"] "git rev-parse"))
          status (await
                  (git-value repo-root
                             ["status" "--porcelain=v1" "-z"]
                             "git status"
                             {:preserve-stdout? true}))]
      {:repo-root repo-root
       :branch branch
       :sha sha
       :entries (handoff/parse-porcelain-z status)})))

(defn- print-plan
  [{:keys [repo-root branch sha tag-name owned concurrent blocked]}]
  (println (str "repo: " repo-root))
  (println (str "branch: " branch))
  (println (str "sha: " sha))
  (println (str "tag: " tag-name))
  (println (str "owned paths: " (count owned)))
  (doseq [entry owned] (println (str "  + " (:path entry))))
  (println (str "concurrent paths: " (count concurrent)))
  (doseq [entry concurrent] (println (str "  ~ " (:path entry))))
  (println (str "blocked paths: " (count blocked)))
  (doseq [entry blocked] (println (str "  # " (:path entry)))))

(defn- schemas! []
  (println
   (pr-str {:package/name registry/package-name
            :package/version registry/package-version
            :schemas registry/schema-documents
            :current registry/current-versions}))
  (exit! 0))

(defn- ^:async perform-git-write! [cwd args label timeout-ms]
  (let [{:keys [exit stderr]}
        (await (git/exec-at cwd args {:timeout-ms timeout-ms
                                     :kill-signal "SIGKILL"}))]
    (when-not (zero? exit)
      (throw (js/Error. (str label " failed: " stderr))))))

(defn ^:async pay!
  [{:keys [args flags component-manifest]}]
  (let [yes? (contains? flags "yes")
        dry-run? (contains? flags "dry-run")
        all? (contains? flags "all")
        positional (take-while #(not (str/starts-with? % "--")) args)
        owned-paths (cond
                      (seq positional) (mapv runtime/resolve-path positional)
                      all? nil
                      :else [])
        {:keys [repo-root branch sha entries]} (await (collect-state))
        entries (mapv #(update % :path
                               (fn [value]
                                 (runtime/resolve-path repo-root value)))
                      entries)
        {:keys [owned concurrent blocked]}
        (handoff/partition-status entries (if (nil? owned-paths)
                                            [repo-root]
                                            owned-paths))
        timestamp (handoff/now-iso)
        tag-name (handoff/make-tag-name timestamp)
        plan {:repo-root repo-root
              :branch branch
              :sha sha
              :tag-name tag-name
              :timestamp timestamp
              :owned owned
              :concurrent concurrent
              :blocked blocked}]
    (println "Π Fork Tax Plan")
    (println "===============")
    (print-plan plan)
    (cond
      dry-run?
      (do (println "\n--dry-run: no changes made.") (exit! 0))

      (not (or yes? all? (seq positional)))
      (do
        (println "\nNo owned paths specified.")
        (println "Pass explicit paths, --all, or --dry-run to preview.")
        (exit! 0))

      (not yes?)
      (do
        (println "\nPass --yes to commit, tag, and push.")
        (println "Pass --dry-run to preview without side effects.")
        (exit! 0))

      (empty? owned)
      (do (println "\nNo owned paths to stage. Aborting.") (exit! 1))

      :else
      (let [eta-dir (runtime/join-path repo-root ".ημ")
            event-record (event/build-event
                          {:event-id (random-uuid)
                           :recorded-at (js/Date. timestamp)
                           :component-manifest component-manifest
                           :command "eta-mu fork-tax"
                           :producer {}
                           :subject {:repository/path repo-root}}
                          (handoff/event-payload plan))
            artifact-paths (handoff/build-manifest)
            paths-to-stage (concat artifact-paths (map :path owned))]
        (runtime/make-directories! eta-dir)
        (runtime/write-text! (runtime/join-path eta-dir "Π_STATE.sexp")
                             (handoff/build-state-sexp plan))
        (runtime/write-text! (runtime/join-path eta-dir "Π_LAST.md")
                             (handoff/build-last-md plan))
        (runtime/write-text! (runtime/join-path eta-dir "Π_EVENT.edn")
                             (str (pr-str event-record) "\n"))
        (await (perform-git-write! repo-root
                                   (into ["add" "--"] paths-to-stage)
                                   "git add"
                                   local-git-timeout-ms))
        (await (perform-git-write! repo-root
                                   ["commit" "-m" (handoff/commit-message tag-name)]
                                   "git commit"
                                   local-git-timeout-ms))
        (await (perform-git-write! repo-root
                                   ["tag" "-a" tag-name "-m"
                                    (str "Π handoff " tag-name)]
                                   "git tag"
                                   local-git-timeout-ms))
        (await (perform-git-write! repo-root
                                   ["push"]
                                   "git push"
                                   network-git-timeout-ms))
        (await (perform-git-write! repo-root ["push" "origin" tag-name]
                                   "git push tag"
                                   network-git-timeout-ms))
        (println (str "\nΠ paid: " tag-name))
        (exit! 0)))))

(defn ^:async handle
  [{:keys [args] :as context}]
  (if (= "schemas" (first args))
    (schemas!)
    (await (pay! context))))
