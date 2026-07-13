(ns eta-mu.terminal-ui.component.box
  "Box component — container with padding and background."
  (:require [eta-mu.terminal-ui.shape.text-utils :as tu]))

(defn box
  "Create a box component. Children are components with :render functions."
  ([opts]
   (let [state (atom {:children []
                      :padding-x (:padding-x opts 1)
                      :padding-y (:padding-y opts 1)
                      :bg-fn (:bg-fn opts)
                      :cache nil})]
     {:add-child
      (fn [child]
        (swap! state update :children conj child)
        (swap! state assoc :cache nil))
      :remove-child
      (fn [child]
        (swap! state update :children #(vec (remove (fn [c] (= c child)) %)))
        (swap! state assoc :cache nil))
      :clear
      (fn []
        (swap! state assoc :children [] :cache nil))
      :set-bg-fn
      (fn [f]
        (swap! state assoc :bg-fn f :cache nil))
      :render
      (fn [width]
        (let [{:keys [children padding-x padding-y bg-fn cache]} @state]
          (if (and cache (= (:w cache) width))
            (:lines cache)
            (if (empty? children)
              []
              (let [content-width (max 1 (- width (* 2 padding-x)))
                    left-pad (apply str (repeat padding-x " "))
                    child-lines (into []
                                      (mapcat (fn [child] ((:render child) content-width)))
                                      children)
                    child-lines (mapv #(str left-pad %) child-lines)
                    apply-bg (fn [line]
                               (let [vis (tu/visible-width line)
                                     pad (apply str (repeat (max 0 (- width vis)) " "))]
                                 (if bg-fn
                                   (tu/apply-background-to-line (str line pad) width bg-fn)
                                   (str line pad))))
                    vpad (vec (repeat padding-y (apply-bg "")))
                    result (vec (concat vpad (mapv apply-bg child-lines) vpad))]
                (swap! state assoc :cache {:w width :lines result})
                result)))))})))
