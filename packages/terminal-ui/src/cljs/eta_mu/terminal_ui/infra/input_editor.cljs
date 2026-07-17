(ns eta-mu.terminal-ui.infra.input-editor
  "Raw-mode line editor: consumes keypress events from `extern.terminal`,
  drives the pure `domain.edit-buffer` state, renders through
  `infra.host` (never directly to stdout), and wires the previously
  caller-less `domain.kill-ring` and `domain.undo-stack`.

  Key map:
    printable chars        insert
    enter                  submit (trailing `\\` or ctrl-j continues the line)
    backspace / delete     delete-back / delete-forward
    left/right, ctrl-b/f   move-char
    alt-b/f, ctrl-left/right move-word
    home/end, ctrl-a/e     move-home / move-end
    up/down, ctrl-p/n      history-prev / history-next
    ctrl-k/u/w             kill to end-of-line / whole line / word-back (kill-ring)
    ctrl-y                 yank
    ctrl-_                 undo (undo-stack)
    ctrl-c, ctrl-d on empty buffer  abort (resolves nil)"
  (:require [clojure.string :as str]
            [eta-mu.terminal-ui.domain.edit-buffer :as eb]
            [eta-mu.terminal-ui.domain.kill-ring :as kill-ring]
            [eta-mu.terminal-ui.domain.undo-stack :as undo-stack]
            [eta-mu.terminal-ui.infra.host :as host]
            [eta-mu.terminal-ui.extern.terminal :as terminal]))

(def ^:private escape-sequences
  {"\u001b[D" [:move-char -1]
   "\u001b[C" [:move-char 1]
   "\u001b[A" [:history-prev]
   "\u001b[B" [:history-next]
   "\u001b[H" [:home] "\u001b[F" [:end]
   "\u001b[1~" [:home] "\u001b[4~" [:end]
   "\u001b[3~" [:delete-forward]
   "\u001b[1;5D" [:move-word -1] "\u001b[1;5C" [:move-word 1]
   "\u001b[b" [:move-word -1] "\u001b[f" [:move-word 1]
   "\u001b[3;5~" [:kill-word-forward]})

(defn- decode-keys
  "Split a raw input chunk into a sequence of key tokens: escape sequences
  matched greedily, control chars as themselves, printable runs as strings."
  [chunk]
  (loop [s (str chunk) keys []]
    (if (empty? s)
      keys
      (if-let [[seq-token action] (some (fn [[esc tok]] (when (str/starts-with? s esc) [esc tok]))
                                        escape-sequences)]
        (recur (subs s (count seq-token)) (conj keys action))
        (let [ch (subs s 0 1)]
          (cond
            (= ch "") (recur (subs s 1) keys)
            (= ch "\r") (recur (subs s 1) (conj keys [:enter]))
            (< (.charCodeAt ch 0) 32) (recur (subs s 1) (conj keys [:control ch]))
            (= ch "\u007f") (recur (subs s 1) (conj keys [:backspace]))
            :else (let [run (loop [i 1]
                              (if (and (< i (count s))
                                       (let [c (subs s i (inc i))]
                                         (and (not= c "\u001b")
                                              (>= (.charCodeAt c 0) 32)
                                              (not= c "\u007f"))))
                                (recur (inc i))
                                i))]
                    (recur (subs s run) (conj keys [:text (subs s 0 run)])))))))))

(defn- editor-frame
  "Prompt + buffer text as host frame rows: prompt prefixes the first line."
  [prompt-text text]
  (let [lines (str/split text #"\n" -1)]
    (into [(str prompt-text (first lines))] (rest lines))))

(defn- render-cursor!
  "After a host render (cursor parked at the start of the frame's last row),
  move the terminal cursor to the buffer cursor's [line col]."
  [term prompt-text buffer frame]
  (let [[line col] (eb/cursor-line-col buffer)
        up (- (dec (count frame)) line)
        target-col (+ col (if (zero? line) (count prompt-text) 0))]
    (when (pos? up)
      (terminal/move-by term (- up)))
    (when (pos? target-col)
      (terminal/write term (str "\u001b[" target-col "C")))))

(defn- initial-state [history]
  {:buffer (eb/buffer)
   :history (or history (eb/history))
   :kill (kill-ring/kill-ring)
   :undo (undo-stack/undo-stack)})

(defn- record-undo! [state]
  ((:push (:undo @state)) (:buffer @state)))

(defn- apply-key
  "Advance editor state by one decoded key. Returns :submit, :abort, or nil
  (continue editing)."
  [state key]
  (record-undo! state)
  (let [swap-buffer! (fn [f & args] (apply swap! state update :buffer f args))
        kill-push! (fn [text opts] ((:push (:kill @state)) text opts))]
    (case (first key)
      :text (swap-buffer! eb/insert (second key))
      :backspace (swap-buffer! eb/delete-back)
      :delete-forward (swap-buffer! eb/delete-forward)
      :move-char (swap-buffer! eb/move-char (second key))
      :move-word (swap-buffer! eb/move-word (second key))
      :home (swap-buffer! eb/move-home)
      :end (swap-buffer! eb/move-end)
      :history-prev (let [[h text] (eb/history-prev (:history @state) (:text (:buffer @state)))]
                      (swap! state assoc :history h :buffer (eb/buffer text)))
      :history-next (let [[h text] (eb/history-next (:history @state) (:text (:buffer @state)))]
                      (swap! state assoc :history h :buffer (eb/buffer text)))
      :kill-to-eol (let [b (:buffer @state)
                         end (:cursor (eb/move-end b))]
                     (kill-push! (subs (:text b) (:cursor b) end) {})
                     (swap! state assoc :buffer (assoc b :text (str (subs (:text b) 0 (:cursor b))
                                                                    (subs (:text b) end)))))
      :kill-line (let [b (:buffer @state)]
                   (kill-push! (:text b) {})
                   (swap! state assoc :buffer (eb/buffer)))
      :kill-word-back (let [b (:buffer @state)
                            start (:cursor (eb/move-word b -1))]
                        (kill-push! (subs (:text b) start (:cursor b)) {:prepend true})
                        (swap! state assoc :buffer
                               (assoc b :text (str (subs (:text b) 0 start)
                                                   (subs (:text b) (:cursor b)))
                                        :cursor start)))
      :kill-word-forward (let [b (:buffer @state)
                               end (:cursor (eb/move-word b 1))]
                           (kill-push! (subs (:text b) (:cursor b) end) {})
                           (swap! state assoc :buffer
                                  (assoc b :text (str (subs (:text b) 0 (:cursor b))
                                                      (subs (:text b) end)))))
      :yank (when-let [text ((:peek (:kill @state)))]
              (swap-buffer! eb/insert text))
      :undo (when-let [prev ((:pop (:undo @state)))]
              (swap! state assoc :buffer prev))
      :newline (swap-buffer! eb/insert "\n")
      :control (case (second key)
                 "\u0001" (swap-buffer! eb/move-home)
                 "\u0005" (swap-buffer! eb/move-end)
                 "\u0002" (swap-buffer! eb/move-char -1)
                 "\u0006" (swap-buffer! eb/move-char 1)
                 "\u0010" (apply-key state [:history-prev])
                 "\u000e" (apply-key state [:history-next])
                 "\u000a" (swap-buffer! eb/insert "\n")
                 "\u000b" (apply-key state [:kill-to-eol])
                 "\u0015" (apply-key state [:kill-line])
                 "\u0017" (apply-key state [:kill-word-back])
                 "\u0019" (apply-key state [:yank])
                 "\u001f" (apply-key state [:undo])
                 "\u0003" :abort
                 "\u0004" (when (empty? (:text (:buffer @state))) :abort)
                 nil)
      :enter (let [text (:text (:buffer @state))]
               (if (str/ends-with? text "\\")
                 (do (swap-buffer! eb/delete-back)
                     (swap-buffer! eb/insert "\n")
                     nil)
                 :submit))
      nil)))

(defn ^:async ask
  "Prompt for one line (or several, via ctrl-j / trailing `\\`) on a raw-mode
  terminal. Returns the submitted text, or nil on ctrl-c / ctrl-d-at-empty.

  `opts` may hold `:history` — an edit-buffer history map carried across
  calls so up/down recalls earlier submissions."
  [term prompt-text opts]
  (let [{:keys [history]} opts
        state (atom (initial-state history))
        render! (fn []
                  (let [frame (editor-frame prompt-text (:text (:buffer @state)))]
                    (host/render! (:host-state @state) term frame)
                    (render-cursor! term prompt-text (:buffer @state) frame)))]
    (swap! state assoc :host-state (host/new-state))
    (js/Promise.
     (fn [resolve _reject]
       (let [finish (fn [value]
                      (terminal/stop term)
                      (host/render! (:host-state @state) term [])
                      (terminal/write term "\n")
                      (resolve value))
             on-input (fn [chunk]
                        (let [keys (decode-keys chunk)]
                          (loop [[k & more] keys]
                            (when k
                              (let [outcome (apply-key state k)]
                                (cond
                                  (= :submit outcome)
                                  (let [text (:text (:buffer @state))]
                                    (swap! state update :history eb/history-push text)
                                    (finish {:text text :history (:history @state)}))

                                  (= :abort outcome)
                                  (finish nil)

                                  :else (do (render!)
                                            (recur more))))))))]
         (terminal/start term on-input nil)
         (render!))))))

(defn ^:async prompt
  "Convenience wrapper over `ask` returning just the submitted text (or nil)."
  ([term prompt-text] (prompt term prompt-text {}))
  ([term prompt-text opts]
   (let [result (await (ask term prompt-text opts))]
     (when result (:text result)))))
