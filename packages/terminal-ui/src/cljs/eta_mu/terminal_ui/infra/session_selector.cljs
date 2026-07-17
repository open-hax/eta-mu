(ns eta-mu.terminal-ui.infra.session-selector
  "Raw-mode session-selector overlay: renders `component.session-list`
  frames through the diff host, navigates with arrow keys, filters with
  `domain.fuzzy`, and resolves the chosen session summary (or nil when the
  user dismisses to start fresh)."
  (:require [clojure.string :as str]
            [eta-mu.terminal-ui.component.session-list :as session-list]
            [eta-mu.terminal-ui.domain.fuzzy :as fuzzy]
            [eta-mu.terminal-ui.infra.host :as host]
            [eta-mu.terminal-ui.infra.input-editor :as editor]
            [eta-mu.terminal-ui.extern.terminal :as terminal]))

(defn- candidate-text [{:keys [session-id model preview]}]
  (str session-id " " model " " preview))

(defn filter-sessions
  "Fuzzy-filter and score-sort sessions against `query`."
  [query sessions]
  (if (str/blank? query)
    (vec sessions)
    (->> sessions
         (keep (fn [s]
                 (let [{:keys [matches score]} (fuzzy/fuzzy-match query (candidate-text s))]
                   (when matches (assoc s ::score score)))))
         (sort-by ::score)
         (vec))))

(defn- apply-selector-key
  "Advance overlay state by one decoded key. Returns :select, :dismiss, or
  nil (continue)."
  [state key]
  (case (first key)
    :move-char nil
    :history-prev (swap! state update :selected
                         (fn [i] (max 0 (dec i))))
    :history-next (swap! state update :selected
                         (fn [i] (min (dec (count (:filtered @state))) (inc i))))
    :backspace (do (swap! state update :query #(subs % 0 (max 0 (dec (count %)))))
                   (swap! state assoc :selected 0))
    :text (do (swap! state update :query str (second key))
              (swap! state assoc :selected 0))
    :control (case (second key)
               "\u0010" (apply-selector-key state [:history-prev])
               "\u000e" (apply-selector-key state [:history-next])
               "\u0003" :dismiss
               "\u001b" :dismiss
               nil)
    :enter :select
    nil))

(defn ^:async choose
  "Show the overlay on `term` over `sessions` (summary maps from
  eta-mu.infra.session/list-sessions). Resolves the chosen summary map, or
  nil on esc/ctrl-c (start fresh)."
  [term sessions]
  (let [state (atom {:query "" :selected 0 :sessions sessions :filtered (vec sessions)})
        host-state (host/new-state)
        render! (fn []
                  (swap! state assoc :filtered (filter-sessions (:query @state) (:sessions @state)))
                  (host/render! host-state term
                                (session-list/selector-frame (:query @state) (:filtered @state) (:selected @state))))]
    (js/Promise.
     (fn [resolve _reject]
       (let [finish (fn [value]
                      (terminal/stop term)
                      (host/render! host-state term [])
                      (resolve value))
             on-input (fn [chunk]
                        (loop [[k & more] (editor/decode-keys chunk)]
                          (when k
                            (let [outcome (apply-selector-key state k)]
                              (cond
                                (= :select outcome)
                                (finish (get (:filtered @state) (:selected @state)))

                                (= :dismiss outcome)
                                (finish nil)

                                :else (do (render!)
                                          (recur more)))))))]
         (terminal/start term on-input nil)
         (render!))))))
