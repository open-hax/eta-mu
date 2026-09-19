(ns axxium.extern.environment
  "Runtime environment boundary. Reads return strings or nil; integer parsing
   retains the legacy base-ten parseInt behavior, including NaN on invalid input.")

(defn read-env [key]
  (aget (.-env js/process) key))

(defn parse-integer [value]
  (js/parseInt value 10))
