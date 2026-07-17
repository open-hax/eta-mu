(ns eta-mu.terminal-ui.component.session-list
  "Render the session-selector overlay rows: filter line + selectable session
  list. Pure — takes the already-filtered sessions and the selection index."
  (:require [clojure.string :as str]
            [eta-mu.terminal-ui.shape.ansi :as ansi]))

(def ^:private max-visible 10)

(defn- truncate [s n]
  (let [s (str/replace (str s) #"\s+" " ")]
    (if (> (count s) n) (str (subs s 0 (dec n)) "…") s)))

(defn session-row
  "One session summary row; highlighted when selected."
  [{:keys [session-id updated-at model message-count preview]} selected?]
  (let [marker (if selected? "❯ " "  ")
        id-part (ansi/fg :cyan (subs session-id 0 (min 8 (count session-id))))
        meta (str updated-at " · " model " · " message-count " msgs")
        body (str marker id-part " " (ansi/dim meta) " — " (truncate preview 40))]
    (if selected? (ansi/bold body) body)))

(defn selector-frame
  "Full overlay frame: hint row, filter row, and up to `max-visible` session
  rows. `sessions` is the filtered, sorted sequence; `selected` is the
  absolute index into it."
  [query sessions selected]
  (let [visible (take max-visible sessions)]
    (into [(ansi/dim "resume a session — ↑/↓ navigate, type to filter, enter selects, esc starts fresh")
           (str "> " query)]
          (map-indexed (fn [i s] (session-row s (= i selected))) visible))))
