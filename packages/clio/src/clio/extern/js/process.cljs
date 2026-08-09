(ns clio.extern.js.process)

(defn exit!
  [code]
  (.exit js/process code))
