(ns clio.lint-extern-boundary-test
  "The boundary gate must key on forms, not on text. Each fixture below is
   source held as a string, so this file itself stays boundary-clean while
   describing sources that are not."
  (:require [clio.lint-extern-boundary :as boundary]
            [clojure.test :refer [deftest is testing]]))

(defn- violations
  [source]
  (vec (boundary/source-violations source)))

(deftest documentation-mentioning-host-interop-is-not-a-violation
  (testing "a comment, docstring, or string literal performs no interop"
    (is (= [] (violations
               (str "(ns clio.law.example)\n"
                    ";; Documentation only: raw js/console access belongs in extern.\n"
                    "(defn note\n"
                    "  \"Avoid #js literals and js/globals outside extern.js.*.\"\n"
                    "  []\n"
                    "  \"js/console.log and #js {:a 1} are data here\")\n"))))))

(deftest host-interop-in-code-is-a-violation
  (testing "a symbol in the js namespace"
    (is (= ["js/ interop js/console.log"]
           (violations "(ns clio.law.example)\n(defn boom [] (js/console.log \"x\"))\n"))))

  (testing "a #js literal"
    (is (= ["#js literal"]
           (violations "(ns clio.law.example)\n(def opts #js {:recursive true})\n"))))

  (testing "the js* special form"
    (is (= ["js* interop"]
           (violations "(ns clio.law.example)\n(defn boom [] (js* \"1 + 1\"))\n"))))

  (testing "a string host require in the ns form"
    (is (= ["host require \"node:fs\""]
           (violations "(ns clio.law.example (:require [\"node:fs\" :as fs]))\n")))))

(deftest host-interop-inside-a-reader-conditional-is-a-violation
  (testing "both branches of a .cljc conditional are inspected"
    (is (= ["js/ interop js/Date.now"]
           (violations
            (str "(ns clio.law.example)\n"
                 "(defn now [] #?(:clj (System/currentTimeMillis) :cljs (js/Date.now)))\n"))))))

(deftest host-interop-in-metadata-is-a-violation
  (testing "a js-namespaced tag hint is still host interop"
    (is (= ["js/ interop js/Date"]
           (violations "(ns clio.law.example)\n(defn f [^js/Date d] d)\n")))))

(deftest a-nested-js-literal-is-found
  (testing "walking descends into collections and tagged-literal payloads"
    (is (= ["#js literal"]
           (violations
            "(ns clio.law.example)\n(def config {:a [1 {:b #js {:deep true}}]})\n")))))

(deftest extern-js-namespaces-are-exempt-by-path
  (is (boundary/extern-js-file?
       (java.io.File. "/tmp/clio/src/clio/extern/js/fs.cljs")))
  (is (not (boundary/extern-js-file?
            (java.io.File. "/tmp/clio/src/clio/law/event.cljc")))))
