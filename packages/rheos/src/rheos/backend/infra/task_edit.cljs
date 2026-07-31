(ns rheos.backend.infra.task-edit
  "Ledger-backed edits to task frontmatter and comments — the write path for the
   decisions in [[rheos.backend.domain.task-edit]].

   These are the non-status writes. Like
   [[rheos.backend.infra.transition/move-task!]], every successful mutation is
   recorded in the project's event ledger.

   Callers (HTTP handlers and CLI commands) supply the resolved project and task;
   this namespace owns the file write + event emission chokepoint."
  (:require ["node:fs/promises" :as fsp]
            [rheos.backend.domain.events :as events]
            [rheos.backend.domain.task-edit :as task-edit]
            [rheos.backend.infra.ledger :as ledger]
            [rheos.backend.infra.watcher :as watcher]))

(defn ^:async update-frontmatter!
  "Apply `updates` (a map of key -> value) to a task's YAML frontmatter, write the
   file back, and emit one ledger event per changed key. Returns a result map with
   `:ok true`, the updated task, and the new frontmatter map."
  [{:keys [project task updates source]}]
  (let [task-path (:source-path task)
        raw (await (.readFile fsp task-path "utf8"))
        write-id (events/generate-write-id)
        plan (task-edit/plan-frontmatter-update raw updates write-id)
        ledger (ledger/get-ledger (:tasks-dir project))
        src (or source "cli")]
    (watcher/register-cli-event! write-id (:uuid task))
    (await (.writeFile fsp task-path (:raw plan) "utf8"))
    (loop [changes (seq (:changes plan))]
      (when changes
        (let [{:keys [key old-value new-value]} (first changes)]
          (await (events/emit-frontmatter-change! ledger (:id project) (:uuid task)
                                                  key old-value new-value write-id src))
          (recur (next changes)))))
    {:ok true :task task :frontmatter (:frontmatter plan)}))

(defn ^:async append-comment!
  "Append `text` to a task file as a comment block and emit a comment event."
  [{:keys [project task text source]}]
  (let [task-path (:source-path task)
        raw (await (.readFile fsp task-path "utf8"))
        write-id (events/generate-write-id)
        new-raw (task-edit/plan-comment raw text write-id)
        ledger (ledger/get-ledger (:tasks-dir project))]
    (watcher/register-cli-event! write-id (:uuid task))
    (await (.writeFile fsp task-path new-raw "utf8"))
    (await (events/emit-comment! ledger (:id project) (:uuid task) text write-id (or source "cli")))
    {:ok true :task task :text text}))
