(ns eta-mu.infra.cli.commands.session
  "Session mycology CLI command.

  Records a per-session retrospective to a `.ημ/session-reflections.edn` file in
  the current repo so hard turns can be reviewed later."
  (:require [clojure.string :as str]
            [eta-mu.extern.fs :as fs]
            [eta-mu.extern.git :as git]
            [eta-mu.extern.path :as path]
            [eta-mu.extern.process :as process]))

(defn- now-iso []
  (.toISOString (js/Date.)))

(defn- ^:async resolve-repo
  "Return the git root or current directory."
  []
  (or (await (git/root)) (process/cwd)))

(defn- reflections-file [repo-root]
  (path/join repo-root ".ημ" "session-reflections.edn"))

(defn ^:async reflect [args]
  (let [repo-root (await (resolve-repo))
        file (reflections-file repo-root)
        lesson (str/join " " args)]
    (when (str/blank? lesson)
      (js/console.error "Usage: eta-mu git session reflect <lesson>")
      (process/exit! 1))
    (fs/mkdir (path/dirname file))
    (let [record {:ts (now-iso)
                  :repo repo-root
                  :lesson lesson}
          line (pr-str record)]
      (fs/append-file file (str line "\n"))
      (println (str "Recorded reflection at " file))
      (println line)
      (process/exit! 0))))

(defn ^:async handle
  "Dispatch a session mycology sub-command."
  [{:keys [args]}]
  (let [cmd (str/lower-case (or (first args) "reflect"))
        rest (rest args)]
    (cond
      (= cmd "reflect") (await (reflect rest))
      :else
      (do (js/console.error (str "Unknown session sub-command: " cmd))
          (js/console.error "Usage: eta-mu git session {reflect}")
          (process/exit! 1)))))
