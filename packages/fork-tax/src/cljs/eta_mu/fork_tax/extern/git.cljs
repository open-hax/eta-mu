(ns eta-mu.fork-tax.extern.git
  "Raw local Git process boundary for Fork Tax."
  (:require [clojure.string :as str]
            ["node:child_process" :as cp]))

(defn exec-at
  ([cwd args]
   (exec-at cwd args {}))
  ([cwd args {:keys [timeout-ms kill-signal preserve-stdout?]
              :or {kill-signal "SIGTERM"}}]
   (js/Promise.
    (fn [resolve _reject]
      (let [stdout (atom "")
            stderr (atom "")
            options (cond-> {:cwd cwd
                             :stdio "pipe"
                             :killSignal kill-signal}
                      timeout-ms (assoc :timeout timeout-ms))
            child (.spawn cp "git" (clj->js args) (clj->js options))]
        (.on (.-stdout child) "data" #(swap! stdout str %))
        (.on (.-stderr child) "data" #(swap! stderr str %))
        (.on child "close"
             (fn [code signal]
               (resolve {:exit (if (number? code) code 1)
                         :stdout (if preserve-stdout?
                                   @stdout
                                   (str/trim @stdout))
                         :stderr (str/trim @stderr)
                         :signal signal})))
        (.on child "error"
             (fn [error]
               (resolve {:exit 1
                         :stdout ""
                         :stderr (.-message error)
                         :signal nil}))))))))
