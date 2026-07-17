(ns eta-mu.infra.session
  "Effectful session persistence for the agent turn loop.

  Session artifacts live at `<eta-mu-home>/sessions/<session-id>.edn`, one
  EDN map per file, rewritten in whole after each turn. The eta-mu home is
  `$ETA_MU_HOME` when set, else `~/.eta-mu`. All I/O goes through
  `eta-mu.extern.fs`; artifact decisions are pure in `eta-mu.domain.session`;
  the artifact contract is `eta-mu.law.session`.

  A live session is an atom holding its artifact map; `record-turn!` and
  `clear!` update the atom and flush it to disk."
  (:require [clojure.edn :as edn]
            [clojure.string :as str]
            [eta-mu.domain.session :as session]
            [eta-mu.extern.fs :as fs]
            [eta-mu.extern.os :as os]
            [eta-mu.extern.path :as path]
            [eta-mu.extern.process :as process]
            [eta-mu.law.session :as law]))

(defn eta-mu-home
  "Resolve the eta-mu home directory: $ETA_MU_HOME, else ~/.eta-mu."
  []
  (let [override (process/env "ETA_MU_HOME")]
    (if (seq override)
      override
      (path/join (os/homedir) ".eta-mu"))))

(defn- now-iso []
  (.toISOString (js/Date.)))

(defn- rand-hex
  [n]
  (apply str (repeatedly n #(.toString (js/Math.floor (* (js/Math.random) 16)) 16))))

(defn- ^:async write-artifact!
  "Flush an artifact map to its session file, law-gated: an artifact that
  fails its contract is never written."
  [artifact]
  (when-not (law/valid-artifact? artifact)
    (throw (js/Error. (str "Refusing to persist an invalid session artifact: "
                           (pr-str (law/explain-artifact artifact))))))
  (let [file (session/session-file (eta-mu-home) (:session-id artifact))]
    (await (fs/mkdir-async (path/dirname file)))
    (await (fs/write-file-async file (str (pr-str artifact) "\n")))
    artifact))

(defn ^:async create!
  "Start a fresh session: build a new artifact, persist it, and return an
  atom holding it."
  [{:keys [model system-prompt]}]
  (let [artifact (session/new-artifact
                  {:session-id (session/new-session-id (js/Date.) (rand-hex 6))
                   :cwd (process/cwd)
                   :model model
                   :system-prompt system-prompt
                   :now-iso (now-iso)})]
    (await (write-artifact! artifact))
    (atom artifact)))

(defn ^:async load-artifact
  "Read and validate the artifact for an exact session id. Throws when the
  file is missing, unparseable, or fails the law."
  [session-id]
  (let [file (session/session-file (eta-mu-home) session-id)]
    (when-not (fs/file-exists? file)
      (throw (js/Error. (str "No session found with id: " session-id))))
    (let [raw (await (fs/read-file-async file))
          artifact (try
                     (edn/read-string raw)
                     (catch :default e
                       (throw (js/Error. (str "Session file is not valid EDN: " file
                                              " (" (.-message e) ")")))))]
      (when-not (law/valid-artifact? artifact)
        (throw (js/Error. (str "Session artifact fails its contract: " file " "
                               (pr-str (law/explain-artifact artifact))))))
      artifact)))

(defn ^:async resolve-session-id
  "Resolve an exact session id or a unique id prefix to a full id. Throws on
  no match or an ambiguous prefix."
  [id-or-prefix]
  (let [dir (session/sessions-dir (eta-mu-home))]
    (if-not (fs/file-exists? dir)
      (throw (js/Error. (str "No sessions found under " dir)))
      (let [ids (->> (fs/list-dir dir)
                     (remove :dir?)
                     (map :name)
                     (filter #(str/ends-with? % ".edn"))
                     (map #(subs % 0 (- (count %) 4))))]
        (if (some #(= % id-or-prefix) ids)
          id-or-prefix
          (let [matches (filter #(str/starts-with? % id-or-prefix) ids)]
            (case (count matches)
              0 (throw (js/Error. (str "No session found with id: " id-or-prefix)))
              1 (first matches)
              (throw (js/Error. (str "Ambiguous session id prefix: " id-or-prefix
                                     " matches " (str/join ", " matches)))))))))))

(defn ^:async resume!
  "Load a stored session by id or unique prefix and return an atom holding
  its artifact."
  [id-or-prefix]
  (let [session-id (await (resolve-session-id id-or-prefix))]
    (atom (await (load-artifact session-id)))))

(defn ^:async record-turn!
  "Append one turn (the user message plus the loop's new messages) to the
  session atom and flush it to disk."
  [session-atom user-message new-messages]
  (let [artifact (swap! session-atom session/append-turn user-message new-messages (now-iso))]
    (await (write-artifact! artifact))
    artifact))

(defn ^:async clear!
  "Reset the session transcript (the `/clear` decision) and flush."
  [session-atom]
  (let [artifact (swap! session-atom session/clear-messages (now-iso))]
    (await (write-artifact! artifact))
    artifact))

(defn ^:async list-sessions
  "Return summaries of all parseable session artifacts, newest first.
  Files that fail to parse or validate are skipped."
  []
  (let [dir (session/sessions-dir (eta-mu-home))]
    (if-not (fs/file-exists? dir)
      []
      (let [ids (->> (fs/list-dir dir)
                     (remove :dir?)
                     (map :name)
                     (filter #(str/ends-with? % ".edn"))
                     (map #(subs % 0 (- (count %) 4))))]
        (loop [remaining ids
               artifacts []]
          (if-let [more (seq remaining)]
            (let [artifact (try
                             (await (load-artifact (first more)))
                             (catch :default _ nil))]
              (recur (rest more)
                     (if artifact (conj artifacts artifact) artifacts)))
            (vec (reverse (sort-by :updated-at (map session/summary artifacts))))))))))
