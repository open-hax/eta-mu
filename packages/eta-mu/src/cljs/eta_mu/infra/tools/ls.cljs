(ns eta-mu.infra.tools.ls
  "The `ls` agent tool: single-level directory listing."
  (:require [clojure.string :as str]
            [eta-mu.domain.tools.ls :as domain.ls]
            [eta-mu.domain.tools.truncate :as truncate]
            [eta-mu.extern.fs :as fs]
            [eta-mu.extern.path :as path]
            [eta-mu.extern.process :as process]
            [eta-mu.law.tools :as law]))

(def default-limit 500)

(defn- ^:async execute [_id args _signal _on-update]
  (let [abs-path (path/resolve-path (process/cwd) (or (:path args) "."))
        limit (or (:limit args) default-limit)]
    (when-not (fs/file-exists? abs-path)
      (throw (js/Error. (str "Path not found: " abs-path))))
    (when-not (fs/directory? abs-path)
      (throw (js/Error. (str "Not a directory: " abs-path))))
    (let [raw-entries (fs/list-dir abs-path)
          {:keys [entries limit-reached?]} (domain.ls/format-entries raw-entries limit)]
      (if (empty? entries)
        {:content [{:type :text :text "(empty directory)"}]
         :details {}}
        (let [trunc (truncate/truncate-head (str/join "\n" entries)
                                            {:max-lines js/Number.MAX_SAFE_INTEGER})
              notices (cond-> []
                        limit-reached? (conj (str limit " entries limit reached. Use limit="
                                                  (* 2 limit) " for more"))
                        (:truncated trunc) (conj (str (truncate/format-size truncate/default-max-bytes) " limit reached")))
              text (cond-> (:content trunc)
                     (seq notices) (str "\n\n[" (str/join ". " notices) "]"))]
          {:content [{:type :text :text text}]
           :details {:entry-limit-reached (when limit-reached? limit)
                     :truncated (:truncated trunc)}})))))

(def tool
  {:name "ls"
   :label "ls"
   :description (str "List directory contents. Returns entries sorted alphabetically, with '/' suffix "
                     "for directories. Includes dotfiles. Output is truncated to " default-limit
                     " entries or " (truncate/format-size truncate/default-max-bytes) " (whichever is hit first).")
   :parameters law/ls-parameters
   :execute execute})
