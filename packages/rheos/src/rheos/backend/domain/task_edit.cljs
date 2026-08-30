(ns rheos.backend.domain.task-edit
  "What the non-status edits turn a task file into: a frontmatter update and a
   comment append, each as new file content plus the ledger events it implies.

   [[rheos.backend.infra.task-edit]] reads the file, writes the result back, and
   emits those events. Like [[rheos.backend.domain.transition/decide-move]], the
   decision is here and the write path is one namespace up."
  (:require [rheos.backend.law.frontmatter :as frontmatter-law]
            [rheos.backend.shape.content-parser :as content-parser]))

(defn plan-frontmatter-update
  "Apply `updates` (a map of key -> value) to `raw`'s YAML frontmatter and stamp
   `write-id` on it.

   Returns `{:raw <new content> :frontmatter <resulting frontmatter> :changes
   [{:key … :old-value … :new-value …}]}` — one change per updated key, in the
   order `updates` iterates, so the caller emits events in that same order."
  [raw updates write-id]
  (when-let [errors (seq (frontmatter-law/planning-value-errors
                          (into {} (map (fn [[k v]] [(keyword (name k)) v]) updates))))]
    (throw (ex-info (frontmatter-law/planning-value-errors-message errors)
                    {:kind :usage :errors errors})))
  (let [old-frontmatter (:frontmatter (content-parser/parse-task-content raw))
        new-raw (-> raw
                    (content-parser/update-frontmatter-keys updates)
                    (content-parser/inject-write-id write-id))]
    {:raw new-raw
     :frontmatter (:frontmatter (content-parser/parse-task-content new-raw))
     :changes (mapv (fn [[k v]]
                      (let [key-str (if (keyword? k) (name k) (str k))]
                        {:key key-str
                         :old-value (get old-frontmatter (keyword key-str))
                         :new-value v}))
                    updates)}))

(defn plan-comment
  "`raw` with `text` appended as a comment block and `write-id` stamped on the
   frontmatter."
  [raw text write-id]
  (-> raw
      (content-parser/append-comment text)
      (content-parser/inject-write-id write-id)))
