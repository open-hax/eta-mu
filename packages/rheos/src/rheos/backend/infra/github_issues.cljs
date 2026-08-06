(ns rheos.backend.infra.github-issues
  "GitHub Issues projection for Rheos canonical task objects."
  (:require [clojure.string :as str]
            ["node:path" :as path]))

(def ^:private marker-pattern #"<!--\s*openhax-kanban-sync\s+uuid=\"([^\"]+)\"\s*-->")
(def ^:private legacy-marker-pattern #"(?im)^Kanban UUID:\s*(.+)$")
(def ^:private status-pattern #"(?im)^- Status:\s*`([^`]+)`\s*$")
(def ^:private closed-statuses #{"done" "rejected"})
(def ^:private metadata-files #{"README" "README.MD" "AGENTS.MD" "CHANGELOG" "CHANGELOG.MD" "CROSS_REFERENCES.MD"})
(def ^:private projection-segments #{"tasks" "epics" "cards" "stories" "chores"})
(def ^:private default-colors
  {"kanban" "5319e7"
   "priority:P0" "000000"
   "priority:P1" "d93f0b"
   "priority:P2" "fbca04"
   "priority:P3" "0e8a16"})

(defn- sleep! [ms]
  (js/Promise. (fn [resolve _] (js/setTimeout resolve ms))))

(defn- normalize-label [label]
  (let [normalized (-> label
                       str/trim
                       (str/replace #"\s+" "-")
                       (str/replace #"[^A-Za-z0-9_.:/-]+" "-")
                       (str/replace #"^-+|-+$" ""))]
    (subs normalized 0 (min 50 (count normalized)))))

(defn desired-labels [task]
  (->> (concat ["kanban" (str "status:" (:status task))]
               (when (seq (:priority task)) [(str "priority:" (:priority task))])
               (:labels task))
       (map normalize-label)
       (filter seq)
       distinct
       vec))

(defn- label-state [name]
  {:name name
   :color (or (get default-colors name)
              (when (str/starts-with? name "status:") "cfd3d7")
              "ededed")
   :description (when (= name "kanban") "Synced from Rheos canonical task objects.")})

(defn extract-task-uuid [issue]
  (let [body (or (:body issue) "")]
    (or (second (re-find marker-pattern body))
        (some-> (second (re-find legacy-marker-pattern body)) str/trim))))

(defn extract-task-status [issue]
  (some-> (second (re-find status-pattern (or (:body issue) ""))) str/trim str/lower-case))

(defn- normalized-source-path [task]
  (str/replace (:source-path task) #"\\" "/"))

(defn eligible-task? [task]
  (let [source (normalized-source-path task)
        segments (vec (map str/lower-case (filter seq (str/split source #"/"))))
        basename (str/upper-case (or (last (str/split source #"/")) source))
        projected? (some projection-segments segments)]
    (cond
      (contains? metadata-files basename) false
      (some #{".ημ"} segments) false
      (and (not projected?) (some #{"docs" "notes"} segments)) false
      (and (not projected?) (re-matches #"\d{4}-\d{2}-\d{2}(?:[-_].*)?\.MD" basename)) false
      :else true)))

(defn- relative-source [task cwd]
  (let [relative (path/relative cwd (:source-path task))]
    (if (str/starts-with? relative "..") (:source-path task) relative)))

(defn build-issue-body [task cwd]
  (let [source (relative-source task cwd)
        labels (if (seq (:labels task))
                 (str/join ", " (map #(str "`" % "`") (:labels task)))
                 "none")
        header (str "<!-- openhax-kanban-sync uuid=\"" (:uuid task) "\" -->\n"
                    "<!-- This section is managed by eta-mu Rheos GitHub sync. -->\n\n"
                    "## Kanban metadata\n\n"
                    "- UUID: `" (:uuid task) "`\n"
                    "- Status: `" (:status task) "`\n"
                    "- Priority: `" (:priority task) "`\n"
                    "- Source: `" source "`\n"
                    "- Labels: " labels "\n\n---\n\n")
        body (str header (str/trim (:content task)) "\n")]
    (if (<= (count body) 58000)
      body
      (str (subs body 0 57900) "\n\n… truncated by Rheos GitHub sync …\n"))))

(defn- desired-state [task {:keys [close-done close-rejected]}]
  (cond
    (and (= "done" (:status task)) (not= false close-done))
    {:state "closed" :state-reason "completed"}

    (and (= "rejected" (:status task)) (not= false close-rejected))
    {:state "closed" :state-reason "not_planned"}

    :else {:state "open"}))

(defn- effective-state [task issue desired]
  (if (and (= "closed" (:state issue)) (= "open" (:state desired)))
    (let [previous (extract-task-status issue)]
      (if (and (contains? closed-statuses previous)
               (not (contains? closed-statuses (:status task))))
        desired
        {:state "closed"}))
    desired))

(defn- same-labels? [left right]
  (= (sort left) (sort right)))

(defn- assert-unique-uuids! [tasks]
  (loop [remaining tasks seen {}]
    (when-let [task (first remaining)]
      (if-let [prior (get seen (:uuid task))]
        (throw (js/Error. (str "Duplicate Rheos task UUID " (:uuid task) ": "
                               (:source-path prior) " and " (:source-path task))))
        (recur (rest remaining) (assoc seen (:uuid task) task))))))

(defn plan-sync [tasks repo-state options]
  (let [eligible (filterv eligible-task? tasks)
        excluded (- (count tasks) (count eligible))
        _ (assert-unique-uuids! eligible)
        existing-labels (set (map #(str/lower-case (:name %)) (:labels repo-state)))
        issues-by-uuid (reduce (fn [acc issue]
                                (if-let [uuid (extract-task-uuid issue)]
                                  (update acc uuid (fnil conj []) issue)
                                  acc))
                              {} (:issues repo-state))
        wanted-labels (->> eligible (mapcat desired-labels) distinct vec)
        label-ops (if (= false (:manage-labels options))
                    []
                    (->> wanted-labels
                         (remove #(contains? existing-labels (str/lower-case %)))
                         (mapv #(assoc (label-state %) :type :create-label))))]
    (loop [remaining eligible
           operations label-ops
           skipped-closed 0]
      (if-let [task (first remaining)]
        (let [matches (get issues-by-uuid (:uuid task) [])]
          (when (> (count matches) 1)
            (throw (js/Error. (str "Duplicate GitHub issue UUID marker " (:uuid task)
                                   " on issues " (str/join ", " (map #(str "#" (:number %)) matches))))))
          (let [issue (first matches)
                labels (desired-labels task)
                title (:title task)
                body (build-issue-body task (or (:cwd options) (js/process.cwd)))
                desired (desired-state task options)]
            (cond
              (and (nil? issue) (= "closed" (:state desired)))
              (recur (rest remaining) operations (inc skipped-closed))

              (nil? issue)
              (recur (rest remaining)
                     (conj operations {:type :create-issue :task task :title title :body body :labels labels})
                     skipped-closed)

              :else
              (let [state (effective-state task issue desired)]
                (if (or (not= title (:title issue))
                        (not= body (or (:body issue) ""))
                        (not= (:state state) (:state issue))
                        (not (same-labels? labels (:labels issue))))
                  (recur (rest remaining)
                         (conj operations {:type :update-issue
                                           :issue-number (:number issue)
                                           :task task :title title :body body :labels labels
                                           :state (:state state)
                                           :state-reason (:state-reason state)})
                         skipped-closed)
                  (recur (rest remaining) operations skipped-closed))))))
        {:operations operations
         :excluded-tasks excluded
         :summary {:create-labels (count (filter #(= :create-label (:type %)) operations))
                   :create-issues (count (filter #(= :create-issue (:type %)) operations))
                   :update-issues (count (filter #(= :update-issue (:type %)) operations))
                   :skipped-closed-tasks skipped-closed
                   :excluded-tasks excluded}}))))

(defn- api-url [repo suffix]
  (str "https://api.github.com/repos/" repo suffix))

(defn- ^:async fetch-json! [token url method body]
  (let [response (await (js/fetch url
                                  #js {:method method
                                       :headers #js {"accept" "application/vnd.github+json"
                                                     "authorization" (str "Bearer " token)
                                                     "x-github-api-version" "2022-11-28"
                                                     "content-type" "application/json"}
                                       :body (when body (js/JSON.stringify (clj->js body)))}))]
    (when-not (.-ok response)
      (let [text (await (.text response))]
        (throw (js/Error. (str "GitHub API " (.-status response) ": " text)))))
    (if (= 204 (.-status response))
      nil
      (js->clj (await (.json response)) :keywordize-keys true))))

(defn- ^:async paginate! [token url]
  (loop [next-url url items []]
    (if-not next-url
      items
      (let [response (await (js/fetch next-url
                                      #js {:headers #js {"accept" "application/vnd.github+json"
                                                        "authorization" (str "Bearer " token)
                                                        "x-github-api-version" "2022-11-28"}}))]
        (when-not (.-ok response)
          (throw (js/Error. (str "GitHub API " (.-status response) ": " (await (.text response))))))
        (let [page (js->clj (await (.json response)) :keywordize-keys true)
              link (.get (.-headers response) "link")
              match (when link (re-find #"<([^>]+)>;\s*rel=\"next\"" link))]
          (recur (second match) (into items page)))))))

(defn- normalize-issue [issue]
  {:number (:number issue)
   :title (:title issue)
   :body (:body issue)
   :state (:state issue)
   :labels (mapv :name (:labels issue))})

(defn ^:async load-repo-state! [token repo]
  (let [labels (await (paginate! token (api-url repo "/labels?per_page=100")))
        raw-issues (await (paginate! token (api-url repo "/issues?state=all&per_page=100")))
        issues (->> raw-issues (remove :pull_request) (mapv normalize-issue))]
    {:labels labels :issues issues}))

(defn- ^:async apply-operation! [token repo operation]
  (case (:type operation)
    :create-label
    (await (fetch-json! token (api-url repo "/labels") "POST"
                        (select-keys operation [:name :color :description])))

    :create-issue
    (await (fetch-json! token (api-url repo "/issues") "POST"
                        (select-keys operation [:title :body :labels])))

    :update-issue
    (await (fetch-json! token
                        (api-url repo (str "/issues/" (:issue-number operation)))
                        "PATCH"
                        (cond-> (select-keys operation [:title :body :labels :state])
                          (:state-reason operation) (assoc :state_reason (:state-reason operation)))))

    nil))

(defn ^:async sync! [tasks {:keys [token repo dry-run write-delay-ms max-writes] :as options}]
  (when (str/blank? token) (throw (js/Error. "Missing GITHUB_TOKEN or GH_TOKEN.")))
  (when (str/blank? repo) (throw (js/Error. "Missing GitHub repo target.")))
  (let [repo-state (await (load-repo-state! token repo))
        plan (plan-sync tasks repo-state options)
        operations (:operations plan)
        limit (or max-writes 50)
        selected (vec (take limit operations))]
    (if dry-run
      (assoc plan :applied-operations [] :deferred-operations 0)
      (loop [remaining selected applied []]
        (if-let [operation (first remaining)]
          (do
            (await (apply-operation! token repo operation))
            (when (and (seq (rest remaining)) (pos? (or write-delay-ms 0)))
              (await (sleep! write-delay-ms)))
            (recur (rest remaining) (conj applied operation)))
          (assoc plan
                 :applied-operations applied
                 :deferred-operations (- (count operations) (count applied))))))))
