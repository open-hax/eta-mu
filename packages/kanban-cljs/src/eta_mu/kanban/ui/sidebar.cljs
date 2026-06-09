(ns eta-mu.kanban.ui.sidebar
  "Task detail sidebar."
  (:require [helix.core :as hx :refer [defnc $]]
            [helix.dom :as d]))

(defnc task-sidebar [{:keys [task detail on-close]}]
  (d/div {:style {:width "380px" :min-width "380px" :border-left "1px solid var(--token-colors-border-default)" :background "var(--token-colors-background-surface)" :overflow-y "auto" :display "flex" :flex-direction "column"}}

    ;; Header
    (d/div {:style {:display "flex" :align-items "center" :justify-content "space-between" :padding "12px 16px" :border-bottom "1px solid var(--token-colors-border-subtle)"}}
      (d/div {:style {:display "flex" :align-items "center" :gap "8px"}}
        (d/span {:style {:background "var(--token-colors-badge-default-bg)" :color "var(--token-colors-badge-default-fg)" :font-size "10px" :font-weight "600" :padding "2px 6px" :border-radius "3px"}}
          (:priority task))
        (d/span {:style {:font-size "11px" :color "var(--token-colors-text-muted)"}}
          (:status task)))
      (d/button
        {:onClick on-close
         :style {:background "none" :border "none" :color "var(--token-colors-text-muted)" :cursor "pointer" :font-size "16px" :padding "4px"}}
        "×"))

    ;; Title
    (d/div {:style {:padding "12px 16px" :border-bottom "1px solid var(--token-colors-border-subtle)"}}
      (d/h2 {:style {:font-size "15px" :font-weight "600" :margin "0 0 6px" :line-height "1.35"}}
        (:title task))
      (d/div {:style {:font-size "11px" :color "var(--token-colors-text-muted)"}}
        (:uuid task)))

    ;; Labels
    (when (seq (:labels task))
      (d/div {:style {:padding "8px 16px" :border-bottom "1px solid var(--token-colors-border-subtle)" :display "flex" :flex-wrap "wrap" :gap "4px"}}
        (for [label (:labels task)]
          (d/span {:key label :style {:font-size "11px" :color "var(--token-colors-text-muted)" :background "var(--token-colors-background-default)" :padding "2px 6px" :border-radius "3px"}}
            label))))

    ;; Source
    (when (:sourcePath task)
      (d/div {:style {:padding "8px 16px" :border-bottom "1px solid var(--token-colors-border-subtle)" :font-size "11px" :color "var(--token-colors-text-muted)" :word-break "break-all"}}
        (:sourcePath task)))

    ;; Body
    (d/div {:style {:flex "1" :padding "12px 16px" :overflow-y "auto"}}
      (if detail
        (d/div {:class "md" :dangerouslySetInnerHTML {:__html (js/marked (or (:content detail) ""))}})
        (d/div {:style {:color "var(--token-colors-text-muted)" :font-size "12px"}}
          "Loading...")))))
