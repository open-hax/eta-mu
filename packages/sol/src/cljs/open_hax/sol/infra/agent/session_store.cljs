(ns open-hax.sol.infra.agent.session-store
  "EDN-backed session store for Sol.

   Stores append-only event ledgers under .ημ/sol/sessions/ledgers/<id>.edn
   and mutable session projections under .ημ/sol/sessions/state/<id>.edn."
  (:require [cljs.reader :as reader]
            [clojure.string :as str]
            [open-hax.sol.domain.node.fs :as fs]
            [open-hax.sol.domain.node.path :as path]
            [open-hax.sol.domain.time :as time]
            [open-hax.sol.shape.session-persistence :as persistence]
            [promethean.event-ledger.schema :as event-schema])
)

(defprotocol ISessionStore
  (get-session [store session-id])
  (save-session! [store session-id session])
  (append-event! [store session-id event])
  (record-run! [store session-id run-id status])
  (get-session-runs [store session-id])
  (get-events [store session-id])
  (list-sessions [store]))

(defn- base-dir
  [store]
  (:base-dir store))

(defn- state-path
  [store session-id]
  (path/join (base-dir store) "state" (str session-id ".edn")))

(defn- ledger-path
  [store session-id]
  (path/join (base-dir store) "ledgers" (str session-id ".edn")))

(defn- safe-read-edn
  [text]
  (try
    (when (string? text)
      (reader/read-string text))
    (catch :default _ nil)))

(defn- pr-str-line
  [value]
  (str (pr-str value) "\n"))

(defn- write-state!
  [store session-id session]
  (let [p (state-path store session-id)]
    (fs/write-file-sync! p (pr-str session))))

(defn- read-state
  [store session-id]
  (let [p (state-path store session-id)]
    (when (fs/exists? p)
      (some-> (fs/read-file-sync p)
              safe-read-edn))))

(defn- read-ledger
  [store session-id]
  (let [p (ledger-path store session-id)]
    (if (fs/exists? p)
      (let [text (fs/read-file-sync p)]
        (->> (str/split-lines (or text ""))
             (map safe-read-edn)
             (remove nil?)
             vec))
      [])))

(defn- append-ledger!
  [store session-id event]
  (let [p (ledger-path store session-id)
        line (pr-str-line event)
        existing (or (when (fs/exists? p) (fs/read-file-sync p)) "")]
    (fs/write-file-ensure-dir! p (str existing line))))

(defn- all-state-files
  [store]
  (let [state-dir (path/join (base-dir store) "state")]
    (if (fs/exists? state-dir)
      (->> (fs/readdir-sync state-dir)
           (filter #(str/ends-with? % ".edn"))
           (map #(subs % 0 (- (count %) 4)))
           vec)
      [])))

(defn- read-run-by-id
  [store run-id]
  (some (fn [session-id]
          (let [state (read-state store session-id)]
            (when (= run-id (:run_id state)) state)))
        (all-state-files store)))

(defrecord EdnSessionStore [base-dir]
  ISessionStore
  (get-session [_ session-id]
    (js/Promise.resolve (read-state {:base-dir base-dir} session-id)))

  (save-session! [_ session-id session]
    (write-state! {:base-dir base-dir} session-id session)
    (js/Promise.resolve session))

  (append-event! [_ session-id event]
    (let [validation (event-schema/validate-envelope event)]
      (if (:valid validation)
        (let [store {:base-dir base-dir}
              stamped (assoc event :event/time (or (:event/time event)
                                                   (time/now-iso)))]
          (append-ledger! store session-id stamped)
          (js/Promise.resolve true))
        (js/Promise.reject (ex-info "Invalid event envelope"
                                    {:session-id session-id
                                     :errors (:errors validation)})))))

  (record-run! [_ session-id run-id _status]
    (let [store {:base-dir base-dir}
          current (or (read-state store session-id)
                      {:session_id session-id})
          runs (vec (conj (filterv #(not= % run-id) (vec (:runs current))) run-id))
          updated (assoc current
                         :runs runs
                         :last_run_id run-id
                         :updated_at (time/now-iso))]
      (write-state! store session-id updated)
      (js/Promise.resolve true)))

  (get-session-runs [_ session-id]
    (let [state (read-state {:base-dir base-dir} session-id)]
      (js/Promise.resolve (vec (:runs state)))))

  (get-events [_ session-id]
    (js/Promise.resolve (read-ledger {:base-dir base-dir} session-id)))

  (list-sessions [_]
    (js/Promise.resolve (all-state-files {:base-dir base-dir})))

  persistence/ISessionStore
  (put-run! [_ run]
    (let [store {:base-dir base-dir}
          session-id (:session_id run)
          state (or (read-state store session-id)
                    {:session_id session-id})]
      (write-state! store session-id
                    (assoc state :run_id (:run_id run)
                                 :status (:status run)
                                 :model (:model run)
                                 :updated_at (time/now-iso)))
      (js/Promise.resolve run)))

  (get-run [_ run-id]
    (js/Promise.resolve (read-run-by-id {:base-dir base-dir} run-id)))

  (patch-run! [store run-id _patch]
    (persistence/get-run store run-id))

  (list-active-runs [_ _session-id]
    (js/Promise.resolve []))

  (complete-run! [store run-id _opts]
    (persistence/get-run store run-id))

  (delete-run! [_ _run-id]
    (js/Promise.resolve true)))

(defonce default-store* (atom nil))

(defn create-edn-session-store
  "Create an EDN session store rooted at the given base path.
   Defaults to .ημ/sol/sessions under the process cwd."
  ([]
   (create-edn-session-store (path/join (path/cwd) ".ημ" "sol" "sessions")))
  ([base-dir]
   (->EdnSessionStore base-dir)))

(defn set-default-store!
  [store]
  (reset! default-store* store))

(defn default-store
  []
  (or @default-store*
      (throw (ex-info "No default Sol session store configured" {}))))

;; Public convenience API operating on the default store.
(defn session-get
  [session-id]
  (get-session (default-store) session-id))

(defn session-get-sync
  [session-id]
  (read-state (default-store) session-id))

(defn session-save!
  [session-id session]
  (save-session! (default-store) session-id session))

(defn session-put!
  [session]
  (session-save! (:session_id session) session))

(defn session-update!
  [session-id patch]
  (let [store (default-store)
        current (or (read-state store session-id)
                    {:session_id session-id})]
    (save-session! store session-id (merge current patch))))

(defn session-complete!
  [session-id conversation-id opts]
  (session-update! session-id (merge opts
                                     {:conversation_id conversation-id
                                      :has_active_stream false
                                      :updated_at (time/now-iso)})))

(defn session-mark-streaming!
  [session-id active?]
  (session-update! session-id {:has_active_stream (boolean active?)
                               :updated_at (time/now-iso)}))

(defn session-can-send?
  [session]
  (let [status (some-> (:status session) str str/lower-case)]
    (cond
      (or (nil? session) (str/blank? status))
      {:can-send true :reason "new session"}

      (contains? #{"running" "queued" "waiting_input"} status)
      {:can-send false :reason "session is active"}

      :else
      {:can-send true :reason "session is idle"})))

(defn session-list-active
  []
  (->> (all-state-files (default-store))
       (map #(read-state (default-store) %))
       (filter some?)
       (filter #(contains? #{"running" "queued" "waiting_input"}
                           (some-> (:status %) str str/lower-case)))
       vec
       js/Promise.resolve))

(defn session-snapshots
  []
  (->> (all-state-files (default-store))
       (map #(read-state (default-store) %))
       (filter some?)
       vec))

(defn session-append-event!
  [session-id event]
  (append-event! (default-store) session-id event))

(defn session-events
  [session-id]
  (get-events (default-store) session-id))

(defn session-list
  []
  (list-sessions (default-store)))

(defn session-record-run!
  [session-id run-id status]
  (record-run! (default-store) session-id run-id status))

(defn session-run-ids
  [session-id]
  (get-session-runs (default-store) session-id))

(defn run-get
  [run-id]
  (persistence/get-run (default-store) run-id))

(defn run-put!
  [run]
  (persistence/put-run! (default-store) run))
