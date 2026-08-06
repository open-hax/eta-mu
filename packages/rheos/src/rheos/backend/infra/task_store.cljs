(ns rheos.backend.infra.task-store
  "Task loading from markdown files with YAML frontmatter parsing."
  (:require ["node:fs/promises" :as fsp]
            ["node:path" :as path]
            [clojure.string :as str]
            [rheos.backend.shape.kanban :as shape]))

(def status-index
  (into {} (map-indexed (fn [i s] [s i]) shape/StatusOrder)))

(defn- parse-yaml-simple [yaml-str]
  (let [lines (str/split-lines yaml-str)]
    (reduce (fn [acc line]
              (cond
                (re-matches #"^(\w[\w_-]*):\s*\"(.*)\"\s*" line)
                (let [[_ k v] (re-matches #"^(\w[\w_-]*):\s*\"(.*)\"\s*" line)]
                  (assoc acc (keyword k) v))
                (re-matches #"^(\w[\w_-]*):\s*(.+)\s*" line)
                (let [[_ k v] (re-matches #"^(\w[\w_-]*):\s*(.+)\s*" line)]
                  (assoc acc (keyword k) (str/trim v)))
                (re-matches #"^(\w[\w_-]*):\s*$" line)
                (let [[_ k] (re-matches #"^(\w[\w_-]*):\s*$" line)]
                  (assoc acc (keyword k) ""))
                :else acc))
            {} lines)))

(defn- parse-frontmatter [raw]
  (let [match (re-matches #"---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)" raw)]
    (if match
      (let [yaml-str (nth match 1)
            content (nth match 2)
            parsed (parse-yaml-simple yaml-str)]
        {:frontmatter parsed :content content})
      {:frontmatter {} :content raw})))

(defn- normalize-labels [labels tags]
  (let [raw (or labels tags [])
        items (cond (string? raw) (str/split raw #",")
                    (vector? raw) raw
                    :else [])]
    (vec (distinct (filter seq (mapv str/trim items))))))

(defn- normalize-status [status]
  (case (-> (or status "incoming") str/lower-case str/trim)
    "pending" "incoming"
    "completed" "done"
    (-> (or status "incoming") str/lower-case str/trim)))

(defn- ^:async parse-task-file [file-path _tasks-dir]
  (try
    (let [raw (await (.readFile fsp file-path "utf8"))
          {:keys [frontmatter content]} (parse-frontmatter raw)
          title (or (:title frontmatter) (path/basename file-path ".md"))
          priority (-> (or (:priority frontmatter) "P3") str/upper-case str/trim)
          labels (normalize-labels (:labels frontmatter) (:tags frontmatter))
          uuid (or (:uuid frontmatter) (:slug frontmatter)
                   (-> title str/lower-case (str/replace #"[^a-z0-9]+" "-")))
          status (normalize-status (:status frontmatter))
          created-at (or (:created_at frontmatter) (:createdAt frontmatter)
                         (.toISOString (new js/Date)))]
      {:uuid uuid :title title :slug (or (:slug frontmatter) uuid)
       :status status :priority priority :labels labels
       :created-at created-at :content content :source-path file-path})
    (catch :default err
      (js/console.error "Parse error:" file-path (.-message err))
      nil)))

(defn- ^:async is-directory? [full-path]
  (try
    (let [stat (await (.stat fsp full-path))]
      (.isDirectory stat))
    (catch :default _ false)))

(defn- ^:async collect-markdown-files [dir]
  (try
    (let [names (await (.readdir fsp dir))
          files (atom [])
          dirs (atom [])]
      (loop [remaining (vec names)]
        (when (seq remaining)
          (let [name (first remaining)
                full-path (path/join dir name)]
            (if (await (is-directory? full-path))
              (swap! dirs conj full-path)
              (when (str/ends-with? name ".md")
                (swap! files conj full-path)))
            (recur (rest remaining)))))
      (if (seq @dirs)
        (let [nested (await (js/Promise.all (clj->js (mapv collect-markdown-files @dirs))))]
          (vec (concat @files (apply concat nested))))
        (vec @files)))
    (catch :default err
      (js/console.error "collect error:" dir (.-message err))
      [])))

(defn- task-sort-key [task]
  [(get status-index (:status task) 99)
   (case (:priority task) "P0" 0 "P1" 1 "P2" 2 "P3" 3 4)
   (str/lower-case (:title task))])

(defn ^:async load-tasks
  "Every task under `tasks-dir`, sorted. `tasks-dir` is a path string, not a
   project map.

   The argument is checked because getting it wrong used to be invisible:
   `readdir` throws on a map, [[collect-markdown-files]] catches everything and
   returns `[]`, and the caller reads that as \"the board has no cards\". A CLI
   verb shipped with exactly that mistake and reported `unknown task` for cards
   that existed. Fail where the mistake is, not five frames later."
  [tasks-dir]
  (when-not (and (string? tasks-dir) (seq tasks-dir))
    (throw (ex-info (str "load-tasks expects a tasks directory path, got: " (pr-str tasks-dir))
                    {:kind :usage :tasks-dir tasks-dir})))
  (let [files (await (collect-markdown-files tasks-dir))
        tasks-raw (await (js/Promise.all
                           (clj->js (mapv #(parse-task-file % tasks-dir) files))))
        tasks (filterv some? (vec tasks-raw))]
    (vec (sort-by task-sort-key tasks))))
