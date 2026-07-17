(ns eta-mu.extern.readline
  "Node readline boundary for the interactive agent REPL.

  Provides a persistent line-reader: create one handle per REPL session, ask
  questions against it, and close it when the session ends. A permanent `line`
  listener queues input, so lines typed while no question is pending (e.g.
  while a turn is running) are delivered to the next question instead of being
  dropped. Resolution never races the synchronous `close` event."
  (:require ["node:readline" :as readline]))

(defn create-interface
  "Create a line-reader handle for a REPL session.

  Defaults to process stdin/stdout; pass explicit streams for testing."
  ([] (create-interface js/process.stdin js/process.stdout))
  ([input output]
   (let [^js rl (.createInterface readline #js {:input input :output output})
         state (atom {:lines [] :waiter nil :closed? false})]
     (.on rl "line"
          (fn [line]
            (if-let [waiter (:waiter @state)]
              (do (swap! state assoc :waiter nil)
                  (waiter line))
              (swap! state update :lines conj line))))
     (.on rl "close"
          (fn []
            (swap! state assoc :closed? true)
            (when-let [waiter (:waiter @state)]
              (swap! state assoc :waiter nil)
              (waiter nil))))
     {:rl rl :state state})))

(defn question
  "Prompt and read the next line from a `create-interface` handle.

  Returns a promise that resolves to the next queued or typed line, or nil
  when the interface closes (Ctrl+D / stdin end) before a line arrives."
  [{:keys [rl state]} prompt]
  (js/Promise.
   (fn [resolve _reject]
     (let [{:keys [lines closed?]} @state]
       (cond
         (seq lines)
         (do (swap! state update :lines subvec 1)
             (resolve (first lines)))

         closed?
         (resolve nil)

         :else
         (do (swap! state assoc :waiter resolve)
             (.setPrompt ^js rl prompt)
             (.prompt ^js rl)))))))

(defn close!
  "Close a line-reader handle. Safe to call on an already-closed handle."
  [{:keys [rl]}]
  (.close ^js rl))
