(ns eta-mu.chat-ui.message
  "MessageBubble — renders a single chat message with markdown."
  (:require [helix.core :refer [defnc]]
            [helix.dom :as d]
            ["marked" :refer [marked]]))

(defnc MessageBubble [{:keys [message]}]
  (let [is-user (= "user" (:role message))]
    (d/div
      {:style {:display "flex"
               :justify-content (if is-user "flex-end" "flex-start")
               :margin-bottom "8px"}}
      (d/div
        {:style {:max-width "80%"
                 :background (if is-user
                               "var(--token-colors-button-secondary-bg)"
                               "var(--token-colors-background-elevated)")
                 :color "var(--token-colors-text-default)"
                 :border-radius "12px"
                 :padding "10px 14px"
                 :font-size "13px"
                 :line-height "1.5"
                 :white-space "pre-wrap"
                 :word-break "break-word"}}
        (when-not is-user
          (d/div {:style {:font-size "10px" :color "var(--token-colors-text-muted)" :margin-bottom "4px"}}
            "assistant"))
        (d/div {:dangerouslySetInnerHTML #js {:__html (marked (or (:content message) ""))}})))))
