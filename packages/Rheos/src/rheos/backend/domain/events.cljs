(ns rheos.backend.domain.events
  "Kanban event vocabulary — envelope construction, emission via the openplanner
   EventAdmission protocol, and an in-process pub/sub bus.

   Every kanban mutation (status change, frontmatter edit, comment) is appended
   to the board's ledger (see [[rheos.backend.infra.ledger]] for the backing
   store at `<board-dir>/.events/ledger.edn`) AND published to in-process
   subscribers. The SSE endpoint subscribes here, so any actor's mutation — HTTP,
   CLI (picked up by the file watcher), or drag-drop — flows to the live UI
   through the one [[record!]] chokepoint. See [[rheos.backend.domain.transition]]
   for the single enforced write path that produces status-change events."
  (:require [promethean.openplanner-protocols :as protocols]))

(defn- kanban-envelope [board-id event-type payload]
  {:event/type (str "kanban." event-type)
   :event/id (str board-id "-" (:task-id payload) "-" (.now js/Date))
   :event/time (.toISOString (new js/Date))
   :session/id board-id
   :delivery/mode "tell"
   :payload (assoc payload :type event-type)})

(defn envelope->kanban-event [envelope]
  (let [payload (or (:payload envelope) {})]
    {:board (or (:session/id envelope) "")
     :task-id (or (:task-id payload) "")
     :source (or (:source payload) "cli")
     :type (or (:type payload) "file-changed")
     :from (:from payload)
     :to (:to payload)
     :key (:key payload)
     :old-value (:old-value payload)
     :new-value (:new-value payload)
     :write-id (:write-id payload)
     :timestamp (or (:event/time envelope) (.toISOString (new js/Date)))
     :agent (or (:agent payload) "unknown")
     :details (:details payload)}))

;; ---------------------------------------------------------------------------
;; In-process pub/sub bus — the SSE stream's source. defonce so subscriptions
;; survive hot reloads of this namespace.
;; ---------------------------------------------------------------------------

(defonce ^:private listeners (atom #{}))

(defn subscribe!
  "Register `callback`, invoked with each recorded event as a kanban-event map.
   Returns a zero-arg unsubscribe fn."
  [callback]
  (swap! listeners conj callback)
  (fn [] (swap! listeners disj callback)))

(defn publish!
  "Fan a kanban-event out to every subscriber. A throwing listener is isolated so
   one dead SSE socket can't break the others."
  [kanban-event]
  (doseq [cb @listeners]
    (try (cb kanban-event)
         (catch :default e (js/console.error "[events] publish! listener error:" e)))))

(defn- ^:async record!
  "Append `envelope` to the ledger, then publish it to in-process subscribers.
   Returns the append promise so callers keep awaiting persistence."
  [ledger envelope]
  (let [result (await (protocols/append-event! ledger envelope))]
    (publish! (envelope->kanban-event envelope))
    result))

;; ---------------------------------------------------------------------------
;; Emission
;; ---------------------------------------------------------------------------

(defn emit-status-change!
  ([ledger board-id task-id from to write-id]
   (emit-status-change! ledger board-id task-id from to write-id "cli"))
  ([ledger board-id task-id from to write-id source]
   (record!
    ledger
    (kanban-envelope board-id "status-change"
                     {:task-id task-id :from from :to to
                      :source source :agent "eta-mu" :write-id write-id}))))

(defn emit-frontmatter-change!
  ([ledger board-id task-id key old-value new-value write-id]
   (emit-frontmatter-change! ledger board-id task-id key old-value new-value write-id "cli"))
  ([ledger board-id task-id key old-value new-value write-id source]
   (record!
    ledger
    (kanban-envelope board-id "frontmatter"
                     {:task-id task-id :key key
                      :old-value old-value :new-value new-value
                      :source source :agent "eta-mu" :write-id write-id}))))

(defn emit-comment!
  ([ledger board-id task-id write-id]
   (emit-comment! ledger board-id task-id write-id "cli"))
  ([ledger board-id task-id write-id source]
   (record!
    ledger
    (kanban-envelope board-id "comment"
                     {:task-id task-id :source source
                      :agent "eta-mu" :write-id write-id}))))

(defn generate-write-id []
  (str (.now js/Date) "-" (.toString (js/Math.random) 36) (.slice (.toString (js/Math.random) 36) 2 10)))

(defn ^:async query-events
  "Return ledger events, optionally filtered. `filter-spec` is a Clojure map whose
   keys are matched against each event's `:payload` (e.g. {:task-id \"x\"} or
   {:type \"status-change\"}). An empty map returns every event."
  [ledger filter-spec]
  (let [evts (await (protocols/query-events ledger {}))]
    (if (empty? filter-spec)
      (vec evts)
      (filterv (fn [e]
                 (every? (fn [[k v]] (= (get-in e [:payload k]) v)) filter-spec))
               evts))))
