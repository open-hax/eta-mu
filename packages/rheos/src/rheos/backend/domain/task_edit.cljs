(ns rheos.backend.domain.task-edit
  "Ledger-backed edits to task frontmatter and comments.

   These are the non-status write paths: frontmatter updates and comment
   appends. Like [[rheos.backend.domain.transition/move-task!]], every successful
   mutation is recorded in the project's event ledger.

   Callers (HTTP handlers and CLI commands) supply the resolved project and task;
   this namespace owns the file write + event emission chokepoint."
  (:require ["node:fs/promises" :as fsp]
            [rheos.backend.shape.content-parser :as content-parser]
            [rheos.backend.domain.events :as events]
            [rheos.backend.infra.ledger :as ledger]
            [rheos.backend.infra.watcher :as watcher]))

(defn ^:async update-frontmatter!
  "Apply `updates` (a map of key -> value) to a task's YAML frontmatter, write the
   file back, and emit one ledger event per changed key. Returns a result map with
   `:ok true`, the updated task, and the new frontmatter map."
  [{:keys [project task updates source]}]
  (let [task-path (:source-path task)
        raw (await (.readFile fsp task-path "utf8"))
        parsed (content-parser/parse-task-content raw)
        old-frontmatter (:frontmatter parsed)
        write-id (events/generate-write-id)
        new-raw (-> raw
                  (content-parser/update-frontmatter-keys updates)
                  (content-parser/inject-write-id write-id))
        new-parsed (content-parser/parse-task-content new-raw)
        ledger (ledger/get-ledger (:tasks-dir project))
        src (or source "cli")]
    (watcher/register-cli-event! write-id (:uuid task))
    (await (.writeFile fsp task-path new-raw "utf8"))
    (loop [entries (seq updates)]
      (when entries
        (let [[k v] (first entries)
              key-str (if (keyword? k) (name k) (str k))
              old-value (get old-frontmatter (keyword key-str))]
          (await (events/emit-frontmatter-change! ledger (:id project) (:uuid task)
                                                  key-str old-value v write-id src))
          (recur (next entries)))))
    {:ok true :task task :frontmatter (:frontmatter new-parsed)}))

(defn ^:async append-comment!
  "Append `text` to a task file as a comment block and emit a comment event."
  [{:keys [project task text source]}]
  (let [task-path (:source-path task)
        raw (await (.readFile fsp task-path "utf8"))
        write-id (events/generate-write-id)
        new-raw (-> raw
                    (content-parser/append-comment text)
                    (content-parser/inject-write-id write-id))
        ledger (ledger/get-ledger (:tasks-dir project))]
    (watcher/register-cli-event! write-id (:uuid task))
    (await (.writeFile fsp task-path new-raw "utf8"))
    (await (events/emit-comment! ledger (:id project) (:uuid task) text write-id (or source "cli")))
    {:ok true :task task :text text}))
