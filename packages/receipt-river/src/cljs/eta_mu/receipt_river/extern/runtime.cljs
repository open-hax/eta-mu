(ns eta-mu.receipt-river.extern.runtime
  "Raw process, console, and operating-system boundary for Receipt River."
  (:require ["node:os" :as os]))

(defn current-directory []
  (.cwd js/process))

(defn home-directory []
  (.homedir os))

(defn exit! [code]
  (.exit js/process code))

(defn error! [message]
  (js/console.error message))
