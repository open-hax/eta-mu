(ns rheos.backend.infra.ledger
  "Ledger adapter construction + caching.

   Binds a board directory to an EventAdmission implementation. Today the only
   implementation is the EDN-file-backed ledger at `<board-dir>/.events/ledger.edn`;
   a future Mongo-backed adapter (the knoxx deployment of this system) plugs in
   here behind the same protocol without touching callers."
  (:require ["node:path" :as path]
            [promethean.records.edn.event-admission :as edn-ea]))

(defonce ledger-cache (atom {}))

(defn get-ledger [board-dir]
  (or (@ledger-cache board-dir)
      (let [events-dir (path/join board-dir ".events")
            ledger (edn-ea/create-edn-event-admission events-dir)]
        (swap! ledger-cache assoc board-dir ledger)
        ledger)))
