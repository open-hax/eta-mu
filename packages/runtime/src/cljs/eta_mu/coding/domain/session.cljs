(ns eta-mu.coding.domain.session
  (:require [clojure.string :as str]
            [eta-mu.coding.shape.session :as session-shape]
            [eta-mu.runtime.domain.message :as message]
            [eta-mu.runtime.extern.edn :as extern-edn]
            [eta-mu.runtime.extern.json :as extern-json]
            [eta-mu.runtime.extern.time :as extern-time]))

(def current-session-version 3)

(defn- short-id
  [id-fn]
  (let [full (id-fn)]
    (subs full 0 (min 8 (count full)))))

(defn- generate-short-id
  [id-fn ids]
  (loop [attempt 0]
    (let [id (short-id id-fn)]
      (if (contains? ids id)
        (if (< attempt 100)
          (recur (inc attempt))
          id)
        id))))

(defn- entry?
  [entry]
  (not= (:type entry) :session))

(defn- header-version
  [entries]
  (if-let [header (first (filter #(= (:type %) :session) entries))]
    (or (:version header) 1)
    1))

(defn- update-header-version
  [entries version]
  (mapv (fn [entry]
          (if (= (:type entry) :session)
            (assoc entry :version version)
            entry))
        entries))

(defn- migrate-v1-to-v2
  [entries id-fn]
  (let [ids (atom #{})
        id-fn* (fn []
                 (let [id (generate-short-id id-fn @ids)]
                   (swap! ids conj id)
                   id))
        prev-id (atom nil)
        entries-with-ids (mapv (fn [entry]
                                 (if (= (:type entry) :session)
                                   entry
                                   (let [id (id-fn*)
                                         parent-id @prev-id]
                                     (reset! prev-id id)
                                     (assoc entry
                                            :id id
                                            :parent-id parent-id))))
                               entries)]
    (mapv (fn [entry]
            (if (= (:type entry) :compaction)
              (let [idx (:first-kept-entry-index entry)]
                (if (int? idx)
                  (let [target (nth entries-with-ids idx nil)]
                    (cond-> entry
                      (and target (entry? target)) (assoc :first-kept-entry-id (:id target))
                      true (dissoc :first-kept-entry-index)))
                  entry))
              entry))
          entries-with-ids)))

(defn- migrate-v2-to-v3
  [entries]
  (mapv (fn [entry]
          (if (and (= (:type entry) :message)
                   (= (get-in entry [:message :role]) "hookMessage"))
            (assoc-in entry [:message :role] :custom)
            entry))
        entries))

(defn migrate-session-entries
  "Migrate a vector of file entries to the current session version.
   Accepts an optional id-fn for deterministic tests; defaults to random-uuid."
  ([entries]
   (migrate-session-entries entries #(str (random-uuid))))
  ([entries id-fn]
   (let [version (header-version entries)]
     (if (>= version current-session-version)
       entries
       (let [entries (if (< version 2) (migrate-v1-to-v2 entries id-fn) entries)
             entries (if (< version 3) (migrate-v2-to-v3 entries) entries)]
         (update-header-version entries current-session-version))))))

(defn parse-session-entries
  "Parse a JSONL or EDN-lines session file content into a vector of internal file entries.
   Malformed lines are skipped, matching the legacy parser behavior."
  [content]
  (let [lines (-> content str (str/split #"\n"))
        parsed (mapv (fn [line]
                       (let [line (str/trim line)]
                         (when (seq line)
                           (let [json (extern-json/parse line)]
                             (if (:ok json)
                               (session-shape/entry-from-external (:value json))
                               (let [edn (extern-edn/parse line)]
                                 (when (:ok edn)
                                   (session-shape/entry-from-external (:value edn)))))))))
                     lines)]
    (vec (keep identity parsed))))

(defn get-latest-compaction-entry
  "Return the most recent compaction entry, or nil."
  [entries]
  (->> (rseq (vec entries))
       (filter #(= (:type %) :compaction))
       first))

(defn- build-by-id
  [entries]
  (reduce (fn [acc entry]
            (assoc acc (:id entry) entry))
          {}
          entries))

(defn- collect-path
  [entries by-id leaf-id]
  (cond
    (nil? leaf-id)
    []

    :else
    (let [leaf (or (get by-id leaf-id) (last entries))]
      (if-not leaf
        []
        (loop [path []
               current leaf]
          (if-not current
            path
            (recur (cons current path)
                   (when (:parent-id current)
                     (get by-id (:parent-id current))))))))))

(defn- append-message-from-entry
  [messages entry]
  (cond
    (= (:type entry) :message)
    (conj messages (:message entry))

    (= (:type entry) :custom-message)
    (conj messages (message/create-custom-message
                    (:custom-type entry)
                    (:content entry)
                    (:display entry)
                    (:details entry)
                    (extern-time/timestamp-ms (:timestamp entry))))

    (and (= (:type entry) :branch-summary) (seq (:summary entry)))
    (conj messages (message/create-branch-summary-message
                    (:summary entry)
                    (:from-id entry)
                    (extern-time/timestamp-ms (:timestamp entry))))

    :else
    messages))

(defn build-session-context
  "Build a session context from entries, optionally starting at leaf-id.
   Returns {:messages [...] :thinking-level string :model {...}|nil}."
  ([entries]
   (build-session-context entries :last nil))
  ([entries leaf-id]
   (build-session-context entries leaf-id nil))
  ([entries leaf-id by-id]
   (let [by-id (or by-id (build-by-id entries))
         path (cond
                (nil? leaf-id) []
                (= leaf-id :last) (collect-path entries by-id (:id (last entries)))
                :else (let [leaf (or (get by-id leaf-id) (last entries))]
                         (collect-path entries by-id (:id leaf))))
         thinking-level (atom "off")
         model (atom nil)
         compaction (atom nil)]
     (doseq [entry path]
       (case (:type entry)
         :thinking-level-change (reset! thinking-level (:thinking-level entry))
         :model-change (reset! model {:provider (:provider entry)
                                      :model-id (:model-id entry)})
         :message (when (= (get-in entry [:message :role]) :assistant)
                    (reset! model {:provider (get-in entry [:message :provider])
                                   :model-id (get-in entry [:message :model])}))
         :compaction (reset! compaction entry)
         nil))
     (let [messages (if-let [comp @compaction]
                      (let [compaction-idx (count (take-while #(not= % comp) path))
                            kept (loop [found false
                                        result []
                                        i 0]
                                   (if (>= i compaction-idx)
                                     result
                                     (let [entry (nth path i)]
                                       (if (= (:id entry) (:first-kept-entry-id comp))
                                         (recur true (append-message-from-entry result entry) (inc i))
                                         (if found
                                           (recur true (append-message-from-entry result entry) (inc i))
                                           (recur false result (inc i)))))))
                            after (subvec (vec path) (inc compaction-idx))]
                        (vec (concat [(message/create-compaction-summary-message
                                       (:summary comp)
                                       (:tokens-before comp)
                                       (extern-time/timestamp-ms (:timestamp comp)))]
                                     kept
                                     (reduce append-message-from-entry [] after))))
                      (reduce append-message-from-entry [] path))]
       {:messages messages
        :thinking-level @thinking-level
        :model @model}))))

(defn find-most-recent-session
  "Return the path of the most recent valid session from a collection of
   candidates. Each candidate must be a map with :path and :mtime (epoch ms)."
  [candidates]
  (when (seq candidates)
    (->> candidates
          (filter #(number? (:mtime %)))
          (sort-by :mtime)
          last
          :path)))

(defn get-missing-session-cwd-issue
  "Return a SessionCwdIssue map when the session cwd is missing, otherwise nil.
   The caller must supply :cwd-exists? as a boolean; this function performs no I/O."
  [{:keys [session-file session-cwd fallback-cwd cwd-exists?]}]
  (when (and session-file
             (seq session-cwd)
             (not cwd-exists?))
    {:session-file session-file
     :session-cwd session-cwd
     :fallback-cwd fallback-cwd}))

(defn format-missing-session-cwd-error
  [issue]
  (let [session-file (when (:session-file issue)
                       (str "\nSession file: " (:session-file issue)))]
    (str "Stored session working directory does not exist: " (:session-cwd issue)
         session-file
         "\nCurrent working directory: " (:fallback-cwd issue))))

(defn format-missing-session-cwd-prompt
  [issue]
  (str "cwd from session file does not exist\n"
       (:session-cwd issue)
       "\n\ncontinue in current cwd\n"
       (:fallback-cwd issue)))
