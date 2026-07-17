(ns eta-mu.terminal-ui.infra.host
  "Differential-render host: redraws only the terminal rows that changed
  between two frames instead of reprinting the whole screen.

  A `frame` is a vector of line strings (already wrapped/styled — this
  namespace doesn't wrap or style text, see `component.*` for that). The host
  tracks the last frame it rendered and the terminal's current cursor row
  relative to the top of that frame, so each `render!` only has to move the
  cursor to, clear, and rewrite the rows that actually differ."
  (:require [eta-mu.terminal-ui.extern.terminal :as terminal]))

(defn diff-ops
  "Pure diff of `prev` vs `next` (both vectors of line strings). Returns a
  vector of `{:row idx :text line}` ops in ascending row order: one op per
  row where the two frames differ, plus a clear (`:text \"\"`) op for every
  row `prev` has beyond `next`'s length."
  [prev next]
  (let [prev-count (count prev)
        next-count (count next)
        row-count (max prev-count next-count)]
    (into []
          (keep (fn [row]
                  (let [before (get prev row)
                        after (get next row "")]
                    (when (not= before after)
                      {:row row :text after}))))
          (range row-count))))

(defn new-state
  "Fresh host render state: no prior frame, cursor parked at row 0."
  []
  (atom {:frame [] :cursor-row 0}))

(defn render!
  "Diff `next-frame` against the frame last rendered into `state` (an atom
  from `new-state`) and write only the changed rows to `term`. Leaves the
  cursor parked at the start of the frame's last row."
  [state term next-frame]
  (let [{:keys [frame cursor-row]} @state
        ops (diff-ops frame next-frame)]
    (when (seq ops)
      (let [row (reduce (fn [current-row {:keys [row text]}]
                           (terminal/move-by term (- row current-row))
                           (terminal/write term "\r")
                           (terminal/clear-line term)
                           (terminal/write term text)
                           row)
                         cursor-row
                         ops)
            last-row (max 0 (dec (count next-frame)))]
        (terminal/move-by term (- last-row row))
        (terminal/write term "\r")
        (reset! state {:frame next-frame :cursor-row last-row})))
    (when (empty? ops)
      (swap! state assoc :frame next-frame))))

(defn force-full-redraw!
  "Mark `state` so the next `render!` rewrites every row of the incoming
  frame, even rows that are textually unchanged. Call this after a terminal
  resize, since existing rows may now wrap differently at the new width."
  [state]
  (swap! state assoc :frame []))

(defn start-host!
  "Enable raw mode on `term`, hide the cursor, and force a full redraw on
  resize (width changes invalidate any prior wrapping). `on-input` is the
  raw-keypress handler; `state` is a `new-state` atom shared with `render!`."
  [term state on-input]
  (terminal/hide-cursor term)
  (terminal/start term on-input (fn [& _] (force-full-redraw! state))))

(defn stop-host!
  "Restore terminal state: show the cursor again and detach handlers."
  [term]
  (terminal/show-cursor term)
  (terminal/stop term))
