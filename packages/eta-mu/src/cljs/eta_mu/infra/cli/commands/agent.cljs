(ns eta-mu.infra.cli.commands.agent
  "Default agent command: interactive REPL or single-turn chat using the
  ClojureScript turn-processor and a minimal OpenAI client."
  (:require [clojure.string :as str]
            [eta-mu.extern.openai :as openai]
            [eta-mu.extern.process :as process]
            [eta-mu.infra.cli.repl :as repl]
            [eta-mu.infra.cli.tui-repl :as tui-repl]
            [eta-mu.infra.tools.registry :as tools]
            [eta-mu.turn-processor.infra.loop :as loop]
            [eta-mu.turn-processor.shape.message :as shape.msg]))

(defn- default-model
  "Return a default model map from flags or a hardcoded fallback."  
  [flags]
  {:id (or (get flags "model") "gpt-4o-mini")
   :provider (or (get flags "provider") "openai")})

(defn- build-config
  [flags]
  {:model (default-model flags)
   :convert-to-llm shape.msg/messages->openai
   :api-key (get flags "api-key")
   :base-url (get flags "base-url")})

(defn- initial-context
  [flags]
  {:system-prompt (or (get flags "system") "You are a helpful assistant.")
   :messages []
   :tools tools/tools})

(defn- ^:async run-single-turn
  [prompt context config]
  (let [ctx (update context :messages conj {:role :user :content prompt :timestamp (js/Date.now)})
        result (await (loop/run-loop ctx config repl/repl-emit openai/stream-chat))]
    (when (seq result)
      (repl/print-assistant-text (last result)))))

(defn ^:async handle
  "Run the agent.

  Modes:
  - With prompt arguments: single-turn chat.
  - With no arguments and a TTY stdin: interactive REPL.
  - With no arguments and piped stdin: single-turn from stdin.

  Usage: eta-mu agent [--model MODEL] [--provider PROVIDER] [--api-key KEY]
                      [--base-url URL] [--system SYSTEM] [--plain] [PROMPT ...]

  By default, an interactive TTY session renders through the terminal-ui-backed
  TUI (colorized, wrapped tool calls/results). Pass --plain for the older
  println-based REPL."
  [{:keys [args flags]}]
  (try
    (let [context (initial-context flags)
          config (build-config flags)]
      (cond
        (seq args)
        (await (run-single-turn (str/join " " args) context config))

        (process/stdin-tty?)
        (if (get flags "plain")
          (await (repl/run-repl context config openai/stream-chat))
          (await (tui-repl/run-tui-repl context config openai/stream-chat)))

        :else
        (await (repl/run-piped-input context config openai/stream-chat))))
    (catch :default e
      (js/console.error (str "eta-mu agent: " (.-message e)))))
  (process/exit! 0))
