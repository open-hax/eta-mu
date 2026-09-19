(ns axxium.extern.identity-review-storage-test
  "Real EDN, native lock and HTTP regressions for the current identity review."
  (:require [axxium.api :as api]
            [axxium.domain.identity :as domain]
            [axxium.extern.credential-crypto :as crypto]
            [axxium.extern.identity-host :as host]
            [axxium.extern.identity-http :as http]
            [axxium.infra.identity :as identity]
            [axxium.infra.identity-admission :as admission]
            [axxium.infra.identity-sdk-store :as sdk-store]
            [axxium.infra.identity-store :as store]
            [axxium.server :as server]
            [cljs.test :refer [deftest is]]
            ["fastify" :default Fastify]
            ["fs-ext-extra-prebuilt" :as fs-ext]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]))

(defn- directory [] (fs/mkdtempSync (path/join (os/tmpdir) "axxium-review-storage-")))
(defn- open-service [directory]
  (identity/open! {:provider :edn :directory directory :public-base-url "http://localhost"}))
(defn- private-blobs [directory]
  (set (filter #(re-matches #"[0-9a-f]{64}" %) (array-seq (fs/readdirSync (str directory "/private"))))))
(defn- lock! [directory]
  (let [fd (fs/openSync (str directory "/identity-operation.lock") "r+")
        released? (atom false)]
    (fs-ext/flockSync fd "exnb")
    (fn [] (when (compare-and-set! released? false true) (fs/closeSync fd)))))

(deftest ^:async actual-health-waits-for-a-transient-native-operation-lock
  (let [directory (directory)
        app (await (server/create-app! (open-service directory)))
        unlock (lock! directory)
        timer (js/setTimeout unlock 100)]
    (try
      (let [address (await (http/listen! app "127.0.0.1" 0))
            response (await (js/fetch (str address "/health")))]
        (is (= 200 (.-status response)))
        (is (= {:ok true :service "axxium" :provider "edn"}
               (js->clj (await (.json response)) :keywordize-keys true))))
      (finally (js/clearTimeout timer) (unlock) (await (http/close! app))
               (fs/rmSync directory #js {:recursive true :force true})))))

(deftest ^:async sdk-session-replacement-and-delete-reclaim-only-retired-blobs
  (let [directory (directory)
        identity-store (:store (open-service directory))
        private (sdk-store/private-store identity-store "atproto-session:")
        retained (store/seal! identity-store {:password "retained fixture"})]
    (try
      (store/transact! identity-store (fn [_] {:operation :fixture
                                             :changes [(domain/put :credentials "other" {:private-ref retained})]}))
      (dotimes [version 3]
        (await ((:put! private) "did:plc:fixture" {:refresh version})))
      (is (= 2 (count (private-blobs directory))))
      (is (= {:refresh 2} (await ((:get! private) "did:plc:fixture"))))
      (await ((:delete! private) "did:plc:fixture"))
      (is (= #{retained} (private-blobs directory)))
      (is (= {:password "retained fixture"} (store/unseal identity-store retained)))
      (is (nil? (await ((:get! private) "did:plc:fixture"))))
      (is (true? (store/check-readiness! identity-store)))
      (finally (fs/rmSync directory #js {:recursive true :force true})))))

(deftest ^:async failed-sdk-admission-reclaims-its-prepared-candidate
  (let [directory (directory)
        identity-store (:store (open-service directory))
        private (sdk-store/private-store identity-store "atproto-session:")
        unlock (lock! directory)
        original-delay host/delay!
        delays (atom 0)]
    (try
      (with-redefs [admission/max-attempts 2
                    host/delay! (fn ^:async release-on-cleanup [_]
                                  (when (= 2 (swap! delays inc)) (unlock))
                                  (await (original-delay 1)))]
        (is (= :identity-store-busy
               (try (await ((:put! private) "did:plc:refused" {:refresh "candidate"})) nil
                    (catch :default cause (:code (ex-data cause)))))))
      (unlock)
      (is (empty? (private-blobs directory)))
      (is (empty? (:canonical/events (store/history identity-store))))
      (finally (unlock)
               (fs/rmSync directory #js {:recursive true :force true})))))

(deftest ^:async rejected-signup-cleans-its-blob-after-native-lock-contention
  (let [directory (directory)
        service (open-service directory)
        original-hash crypto/hash-password
        release (atom nil)
        original-delay host/delay!]
    (try
      (with-redefs [crypto/hash-password
                    (fn ^:async hash-and-hold [password]
                      (let [credential (await (original-hash password))
                            unlock (lock! directory)]
                        (reset! release unlock)
                        credential))
                    host/delay! (fn ^:async release-on-cleanup [_]
                                  (when-let [unlock @release] (unlock))
                                  (await (original-delay 1)))]
        (is (= :clio.ledger/concurrent-stream-write
               (try (await (identity/signup! service {:username "refused" :email "refused@example.test"
                                                       :password "a rejected signup password"})) nil
                    (catch :default cause (:clio/error (ex-data cause)))))))
      (when-let [unlock @release] (unlock))
      (is (empty? (private-blobs directory)))
      (is (empty? (:canonical/events (store/history (:store service)))))
      (finally (when-let [unlock @release] (unlock))
               (fs/rmSync directory #js {:recursive true :force true})))))

(deftest ^:async failure-after-real-signup-commit-keeps-the-live-private-reference
  (let [directory (directory)
        service (open-service directory)
        original-transact (get-method store/transact! :edn)
        failure (ex-info "Injected lost acknowledgement after a real commit" {:code :lost-ack})]
    (try
      (-add-method store/transact! :edn (fn [identity-store decide]
                                          (original-transact identity-store decide)
                                          (throw failure)))
      (try
        (is (identical? failure
                        (try (await (identity/signup! service {:username "committed" :email "committed@example.test"
                                                                :password "a committed signup password"})) nil
                             (catch :default cause cause))))
        (finally (-add-method store/transact! :edn original-transact)))
      (is (= 1 (count (private-blobs directory))))
      (is (:ok (await (identity/login! (open-service directory)
                                       {:identifier "committed" :password "a committed signup password"}))))
      (finally (fs/rmSync directory #js {:recursive true :force true})))))

(deftest ^:async ignored-browser-cookies-cannot-exhaust-other-client-ceremonies
  (let [directory (directory)
        service (open-service directory)
        app (Fastify #js {:logger false :trustProxy "127.0.0.1"})]
    (try
      (await (api/register-routes app service))
      (let [address (await (http/listen! app "127.0.0.1" 0))
            start (fn ^:async start [client]
                    (await (js/fetch (str address "/api/auth/passkey/authentication-options")
                                      #js {:method "POST" :headers #js {"Origin" "http://localhost"
                                                                        "x-forwarded-for" client}})))]
        (dotimes [_ 8] (is (= 200 (.-status (await (start "198.51.100.1"))))))
        (is (= 429 (.-status (await (start "198.51.100.1")))))
        (is (= 8 (count (:challenges (store/state (:store (open-service directory)))))))
        (is (= 200 (.-status (await (start "198.51.100.2"))))))
      (finally (await (http/close! app))
               (fs/rmSync directory #js {:recursive true :force true})))))
