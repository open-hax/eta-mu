(ns eta-mu.terminal-ui.domain.edit-buffer
  "Pure multi-line edit buffer with a char-offset cursor, plus an in-memory
  prompt-history ring.

  A buffer is plain data `{:text string :cursor int}`; every operation
  returns a new buffer. Multi-line composition falls out of embedded
  newlines — line-aware movement is computed from the text, never stored,
  so the two representations can never drift.

  The history ring is also plain data; navigation functions return the
  updated pair `[history text]` so the caller can rehydrate its buffer."
  (:require [clojure.string :as str]))

(defn buffer
  "Empty buffer, or one seeded with `text` and the cursor at its end."
  ([] (buffer ""))
  ([text] {:text (str text) :cursor (count (str text))}))

(defn- clamp-cursor [b]
  (update b :cursor #(-> % (max 0) (min (count (:text b))))))

(defn insert
  "Insert `s` at the cursor."
  [b s]
  (let [{:keys [text cursor]} b
        s (str s)]
    (-> b
        (assoc :text (str (subs text 0 cursor) s (subs text cursor))
               :cursor (+ cursor (count s)))
        clamp-cursor)))

(defn delete-back
  "Backspace: delete the char before the cursor (no-op at position 0)."
  [b]
  (let [{:keys [text cursor]} b]
    (if (zero? cursor)
      b
      (assoc b :text (str (subs text 0 (dec cursor)) (subs text cursor))
               :cursor (dec cursor)))))

(defn delete-forward
  "Delete: remove the char under the cursor (no-op at end of text)."
  [b]
  (let [{:keys [text cursor]} b]
    (if (>= cursor (count text))
      b
      (assoc b :text (str (subs text 0 cursor) (subs text (inc cursor)))))))

(defn move-char
  "Move the cursor `n` chars (negative = left), clamped to the text."
  [b n]
  (clamp-cursor (update b :cursor + n)))

(defn- word-char? [ch]
  (boolean (and ch (re-find #"\w" (str ch)))))

(defn move-word
  "Move the cursor by whole words: `n` = 1 to the end of the next word,
  -1 to the start of the previous word."
  [b n]
  (let [text (:text b)
        len (count text)
        skip (fn [i pred dir]
               (loop [i i]
                 (if (and (>= i 0) (< i len) (pred (.charAt text i)))
                   (recur (+ i dir))
                   i)))
        cursor (:cursor b)]
    (assoc b :cursor
           (if (pos? n)
             (-> cursor (skip (complement word-char?) 1) (skip word-char? 1))
             (-> cursor dec (max 0)
                 (skip (complement word-char?) -1)
                 (skip word-char? -1)
                 inc (min len))))))

(defn- line-bounds
  "Start and end offsets of the line containing `pos` (end = index of the
  newline, or text length)."
  [text pos]
  (let [start (loop [i pos]
                (if (and (pos? i) (not= "\n" (.charAt text (dec i))))
                  (recur (dec i))
                  i))
        end (loop [i pos]
              (if (and (< i (count text)) (not= "\n" (.charAt text i)))
                (recur (inc i))
                i))]
    [start end]))

(defn move-home
  "Cursor to the start of the current line."
  [b]
  (assoc b :cursor (first (line-bounds (:text b) (:cursor b)))))

(defn move-end
  "Cursor to the end of the current line."
  [b]
  (assoc b :cursor (second (line-bounds (:text b) (:cursor b)))))

(defn- newline-count [s]
  (count (filter #(= "\n" %) s)))

(defn cursor-line-col
  "The cursor's [line col], both 0-based, computed from embedded newlines."
  [b]
  (let [{:keys [text cursor]} b
        line (newline-count (subs text 0 cursor))
        [start _] (line-bounds text cursor)]
    [line (- cursor start)]))

(defn line-count [b]
  (inc (newline-count (:text b))))

(defn move-line
  "Move the cursor `n` lines (negative = up), preserving the goal column
  where the target line is long enough."
  [b n]
  (let [text (:text b)
        [line col] (cursor-line-col b)
        target-line (-> line (+ n) (max 0) (min (dec (line-count b))))]
    (if (= target-line line)
      b
      (let [offsets (loop [offs [0] i 0]
                      (if (>= i (count text))
                        offs
                        (recur (if (= "\n" (.charAt text i))
                                 (conj offs (inc i))
                                 offs)
                                (inc i))))
            start (nth offsets target-line)
            end (second (line-bounds text start))]
        (assoc b :cursor (min (+ start col) end))))))

(defn submit
  "Returns [submitted-text fresh-buffer]."
  [b]
  [(:text b) (buffer)])

(defn history
  "New empty in-memory history ring."
  []
  {:entries [] :index nil})

(defn history-push
  "Record a submitted entry (blank entries are ignored) and reset navigation."
  [h text]
  (if (str/blank? (str text))
    (assoc h :index nil)
    (-> h (update :entries conj text) (assoc :index nil))))

(defn history-prev
  "Step back to an older entry. `current` is stashed at the ring's leading
  edge so stepping forward past the newest entry restores it. Returns
  [history' text]."
  [h current]
  (let [{:keys [entries index]} h]
    (if (empty? entries)
      [h current]
      (let [next-index (if (nil? index)
                         (dec (count entries))
                         (max 0 (dec index)))
            h (if (nil? index)
                (assoc h :stash current)
                h)]
        [(assoc h :index next-index) (nth entries next-index)]))))

(defn history-next
  "Step forward to a newer entry, restoring the stashed in-progress text past
  the newest entry. Returns [history' text]."
  [h current]
  (let [{:keys [entries index stash]} h]
    (cond
      (nil? index) [h current]
      (< index (dec (count entries)))
      [(assoc h :index (inc index)) (nth entries (inc index))]
      :else
      [(assoc h :index nil) (or stash "")])))
