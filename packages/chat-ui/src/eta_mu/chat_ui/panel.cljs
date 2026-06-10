(ns eta-mu.chat-ui.panel
  "ChatPanel — scrollable message list + composer."
  (:require [helix.core :as hx :refer [defnc $]]
            [helix.hooks :as hooks]
            [helix.dom :as d]
            [eta-mu.chat-ui.message :as message]
            [eta-mu.chat-ui.composer :as composer]))

(defnc ChatPanel [{:keys [messages is-sending on-send on-abort placeholder title]}]
  (let [scroll-ref (hooks/useRef nil)]
    ;; Auto-scroll on new messages
    (hooks/use-effect [messages]
      (when (.-current scroll-ref)
        (set! (.-scrollTop (.-current scroll-ref))
              (.-scrollHeight (.-current scroll-ref)))))

    (d/div {:style {:display "flex" :flex-direction "column" :height "100%" :background "var(--token-colors-background-surface)"}}

      ;; Header
      (when title
        (d/div {:style {:padding "10px 14px" :border-bottom "1px solid var(--token-colors-border-subtle)" :display "flex" :align-items "center" :justify-content "space-between"}}
          (d/span {:style {:font-size "13px" :font-weight "600" :color "var(--token-colors-text-default)"}} title)
          (when is-sending
            (d/button
              {:onClick on-abort
               :style {:background "var(--token-colors-badge-error-bg)" :color "var(--token-colors-badge-error-fg)" :border "none" :border-radius "4px" :padding "2px 8px" :font-size "11px" :cursor "pointer"}}
              "Abort"))))

      ;; Messages
      (d/div
        {:ref scroll-ref
         :style {:flex "1" :overflow-y "auto" :padding "12px"}}
        (if (empty? messages)
          (d/div {:style {:text-align "center" :color "var(--token-colors-text-muted)" :padding "40px 0" :font-size "13px"}}
            "No messages yet. Start a conversation.")
          (map-indexed
            (fn [i msg]
              ($ message/MessageBubble {:key (or (:id msg) (str i)) :message msg}))
            messages)))

      ;; Composer
      ($ composer/ChatComposer {:on-send on-send :disabled is-sending :placeholder placeholder}))))
