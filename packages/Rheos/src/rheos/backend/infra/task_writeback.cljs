(ns rheos.backend.infra.task-writeback
  "Writing task changes back to markdown files."
  (:require ["node:fs/promises" :as fsp]
            [clojure.string :as str]))

(defn- update-frontmatter-status [raw new-status]
  (let [lines (str/split raw #"\n")]
    (str/join "\n" (mapv (fn [line]
                           (if (re-matches #"^\s*status\s*:.*" line)
                             (str "status: \"" new-status "\"")
                             line))
                         lines))))

(defn ^:async write-task-status [task _tasks-dir new-status]
  (let [file-path (:source-path task)
        raw (await (.readFile fsp file-path "utf8"))
        updated-raw (update-frontmatter-status raw new-status)]
    (await (.writeFile fsp file-path updated-raw "utf8"))
    (assoc task :status new-status)))
