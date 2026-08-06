(ns rheos.backend.domain.transition
  "The FSM verdict behind a status change: does the edge exist, and does the WIP
   limit hold?

   [[rheos.backend.infra.transition/move-task!]] is the single write path that
   acts on this verdict — both the HTTP server and the CLI route status moves
   through it, so no transition can bypass the FSM and every successful move is
   recorded in the event ledger. This is what makes the board self-enforcing
   rather than vibes."
  (:require [rheos.backend.law.fsm :as fsm]))

(defn current-counts
  "Map of status -> number of tasks currently in it (for WIP-limit checks)."
  [all-tasks]
  (reduce (fn [m t] (update m (:status t) (fnil inc 0))) {} all-tasks))

(defn decide-move
  "Structural verdict for `from` -> `to` under the project's FSM, with WIP limits
   measured against `all-tasks`.

   A truthy `:allowed?` means the edge exists and the limit holds; any command
   gate the decision names is still the caller's to run."
  [project from to all-tasks]
  (fsm/evaluate-transition (fsm/resolve-fsm {:fsm (:fsm project)})
                           from to (current-counts all-tasks)))
