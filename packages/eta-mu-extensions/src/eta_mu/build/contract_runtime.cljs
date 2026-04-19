(ns eta-mu.build.contract-runtime
  (:require [eta-mu.extensions.contract-runtime]))

(def ^:export init eta-mu.extensions.contract-runtime/contract-runtime)
