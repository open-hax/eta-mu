(ns rheos.backend.domain.transition-test
  (:require [cljs.test :refer [deftest is]]
            [rheos.backend.domain.transition :as transition]))

(deftest current-counts-tallies-by-status
  (is (= {"todo" 2 "done" 1 "review" 1}
         (transition/current-counts
          [{:status "todo"} {:status "todo"} {:status "done"} {:status "review"}]))))

(deftest current-counts-empty
  (is (= {} (transition/current-counts []))))
