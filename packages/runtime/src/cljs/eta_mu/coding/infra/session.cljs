(ns eta-mu.coding.infra.session
  (:require [clojure.string :as str]
            [eta-mu.coding.domain.session :as domain]
            [eta-mu.coding.extern.fs :as fs]
            [eta-mu.coding.extern.path :as path]
            [eta-mu.runtime.extern.json :as json]
            [eta-mu.runtime.extern.time :as time]))

(def current-version domain/current-session-version)

;; ---------------------------------------------------------------------------
;; ID generation
;; ---------------------------------------------------------------------------

(defn- generate-short-id
  "Generate a unique 8-char hex ID, collision-checked against `by-id`."
  [by-id]
  (loop [attempt 0]
    (let [id (subs (str (random-uuid)) 0 8)]
      (if (or (contains? by-id id) (>= attempt 100))
        id
        (recur (inc attempt))))))

;; ---------------------------------------------------------------------------
;; Session directory encoding
;; ---------------------------------------------------------------------------

(defn default-session-dir
  "Compute the default session directory for a cwd under ~/.pi/agent/sessions/."
  ([cwd] (default-session-dir cwd (str (path/path-resolve ["~" ".pi" "agent"]))))
  ([cwd agent-dir]
   (let [safe-path (str "--" (-> cwd
                                 (str/replace #"^[/\\]" "")
                                 (str/replace #"[/\\:]" "-")) "--")]
     (path/path-join agent-dir "sessions" safe-path))))

;; ---------------------------------------------------------------------------
;; File I/O helpers
;; ---------------------------------------------------------------------------

(defn- entries->jsonl
  "Serialize a vector of entries to a JSONL string."
  [entries]
  (str (str/join "\n" (mapv json/stringify entries)) "\n"))

(defn load-entries-from-file
  "Load entries from a session file (JSONL or EDN-lines). Returns [] if missing."
  [file-path]
  (let [res (fs/read-text-file file-path)]
    (if (:ok res)
      (let [entries (domain/parse-session-entries (:content res))]
        (if (and (seq entries)
                 (= :session (:type (first entries)))
                 (string? (:id (first entries))))
          entries
          []))
      [])))

;; ---------------------------------------------------------------------------
;; Session manager record
;; ---------------------------------------------------------------------------

(defrecord SessionManager [state]
  Object
  (toString [_] (str "#<SessionManager " (:session-id @state) ">")))

;; ---------------------------------------------------------------------------
;; Index building
;; ---------------------------------------------------------------------------

(defn- build-index
  "Build by-id, labels-by-id, label-timestamps-by-id, and leaf-id from entries."
  [entries]
  (let [by-id (atom {})
        labels (atom {})
        label-ts (atom {})
        leaf (atom nil)]
    (doseq [entry entries]
      (when (not= :session (:type entry))
        (swap! by-id assoc (:id entry) entry)
        (reset! leaf (:id entry))
        (when (= :label (:type entry))
          (if (:label entry)
            (do (swap! labels assoc (:target-id entry) (:label entry))
                (swap! label-ts assoc (:target-id entry) (:timestamp entry)))
            (do (swap! labels dissoc (:target-id entry))
                (swap! label-ts dissoc (:target-id entry)))))))
    {:by-id @by-id
     :labels-by-id @labels
     :label-timestamps-by-id @label-ts
     :leaf-id @leaf}))

;; ---------------------------------------------------------------------------
;; Persistence
;; ---------------------------------------------------------------------------

(defn- persist-entry!
  "Append an entry to the session file. Defers until first assistant message."
  [session entry]
  (let [{:keys [session-file persist flushed? entries]} @(:state session)]
    (when (and persist session-file)
      (let [has-assistant (some #(and (= :message (:type %))
                                      (= :assistant (get-in % [:message :role])))
                                entries)]
        (if has-assistant
          (if flushed?
            (fs/append-text-file! session-file (str (json/stringify entry) "\n"))
            (do (fs/write-text-file! session-file (entries->jsonl entries))
                (swap! (:state session) assoc :flushed? true)))
          (swap! (:state session) assoc :flushed? false))))))

(defn- rewrite-file!
  "Rewrite the entire session file from in-memory entries."
  [session]
  (let [{:keys [session-file persist entries]} @(:state session)]
    (when (and persist session-file)
      (fs/write-text-file! session-file (entries->jsonl entries))
      (swap! (:state session) assoc :flushed? true))))

;; ---------------------------------------------------------------------------
;; Constructor helpers
;; ---------------------------------------------------------------------------

(defn- new-session-state
  "Create a fresh session state map."
  [cwd session-dir session-file persist]
  (let [id (subs (str (random-uuid)) 0 8)
        timestamp (time/now-iso)
        header {:type :session
                :version current-version
                :id id
                :timestamp timestamp
                :cwd cwd}]
    {:session-id id
     :session-file session-file
     :session-dir session-dir
     :cwd cwd
     :persist persist
     :flushed? false
     :entries [header]
     :by-id {}
     :labels-by-id {}
     :label-timestamps-by-id {}
     :leaf-id nil}))

(defn- append-entry!
  "Append an entry to the session, update index, and persist."
  [session entry]
  (swap! (:state session) update :entries conj entry)
  (swap! (:state session) assoc :leaf-id (:id entry))
  (when (= :label (:type entry))
    (if (:label entry)
      (do (swap! (:state session) assoc-in [:labels-by-id (:target-id entry)] (:label entry))
          (swap! (:state session) assoc-in [:label-timestamps-by-id (:target-id entry)] (:timestamp entry)))
      (do (swap! (:state session) update :labels-by-id dissoc (:target-id entry))
          (swap! (:state session) update :label-timestamps-by-id dissoc (:target-id entry)))))
  (swap! (:state session) assoc-in [:by-id (:id entry)] entry)
  (persist-entry! session entry)
  (:id entry))

;; ---------------------------------------------------------------------------
;; Public API — constructors
;; ---------------------------------------------------------------------------

(defn create
  "Create a new persisted session."
  ([cwd] (create cwd nil))
  ([cwd session-dir]
   (let [dir (or session-dir (default-session-dir cwd))
         _ (fs/ensure-directory! dir)
         session (->SessionManager (atom (new-session-state cwd dir nil true)))
         ts (-> (:entries @(:state session))
                first
                :timestamp
                (str/replace #"[.:]" "-"))
         id (:session-id @(:state session))
         file-path (path/path-join dir (str ts "_" id ".jsonl"))]
     (swap! (:state session) assoc :session-file file-path)
     ;; Write initial header so the file exists for listing/resumption
     (fs/write-text-file! file-path (entries->jsonl (:entries @(:state session))))
     (swap! (:state session) assoc :flushed? true)
     session)))

(defn open
  "Open an existing session file."
  ([file-path] (open file-path nil nil))
  ([file-path session-dir] (open file-path session-dir nil))
  ([file-path session-dir cwd-override]
   (let [resolved-path (path/path-resolve [file-path])
         entries (load-entries-from-file resolved-path)
         header (first (filter #(= :session (:type %)) entries))
         cwd (or cwd-override (:cwd header) (path/current-cwd))
         dir (or session-dir (path/path-dirname resolved-path))
         migrated? (> current-version (or (:version header) 1))
         entries (if migrated? (domain/migrate-session-entries entries) entries)
         idx (build-index entries)
         session (->SessionManager (atom (merge {:session-id (:id header)
                                                  :session-file resolved-path
                                                  :session-dir dir
                                                  :cwd cwd
                                                  :persist true
                                                  :flushed? true
                                                  :entries entries}
                                                 idx)))]
     (when migrated? (rewrite-file! session))
     session)))

(defn continue-recent
  "Continue the most recent session in `session-dir`, or create new."
  ([cwd] (continue-recent cwd nil))
  ([cwd session-dir]
   (let [dir (or session-dir (default-session-dir cwd))
         candidates (let [res (fs/list-directory dir)]
                      (if (:ok res)
                        (->> (:entries res)
                             (filter :file?)
                             (filter #(str/ends-with? (:name %) ".jsonl"))
                              (mapv (fn [e]
                                      {:path (:absolute-path e)
                                       :mtime (or (:mtime e) 0)}))
                             (filter :path))
                        []))
         most-recent (domain/find-most-recent-session candidates)]
     (if most-recent
       (open most-recent dir)
       (create cwd dir)))))

(defn in-memory
  "Create an in-memory session (no file persistence)."
  ([] (in-memory (path/current-cwd)))
  ([cwd]
   (->SessionManager (atom (new-session-state cwd "" nil false)))))

;; ---------------------------------------------------------------------------
;; Public API — read accessors
;; ---------------------------------------------------------------------------

(defn session-id [session] (:session-id @(:state session)))
(defn session-file [session] (:session-file @(:state session)))
(defn session-dir [session] (:session-dir @(:state session)))
(defn cwd [session] (:cwd @(:state session)))
(defn persisted? [session] (:persist @(:state session)))
(defn leaf-id [session] (:leaf-id @(:state session)))

(defn header
  "Return the session header entry."
  [session]
  (first (filter #(= :session (:type %)) (:entries @(:state session)))))

(defn entries
  "Return all non-header entries."
  [session]
  (vec (filter #(not= :session (:type %)) (:entries @(:state session)))))

(defn get-entry
  "Look up an entry by id."
  [session id]
  (get-in @(:state session) [:by-id id]))

(defn get-children
  "Return direct children of `parent-id`.
   For the session header, pass nil to get entries with nil parent-id."
  [session parent-id]
  (vec (filter #(= parent-id (:parent-id %)) (entries session))))

(defn get-label
  "Return the label for an entry, or nil."
  [session id]
  (get-in @(:state session) [:labels-by-id id]))

(defn session-name
  "Return the latest session name from session-info entries."
  [session]
  (let [es (entries session)
        info-entries (filter #(and (= :session-info (:type %)) (:name %)) es)]
    (when-let [latest (last info-entries)]
      (:name latest))))

(defn branch
  "Walk from `from-id` (or current leaf) to root, returning the path.
   Includes the session header as the root entry."
  ([session] (branch session nil))
  ([session from-id]
   (let [start (or from-id (:leaf-id @(:state session)))
         by-id (:by-id @(:state session))
         hdr (header session)]
     (loop [path []
            current (when start (get by-id start))]
       (if-not current
         (cons hdr path)
         (let [pid (:parent-id current)]
           (if (nil? pid)
             (recur (cons current path) nil)
             (recur (cons current path) (get by-id pid)))))))))

(defn tree
  "Build the session as a tree of {:entry :children :label :label-timestamp}.
   The session header is the root node."
  [session]
  (let [es (entries session)
        hdr (header session)
        labels (:labels-by-id @(:state session))
        label-ts (:label-timestamps-by-id @(:state session))
        nodes (atom {(:id hdr) {:entry hdr :children [] :label nil :label-timestamp nil}})]
    (doseq [e es]
      (swap! nodes assoc (:id e) {:entry e
                                   :children []
                                   :label (get labels (:id e))
                                   :label-timestamp (get label-ts (:id e))}))
    (doseq [e es]
      (let [node (get @nodes (:id e))
            pid (:parent-id e)]
        (if (nil? pid)
          (swap! nodes update-in [(:id hdr) :children] conj node)
          (when (get @nodes pid)
            (swap! nodes update-in [pid :children] conj node)))))
    [(get @nodes (:id hdr))]))

(defn build-context
  "Build the session context (messages, thinking-level, model) for the LLM."
  ([session] (build-context session nil))
  ([session leaf]
   (domain/build-session-context (entries session) (or leaf (:leaf-id @(:state session))) (:by-id @(:state session)))))

;; ---------------------------------------------------------------------------
;; Public API — mutators
;; ---------------------------------------------------------------------------

(defn append-message!
  "Append a message entry. Returns the entry id."
  [session message]
  (let [id (generate-short-id (:by-id @(:state session)))
        entry {:type :message
               :id id
               :parent-id (:leaf-id @(:state session))
               :timestamp (time/now-iso)
               :message message}]
    (append-entry! session entry)))

(defn append-thinking-level-change!
  "Append a thinking-level-change entry. Returns the entry id."
  [session thinking-level]
  (let [id (generate-short-id (:by-id @(:state session)))
        entry {:type :thinking-level-change
               :id id
               :parent-id (:leaf-id @(:state session))
               :timestamp (time/now-iso)
               :thinking-level thinking-level}]
    (append-entry! session entry)))

(defn append-model-change!
  "Append a model-change entry. Returns the entry id."
  [session provider model-id]
  (let [id (generate-short-id (:by-id @(:state session)))
        entry {:type :model-change
               :id id
               :parent-id (:leaf-id @(:state session))
               :timestamp (time/now-iso)
               :provider provider
               :model-id model-id}]
    (append-entry! session entry)))

(defn append-compaction!
  "Append a compaction entry. Returns the entry id."
  [session summary first-kept-entry-id tokens-before & {:keys [details from-hook]}]
  (let [id (generate-short-id (:by-id @(:state session)))
        entry (cond-> {:type :compaction
                       :id id
                       :parent-id (:leaf-id @(:state session))
                       :timestamp (time/now-iso)
                       :summary summary
                       :first-kept-entry-id first-kept-entry-id
                       :tokens-before tokens-before}
                details (assoc :details details)
                from-hook (assoc :from-hook from-hook))]
    (append-entry! session entry)))

(defn append-custom-entry!
  "Append a custom entry (for extensions). Returns the entry id."
  [session custom-type & {:keys [data]}]
  (let [id (generate-short-id (:by-id @(:state session)))
        entry (cond-> {:type :custom
                       :id id
                       :parent-id (:leaf-id @(:state session))
                       :timestamp (time/now-iso)
                       :custom-type custom-type}
                data (assoc :data data))]
    (append-entry! session entry)))

(defn append-session-info!
  "Append a session-info entry (e.g. display name). Returns the entry id."
  [session name]
  (let [id (generate-short-id (:by-id @(:state session)))
        entry {:type :session-info
               :id id
               :parent-id (:leaf-id @(:state session))
               :timestamp (time/now-iso)
               :name (str/trim name)}]
    (append-entry! session entry)))

(defn append-custom-message!
  "Append a custom-message entry that participates in LLM context. Returns the entry id."
  [session custom-type content display & {:keys [details]}]
  (let [id (generate-short-id (:by-id @(:state session)))
        entry (cond-> {:type :custom-message
                       :id id
                       :parent-id (:leaf-id @(:state session))
                       :timestamp (time/now-iso)
                       :custom-type custom-type
                       :content content
                       :display (boolean display)}
                details (assoc :details details))]
    (append-entry! session entry)))

(defn append-label-change!
  "Set or clear a label on an entry. Returns the entry id."
  [session target-id label]
  (when-not (contains? (:by-id @(:state session)) target-id)
    (throw (ex-info (str "Entry " target-id " not found") {:entry-id target-id})))
  (let [id (generate-short-id (:by-id @(:state session)))
        entry {:type :label
               :id id
               :parent-id (:leaf-id @(:state session))
               :timestamp (time/now-iso)
               :target-id target-id
               :label (when (and label (not= "" label)) label)}]
    (append-entry! session entry)))

;; ---------------------------------------------------------------------------
;; Public API — branching
;; ---------------------------------------------------------------------------

(defn branch-from!
  "Move the leaf pointer to `branch-from-id`. Next append becomes its child."
  [session branch-from-id]
  (when-not (contains? (:by-id @(:state session)) branch-from-id)
    (throw (ex-info (str "Entry " branch-from-id " not found") {:entry-id branch-from-id})))
  (swap! (:state session) assoc :leaf-id branch-from-id)
  nil)

(defn reset-leaf!
  "Reset the leaf pointer to nil (before any entries)."
  [session]
  (swap! (:state session) assoc :leaf-id nil)
  nil)

(defn branch-with-summary!
  "Branch and append a branch-summary entry capturing abandoned context.
   The leaf stays at branch-from-id (the summary is a child, not an advance)."
  [session branch-from-id summary & {:keys [details from-hook]}]
  (branch-from! session branch-from-id)
  (let [id (generate-short-id (:by-id @(:state session)))
        entry (cond-> {:type :branch-summary
                       :id id
                       :parent-id branch-from-id
                       :timestamp (time/now-iso)
                       :from-id (or branch-from-id "root")
                       :summary summary}
                details (assoc :details details)
                from-hook (assoc :from-hook from-hook))]
    (append-entry! session entry)
    ;; Restore leaf to branch-from-id (summary is a child, not the new leaf)
    (swap! (:state session) assoc :leaf-id branch-from-id)
    id))

;; ---------------------------------------------------------------------------
;; Public API — session listing
;; ---------------------------------------------------------------------------

(defn build-session-info
  "Build SessionInfo from a file path. Pure function over parsed data."
  [file-path entries]
  (when (seq entries)
    (let [header (first (filter #(= :session (:type %)) entries))
          es (filter #(not= :session (:type %)) entries)
          messages (filter #(= :message (:type %)) es)
          user-or-assistant (filter #(let [role (get-in % [:message :role])]
                                      (or (= :user role) (= :assistant role)))
                                    messages)
          texts (mapv (fn [e]
                        (let [content (get-in e [:message :content])]
                          (if (string? content)
                            content
                            (->> content
                                 (filter #(= :text (:type %)))
                                 (mapv :text)
                                 (str/join " ")))))
                      user-or-assistant)
          first-user (first (filter #(= :user (get-in % [:message :role])) user-or-assistant))
          first-msg (when first-user
                      (let [content (get-in first-user [:message :content])]
                        (if (string? content)
                          content
                          (->> content
                               (filter #(= :text (:type %)))
                               (mapv :text)
                               (str/join " ")))))]
      {:path file-path
       :id (:id header)
       :cwd (or (:cwd header) "")
       :name (let [info-entries (filter #(= :session-info (:type %)) es)]
               (when-let [latest (last info-entries)]
                 (when (seq (:name latest))
                   (:name latest))))
       :parent-session-path (:parent-session header)
       :created (time/parse-date (:timestamp header))
       :modified (time/parse-date (:timestamp header))
       :message-count (count messages)
       :first-message (or first-msg "(no messages)")
       :all-messages-text (str/join " " texts)})))

(defn list-sessions
  "List all sessions in a directory. Returns vector of SessionInfo."
  [session-dir]
  (let [res (fs/list-directory session-dir)]
    (if (:ok res)
      (->> (:entries res)
           (filter :file?)
           (filter #(str/ends-with? (:name %) ".jsonl"))
           (mapv (fn [e]
                   (let [entries (load-entries-from-file (:absolute-path e))
                         stat-info (when (seq entries)
                                     (build-session-info (:absolute-path e) entries))]
                     stat-info)))
           (filterv some?))
      [])))
