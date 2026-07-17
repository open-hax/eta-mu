(ns eta-mu.infra.cli.commands.sessions
  "Agent session inspection command.

  Lists and shows the agent session artifacts persisted by `eta-mu agent`
  under ~/.eta-mu/sessions/ ($ETA_MU_HOME overrides the home). Registered
  top-level as `eta-mu session`; the unrelated session-mycology `reflect`
  command stays under `eta-mu git session`."
  (:require [clojure.pprint :as pprint]
            [clojure.string :as str]
            [eta-mu.extern.process :as process]
            [eta-mu.infra.session :as session]))

(defn ^:async list-sessions
  "Print one line per known session, newest first."
  []
  (let [rows (await (session/list-sessions))]
    (if (empty? rows)
      (println "No sessions found.")
      (doseq [{:keys [session-id updated-at model message-count cwd preview]} rows]
        (println (str session-id "  " updated-at "  " model
                      "  " message-count " msgs  " cwd
                      (when (seq preview)
                        (str "  \"" preview "\""))))))))

(defn ^:async show-session
  "Print the full artifact for a session id or unique prefix."
  [id-or-prefix]
  (let [session-id (await (session/resolve-session-id id-or-prefix))]
    (pprint/pprint (await (session/load-artifact session-id)))))

(defn ^:async handle
  "Dispatch a session inspection sub-command: list (default) or show <id>."
  [{:keys [args]}]
  (try
    (let [cmd (str/lower-case (or (first args) "list"))]
      (cond
        (= cmd "list")
        (await (list-sessions))

        (= cmd "show")
        (if-let [id (second args)]
          (await (show-session id))
          (do (js/console.error "Usage: eta-mu session show <session-id>")
              (process/exit! 1)))

        :else
        (do (js/console.error (str "Unknown session sub-command: " cmd))
            (js/console.error "Usage: eta-mu session {list,show}")
            (process/exit! 1))))
    (catch :default e
      (js/console.error (str "eta-mu session: " (.-message e)))
      (process/exit! 1))))
