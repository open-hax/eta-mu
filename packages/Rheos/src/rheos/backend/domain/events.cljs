(ns eta-mu.kanban.events
  "Event emission via the openplanner EventAdmission protocol.

   Every kanban mutation (status change, frontmatter edit, comment) is appended
   to an EDN-file-backed ledger under `<board-dir>/.events/ledger.edn`. The ledger
   is the audit record of board activity — see [[eta-mu.kanban.transition]] for the
   single enforced write path that produces status-change events."
  (:require ["node:path" :as path]
            [promethean.records.edn.event-admission :as edn-ea]
            [promethean.openplanner-protocols :as protocols]))

(defonce ledger-cache (atom {}))

(defn get-ledger [board-dir]
  (or (@ledger-cache board-dir)
      (let [events-dir (path/join board-dir ".events")
            ledger (edn-ea/create-edn-event-admission events-dir)]
        (swap! ledger-cache assoc board-dir ledger)
        ledger)))

(defn- kanban-envelope [board-id event-type payload]
  {:event/type (str "kanban." event-type)
   :event/id (str board-id "-" (:task-id payload) "-" (.now js/Date))
   :event/time (.toISOString (new js/Date))
   :session/id board-id
   :delivery/mode "tell"
   :payload (assoc payload :type event-type)})

(defn emit-status-change!
  ([ledger board-id task-id from to write-id]
   (emit-status-change! ledger board-id task-id from to write-id "cli"))
  ([ledger board-id task-id from to write-id source]
   (protocols/append-event!
    ledger
    (kanban-envelope board-id "status-change"
                     {:task-id task-id :from from :to to
                      :source source :agent "eta-mu" :write-id write-id}))))

(defn emit-frontmatter-change!
  ([ledger board-id task-id key old-value new-value write-id]
   (emit-frontmatter-change! ledger board-id task-id key old-value new-value write-id "cli"))
  ([ledger board-id task-id key old-value new-value write-id source]
   (protocols/append-event!
    ledger
    (kanban-envelope board-id "frontmatter"
                     {:task-id task-id :key key
                      :old-value old-value :new-value new-value
                      :source source :agent "eta-mu" :write-id write-id}))))

(defn emit-comment!
  ([ledger board-id task-id write-id]
   (emit-comment! ledger board-id task-id write-id "cli"))
  ([ledger board-id task-id write-id source]
   (protocols/append-event!
    ledger
    (kanban-envelope board-id "comment"
                     {:task-id task-id :source source
                      :agent "eta-mu" :write-id write-id}))))

(defn generate-write-id []
  (str (.now js/Date) "-" (.toString (js/Math.random) 36) (.slice (.toString (js/Math.random) 36) 2 10)))

(defn query-events
  "Return ledger events, optionally filtered. `filter-spec` is a Clojure map whose
   keys are matched against each event's `:payload` (e.g. {:task-id \"x\"} or
   {:type \"status-change\"}). An empty map returns every event."
  [ledger filter-spec]
  (-> (protocols/query-events ledger {})
      (.then (fn [evts]
               (if (empty? filter-spec)
                 (vec evts)
                 (filterv (fn [e]
                            (every? (fn [[k v]] (= (get-in e [:payload k]) v)) filter-spec))
                          evts))))))

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
