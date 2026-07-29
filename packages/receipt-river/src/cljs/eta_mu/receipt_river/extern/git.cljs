(ns eta-mu.receipt-river.extern.git
  "Raw local Git process boundary."
  (:require [clojure.string :as str]
            ["node:child_process" :as cp]))

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
  [cwd args]
  (js/Promise.
   (fn [resolve _reject]
     (let [stdout (atom "")
           stderr (atom "")
           child (.spawn cp "git" (clj->js args)
                         #js {:cwd cwd :stdio "pipe"})]
       (.on (.-stdout child) "data" #(swap! stdout str %))
       (.on (.-stderr child) "data" #(swap! stderr str %))
       (.on child "close"
            (fn [code signal]
              (resolve (close-result code signal @stdout @stderr))))
       (.on child "error"
            (fn [error]
              (resolve {:exit 1
                        :signal nil
                        :stdout ""
                        :stderr (.-message error)})))))))
