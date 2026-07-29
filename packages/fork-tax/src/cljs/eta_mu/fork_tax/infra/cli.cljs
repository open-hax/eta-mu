(ns eta-mu.fork-tax.infra.cli
  "Fork Tax command implementation owned by @eta-mu/fork-tax."
  (:require [clojure.string :as str]
            ["node:child_process" :as cp]
            ["node:fs" :as fs]
            ["node:path" :as path]
            [eta-mu.fork-tax.domain.event :as event]
            [eta-mu.fork-tax.domain.handoff :as handoff]
            [eta-mu.fork-tax.generated.registry :as registry]))

(defn- exit! [code]
  (.exit js/process code))

(defn- exec-git [cwd args]
  (js/Promise.
   (fn [resolve _reject]
     (let [stdout (atom "")
           stderr (atom "")
           child (.spawn cp "git" (clj->js args) #js {:cwd cwd :stdio "pipe"})]
       (.on (.-stdout child) "data" #(swap! stdout str %))
       (.on (.-stderr child) "data" #(swap! stderr str %))
       (.on child "close"
            (fn [code]
              (resolve {:exit (or code 0)
                        :stdout (str/trim @stdout)
                        :stderr (str/trim @stderr)})))
       (.on child "error"
            (fn [error]
              (resolve {:exit 1 :stdout "" :stderr (.-message error)})))))))

(defn- ^:async git-value [cwd args label]
  (let [{:keys [exit stdout stderr]} (await (exec-git cwd args))]
    (if (zero? exit)
      stdout
      (throw (js/Error. (str label " failed: " stderr))))))

(defn- ^:async collect-state []
  (let [cwd (.cwd js/process)
        root-result (await (exec-git cwd ["rev-parse" "--show-toplevel"]))]
    (when-not (zero? (:exit root-result))
      (throw (js/Error. "Not inside a git repository.")))
    (let [repo-root (:stdout root-result)
          branch (await (git-value repo-root ["rev-parse" "--abbrev-ref" "HEAD"]
                                   "git branch"))
          sha (await (git-value repo-root ["rev-parse" "HEAD"] "git rev-parse"))
          status (await (git-value repo-root ["status" "--porcelain=v1" "-z"]
                                   "git status"))]
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

(defn- ^:async perform-git-write! [cwd args label]
  (let [{:keys [exit stderr]} (await (exec-git cwd args))]
    (when-not (zero? exit)
      (throw (js/Error. (str label " failed: " stderr))))))

(defn ^:async pay!
  [{:keys [args flags component-manifest]}]
  (let [yes? (contains? flags "yes")
        dry-run? (contains? flags "dry-run")
        all? (contains? flags "all")
        positional (take-while #(not (str/starts-with? % "--")) args)
        owned-paths (cond
                      (seq positional) (mapv path/resolve positional)
                      all? nil
                      :else [])
        {:keys [repo-root branch sha entries]} (await (collect-state))
        entries (mapv #(update % :path (fn [value] (path/resolve repo-root value)))
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
      (let [eta-dir (path/join repo-root ".ημ")
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
        (.mkdirSync fs eta-dir #js {:recursive true})
        (.writeFileSync fs (path/join eta-dir "Π_STATE.sexp")
                        (handoff/build-state-sexp plan) "utf8")
        (.writeFileSync fs (path/join eta-dir "Π_LAST.md")
                        (handoff/build-last-md plan) "utf8")
        (.writeFileSync fs (path/join eta-dir "Π_EVENT.edn")
                        (str (pr-str event-record) "\n") "utf8")
        (await (perform-git-write! repo-root
                                   (into ["add" "--"] paths-to-stage)
                                   "git add"))
        (await (perform-git-write! repo-root
                                   ["commit" "-m" (handoff/commit-message tag-name)]
                                   "git commit"))
        (await (perform-git-write! repo-root
                                   ["tag" "-a" tag-name "-m"
                                    (str "Π handoff " tag-name)]
                                   "git tag"))
        (await (perform-git-write! repo-root ["push"] "git push"))
        (await (perform-git-write! repo-root ["push" "origin" tag-name]
                                   "git push tag"))
        (println (str "\nΠ paid: " tag-name))
        (exit! 0)))))

(defn ^:async handle
  [{:keys [args] :as context}]
  (if (= "schemas" (first args))
    (schemas!)
    (await (pay! context))))
