(ns eta-mu.infra.cli.router
  "Command dispatch and help rendering.

  Wires the pure domain router to process I/O and command handlers."
  (:require [clojure.string :as str]
            [eta-mu.domain.router :as router]
            [eta-mu.extern.console :as console]
            [eta-mu.extern.process :as process]
            [eta-mu.fork-tax.infra.cli :as fork-tax]
            [eta-mu.generated.component-manifest :as component-manifest]
            [eta-mu.infra.cli.commands.agent :as agent]
            [eta-mu.infra.cli.commands.contracts :as contracts]
            [eta-mu.infra.cli.commands.doctor :as doctor]
            [eta-mu.infra.cli.commands.git :as git]
            [eta-mu.infra.cli.commands.kanban :as kanban]
            [eta-mu.infra.cli.commands.sessions :as sessions]
            [eta-mu.infra.cli.commands.sol :as sol]
            [eta-mu.law.command :as law]
            [eta-mu.receipt-river.infra.cli :as receipt]
            [eta-mu.session-mycology.infra.cli :as session-mycology]
            [eta-mu.shape.args :as args]))

(def version (:eta-mu/version component-manifest/manifest))

(defn- package-handler [handler]
  (fn [context]
    (handler (assoc context :component-manifest component-manifest/manifest))))

(def receipt-handler (package-handler receipt/handle))
(def session-protocol-handler (package-handler session-mycology/handle))
(def fork-tax-handler (package-handler fork-tax/handle))

(defn ^:async session-handler
  "Route protocol subcommands to Session Mycology while preserving the 1.1.1
  no-argument/list/show agent-session inspection surface."
  [{:keys [args] :as context}]
  (if (contains? #{"reflect" "schemas"} (first args))
    (await (session-protocol-handler context))
    (await (sessions/handle context))))

(defn command-registry
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
   "receipt"   {:name "receipt"
                :description "Receipt River operations"
                :handler receipt-handler}
   "receipt-river" {:name "receipt-river"
                    :description "Alias for receipt"
                    :handler receipt-handler}
   "session"   {:name "session"
                :description "Session Mycology operations"
                :handler session-handler}
   "session-mycology" {:name "session-mycology"
                       :description "Alias for session"
                       :handler session-protocol-handler}
   "sessions"  {:name "sessions"
                :description "List and inspect persisted agent sessions"
                :handler sessions/handle}
   "fork-tax"  {:name "fork-tax"
                :description "Fork Tax handoff operations"
                :handler fork-tax-handler}
   "git"       (git/group {:receipt receipt-handler
                           :session session-protocol-handler
                           :fork-tax fork-tax-handler})
   "sol"       (sol/group)
   "contracts" {:name "contracts"
                :description "Contract gate commands"
                :subcommands {"output" {:name "output"
                                         :description "Output contract gate"
                                         :handler contracts/output}}}
   "help"      {:name "help"
                :description "Show this help"
                :handler (fn [_]
                           (println (router/render-help (command-registry) []))
                           (process/exit! 0))}
   "version"   {:name "version"
                :description "Show version"
                :hidden? true
                :handler (fn [{:keys [flags]}]
                           (if (contains? flags "components")
                             (println (pr-str component-manifest/manifest))
                             (println version))
                           (process/exit! 0))}})

(defn- validate!
  []
  (when-not (law/valid-registry? (command-registry))
    (console/error! "Internal error: command registry is invalid")
    (console/error! (str (law/explain-registry (command-registry))))
    (process/exit! 1)))

(defn ^:async dispatch
  "Parse process arguments and dispatch to the matched command."
  []
  (validate!)
  (let [tokens (vec (drop 2 (process/argv)))
        parsed (args/parse tokens)
        reg (command-registry)
        descriptor (router/resolve-dispatch reg parsed)]
    (case (:type descriptor)
      :version
      (do (println version)
          (process/exit! 0))

      :help
      (do (println (router/render-help reg (:path descriptor)))
          (process/exit! 0))

      :error
      (do (console/warn! (str "Routing legacy/unknown command to agent: " (:message descriptor)))
          (await (agent/handle {:args (:positional parsed) :flags (:flags parsed)})))

      :dispatch
      (do (when-not (:handler (:command descriptor))
            (console/error! (str "Internal error: command has no handler: " (str/join " " (:path descriptor))))
            (process/exit! 1))
          (await ((:handler (:command descriptor)) {:args (:args descriptor)
                                                    :raw-args (router/raw-args-after-path tokens (:path descriptor))
                                                    :flags (:flags parsed)})))

      (do (console/error! "Internal error: unknown dispatch descriptor")
          (process/exit! 1)))))

(defn main
  "Entry point for the router."
  []
  (dispatch))
