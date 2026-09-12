(ns axxium.domain.identity
  "Pure identity projection and authorization decisions."
  (:require [axxium.law.identity :as law]))

(defn apply-event
  "Replay a complete atomic identity change."
  [state event]
  (reduce (fn [state {:keys [collection key value]}]
            (if (some? value)
              (assoc-in state [collection key] value)
              (update state collection dissoc key)))
          state (get-in event [:event/data :changes])))

(defn put
  "Declare one value replaced by a transaction."
  [collection key value]
  {:collection collection :key key :value value})

(defn remove-entry
  "Declare one value removed by a transaction."
  [collection key]
  {:collection collection :key key})

(defn principal-by-identifier
  "Resolve a username or email alias to a principal."
  [state identifier]
  (get-in state [:principals (get-in state [:aliases (law/normalize-identifier identifier) :principal-id])]))

(defn principal-for-session
  "A session is useful only while it and the principal remain active."
  [state token-hash now]
  (let [{:keys [principal-id expires-at]} (get-in state [:sessions token-hash])
        principal (get-in state [:principals principal-id])]
    (when (and (number? expires-at) (> expires-at now) (law/active? principal)) principal)))

(defn require-challenge!
  "Bind single-use authentication proofs to purpose, browser and identity."
  [state challenge-id purpose browser-hash now]
  (let [challenge (get-in state [:challenges challenge-id])]
    (law/require! (and challenge (= purpose (:purpose challenge))
                       (= browser-hash (:browser-hash challenge))
                       (> (:expires-at challenge) now))
                  :invalid-challenge "Invalid or expired authentication challenge")
    challenge))

(defn can-grant?
  "Only an identity administrator can change grants; self-service is not authority."
  [requester]
  (and (law/active? requester)
       (some #{"axxium/admin"} (:principal/capabilities requester))))
