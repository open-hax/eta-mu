(ns open-hax.sol.infra.agent.run-state
  "Per-run EDN-backed state and event ledger for Sol agent turns.

   Stores mutable run projections under .ημ/sol/runs/<run-id>/state.edn
   and append-only event ledgers under .ημ/sol/runs/<run-id>/events.edn.
   A session-level projection under .ημ/sol/sessions/state/<id>.edn keeps
   the authoritative list of run ids for the session."
  (:require [cljs.reader :as reader]
            [clojure.string :as str]
            [open-hax.sol.domain.node.fs :as fs]
            [open-hax.sol.domain.node.path :as path]
            [open-hax.sol.domain.time :as time]
            [open-hax.sol.shape.session-persistence :as persistence]))

(defprotocol IRunStateStore
  (-get-run-state [store run-id])
  (-put-run-state! [store run-id state])
  (-patch-run-state! [store run-id patch])
  (-append-run-event! [store run-id event])
  (-get-run-events [store run-id])
  (-list-runs [store]))

(defn- base-dir
  [store]
  (:base-dir store))

(defn- run-dir
  [store run-id]
  (path/join (base-dir store) (str run-id)))

(defn- state-path
  [store run-id]
  (path/join (run-dir store run-id) "state.edn"))

(defn- events-path
  [store run-id]
  (path/join (run-dir store run-id) "events.edn"))

(defn- safe-read-edn
  [text]
  (try
    (when (string? text)
      (reader/read-string text))
    (catch :default _ nil)))

(defn- pr-str-line
  [value]
  (str (pr-str value) "\n"))

(defn- read-state
  [store run-id]
  (let [p (state-path store run-id)]
    (when (fs/exists? p)
      (some-> (fs/read-file-sync p)
              safe-read-edn))))

(defn- write-state!
  [store run-id state]
  (let [p (state-path store run-id)]
    (fs/write-file-sync! p (pr-str state))))

(defn- read-events
  [store run-id]
  (let [p (events-path store run-id)]
    (if (fs/exists? p)
      (let [text (fs/read-file-sync p)]
        (->> (str/split-lines (or text ""))
             (map safe-read-edn)
             (remove nil?)
             vec))
      [])))

(defn- append-events!
  [store run-id event]
  (let [p (events-path store run-id)
        line (pr-str-line event)
        existing (or (when (fs/exists? p) (fs/read-file-sync p)) "")]
    (fs/write-file-sync! p (str existing line))))

(defn- all-run-dirs
  [store]
  (let [runs-dir (base-dir store)]
    (if (fs/exists? runs-dir)
      (->> (fs/readdir-sync runs-dir)
           (filter #(fs/exists? (path/join runs-dir % "state.edn")))
           vec)
      [])))

(defrecord EdnRunStateStore [base-dir]
  IRunStateStore
  (-get-run-state [_ run-id]
    (js/Promise.resolve (read-state {:base-dir base-dir} run-id)))

  (-put-run-state! [_ run-id state]
    (write-state! {:base-dir base-dir} run-id state)
    (js/Promise.resolve state))

  (-patch-run-state! [_ run-id patch]
    (let [store {:base-dir base-dir}
          current (or (read-state store run-id) {:run_id run-id})]
      (write-state! store run-id (merge current patch))
      (js/Promise.resolve (read-state store run-id))))

  (-append-run-event! [_ run-id event]
    (let [store {:base-dir base-dir}
          stamped (assoc event :event/time (or (:event/time event) (time/now-iso)))]
      (append-events! store run-id stamped)
      (js/Promise.resolve true)))

  (-get-run-events [_ run-id]
    (js/Promise.resolve (read-events {:base-dir base-dir} run-id)))

  (-list-runs [_]
    (js/Promise.resolve (all-run-dirs {:base-dir base-dir})))

  persistence/ISessionStore
  (put-run! [_ run]
    (let [store {:base-dir base-dir}
          run-id (:run_id run)
          state (or (read-state store run-id) {:run_id run-id})]
      (write-state! store run-id
                    (merge state
                           (select-keys run [:session_id :conversation_id
                                             :run_id :status :model
                                             :created_at :updated_at
                                             :answer :error :messages
                                             :has_active_stream])))
      (js/Promise.resolve run)))

  (get-run [_ run-id]
    (js/Promise.resolve (read-state {:base-dir base-dir} run-id)))

  (patch-run! [store run-id patch]
    (-patch-run-state! store run-id patch))

  (list-active-runs [_ _session-id]
    (js/Promise.resolve []))

  (complete-run! [store run-id opts]
    (-patch-run-state! store run-id (merge opts {:updated_at (time/now-iso)})))

  (delete-run! [_ _run-id]
    (js/Promise.resolve true)))

(defonce default-store* (atom nil))

(defn create-edn-run-state-store
  "Create an EDN run state store rooted at the given base path.
   Defaults to .ημ/sol/runs under the process cwd."
  ([]
   (create-edn-run-state-store (path/join (path/cwd) ".ημ" "sol" "runs")))
  ([base-dir]
   (->EdnRunStateStore base-dir)))

(defn set-default-store!
  [store]
  (reset! default-store* store))

(defn default-store
  []
  (or @default-store*
      (throw (ex-info "No default Sol run state store configured" {}))))

(defn run-get
  [run-id]
  (-get-run-state (default-store) run-id))

(defn run-get-sync
  [run-id]
  (read-state (default-store) run-id))

(defn run-put!
  [state]
  (-put-run-state! (default-store) (:run_id state) state))

(defn run-patch!
  [run-id patch]
  (-patch-run-state! (default-store) run-id patch))

(defn append-run-event!
  [run-id event]
  (-append-run-event! (default-store) run-id event))

(defn run-events
  [run-id]
  (-get-run-events (default-store) run-id))

(defn run-list
  []
  (-list-runs (default-store)))

(defn run-list-active
  []
  (->> (all-run-dirs (default-store))
       (map #(read-state (default-store) %))
       (filter some?)
       (filter #(contains? #{"running" "queued" "waiting_input"}
                           (some-> (:status %) str str/lower-case)))
       vec))

(defn update-run!
  "Apply update-fn to the current run state and persist the result.
   Best-effort: synchronous file write wrapped in a resolved Promise."
  [run-id update-fn]
  (let [store (default-store)
        current (or (read-state store run-id) {:run_id run-id})
        updated (update-fn current)]
    (write-state! store run-id updated)
    (js/Promise.resolve updated)))

(defn- update-receipts
  [receipts receipt-id default-receipt update-fn]
  (let [idx (first (keep-indexed (fn [i r] (when (= (:id r) receipt-id) i)) receipts))
        existing (if idx (nth receipts idx) default-receipt)
        updated (update-fn existing)]
    (if idx
      (assoc receipts idx updated)
      (conj (vec receipts) updated))))

(defn update-run-tool-receipt!
  "Update or create a tool receipt on the run state."
  [run-id receipt-id default-receipt update-fn]
  (update-run! run-id #(update % :tool_receipts
                               (fn [receipts]
                                 (update-receipts (vec (or receipts []))
                                                  receipt-id
                                                  (merge {:id receipt-id} default-receipt)
                                                  update-fn)))))

(defn backfill-run-tool-input-preview!
  "Backfill the input_preview of a tool receipt."
  [run-id receipt-id tool-name input-preview]
  (update-run-tool-receipt! run-id receipt-id {:tool_name tool-name}
                            #(assoc % :tool_name tool-name
                                      :input_preview input-preview)))

(defn append-run-trace-text!
  "Append a trace text entry to the run state."
  [run-id kind delta at]
  (update-run! run-id #(update % :trace_text
                               (fn [trace]
                                 (conj (vec (or trace []))
                                       {:kind kind :delta delta :at at})))))

(defn apply-run-tool-trace-event!
  "Persist a tool trace event as a run event."
  [run-id trace-event]
  (-append-run-event! (default-store) run-id
                      (assoc trace-event :event_type "tool_trace")))

(defn run-append-event!
  "Public alias for append-run-event! used by turn orchestration."
  [run-id event]
  (append-run-event! run-id event))
