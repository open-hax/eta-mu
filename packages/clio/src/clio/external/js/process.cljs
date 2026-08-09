(ns clio.external.js.process)

(defn argv
  []
  (vec (drop 2 (array-seq js/process.argv))))

(defn exit!
  [code]
  (.exit js/process code))
