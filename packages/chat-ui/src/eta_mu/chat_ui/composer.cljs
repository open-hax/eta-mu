(ns eta-mu.chat-ui.composer
  "ChatComposer — input field with send button."
  (:require [helix.core :as hx :refer [defnc $]]
            [helix.hooks :as hooks]
            [helix.dom :as d]))

(defnc ChatComposer [{:keys [on-send disabled placeholder]}]
  (let [[text set-text] (hooks/use-state "")
        handle-send (fn []
                      (when (and (seq text) (not disabled))
                        (on-send text)
                        (set-text "")))
        handle-key-down (fn [e]
                          (when (and (= "Enter" (.-key e)) (not (.-shiftKey e)))
                            (.preventDefault e)
                            (handle-send)))]
    (d/div {:style {:display "flex" :gap "8px" :padding "12px" :border-top "1px solid var(--token-colors-border-subtle)"}}
      (d/textarea
        {:value text
         :onChange #(set-text (.. % -target -value))
         :onKeyDown handle-key-down
         :placeholder (or placeholder "Type a message...")
         :disabled disabled
         :rows 1
         :style {:flex "1"
                 :background "var(--token-colors-background-default)"
                 :color "var(--token-colors-text-default)"
                 :border "1px solid var(--token-colors-border-default)"
                 :border-radius "8px"
                 :padding "8px 12px"
                 :font-size "13px"
                 :resize "none"
                 :outline "none"}})
      (d/button
        {:onClick handle-send
         :disabled (or (empty? text) disabled)
         :style {:background (if (or (empty? text) disabled)
                               "var(--token-colors-button-secondary-bg)"
                               "var(--token-colors-button-secondary-bg)")
                 :color "var(--token-colors-button-secondary-fg)"
                 :border "none"
                 :border-radius "8px"
                 :padding "8px 16px"
                 :font-size "13px"
                 :font-weight "600"
                 :cursor (if (or (empty? text) disabled) "not-allowed" "pointer")
                 :opacity (if (or (empty? text) disabled) "0.5" "1")}}
        "Send"))))
