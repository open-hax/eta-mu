(ns rheos.ui.domain.orchestrator
  "Board-scoped chat orchestrator — a standalone, collapsible left panel decoupled
   from task selection. You talk to it about the whole board; it acts on the board
   and its mutations flow back into the UI via the ledger SSE stream (Slice 1). The
   agent is just another actor on the wire. Backed by a mock IChatSession until the
   real knoxx session lands (Slice 4); the board tools land in Slice 3."
  (:require [helix.core :as hx :refer [defnc $]]
            [helix.hooks :as hooks]
            [helix.dom :as d]
            [eta-mu.chat-ui.panel :as chat-panel]
            [eta-mu.chat-ui.protocol :as chat-protocol]
            [rheos.ui.infra.chat-session :as chat-session]))

(defnc orchestrator-panel [{:keys [collapsed on-toggle]}]
  (let [session (hooks/use-memo [] (chat-session/create-session))
        chat-state (chat-protocol/use-chat-session session)]
    (if collapsed
      ;; Collapsed rail (the layout sizes the slot to ~44px)
      (d/div {:style {:width "100%" :height "100%"
                      :border-right "1px solid var(--token-colors-border-default)"
                      :background "var(--token-colors-background-surface)"
                      :display "flex" :flex-direction "column" :align-items "center" :padding-top "10px"}}
        (d/button {:onClick on-toggle :title "Open orchestrator"
                   :style {:padding "6px 8px" :border-radius "6px" :cursor "pointer"
                           :border "1px solid var(--token-colors-border-default)"
                           :background "var(--token-colors-button-secondary-bg)"
                           :color "var(--token-colors-button-secondary-fg)" :font-size "14px"}}
          "💬"))
      ;; Expanded panel — fills the flex slot the layout gives it
      (d/div {:style {:width "100%" :height "100%"
                      :border-right "1px solid var(--token-colors-border-default)"
                      :background "var(--token-colors-background-surface)"
                      :display "flex" :flex-direction "column" :overflow "hidden"}}
        (d/div {:style {:display "flex" :align-items "center" :justify-content "space-between"
                        :padding "10px 14px" :border-bottom "1px solid var(--token-colors-border-subtle)" :flex-shrink "0"}}
          (d/span {:style {:font-size "13px" :font-weight "600" :color "var(--token-colors-text-default)"}}
            "Orchestrator")
          (d/button {:onClick on-toggle :title "Collapse"
                     :style {:padding "4px 8px" :border-radius "6px" :cursor "pointer"
                             :border "1px solid var(--token-colors-border-default)"
                             :background "var(--token-colors-button-ghost-bg)"
                             :color "var(--token-colors-button-ghost-fg)" :font-size "12px"}}
            "‹"))
        (d/div {:style {:flex "1" :min-height "0"}}
          ($ chat-panel/ChatPanel
            {:messages (:messages chat-state)
             :is-sending (:is-sending chat-state)
             :on-send (:send chat-state)
             :on-abort (:abort chat-state)
             :placeholder "Ask the orchestrator to work the board…"}))))))
