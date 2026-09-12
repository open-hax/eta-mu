(ns open-hax.records.edn.services
  "All local service protocols backed by canonical Clio events and EDN projections."
  (:require [open-hax.openplanner-protocols :as protocols]
            [open-hax.services.domain.local :as domain]
            [open-hax.services.extern.api :as api]
            [open-hax.services.extern.local :as host]
            [open-hax.services.infra.local :as local]
            [open-hax.services.law.local :as law]))

(defn- change [op collection id value]
  (cond-> {:op op :collection collection :id id}
    (some? value) (assoc :value value)))

(defn- put! [store collection doc defaults]
  (law/validate-record! doc)
  (local/transact!
   store
   (fn [state]
     (let [id (or (:id doc) (:_id doc) (host/id))
           stored (merge defaults doc {:id id :_id id})]
       (law/require! (nil? (get-in state [collection id])) :duplicate-id
                     "Local service document id already exists")
       {:changes [(change :put collection id stored)] :result stored}))))

(defn- patch! [store collection id updates]
  (law/validate-record! updates)
  (law/require! (not-any? #(contains? updates %) [:id :_id])
                :immutable-id "Service document identity is immutable")
  (local/transact!
   store
   (fn [state]
     (when-let [old (get-in state [collection id])]
       {:changes [(change :patch collection id updates)]
        :result (merge old updates)}))))

(defn- get-doc [store collection id]
  (get-in (local/state store) [collection id]))

(defn- query [store collection filter-spec]
  (domain/documents (local/state store) collection filter-spec))

(defn- envelope-transition [state envelope]
  (law/require! (:valid (protocols/validate-envelope envelope))
                :invalid-envelope "Invalid service event envelope")
  (let [id (or (:event/id envelope) (host/id))]
    (if-let [old (get-in state [:events id])]
      (do
        ;; Persist the exact submitted map separately from generated defaults.
        ;; For older history with no intent record, only the entire stored map
        ;; is provably identical; a partial retry must fail closed.
        (law/require! (= envelope (get-in state [:event-intents id] old))
                      :event-id-collision "Event id carries different envelope data")
        {:result old})
      (let [stored (merge {:event/time (host/now)
                          :causal/root (host/id)
                          :session/id (host/id)
                          :delivery/mode "tell"}
                         envelope {:event/id id})]
        {:changes [(change :put :event-intents id envelope)
                   (change :put :events id stored)] :result stored}))))

(defn- append-envelope! [store envelope]
  (local/transact! store #(envelope-transition % envelope)))

(defn- user-result [type id]
  {:event/type type :payload {:userId id}})

(defn- safe-user [user] (dissoc user :credentials :password))

(defn- create-user! [store user]
  (law/validate-record! user)
  (law/require! (and (string? (:username user)) (seq (:username user))
                     (string? (:password user)) (seq (:password user)))
                :invalid-user "Local user requires a username and password")
  (let [stored (-> user
                   (dissoc :password)
                   (assoc :created-at (host/now)
                          :credentials (host/password-digest (:password user))))]
    (local/transact!
     store
     (fn [state]
       (law/require! (empty? (domain/documents state :users {:username (:username user)}))
                     :duplicate-username "Local username already exists")
       (let [id (or (:id user) (host/id))]
         (law/require! (nil? (get-in state [:users id])) :duplicate-id
                       "Local user id already exists")
         {:changes [(change :put :users id (assoc stored :id id :_id id))]
          :result (user-result "user.create.success" id)})))))

(defn- authenticate! [store credentials]
  (local/transact!
   store
   (fn [state]
     (let [user (first (domain/documents state :users {:username (:username credentials)}))
           ok? (and user (host/password-matches? (:password credentials) (:credentials user)))
           result (if ok?
                    (user-result "user.login.success" (:id user))
                    {:event/type "user.login.failure" :payload {:reason "invalid credentials"}})]
       ;; Credential verification and its admitted result share one history.
       ;; A concurrent credential update makes Clio refuse this stale append.
       (assoc (envelope-transition state result) :result result)))))

(defn- update-user! [store id updates]
  (law/validate-record! updates)
  (law/require! (not-any? #(contains? updates %) [:id :_id :credentials :created-at])
                :immutable-user-field "Use password to change local credentials; identity is immutable")
  (when (contains? updates :password)
    (law/require! (and (string? (:password updates)) (seq (:password updates)))
                  :invalid-password "Local password must be a non-empty string"))
  (local/transact!
   store
   (fn [state]
     (if-let [user (get-in state [:users id])]
       (let [updates (cond-> (dissoc updates :password)
                       (contains? updates :password)
                       (assoc :credentials (host/password-digest (:password updates))))
             username (get updates :username (:username user))]
         (law/require! (and (string? username) (seq username)
                            (not-any? #(not= id (:id %))
                                      (domain/documents state :users {:username username})))
                       :duplicate-username "Local username must be unique and non-empty")
         {:changes [(change :patch :users id updates)]
          :result (user-result "user.update.success" id)})
       {:result {:event/type "user.update.failure" :payload {:reason "user not found"}}}))))

(defrecord ClioEdnServices [store]
  protocols/EventAdmission
  (append-event! [_ envelope] (local/perform #(append-envelope! store envelope)))
  (append-events! [_ envelopes] (local/perform #(mapv (partial append-envelope! store) envelopes)))
  (query-events [_ filter-spec] (local/perform #(query store :events filter-spec)))
  (watch-events [_ filter-spec callback]
    (law/validate-query! filter-spec)
    (local/watch! store :events #(domain/matches? % filter-spec) callback))

  protocols/SessionManagement
  (create-session [_ opts]
    (local/perform #(put! store :sessions opts {:actor-id "unknown"
                                               :createdAt (host/now) :updatedAt (host/now)})))
  (get-session [_ id] (local/perform #(get-doc store :sessions id)))
  (update-session [_ id updates]
    (local/perform #(patch! store :sessions id (assoc (law/validate-record! updates)
                                                   :updatedAt (host/now)))))
  (close-session [_ id]
    (local/perform #(local/transact! store (fn [_] {:changes [(change :delete :sessions id nil)]}))))

  protocols/DocumentStorage
  (store-document [_ doc]
    (local/perform #(put! store :documents doc {:created-at (host/now) :updated-at (host/now)})))
  (get-document [_ id] (local/perform #(get-doc store :documents id)))
  (query-documents [_ filter-spec] (local/perform #(query store :documents filter-spec)))
  (archive-document [_ id]
    (local/perform #(do (patch! store :documents id {:archived true :updated-at (host/now)}) nil)))

  protocols/GraphOperations
  (add-node [_ node] (local/perform #(put! store :nodes node {})))
  (add-edge [_ edge] (local/perform #(put! store :edges edge {})))
  (query-neighbors [_ id opts] (local/perform #(domain/neighbors (local/state store) id opts)))
  (traverse [_ start opts] (local/perform #(domain/traverse (local/state store) start opts)))

  protocols/TranslationManagement
  (create-translation [_ translation] (local/perform #(put! store :translations translation {})))
  (label-translation [_ id label] (local/perform #(patch! store :translations id {:label label})))
  (batch-translate [_ batch]
    (local/perform
     #(let [batch-id (host/id)]
        (local/transact!
         store
         (fn [_]
           {:changes (mapv (fn [segment]
                             (let [id (host/id)]
                               (change :put :translations id
                                       (assoc (law/validate-record! segment)
                                              :id id :_id id :batch-id batch-id))))
                           batch)
            :result batch-id})))))

  protocols/LabelManagement
  (create-label [_ label] (local/perform #(put! store :labels label {})))
  (apply-label [_ label-id target-id target-type]
    (local/perform
     #(let [id (pr-str [label-id target-id target-type])]
        (local/transact!
         store
         (fn [state]
           (law/require! (some? (get-in state [:labels label-id])) :missing-label
                         "Cannot apply a missing label")
           {:changes (when-not (get-in state [:label-targets id])
                       [(change :put :label-targets id
                                {:labelId label-id :targetId target-id :targetType target-type})])})))))
  (query-by-label [_ label-id opts]
    (local/perform
     #(query store :label-targets
             (cond-> {:labelId label-id}
               (:target-type opts)
               (assoc :targetType (if (sequential? (:target-type opts))
                                    {:$in (:target-type opts)} (:target-type opts)))))))

  protocols/UserManagement
  (create-user [_ user] (local/perform #(create-user! store user)))
  (authenticate [_ credentials] (local/perform #(authenticate! store credentials)))
  (get-user [_ id] (local/perform #(some-> (get-doc store :users id) safe-user)))
  (update-user [_ id updates] (local/perform #(update-user! store id updates)))

  protocols/RealtimeSubscription
  (subscribe [_ room event-type callback]
    (local/watch! store :notifications
                  #(and (= room (:room %)) (= event-type (:event-type %)))
                  #(callback (:data %))))
  (unsubscribe [_ handle] ((:close! handle)))
  (emit-to-room [_ room event-type data]
    (local/perform
     #(do (put! store :notifications {:room room :event-type event-type :data data} {})
          nil))))

(defn create-edn-services
  "Open all eight service protocols without an external server.
   Local credentials are salted scrypt digests. Data lives in services.edn and
   schemas/. Reopen replays Clio history; malformed history is always refused."
  [directory]
  (->ClioEdnServices (local/open! directory)))

(defn create-edn-services-js [directory]
  (api/wrap (create-edn-services directory)))
