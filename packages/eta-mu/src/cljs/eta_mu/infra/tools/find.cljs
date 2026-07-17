(ns eta-mu.infra.tools.find
  "The `find` agent tool: glob-pattern file search."
  (:require [clojure.string :as str]
            [eta-mu.domain.tools.find :as domain.find]
            [eta-mu.domain.tools.glob :as glob]
            [eta-mu.domain.tools.truncate :as truncate]
            [eta-mu.extern.fs :as fs]
            [eta-mu.extern.path :as path]
            [eta-mu.extern.process :as process]
            [eta-mu.law.tools :as law]))

(def default-limit 1000)
(def default-ignored-dir-names #{"node_modules" ".git"})

(defn- gitignore-patterns [search-path]
  (let [gitignore-path (path/join search-path ".gitignore")]
    (if (fs/file-exists? gitignore-path)
      (glob/parse-gitignore (fs/read-file gitignore-path))
      [])))

(defn- ^:async execute [_id args _signal _on-update]
  (let [pattern (:pattern args)]
    (when-not (string? pattern)
      (throw (js/Error. "find: pattern is required")))
    (let [search-path (path/resolve-path (process/cwd) (or (:path args) "."))
          limit (or (:limit args) default-limit)]
      (when-not (fs/file-exists? search-path)
        (throw (js/Error. (str "Path not found: " search-path))))
      (let [entries (fs/walk search-path default-ignored-dir-names)
            ignore-patterns (gitignore-patterns search-path)
            {:keys [matches limit-reached?]} (domain.find/select-matches entries pattern ignore-patterns limit)]
        (if (empty? matches)
          {:content [{:type :text :text "No files found matching pattern"}]
           :details {}}
          (let [trunc (truncate/truncate-head (str/join "\n" matches)
                                              {:max-lines js/Number.MAX_SAFE_INTEGER})
                notices (cond-> []
                          limit-reached? (conj (str limit " results limit reached. Use limit="
                                                    (* 2 limit) " for more, or refine pattern"))
                          (:truncated trunc) (conj (str (truncate/format-size truncate/default-max-bytes) " limit reached")))
                text (cond-> (:content trunc)
                       (seq notices) (str "\n\n[" (str/join ". " notices) "]"))]
            {:content [{:type :text :text text}]
             :details {:result-limit-reached (when limit-reached? limit)
                       :truncated (:truncated trunc)}}))))))

(def tool
  {:name "find"
   :label "find"
   :description (str "Search for files by glob pattern. Returns matching file paths relative to the search "
                     "directory. Respects .gitignore. Output is truncated to " default-limit " results or "
                     (truncate/format-size truncate/default-max-bytes) " (whichever is hit first).")
   :parameters law/find-parameters
   :execute execute})
