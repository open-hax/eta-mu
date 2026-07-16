(ns eta-mu.infra.tools.grep
  "The `grep` agent tool: content search across files."
  (:require [clojure.string :as str]
            [eta-mu.domain.tools.find :as domain.find]
            [eta-mu.domain.tools.glob :as glob]
            [eta-mu.domain.tools.grep :as domain.grep]
            [eta-mu.domain.tools.truncate :as truncate]
            [eta-mu.extern.fs :as fs]
            [eta-mu.extern.path :as path]
            [eta-mu.extern.process :as process]
            [eta-mu.law.tools :as law]))

(def default-limit 100)
(def default-ignored-dir-names #{"node_modules" ".git"})

(defn- gitignore-patterns [search-path]
  (let [gitignore-path (path/join search-path ".gitignore")]
    (if (fs/file-exists? gitignore-path)
      (glob/parse-gitignore (fs/read-file gitignore-path))
      [])))

(defn- candidate-files
  "Return `[{:abs-path :rel-path} ...]` to search: every non-ignored file
  under `search-path` if it's a directory (optionally filtered by
  `glob-pattern`), or the single file itself otherwise."
  [search-path glob-pattern]
  (if (fs/directory? search-path)
    (let [entries (fs/walk search-path default-ignored-dir-names)
          ignore-patterns (gitignore-patterns search-path)
          {:keys [matches]} (domain.find/select-matches
                             entries (or glob-pattern "**") ignore-patterns js/Number.MAX_SAFE_INTEGER)]
      (mapv (fn [rel] {:abs-path (path/join search-path rel) :rel-path rel}) matches))
    [{:abs-path search-path :rel-path (path/basename search-path)}]))

(defn- ^:async search-files [files pattern opts limit]
  (loop [remaining-files files
         remaining limit
         blocks []
         match-count 0
         lines-truncated? false]
    (if (or (empty? remaining-files) (<= remaining 0))
      {:blocks blocks :match-count match-count :lines-truncated? lines-truncated?}
      (let [{:keys [abs-path rel-path]} (first remaining-files)
            content (try (await (fs/read-file-async abs-path)) (catch :default _ nil))]
        (if (nil? content)
          (recur (rest remaining-files) remaining blocks match-count lines-truncated?)
          (let [result (domain.grep/search-file rel-path content pattern (assoc opts :limit remaining))]
            (recur (rest remaining-files)
                   (- remaining (:match-count result))
                   (into blocks (:blocks result))
                   (+ match-count (:match-count result))
                   (or lines-truncated? (:lines-truncated? result)))))))))

(defn- ^:async execute [_id args _signal _on-update]
  (let [pattern (:pattern args)]
    (when-not (string? pattern)
      (throw (js/Error. "grep: pattern is required")))
    (let [search-path (path/resolve-path (process/cwd) (or (:path args) "."))
          limit (max 1 (or (:limit args) default-limit))]
      (when-not (fs/file-exists? search-path)
        (throw (js/Error. (str "Path not found: " search-path))))
      (let [files (candidate-files search-path (:glob args))
            opts {:ignore-case? (boolean (:ignoreCase args))
                  :literal? (boolean (:literal args))
                  :context (or (:context args) 0)}
            {:keys [blocks match-count lines-truncated?]} (await (search-files files pattern opts limit))]
        (if (zero? match-count)
          {:content [{:type :text :text "No matches found"}]
           :details {}}
          (let [trunc (truncate/truncate-head (str/join "\n" blocks)
                                              {:max-lines js/Number.MAX_SAFE_INTEGER})
                match-limit-reached? (>= match-count limit)
                notices (cond-> []
                          match-limit-reached? (conj (str limit " matches limit reached. Use limit="
                                                          (* 2 limit) " for more, or refine pattern"))
                          (:truncated trunc) (conj (str (truncate/format-size truncate/default-max-bytes) " limit reached"))
                          lines-truncated? (conj (str "Some lines truncated to " truncate/grep-max-line-length
                                                      " chars. Use read tool to see full lines")))
                text (cond-> (:content trunc)
                       (seq notices) (str "\n\n[" (str/join ". " notices) "]"))]
            {:content [{:type :text :text text}]
             :details {:match-limit-reached (when match-limit-reached? limit)
                       :truncated (:truncated trunc)
                       :lines-truncated? lines-truncated?}}))))))

(def tool
  {:name "grep"
   :label "grep"
   :description (str "Search file contents for a pattern. Returns matching lines with file paths and line "
                     "numbers. Respects .gitignore. Output is truncated to " default-limit " matches or "
                     (truncate/format-size truncate/default-max-bytes) " (whichever is hit first). Long lines "
                     "are truncated to " truncate/grep-max-line-length " chars.")
   :parameters law/grep-parameters
   :execute execute})
