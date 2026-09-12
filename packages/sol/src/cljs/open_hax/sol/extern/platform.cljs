(ns open-hax.sol.extern.platform
  "Node platform identity used for explicit persistence capability selection.")

(defn current
  "Return Node's declared platform without probing or weakening filesystem durability."
  []
  (.-platform js/process))
