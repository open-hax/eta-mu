(ns eta-mu.chat-ui.protocol
  "IChatSession protocol — backend-agnostic chat interface.
   Implementations: knoxx, sol, opencode, mock."
  (:require [helix.hooks :as hooks]))

;; ---------------------------------------------------------------------------
;; Protocol
;; ---------------------------------------------------------------------------

(defprotocol IChatSession
  "Backend-agnostic chat session."
  (send-message [session text] "Send a user message. Returns Promise<response>.")
  (subscribe [session callback] "Subscribe to streaming responses. Returns unsubscribe fn.")
  (abort [session] "Abort current generation.")
  (history [session] "Get message history. Returns Promise<vector>.")
  (close [session] "Close the session."))

;; ---------------------------------------------------------------------------
;; React hook
;; ---------------------------------------------------------------------------

(defn use-chat-session
  "React hook that manages a chat session lifecycle.
   Returns {:messages :send :abort :is-sending :session}"
  [session]
  (let [[messages set-messages] (hooks/use-state [])
        [is-sending set-sending] (hooks/use-state false)
        unsubscribe (atom nil)]

    ;; Subscribe to streaming on mount
    (hooks/use-effect [session]
      (when session
        (let [unsub (subscribe session
                      (fn [event]
                        (case (:type event)
                          "token"
                          (set-messages (fn [msgs]
                                         (let [last-msg (last msgs)]
                                           (if (and last-msg (= "assistant" (:role last-msg)))
                                             (assoc msgs (dec (count msgs))
                                                   (update last-msg :content str (:text event)))
                                             (conj msgs {:role "assistant" :content (:text event) :id (:id event)})))))

                          "done"
                          (set-sending false)

                          "error"
                          (set-sending false)

                          nil)))]
          (reset! unsubscribe unsub)
          (fn [] (when unsub (unsub))))))

    {:messages messages
     :is-sending is-sending
     :send (fn ^:async [text]
             (when session
               (set-sending true)
               (set-messages (fn [msgs] (conj msgs {:role "user" :content text :id (str (random-uuid))})))
               (try
                 (await (send-message session text))
                 (catch :default _ (set-sending false)))))
     :abort (fn [] (when session (abort session)))
     :session session}))
