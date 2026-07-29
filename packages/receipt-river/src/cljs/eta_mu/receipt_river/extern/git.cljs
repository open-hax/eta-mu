(ns eta-mu.receipt-river.extern.git
  "Raw local Git process boundary."
  (:require [clojure.string :as str]
            ["node:child_process" :as cp]))

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
            (fn [code]
              (resolve {:exit (or code 0)
                        :stdout (str/trim @stdout)
                        :stderr (str/trim @stderr)})))
       (.on child "error"
            (fn [error]
              (resolve {:exit 1 :stdout "" :stderr (.-message error)})))))))
