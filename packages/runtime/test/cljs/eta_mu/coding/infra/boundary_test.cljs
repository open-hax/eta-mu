(ns eta-mu.coding.infra.boundary-test
  (:require [cljs.test :refer [deftest is]]
            [eta-mu.coding.infra.boundary :as boundary]))

(deftest coding-boundary-inventory-test
  (let [{:keys [implemented planned]} (boundary/boundary-inventory)]
    (is (some #(= :fs (:boundary %)) implemented))
    (is (some #(= :git (:boundary %)) implemented))
    (is (some #(= :process-exec (:boundary %)) implemented))
    (is (some #(= :lockfile (:boundary %)) implemented))
    (is (empty? planned))))
