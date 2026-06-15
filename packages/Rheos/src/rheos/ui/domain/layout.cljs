(ns rheos.ui.domain.layout
  "Kanban global projection app shell — composes the header, filter bar, board,
   and task sidebar, and owns the top-level board/selection/filter state."
  (:require [helix.core :as hx :refer [defnc $]]
            [helix.hooks :as hooks]
            [helix.dom :as d]
            [rheos.ui.domain.board :as board]
            [rheos.ui.domain.filter-bar :as filter-bar]
            [rheos.ui.domain.orchestrator :as orchestrator]
            [rheos.ui.domain.sidebar :as sidebar]
            [rheos.ui.infra.api :as api]
            [rheos.ui.infra.ledger-stream :as ledger-stream]
            [rheos.ui.law.url :as url]))

(defnc app []
  (let [[boards set-boards] (hooks/use-state nil)
        [board-data set-board-data] (hooks/use-state nil)
        [filters set-filters] (hooks/use-state (url/read-filters-from-url))
        [selected set-selected] (hooks/use-state nil)
        [detail set-detail] (hooks/use-state nil)
        [loading set-loading] (hooks/use-state true)
        [toast set-toast] (hooks/use-state nil)
        [live set-live] (hooks/use-state false)
        [chat-collapsed set-chat-collapsed] (hooks/use-state false)
        ;; Golden-ratio focus: whichever region is focused grows; the others shrink
        ;; to their baseline. :orchestrator | :board | :sidebar.
        [focus set-focus] (hooks/use-state :board)
        region-flex (fn [region base] (str (if (= focus region) 1.618 base)))
        ;; Latest filters, readable from the (mount-once) SSE handler without
        ;; reopening the stream on every filter keystroke.
        filters-ref (hooks/use-ref filters)
        ;; Drag-and-drop move: POST an FSM-enforced status change, then refetch the
        ;; composed board. A rejected transition (HTTP 409) surfaces the FSM's reason.
        move-task! (fn ^:async [uuid project status]
                     (try
                       (let [res (await (api/post-status uuid project status))]
                         (if (.-ok res)
                           (set-board-data (await (api/fetch-compose filters)))
                           (let [b (await (.json res))]
                             (set-toast (or (.-error b) (str "move failed (" (.-status res) ")"))))))
                       (catch :default e
                         (set-toast (str e)))))]

    ;; Sync filters to URL + keep the SSE handler's filters ref current
    (hooks/use-effect [filters]
      (url/write-filters-to-url! filters)
      (set! (.-current filters-ref) filters))

    ;; Live updates: subscribe to the ledger SSE stream once on mount. Any actor's
    ;; mutation (HTTP, drag-drop, CLI/file edit via the watcher) refetches the
    ;; board — debounced so a burst of events coalesces into one refetch.
    (hooks/use-effect []
      (let [timer (atom nil)
            refetch (fn ^:async []
                      (when @timer (js/clearTimeout @timer))
                      (reset! timer
                              (js/setTimeout
                               (fn ^:async []
                                 (set-board-data (await (api/fetch-compose (.-current filters-ref)))))
                               150)))
            close (ledger-stream/subscribe (fn [_ev] (refetch)) set-live)]
        (fn []
          (when @timer (js/clearTimeout @timer))
          (close))))

    ;; Load boards on mount
    (hooks/use-effect []
      ((fn ^:async []
         (let [data (await (api/fetch-boards))]
           (set-boards data)
           (set-loading false)))))

    ;; Load composed board when filters change
    (hooks/use-effect [filters]
      (set-loading true)
      ((fn ^:async []
         (let [data (await (api/fetch-compose filters))]
           (set-board-data data)
           (set-loading false)))))

    ;; Load task detail when selected changes
    (hooks/use-effect [selected]
      (when selected
        ((fn ^:async []
           (let [data (await (api/fetch-task-content (get selected "uuid") (get selected "sourceBoard" "knoxx")))]
             (set-detail data))))))

    ;; Auto-dismiss the toast after a few seconds
    (hooks/use-effect [toast]
      (when toast
        (let [t (js/setTimeout #(set-toast nil) 5000)]
          (fn [] (js/clearTimeout t)))))

    (d/div {:class "kanban-app" :style {:display "flex" :flex-direction "column" :height "100vh" :overflow "hidden" :background "var(--token-colors-background-default)"}}

      ;; Header
      (d/header {:style {:display "flex" :align-items "center" :gap "12px" :padding "8px 16px" :border-bottom "1px solid var(--token-colors-border-default)" :background "var(--token-colors-background-surface)"}}
        (d/h1 {:style {:font-size "16px" :font-weight "600" :margin "0"}} "Kanban")
        (d/span {:style {:color "var(--token-colors-text-muted)" :font-size "12px"}}
          (str (get board-data "totalTasks" 0) " tasks"))
        ;; Live-stream indicator: green when the SSE connection is open.
        (d/span {:title (if live "Live — board updates in real time" "Reconnecting…")
                 :style {:display "inline-flex" :align-items "center" :gap "5px"
                         :font-size "11px" :color "var(--token-colors-text-muted)"}}
          (d/span {:style {:width "8px" :height "8px" :border-radius "999px"
                           :background (if live "var(--token-colors-badge-success-fg)" "var(--token-colors-text-muted)")}})
          (if live "live" "offline")))

      ;; Filter bar
      ($ filter-bar/filter-bar
        {:boards boards
         :filters filters
         :on-change set-filters})

      ;; Main content — three regions in a flex row, no scroll of its own. Each
      ;; region owns its overflow; the focused region grows (golden ratio).
      (d/div {:style {:display "flex" :flex "1" :min-height "0" :overflow "hidden"}}

        ;; Orchestrator (left, board-scoped chat — decoupled from task selection).
        ;; Collapsed → fixed rail; expanded → focus-weighted flex slot.
        (d/div {:onMouseDownCapture #(set-focus :orchestrator)
                :style (if chat-collapsed
                         {:flex "0 0 44px" :overflow "hidden"}
                         {:flex (region-flex :orchestrator 1) :min-width "320px" :overflow "hidden"
                          :transition "flex-grow 0.2s ease"})}
          ($ orchestrator/orchestrator-panel
            {:collapsed chat-collapsed
             :on-toggle #(do (set-chat-collapsed (not chat-collapsed))
                             (set-focus :orchestrator))}))

        ;; Board
        (d/div {:onMouseDownCapture #(set-focus :board)
                :style {:flex (region-flex :board 1.2) :min-width "360px"
                        :overflow "hidden" :padding "16px" :transition "flex-grow 0.2s ease"}}
          (if loading
            (d/div {:style {:text-align "center" :padding "40px" :color "var(--token-colors-text-muted)"}}
              "Loading...")
            ($ board/board-view
              {:board board-data
               :on-select (fn [task] (set-selected task) (set-focus :sidebar))
               :on-move move-task!})))

        ;; Sidebar (task detail) — focus-weighted slot when a task is open
        (when selected
          (d/div {:onMouseDownCapture #(set-focus :sidebar)
                  :style {:flex (region-flex :sidebar 1) :min-width "360px"
                          :overflow "hidden" :transition "flex-grow 0.2s ease"}}
            ($ sidebar/task-sidebar
              {:task selected
               :detail detail
               :on-close #(do (set-selected nil) (set-detail nil) (set-focus :board))
               :on-update (fn [data] (set-detail data))}))))

      ;; Toast — FSM rejections and move errors
      (when toast
        (d/div {:style {:position "fixed" :bottom "12px" :right "12px" :max-width "480px"
                        :padding "10px 14px" :border-radius "8px" :z-index "9999"
                        :border "1px solid var(--token-colors-border-default)"
                        :background "var(--token-colors-background-elevated)"
                        :color "var(--token-colors-text-default)" :font-size "12px"
                        :white-space "pre-wrap"}}
          toast)))))
