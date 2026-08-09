(ns clio.shape.edn-test
  (:require [clio.shape.edn :as edn]
            #?(:clj [clojure.test :refer [deftest is]]
               :cljs [cljs.test :refer [deftest is]])))

(defn error-code
  [f]
  (try
    (f)
    nil
    (catch #?(:clj Exception :cljs :default) cause
      (:clio/error (ex-data cause)))))

(deftest reads-exactly-one-form
  (is (= {:a 1} (edn/read-one "{:a 1}")))
  (is (= :clio.edn/expected-one-form
         (error-code #(edn/read-one "{:a 1} {:b 2}"))))
  (is (= :clio.edn/expected-one-form
         (error-code #(edn/read-one "")))))

(deftest a-stray-delimiter-cannot-smuggle-trailing-content
  ;; A synthetic `[ ... ]` wrapper around raw text is unsound: an unescaped
  ;; `]` inside malformed input closes the wrapper early, and a reader that
  ;; only checks "did I get exactly one form back" never sees what follows.
  (is (= :clio.edn/expected-one-form
         (error-code #(edn/read-one "{:a 1}] ignored")))))
