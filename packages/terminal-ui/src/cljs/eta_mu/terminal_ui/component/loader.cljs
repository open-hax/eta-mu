(ns eta-mu.terminal-ui.component.loader
  "Loader component — animated spinner with message."
  (:require [eta-mu.terminal-ui.component.text :as text-comp]))

(def ^:private default-frames
  ["⠋" "⠙" "⠹" "⠸" "⠼" "⠴" "⠦" "⠧" "⠇" "⠏"])

(defn loader
  "Create a loader component with spinning animation."
  ([message] (loader message {}))
  ([message opts]
   (let [frames (atom (or (:frames opts) (vec default-frames)))
         interval-ms (atom (or (:interval-ms opts) 80))
         frame-idx (atom 0)
         timer (atom nil)
         spinner-fn (atom (:spinner-color-fn opts identity))
         msg-fn (atom (:message-color-fn opts identity))
         msg (atom message)
         inner (text-comp/text "")
         update-display (fn []
                          (let [frame (nth @frames @frame-idx "")
                                indicator (if (> (count frame) 0)
                                            (str (@spinner-fn frame) " ") "")]
                            ((:set-text inner) (str indicator (@msg-fn @msg)))))]
     {:render (:render inner)
      :start (fn []
               (update-display)
               (when (> (count @frames) 1)
                 (reset! timer
                         (js/setInterval
                          (fn []
                            (swap! frame-idx #(mod (inc %) (count @frames)))
                            (update-display))
                          @interval-ms))))
      :stop (fn []
              (when @timer
                (js/clearInterval @timer)
                (reset! timer nil)))
      :set-message (fn [m]
                     (reset! msg m)
                     (update-display))
      :set-indicator (fn [indicator-opts]
                       (when indicator-opts
                         (when-let [f (:frames indicator-opts)]
                           (reset! frames (vec f)))
                         (when-let [i (:interval-ms indicator-opts)]
                           (when (pos? i) (reset! interval-ms i))))
                       (reset! frame-idx 0))
      :set-spinner-color (fn [f]
                           (reset! spinner-fn f)
                           (update-display))
      :set-message-color (fn [f]
                           (reset! msg-fn f)
                           (update-display))
      :dispose (fn []
                 (when @timer
                   (js/clearInterval @timer)
                   (reset! timer nil)))})))
