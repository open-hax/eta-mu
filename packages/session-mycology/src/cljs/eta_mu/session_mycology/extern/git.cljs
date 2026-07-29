(ns eta-mu.session-mycology.extern.git
  "Raw local Git process boundary for Session Mycology."
  (:require [clojure.string :as str]
            ["node:child_process" :as cp]))

(def ^:private default-timeout-ms 30000)

(defn- result-status [exit stderr]
  (cond
    (zero? exit) :ok
    (re-find #"(?i)not a git repository" stderr) :not-a-repository
    :else :git-failed))

(defn exec-at
  ([cwd args]
   (exec-at cwd args {}))
  ([cwd args {:keys [timeout-ms kill-signal]
              :or {timeout-ms default-timeout-ms
                   kill-signal "SIGKILL"}}]
   (js/Promise.
    (fn [resolve _reject]
      (let [stdout (atom "")
            stderr (atom "")
            settled? (atom false)
            timer (atom nil)
            child (.spawn cp "git" (clj->js args)
                          #js {:cwd cwd :stdio "pipe"})
            finish! (fn [result]
                      (when (compare-and-set! settled? false true)
                        (when @timer
                          (js/clearTimeout @timer))
                        (resolve result)))]
        (.setEncoding (.-stdout child) "utf8")
        (.setEncoding (.-stderr child) "utf8")
        (.on (.-stdout child) "data" #(swap! stdout str %))
        (.on (.-stderr child) "data" #(swap! stderr str %))
        (.on child "close"
             (fn [code signal]
               (let [exit (if (number? code) code 1)
                     error-output (str/trim @stderr)]
                 (finish! {:exit exit
                           :status (result-status exit error-output)
                           :stdout (str/trim @stdout)
                           :stderr error-output
                           :signal signal}))))
        (.on child "error"
             (fn [error]
               (finish! {:exit 1
                         :status :process-error
                         :stdout (str/trim @stdout)
                         :stderr (.-message error)
                         :signal nil})))
        (reset! timer
                (js/setTimeout
                 (fn []
                   (.kill child kill-signal)
                   (finish! {:exit 1
                             :status :timeout
                             :stdout (str/trim @stdout)
                             :stderr (str/trim @stderr)
                             :signal kill-signal
                             :timeout-ms timeout-ms}))
                 timeout-ms)))))))
