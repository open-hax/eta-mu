(ns eta-mu.session-mycology.extern.git
  "Raw local Git process boundary for Session Mycology."
  (:require [clojure.string :as str]
            ["node:child_process" :as cp]))

(defn exec-at
  [cwd args]
  (js/Promise.
   (fn [resolve _reject]
     (let [stdout (atom "")
           child (.spawn cp "git" (clj->js args)
                         #js {:cwd cwd :stdio "pipe"})]
       (.on (.-stdout child) "data" #(swap! stdout str %))
       (.on child "close"
            (fn [code]
              (resolve {:exit (if (number? code) code 1)
                        :stdout (str/trim @stdout)})))
       (.on child "error"
            (fn [error]
              (resolve {:exit 1
                        :stdout ""
                        :error (.-message error)})))))))
