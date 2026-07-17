(ns rheos.ui.domain.filter-bar
  "Filter bar — project, domain, status, priority, labels filters."
  (:require [clojure.string :as str]
            [helix.core :as hx :refer [defnc $]]
            [helix.dom :as d]))

(defnc project-toggle [{:keys [projects selected on-change]}]
  (let [selected-set (set (filter seq (str/split (or selected "") #",")))
        toggle (fn [id]
                 (on-change
                   (let [next (if (selected-set id)
                                (remove #(= % id) selected-set)
                                (conj selected-set id))]
                     (when (seq next) (str/join "," (vec next))))))]
    (d/div {:style {:display "flex" :align-items "center" :gap "6px"}}
      (d/span {:style {:font-size "12px" :color "var(--token-colors-text-muted)"}} "Projects:")
      (d/div {:style {:display "flex" :gap "4px" :flex-wrap "wrap"}}
        (map (fn [p]
               (let [id (get p "id")
                     title (or (get p "title") id)
                     active (selected-set id)]
                 (d/button {:key id
                            :onClick #(toggle id)
                            :style {:background (if active "var(--token-colors-badge-success-fg)" "var(--token-colors-background-default)")
                                    :color (if active "var(--token-colors-background-default)" "var(--token-colors-text-default)")
                                    :border "1px solid var(--token-colors-border-default)"
                                    :border-radius "4px"
                                    :padding "4px 8px"
                                    :font-size "12px"
                                    :cursor "pointer"}}
                   title)))
             projects)))))

(defnc filter-dropdown [{:keys [label options value on-change]}]
  (d/select
    {:value (or value "")
     :onChange #(on-change (let [v (.. % -target -value)] (when (seq v) v)))
     :style {:background "var(--token-colors-background-surface)"
             :color "var(--token-colors-text-default)"
             :border "1px solid var(--token-colors-border-default)"
             :border-radius "4px"
             :padding "4px 8px"
             :font-size "12px"
             :cursor "pointer"}}
    (d/option {:value ""} (str "All " label))
    (map-indexed
      (fn [i opt] (d/option {:key (str i) :value opt} opt))
      options)))

(defnc filter-bar [{:keys [boards filters on-change]}]
  (let [projects (get boards "projects" [])
        domains (distinct (keep #(get-in % ["meta" "domain"]) projects))
        orgs (distinct (keep #(get-in % ["meta" "org"]) projects))
        statuses ["incoming" "breakdown" "ready" "todo" "in_progress" "review" "done" "icebox" "blocked" "accepted" "rejected"]
        priorities ["P0" "P1" "P2" "P3"]
        set-filter (fn [k v] (on-change (if v (assoc filters k v) (dissoc filters k))))]
    (d/div {:style {:display "flex" :align-items "center" :gap "8px" :padding "8px 16px" :border-bottom "1px solid var(--token-colors-border-subtle)" :background "var(--token-colors-background-surface)"}}
      (d/input
        {:type "text"
         :placeholder "Search tasks..."
         :value (or (:q filters) "")
         :onChange #(set-filter :q (.. % -target -value))
         :style {:background "var(--token-colors-background-default)"
                 :color "var(--token-colors-text-default)"
                 :border "1px solid var(--token-colors-border-default)"
                 :border-radius "4px"
                 :padding "4px 10px"
                 :font-size "12px"
                 :width "200px"}})
      ($ filter-dropdown {:label "Domain" :options domains :value (:domain filters) :on-change #(set-filter :domain %)})
      ($ filter-dropdown {:label "Org" :options orgs :value (:org filters) :on-change #(set-filter :org %)})
      ($ filter-dropdown {:label "Status" :options statuses :value (:status filters) :on-change #(set-filter :status %)})
      ($ filter-dropdown {:label "Priority" :options priorities :value (:priority filters) :on-change #(set-filter :priority %)})
      (when (seq projects)
        ($ project-toggle {:projects projects
                           :selected (:projects filters)
                           :on-change #(set-filter :projects %)}))
      (when (seq filters)
        (d/button
          {:onClick #(on-change {})
           :style {:background "var(--token-colors-button-ghost-bg)"
                   :color "var(--token-colors-button-ghost-fg)"
                   :border "none"
                   :border-radius "4px"
                   :padding "4px 10px"
                   :font-size "12px"
                   :cursor "pointer"}}
          "Clear")))))
