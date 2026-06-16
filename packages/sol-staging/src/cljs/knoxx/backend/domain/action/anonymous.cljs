(ns knoxx.backend.domain.action.anonymous
  "Delegates to the contract-runtime action anonymous module.
   Re-exports all public vars for backward compatibility."
  (:require [katamorph.action.anonymous :as core]))

(def compile-action-fn core/compile-action-fn)
