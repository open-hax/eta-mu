;; infra/defaults.cljs
(ns open-hax.sol.infra.defaults
  "Default runtime values.")

(defn default-model
  "Return the default model id for the current config."
  [config]
  (or (:proxx-default-model config)
      "gemma4:31b"))
