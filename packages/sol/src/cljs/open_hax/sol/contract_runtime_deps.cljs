(ns open-hax.sol.contract-runtime-deps
  "Wires Sol-specific implementations into the contract-runtime dependency
   injection system. Stripped down to a minimal no-op dependency map for Sol.")

(defn build-deps
  "Build the minimal :contract-runtime/deps map."
  []
  {})

(defn inject-deps!
  "Inject contract-runtime dependencies into the runtime config."
  [config]
  (assoc config :contract-runtime/deps (build-deps)))
