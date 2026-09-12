(ns axxium.extern.credential-crypto
  "Credential cryptography only. Callers own enrollment authority, single-use
   challenges, account binding, expiry, and atomic signature-counter updates.
   All public inputs and outputs are EDN data; host and SDK values stay here."
  (:require [clojure.string :as str]
            ["node:buffer" :refer [Buffer]]
            ["node:crypto" :as crypto]
            ["node:util" :refer [promisify]]
            ["openpgp" :as pgp]
            ["@simplewebauthn/server" :as webauthn]))

(def ^:private scrypt-async (promisify (.-scrypt crypto)))
;; OWASP's 32 MiB scrypt configuration trades CPU for bounded local memory.
;; https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#scrypt
(def ^:private scrypt-options #js {:N 32768 :r 8 :p 3 :maxmem 67108864})

(defn- require-text! [value label maximum]
  (when-not (and (string? value) (pos? (count value))
                 (<= (.byteLength Buffer value "utf8") maximum))
    (throw (ex-info (str "Invalid " label) {:type :invalid-credential-input})))
  value)

(defn- encode-bytes [bytes]
  (.toString ^js (.from Buffer bytes) "base64url"))

(defn- decode-bytes [value]
  (when-not (and (string? value) (re-matches #"[A-Za-z0-9_-]+" value))
    (throw (ex-info "Invalid base64url credential bytes"
                    {:type :invalid-credential-input})))
  (let [decoded (.from Buffer value "base64url")]
    (when-not (= value (encode-bytes decoded))
      (throw (ex-info "Noncanonical base64url credential bytes"
                      {:type :invalid-credential-input})))
    decoded))

(defn ^:async hash-password
  "Return a private, versioned scrypt record. Cost parameters are fixed by the
   version, never accepted from an untrusted request or persisted record."
  [password]
  (require-text! password "password" 1024)
  (let [salt (.randomBytes crypto 16)
        hash (await (scrypt-async password salt 64 scrypt-options))]
    {:scheme :scrypt :version 1 :salt (encode-bytes salt) :hash (encode-bytes hash)}))

(defn ^:async verify-password
  "Verify a private scrypt record using constant-time comparison. Malformed
   or unsupported records fail closed without exposing credential material."
  [password {:keys [scheme version salt hash]}]
  (try
    (require-text! password "password" 1024)
    (if (and (= :scrypt scheme) (= 1 version)
             (string? salt) (= 22 (count salt))
             (string? hash) (= 86 (count hash)))
      (let [salt-bytes (decode-bytes salt)
            hash-bytes (decode-bytes hash)]
        (if (and (= 16 (.-length ^js salt-bytes))
                 (= 64 (.-length ^js hash-bytes)))
          (.timingSafeEqual crypto hash-bytes
                            (await (scrypt-async password salt-bytes 64 scrypt-options)))
          false))
      false)
    (catch :default _ false)))

(def ^:private dummy-password-record
  ;; Fixed canonical byte lengths exercise the same versioned scrypt work.
  ;; This is not a credential: its comparison result never authorizes login.
  {:scheme :scrypt :version 1 :salt "AAAAAAAAAAAAAAAAAAAAAA"
   :hash (apply str (repeat 86 "A"))})

(defn ^:async verify-password-or-dummy
  "Perform one bounded scrypt verification for known and unknown identities.
   A missing credential always returns false after the dummy comparison."
  [password credential]
  (let [verified? (await (verify-password password (or credential dummy-password-record)))]
    (boolean (and credential verified?))))

(defn- require-armored-block! [armored label]
  ;; OpenPGP.js reads the first armored block and can ignore trailing blocks.
  ;; Credential inputs must represent exactly one complete envelope.
  (when-not (and (re-matches (re-pattern (str "^\\s*-----BEGIN PGP " label
                                            "-----[\\s\\S]*-----END PGP " label
                                            "-----\\s*$")) armored)
                 (= 1 (count (re-seq #"-----BEGIN PGP " armored)))
                 (= 1 (count (re-seq #"-----END PGP " armored))))
    (throw (ex-info (str "Exactly one armored PGP " (str/lower-case label) " is required")
                    {:type :invalid-credential-input}))))

(defn- ^:async read-public-key [armored]
  (require-text! armored "PGP public key" 131072)
  (require-armored-block! armored "PUBLIC KEY BLOCK")
  (let [keys (await (.readKeys pgp #js {:armoredKeys armored}))]
    (when-not (= 1 (.-length ^js keys))
      (throw (ex-info "Exactly one PGP public key is required"
                      {:type :invalid-credential-input})))
    (let [key (aget keys 0)]
      (when (.isPrivate ^js key)
        (throw (ex-info "Private keys must never be submitted"
                        {:type :invalid-credential-input})))
      (await (.verifyPrimaryKey ^js key))
      key)))

(defn ^:async pgp-fingerprint
  "Return the complete uppercase primary-key fingerprint of one valid public
   key. A short key ID or a user ID/email is never an identity binding."
  [armored-public-key]
  (let [key (await (read-public-key armored-public-key))]
    (str/upper-case (.getFingerprint ^js key))))

(defn ^:async verify-pgp
  "Verify one detached armored signature over the exact UTF-8 challenge bytes.
   No whitespace or newline normalization occurs. Invalid proofs reject."
  [{:keys [public-key signature challenge]}]
  (require-text! signature "PGP signature" 32768)
  (require-armored-block! signature "SIGNATURE")
  (require-text! challenge "PGP challenge" 4096)
  (let [key (await (read-public-key public-key))
        proof (await (.readSignature pgp #js {:armoredSignature signature}))
        message (await (.createMessage pgp #js {:binary (.from Buffer challenge "utf8")}))
        verified (await (.verify pgp #js {:message message
                                         :signature proof
                                         :verificationKeys key
                                         :format "binary"}))
        signatures (.-signatures ^js verified)]
    (when-not (= 1 (.-length ^js signatures))
      ;; SDK verification promises can reject independently. Settle them before
      ;; refusing multiple signatures so malformed input cannot become an
      ;; unhandled rejection in the server process.
      (await (.allSettled js/Promise
                         (to-array (map #(.-verified ^js %)
                                        (array-seq signatures)))))
      (throw (ex-info "Exactly one detached PGP signature is required"
                      {:type :invalid-credential-input})))
    (await (.-verified ^js (aget signatures 0)))
    {:verified? true :fingerprint (str/upper-case (.getFingerprint ^js key))}))

(defn- credential-descriptors [credentials]
  (mapv (fn [{:keys [id transports]}]
          (decode-bytes id)
          (cond-> {:id id} (seq transports) (assoc :transports transports)))
        credentials))

(defn ^:async registration-options
  "Generate browser registration options. Persist :challenge and :user/:id
   with the authenticated enrollment owner before returning these options."
  [{:keys [rp-id rp-name user-id user-name display-name credentials]}]
  (require-text! rp-id "relying party ID" 253)
  (require-text! rp-name "relying party name" 256)
  (require-text! user-id "WebAuthn user ID" 64)
  (require-text! user-name "WebAuthn user name" 256)
  (js->clj
   (await (.generateRegistrationOptions
           webauthn
           (clj->js {:rpID rp-id
                     :rpName rp-name
                     :userID (.from Buffer user-id "utf8")
                     :userName user-name
                     :userDisplayName (or display-name user-name)
                     :attestationType "none"
                     :excludeCredentials (credential-descriptors credentials)
                     :authenticatorSelection {:residentKey "required"
                                              :userVerification "required"}})))
   :keywordize-keys true))

(defn ^:async authentication-options
  "Generate browser authentication options; empty credentials permit a
   discoverable passkey. Resolve its ID and user handle to one owner on finish."
  [{:keys [rp-id credentials]}]
  (require-text! rp-id "relying party ID" 253)
  (js->clj
   (await (.generateAuthenticationOptions
           webauthn
           (clj->js {:rpID rp-id
                     :allowCredentials (credential-descriptors credentials)
                     :userVerification "required"})))
   :keywordize-keys true))

(defn- verification-context! [challenge origin rp-id]
  (require-text! challenge "WebAuthn challenge" 1024)
  (require-text! origin "WebAuthn expected origin" 2048)
  (require-text! rp-id "WebAuthn expected relying party ID" 253))

(defn ^:async verify-registration
  "Verify a browser response against server-owned challenge/origin/RP values.
   Return only EDN-serializable credential data. Never trust client overrides."
  [{:keys [response challenge origin rp-id]}]
  (verification-context! challenge origin rp-id)
  (let [result (await (.verifyRegistrationResponse
                       webauthn
                       (clj->js {:response response :expectedChallenge challenge
                                 :expectedOrigin origin :expectedRPID rp-id
                                 :requireUserVerification true})))
        info (.-registrationInfo ^js result)
        credential (when info (.-credential ^js info))]
    (if (and (.-verified ^js result) credential)
      {:verified? true
       :credential {:id (.-id ^js credential)
                    :public-key (encode-bytes (.-publicKey ^js credential))
                    :counter (.-counter ^js credential)
                    :transports (vec (js->clj (or (.-transports ^js credential) #js [])))
                    :device-type (.-credentialDeviceType ^js info)
                    :backed-up? (boolean (.-credentialBackedUp ^js info))}}
      {:verified? false})))

(defn ^:async verify-authentication
  "Verify the signed assertion using the stored public key and counter. The
   caller must atomically advance :counter before accepting authentication."
  [{:keys [response challenge origin rp-id credential]}]
  (verification-context! challenge origin rp-id)
  (let [{:keys [id public-key counter transports]} credential]
    (decode-bytes id)
    (when-not (= id (:id response))
      (throw (ex-info "WebAuthn response does not match the stored credential"
                      {:type :invalid-credential-input})))
    (when-not (and (integer? counter) (<= 0 counter 4294967295))
      (throw (ex-info "Invalid stored WebAuthn signature counter"
                      {:type :invalid-credential-input})))
    (let [result (await (.verifyAuthenticationResponse
                         webauthn
                         (clj->js {:response response :expectedChallenge challenge
                                   :expectedOrigin origin :expectedRPID rp-id
                                   :requireUserVerification true
                                   :credential {:id id :publicKey (decode-bytes public-key)
                                                :counter counter :transports (vec transports)}})))
          info (.-authenticationInfo ^js result)]
      (if (and (.-verified ^js result) info)
        {:verified? true :counter (.-newCounter ^js info)
         :device-type (.-credentialDeviceType ^js info)
         :backed-up? (boolean (.-credentialBackedUp ^js info))}
        {:verified? false}))))
