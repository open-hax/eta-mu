(ns axxium.extern.identity-host
  "Private filesystem and cryptographic storage boundary for local identities."
  (:require [cljs.reader :as reader]
            ["fs-ext-extra-prebuilt" :as fs-ext]
            ["node:crypto" :as crypto]
            ["node:fs" :as fs]
            ["node:path" :as path]))

(defn now "Current epoch milliseconds." [] (js/Date.now))
(defn id "Fresh opaque identity." [] (str (random-uuid)))
(defn random-token "Unpredictable browser or session secret." [] (.toString (crypto/randomBytes 32) "base64url"))
(defn sha256 "Digest a secret without retaining it in a ledger." [value]
  (.digest (.update (crypto/createHash "sha256") value) "hex"))
(defn base64url "Encode a stable WebAuthn user handle." [value]
  (.toString (js/Buffer.from value "utf8") "base64url"))
(defn resolve-path "Resolve a configured identity directory." [directory] (path/resolve directory))

(defn private-directory!
  "Create an owner-only directory; refuse symlink storage roots."
  [directory]
  (fs/mkdirSync directory #js {:recursive true :mode 448})
  (when (.isSymbolicLink (fs/lstatSync directory))
    (throw (ex-info "Identity storage cannot be a symlink" {:code :unsafe-storage})))
  (fs/chmodSync directory 448)
  directory)

(defn- write-exclusive!
  [file bytes]
  (let [fd (fs/openSync file "wx" 384)]
    (try (fs/writeFileSync fd bytes) (fs/fsyncSync fd)
         (finally (fs/closeSync fd))))
  (let [parent (fs/openSync (path/dirname file) "r")]
    (try (fs/fsyncSync parent) (finally (fs/closeSync parent)))))

(defn ^:async with-private-lock!
  "Hold a nonblocking OS file lock across provider refresh I/O; crash releases it."
  [directory key run]
  (let [directory (private-directory! (str directory "/locks"))
        file (str directory "/" (sha256 key))]
    (try (write-exclusive! file "")
         (catch :default error (when-not (= "EEXIST" (.-code error)) (throw error))))
    (let [fd (fs/openSync file "r+")
          deadline (+ (now) 30000)]
      (try
        (loop []
          (let [acquired? (try (fs-ext/flockSync fd "exnb") true
                               (catch :default error
                                 (if (#{"EAGAIN" "EWOULDBLOCK" "EACCES"} (.-code error)) false (throw error))))]
            (when-not acquired?
              (when (> (now) deadline)
                (throw (ex-info "Identity provider lock timed out" {:code :provider-unavailable})))
              (await (js/Promise. (fn [resolve] (js/setTimeout resolve 20))))
              (recur))))
        (await (run))
        (finally (fs/closeSync fd))))))

(defn open-vault!
  "Keep a persistent AES key outside identity facts, with owner-only permissions."
  [directory existing?]
  (let [directory (private-directory! (str directory "/private"))
        key-file (str directory "/master-key")]
    (when-not (fs/existsSync key-file)
      (when existing?
        (throw (ex-info "Identity encryption key is missing" {:code :missing-vault-key})))
      (try (write-exclusive! key-file (crypto/randomBytes 32))
           (catch :default error
             (when-not (= "EEXIST" (.-code error)) (throw error)))))
    (when (.isSymbolicLink (fs/lstatSync key-file))
      (throw (ex-info "Identity encryption key cannot be a symlink" {:code :unsafe-storage})))
    (fs/chmodSync key-file 384)
    (let [key (fs/readFileSync key-file)]
      (when-not (= 32 (.-length key))
        (throw (ex-info "Identity encryption key is invalid" {:code :invalid-vault-key})))
      {:directory directory :key key})))

(defn seal!
  "Persist an immutable encrypted EDN blob before referencing it from Clio."
  [{:keys [directory key]} value]
  (let [iv (crypto/randomBytes 12)
        cipher (crypto/createCipheriv "aes-256-gcm" key iv)
        bytes (js/Buffer.concat #js [iv (.update cipher (pr-str value) "utf8")
                                     (.final cipher) (.getAuthTag cipher)])
        digest (sha256 bytes)]
    (write-exclusive! (str directory "/" digest) bytes)
    digest))

(defn unseal
  "Authenticate and read a referenced private blob. Never accept arbitrary paths."
  [{:keys [directory key]} digest]
  (when-not (and (string? digest) (re-matches #"[0-9a-f]{64}" digest))
    (throw (ex-info "Invalid private credential reference" {:code :invalid-secret-reference})))
  (let [file (str directory "/" digest)
        _ (when (.isSymbolicLink (fs/lstatSync file))
            (throw (ex-info "Private credential cannot be a symlink" {:code :unsafe-storage})))
        bytes (fs/readFileSync file)
        _ (when-not (= digest (sha256 bytes))
            (throw (ex-info "Private credential digest mismatch" {:code :corrupt-secret})))
        decipher (crypto/createDecipheriv "aes-256-gcm" key (.subarray bytes 0 12))]
    (.setAuthTag decipher (.subarray bytes (- (.-length bytes) 16)))
    (reader/read-string
     (.toString (js/Buffer.concat #js [(.update decipher (.subarray bytes 12 (- (.-length bytes) 16)))
                                      (.final decipher)]) "utf8"))))

(defn env "Read one explicit environment setting." [key] (aget (.-env js/process) key))
