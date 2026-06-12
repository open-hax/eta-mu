(ns eta-mu.kanban.ui.sidebar
  "Task detail sidebar with chat panel."
  (:require [helix.core :as hx :refer [defnc $]]
            [helix.hooks :as hooks]
            [helix.dom :as d]
            ["marked" :refer [marked]]
            [eta-mu.chat-ui.panel :as chat-panel]
            [eta-mu.chat-ui.protocol :as chat-protocol]))

;; ---------------------------------------------------------------------------
;; Mock session (no backend yet)
;; ---------------------------------------------------------------------------

(defn- create-mock-session [task]
  (let [listeners (atom [])]
    (reify chat-protocol/IChatSession
      (send-message [_ text]
        (js/Promise.
         (fn [resolve _reject]
           (let [task-title (get task "title" "unknown task")]
             (js/setTimeout
              (fn []
                (let [response {:type "token" :text (str "I see you're asking about \"" task-title "\". I'm a mock assistant — connect a real backend (knoxx/sol) for actual responses.") :id "mock"}]
                  (doseq [f @listeners] (f response)))
                (doseq [f @listeners] (f {:type "done"}))
                (resolve {:ok true}))
              500)))))
      (subscribe [_ callback]
        (swap! listeners conj callback)
        (fn [] (swap! listeners (fn [ls] (filterv #(not= % callback) ls)))))
      (abort [_])
      (history [_] (js/Promise.resolve []))
      (close [_] (reset! listeners [])))))

;; ---------------------------------------------------------------------------
;; Frontmatter fields
;; ---------------------------------------------------------------------------

(def frontmatter-keys ["uuid" "title" "status" "priority" "labels" "created_at" "source" "points" "category"])

(defnc frontmatter-section [{:keys [frontmatter]}]
  (d/div {:style {:padding "12px 16px" :border-bottom "1px solid var(--token-colors-border-subtle)"}}
    (d/div {:style {:font-size "11px" :font-weight "700" :color "var(--token-colors-text-muted)" :text-transform "uppercase" :letter-spacing "0.05em" :margin-bottom "8px"}}
      "Frontmatter")
    (d/div {:style {:display "flex" :flex-direction "column" :gap "6px"}}
      (map-indexed
        (fn [_ key]
          (when (and (get frontmatter key) (not= (get frontmatter key) ""))
            (d/div {:key key :style {:display "flex" :align-items "flex-start" :gap "8px"}}
              (d/div {:style {:width "80px" :flex-shrink "0"}}
                (d/div {:style {:font-size "11px" :font-weight "600" :color "var(--token-colors-text-muted)"}} key))
              (d/div {:style {:flex "1" :min-width "0"}}
                (d/div {:style {:font-size "12px" :color "var(--token-colors-text-default)" :word-break "break-word"}}
                  (str (get frontmatter key)))))))
        frontmatter-keys))
    (d/div {:style {:margin-top "8px" :font-size "11px" :color "var(--token-colors-text-muted)"}}
      "Double-click a field to edit")))

;; ---------------------------------------------------------------------------
;; Sidebar component
;; ---------------------------------------------------------------------------

(defnc task-sidebar [{:keys [task detail on-close]}]
  (let [task-uuid (get task "uuid")
        session (hooks/use-memo [task-uuid] (create-mock-session task))
        chat-state (chat-protocol/use-chat-session session)]
    (d/div {:style {:width "380px" :min-width "380px" :border-left "1px solid var(--token-colors-border-default)" :background "var(--token-colors-background-surface)" :overflow-y "auto" :display "flex" :flex-direction "column"}}

      ;; Header
      (d/div {:style {:display "flex" :align-items "center" :justify-content "space-between" :padding "12px 16px" :border-bottom "1px solid var(--token-colors-border-subtle)"}}
        (d/div {:style {:display "flex" :align-items "center" :gap "8px"}}
          (d/span {:style {:background "var(--token-colors-badge-default-bg)" :color "var(--token-colors-badge-default-fg)" :font-size "10px" :font-weight "600" :padding "2px 6px" :border-radius "3px"}}
            (get task "priority"))
          (d/span {:style {:font-size "11px" :color "var(--token-colors-text-muted)"}}
            (get task "status")))
        (d/button
          {:onClick on-close
           :style {:background "none" :border "none" :color "var(--token-colors-text-muted)" :cursor "pointer" :font-size "16px" :padding "4px"}}
          "×"))

      ;; Title
      (d/div {:style {:padding "12px 16px" :border-bottom "1px solid var(--token-colors-border-subtle)"}}
        (d/h2 {:style {:font-size "15px" :font-weight "600" :margin "0 0 6px" :line-height "1.35"}}
          (get task "title"))
        (d/div {:style {:font-size "11px" :color "var(--token-colors-text-muted)"}}
          (get task "uuid")))

      ;; Labels
      (when (seq (get task "labels"))
        (d/div {:style {:padding "8px 16px" :border-bottom "1px solid var(--token-colors-border-subtle)" :display "flex" :flex-wrap "wrap" :gap "4px"}}
          (map-indexed
            (fn [i label]
              (d/span {:key (str label "-" i) :style {:font-size "11px" :color "var(--token-colors-text-muted)" :background "var(--token-colors-background-default)" :padding "2px 6px" :border-radius "3px"}}
                label))
            (get task "labels"))))

      ;; Source
      (when (get task "sourcePath")
        (d/div {:style {:padding "8px 16px" :border-bottom "1px solid var(--token-colors-border-subtle)" :font-size "11px" :color "var(--token-colors-text-muted)" :word-break "break-all"}}
          (get task "sourcePath")))

      ;; Content
      (if detail
        (d/div {:style {:flex "1" :overflow-y "auto"}}
          ;; Frontmatter
          (when (seq (get detail "frontmatter"))
            ($ frontmatter-section {:frontmatter (get detail "frontmatter")}))
          ;; Body sections
          (map-indexed
            (fn [i section]
              (when (= (get section "type") "body")
                (d/div {:key (str "body-" i) :class "markdownPreview" :style {:padding "12px 16px" :border-bottom "1px solid var(--token-colors-border-subtle)"}}
                  (d/div {:dangerouslySetInnerHTML #js {:__html (marked (get section "content" ""))}}))))
            (get detail "sections"))
          ;; Comment sections
          (when (some #(= (get % "type") "comment") (get detail "sections"))
            (d/div {:style {:padding "12px 16px" :border-bottom "1px solid var(--token-colors-border-subtle)"}}
              (d/div {:style {:font-size "11px" :font-weight "700" :color "var(--token-colors-text-muted)" :text-transform "uppercase" :letter-spacing "0.05em" :margin-bottom "8px"}}
                "Comments")
              (map-indexed
                (fn [i section]
                  (when (= (get section "type") "comment")
                    (d/div {:key (str "comment-" i) :style {:background "var(--token-colors-background-surface)" :border "1px solid var(--token-colors-border-subtle)" :border-left "3px solid var(--token-colors-text-accent)" :border-radius "6px" :padding "8px 12px" :margin-bottom "8px" :font-size "13px" :line-height "1.6" :color "var(--token-colors-text-soft)" :white-space "pre-wrap"}}
                      (get section "content"))))
                (get detail "sections")))))
        (d/div {:style {:flex "1" :padding "12px 16px"}}
          (d/div {:style {:color "var(--token-colors-text-muted)" :font-size "12px"}}
            "Loading...")))

      ;; Chat panel
      (d/div {:style {:border-top "1px solid var(--token-colors-border-subtle)" :height "300px" :min-height "300px"}}
        ($ chat-panel/ChatPanel
          {:messages (:messages chat-state)
           :is-sending (:is-sending chat-state)
           :on-send (:send chat-state)
           :on-abort (:abort chat-state)
           :placeholder (str "Ask about \"" (get task "title") "\"...")
           :title "Chat"})))))
