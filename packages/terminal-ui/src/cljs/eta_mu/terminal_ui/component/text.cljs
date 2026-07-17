(ns eta-mu.terminal-ui.component.text
  "Text component — multi-line text with word wrapping and optional background."
  (:require [clojure.string]
            [eta-mu.terminal-ui.shape.text-utils :as tu]))

(defn text
  "Create a text component.
  opts — {:padding-x :padding-y :bg-fn}"
  ([content] (text content {}))
  ([content opts]
   (let [state (atom {:text content
                      :padding-x (:padding-x opts 1)
                      :padding-y (:padding-y opts 1)
                      :bg-fn (:bg-fn opts)
                      :cache nil})]
     {:render
      (fn [width]
        (let [{:keys [text padding-x padding-y bg-fn cache]} @state]
          (if (and cache (= (:w cache) width) (= (:t cache) text))
            (:lines cache)
            (let [normalized (clojure.string/replace text #"\t" "   ")
                  content-width (max 1 (- width (* 2 padding-x)))
                  wrapped (tu/wrap-text-with-ansi normalized content-width)
                  left-pad (apply str (repeat padding-x " "))
                  right-pad (apply str (repeat padding-x " "))
                  content-lines (mapv
                                 (fn [line]
                                   (let [padded (str left-pad line right-pad)]
                                     (if bg-fn
                                       (tu/apply-background-to-line padded width bg-fn)
                                       (let [vis (tu/visible-width padded)
                                             pad (apply str (repeat (max 0 (- width vis)) " "))]
                                         (str padded pad)))))
                                 wrapped)
                  empty-line (apply str (repeat width " "))
                  vpad (vec (repeat padding-y
                                    (if bg-fn
                                      (tu/apply-background-to-line empty-line width bg-fn)
                                      empty-line)))
                  result (vec (concat vpad content-lines vpad))
                  result (if (seq result) result [""])]
              (swap! state assoc :cache {:w width :t text :lines result})
              result))))
      :set-text
      (fn [t] (swap! state assoc :text t :cache nil))
      :set-bg-fn
      (fn [f] (swap! state assoc :bg-fn f :cache nil))
      :invalidate
      (fn [] (swap! state assoc :cache nil))})))
