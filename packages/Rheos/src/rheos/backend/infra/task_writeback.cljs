(ns rheos.backend.infra.task-writeback
  "Writing task changes back to markdown files."
  (:require ["node:fs/promises" :as fsp]
            [clojure.string :as str]
            [rheos.backend.shape.content-parser :as content-parser]))

(defn- update-frontmatter-status [raw new-status]
  (let [lines (str/split raw #"\n")]
    (str/join "\n" (mapv (fn [line]
                           (if (re-matches #"^\s*status\s*:.*" line)
                             (str "status: \"" new-status "\"")
                             line))
                         lines))))

(defn ^:async write-task-status [task _tasks-dir new-status write-id]
  (let [file-path (:source-path task)
        raw (await (.readFile fsp file-path "utf8"))
        updated-raw (-> raw
                        (update-frontmatter-status new-status)
                        (content-parser/inject-write-id write-id))]
    (await (.writeFile fsp file-path updated-raw "utf8"))
    (assoc task :status new-status)))
