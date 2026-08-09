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
         (error-code #(canonical/canonical-edn {:too-big 9007199254740992}))))
  (is (= :clio.canonical/non-portable-number
         (error-code #(canonical/canonical-edn {:nan ##NaN}))))
  (is (= :clio.canonical/non-portable-number
         (error-code #(canonical/canonical-edn {:inf ##Inf})))))

(deftest finite-real-numbers-are-portable
  ;; A valid event schema can permit :double data; canonical-edn must not
  ;; reject an ordinary decimal literal committed as event payload.
  (is (some? (canonical/canonical-edn {:amount 1.5})))
  (is (not= (canonical/canonical-edn {:amount 1.5})
            (canonical/canonical-edn {:amount 1}))))
