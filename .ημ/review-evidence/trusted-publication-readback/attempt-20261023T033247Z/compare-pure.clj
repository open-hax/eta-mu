(require '[clojure.edn :as edn])
(let [[a-file b-file] *command-line-args*
      a (edn/read-string (slurp a-file)) b (edn/read-string (slurp b-file))]
  (assert (= a b) "NBB and Babashka must return equal actual portable values")
  (println "PASS equal actual portable values:" (count a)))
