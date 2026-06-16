(ns eta-mu.chat-ui.core
  "Standalone test entry for the chat-ui package."
  (:require [helix.core :refer [defnc $]]
            [helix.hooks :as hooks]
            [helix.dom :as d]
            ["react-dom/client" :refer [createRoot]]
            [eta-mu.chat-ui.panel :as panel]
            [eta-mu.chat-ui.protocol :as proto]
            [eta-mu.chat-ui.sol-session :as sol]
            [eta-mu.chat-ui.knoxx-session :as knoxx]
            [eta-mu.chat-ui.mock-session :as mock]))

(defnc App []
  (let [[backend set-backend] (hooks/use-state "mock")
        [base-url set-base-url] (hooks/use-state "http://127.0.0.1:8001")
        [model set-model] (hooks/use-state "proxx")
        [session set-session] (hooks/use-state nil)
        [error set-error] (hooks/use-state nil)
        chat (proto/use-chat-session session)]
    (hooks/use-effect [session]
      (fn []
        (when session
          (set-error nil))))
    (hooks/use-effect [session]
      (fn []
        (when session
          (proto/close session))))
    (d/div {:style {:height "100vh" :display "flex" :flex-direction "column"}}
      (d/div {:style {:padding "10px"
                      :border-bottom "1px solid var(--token-colors-border-subtle)"
                      :display "flex"
                      :gap "8px"
                      :align-items "center"
                      :flex-wrap "wrap"}}
        (d/select {:value backend
                   :onChange #(set-backend (.. % -target -value))
                   :style {:background "var(--token-colors-background-default)"
                           :color "var(--token-colors-text-default)"
                           :border "1px solid var(--token-colors-border-default)"
                           :border-radius "8px"
                           :padding "8px 12px"
                           :font-size "13px"}}
           (d/option {:value "mock"} "Mock")
           (d/option {:value "sol"} "Sol")
           (d/option {:value "knoxx"} "Knoxx"))
        (d/input {:value base-url
                  :onChange #(set-base-url (.. % -target -value))
                  :placeholder "Backend base URL"
                  :disabled (= backend "mock")
                  :style {:flex "1"
                          :min-width "200px"
                          :background "var(--token-colors-background-default)"
                          :color "var(--token-colors-text-default)"
                          :border "1px solid var(--token-colors-border-default)"
                          :border-radius "8px"
                          :padding "8px 12px"
                          :font-size "13px"}})
        (d/input {:value model
                  :onChange #(set-model (.. % -target -value))
                  :placeholder "model"
                  :disabled (= backend "mock")
                  :style {:width "120px"
                          :background "var(--token-colors-background-default)"
                          :color "var(--token-colors-text-default)"
                          :border "1px solid var(--token-colors-border-default)"
                          :border-radius "8px"
                          :padding "8px 12px"
                          :font-size "13px"}})
        (d/button {:onClick (fn []
                              (when session (proto/close session))
                              (set-error nil)
                              (try
                                (set-session (case backend
                                               "sol" (sol/create-sol-session {:base-url base-url
                                                                              :model (when (seq model) model)})
                                               "knoxx" (knoxx/create-knoxx-session {:base-url base-url
                                                                                    :model (when (seq model) model)})
                                               (mock/create-mock-session)))
                                (catch :default e
                                  (set-error (str "Failed to connect: " (.-message e))))))
                   :style {:background "var(--token-colors-button-secondary-bg)"
                           :color "var(--token-colors-button-secondary-fg)"
                           :border "none"
                           :border-radius "8px"
                           :padding "8px 16px"
                           :font-size "13px"
                           :font-weight "600"
                           :cursor "pointer"}}
           "Connect"))
       (when error
         (d/div {:style {:padding "8px 12px"
                         :color "var(--token-colors-text-error)"
                         :border-bottom "1px solid var(--token-colors-border-subtle)"
                         :font-size "13px"}}
           error))
       ($ panel/ChatPanel {:messages (:messages chat)
                          :is-sending (:is-sending chat)
                          :on-send (:send chat)
                          :on-abort (:abort chat)
                          :title (str "chat-ui → " (case backend
                                                     "sol" base-url
                                                     "knoxx" base-url
                                                     "Mock"))}))))

(defn init []
  (if-let [el (.getElementById js/document "root")]
    (let [root (createRoot el)]
      (.render root ($ App)))
    (throw (js/Error. "chat-ui.core/init: #root element not found"))))
