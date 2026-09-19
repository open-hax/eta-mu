(ns axxium.extern.identity-startup-candidates-test
  "Native EDN preparation races retain only admitted bootstrap and client-key material."
  (:require [axxium.domain.identity-oauth :as oauth-policy]
            [axxium.extern.credential-crypto :as crypto]
            [axxium.extern.oauth :as oauth]
            [axxium.infra.identity :as identity]
            [axxium.infra.identity-oauth :as identity-oauth]
            [axxium.infra.identity-store :as store]
            [cljs.test :refer [deftest is]]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]))

(defn- directory [] (fs/mkdtempSync (path/join (os/tmpdir) "axxium-startup-candidates-")))
(defn- remove! [directory] (fs/rmSync directory #js {:recursive true :force true}))
(defn- options [directory]
  {:provider :edn :directory directory :public-base-url "https://identity.example.test"
   :providers {:atproto {:client-id "https://identity.example.test/api/auth/atproto/client-metadata.json"}}})
(defn- blobs [directory]
  (set (filter #(re-matches #"[0-9a-f]{64}" %) (array-seq (fs/readdirSync (str directory "/private"))))))
(def bootstrap-request {:username "first-admin" :email "admin@example.test"
                        :password "concurrent bootstrap fixture password" :principal-id "actor_bootstrap"})

(defn- ^:async concurrent-bootstrap!
  "Both real password hashes finish before either opener can enter commit admission."
  [first-service second-service first-request second-request]
  (let [hash-password crypto/hash-password
        count-ready (atom 0)
        release (atom nil)
        ready (js/Promise. (fn [resolve _] (reset! release resolve)))]
    (with-redefs [crypto/hash-password
                  (fn ^:async hash-before-barrier [password]
                    (let [credential (await (hash-password password))]
                      (when (= 2 (swap! count-ready inc)) (@release true))
                      (await ready)
                      credential))]
      (let [results (await (js/Promise.allSettled
                           #js [(identity/bootstrap! first-service first-request)
                                (identity/bootstrap! second-service second-request)]))]
        (mapv (fn [result] {:status (.-status result) :value (.-value result) :reason (.-reason result)})
              (array-seq results))))))

(deftest ^:async same-bootstrap-winner-is-reopened-and-losing-preparation-is-reclaimed
  (let [directory (directory)
        first-service (identity/open! (options directory))
        second-service (identity/open! (options directory))]
    (try
      (let [results (await (concurrent-bootstrap! first-service second-service bootstrap-request bootstrap-request))
            current (store/state (:store second-service))]
        (is (= ["fulfilled" "fulfilled"] (mapv :status results)))
        (is (= (:value (first results)) (:value (second results))))
        (is (= 1 (count (:principals current))))
        (is (= 1 (count (:canonical/events (store/history (:store first-service))))))
        (is (= 1 (count (blobs directory))))
        (is (= (:value (first (filter #(= "fulfilled" (:status %)) results)))
               (await (identity/bootstrap! (identity/open! (options directory)) bootstrap-request))))
        (is (true? (store/check-readiness! (:store first-service)))))
      (finally (remove! directory)))))

(deftest ^:async different-concurrent-bootstrap-intent-cannot-reuse-the-winner
  (doseq [changed [(assoc bootstrap-request :password "different concurrent bootstrap password")
                   (assoc bootstrap-request :principal-id "actor_other")
                   (assoc bootstrap-request :username "other-admin" :email "other@example.test")]]
    (let [directory (directory)
          first-service (identity/open! (options directory))
          second-service (identity/open! (options directory))]
      (try
        (let [results (await (concurrent-bootstrap! first-service second-service bootstrap-request changed))
              rejected (filter #(= "rejected" (:status %)) results)]
          (is (= 1 (count rejected)))
          (is (= :bootstrap-mismatch (:code (ex-data (:reason (first rejected))))))
          (is (= 1 (count (:principals (store/state (:store first-service))))))
          (is (= 1 (count (blobs directory))))
          (is (true? (store/check-readiness! (:store second-service)))))
        (finally (remove! directory))))))

(deftest ^:async atproto-client-key-selection-reclaims-a-loser-after-another-opener-wins
  (let [directory (directory)
        service (identity/open! (options directory))
        second-service (identity/open! (options directory))
        transact (get-method store/transact! :edn)
        race? (atom true)
        winner (atom nil)
        prepared-count (atom nil)]
    (try
      ;; A second real opener commits after the first has sealed but before its
      ;; transaction enters the real Clio lock. This is a controlled interleaving,
      ;; not a claim of two simultaneous OS processes.
      (-add-method store/transact! :edn
                   (fn [identity-store decide]
                     (when (and (identical? identity-store (:store service)) (compare-and-set! race? true false))
                       (reset! winner (store/seal! (:store second-service) (oauth/generate-client-key)))
                       (reset! prepared-count (count (blobs directory)))
                       (transact (:store second-service) #(oauth-policy/select-client-key % @winner)))
                     (transact identity-store decide)))
      (let [client (await (identity-oauth/create-atproto-client! service))]
        (is (= 2 @prepared-count) "Both randomized native candidates actually reached disk")
        (is (= #{@winner} (blobs directory)))
        (is (= @winner (get-in (store/state (:store service)) [:credentials oauth-policy/client-key :private-ref])))
        (is (= 1 (count (:canonical/events (store/history (:store service))))))
        (is (= (oauth/atproto-jwks client)
               (oauth/atproto-jwks (await (identity-oauth/create-atproto-client! second-service)))))
        (is (true? (store/check-readiness! (:store service)))))
      (finally
        (-add-method store/transact! :edn transact)
        (remove! directory)))))

(deftest ^:async failed-atproto-selection-reclaims-preparation-and-retains-original-cause
  (let [directory (directory)
        service (identity/open! (options directory))
        transact (get-method store/transact! :edn)
        failure (ex-info "Fixture native admission refusal" {:code :fixture-refusal})]
    (try
      (-add-method store/transact! :edn (fn [_ _] (throw failure)))
      (let [cause (try (await (identity-oauth/create-atproto-client! service)) nil
                       (catch :default cause cause))]
        (is (identical? failure cause))
        (is (empty? (blobs directory)))
        (is (empty? (:canonical/events (store/history (:store service))))))
      (finally
        (-add-method store/transact! :edn transact)
        (remove! directory)))))

(deftest ^:async preparation-cleanup-preserves-an-admitted-secret-after-lost-acknowledgement
  (doseq [kind [:bootstrap :atproto]]
    (let [directory (directory)
          service (identity/open! (options directory))
          transact (get-method store/transact! :edn)
          failure (ex-info "Fixture failure after actual durable admission" {:code :lost-ack})
          invoke (fn ^:async invoke []
                   (if (= :bootstrap kind)
                     (await (identity/bootstrap! service bootstrap-request))
                     (await (identity-oauth/create-atproto-client! service))))]
      (try
        (-add-method store/transact! :edn
                     (fn [identity-store decide] (transact identity-store decide) (throw failure)))
        (let [cause (try (await (invoke)) nil (catch :default cause cause))]
          (is (identical? failure cause)))
        (-add-method store/transact! :edn transact)
        (is (= 1 (count (blobs directory))))
        (is (= 1 (count (:canonical/events (store/history (:store service))))))
        (is (true? (store/check-readiness! (:store service))))
        (is (some? (await (invoke))))
        (is (= 1 (count (blobs directory))))
        (finally
          (-add-method store/transact! :edn transact)
          (remove! directory))))))
