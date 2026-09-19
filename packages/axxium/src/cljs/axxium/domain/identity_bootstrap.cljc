(ns axxium.domain.identity-bootstrap
  "Pure, replayable first-administrator admission and unchanged restart validation."
  (:require [axxium.domain.identity :as identity]
            [axxium.law.identity :as law]
            [axxium.shape.identity :as shape]
            [clojure.string :as str]))

(defn existing
  "Describe current bootstrap credential verification without performing any effects."
  [state]
  (when-let [marker (get-in state [:credentials "system:bootstrap"])]
    (let [actor (get-in state [:principals (:principal-id marker)])]
      {:marker marker :actor actor
       :aliases (select-keys (:aliases state) [(:principal/username actor) (:principal/email actor)])
       :credential (get-in state [:credentials (str "password:" (:principal-id marker))])})))

(defn require-restart!
  "Bind verification to current active identity and explicitly configured coordinates."
  [{:keys [actor credential aliases] :as current} {:keys [username email principal-id]}]
  (law/require! (and current (law/active? actor) credential
                     (= username (:principal/username actor)) (= email (:principal/email actor))
                     (= (:principal/id actor) (:principal-id credential)
                        (get-in aliases [username :principal-id]) (get-in aliases [email :principal-id]))
                     (or (nil? principal-id) (= principal-id (:principal/id actor))))
                :bootstrap-mismatch "Bootstrap identity or credentials changed; explicit rotation is required")
  current)

(defn restart-transition
  "Accept verified unchanged bootstrap credentials against the admitted current history."
  [state {:keys [expected request verified?]}]
  (let [current (require-restart! (existing state) request)]
    (law/require! (and (true? verified?) (= expected current))
                  :bootstrap-mismatch "Bootstrap credentials changed during verification")
    {:operation :administrator-bootstrap-verified :changes [] :result (:actor current)}))

(defn create-transition
  "Create exactly one managed human administrator without replacing existing coordinates."
  [state {:keys [actor private-ref]}]
  (law/validate-principal! actor)
  (law/require! (and (string? private-ref) (not (str/blank? private-ref))
                     (law/active? actor) (= :human (:principal/kind actor))
                     (= ["system-admin"] (:principal/roles actor))
                     (= ["axxium/admin"] (:principal/capabilities actor))
                     (law/valid-username? (:principal/username actor))
                     (law/valid-email? (:principal/email actor))
                     (= (:principal/username actor) (shape/normalize-identifier (:principal/username actor)))
                     (= (:principal/email actor) (shape/normalize-identifier (:principal/email actor))))
                :invalid-bootstrap "Bootstrap admission requires a managed human administrator")
  (let [actor-id (:principal/id actor)
        username (:principal/username actor)
        email (:principal/email actor)
        password-key (str "password:" actor-id)]
    (law/require! (not (or (existing state) (get-in state [:principals actor-id])
                           (get-in state [:credentials password-key])
                           (get-in state [:aliases username]) (get-in state [:aliases email])))
                  :bootstrap-collision "Bootstrap would replace an existing identity; refusing")
    {:operation :administrator-bootstrapped :actor "axxium-bootstrap"
     :changes [(identity/put :principals actor-id actor)
               (identity/put :aliases username {:principal-id actor-id})
               (identity/put :aliases email {:principal-id actor-id})
               (identity/put :credentials password-key {:principal-id actor-id :private-ref private-ref})
               (identity/put :credentials "system:bootstrap" {:principal-id actor-id})]
     :result actor}))
