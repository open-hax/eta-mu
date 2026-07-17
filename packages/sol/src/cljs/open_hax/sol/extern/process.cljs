(ns open-hax.sol.extern.process
  "Node process boundary. Direct js/process access is isolated here.")

(defn env-var
  "Return an environment variable's raw value, or nil when unset."
  [name]
  (let [value (and name (aget js/process.env name))]
    (when (string? value)
      value)))
