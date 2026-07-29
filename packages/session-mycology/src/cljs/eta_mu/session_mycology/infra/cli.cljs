(ns eta-mu.session-mycology.infra.cli
  "Session Mycology command implementation owned by @eta-mu/session-mycology."
  (:require [clojure.string :as str]
            [eta-mu.session-mycology.domain.event :as event]
            [eta-mu.session-mycology.domain.reflection :as reflection]
            [eta-mu.session-mycology.extern.git :as git]
            [eta-mu.session-mycology.extern.runtime :as runtime]
            [eta-mu.session-mycology.generated.registry :as registry]))

(defn- exit! [code]
  (runtime/exit! code))

(defn- ^:async resolve-repo []
  (let [cwd (runtime/current-directory)
        {:keys [status stdout stderr]}
        (await (git/exec-at cwd ["rev-parse" "--show-toplevel"]))]
    (case status
      :ok stdout
      :not-a-repository cwd
      (throw
       (js/Error.
        (str "Unable to resolve repository root ("
             (name status)
             "): "
             stderr))))))

(defn- schemas! []
  (println
   (pr-str {:package/name registry/package-name
            :package/version registry/package-version
            :schemas registry/schema-documents
            :current registry/current-versions}))
  (exit! 0))

(defn- ^:async reflect! [component-manifest args]
  (let [repo-root (await (resolve-repo))
        lesson (str/join " " args)]
    (when (str/blank? lesson)
      (runtime/error! "Usage: eta-mu session reflect <lesson>")
      (exit! 1))
    (let [recorded-at (js/Date.)
          payload (reflection/build-payload {:repo repo-root :lesson lesson})
          envelope (event/build-event
                    {:event-id (random-uuid)
                     :recorded-at recorded-at
                     :component-manifest component-manifest
                     :command "eta-mu session reflect"
                     :producer {}
                     :subject {:repository/path repo-root}}
                    payload)
          file (runtime/join-path repo-root ".ημ" "session-reflections.edn")
          line (pr-str envelope)]
      (runtime/make-directories! (runtime/parent-directory file))
      (runtime/append-text! file (str line "\n"))
      (println (str "Recorded reflection at " file))
      (println line)
      (exit! 0))))

(defn ^:async handle
  [{:keys [args component-manifest]}]
  (let [command (str/lower-case (or (first args) "reflect"))
        remaining (vec (rest args))]
    (case command
      "reflect" (await (reflect! component-manifest remaining))
      "schemas" (schemas!)
      (do
        (runtime/error! (str "Unknown session sub-command: " command))
        (runtime/error! "Usage: eta-mu session {reflect|schemas}")
        (exit! 1)))))
