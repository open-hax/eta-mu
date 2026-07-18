(ns open-hax.sol.infra.agent.transcript
  "Session transcript building and message conversion."
  (:require [clojure.string :as str]
            [open-hax.sol.infra.agent.message :refer [sync-system-message]]
            [open-hax.sol.domain.agent.content :refer [nonblank assistant-content-parts session-message-text]]
            [open-hax.sol.shape.agent :refer [messages]]))

(defn- message-role
  [message]
  (if (map? message)
    (some-> (:role message) name)
    (some-> (aget message "role") str)))

(defn- message-usage
  [message]
  (if (map? message)
    (:usage message)
    (when-let [raw-usage (aget message "usage")]
      (js->clj raw-usage :keywordize-keys true))))

(defn ^:export session->stored-messages
  "Exported simplified variant (no content-parts).  Used by tests and recovery."
  [session]
  (let [msgs (when session (messages session))]
    (->> msgs
         (keep (fn [message]
                 (let [role (message-role message)
                       text (some-> (session-message-text message) nonblank)]
                   (when (and (contains? #{"user" "assistant" "system"} role)
                              text)
                     {:role role
                      :content text}))))
         vec)))

(defn- transcript-messages
  "Internal richer variant that preserves assistant content-parts and compaction summaries."
  [session]
  (let [msgs (when session (messages session))]
    (->> msgs
         (keep (fn [message]
                 (let [role (message-role message)
                       summary (and (not (map? message))
                                    (some-> (aget message "summary") nonblank))
                       text (some-> (session-message-text message) nonblank)
                       usage (message-usage message)
                       ;; Despite the name, assistant-content-parts extracts media parts from any
                       ;; pi message content array. We must persist user-side content parts too,
                       ;; otherwise restored sessions lose multimodal inputs.
                       parts (assistant-content-parts message)]
                   (cond
                     (and (= "compactionSummary" role) summary)
                     (cond-> {:role role
                              :summary summary
                              :content summary}
                       (number? (aget message "tokensBefore"))
                       (assoc :tokensBefore (aget message "tokensBefore")))

                     (and (contains? #{"user" "assistant" "system"} role)
                          (or text (seq parts)))
                     (cond-> {:role role}
                       text (assoc :content text)
                       (seq parts) (assoc :content-parts parts)
                       (and (= "assistant" role) usage) (assoc :usage usage))

                     :else nil))))
         vec)))

(defn- append-message-if-novel
  [messages message]
  (let [items (vec (or messages []))
        last-message (peek items)
        comparable (fn [entry]
                     (select-keys entry [:role :content :content-parts]))]
    (if (= (comparable last-message) (comparable message))
      items
      (conj items message))))

(defn- requested-system-prompt
  [agent-spec]
  (some-> (:system-prompt agent-spec) str str/trim not-empty))

(defn ensure-system-message
  [messages agent-spec]
  (sync-system-message messages (requested-system-prompt agent-spec)))

(defn transcript-before-prompt
  [session user-message agent-spec]
  (-> (transcript-messages session)
      (ensure-system-message agent-spec)
      (append-message-if-novel user-message)))

(defn transcript-after-turn
  [session fallback-messages]
  (let [snapshot (transcript-messages session)]
    (if (seq snapshot)
      snapshot
      (vec fallback-messages))))
