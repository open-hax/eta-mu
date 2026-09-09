(ns eta-mu.gitops-controller.extern.crypto
  "Node cryptography boundary for webhook HMAC and GitHub App JWTs."
  (:require ["node:crypto" :as crypto]
            [eta-mu.gitops-controller.extern.json :as json]
            [eta-mu.gitops-controller.extern.runtime :as runtime]))

(defn verify-hmac-sha256
  [secret raw-body signature]
  (let [expected (-> (.createHmac crypto "sha256" secret)
                     (.update raw-body)
                     (.digest))
        supplied (.from js/Buffer (subs signature 7) "hex")]
    (and (= (.-length expected) (.-length supplied))
         (.timingSafeEqual crypto expected supplied))))

(defn sha256-text [value]
  (-> (.createHash crypto "sha256")
      (.update value "utf8")
      (.digest "hex")))

(defn sha256-bytes [value]
  (-> (.createHash crypto "sha256")
      (.update value)
      (.digest "hex")))

(defn deterministic-delivery-id
  "RFC UUIDv5 in the URL namespace for a derived base-push delivery identity."
  [value]
  (let [namespace-bytes (.from js/Buffer
                               "6ba7b8119dad11d180b400c04fd430c8" "hex")
        bytes (-> (.createHash crypto "sha1")
                  (.update namespace-bytes)
                  (.update (str "https://github.com/open-hax/eta-mu/"
                                "gitops-controller/base-push/" value) "utf8")
                  (.digest))]
    (.writeUInt8 bytes (bit-or 0x50 (bit-and 0x0f (.readUInt8 bytes 6))) 6)
    (.writeUInt8 bytes (bit-or 0x80 (bit-and 0x3f (.readUInt8 bytes 8))) 8)
    (let [hex (.toString bytes "hex" 0 16)]
      (str (subs hex 0 8) "-" (subs hex 8 12) "-" (subs hex 12 16)
           "-" (subs hex 16 20) "-" (subs hex 20 32)))))

(defn rsa-private-key? [value]
  (try
    (let [key (.createPrivateKey crypto value)]
      (and (= "private" (.-type key))
           (= "rsa" (.-asymmetricKeyType key))))
    (catch :default _ false)))

(defn- base64url [value]
  (.toString (.from js/Buffer value "utf8") "base64url"))

(defn github-app-jwt
  [app-id private-key]
  (let [now (runtime/unix-seconds)
        header (base64url (json/encode {:alg "RS256" :typ "JWT"}))
        claims (base64url (json/encode {:iat (- now 60)
                                       :exp (+ now 540)
                                       :iss app-id}))
        signing-input (str header "." claims)
        signer (.createSign crypto "RSA-SHA256")]
    (.update signer signing-input)
    (.end signer)
    (str signing-input "." (.sign signer private-key "base64url"))))
