(ns eta-mu.infra.cli.commands.git
  "Git workflow command group."
  (:require [eta-mu.infra.cli.commands.fork-tax :as fork-tax]
            [eta-mu.infra.cli.commands.receipt :as receipt]
            [eta-mu.infra.cli.commands.session :as session]))

(defn group
  "Return the git command group map."
  []
  {:name "git"
   :description "Git workflow helpers"
   :subcommands {"fork-tax" {:name "fork-tax"
                            :description "Persist working state into git (commit + tag + push)"
                            :handler fork-tax/handle}
                 "receipt"  {:name "receipt"
                            :description "Receipt River operations"
                            :handler receipt/handle}
                 "session"  {:name "session"
                            :description "Session mycology operations"
                            :handler session/handle}}})
