(ns eta-mu.kanban.ui.board
  "Board view — columns and task cards."
  (:require [helix.core :as hx :refer [defnc $ <>]]
            [helix.dom :as d]))

(defn- priority-color [p]
  (case p
    "P0" {:bg "var(--token-colors-badge-error-bg)" :fg "var(--token-colors-badge-error-fg)"}
    "P1" {:bg "var(--token-colors-badge-warning-bg)" :fg "var(--token-colors-badge-warning-fg)"}
    "P2" {:bg "var(--token-colors-badge-info-bg)" :fg "var(--token-colors-badge-info-fg)"}
    {:bg "var(--token-colors-badge-success-bg)" :fg "var(--token-colors-badge-success-fg)"}))

(defnc task-card [{:keys [task on-select]}]
  (let [prio (priority-color (get task "priority"))]
    (d/div
      {:onClick #(on-select task)
       :style {:background "var(--token-colors-background-elevated)"
               :border "1px solid var(--token-colors-border-subtle)"
               :border-radius "6px"
               :padding "8px 10px"
               :margin-bottom "6px"
               :cursor "pointer"}}
      (d/div {:style {:display "flex" :align-items "center" :gap "6px" :margin-bottom "4px"}}
        (d/span {:style {:background (:bg prio) :color (:fg prio) :font-size "10px" :font-weight "600" :padding "1px 5px" :border-radius "3px"}}
          (get task "priority"))
        (when (get task "sourceBoard")
          (d/span {:style {:color "var(--token-colors-text-muted)" :font-size "10px"}}
            (get task "sourceBoard"))))
      (d/div {:style {:font-size "13px" :font-weight "500" :line-height "1.35" :color "var(--token-colors-text-default)"}}
        (get task "title")))))

(defnc column-view [{:keys [column on-select]}]
  (d/div {:style {:min-width "220px" :max-width "280px" :flex-shrink "0"}}
    (d/div {:style {:display "flex" :align-items "center" :gap "6px" :padding "8px 4px" :margin-bottom "6px"}}
      (d/h3 {:style {:font-size "12px" :font-weight "600" :text-transform "uppercase" :letter-spacing "0.05em" :color "var(--token-colors-text-muted)" :margin "0"}}
        (get column "title"))
      (d/span {:style {:font-size "11px" :color "var(--token-colors-text-soft)" :background "var(--token-colors-background-surface)" :padding "1px 6px" :border-radius "10px"}}
        (str (get column "taskCount"))))
    (d/div {:style {:display "flex" :flex-direction "column"}}
      (map-indexed
        (fn [i task]
          ($ task-card {:key (or (get task "uuid") (str i)) :task task :on-select on-select}))
        (get column "tasks")))))

(defnc board-view [{:keys [board on-select]}]
  (let [columns (filter #(> (get % "taskCount" 0) 0) (get board "columns" []))]
    (d/div {:style {:display "flex" :gap "16px" :overflow-x "auto" :padding-bottom "16px"}}
      (map-indexed
        (fn [i col]
          ($ column-view {:key (or (get col "status") (str i)) :column col :on-select on-select}))
        columns))))
