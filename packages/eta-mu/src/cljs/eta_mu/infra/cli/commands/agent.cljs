(ns eta-mu.infra.cli.commands.agent
  "Default agent command: delegates to the legacy @open-hax/eta-mu-cli until the
  TUI agent is rewritten in ClojureScript."
  (:require [eta-mu.extern.child-process :as child]
            [eta-mu.extern.process :as process]))

(defn ^:async handle
  "Delegate all remaining arguments to the legacy eta-mu CLI."
  [{:keys [args]}]
  (if-let [legacy-path (child/resolve-legacy-cli-path)]
    (let [exit-code (await (child/spawn-inherit "node" (into [legacy-path] args)))]
      (process/exit! exit-code))
    (do (js/console.error "eta-mu agent: legacy @open-hax/eta-mu-cli is not installed or built.")
        (process/exit! 1))))
