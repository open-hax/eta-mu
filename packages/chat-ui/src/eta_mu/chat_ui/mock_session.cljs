(ns eta-mu.chat-ui.mock-session
  "Mock IChatSession for standalone testing and fallback use.
   Echoes a canned reply after a short delay; no network required."
  (:require [eta-mu.chat-ui.protocol :as proto]))

(defn- notify [listeners ev]
  (doseq [f @listeners] (f ev)))

(defn create-mock-session
  "Create a mock chat session.
   Options:
     :reply   - text the mock assistant returns (default: explain that this is a mock)
     :delay   - ms before the reply starts (default: 300)"
  ([] (create-mock-session {}))
   ([{:keys [reply delay] :or {reply "This is a mock session. Connect a real backend (knoxx/sol/opencode) to get live agent responses." delay 300}}]
    (let [listeners (atom [])
          aborted (atom false)
          timer (atom nil)
          resolver (atom nil)]
      (reify proto/IChatSession
        (send-message ^:async [_ text]
          (reset! aborted false)
          (js/Promise.
           (fn [resolve _reject]
             (reset! resolver resolve)
             (reset! timer
                     (js/setTimeout
                      (fn []
                        (when-not @aborted
                          (notify listeners {:type "token" :text reply :id (str (random-uuid))})
                          (notify listeners {:type "done"}))
                        (reset! timer nil)
                        (reset! resolver nil)
                        (resolve {:ok true :message text :aborted @aborted}))
                      delay)))))
        (subscribe [_ callback]
          (swap! listeners conj callback)
          (fn [] (swap! listeners (fn [ls] (filterv #(not= % callback) ls)))))
        (abort [_]
          (reset! aborted true)
          (when-let [resolve @resolver]
            (reset! resolver nil)
            (resolve {:ok false :aborted true}))
          (when-let [t @timer]
            (js/clearTimeout t)
            (reset! timer nil)))
        (history [_] (js/Promise.resolve []))
        (close [_]
          (when-let [t @timer]
            (js/clearTimeout t)
            (reset! timer nil))
          (reset! listeners []))))))
