(ns eta-mu.domain.tools.read
  "Pure line-window selection for the read tool."
  (:require [clojure.string :as str]
            [eta-mu.domain.tools.truncate :as truncate]))

(defn select-content
  "Select a window of `content` starting at 1-indexed `offset` (default 1) for
  up to `limit` lines (default: rest of file), then apply head truncation.

  Returns `{:out-of-bounds? true :total-lines n}` when offset is past the end
  of the file, otherwise `{:text string :truncation map :start-line n
  :total-lines n}`."
  [content offset limit]
  (let [all-lines (str/split content #"\n" -1)
        total (count all-lines)
        start (if offset (max 0 (dec offset)) 0)]
    (if (>= start total)
      {:out-of-bounds? true :total-lines total}
      (let [window (cond->> (drop start all-lines)
                     limit (take limit))
            selected (str/join "\n" window)
            trunc (truncate/truncate-head selected)]
        {:text (:content trunc)
         :truncation trunc
         :start-line (inc start)
         :total-lines total}))))
