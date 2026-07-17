(ns eta-mu.chat-ui.stream
  "WebSocket streaming connection management.")

;; ---------------------------------------------------------------------------
;; WebSocket connection
;; ---------------------------------------------------------------------------

(defn connect-stream
  "Open a WebSocket connection for streaming chat.
   Returns {:send :close :status}.
   Handlers: {:on-token :on-event :on-open :on-close :on-error}"
  [url handlers]
  (let [ws (js/WebSocket. url)
        state (atom {:connected false})]
    (set! (.-onopen ws)
          (fn [_]
            (swap! state assoc :connected true)
            (when-let [f (:on-open handlers)] (f))))
    (set! (.-onclose ws)
          (fn [_]
            (swap! state assoc :connected false)
            (when-let [f (:on-close handlers)] (f))))
    (set! (.-onerror ws)
          (fn [err]
            (when-let [f (:on-error handlers)] (f err))))
    (set! (.-onmessage ws)
          (fn [event]
            (try
              (let [data (js->clj (js/JSON.parse (.-data event)) :keywordize-keys true)
                    channel (:channel data)
                    payload (:payload data)]
                (case channel
                  "tokens"
                  (when-let [f (:on-token handlers)]
                    (f {:text (:token payload)
                        :run-id (:run_id payload)
                        :kind (:kind payload)}))

                  "events"
                  (when-let [f (:on-event handlers)]
                    (f {:type (:type payload)
                        :run-id (:run_id payload)
                        :data payload}))

                  nil))
              (catch :default _))))
    {:send (fn [data] (.send ws (js/JSON.stringify (clj->js data))))
     :close (fn [] (.close ws))
     :status (fn [] (.-readyState ws))}))
