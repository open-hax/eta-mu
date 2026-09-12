(ns axxium.extern.identity-host
  "Private filesystem and cryptographic storage boundary for local identities."
  (:require [cljs.reader :as reader]
            [clio.extern.js.fs :as durable-fs]
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
(defn utf8-length "Return a string's encoded byte length for crypto admission." [value]
  (js/Buffer.byteLength value "utf8"))
(defn resolve-path "Resolve a configured identity directory." [directory] (path/resolve directory))

(defn ^:async delay! "Yield during a bounded lock cleanup retry." [milliseconds]
  (await (js/Promise. (fn [resolve] (js/setTimeout resolve milliseconds)))))

(defn report-deferred-cleanup!
  "Report deferred lease cleanup without secrets or replacing the completed result."
  [error]
  (try
    (js/console.error "Axxium password reservation cleanup deferred until lease expiry"
                      (name (or (:clio/error (ex-data error)) (:code (ex-data error)) :storage-error)))
    (catch :default _ nil)))

(defn private-directory!
  "Create an owner-only directory; refuse symlink storage roots."
  [directory]
  (fs/mkdirSync directory #js {:recursive true :mode 448})
  (when (.isSymbolicLink (fs/lstatSync directory))
    (throw (ex-info "Identity storage cannot be a symlink" {:code :unsafe-storage})))
  (fs/chmodSync directory 448)
  (durable-fs/ensure-dir! directory)
  directory)

(defn already-exists-error?
  "Distinguish an exclusive-create collision from unrelated filesystem failures."
  [error]
  (= "EEXIST" (.-code error)))

(defn- write-exclusive!
  [file bytes]
  (let [fd (fs/openSync file "wx" 384)]
    (try (fs/writeFileSync fd bytes) (fs/fsyncSync fd)
         (finally (fs/closeSync fd))))
  (let [parent (fs/openSync (path/dirname file) "r")]
    (try (fs/fsyncSync parent) (finally (fs/closeSync parent)))))

(defn- with-file-lock! [directory name mode run]
  (let [file (str directory "/" name)]
    (try (write-exclusive! file "")
         (catch :default error (when-not (= "EEXIST" (.-code error)) (throw error))))
    (when (.isSymbolicLink (fs/lstatSync file))
      (throw (ex-info "Identity lock cannot be a symlink" {:code :unsafe-storage})))
    (let [fd (fs/openSync file "r+")]
      (try
        (try (fs-ext/flockSync fd mode)
             (catch :default error
               (if (#{"EAGAIN" "EWOULDBLOCK" "EACCES"} (.-code error))
                 (throw (ex-info "Identity changed concurrently; retry" {:clio/error :clio.ledger/concurrent-stream-write}))
                 (throw error))))
        (run)
        (finally (fs/closeSync fd))))))

(defn with-operation-lock!
  "Serialize local admission and ceremony compaction on a stable lock inode."
  [directory run]
  (with-file-lock! directory "identity-operation.lock" "exnb" run))

(defn with-initialization-lock!
  "Wait for another process to finish synchronous first-open construction."
  [directory run]
  (with-file-lock! directory "identity-initialization.lock" "ex" run))

(defn replace-private-text!
  "Atomically replace a bounded checkpoint; callers hold the stable operation lock."
  [file text]
  (let [temporary (str file "." (id) ".tmp")]
    (try
      (write-exclusive! temporary text)
      (fs/renameSync temporary file)
      (let [fd (fs/openSync (path/dirname file) "r")]
        (try (fs/fsyncSync fd) (finally (fs/closeSync fd))))
      (finally (when (fs/existsSync temporary) (fs/unlinkSync temporary))))))

(defn collect-private-blobs!
  "Remove unreferenced blobs only in the dedicated short-lived ceremony vault."
  [{:keys [directory]} retained]
  (doseq [file (array-seq (fs/readdirSync directory))
          :when (and (re-matches #"[0-9a-f]{64}" file) (not (contains? retained file)))]
    (fs/unlinkSync (str directory "/" file))))

(defn bounded-private-value!
  "Reject oversized unauthenticated payloads before creating any encrypted blob."
  [value]
  (when (> (js/Buffer.byteLength (pr-str value) "utf8") 65536)
    (throw (ex-info "Authentication state is too large" {:code :invalid-challenge}))))

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

(defn private-state-exists?
  "Surviving vault contents prove initialization even if public files were lost."
  [directory]
  (let [private-path (str directory "/private")]
    (and (fs/existsSync private-path)
         (or (.isSymbolicLink (fs/lstatSync private-path))
             (seq (fs/readdirSync private-path))))))

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
    (let [fd (fs/openSync key-file "r")]
      (try
        (fs/fchmodSync fd 384)
        (let [key (fs/readFileSync fd)]
          (when-not (= 32 (.-length key))
            (throw (ex-info "Identity encryption key is invalid" {:code :invalid-vault-key})))
          (fs/fsyncSync fd)
          (let [parent (fs/openSync directory "r")]
            (try (fs/fsyncSync parent) (finally (fs/closeSync parent))))
          ;; Private data remains protected, but native Buffers never enter infra.
          {:directory directory :key (.toString key "base64url")})
        (finally (fs/closeSync fd))))))

(defn seal!
  "Persist an immutable encrypted EDN blob before referencing it from Clio."
  [{:keys [directory key]} value]
  (let [iv (crypto/randomBytes 12)
        cipher (crypto/createCipheriv "aes-256-gcm" (js/Buffer.from key "base64url") iv)
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
        decipher (crypto/createDecipheriv "aes-256-gcm" (js/Buffer.from key "base64url") (.subarray bytes 0 12))]
    (.setAuthTag decipher (.subarray bytes (- (.-length bytes) 16)))
    (reader/read-string
     (.toString (js/Buffer.concat #js [(.update decipher (.subarray bytes 12 (- (.-length bytes) 16)))
                                      (.final decipher)]) "utf8"))))

(defn env "Read one explicit environment setting." [key] (aget (.-env js/process) key))
