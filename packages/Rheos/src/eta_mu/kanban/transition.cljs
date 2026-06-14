(ns eta-mu.kanban.transition
  "The single, FSM-enforced, ledger-backed write path for status changes.

   Both the HTTP server and the CLI route status moves through [[move-task!]] so
   that no transition can bypass the FSM and every successful move is recorded in
   the event ledger. This is what makes the board self-enforcing rather than vibes."
  (:require [eta-mu.kanban.fsm :as fsm]
            [eta-mu.kanban.events :as events]
            [eta-mu.kanban.tasks :as tasks]
            [eta-mu.kanban.task-writeback :as writeback]))

(defn current-counts
  "Map of status -> number of tasks currently in it (for WIP-limit checks)."
  [all-tasks]
  (reduce (fn [m t] (update m (:status t) (fnil inc 0))) {} all-tasks))

(defn ^:async move-task!
  "Validate `(:status task)` -> `new-status` against the project's FSM. On success,
   write the new status to the markdown file and append a status-change event to the
   ledger; on failure, change nothing.

   Returns {:ok true  :task <updated> :from f :to t}
        or {:ok false :reason <fsm reason> :from f :to t}."
  [{:keys [project task new-status source]}]
  (let [from (:status task)
        fsm (fsm/resolve-fsm {:fsm (:fsm project)})]
    (if (= from new-status)
      {:ok true :task task :from from :to new-status :noop true}
      (let [all-tasks (await (tasks/load-tasks (:tasks-dir project)))
            counts (current-counts all-tasks)
            decision (fsm/evaluate-transition fsm from new-status counts)]
        (if-not (:allowed? decision)
          {:ok false :reason (:reason decision) :from from :to new-status}
          (let [write-id (events/generate-write-id)
                ledger (events/get-ledger (:tasks-dir project))
                updated (await (writeback/write-task-status task (:tasks-dir project) new-status))]
            (await (events/emit-status-change! ledger (:id project) (:uuid task)
                                               from new-status write-id (or source "cli")))
            {:ok true :task updated :from from :to new-status}))))))
