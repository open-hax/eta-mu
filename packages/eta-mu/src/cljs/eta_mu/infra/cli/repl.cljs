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

(defn print-assistant-text
  "Print the text content of an assistant message."  
  [message]
  (when (= :assistant (:role message))
    (let [text (transduce (comp (filter #(= (:type %) :text))
                                (map :text))
                          str
                          (:content message))]
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

(defn repl-emit
  "Event sink that prints tool results and the final assistant message.

  Text deltas are not streamed because the current OpenAI client is synchronous."  
  [event]
  (let [type (:type event)
        message (:message event)]
    (when (and (= type :message_end) (= :tool-result (:role message)))
      (print-tool-result message))
    (when (and (= type :turn_end) (= :assistant (:role message)))
      (print-assistant-text message))))

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
                              (await (loop/run-loop updated-ctx config repl-emit stream-fn))
                              (catch :default e
                                (js/console.error (str "Turn error: " (.-message e)))
                                []))]
           (recur (append-messages updated-ctx new-messages))))))))

(defn ^:async run-piped-input
  "Run a single-turn agent from stdin input that is not a TTY."  
  [context config stream-fn]
  (let [input (atom "")]
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
                    (resolve (loop/run-loop ctx config repl-emit stream-fn)))
                  (resolve [])))))))))
