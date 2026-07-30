(ns eta-mu.infra.cli.commands.git
  "Git workflow command group.")

(defn group
  "Return the git command group map."
  [{:keys [fork-tax receipt session]}]
  {:name "git"
   :description "Git workflow helpers"
   :subcommands {"fork-tax" {:name "fork-tax"
                            :description "Persist working state into git (commit + tag + push)"
                            :handler fork-tax}
                 "receipt"  {:name "receipt"
                            :description "Receipt River operations"
                            :handler receipt}
                 "session"  {:name "session"
                            :description "Session mycology operations"
                            :handler session}}})
