(ns open-hax.sol.domain.agent.reasoning
  "Delegates to the contract-runtime agent reasoning module.
   Re-exports all public vars for backward compatibility."
  (:require [katamorph.agent.reasoning :as core]))

(def split-think-tags core/split-think-tags)
(def route-think-delta core/route-think-delta)
