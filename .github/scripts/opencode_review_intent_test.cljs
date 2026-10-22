;; SPDX-License-Identifier: GPL-3.0-or-later
(ns opencode-review-intent-test
  "Causal contract for the Clio-backed publication-intent adapter.
  Fixtures in this suite are inert and never establish source custody."
  (:require [cljs.test :as test :refer [deftest is testing]]
            [nbb.core :as nbb]
            [clojure.string :as str]
            ["node:fs" :as fs]))

(defn- resolve-api [namespace symbol-name]
  (resolve (symbol namespace symbol-name)))

(defn- load-source-if-present [path]
  (when (.existsSync fs path)
    (nbb/await (nbb/load-file path))))

(deftest portable-intent-api-is-present
  (doseq [[namespace symbol-name]
          [["eta-mu.law.review-intent" "intent-event?"]
           ["eta-mu.shape.review-intent" "lock-stream"]
           ["eta-mu.domain.review-intent" "replay"]
           ["eta-mu.domain.review-intent" "transition"]
           ["eta-mu.infra.review-intent" "transition!"]]]
    (testing (str namespace "/" symbol-name)
      (is (fn? (resolve-api namespace symbol-name))
          "The publisher intent component is currently missing."))))

(load-source-if-present "packages/eta-mu/src/cljs/eta_mu/law/review_intent.cljc")
(load-source-if-present "packages/eta-mu/src/cljs/eta_mu/shape/review_intent.cljc")
(load-source-if-present "packages/eta-mu/src/cljs/eta_mu/domain/review_intent.cljc")
(load-source-if-present "packages/eta-mu/src/cljs/eta_mu/extern/review_intent.cljs")
(load-source-if-present "packages/eta-mu/src/cljs/eta_mu/infra/review_intent.cljs")

(when (= nbb/*file* (nbb/invoked-file))
  (test/run-tests 'opencode-review-intent-test))
