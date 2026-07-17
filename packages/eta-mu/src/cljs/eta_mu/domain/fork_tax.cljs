(ns eta-mu.domain.fork-tax
  "Pure fork-tax decisions and artifact generation.

  This namespace contains no I/O. It decides which status entries are owned vs
  concurrent and builds the in-repo handoff artifacts."
  (:require [clojure.string :as str]))

(defn now-iso
  []
  (.toISOString (js/Date.)))

(defn make-tag-name
  "Return a deterministic tag name for a timestamp."
  [ts]
  (str "Π-" (-> ts
                 (.replace (js/RegExp. "\\.\\d{3}" "g") "")
                 (.replace (js/RegExp. "[-:]" "g") ""))))

(defn commit-message
  "Return a standard Π commit message."
  [tag-name]
  (str "Π " tag-name))

(defn partition-status
  "Partition porcelain status entries into owned, concurrent, and blocked groups.

  Owned entries are those whose paths match the provided owned path set.
  Concurrent entries are dirty paths not in the owned set.
  Blocked entries are paths that look generated or runtime (node_modules, dist, target).

  Returns a map with :owned, :concurrent, :blocked, and :all-entries."
  [entries owned-paths]
  (let [blocked? #(re-matches #".*(?:node_modules|\.shadow-cljs|target|dist|dist-cli|dist-dev|out|\.build)/.*" %)
        owned? #(some (fn [owned] (str/starts-with? % owned)) owned-paths)
        grouped (group-by (fn [{:keys [path]}]
                            (cond (blocked? path) :blocked
                                  (owned? path) :owned
                                  :else :concurrent))
                          entries)]
    {:owned (get grouped :owned [])
     :concurrent (get grouped :concurrent [])
     :blocked (get grouped :blocked [])
     :all-entries entries}))

(defn build-state-sexp
  "Build a `.ημ/Π_STATE.sexp` content string."
  [{:keys [repo-root branch sha tag-name owned concurrent blocked]}]
  (str "(Π-state\n"
       "  (repo \"" (str/escape repo-root {"\\" "\\\\" "\"" "\\\""}) "\")\n"
       "  (branch \"" branch "\")\n"
       "  (sha \"" sha "\")\n"
       "  (tag \"" tag-name "\")\n"
       "  (ts \"" (now-iso) "\")\n"
       "  (owned\n" (str/join "\n" (map #(str "    \"" (:path %) "\"") owned)) ")\n"
       "  (concurrent\n" (str/join "\n" (map #(str "    \"" (:path %) "\"") concurrent)) ")\n"
       "  (blocked\n" (str/join "\n" (map #(str "    \"" (:path %) "\"") blocked)) "))\n"))

(defn build-last-md
  "Build a `.ημ/Π_LAST.md` content string."
  [{:keys [repo-root branch sha tag-name owned concurrent blocked]}]
  (str "# Π Handoff — " tag-name "\n\n"
       "- **Repo:** `" repo-root "`\n"
       "- **Branch:** `" branch "`\n"
       "- **SHA:** `" sha "`\n"
       "- **Tag:** `" tag-name "`\n"
       "- **Timestamp:** " (now-iso) "\n\n"
       "## Owned paths (staged)\n\n"
       (if (seq owned)
         (str/join "\n" (map #(str "- `" (:path %) "`") owned))
         "- none") "\n\n"
       "## Concurrent / unowned paths left untouched\n\n"
       (if (seq concurrent)
         (str/join "\n" (map #(str "- `" (:path %) "`") concurrent))
         "- none") "\n\n"
       "## Blocked / generated paths ignored\n\n"
       (if (seq blocked)
         (str/join "\n" (map #(str "- `" (:path %) "`") blocked))
         "- none") "\n"))

(defn build-manifest
  "Return a simple manifest vector of artifact paths."
  []
  [".ημ/Π_STATE.sexp" ".ημ/Π_LAST.md"])
