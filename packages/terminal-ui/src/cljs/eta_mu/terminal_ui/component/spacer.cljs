(ns eta-mu.terminal-ui.component.spacer
  "Spacer component — renders empty lines.")

(defn spacer
  "Create a spacer component. Returns a render function."
  ([lines]
   (let [lines (atom (or lines 1))]
     {:render (fn [_width] (vec (repeat @lines "")))
      :set-lines (fn [n] (reset! lines n))}))
  ([] (spacer 1)))
