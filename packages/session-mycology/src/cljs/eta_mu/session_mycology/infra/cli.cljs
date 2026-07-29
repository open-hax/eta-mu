(ns eta-mu.session-mycology.infra.cli
  "Session Mycology command implementation owned by @eta-mu/session-mycology."
  (:require [clojure.string :as str]
            ["node:child_process" :as cp]
            ["node:fs" :as fs]
            ["node:path" :as path]
            [eta-mu.session-mycology.domain.event :as event]
            [eta-mu.session-mycology.domain.reflection :as reflection]
            [eta-mu.session-mycology.generated.registry :as registry]))

(defn- exit! [code]
  (.exit js/process code))

(defn- exec-git [args]
  (js/Promise.
   (fn [resolve _reject]
     (let [stdout (atom "")
           child (.spawn cp "git" (clj->js args)
                         #js {:cwd (.cwd js/process) :stdio "pipe"})]
       (.on (.-stdout child) "data" #(swap! stdout str %))
       (.on child "close"
            (fn [code]
              (resolve {:exit (or code 0) :stdout (str/trim @stdout)})))
       (.on child "error" #(resolve {:exit 1 :stdout ""}))))))

(defn- ^:async resolve-repo []
  (let [{:keys [exit stdout]} (await (exec-git ["rev-parse" "--show-toplevel"]))]
    (if (zero? exit) stdout (.cwd js/process))))

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
      (js/console.error "Usage: eta-mu session reflect <lesson>")
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
          file (path/join repo-root ".ημ" "session-reflections.edn")
          line (pr-str envelope)]
      (.mkdirSync fs (path/dirname file) #js {:recursive true})
      (.appendFileSync fs file (str line "\n") "utf8")
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
        (js/console.error (str "Unknown session sub-command: " command))
        (js/console.error "Usage: eta-mu session {reflect|schemas}")
        (exit! 1)))))
