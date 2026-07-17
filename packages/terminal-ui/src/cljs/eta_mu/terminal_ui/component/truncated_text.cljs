(ns eta-mu.terminal-ui.component.truncated-text
  "TruncatedText component — single-line text that truncates with ellipsis."
  (:require [eta-mu.terminal-ui.shape.text-utils :as tu]))

(defn truncated-text
  "Create a truncated-text component."
  ([content] (truncated-text content {}))
  ([content opts]
   (let [state (atom {:text content
                      :padding-x (:padding-x opts 0)
                      :padding-y (:padding-y opts 0)})]
     {:render
      (fn [width]
        (let [{:keys [text padding-x padding-y]} @state
              empty-line (apply str (repeat width " "))
              vpad (vec (repeat padding-y empty-line))
              available (max 1 (- width (* 2 padding-x)))
              single-line (let [nl (.indexOf text "\n")]
                            (if (>= nl 0) (.substring text 0 nl) text))
              display (tu/truncate-to-width single-line available)
              left-pad (apply str (repeat padding-x " "))
              right-pad (apply str (repeat padding-x " "))
              line (str left-pad display right-pad)
              vis (tu/visible-width line)
              pad (apply str (repeat (max 0 (- width vis)) " "))]
          (vec (concat vpad [(str line pad)] vpad))))
      :set-text (fn [t] (swap! state assoc :text t))})))
