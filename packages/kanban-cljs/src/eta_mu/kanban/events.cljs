(ns eta-mu.kanban.events
  "Event emission via the openplanner EventAdmission protocol."
  (:require ["node:path" :as path]
            [promethean.openplanner-protocols :as protocols]))

(defonce ledger-cache (atom {}))

(defn get-ledger [board-dir]
  (or (@ledger-cache board-dir)
      (let [events-dir (path/join board-dir ".events")
            g js/globalThis
            edn-mod (-> g .-promethean .-records .-edn .-event_admission)
            factory (aget edn-mod "create_edn_event_admission")
            _ (when-not factory
                (throw (ex-info "EdnFileEventAdmission not loaded" {:board-dir board-dir})))
            ledger (factory events-dir)]
        (swap! ledger-cache assoc board-dir ledger)
        ledger)))

(defn- kanban-envelope [board-id event-type payload]
  {:event/type (str "kanban." event-type)
   :event/id (str board-id "-" (:task-id payload) "-" (.now js/Date))
   :event/time (.toISOString (new js/Date))
   :session/id board-id
   :delivery/mode "tell"
   :payload payload})

(defn emit-status-change! [ledger board-id task-id from to write-id]
  (protocols/append-event!
   ledger
   (kanban-envelope board-id "status-change"
                    {:task-id task-id :from from :to to
                     :source "cli" :agent "eta-mu" :write-id write-id})))

(defn emit-frontmatter-change! [ledger board-id task-id key old-value new-value write-id]
  (protocols/append-event!
   ledger
   (kanban-envelope board-id "frontmatter"
                    {:task-id task-id :key key
                     :old-value old-value :new-value new-value
                     :source "cli" :agent "eta-mu" :write-id write-id})))

(defn emit-comment! [ledger board-id task-id write-id]
  (protocols/append-event!
   ledger
   (kanban-envelope board-id "comment"
                    {:task-id task-id :source "cli"
                     :agent "eta-mu" :write-id write-id})))

(defn generate-write-id []
  (str (.now js/Date) "-" (.toString (js/Math.random) 36) (.slice (.toString (js/Math.random) 36) 2 10)))

(defn query-events [ledger filter-spec]
  (protocols/query-events ledger filter-spec))

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
