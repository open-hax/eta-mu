(ns rheos.ui.domain.board
  "Board view — columns and task cards, with drag-and-drop status moves.

   Dragging a card onto a column POSTs an FSM-enforced status change via `on-move`
   (see [[rheos.ui.domain.layout]]); the server rejects illegal transitions, so the
   UI cannot move a card anywhere the FSM forbids.

   Task columns are virtualized so 800+ tasks do not create 800+ DOM nodes."
  (:require [helix.core :as hx :refer [defnc $]]
            [helix.hooks :as hooks]
            [helix.dom :as d]))

;; ---------------------------------------------------------------------------
;; Design tokens
;; ---------------------------------------------------------------------------

(def ^:private task-item-height 66)

(defn- priority-color [p]
  (case p
    "P0" {:bg "var(--token-colors-badge-error-bg)" :fg "var(--token-colors-badge-error-fg)"}
    "P1" {:bg "var(--token-colors-badge-warning-bg)" :fg "var(--token-colors-badge-warning-fg)"}
    "P2" {:bg "var(--token-colors-badge-info-bg)" :fg "var(--token-colors-badge-info-fg)"}
    {:bg "var(--token-colors-badge-success-bg)" :fg "var(--token-colors-badge-success-fg)"}))

;; ---------------------------------------------------------------------------
;; Task card
;; ---------------------------------------------------------------------------

(defn- chip [label bg fg]
  (when (seq label)
    (d/span {:style {:font-size "10px" :font-weight "500" :padding "1px 5px" :border-radius "999px"
                     :background bg :color fg :white-space "nowrap"}}
      label)))

(defnc task-card [{:keys [task on-select on-drag-start on-drag-end dragging?]}]
  (let [prio (priority-color (get task "priority"))
        drift? (get task "drift")]
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
               :height (str (- task-item-height 6) "px")
               :box-sizing "border-box"
               :cursor "grab"
               :opacity (if dragging? "0.4" "1")
               :display "flex" :flex-direction "column" :gap "4px"
               :overflow "hidden"}}
      (d/div {:style {:display "flex" :align-items "center" :gap "6px" :flex-shrink "0"}}
        (d/span {:style {:background (:bg prio) :color (:fg prio) :font-size "10px" :font-weight "600" :padding "1px 5px" :border-radius "3px" :flex-shrink "0"}}
          (get task "priority"))
        (when (get task "sourceBoard")
          (d/span {:style {:color "var(--token-colors-text-muted)" :font-size "10px" :white-space "nowrap" :overflow "hidden" :text-overflow "ellipsis"}}
            (get task "sourceBoard")))
        (when drift?
          (d/span {:title "Drift detected"
                   :style {:font-size "10px" :font-weight "700" :color "var(--token-colors-badge-error-fg)" :flex-shrink "0"}}
            "⚠")))
      (d/div {:style {:font-size "13px" :font-weight "500" :line-height "1.35" :color "var(--token-colors-text-default)"
                      :overflow "hidden" :display "-webkit-box" :WebkitLineClamp 2 :WebkitBoxOrient "vertical"}}
        (get task "title"))
      (d/div {:style {:display "flex" :align-items "center" :gap "4px" :flex-wrap "nowrap" :overflow "hidden" :margin-top "auto"}}
        (chip (get task "domain") "var(--token-colors-badge-info-bg)" "var(--token-colors-badge-info-fg)")
        (chip (get task "org") "var(--token-colors-badge-success-bg)" "var(--token-colors-badge-success-fg)")))))

;; ---------------------------------------------------------------------------
;; Virtual list
;; ---------------------------------------------------------------------------

(defn- use-container-size []
  (let [ref (hooks/use-ref nil)
        [size set-size] (hooks/use-state #js {:width 0 :height 0})]
    (hooks/use-effect
      []
      (when-let [el (.-current ref)]
        (let [measure #(set-size #js {:width (.-clientWidth el) :height (.-clientHeight el)})]
          (measure)
          (.addEventListener js/window "resize" measure)
          (fn [] (.removeEventListener js/window "resize" measure)))))
    [ref size]))

(defnc virtual-task-list [{:keys [items render-item]}]
  (let [[container-ref size] (use-container-size)
        [scroll-top set-scroll-top] (hooks/use-state 0)
        total-height (* (count items) task-item-height)
        container-height (.-height size)
        start-idx (max 0 (js/Math.floor (/ scroll-top task-item-height)))
        visible-count (if (pos? container-height)
                        (inc (js/Math.ceil (/ container-height task-item-height)))
                        0)
        overscan 3
        end-idx (min (count items) (+ start-idx visible-count overscan))
        padding-top (* start-idx task-item-height)
        visible-items (subvec (vec items) start-idx end-idx)]
    (d/div {:ref container-ref
            :onScroll #(set-scroll-top (.-scrollTop (.-current container-ref)))
            :style {:flex "1" :min-height "0" :overflow-y "auto" :overflow-x "hidden" :padding "2px"
                    :border-radius "6px"}}
      (d/div {:style {:height total-height :padding-top padding-top}}
        (map-indexed
          (fn [idx task]
            (render-item (+ start-idx idx) task))
          visible-items)))))

;; ---------------------------------------------------------------------------
;; Column + board
;; ---------------------------------------------------------------------------

(defnc column-view [{:keys [column on-select on-drag-start on-drag-end dragging-uuid
                            drag-over? on-drag-over on-drag-leave on-drop]}]
  (let [status (get column "status")
        tasks (get column "tasks")]
    (d/div {:style {:display "flex" :flex-direction "column" :height "100%"
                    :min-width "240px" :max-width "320px" :flex-shrink "0"}
            :onDragOver (fn [e] (.preventDefault e) (on-drag-over status))
            :onDragLeave on-drag-leave
            :onDrop (fn [e] (.preventDefault e) (on-drop e status))}
      (d/div {:style {:display "flex" :align-items "center" :gap "6px" :padding "8px 4px" :margin-bottom "6px" :flex-shrink "0"}}
        (d/h3 {:style {:font-size "12px" :font-weight "600" :text-transform "uppercase" :letter-spacing "0.05em" :color "var(--token-colors-text-muted)" :margin "0"}}
          (get column "title"))
        (d/span {:style {:font-size "11px" :color "var(--token-colors-text-soft)" :background "var(--token-colors-background-surface)" :padding "1px 6px" :border-radius "10px"}}
          (str (get column "taskCount"))))
      (d/div {:style {:display "flex" :flex-direction "column" :flex "1" :min-height "0"
                      :border-radius "6px"
                      :outline (when drag-over? "2px dashed var(--token-colors-text-accent)")
                      :outline-offset "-4px"
                      :background (when drag-over? "var(--token-colors-background-surface)")}}
        ($ virtual-task-list
          {:items tasks
           :render-item (fn [idx task]
                          ($ task-card {:key (or (get task "uuid") (str idx))
                                        :task task
                                        :on-select on-select
                                        :on-drag-start on-drag-start
                                        :on-drag-end on-drag-end
                                        :dragging? (= dragging-uuid (get task "uuid"))}))})))))

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
    ;; Board fills its region height and scrolls horizontally; each column scrolls
    ;; its own tasks vertically. No vertical scroll lives here.
    (d/div {:style {:display "flex" :gap "16px" :height "100%"
                    :overflow-x "auto" :overflow-y "hidden" :padding-bottom "4px"}}
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
