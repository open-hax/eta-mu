(ns eta-mu.domain.session
  "Pure decisions for agent session artifacts.

  A session artifact is the persistable shadow of an agent context:
  `:system-prompt` + canonical `:messages` + resume metadata. Everything
  here is pure; all file I/O lives in `eta-mu.infra.session` behind
  `eta-mu.extern.fs`."
  (:require [eta-mu.extern.path :as path]))

(def artifact-version 1)

(defn sessions-dir
  "Return the directory holding session artifacts under the eta-mu home."
  [eta-mu-home]
  (path/join eta-mu-home "sessions"))

(defn session-file
  "Return the artifact file path for a session id under the eta-mu home."
  [eta-mu-home session-id]
  (path/join (sessions-dir eta-mu-home) (str session-id ".edn")))

(defn new-session-id
  "Build a session id from a Date and a random hex string:
  `yyyyMMdd-HHmmss-<rand-hex>` (UTC)."
  [date rand-hex]
  (let [pad (fn [n] (if (< n 10) (str "0" n) (str n)))]
    (str (.getUTCFullYear date)
         (pad (inc (.getUTCMonth date)))
         (pad (.getUTCDate date))
         "-"
         (pad (.getUTCHours date))
         (pad (.getUTCMinutes date))
         (pad (.getUTCSeconds date))
         "-"
         rand-hex)))

(defn new-artifact
  "Build a fresh session artifact with an empty transcript."
  [{:keys [session-id cwd model system-prompt now-iso]}]
  {:version artifact-version
   :session-id session-id
   :cwd cwd
   :created-at now-iso
   :updated-at now-iso
   :model model
   :system-prompt system-prompt
   :messages []})

(defn append-turn
  "Append one user message and the turn's new messages to an artifact."
  [artifact user-message new-messages now-iso]
  (-> artifact
      (update :messages into (into [user-message] new-messages))
      (assoc :updated-at now-iso)))

(defn clear-messages
  "Reset an artifact's transcript (the `/clear` decision)."
  [artifact now-iso]
  (-> artifact
      (assoc :messages [])
      (assoc :updated-at now-iso)))

(defn artifact->context
  "Rebuild a live agent context from an artifact, attaching `tools` from
  the live registry (tools are never persisted)."
  [artifact tools]
  {:system-prompt (:system-prompt artifact)
   :messages (:messages artifact)
   :tools tools})

(defn summary
  "Project an artifact to the row shape used by session listings."
  [artifact]
  (let [first-user (first (filter #(= :user (:role %)) (:messages artifact)))
        content (:content first-user)
        preview (if (string? content)
                  content
                  (transduce (comp (filter #(= :text (:type %))) (map :text)) str content))]
    {:session-id (:session-id artifact)
     :updated-at (:updated-at artifact)
     :model (get-in artifact [:model :id])
     :cwd (:cwd artifact)
     :message-count (count (:messages artifact))
     :preview (subs preview 0 (min (count preview) 60))}))
