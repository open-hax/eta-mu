(ns eta-mu.receipt-river.extern.git
  "Raw local Git process boundary."
  (:require [clojure.string :as str]
            ["node:child_process" :as cp]))

(def ^:private default-timeout-ms 30000)

(defn close-result
  "Decode Node's child-process close values into a shaped Git result."
  [code signal stdout stderr]
  {:exit (if (number? code) code 1)
   :signal signal
   :stdout (str/trim stdout)
   :stderr (str/trim stderr)})

(defn bare-repository?
  "Confirm that a structural bare marker has local Git repository metadata."
  [cwd]
  (let [result (.spawnSync cp
                           "git"
                           (clj->js ["config" "--local" "--get" "core.bare"])
                           #js {:cwd cwd :encoding "utf8"})]
    (and (number? (.-status result))
         (zero? (.-status result))
         (= "true" (str/trim (.-stdout result))))))

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
               (finish! (close-result code signal @stdout @stderr))))
        (.on child "error"
             (fn [error]
               (finish! {:exit 1
                         :signal nil
                         :stdout (str/trim @stdout)
                         :stderr (.-message error)})))
        (reset! timer
                (js/setTimeout
                 (fn []
                   (.kill child kill-signal)
                   (finish! {:exit 1
                             :status :timeout
                             :signal kill-signal
                             :stdout (str/trim @stdout)
                             :stderr (str/trim @stderr)
                             :timeout-ms timeout-ms}))
                 timeout-ms)))))))
