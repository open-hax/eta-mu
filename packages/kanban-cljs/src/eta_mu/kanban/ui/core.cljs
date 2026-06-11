(ns eta-mu.kanban.ui.core
  "Kanban global projection frontend — Helix + uxx tokens."
  (:require [clojure.string :as str]
            [helix.core :as hx :refer [defnc $ <>]]
            [helix.hooks :as hooks]
            [helix.dom :as d]
            ["react-dom/client" :as rdom]
            [eta-mu.kanban.ui.board :as board]
            [eta-mu.kanban.ui.filter-bar :as filter-bar]
            [eta-mu.kanban.ui.sidebar :as sidebar]))

;; ---------------------------------------------------------------------------
;; API
;; ---------------------------------------------------------------------------

(defn- fetch-json [url]
  (-> (js/fetch url)
      (.then (fn [res] (.json res)))
      (.then (fn [data] (js->clj data)))))

(defn- fetch-boards []
  (fetch-json "/api/boards"))

(defn- fetch-compose [params]
  (let [entries (js/Object.entries (clj->js params))
        qs (->> (js->clj entries)
                (filter (fn [[_ v]] (and v (not= v ""))))
                (map (fn [[k v]] (str (name k) "=" (js/encodeURIComponent (str v)))))
                (str/join "&"))
        url (if (seq qs) (str "/api/board/compose?" qs) "/api/board/compose")]
    (fetch-json url)))

(defn- fetch-task-content [task-uuid project-id]
  (fetch-json (str "/api/task/" task-uuid "/content?project=" project-id)))

;; ---------------------------------------------------------------------------
;; URL Params
;; ---------------------------------------------------------------------------

(defn- read-filters-from-url []
  (let [params (js/URLSearchParams. (.-search js/window.location))]
    (cond-> {}
      (.get params "domain") (assoc :domain (.get params "domain"))
      (.get params "org") (assoc :org (.get params "org"))
      (.get params "status") (assoc :status (.get params "status"))
      (.get params "priority") (assoc :priority (.get params "priority"))
      (.get params "q") (assoc :q (.get params "q")))))

(defn- write-filters-to-url! [filters]
  (let [params (js/URLSearchParams.)]
    (doseq [[k v] filters]
      (when (and v (not= v ""))
        (.set params (name k) v)))
    (let [qs (str (.toString params))
          url (if (seq qs) (str "?" qs) (.-pathname js/window.location))]
      (.pushState js/history nil "" url))))

;; ---------------------------------------------------------------------------
;; App
;; ---------------------------------------------------------------------------

(defnc app []
  (let [[boards set-boards] (hooks/use-state nil)
        [board-data set-board-data] (hooks/use-state nil)
        [filters set-filters] (hooks/use-state (read-filters-from-url))
        [selected set-selected] (hooks/use-state nil)
        [detail set-detail] (hooks/use-state nil)
        [loading set-loading] (hooks/use-state true)]

    ;; Sync filters to URL
    (hooks/use-effect [filters]
      (write-filters-to-url! filters))

    ;; Load boards on mount
    (hooks/use-effect []
      (-> (fetch-boards)
          (.then (fn [data]
                   (set-boards data)
                   (set-loading false)))))

    ;; Load composed board when filters change
    (hooks/use-effect [filters]
      (set-loading true)
      (-> (fetch-compose filters)
          (.then (fn [data]
                   (set-board-data data)
                   (set-loading false)))))

    ;; Load task detail when selected changes
    (hooks/use-effect [selected]
      (when selected
        (-> (fetch-task-content (get selected "uuid") (get selected "sourceBoard" "knoxx"))
            (.then (fn [data] (set-detail data))))))

    (d/div {:class "kanban-app" :style {:display "flex" :flex-direction "column" :height "100vh" :background "var(--token-colors-background-default)"}}

      ;; Header
      (d/header {:style {:display "flex" :align-items "center" :gap "12px" :padding "8px 16px" :border-bottom "1px solid var(--token-colors-border-default)" :background "var(--token-colors-background-surface)"}}
        (d/h1 {:style {:font-size "16px" :font-weight "600" :margin "0"}} "Kanban")
        (d/span {:style {:color "var(--token-colors-text-muted)" :font-size "12px"}}
          (str (get board-data "totalTasks" 0) " tasks")))

      ;; Filter bar
      ($ filter-bar/filter-bar
        {:boards boards
         :filters filters
         :on-change set-filters})

      ;; Main content
      (d/div {:style {:display "flex" :flex "1" :overflow "hidden"}}

        ;; Board
        (d/div {:style {:flex "1" :overflow "auto" :padding "16px"}}
          (if loading
            (d/div {:style {:text-align "center" :padding "40px" :color "var(--token-colors-text-muted)"}}
              "Loading...")
            ($ board/board-view
              {:board board-data
               :on-select (fn [task] (set-selected task))})))

        ;; Sidebar
        (when selected
          ($ sidebar/task-sidebar
            {:task selected
             :detail detail
             :on-close #(do (set-selected nil) (set-detail nil))}))))))

;; ---------------------------------------------------------------------------
;; Mount
;; ---------------------------------------------------------------------------

(defn ^:export init []
  (let [root (.createRoot rdom (js/document.getElementById "root"))]
    (.render root ($ app))))

(defn ^:dev/after-load dev-reload []
  (js/console.log "Hot reload"))
