(ns axxium.domain.identity
  "Pure identity projection and authorization decisions."
  (:require [axxium.law.identity :as law]
            [axxium.shape.identity :as shape]))

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
  (get-in state [:principals (get-in state [:aliases (shape/normalize-identifier identifier) :principal-id])]))

(defn require-free-identifiers!
  "Refuse already claimed signup aliases both before hashing and at atomic admission."
  [state username email]
  (law/require! (not (or (get-in state [:aliases username]) (get-in state [:aliases email])))
                :identifier-exists "Username or email is already registered"))

(defn signup-transition
  "Admit aliases and construct one complete signup transaction from explicit inputs.

  Call this inside the provider transaction even after an inexpensive preflight;
  another writer may claim an alias while the credential is being prepared."
  [state input]
  (let [{:keys [actor private-ref token token-hash issued-at expires-at]} (law/validate-signup-admission! input)
        actor-id (:principal/id actor)
        username (:principal/username actor)
        email (:principal/email actor)]
    (law/require! (and (law/valid-username? username) (law/valid-email? email)
                       (= username (shape/normalize-identifier username))
                       (= email (shape/normalize-identifier email))
                       (= :human (:principal/kind actor)) (law/active? actor)
                       (= ["basic-user"] (:principal/roles actor))
                       (empty? (:principal/capabilities actor)))
                  :invalid-signup-principal "Signup requires a basic human identity with valid aliases")
    (require-free-identifiers! state username email)
    (law/require! (not (or (get-in state [:principals actor-id])
                           (get-in state [:credentials (str "password:" actor-id)])
                           (get-in state [:sessions token-hash])))
                  :signup-identity-collision "Signup cannot replace an existing identity or session")
    {:operation :signup :actor actor-id
     :changes [(put :principals actor-id actor)
               (put :aliases username {:principal-id actor-id})
               (put :aliases email {:principal-id actor-id})
               (put :credentials (str "password:" actor-id) {:principal-id actor-id :private-ref private-ref})
               (put :sessions token-hash {:principal-id actor-id :issued-at issued-at :expires-at expires-at})]
     :result {:ok true :principal actor :token token}}))

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
