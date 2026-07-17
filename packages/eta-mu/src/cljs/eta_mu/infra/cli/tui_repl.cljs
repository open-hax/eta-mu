(ns eta-mu.infra.cli.tui-repl
  "Interactive REPL agent rendered through `eta-mu.terminal-ui` components.

  Unlike `eta-mu.infra.cli.repl` (plain `println`), this host formats every
  lifecycle event from the turn-processor loop through terminal-ui message
  components — tool calls, tool results, and the final assistant reply all
  render with color and word-wrapping at the terminal's current width."
  (:require [clojure.string :as str]
            [eta-mu.extern.process :as process]
            [eta-mu.extern.readline :as readline]
            [eta-mu.infra.session :as session]
            [eta-mu.terminal-ui.component.message :as message]
            [eta-mu.terminal-ui.extern.terminal :as terminal]
            [eta-mu.terminal-ui.infra.host :as host]
            [eta-mu.terminal-ui.infra.input-editor :as editor]
            [eta-mu.turn-processor.infra.loop :as loop]))

(defn- user-message*
  [line]
  {:role :user :content line :timestamp (js/Date.now)})

(defn- append-messages
  [context new-messages]
  (update context :messages into new-messages))

(defn- write-lines!
  [term lines]
  (doseq [line lines]
    (terminal/write term (str line "\n"))))

(defn- content-text [content]
  (transduce (comp (filter #(= (:type %) :text)) (map :text)) str content))

(defn tui-emit
  "Build an event sink bound to `term` that renders a whole turn through the
  differential-render host.

  `status-state` (a `host/new-state` atom) drives the single-line 'thinking'
  indicator shown while waiting for the model's first token or tool result —
  the caller renders it in before starting the turn; this fn clears it, via
  the differential-render host, only when an event produces real output (an
  assistant text delta, a tool result, or the boxed turn_end render), so
  lifecycle bookkeeping like :agent_start does not erase it during the
  actual model wait.

  Turn content is kept as an ordered segment list (assistant markdown
  in-progress + finished tool results); every delta re-renders the full
  frame as markdown through the host, which diffs rows — in-progress blocks
  update in place without flicker and tool results interleave correctly.
  When no deltas arrive (e.g. a non-streaming stream-fn), the boxed render
  at `turn_end` is the only output — matching the prior synchronous
  behavior."
  [term status-state]
  (let [segments (atom [])
        content-state (atom nil)
        clear-status! (fn []
                        (when (seq (:frame @status-state))
                          (host/render! status-state term [])))
        render-frame! (fn []
                      (let [width (terminal/columns term)
                            frame (vec (mapcat (fn [seg]
                                                 (if (= :assistant (:kind seg))
                                                   (message/assistant-message (:text seg) width)
                                                   (message/tool-result (:name seg) (:is-error seg)
                                                                        (:content seg) width)))
                                               @segments))]
                        (when (nil? @content-state)
                          (reset! content-state (host/new-state)))
                        (host/render! @content-state term frame)))]
    (fn [event]
      (let [type (:type event)
            event-message (:message event)
            width (terminal/columns term)]
        (when (and (= type :message_update) (= :assistant (:role event-message)))
          (let [text (content-text (:content event-message))]
            (when (seq text)
              (clear-status!)
              (if (and (seq @segments) (= :assistant (:kind (peek @segments))))
                (swap! segments update (dec (count @segments)) assoc :text text)
                (swap! segments conj {:kind :assistant :text text}))
              (render-frame!))))

        (when (and (= type :message_end) (= :tool-result (:role event-message)))
          (clear-status!)
          (swap! segments conj {:kind :tool-result
                                :name (:tool-name event-message)
                                :is-error (:is-error event-message)
                                :content (:content event-message)})
          (render-frame!))

        (when (and (= type :turn_end) (= :assistant (:role event-message)))
          (if (seq @segments)
            (do (render-frame!)
                (terminal/write term "\n")
                (reset! segments [])
                (reset! content-state nil))
            (when (seq (:content event-message))
              (clear-status!)
              (write-lines! term (message/assistant-message (:content event-message) width)))))))))

(defn- ^:async persist-safe!
  "Run a session-persistence thunk, reporting any failure through the
  terminal and continuing, so a law-gate rejection or I/O error can never
  kill the conversation loop."
  [term label thunk]
  (try
    (await (thunk))
    (catch :default e
      (terminal/write term (str "Session persistence " label " failed (continuing without persisting): "
                                (.-message e) "\n")))))

(defn- ^:async editor-input
  "get-input implementation backed by the raw-mode input editor, carrying the
  shared prompt-history atom across calls."
  [term history-atom prompt-text]
  (let [result (await (editor/ask term prompt-text {:history @history-atom}))]
    (when result
      (reset! history-atom (:history result))
      (:text result))))

(defn ^:async run-tui-repl
  "Run an interactive, terminal-ui-rendered REPL agent.

  `context` is the initial agent context. `config` is the turn-loop config.
  `stream-fn` produces the LLM stream. The final argument may be an options
  map holding:
  - `:get-input` — a function `(prompt) -> Promise<string?>` that returns the
    next line of input or nil when closed; defaults to a readline interface.
  - `:term` — a `Terminal` implementation; defaults to the process terminal.
  - `:session` — a session artifact atom (see `eta-mu.infra.session`); when
    present, every turn is persisted as it completes.

  The legacy `[context config stream-fn get-input term]` arity delegates to
  the options-map form."
  ([context config stream-fn]
   (run-tui-repl context config stream-fn {}))
  ([context config stream-fn get-input term]
   (run-tui-repl context config stream-fn {:get-input get-input :term term}))
  ([context config stream-fn {:keys [get-input term session]}]
   (let [term (or term (terminal/process-terminal))
         use-editor? (and (nil? get-input) (process/stdin-tty?))
         rl (when-not (or get-input use-editor?) (readline/create-interface))
         history (atom nil)
         get-input (or get-input
                       (if use-editor?
                         (partial editor-input term history)
                         #(readline/question rl %)))]
     (try
       (terminal/write term "eta-mu agent TUI. Type /exit to quit, /clear to reset context.\n")
       (let [status-state (host/new-state)
             emit (tui-emit term status-state)]
         (loop [ctx context]
           (let [input (await (get-input "> "))]
             (cond
               (nil? input)
               (terminal/write term "\nGoodbye.\n")

               (= "/exit" (str/trim input))
               (terminal/write term "Goodbye.\n")

                (= "/clear" (str/trim input))
                (do (terminal/write term "Context cleared.\n")
                    (when session
                      (await (persist-safe! term "clear" #(session/clear! session))))
                    (recur (assoc ctx :messages [])))

                :else
                (let [user-message (user-message* input)
                      updated-ctx (update ctx :messages conj user-message)
                      _ (host/render! status-state term ["thinking..."])
                      new-messages (try
                                     (await (loop/run-loop updated-ctx config emit stream-fn))
                                     (catch :default e
                                       (host/render! status-state term [])
                                       (terminal/write term (str "Turn error: " (.-message e) "\n"))
                                       []))]
                  (when session
                    (await (persist-safe! term "record-turn"
                                          #(session/record-turn! session user-message new-messages))))
                  (recur (append-messages updated-ctx new-messages)))))))
       (finally
         (when rl
           (readline/close! rl)))))))
