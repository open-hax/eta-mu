(ns eta-mu.kanban.ui.board
  "Board view — columns and task cards, with drag-and-drop status moves.

   Dragging a card onto a column POSTs an FSM-enforced status change via `on-move`
   (see [[eta-mu.kanban.ui.core]]); the server rejects illegal transitions, so the
   UI cannot move a card anywhere the FSM forbids."
  (:require [helix.core :as hx :refer [defnc $ <>]]
            [helix.hooks :as hooks]
            [helix.dom :as d]))

(defn- priority-color [p]
  (case p
    "P0" {:bg "var(--token-colors-badge-error-bg)" :fg "var(--token-colors-badge-error-fg)"}
    "P1" {:bg "var(--token-colors-badge-warning-bg)" :fg "var(--token-colors-badge-warning-fg)"}
    "P2" {:bg "var(--token-colors-badge-info-bg)" :fg "var(--token-colors-badge-info-fg)"}
    {:bg "var(--token-colors-badge-success-bg)" :fg "var(--token-colors-badge-success-fg)"}))

(defnc task-card [{:keys [task on-select on-drag-start on-drag-end dragging?]}]
  (let [prio (priority-color (get task "priority"))]
    (d/div
      {:draggable true
       :onDragStart #(on-drag-start % task)
       :onDragEnd on-drag-end
       :onClick #(on-select task)
       :style {:background "var(--token-colors-background-elevated)"
               :border "1px solid var(--token-colors-border-subtle)"
               :border-radius "6px"
               :padding "8px 10px"
               :margin-bottom "6px"
               :cursor "grab"
               :opacity (if dragging? "0.4" "1")}}
      (d/div {:style {:display "flex" :align-items "center" :gap "6px" :margin-bottom "4px"}}
        (d/span {:style {:background (:bg prio) :color (:fg prio) :font-size "10px" :font-weight "600" :padding "1px 5px" :border-radius "3px"}}
          (get task "priority"))
        (when (get task "sourceBoard")
          (d/span {:style {:color "var(--token-colors-text-muted)" :font-size "10px"}}
            (get task "sourceBoard"))))
      (d/div {:style {:font-size "13px" :font-weight "500" :line-height "1.35" :color "var(--token-colors-text-default)"}}
        (get task "title")))))

(defnc column-view [{:keys [column on-select on-drag-start on-drag-end dragging-uuid
                            drag-over? on-drag-over on-drag-leave on-drop]}]
  (let [status (get column "status")]
    (d/div {:style {:min-width "220px" :max-width "280px" :flex-shrink "0"}
            :onDragOver (fn [e] (.preventDefault e) (on-drag-over status))
            :onDragLeave on-drag-leave
            :onDrop (fn [e] (.preventDefault e) (on-drop e status))}
      (d/div {:style {:display "flex" :align-items "center" :gap "6px" :padding "8px 4px" :margin-bottom "6px"}}
        (d/h3 {:style {:font-size "12px" :font-weight "600" :text-transform "uppercase" :letter-spacing "0.05em" :color "var(--token-colors-text-muted)" :margin "0"}}
          (get column "title"))
        (d/span {:style {:font-size "11px" :color "var(--token-colors-text-soft)" :background "var(--token-colors-background-surface)" :padding "1px 6px" :border-radius "10px"}}
          (str (get column "taskCount"))))
      (d/div {:style {:display "flex" :flex-direction "column" :min-height "40px" :border-radius "6px"
                      :outline (when drag-over? "2px dashed var(--token-colors-text-accent)")
                      :outline-offset "-4px"
                      :background (when drag-over? "var(--token-colors-background-surface)")}}
        (map-indexed
          (fn [i task]
            ($ task-card {:key (or (get task "uuid") (str i))
                          :task task
                          :on-select on-select
                          :on-drag-start on-drag-start
                          :on-drag-end on-drag-end
                          :dragging? (= dragging-uuid (get task "uuid"))}))
          (get column "tasks"))))))

(defnc board-view [{:keys [board on-select on-move]}]
  ;; Render ALL columns (not just non-empty ones) so a card can be dropped into an
  ;; empty column too.
  (let [columns (get board "columns" [])
        [drag-over set-drag-over] (hooks/use-state nil)
        [dragging-uuid set-dragging-uuid] (hooks/use-state nil)
        handle-drag-start (fn [e task]
                            (set-dragging-uuid (get task "uuid"))
                            (.setData (.-dataTransfer e) "text/plain"
                                      (js/JSON.stringify #js {:uuid (get task "uuid")
                                                              :project (get task "sourceBoard")
                                                              :from (get task "status")})))
        handle-drag-end (fn [_] (set-dragging-uuid nil))
        handle-drop (fn [e status]
                      (set-drag-over nil)
                      (set-dragging-uuid nil)
                      (let [raw (.getData (.-dataTransfer e) "text/plain")]
                        (when (seq raw)
                          (let [data (js/JSON.parse raw)]
                            (when (not= (.-from data) status)
                              (on-move (.-uuid data) (.-project data) status))))))]
    (d/div {:style {:display "flex" :gap "16px" :overflow-x "auto" :padding-bottom "16px"}}
      (map-indexed
        (fn [i col]
          ($ column-view {:key (or (get col "status") (str i))
                          :column col
                          :on-select on-select
                          :on-drag-start handle-drag-start
                          :on-drag-end handle-drag-end
                          :dragging-uuid dragging-uuid
                          :drag-over? (= drag-over (get col "status"))
                          :on-drag-over set-drag-over
                          :on-drag-leave #(set-drag-over nil)
                          :on-drop handle-drop}))
        columns))))
