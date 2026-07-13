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

(defn tui-emit
  "Build an event sink bound to `term` that renders tool results and the
  final assistant message through terminal-ui components."
  [term]
  (fn [event]
    (let [type (:type event)
          event-message (:message event)
          width (terminal/columns term)]
      (when (and (= type :message_end) (= :tool-result (:role event-message)))
        (write-lines! term (message/tool-result (:tool-name event-message)
                                                 (:is-error event-message)
                                                 (:content event-message)
                                                 width)))
      (when (and (= type :turn_end) (= :assistant (:role event-message)))
        (when (seq (:content event-message))
          (write-lines! term (message/assistant-message (:content event-message) width)))))))

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
   (let [emit (tui-emit term)]
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
                 new-messages (try
                                (await (loop/run-loop updated-ctx config emit stream-fn))
                                (catch :default e
                                  (terminal/write term (str "Turn error: " (.-message e) "\n"))
                                  []))]
             (recur (append-messages updated-ctx new-messages)))))))))
