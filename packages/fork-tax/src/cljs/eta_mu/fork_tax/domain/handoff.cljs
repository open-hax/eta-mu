(ns eta-mu.fork-tax.domain.handoff
  "Pure Fork Tax decisions and artifact generation."
  (:require [clojure.string :as str]))

(defn make-tag-name [timestamp]
  (str "Π-" (-> timestamp
                 (str/replace #"\.\d{3}" "")
                 (str/replace #"[-:]" ""))))

(defn commit-message [tag-name]
  (str "Π " tag-name))

(defn parse-porcelain-z
  "Parse `git status --porcelain=v1 -z` without Git's quoted-path ambiguity.

  Rename/copy records include a second NUL-delimited source path; the handoff
  classification follows the destination while retaining the source."
  [output]
  (loop [tokens (vec (remove empty? (str/split output #"\u0000")))
         entries []]
    (if (empty? tokens)
      entries
      (let [row (first tokens)
            status (subs row 0 2)
            destination (subs row 3)
            rename? (boolean (re-find #"[RC]" status))
            source (when rename? (second tokens))]
        (recur (subvec tokens (if rename? 2 1))
               (conj entries
                     (cond-> {:status status :path destination}
                       source (assoc :source-path source))))))))

(defn- under-path? [path owned]
  (or (= path owned)
      (str/starts-with? path (str owned "/"))))

(defn partition-status
  [entries owned-paths]
  (let [blocked? #(re-matches
                   #"(?:^|.*/)(?:node_modules|\.shadow-cljs|target|dist|dist-cli|dist-dev|out|\.build)(?:/.*)?"
                   %)
        owned? #(some (partial under-path? %) owned-paths)
        grouped (group-by
                 (fn [{:keys [path]}]
                   (cond
                     (blocked? path) :blocked
                     (owned? path) :owned
                     :else :concurrent))
                 entries)]
    {:owned (get grouped :owned [])
     :concurrent (get grouped :concurrent [])
     :blocked (get grouped :blocked [])
     :all-entries entries}))

(defn event-payload
  [{:keys [repo-root branch sha tag-name owned concurrent blocked]}]
  {:repo-root repo-root
   :branch branch
   :sha sha
   :tag-name tag-name
   :owned (vec owned)
   :concurrent (vec concurrent)
   :blocked (vec blocked)})

(defn build-state-sexp
  [{:keys [repo-root branch sha tag-name owned concurrent blocked timestamp]}]
  (str "(Π-state\n"
       "  (repo \"" (str/escape repo-root {"\\" "\\\\" "\"" "\\\""}) "\")\n"
       "  (branch \"" branch "\")\n"
       "  (sha \"" sha "\")\n"
       "  (tag \"" tag-name "\")\n"
       "  (ts \"" timestamp "\")\n"
       "  (owned\n" (str/join "\n" (map #(str "    \"" (:path %) "\"") owned)) ")\n"
       "  (concurrent\n" (str/join "\n" (map #(str "    \"" (:path %) "\"") concurrent)) ")\n"
       "  (blocked\n" (str/join "\n" (map #(str "    \"" (:path %) "\"") blocked)) "))\n"))

(defn build-last-md
  [{:keys [repo-root branch sha tag-name owned concurrent blocked timestamp]}]
  (str "# Π Handoff — " tag-name "\n\n"
       "- **Repo:** `" repo-root "`\n"
       "- **Branch:** `" branch "`\n"
       "- **SHA:** `" sha "`\n"
       "- **Tag:** `" tag-name "`\n"
       "- **Timestamp:** " timestamp "\n\n"
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

(defn build-manifest []
  [".ημ/Π_STATE.sexp" ".ημ/Π_LAST.md" ".ημ/Π_EVENT.edn"])
