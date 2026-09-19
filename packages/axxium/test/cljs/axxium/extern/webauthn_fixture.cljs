(ns axxium.extern.webauthn-fixture
  "Ephemeral native P-256 credentials and actual WebAuthn wire responses for tests."
  (:require ["node:buffer" :refer [Buffer]]
            ["node:crypto" :as crypto]))

(defn base64url [bytes]
  (.toString ^js bytes "base64url"))

(defn- concat-bytes [& values]
  (.concat Buffer (to-array values)))

(defn- hex-bytes [value]
  (.from Buffer value "hex"))

(defn- sha256 [value]
  (.digest ^js (.update ^js (.createHash crypto "sha256") value)))

(defn- authenticator-data [rp-id flags counter]
  (let [trailer (.alloc Buffer 5)]
    (.writeUInt8 ^js trailer flags 0)
    (.writeUInt32BE ^js trailer counter 1)
    (concat-bytes (sha256 rp-id) trailer)))

(defn p256-credential []
  (let [keypair (.generateKeyPairSync crypto "ec" #js {:namedCurve "prime256v1"})
        jwk (.export ^js (.-publicKey ^js keypair) #js {:format "jwk"})
        ;; Definite-length COSE EC2 map: kty=2, alg=-7, crv=1, x and y.
        cose-key (concat-bytes (hex-bytes "a5010203262001215820")
                               (.from Buffer (.-x ^js jwk) "base64url")
                               (hex-bytes "225820")
                               (.from Buffer (.-y ^js jwk) "base64url"))
        id (base64url (.randomBytes crypto 32))]
    {:credential {:id id :public-key (base64url cose-key) :counter 0
                  :transports ["internal"]}
     :private-key (.-privateKey ^js keypair)}))

(defn- client-data [ceremony challenge origin]
  (.from Buffer (js/JSON.stringify #js {:type ceremony :challenge challenge
                                       :origin origin :crossOrigin false}) "utf8"))

(defn authentication-response
  [{:keys [credential private-key]} challenge origin rp-id counter flags]
  (let [client (client-data "webauthn.get" challenge origin)
        auth-data (authenticator-data rp-id flags counter)
        signature (.sign crypto "sha256" (concat-bytes auth-data (sha256 client)) private-key)]
    {:id (:id credential) :rawId (:id credential) :type "public-key"
     :clientExtensionResults {}
     :response {:clientDataJSON (base64url client)
                :authenticatorData (base64url auth-data)
                :signature (base64url signature)}}))

(defn- cbor-bytes [bytes]
  (let [header (.alloc Buffer 3)]
    (.writeUInt8 ^js header 89 0)
    (.writeUInt16BE ^js header (.-length ^js bytes) 1)
    (concat-bytes header bytes)))

(defn registration-response [credential challenge origin rp-id & [flags]]
  (let [id (.from Buffer (:id credential) "base64url")
        length (.alloc Buffer 2)
        _ (.writeUInt16BE ^js length (.-length ^js id) 0)
        auth-data (concat-bytes (authenticator-data rp-id (or flags 69) 0)
                               (.alloc Buffer 16) length id
                               (.from Buffer (:public-key credential) "base64url"))
        ;; CBOR {"fmt":"none", "authData":bytes, "attStmt":{}}. This is an
        ;; actual none-attestation wire response, not a mocked SDK result.
        attestation (concat-bytes (hex-bytes "a363666d74646e6f6e65686175746844617461")
                                  (cbor-bytes auth-data)
                                  (hex-bytes "6761747453746d74a0"))]
    {:id (:id credential) :rawId (:id credential) :type "public-key"
     :clientExtensionResults {} :authenticatorAttachment "platform"
     :response {:clientDataJSON (base64url (client-data "webauthn.create" challenge origin))
                :attestationObject (base64url attestation)
                :transports ["internal"]}}))

