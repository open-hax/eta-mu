(ns eta-mu.infra.cli.commands.fork-tax
  "Fork Tax (Π) CLI command.

  Persists the current working state into git as a deterministic handoff
  snapshot: writes `.ημ/Π_STATE.sexp` and `.ημ/Π_LAST.md`, commits the owned
  paths, creates an annotated tag, and pushes.

  Requires `--yes` to perform destructive git writes; `--dry-run` previews the
  plan."
  (:require [clojure.string :as str]
            [eta-mu.domain.fork-tax :as fork-tax]
            [eta-mu.extern.fs :as fs]
            [eta-mu.extern.git :as git]
            [eta-mu.extern.path :as path]
            [eta-mu.extern.process :as process]))

(defn- ^:async collect-state
  "Collect current git state. Throws on failure."
  []
  (let [repo-root (await (git/root))
        _ (when-not repo-root
            (throw (js/Error. "Not inside a git repository.")))
        branch (await (git/branch))
        sha (await (git/commit-sha))
        status-entries (await (git/status-porcelain))]
    {:repo-root repo-root
     :branch branch
     :sha sha
     :entries status-entries}))

(defn- print-plan
  "Print the fork-tax plan."
  [{:keys [repo-root branch sha tag-name owned concurrent blocked]}]
  (println (str "repo: " repo-root))
  (println (str "branch: " branch))
  (println (str "sha: " sha))
  (println (str "tag: " tag-name))
  (println (str "owned paths: " (count owned)))
  (doseq [e owned] (println (str "  + " (:path e))))
  (println (str "concurrent paths: " (count concurrent)))
  (doseq [e concurrent] (println (str "  ~ " (:path e))))
  (println (str "blocked paths: " (count blocked)))
  (doseq [e blocked] (println (str "  # " (:path e)))))

(defn ^:async handle
  "Pay the fork tax for the current repository."
  [{:keys [args flags]}]
  (let [yes? (contains? flags "yes")
        dry-run? (contains? flags "dry-run")
        all? (contains? flags "all")
        positional (take-while #(not (str/starts-with? % "--")) args)
        owned-paths (cond
                      (seq positional) positional
                      all? nil
                      :else [])
        {:keys [repo-root branch sha entries]} (await (collect-state))
        entries (map #(update % :path (fn [p] (path/resolve-path repo-root p))) entries)
        {:keys [owned concurrent blocked]} (if (nil? owned-paths)
                                              (fork-tax/partition-status entries [repo-root])
                                              (fork-tax/partition-status entries owned-paths))
        tag-name (fork-tax/make-tag-name (fork-tax/now-iso))
        plan {:repo-root repo-root
              :branch branch
              :sha sha
              :tag-name tag-name
              :owned owned
              :concurrent concurrent
              :blocked blocked}]
    (println "Π Fork Tax Plan")
    (println "===============")
    (print-plan plan)
    (cond
      dry-run?
      (do (println "\n--dry-run: no changes made.")
          (process/exit! 0))

      (not (or yes? all? (seq positional)))
      (do (println "\nNo owned paths specified.")
          (println "Pass explicit paths, --all, or --dry-run to preview.")
          (process/exit! 0))

      (not yes?)
      (do (println "\nPass --yes to commit, tag, and push.")
          (println "Pass --dry-run to preview without side effects.")
          (process/exit! 0))

      (empty? owned)
      (do (println "\nNo owned paths to stage. Aborting.")
          (process/exit! 1))

      :else
      (do (fs/mkdir (path/join repo-root ".ημ"))
          (fs/write-file (path/join repo-root ".ημ" "Π_STATE.sexp")
                         (fork-tax/build-state-sexp plan))
          (fs/write-file (path/join repo-root ".ημ" "Π_LAST.md")
                         (fork-tax/build-last-md plan))
          (let [paths-to-stage (concat [".ημ/Π_STATE.sexp" ".ημ/Π_LAST.md"]
                                       (map :path owned))]
            (await (git/commit (fork-tax/commit-message tag-name) paths-to-stage))
            (await (git/tag tag-name (str "Π handoff " tag-name)))
            (await (git/push [tag-name])))
          (println (str "\nΠ paid: " tag-name))
          (process/exit! 0)))))
