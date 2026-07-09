(ns eta-mu.infra.cli.commands.doctor
  "Doctor command: report workspace health for the eta-mu router."
  (:require [clojure.string :as str]
            [eta-mu.extern.child-process :as child]
            [eta-mu.extern.git :as git]
            [eta-mu.extern.process :as process]))

(defn- status-line [ok label]
  (str (if ok "[ok]" "[missing]") " " label))

(defn ^:async handle
  [{:keys [_args]}]
  (let [legacy (boolean (child/resolve-legacy-cli-path))
        rheos (boolean (child/resolve-rheos-path))
        contracts (boolean (child/resolve-contracts-output-path))
        repo-root (await (git/root))
        branch (when repo-root (await (git/branch)))
        status-lines (when repo-root (await (git/status)))]
    (println "eta-mu doctor")
    (println "=============")
    (println (status-line legacy "@open-hax/eta-mu-cli (legacy agent delegate)"))
    (println (status-line rheos "@open-hax/rheos (kanban delegate)"))
    (println (status-line contracts "@eta-mu/contracts-output (contracts delegate)"))
    (println (str "repo: " (or repo-root "(not in a git repo)")))
    (when branch (println (str "branch: " branch)))
    (when (and status-lines (seq (str/trim status-lines)))
      (println "\nuncommitted changes:")
      (println status-lines))
    (process/exit! 0)))
