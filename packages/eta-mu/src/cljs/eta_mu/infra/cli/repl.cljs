(ns eta-mu.infra.cli.repl
  "Interactive REPL agent backed by the turn-processor turn loop.

  Reads user input line-by-line from stdin, maintains conversation context,
  and drives the agent loop until the user exits."
  (:require [clojure.string :as str]
            [eta-mu.extern.readline :as readline]
            [eta-mu.turn-processor.infra.loop :as loop]))

(defn- user-message
  "Build a user message from a line of input."  
  [line]
  {:role :user :content line :timestamp (js/Date.now)})

(defn- append-messages
  "Append new messages to a context."  
  [context new-messages]
  (update context :messages into new-messages))

(defn- assistant-text
  "Extract the concatenated text content of an assistant message."
  [message]
  (transduce (comp (filter #(= (:type %) :text))
                  (map :text))
            str
            (:content message)))

(defn print-assistant-text
  "Print the text content of an assistant message."
  [message]
  (when (= :assistant (:role message))
    (let [text (assistant-text message)]
      (when (seq text)
        (println text)))))

(defn- print-tool-result
  "Print a concise summary of a tool-result message."
  [message]
  (when (= :tool-result (:role message))
    (let [text (transduce (comp (filter #(= (:type %) :text))
                                (map :text))
                          str
                          (:content message))]
      (println (str "  [tool: " (:tool-name message) " | "
                    (if (:is-error message) "error" "ok")
                    "] " text)))))

(defn make-repl-emit
  "Build an event sink that streams assistant text deltas to stdout as they
  arrive, and prints tool results as they finish.

  Streamed deltas are written directly to `process.stdout` rather than via
  `println` — this runtime's `*print-fn*` is wired to `console.log`, which
  appends its own trailing newline to every call, which would otherwise
  fragment one streamed reply across several needlessly blank lines.

  Streaming state (how much of the current assistant message's text has
  already been printed) is held in a closure so the returned fn can be
  reused across an entire REPL session."
  []
  (let [printed (atom 0)]
    (fn repl-emit [event]
      (let [type (:type event)
            message (:message event)]
        (case type
          :message_update
          (when (= :assistant (:role message))
            (let [text (assistant-text message)]
              (when (> (count text) @printed)
                (.write js/process.stdout (subs text @printed))
                (reset! printed (count text)))))

          :message_end
          (cond
            (= :tool-result (:role message))
            (print-tool-result message)

            (= :assistant (:role message))
            (if (pos? @printed)
              (do (.write js/process.stdout "\n") (reset! printed 0))
              (print-assistant-text message)))

          nil)))))

(defn ^:async run-repl
  "Run an interactive REPL agent.

  `context` is the initial agent context.
  `config` is the turn-loop config.
  `stream-fn` produces the LLM stream.
  `get-input` is an optional function `(prompt) -> Promise<string?` that returns
  the next line of input or nil when closed. Defaults to questions against a
  single readline interface held open for the whole session."
  ([context config stream-fn]
   (let [rl (readline/create-interface)]
     (try
       (await (run-repl context config stream-fn #(readline/question rl %)))
       (finally
         (readline/close! rl)))))
  ([context config stream-fn get-input]
   (println "eta-mu agent REPL. Type /exit to quit, /clear to reset context.")
   (let [emit (make-repl-emit)]
   (loop [ctx context]
     (let [input (await (get-input "\u003e "))]
       (cond
         (nil? input)
         (println "\nGoodbye.")

         (= "/exit" (str/trim input))
         (println "Goodbye.")

         (= "/clear" (str/trim input))
         (do (println "Context cleared.")
             (recur (assoc ctx :messages [])))

         :else
         (let [updated-ctx (update ctx :messages conj (user-message input))
               new-messages (try
                              (await (loop/run-loop updated-ctx config emit stream-fn))
                              (catch :default e
                                (js/console.error (str "Turn error: " (.-message e)))
                                []))]
           (recur (append-messages updated-ctx new-messages)))))))))

(defn ^:async run-piped-input
  "Run a single-turn agent from stdin input that is not a TTY."  
  [context config stream-fn]
  (let [input (atom "")
        emit (make-repl-emit)]
    (js/Promise.
     (fn [resolve _reject]
       (.on js/process.stdin "data"
            (fn [chunk]
              (swap! input str chunk)))
       (.on js/process.stdin "end"
            (fn []
              (let [prompt (str/trim @input)]
                (if (seq prompt)
                  (let [ctx (update context :messages conj (user-message prompt))]
                    (resolve (loop/run-loop ctx config emit stream-fn)))
                  (resolve [])))))))))
