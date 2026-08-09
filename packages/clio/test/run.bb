#!/usr/bin/env bb

(require '[clojure.test :as test]
         '[clio.shape.canonical-test])

(let [{:keys [fail error]} (test/run-tests 'clio.shape.canonical-test)]
  (when (pos? (+ fail error))
    (System/exit 1)))