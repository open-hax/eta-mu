(ns eta-mu.extern.console
  "Raw console boundary for eta-mu command orchestration.")

(defn error! [message]
  (js/console.error message))

(defn warn! [message]
  (js/console.warn message))
