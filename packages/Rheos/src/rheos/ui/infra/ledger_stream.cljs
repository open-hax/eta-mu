(ns rheos.ui.infra.ledger-stream
  "Frontend subscription to the server's ledger SSE stream (/api/events/stream).
   Any actor's mutation — HTTP, drag-drop, CLI, or a manual file edit — arrives
   here; the caller refetches the board in response. This is the live-update spine
   that makes 'the agent's actions update the UI' fall out for free: the agent is
   just another actor whose ledger events reach the browser through this stream.")

(defn subscribe
  "Open an EventSource to the ledger stream. `on-event` is called with each parsed
   event (a JS object). Optional `on-status` is called with true/false as the
   connection opens/errors. Returns a zero-arg close fn."
  ([on-event] (subscribe on-event (fn [_])))
  ([on-event on-status]
   (let [es (js/EventSource. "/api/events/stream")]
     (set! (.-onmessage es)
           (fn [e]
             (let [data (try (js/JSON.parse (.-data e)) (catch :default _ nil))]
               (when data (on-event data)))))
     (set! (.-onopen es) (fn [_] (on-status true)))
     (set! (.-onerror es) (fn [_] (on-status false)))
     (fn [] (.close es)))))
