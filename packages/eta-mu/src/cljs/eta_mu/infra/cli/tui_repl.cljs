(ns eta-mu.infra.cli.tui-repl
  "Interactive REPL agent rendered through `eta-mu.terminal-ui` components.

  Unlike `eta-mu.infra.cli.repl` (plain `println`), this host formats every
  lifecycle event from the turn-processor loop through terminal-ui message
  components — tool calls, tool results, and the final assistant reply all
  render with color and word-wrapping at the terminal's current width."
  (:require [clojure.string :as str]
            [eta-mu.extern.readline :as readline]
            [eta-mu.terminal-ui.component.message :as message]
            [eta-mu.terminal-ui.extern.terminal :as terminal]
            [eta-mu.terminal-ui.infra.host :as host]
            [eta-mu.terminal-ui.shape.ansi :as ansi]
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
  "Build an event sink bound to `term` that renders tool results and the
  final assistant message through terminal-ui components.

  `status-state` (a `host/new-state` atom) drives the single-line 'thinking'
  indicator shown while waiting for the model's first token or tool result —
  the caller renders it in before starting the turn; this fn clears it, via
  the differential-render host, the moment any event for that turn arrives,
  so the indicator never lingers alongside real output.

  Assistant text deltas are streamed to the terminal raw (unwrapped) as they
  arrive; once any text has been streamed for a turn, the boxed/wrapped
  `turn_end` render is skipped so the reply isn't printed twice. When no
  deltas arrive (e.g. a non-streaming stream-fn), the boxed render at
  `turn_end` is the only output — matching the prior synchronous behavior."
  [term status-state]
  (let [printed (atom 0)]
    (fn [event]
      (when (seq (:frame @status-state))
        (host/render! status-state term []))
      (let [type (:type event)
            event-message (:message event)
            width (terminal/columns term)]
        (when (and (= type :message_update) (= :assistant (:role event-message)))
          (let [text (content-text (:content event-message))]
            (when (> (count text) @printed)
              (when (zero? @printed)
                (terminal/write term (str (ansi/style [:bold :green] "assistant") " ")))
              (terminal/write term (subs text @printed))
              (reset! printed (count text)))))

        (when (and (= type :message_end) (= :tool-result (:role event-message)))
          (write-lines! term (message/tool-result (:tool-name event-message)
                                                   (:is-error event-message)
                                                   (:content event-message)
                                                   width)))

        (when (and (= type :turn_end) (= :assistant (:role event-message)))
          (if (pos? @printed)
            (do (terminal/write term "\n") (reset! printed 0))
            (when (seq (:content event-message))
              (write-lines! term (message/assistant-message (:content event-message) width)))))))))

(defn ^:async run-tui-repl
  "Run an interactive, terminal-ui-rendered REPL agent.

  `context` is the initial agent context. `config` is the turn-loop config.
  `stream-fn` produces the LLM stream. `get-input` is an optional function
  `(prompt) -> Promise<string?>` that returns the next line of input or nil
  when closed; defaults to a readline interface. `term` is an optional
  `Terminal` implementation; defaults to the process terminal."
  ([context config stream-fn]
   (let [rl (readline/create-interface)]
     (try
       (await (run-tui-repl context config stream-fn #(readline/question rl %) (terminal/process-terminal)))
       (finally
         (readline/close! rl)))))
  ([context config stream-fn get-input term]
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
               (recur (assoc ctx :messages [])))

           :else
           (let [updated-ctx (update ctx :messages conj (user-message* input))
                 _ (host/render! status-state term ["thinking..."])
                 new-messages (try
                                (await (loop/run-loop updated-ctx config emit stream-fn))
                                (catch :default e
                                  (host/render! status-state term [])
                                  (terminal/write term (str "Turn error: " (.-message e) "\n"))
                                  []))]
             (recur (append-messages updated-ctx new-messages)))))))))
