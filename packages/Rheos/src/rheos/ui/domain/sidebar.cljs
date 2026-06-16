(ns rheos.ui.domain.sidebar
  "Task detail sidebar — pure task view (frontmatter, body, comments). Chat now
   lives in the board-scoped orchestrator panel, not here."
  (:require [helix.core :as hx :refer [defnc $]]
            [helix.hooks :as hooks]
            [helix.dom :as d]
            ["marked" :refer [marked]]
            [clojure.string :as str]))

;; ---------------------------------------------------------------------------
;; Constants
;; ---------------------------------------------------------------------------

(def frontmatter-keys ["uuid" "title" "status" "priority" "labels" "created_at" "source" "points" "category"])
(def status-options ["incoming" "todo" "in_progress" "blocked" "review" "document" "done" "rejected"])
(def priority-options ["P0" "P1" "P2" "P3"])

(defn- priority-color [p]
  (case p
    "P0" {:bg "var(--token-colors-badge-error-bg)" :fg "var(--token-colors-badge-error-fg)"}
    "P1" {:bg "var(--token-colors-badge-warning-bg)" :fg "var(--token-colors-badge-warning-fg)"}
    "P2" {:bg "var(--token-colors-badge-info-bg)" :fg "var(--token-colors-badge-info-fg)"}
    {:bg "var(--token-colors-badge-success-bg)" :fg "var(--token-colors-badge-success-fg)"}))

;; ---------------------------------------------------------------------------
;; Frontmatter section
;; ---------------------------------------------------------------------------

(defnc frontmatter-section [{:keys [frontmatter editing-field edit-value on-edit on-save]}]
  (let [visible-keys (filterv (fn [key] (let [v (get frontmatter key)] (and v (not= v "")))) frontmatter-keys)]
    (d/div {:style {:padding "12px 16px" :border-bottom "1px solid var(--token-colors-border-subtle)"}}
      (d/div {:style {:font-size "11px" :font-weight "700" :color "var(--token-colors-text-muted)" :text-transform "uppercase" :letter-spacing "0.05em" :margin-bottom "8px"}}
        "Frontmatter")
      (d/div {:style {:display "flex" :flex-direction "column" :gap "6px"}}
        (mapv (fn [key]
                (let [value (get frontmatter key)
                      is-editing (= editing-field key)]
                  (d/div {:key key
                          :style {:display "flex" :align-items "flex-start" :gap "8px"}
                          :onDoubleClick #(when-not is-editing (on-edit key (str value)))}
                    (d/div {:style {:width "80px" :flex-shrink "0"}}
                      (d/div {:style {:font-size "11px" :font-weight "600" :color "var(--token-colors-text-muted)"}} key))
                    (d/div {:style {:flex "1" :min-width "0"}}
                      (if is-editing
                        ;; Edit mode
                        (cond
                          ;; Status dropdown
                          (= key "status")
                          (d/select {:value edit-value
                                     :onChange #(on-save key (.. % -target -value))
                                     :onBlur #(on-save key edit-value)
                                     :autoFocus true
                                     :style {:width "100%" :background "var(--token-colors-background-default)" :color "var(--token-colors-text-default)" :border "1px solid var(--token-colors-border-default)" :border-radius "4px" :padding "4px 8px" :font-size "12px"}}
                            (mapv (fn [opt] (d/option {:key opt :value opt} opt)) status-options))

                          ;; Priority dropdown
                          (= key "priority")
                          (d/select {:value edit-value
                                     :onChange #(on-save key (.. % -target -value))
                                     :onBlur #(on-save key edit-value)
                                     :autoFocus true
                                     :style {:width "100%" :background "var(--token-colors-background-default)" :color "var(--token-colors-text-default)" :border "1px solid var(--token-colors-border-default)" :border-radius "4px" :padding "4px 8px" :font-size "12px"}}
                            (mapv (fn [opt] (d/option {:key opt :value opt} opt)) priority-options))

                          ;; Labels (comma-separated → array on save)
                          (= key "labels")
                          (d/input {:type "text"
                                    :value edit-value
                                    :onChange #(on-edit key (.. % -target -value))
                                    :onKeyDown #(when (= "Enter" (.-key %))
                                                  (on-save key (->> (str/split (.. % -target -value) #",") (mapv str/trim) (filterv seq))))
                                    :onBlur #(on-save key (->> (str/split edit-value #",") (mapv str/trim) (filterv seq)))
                                    :autoFocus true
                                    :placeholder "label1, label2, ..."
                                    :style {:width "100%" :background "var(--token-colors-background-default)" :color "var(--token-colors-text-default)" :border "1px solid var(--token-colors-border-default)" :border-radius "4px" :padding "4px 8px" :font-size "12px"}})

                          ;; Points (number → coerce on save)
                          (= key "points")
                          (d/input {:type "number"
                                    :value edit-value
                                    :onChange #(on-edit key (.. % -target -value))
                                    :onKeyDown #(when (= "Enter" (.-key %))
                                                  (on-save key (when (seq (.. % -target -value)) (js/Number (.. % -target -value)))))
                                    :onBlur #(on-save key (when (seq edit-value) (js/Number edit-value)))
                                    :autoFocus true
                                    :style {:width "100%" :background "var(--token-colors-background-default)" :color "var(--token-colors-text-default)" :border "1px solid var(--token-colors-border-default)" :border-radius "4px" :padding "4px 8px" :font-size "12px"}})

                          ;; Default text input
                          :else
                          (d/input {:type "text"
                                    :value edit-value
                                    :onChange #(on-edit key (.. % -target -value))
                                    :onKeyDown #(when (= "Enter" (.-key %)) (on-save key (.. % -target -value)))
                                    :onBlur #(on-save key edit-value)
                                    :autoFocus true
                                    :style {:width "100%" :background "var(--token-colors-background-default)" :color "var(--token-colors-text-default)" :border "1px solid var(--token-colors-border-default)" :border-radius "4px" :padding "4px 8px" :font-size "12px"}}))

                        ;; View mode
                        (cond
                          ;; Labels as chips
                          (and (= key "labels") (vector? value))
                          (d/div {:style {:display "flex" :gap "4px" :flex-wrap "wrap"}}
                            (mapv (fn [i label] (d/span {:key (str i) :style {:font-size "11px" :padding "1px 6px" :border-radius "999px" :border "1px solid var(--token-colors-border-subtle)"}} label))
                                  (range) value))

                          ;; Priority as colored badge
                          (= key "priority")
                          (let [c (priority-color (str value))]
                            (d/span {:style {:font-size "11px" :padding "2px 8px" :border-radius "999px" :background (:bg c) :color (:fg c)}} (str value)))

                          ;; Status as badge
                          (= key "status")
                          (d/span {:style {:font-size "12px" :padding "2px 8px" :border-radius "999px" :background "var(--token-colors-badge-info-bg)" :color "var(--token-colors-badge-info-fg)"}} (str value))

                          ;; Default text
                          :else
                          (d/span {:style {:font-size "13px" :color "var(--token-colors-text-default)"}} (str value))))))))
              visible-keys))
      (d/div {:style {:margin-top "8px" :font-size "11px" :color "var(--token-colors-text-muted)"}}
        "Double-click a field to edit"))))

(defn- ^:async patch-frontmatter! [task-uuid project key value on-update]
  (try
    (let [res (await (js/fetch (str "/api/task/" (js/encodeURIComponent task-uuid) "/frontmatter?project=" (js/encodeURIComponent (or project "")))
                               #js {:method "PATCH"
                                    :headers #js {"Content-Type" "application/json"}
                                    :body (js/JSON.stringify #js {:key key :value value})}))]
      (when (.-ok res)
        (let [data (await (.json res))]
          (when on-update (on-update data)))))
    (catch :default err
      (js/console.error "Save failed:" err))))

;; ---------------------------------------------------------------------------
;; Sidebar component
;; ---------------------------------------------------------------------------

(defnc task-sidebar [{:keys [task detail on-close on-update]}]
  (let [task-uuid (get task "uuid")
        source-path (or (get task "sourcePath") (get detail "sourcePath"))
        [editing-field set-editing-field] (hooks/use-state nil)
        [edit-value set-edit-value] (hooks/use-state "")
        handle-edit (fn [key value]
                      (set-editing-field key)
                      (set-edit-value value))
        handle-cancel (fn []
                        (set-editing-field nil)
                        (set-edit-value ""))
        handle-save (fn [key value]
                      (set-editing-field nil)
                      (set-edit-value "")
                      (patch-frontmatter! task-uuid (get task "sourceBoard" "") key value on-update))]
    ;; Fills the flex slot the layout gives it; the content area below owns the scroll.
    (d/div {:style {:width "100%" :height "100%" :border-left "1px solid var(--token-colors-border-default)" :background "var(--token-colors-background-surface)" :overflow "hidden" :display "flex" :flex-direction "column"}}

      ;; Header (title + priority + buttons)
      (let [c (priority-color (get task "priority"))]
        (d/div {:style {:display "flex" :align-items "center" :justify-content "space-between" :padding "10px 16px" :border-bottom "1px solid var(--token-colors-border-subtle)" :background "var(--token-colors-background-surface)" :flex-shrink "0"}}
          (d/div {:style {:display "flex" :align-items "center" :gap "8px" :min-width "0"}}
            (d/span {:style {:font-weight "600" :font-size "14px" :overflow "hidden" :text-overflow "ellipsis" :white-space "nowrap"}}
              (get task "title"))
            (d/span {:style {:font-size "10px" :padding "1px 6px" :border-radius "999px" :background (:bg c) :color (:fg c) :flex-shrink "0"}}
              (get task "priority")))
          (d/div {:style {:display "flex" :gap "4px" :flex-shrink "0"}}
            (when source-path
              (d/button
                {:onClick #(js/fetch (str "/api/task/" (js/encodeURIComponent task-uuid) "/open-editor?project=" (js/encodeURIComponent (get task "sourceBoard" ""))) #js {:method "POST"})
                 :title "Open in editor"
                 :style {:padding "5px 8px" :border-radius "6px" :border "1px solid var(--token-colors-border-default)" :background "var(--token-colors-button-secondary-bg)" :color "var(--token-colors-button-secondary-fg)" :cursor "pointer" :font-size "12px"}}
                "✎"))
            (d/button
              {:onClick on-close
               :title "Close"
               :style {:padding "5px 8px" :border-radius "6px" :border "1px solid var(--token-colors-border-default)" :background "var(--token-colors-button-ghost-bg)" :color "var(--token-colors-button-ghost-fg)" :cursor "pointer" :font-size "12px"}}
              "✕"))))

      ;; Content (owns the sidebar's scroll)
      (if detail
        (d/div {:style {:flex "1" :min-height "0" :overflow-y "auto" :padding "0 0 16px"}}
          ;; Frontmatter
          (when (seq (get detail "frontmatter"))
            ($ frontmatter-section {:frontmatter (get detail "frontmatter")
                                    :editing-field editing-field
                                    :edit-value edit-value
                                    :on-edit handle-edit
                                    :on-save handle-save
                                    :on-cancel handle-cancel}))
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
                (get detail "sections"))))
          ;; Source path
          (when source-path
            (d/div {:style {:padding "8px 16px" :font-size "11px" :color "var(--token-colors-text-muted)" :word-break "break-all"}}
              source-path)))
        (d/div {:style {:flex "1" :padding "16px"}}
          (d/div {:style {:color "var(--token-colors-text-muted)" :font-size "12px"}}
            "Loading..."))))))
