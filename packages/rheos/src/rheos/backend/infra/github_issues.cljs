(ns rheos.backend.infra.github-issues
  "GitHub Issues projection for Rheos canonical task objects."
  (:require [clojure.string :as str]
            ["node:path" :as path]
            [rheos.backend.domain.github-label-projection :as label-projection]))

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

(defn desired-labels [task]
  (label-projection/desired-labels task))

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
        task-labels (label-projection/canonical-task-labels task)
        labels (if (seq task-labels)
                 (str/join ", " (map #(str "`" % "`") task-labels))
                 "none")
        header (str "<!-- openhax-kanban-sync uuid=\"" (:uuid task) "\" -->\n"
                    (label-projection/ownership-marker task) "\n"
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
                         (mapv #(assoc (label-state %)
                                       :type :create-label
                                       :write-count 1))))]
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
                     (conj operations {:type :create-issue
                                       :task task
                                       :title title
                                       :body body
                                       :labels labels
                                       :write-count 1})
                     skipped-closed)

              :else
              (let [state (effective-state task issue desired)
                    state-changed? (or (not= (:state state) (:state issue))
                                       (and (:state-reason state)
                                            (not= (:state-reason state) (:state-reason issue))))
                    patch (cond-> {}
                            (not= title (:title issue)) (assoc :title title)
                            (not= body (or (:body issue) "")) (assoc :body body)
                            state-changed? (assoc :state (:state state))
                            (and state-changed? (:state-reason state))
                            (assoc :state-reason (:state-reason state)))
                    label-delta (label-projection/plan-delta task issue)
                    add-labels (:add label-delta)
                    remove-labels (:remove label-delta)
                    write-count (+ (if (seq add-labels) 1 0)
                                   (count remove-labels)
                                   (if (seq patch) 1 0))]
                (if (pos? write-count)
                  (recur (rest remaining)
                          (conj operations {:type :update-issue
                                            :issue-number (:number issue)
                                            :task task
                                            :title title
                                            :state (:state state)
                                            :state-reason (:state-reason state)
                                            :patch patch
                                            :add-labels add-labels
                                            :remove-labels remove-labels
                                            :write-count write-count})
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
   :state-reason (:state_reason issue)
   :labels (mapv :name (:labels issue))})

(defn ^:async load-repo-state! [token repo]
  (let [labels (await (paginate! token (api-url repo "/labels?per_page=100")))
        raw-issues (await (paginate! token (api-url repo "/issues?state=all&per_page=100")))
        issues (->> raw-issues (remove :pull_request) (mapv normalize-issue))]
    {:labels labels :issues issues}))

(defn operation-requests
  "Materialize the bounded GitHub requests for one logical sync operation."
  [repo operation]
  (case (:type operation)
    :create-label
    [{:method "POST"
      :url (api-url repo "/labels")
      :body (select-keys operation [:name :color :description])}]

    :create-issue
    [{:method "POST"
      :url (api-url repo "/issues")
      :body (select-keys operation [:title :body :labels])}]

    :update-issue
    (let [issue-url (api-url repo (str "/issues/" (:issue-number operation)))
          patch (:patch operation)
          patch-body (cond-> (dissoc patch :state-reason)
                       (:state-reason patch) (assoc :state_reason (:state-reason patch)))]
      (vec
       (concat
        (when (seq (:add-labels operation))
          [{:method "POST"
            :url (str issue-url "/labels")
            :body {:labels (:add-labels operation)}}])
        (map (fn [label]
               {:method "DELETE"
                :url (str issue-url "/labels/" (js/encodeURIComponent label))
                :body nil})
             (:remove-labels operation))
        (when (seq patch-body)
          [{:method "PATCH" :url issue-url :body patch-body}]))))

    []))

(defn select-operations-within-write-budget
  "Select complete logical operations without slicing one at the write limit.

   Refuse the entire selection when one operation cannot fit the configured
   budget. Returning an empty selection in that case would report a successful
   sync while deferring the same operation forever; selecting it would silently
   exceed the operator's safety limit."
  [operations max-writes]
  (let [limit (max 0 (or max-writes 50))]
    (when-let [operation (first (filter #(> (or (:write-count %) 1) limit)
                                        operations))]
      (let [required (or (:write-count operation) 1)
            subject (case (:type operation)
                      :update-issue (str "issue #" (:issue-number operation))
                      :create-issue (str "issue \"" (:title operation) "\"")
                      :create-label (str "label \"" (:name operation) "\"")
                      (name (or (:type operation) :unknown-operation)))]
        (throw (js/Error.
                (str "GitHub sync write budget is too small: " subject
                     " requires " required " API writes, but --max-writes is " limit
                     ". Increase --max-writes to at least " required
                     "; refusing the sync before applying any writes.")))))
    (loop [remaining (vec operations)
           selected []
           selected-writes 0]
      (if-let [operation (first remaining)]
        (let [write-count (or (:write-count operation) 1)]
          (if (<= (+ selected-writes write-count) limit)
            (recur (subvec remaining 1)
                   (conj selected operation)
                   (+ selected-writes write-count))
            {:selected selected
             :deferred remaining
             :selected-writes selected-writes
             :deferred-writes (reduce + 0 (map #(or (:write-count %) 1) remaining))}))
        {:selected selected
         :deferred []
         :selected-writes selected-writes
         :deferred-writes 0}))))

(defn- ^:async apply-operation! [token repo operation write-delay-ms]
  (loop [remaining (operation-requests repo operation)]
    (when-let [request (first remaining)]
      (await (fetch-json! token (:url request) (:method request) (:body request)))
      (when (and (seq (rest remaining)) (pos? (or write-delay-ms 0)))
        (await (sleep! write-delay-ms)))
      (recur (rest remaining)))))

(defn ^:async sync! [tasks {:keys [token repo dry-run write-delay-ms max-writes] :as options}]
  (when (str/blank? token) (throw (js/Error. "Missing GITHUB_TOKEN or GH_TOKEN.")))
  (when (str/blank? repo) (throw (js/Error. "Missing GitHub repo target.")))
  (let [repo-state (await (load-repo-state! token repo))
        base-plan (plan-sync tasks repo-state options)
        operations (:operations base-plan)
        planned-writes (reduce + 0 (map #(or (:write-count %) 1) operations))
        plan (assoc base-plan :planned-writes planned-writes)]
    (if dry-run
      (assoc plan
             :applied-operations []
             :applied-writes 0
             :deferred-operations 0
             :deferred-writes 0)
      (let [{:keys [selected deferred selected-writes deferred-writes]}
            (select-operations-within-write-budget operations max-writes)]
        (loop [remaining selected applied []]
          (if-let [operation (first remaining)]
            (do
              (await (apply-operation! token repo operation write-delay-ms))
              (when (and (seq (rest remaining)) (pos? (or write-delay-ms 0)))
                (await (sleep! write-delay-ms)))
              (recur (rest remaining) (conj applied operation)))
            (assoc plan
                   :applied-operations applied
                   :applied-writes selected-writes
                   :deferred-operations (count deferred)
                   :deferred-writes deferred-writes)))))))
