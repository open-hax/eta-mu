(ns rheos.backend.infra.transition
  "The single, FSM-enforced, ledger-backed write path for status changes — the
   effects behind [[rheos.backend.domain.transition/decide-move]].

   Both the HTTP server and the CLI route status moves through [[move-task!]] so
   that no transition can bypass the FSM and every successful move is recorded in
   the event ledger."
  (:require [rheos.backend.domain.events :as events]
            [rheos.backend.domain.transition :as transition]
            [rheos.backend.infra.ledger :as ledger]
            [rheos.backend.infra.task-store :as tasks]
            [rheos.backend.infra.task-writeback :as writeback]
            [rheos.backend.infra.watcher :as watcher]
            [rheos.backend.law.fsm :as fsm]))

(defn ^:async move-task!
  "Validate `(:status task)` -> `new-status` against the project's FSM. On success,
   write the new status to the markdown file and append a status-change event to the
   ledger; on failure, change nothing.

   Returns {:ok true  :task <updated> :from f :to t}
        or {:ok false :reason <fsm reason> :from f :to t}."
  [{:keys [project task new-status source]}]
  (let [from (:status task)]
    (if (= from new-status)
      {:ok true :task task :from from :to new-status :noop true}
      (let [all-tasks (await (tasks/load-tasks (:tasks-dir project)))
            decision (transition/decide-move project from new-status all-tasks)]
        (if-not (:allowed? decision)
          {:ok false :reason (:reason decision) :from from :to new-status}
          ;; Structurally valid: now run any command gate (build/lint/test) before
          ;; committing the move. A failing gate rejects the transition and writes nothing.
          (let [gate (await (fsm/run-gate decision (or (:gate-cwd project) (js/process.cwd))))]
            (if-not (:allowed? gate)
              {:ok false :reason (:reason gate) :from from :to new-status}
              (let [write-id (events/generate-write-id)
                    ledger (ledger/get-ledger (:tasks-dir project))]
                (watcher/register-cli-event! write-id (:uuid task))
                (let [updated (await (writeback/write-task-status task (:tasks-dir project) new-status write-id))]
                  (await (events/emit-status-change! ledger (:id project) (:uuid task)
                                                     from new-status write-id (or source "cli")))
                  {:ok true :task updated :from from :to new-status})))))))))
