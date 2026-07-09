(ns eta-mu.infra.cli.commands.contracts
  "Contracts command group. Only the output sub-command is implemented initially."
  (:require [eta-mu.extern.child-process :as child]
            [eta-mu.extern.process :as process]))

(defn ^:async output
  "Delegate remaining arguments to the output-contract-gate binary."
  [{:keys [args]}]
  (if-let [gate-path (child/resolve-contracts-output-path)]
    (let [exit-code (await (child/spawn-inherit "node" (into [gate-path] args)))]
      (process/exit! exit-code))
    (do (js/console.error "eta-mu contracts output: @eta-mu/contracts-output is not installed or built.")
        (process/exit! 1))))
