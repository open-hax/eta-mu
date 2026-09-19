(ns axxium.probes.async-guard
  "Intentional failing namespace; only the guard verification command selects it."
  (:require [cljs.test :refer [deftest is]]))

(deftest passing-control (is true))

(deftest ^:async rejection-before-assertion
  (throw (ex-info "async-guard-before-first-is" {})))
