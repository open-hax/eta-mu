(ns rheos.ui.domain.orchestrator
  "Board-scoped chat orchestrator — a standalone, collapsible left panel decoupled
   from task selection. You talk to it about the whole board; it acts on the board
   and its mutations flow back into the UI via the ledger SSE stream (Slice 1). The
   agent is just another actor on the wire. Backend is selected via the `backend`
   prop (knoxx | mock | rheos); the default Rheos proxy keeps the knoxx API key on
   the server."
  (:require [helix.core :as hx :refer [defnc $]]
            [helix.hooks :as hooks]
            [helix.dom :as d]
   [eta-mu.chat-ui.knoxx-session :as knoxx]
   [eta-mu.chat-ui.mock-session :as mock]
   [eta-mu.chat-ui.opencode-session :as opencode]
   [eta-mu.chat-ui.panel :as chat-panel]
            [eta-mu.chat-ui.protocol :as chat-protocol]
            [eta-mu.chat-ui.sol-session :as sol]
            [rheos.ui.infra.chat-session :as rheos-chat]))

(defn- default-knoxx-base-url []
  (or (when (exists? js/window)
        (some-> js/window .-location .-origin))
      "http://127.0.0.1:8000"))

(defn- default-sol-base-url []
  (or (when (exists? js/window)
        (some-> js/window .-location .-origin))
      "http://127.0.0.1:8001"))

(defn- default-opencode-base-url []
  (or (when (exists? js/window)
        (some-> js/window .-location .-origin))
      "http://127.0.0.1:8001"))

(defn- create-session
  "Create an IChatSession for the orchestrator panel.
   backend: knoxx | sol | opencode | mock | rheos (default).
   chat-config: optional map passed to the backend session (base-url, api-key, agent-id, model)."
  [backend chat-config]
  (case backend
    "knoxx" (knoxx/create-knoxx-session (merge {:base-url (default-knoxx-base-url)
                                                 :chat-path "/api/knoxx/chat"}
                                                chat-config))
    "sol" (sol/create-sol-session (merge {:base-url (default-sol-base-url)
                                          :prefix "/api/agent"}
                                         chat-config))
    "opencode" (opencode/create-opencode-session (merge {:base-url (default-opencode-base-url)}
                                                         chat-config))
    "mock" (mock/create-mock-session)
    (rheos-chat/create-session)))

(defnc orchestrator-panel [{:keys [collapsed on-toggle backend chat-config]}]
  (let [session (hooks/use-memo [backend chat-config]
                  (create-session (or backend "rheos") chat-config))
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
