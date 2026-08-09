(ns clio.shape.canonical-test
  (:require [clio.shape.canonical :as canonical]
            #?(:clj [clojure.test :refer [deftest is]]
               :cljs [cljs.test :refer [deftest is]])))

(defn error-code
  [f]
  (try
    (f)
    nil
    (catch #?(:clj Exception :cljs :default) cause
      (:clio/error (ex-data cause)))))

(deftest maps-and-sets-ignore-iteration-order
  (is (= (canonical/canonical-edn {:b #{3 2} :a 1})
         (canonical/canonical-edn {:a 1 :b #{2 3}}))))

(deftest equal-sequential-collections-share-one-preimage
  (is (= (canonical/canonical-edn [1 2 3])
         (canonical/canonical-edn '(1 2 3)))))

(deftest nonportable-numbers-are-refused
  (is (= :clio.canonical/non-portable-number
         (error-code #(canonical/canonical-edn {:ratio 0.1})))))
