(ns eta-mu.infra.cli.router
  "Command dispatch and help rendering.

  Wires the pure domain router to process I/O and command handlers."
  (:require [clojure.string :as str]
            [eta-mu.domain.router :as router]
            [eta-mu.extern.process :as process]
            [eta-mu.infra.cli.commands.agent :as agent]
            [eta-mu.infra.cli.commands.contracts :as contracts]
            [eta-mu.infra.cli.commands.doctor :as doctor]
            [eta-mu.infra.cli.commands.git :as git]
            [eta-mu.infra.cli.commands.kanban :as kanban]
            [eta-mu.infra.cli.commands.sessions :as sessions]
            [eta-mu.law.command :as law]
            [eta-mu.shape.args :as args]))

(def version "0.1.0")

(defn- registry
  "Build the command registry."
  []
  {"agent"     {:name "agent"
                :description "Start the agent (default; REPL if no prompt)"
                :handler agent/handle}
   "doctor"    {:name "doctor"
                :description "Report workspace health"
                :handler doctor/handle}
   "kanban"    {:name "kanban"
                 :description "Agent-first task board"
                 :handler kanban/handle}
   "session"   {:name "session"
                 :description "List and inspect persisted agent sessions"
                 :handler sessions/handle}
   "git"       (git/group)
   "contracts" {:name "contracts"
                :description "Contract gate commands"
                :subcommands {"output" {:name "output"
                                         :description "Output contract gate"
                                         :handler contracts/output}}}
   "help"      {:name "help"
                :description "Show this help"
                :handler (fn [_] (println (router/render-help (registry) [])) (process/exit! 0))}
   "version"   {:name "version"
                :description "Show version"
                :hidden? true
                :handler (fn [_] (println version) (process/exit! 0))}})

(defn- validate!
  []
  (when-not (law/valid-registry? (registry))
    (js/console.error "Internal error: command registry is invalid")
    (js/console.error (str (law/explain-registry (registry))))
    (process/exit! 1)))

(defn ^:async dispatch
  "Parse process arguments and dispatch to the matched command."
  []
  (validate!)
  (let [parsed (args/parse (drop 2 (process/argv)))
        reg (registry)
        descriptor (router/resolve-dispatch reg parsed)]
    (case (:type descriptor)
      :version
      (do (println version)
          (process/exit! 0))

      :help
      (do (println (router/render-help reg (:path descriptor)))
          (process/exit! 0))

      :error
      (do (js/console.warn (str "Routing legacy/unknown command to agent: " (:message descriptor)))
          (await (agent/handle {:args (:positional parsed) :flags (:flags parsed)})))

      :dispatch
      (do (when-not (:handler (:command descriptor))
            (js/console.error (str "Internal error: command has no handler: " (str/join " " (:path descriptor))))
            (process/exit! 1))
          (await ((:handler (:command descriptor)) {:args (:args descriptor)
                                                    :flags (:flags parsed)})))

      (do (js/console.error "Internal error: unknown dispatch descriptor")
          (process/exit! 1)))))

(defn main
  "Entry point for the router."
  []
  (dispatch))
