(ns eta-mu.kanban.ui.filter-bar
  "Filter bar — domain, status, priority, labels filters."
  (:require [helix.core :as hx :refer [defnc $]]
            [helix.dom :as d]
            [clojure.string :as str]))

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
  (let [domains (distinct (keep #(get-in % ["meta" "domain"]) (get boards "projects" [])))
        orgs (distinct (keep #(get-in % ["meta" "org"]) (get boards "projects" [])))
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
