(ns open-hax.sol.domain.time)

(defn now-iso
  []
  (.toISOString (js/Date.)))
