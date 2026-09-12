(ns axxium.infra.identity
  "Axxium identity commands shared by the browser plugin and agent clients."
  (:require [axxium.domain.identity :as domain]
            [axxium.extern.credential-crypto :as crypto]
            [axxium.extern.identity-host :as host]
            [axxium.extern.identity-http :as http]
            [axxium.infra.identity-store :as store]
            [axxium.law.identity :as law]
            [clojure.string :as str]))

(def session-ttl-ms "Default session lifetime, bounded by server policy." (* 24 60 60 1000))
(def challenge-ttl-ms "Authentication proofs expire after five minutes." (* 5 60 1000))

(defn open!
  "Create an identity service with explicit persistence and public origin."
  [{:keys [provider directory public-base-url] :as options}]
  (law/require! (seq public-base-url) :missing-public-origin "Axxium public origin is required")
  (let [origin (http/origin public-base-url)]
    (law/require! (and origin (or (str/starts-with? origin "http://") (str/starts-with? origin "https://")))
                  :invalid-public-origin "Identity requires an HTTP(S) public origin")
    {:store (store/create-provider {:provider (or provider :edn) :directory directory})
     :options (assoc options :public-base-url origin :rp-id (or (:rp-id options) (http/hostname origin)))}))

(defn resolve-principal
  "Resolve an opaque session token to the current active principal, or nil."
  [{:keys [store]} token]
  (when (and (string? token) (seq token))
    (domain/principal-for-session (store/state store) (host/sha256 token) (host/now))))

(defn resolve-active-principal
  "Resolve a verified delegated-token subject by immutable actor ID, never email."
  [{:keys [store]} principal-id]
  (when-let [principal (get-in (store/state store) [:principals principal-id])]
    (when (law/active? principal) (law/validate-principal! principal))))

(defn require-principal!
  "Refuse unauthenticated credential enrollment or account mutation."
  [service token]
  (let [principal (resolve-principal service token)]
    (law/require! principal :unauthenticated "Authentication required")
    principal))

(defn- principal [username email display-name]
  (law/validate-principal!
   (cond-> {:principal/id (str "actor_" (host/id))
            :principal/entity-id (str "entity_" (host/id))
            :principal/kind :human :principal/username username
            :principal/display-name (or (not-empty display-name) username)
            :principal/status :active :principal/roles ["basic-user"]
            :principal/capabilities []}
     (seq email) (assoc :principal/email email))))

(defn- session-change [principal token]
  (domain/put :sessions (host/sha256 token)
              {:principal-id (:principal/id principal)
               :expires-at (+ (host/now) session-ttl-ms)}))

(defn- login-result [principal token]
  {:ok true :principal principal :token token})

(defn ^:async signup!
  "Atomically register username/email aliases, credential and the first session."
  [{:keys [store]} {:keys [username email password display-name]}]
  (let [email (law/normalize-identifier email)
        username (law/normalize-identifier username)]
    (law/require! (law/valid-username? username) :invalid-username "Username must be 3–64 letters, numbers, dots, underscores or hyphens")
    (law/require! (law/valid-email? email) :invalid-email "A valid email is required")
    (law/require! (and (string? password) (<= 12 (count password) 1024))
                  :invalid-password "Password must contain 12–1024 characters")
    (let [credential (await (crypto/hash-password password))
          reference (store/seal! store credential)
          actor (principal username email display-name)
          actor-id (:principal/id actor)
          token (host/random-token)]
      (store/transact!
       store
       (fn [state]
         (law/require! (not (or (get-in state [:aliases username]) (get-in state [:aliases email])))
                       :identifier-exists "Username or email is already registered")
         {:operation :signup :actor actor-id
          :changes [(domain/put :principals actor-id actor)
                    (domain/put :aliases username {:principal-id actor-id})
                    (domain/put :aliases email {:principal-id actor-id})
                    (domain/put :credentials (str "password:" actor-id) {:principal-id actor-id :private-ref reference})
                    (session-change actor token)]
          :result (login-result actor token)})))))

(defn ^:async login!
  "Authenticate by username OR email, then commit a session against unchanged credentials."
  [{:keys [store]} {:keys [identifier email username password]}]
  (let [actor (domain/principal-by-identifier (store/state store) (or identifier email username))
        key (str "password:" (:principal/id actor))
        record (get-in (store/state store) [:credentials key])
        valid? (and (law/active? actor) record (string? password)
                    (await (crypto/verify-password password (store/unseal store (:private-ref record)))))
        token (host/random-token)]
    (law/require! valid? :invalid-credentials "Invalid username or password")
    (store/transact!
     store
     (fn [state]
       (let [current (get-in state [:principals (:principal/id actor)])]
         (law/require! (and (law/active? current) (= record (get-in state [:credentials key])))
                       :invalid-credentials "Credentials changed during authentication")
         {:operation :login :actor (:principal/id actor)
          :changes [(session-change current token)] :result (login-result current token)})))))

(defn ^:async bootstrap!
  "Provision the explicit first administrator atomically; never promote an existing signup."
  [{:keys [store]} {:keys [username email password display-name principal-id]}]
  (let [username (law/normalize-identifier username)
        email (law/normalize-identifier email)
        state (store/state store)
        marker (get-in state [:credentials "system:bootstrap"])]
    (law/require! (and (law/valid-username? username) (law/valid-email? email)
                       (string? password) (<= 12 (count password) 1024))
                  :invalid-bootstrap "Bootstrap requires a valid username, email and 12+ character password")
    (if marker
      (let [actor (get-in state [:principals (:principal-id marker)])
            credential (get-in state [:credentials (str "password:" (:principal-id marker))])]
        (law/require! (and (law/active? actor) (= username (:principal/username actor))
                           (= email (:principal/email actor))
                           (or (nil? principal-id) (= principal-id (:principal/id actor)))
                           credential
                           (await (crypto/verify-password password (store/unseal store (:private-ref credential)))))
                      :bootstrap-mismatch "Bootstrap identity or credentials changed; explicit rotation is required")
        actor)
      (let [actor (cond-> (assoc (principal username email display-name)
                                 :principal/roles ["system-admin"] :principal/capabilities ["axxium/admin"])
                    principal-id (assoc :principal/id principal-id))
            _ (law/validate-principal! actor)
            reference (store/seal! store (await (crypto/hash-password password)))
            actor-id (:principal/id actor)]
        (store/transact!
         store (fn [state]
                 (law/require! (not (or (get-in state [:credentials "system:bootstrap"])
                                        (get-in state [:principals actor-id])
                                        (get-in state [:aliases username]) (get-in state [:aliases email])))
                               :bootstrap-collision "Bootstrap would replace an existing identity; refusing")
                 {:operation :administrator-bootstrapped :actor "axxium-bootstrap"
                  :changes [(domain/put :principals actor-id actor)
                            (domain/put :aliases username {:principal-id actor-id})
                            (domain/put :aliases email {:principal-id actor-id})
                            (domain/put :credentials (str "password:" actor-id) {:principal-id actor-id :private-ref reference})
                            (domain/put :credentials "system:bootstrap" {:principal-id actor-id})]
                  :result actor}))))))

(defn logout!
  "Commit session revocation before acknowledging logout."
  [{:keys [store]} token]
  (when (seq token)
    (store/transact! store (fn [state]
                            (let [key (host/sha256 token)]
                              {:operation :logout
                               :changes (when (get-in state [:sessions key]) [(domain/remove-entry :sessions key)])
                               :result {:ok true}}))))
  {:ok true})

(defn update-grants!
  "Only an authenticated identity administrator may grant or revoke capabilities."
  [{:keys [store] :as service} token principal-id roles capabilities]
  (let [requester (require-principal! service token)]
    (law/require! (and (vector? roles) (every? string? roles)
                       (vector? capabilities) (every? string? capabilities))
                  :invalid-grants "Roles and capabilities must be string vectors")
    (store/transact!
     store
     (fn [state]
       (law/require! (domain/can-grant? (domain/principal-for-session state (host/sha256 token) (host/now)))
                     :forbidden "Identity administrator capability required")
       (let [target (get-in state [:principals principal-id])]
         (law/require! target :not-found "Principal not found")
         {:operation :grants-updated :actor (:principal/id requester)
          :changes [(domain/put :principals principal-id
                                (assoc target :principal/roles roles :principal/capabilities capabilities))]
          :result {:ok true}})))))

(defn challenge!
  "Persist single-use browser-bound state; sensitive payload is encrypted separately."
  [{:keys [store]} browser-token purpose data]
  (law/require! (and (string? browser-token) (>= (count browser-token) 32)) :invalid-browser "Authentication browser binding required")
  (let [id (host/id)
        reference (store/seal! store data)
        value {:purpose purpose :browser-hash (host/sha256 browser-token)
               :expires-at (+ (host/now) challenge-ttl-ms) :private-ref reference}]
    (store/transact! store (fn [_] {:operation :challenge-issued
                                    :changes [(domain/put :challenges id value)] :result id}))))

(defn read-challenge
  "Load the protected challenge after its browser and expiry guards pass."
  [{:keys [store]} browser-token id purpose]
  (let [record (domain/require-challenge! (store/state store) id purpose
                                         (host/sha256 (or browser-token "")) (host/now))]
    (store/unseal store (:private-ref record))))

(defn- consume-changes [state id purpose browser-token]
  (domain/require-challenge! state id purpose (host/sha256 browser-token) (host/now))
  [(domain/remove-entry :challenges id)])

(defn- ^:async verify-proof! [verify]
  (try (await (verify))
       (catch :default _ (throw (ex-info "Invalid authentication proof" {:code :invalid-credentials})))))

(defn ^:async enroll-pgp!
  "Link a public PGP key only after a logged-in user proves possession."
  [{:keys [store] :as service} token browser-token {:keys [challenge-id signature public-key]}]
  (let [actor (require-principal! service token)
        data (read-challenge service browser-token challenge-id :pgp-enroll)
        proof (await (verify-proof! #(crypto/verify-pgp {:public-key public-key :signature signature :challenge (:challenge data)})))
        fingerprint (:fingerprint proof)
        key (str "pgp:" fingerprint)
        reference (store/seal! store {:public-key public-key})]
    (law/require! (= (:principal/id actor) (:principal-id data)) :invalid-challenge "Challenge belongs to another account")
    (store/transact!
     store (fn [state]
             (law/require! (and (resolve-principal service token) (not (get-in state [:credentials key])))
                           :credential-exists "Key is already registered or session expired")
             {:operation :pgp-enrolled :actor (:principal/id actor)
              :changes (conj (consume-changes state challenge-id :pgp-enroll browser-token)
                             (domain/put :credentials key {:principal-id (:principal/id actor) :private-ref reference}))
              :result {:ok true :fingerprint fingerprint}}))))

(defn pgp-challenge!
  "Issue a domain-separated PGP proof challenge for enrollment or login."
  [service token browser-token {:keys [purpose fingerprint]}]
  (let [enroll? (= purpose :enroll)
        actor (when enroll? (require-principal! service token))
        challenge (str "Axxium " (if enroll? "key enrollment" "login") "\n"
                       (get-in service [:options :public-base-url]) "\n" (host/random-token))
        id (challenge! service browser-token (if enroll? :pgp-enroll :pgp-login)
                       {:challenge challenge :principal-id (:principal/id actor) :fingerprint fingerprint})]
    {:challenge-id id :challenge challenge}))

(defn ^:async pgp-login!
  "Verify a registered PGP key and consume its proof in the session transaction."
  [{:keys [store] :as service} browser-token {:keys [challenge-id signature]}]
  (let [data (read-challenge service browser-token challenge-id :pgp-login)
        key (str "pgp:" (:fingerprint data))
        record (get-in (store/state store) [:credentials key])]
    (law/require! record :invalid-credentials "Invalid PGP credential")
    (let [public-key (:public-key (store/unseal store (:private-ref record)))]
      (await (verify-proof! #(crypto/verify-pgp {:public-key public-key :signature signature :challenge (:challenge data)}))))
    (let [token (host/random-token)]
      (store/transact!
       store (fn [state]
               (let [actor (get-in state [:principals (:principal-id record)])]
                 (law/require! (and (law/active? actor) (= record (get-in state [:credentials key])))
                               :invalid-credentials "Invalid PGP credential")
                 {:operation :pgp-login :actor (:principal/id actor)
                  :changes (conj (consume-changes state challenge-id :pgp-login browser-token) (session-change actor token))
                  :result (login-result actor token)}))))))

(defn- passkeys [state principal-id]
  (->> (:credentials state)
       (keep (fn [[key value]] (when (and (str/starts-with? key "passkey:")
                                         (= principal-id (:principal-id value))) (:credential value))))
       vec))

(defn ^:async passkey-registration-options!
  "Start authenticated passkey enrollment for the current account."
  [{:keys [store options] :as service} token browser-token]
  (let [actor (require-principal! service token)
        result (await (crypto/registration-options
                       {:rp-id (:rp-id options) :rp-name "Axxium"
                        :user-id (:principal/id actor) :user-name (:principal/username actor)
                        :display-name (:principal/display-name actor)
                        :credentials (passkeys (store/state store) (:principal/id actor))}))
        id (challenge! service browser-token :passkey-enroll
                       {:challenge (:challenge result) :principal-id (:principal/id actor)})]
    {:challenge-id id :options result}))

(defn ^:async passkey-registration-verify!
  "Verify browser attestation before linking the new passkey to its principal."
  [{:keys [store options] :as service} token browser-token {:keys [challenge-id response]}]
  (let [actor (require-principal! service token)
        data (read-challenge service browser-token challenge-id :passkey-enroll)
        result (await (verify-proof! #(crypto/verify-registration {:response response :challenge (:challenge data)
                                                                  :origin (:public-base-url options) :rp-id (:rp-id options)})))
        _ (law/require! (:verified? result) :invalid-credentials "Passkey registration could not be verified")
        credential (:credential result)
        key (str "passkey:" (:id credential))]
    (law/require! (= (:principal/id actor) (:principal-id data)) :invalid-challenge "Challenge belongs to another account")
    (store/transact!
     store (fn [state]
             (law/require! (and (resolve-principal service token) (not (get-in state [:credentials key])))
                           :credential-exists "Passkey is already registered or session expired")
             {:operation :passkey-enrolled :actor (:principal/id actor)
              :changes (conj (consume-changes state challenge-id :passkey-enroll browser-token)
                             (domain/put :credentials key {:principal-id (:principal/id actor) :credential credential}))
              :result {:ok true :credential-id (:id credential)}}))))

(defn ^:async passkey-authentication-options!
  "Generate discoverable-credential authentication options without account enumeration."
  [{:keys [options] :as service} browser-token]
  (let [result (await (crypto/authentication-options {:rp-id (:rp-id options) :credentials []}))
        id (challenge! service browser-token :passkey-login {:challenge (:challenge result)})]
    {:challenge-id id :options result}))

(defn ^:async passkey-authentication-verify!
  "Consume a valid assertion and advance the signature counter atomically with login."
  [{:keys [store options] :as service} browser-token {:keys [challenge-id response]}]
  (let [data (read-challenge service browser-token challenge-id :passkey-login)
        key (str "passkey:" (:id response))
        record (get-in (store/state store) [:credentials key])]
    (law/require! record :invalid-credentials "Invalid passkey credential")
    (let [proof (await (verify-proof! #(crypto/verify-authentication
                        {:response response :challenge (:challenge data) :origin (:public-base-url options)
                         :rp-id (:rp-id options) :credential (:credential record)})))
          token (host/random-token)]
      (law/require! (:verified? proof) :invalid-credentials "Invalid passkey signature")
      (when-let [user-handle (get-in response [:response :userHandle])]
        (law/require! (= (host/base64url (:principal-id record)) user-handle)
                      :invalid-credentials "Passkey user handle mismatch"))
      (store/transact!
       store (fn [state]
               (let [actor (get-in state [:principals (:principal-id record)])]
                 (law/require! (and (law/active? actor) (= record (get-in state [:credentials key])))
                               :invalid-credentials "Passkey changed during authentication")
                 {:operation :passkey-login :actor (:principal/id actor)
                  :changes (into (consume-changes state challenge-id :passkey-login browser-token)
                                 [(domain/put :credentials key (assoc-in record [:credential :counter] (:counter proof)))
                                  (session-change actor token)])
                  :result (login-result actor token)}))))))

(defn accept-external!
  "Bind a verified issuer/subject; email alone never links or claims an existing account."
  [{:keys [store] :as service} browser-token challenge-id purpose verified]
  (let [{:keys [issuer subject email display-name]} verified
        data (read-challenge service browser-token challenge-id purpose)
        identity-key (pr-str [issuer subject])
        new-actor (principal (str "member-" (subs (host/id) 0 12)) nil display-name)
        token (host/random-token)]
    (law/require! (and (string? issuer) (seq issuer) (string? subject) (seq subject))
                  :invalid-provider-identity "Provider returned an invalid verified identity")
    (store/transact!
     store
     (fn [state]
       (let [binding (get-in state [:identities identity-key])
             link-id (:link-principal-id data)
             actor-id (or link-id (:principal-id binding) (:principal/id new-actor))
             existing (get-in state [:principals actor-id])
             actor (or existing new-actor)
             changes (consume-changes state challenge-id purpose browser-token)]
         (when link-id
           (law/require! (= link-id (:principal/id (domain/principal-for-session state (:link-session-hash data) (host/now))))
                         :unauthenticated "Linking session expired")
           (law/require! (or (nil? binding) (= link-id (:principal-id binding)))
                         :identity-already-linked "This external identity belongs to another account"))
         (law/require! (law/active? actor) :invalid-credentials "Identity is not active")
         {:operation (if link-id :external-identity-linked :external-login) :actor actor-id
          :changes (into changes
                         (concat (when-not existing
                                   [(domain/put :principals actor-id actor)
                                    (domain/put :aliases (:principal/username actor) {:principal-id actor-id})])
                                 [(domain/put :identities identity-key
                                              (cond-> {:principal-id actor-id :issuer issuer :subject subject}
                                                (and (string? email) (law/valid-email? email)) (assoc :provider-email email)))
                                  (session-change actor token)]))
          :result (assoc (login-result actor token) :redirect (law/safe-redirect (:redirect data)))})))))
