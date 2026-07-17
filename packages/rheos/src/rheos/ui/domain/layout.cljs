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

;; ---------------------------------------------------------------------------
;; Async side effects — kept as top-level ^:async defs because ClojureScript's
;; `^:async` metadata on anonymous fns inside `let` is not accepted by the
;; browser build's analyzer.
;; ---------------------------------------------------------------------------

(defn- ^:async load-boards! [set-boards set-loading]
  (let [data (await (api/fetch-boards))]
    (set-boards data)
    (set-loading false)))

(defn- ^:async load-compose! [filters set-board-data set-loading]
  (set-loading true)
  (let [data (await (api/fetch-compose filters))]
    (set-board-data data)
    (set-loading false)))

(defn- ^:async load-task-detail! [selected set-detail]
  (let [data (await (api/fetch-task-content (get selected "uuid") (get selected "sourceBoard" "knoxx")))]
    (set-detail data)))

(defn- ^:async refetch-compose! [filters-ref set-board-data]
  (set-board-data (await (api/fetch-compose (.-current filters-ref)))))

(defn- ^:async do-move-task! [uuid project status get-filters set-board-data set-toast]
  (try
    (let [res (await (api/post-status uuid project status))]
      (if (.-ok res)
        (set-board-data (await (api/fetch-compose (get-filters))))
        (let [b (await (.json res))]
          (set-toast (or (.-error b) (str "move failed (" (.-status res) ")"))))))
    (catch :default e
      (set-toast (str e)))))

(defn- ^:async move-from-sidebar! [selected status get-filters set-board-data set-detail set-toast]
  (await (do-move-task! (get selected "uuid") (get selected "sourceBoard" "")
                        status get-filters set-board-data set-toast))
  (await (load-task-detail! selected set-detail)))

;; ---------------------------------------------------------------------------
;; App component
;; ---------------------------------------------------------------------------

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
        ;; Chat backend selection from the active board's meta config.
        active-board (first (get boards "projects" []))
        chat-config (when active-board
                      (get (js->clj (get active-board "meta") :keywordize-keys true) :chat {}))
        chat-backend (or (:backend chat-config) (:defaultBackend chat-config) "rheos")
        ;; Latest filters, readable from the (mount-once) SSE handler without
        ;; reopening the stream on every filter keystroke.
        filters-ref (hooks/use-ref filters)]

    ;; Sync filters to URL + keep the SSE handler's filters ref current
    (hooks/use-effect [filters]
      (url/write-filters-to-url! filters)
      (set! (.-current filters-ref) filters))

    ;; Live updates: subscribe to the ledger SSE stream once on mount. Any actor's
    ;; mutation (HTTP, drag-drop, CLI/file edit via the watcher) refetches the
    ;; board — debounced so a burst of events coalesces into one refetch.
    (hooks/use-effect []
      (let [timer (atom nil)
            debounced-refetch #(do (when @timer (js/clearTimeout @timer))
                                   (reset! timer
                                           (js/setTimeout
                                            (fn [] (refetch-compose! filters-ref set-board-data))
                                            150)))
            close (ledger-stream/subscribe (fn [_ev] (debounced-refetch)) set-live)]
        (fn []
          (when @timer (js/clearTimeout @timer))
          (close))))

    ;; Load boards on mount
    (hooks/use-effect []
      (load-boards! set-boards set-loading))

    ;; Load composed board when filters change
    (hooks/use-effect [filters]
      (load-compose! filters set-board-data set-loading))

    ;; Load task detail when selected changes
    (hooks/use-effect [selected]
      (when selected
        (load-task-detail! selected set-detail)))

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
                             (set-focus :orchestrator))
             :backend chat-backend
             :chat-config chat-config}))

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
               :on-move (fn [uuid project status]
                          (do-move-task! uuid project status #(.-current filters-ref) set-board-data set-toast))})))

        ;; Sidebar (task detail) — focus-weighted slot when a task is open
        (when selected
          (d/div {:onMouseDownCapture #(set-focus :sidebar)
                  :style {:flex (region-flex :sidebar 1) :min-width "360px"
                          :overflow "hidden" :transition "flex-grow 0.2s ease"}}
            ($ sidebar/task-sidebar
              {:task selected
               :detail detail
               :on-close #(do (set-selected nil) (set-detail nil) (set-focus :board))
               :on-update (fn [data] (set-detail data))
               ;; Status edits route through the FSM-enforced move path (toast on
               ;; 409), then refresh the open detail; the board refetches via SSE.
               :on-status (fn [status]
                            (move-from-sidebar! selected status
                                                #(.-current filters-ref)
                                                set-board-data set-detail set-toast))}))))

      ;; Toast — FSM rejections and move errors
      (when toast
        (d/div {:style {:position "fixed" :bottom "12px" :right "12px" :max-width "480px"
                        :padding "10px 14px" :border-radius "8px" :z-index "9999"
                        :border "1px solid var(--token-colors-border-default)"
                        :background "var(--token-colors-background-elevated)"
                        :color "var(--token-colors-text-default)" :font-size "12px"
                        :white-space "pre-wrap"}}
          toast)))))
