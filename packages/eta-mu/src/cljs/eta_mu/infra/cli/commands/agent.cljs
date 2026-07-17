(ns eta-mu.infra.cli.commands.agent
  "Default agent command: interactive REPL or single-turn chat using the
  ClojureScript turn-processor and a minimal OpenAI client."
  (:require [clojure.string :as str]
            [eta-mu.domain.session :as domain.session]
            [eta-mu.extern.openai :as openai]
            [eta-mu.extern.process :as process]
            [eta-mu.infra.cli.repl :as repl]
            [eta-mu.infra.cli.tui-repl :as tui-repl]
            [eta-mu.infra.session :as session]
            [eta-mu.infra.tools.registry :as tools]
            [eta-mu.turn-processor.infra.loop :as loop]
            [eta-mu.turn-processor.shape.message :as shape.msg]))

(defn- default-model
  "Return a default model map from flags, an optional resumed artifact, or a
  hardcoded fallback."
  [flags artifact]
  {:id (or (get flags "model") (:id (:model artifact)) "gpt-4o-mini")
   :provider (or (get flags "provider") (:provider (:model artifact)) "openai")})

(defn- build-config
  [flags artifact]
  {:model (default-model flags artifact)
   :convert-to-llm shape.msg/messages->openai
   :api-key (get flags "api-key")
   :base-url (get flags "base-url")})

(defn- initial-context
  [flags artifact]
  (if artifact
    (domain.session/artifact->context
     (assoc artifact :system-prompt (or (get flags "system") (:system-prompt artifact)))
     tools/tools)
    {:system-prompt (or (get flags "system") "You are a helpful assistant.")
     :messages []
     :tools tools/tools}))

(defn- ^:async persist-safe!
  "Best-effort session persistence: log and swallow failures so a law-gate
  rejection or I/O error never masks the turn's own outcome."
  [label thunk]
  (try
    (await (thunk))
    (catch :default e
      (js/console.error (str "Session persistence " label " failed (continuing without persisting): "
                             (.-message e))))))

(defn- ^:async run-single-turn
  [prompt context config session-atom]
  (let [user-message {:role :user :content prompt :timestamp (js/Date.now)}
        ctx (update context :messages conj user-message)
        new-messages (try
                       (await (loop/run-loop ctx config (repl/make-repl-emit) openai/stream-chat))
                       (catch :default e
                         (await (persist-safe! "record-turn"
                                               #(session/record-turn! session-atom user-message [])))
                         (throw e)))]
    (await (persist-safe! "record-turn"
                          #(session/record-turn! session-atom user-message new-messages)))
    new-messages))

(defn ^:async handle
  "Run the agent.

  Modes:
  - With prompt arguments: single-turn chat.
  - With no arguments and a TTY stdin: interactive REPL.
  - With no arguments and piped stdin: single-turn from stdin.

  Usage: eta-mu agent [--model MODEL] [--provider PROVIDER] [--api-key KEY]
                      [--base-url URL] [--system SYSTEM] [--plain]
                      [--resume SESSION-ID] [PROMPT ...]

  Every turn is persisted to a session artifact under ~/.eta-mu/sessions/
  ($ETA_MU_HOME overrides the home). Pass --resume with a session id (or a
  unique id prefix) to continue a stored session with its full transcript;
  `eta-mu session` lists known sessions. Credentials and --base-url are not
  persisted — re-supply them via env or flags on resume.

  By default, an interactive TTY session renders through the terminal-ui-backed
  TUI (colorized, wrapped tool calls/results). Pass --plain for the older
  println-based REPL."
  [{:keys [args flags]}]
  (try
    (let [resume-id (get flags "resume")
          resumed (when resume-id
                    (when-not (string? resume-id)
                      (throw (js/Error. "--resume requires a session id")))
                    (await (session/resume! resume-id)))
          context (initial-context flags (some-> resumed deref))
          config (build-config flags (some-> resumed deref))
          session-atom (or resumed
                           (await (session/create! {:model (:model config)
                                                    :system-prompt (:system-prompt context)})))]
      (cond
        (seq args)
        (await (run-single-turn (str/join " " args) context config session-atom))

        (process/stdin-tty?)
        (if (get flags "plain")
          (await (repl/run-repl context config openai/stream-chat {:session session-atom}))
          (await (tui-repl/run-tui-repl context config openai/stream-chat {:session session-atom})))

        :else
        (await (repl/run-piped-input context config openai/stream-chat session-atom)))
      (process/exit! 0))
    (catch :default e
      (js/console.error (str "eta-mu agent: " (.-message e)))
      (process/exit! 1))))
