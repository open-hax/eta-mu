(ns axxium.extern.identity-sdk-store-test
  "Real reference SDK callbacks retain one-use grants across local store contention."
  (:require [axxium.extern.identity-host :as host]
            [axxium.extern.oauth :as oauth]
            [axxium.infra.identity-admission :as admission]
            [axxium.infra.identity :as identity]
            [axxium.infra.identity-oauth :as flow]
            [axxium.infra.identity-sdk-store :as sdk-store]
            [axxium.infra.identity-store :as store]
            [cljs.test :refer [deftest is]]
            ["@atproto/oauth-client-node" :refer [NodeOAuthClient]]
            ["@atproto/jwk-jose" :refer [JoseKey]]
            ["fs-ext-extra-prebuilt" :as fs-ext]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]))

(defn- lock! [directory]
  (let [fd (fs/openSync (str directory "/identity-operation.lock") "r+")]
    (fs-ext/flockSync fd "exnb")
    (fn [] (fs/closeSync fd))))

(defn- client [identity-store]
  (NodeOAuthClient.
   #js {:clientMetadata #js {:client_id "https://client.example/client.json"
                             :redirect_uris #js ["https://client.example/callback"]
                             :grant_types #js ["authorization_code" "refresh_token"]
                             :response_types #js ["code"] :scope "atproto"
                             :token_endpoint_auth_method "none" :dpop_bound_access_tokens true}
        :requestLock (fn ^:async run-locked [_ run] (await (run)))
        :stateStore (oauth/sdk-store (sdk-store/pending-store identity-store 300000))
        :sessionStore (oauth/sdk-store (sdk-store/private-store identity-store "atproto-session:"))}))

(defn- ^:async callback-under-contention! [phase]
  (let [directory (fs/mkdtempSync (path/join (os/tmpdir) "axxium-sdk-lock-"))
        release (atom nil)
        exchanges (atom 0)
        revocations (atom 0)]
    (try
      (let [identity-store (store/create-provider {:provider :edn :directory directory})
            sdk (client identity-store)
            key (await (JoseKey.generate #js ["ES256"]))
            hold! (fn [] (reset! release (lock! directory))
                         (js/setTimeout (fn [] (when-let [unlock @release] (reset! release nil) (unlock))) 100))
            server #js {:issuer "https://issuer.example" :authMethod #js {:method "none"} :dpopKey key
                         :clientMetadata #js {:redirect_uris #js ["https://client.example/callback"]}
                         :serverMetadata #js {:authorization_response_iss_parameter_supported true}
                         :exchangeCode (fn ^:async exchange [_ _ _]
                                         (swap! exchanges inc)
                                         (when (= :session phase) (hold!))
                                         #js {:iss "https://issuer.example" :sub "did:plc:aaaaaaaaaaaaaaaaaaaaaaaa"
                                              :scope "atproto" :token_type "DPoP"
                                              :access_token "fixture-access" :refresh_token "fixture-refresh"
                                              :expires_at "2099-01-01T00:00:00.000Z"})
                         :revoke (fn ^:async revoke [_] (swap! revocations inc))}]
        (set! (.-fromIssuer (.-serverFactory sdk)) (fn ^:async issuer [& _] server))
        (await (.set (.-stateStore sdk) "sdk-state"
                     #js {:iss "https://issuer.example" :dpopKey key :authMethod #js {:method "none"}
                          :verifier "fixture-verifier" :appState "browser-state"}))
        (when (= :state phase) (hold!))
        (let [result (try {:value (await (.callback sdk (js/URLSearchParams.
                                                        #js {:state "sdk-state" :iss "https://issuer.example" :code "one-use"})))}
                          (catch :default cause {:failed? true :message (.-message cause)}))]
          (is (not (:failed? result)) (:message result))
          (is (= "browser-state" (some-> result :value .-state)))
          (is (= 1 @exchanges))
          (is (= 0 @revocations))
          (is (nil? (await (.get (.-stateStore sdk) "sdk-state"))))
          (when-let [unlock @release] (reset! release nil) (unlock))
          (let [reopened (store/create-provider {:provider :edn :directory directory})
                session (await ((:get! (sdk-store/private-store reopened "atproto-session:")) "did:plc:aaaaaaaaaaaaaaaaaaaaaaaa"))]
            (is (= "did:plc:aaaaaaaaaaaaaaaaaaaaaaaa" (get-in session [:tokenSet :sub])))
            (is (map? (:dpopJwk session))))))
      (finally (when-let [unlock @release] (unlock))
               (fs/rmSync directory #js {:recursive true :force true})))))

(deftest ^:async a-reversed-clock-cannot-extend-native-admission-without-bound
  (let [directory (fs/mkdtempSync (path/join (os/tmpdir) "axxium-sdk-clock-"))
        release (atom nil)
        clock (atom (host/now))
        delays (atom 0)
        cleanup-failures (atom [])]
    (try
      (let [identity-store (store/create-provider {:provider :edn :directory directory})
            sdk (oauth/sdk-store (sdk-store/private-store identity-store "sdk:"))]
        (reset! release (lock! directory))
        (with-redefs [admission/max-attempts 4 host/now (fn [] @clock)
                      host/report-private-cleanup! #(swap! cleanup-failures conj (ex-data %))
                      host/delay! (fn ^:async reverse-clock [_] (swap! delays inc) (swap! clock - 1000))]
          (let [failure (try (await (.set sdk "clock" #js {:test "value"})) nil
                             (catch :default cause (ex-data cause)))]
            (is (= :identity-store-busy (:code failure)))
            (is (= 4 (:attempts failure)))
            (is (= 6 @delays) "Admission and deferred cleanup each stop after three waits")
            (is (= [{:code :identity-store-busy :clio/error :clio.ledger/concurrent-stream-write
                     :attempts 4}] @cleanup-failures)))))
      (finally (when-let [unlock @release] (unlock))
               (fs/rmSync directory #js {:recursive true :force true})))))

(deftest ^:async sdk-state-consumption-waits-without-exchanging-the-code-twice
  (await (callback-under-contention! :state)))

(deftest ^:async sdk-session-persistence-waits-after-the-one-use-code-is-consumed
  (await (callback-under-contention! :session)))

(deftest ^:async persistent-native-lock-contention-has-an-explicit-finite-limit
  (let [directory (fs/mkdtempSync (path/join (os/tmpdir) "axxium-sdk-exhaustion-"))
        release (atom nil)
        clock (atom (host/now))]
    (try
      (let [identity-store (store/create-provider {:provider :edn :directory directory})
            sdk (oauth/sdk-store (sdk-store/private-store identity-store "sdk:"))]
        (reset! release (lock! directory))
        (with-redefs [host/now (fn [] @clock)
                      host/delay! (fn ^:async advance [_] (swap! clock + (inc admission/timeout-ms)))]
          (is (= :identity-store-busy
                 (try (await (.set sdk "refused" #js {:test "value"})) nil
                      (catch :default cause (:code (ex-data cause)))))))
        (@release)
        (reset! release nil)
        (is (nil? (get-in (store/state identity-store) [:credentials "sdk:refused"]))))
      (finally (when-let [unlock @release] (unlock))
               (fs/rmSync directory #js {:recursive true :force true})))))

(deftest ^:async reference-sdk-state-is-distinct-from-the-browser-challenge
  (let [directory (fs/mkdtempSync (path/join (os/tmpdir) "axxium-sdk-app-state-"))
        exchanges (atom 0)]
    (try
      (let [service (identity/open! {:provider :edn :directory directory :public-base-url "http://localhost"})
            sdk (client (:store service))
            operations (oauth/atproto-client-operations sdk)
            key (await (JoseKey.generate #js ["ES256"]))
            browser (host/random-token)
            app-state (identity/challenge! service browser :oauth/atproto {})
            query {:state "sdk-lookup-key" :iss "https://issuer.example" :code "one-use"}
            server #js {:issuer "https://issuer.example" :authMethod #js {:method "none"} :dpopKey key
                         :clientMetadata #js {:redirect_uris #js ["https://client.example/callback"]}
                         :serverMetadata #js {:authorization_response_iss_parameter_supported true}
                         :exchangeCode (fn ^:async exchange [& _]
                                         (swap! exchanges inc)
                                         #js {:iss "https://issuer.example" :sub "did:plc:aaaaaaaaaaaaaaaaaaaaaaaa"
                                              :scope "atproto" :token_type "DPoP" :access_token "fixture-access"
                                              :refresh_token "fixture-refresh" :expires_at "2099-01-01T00:00:00.000Z"})
                         :revoke (fn ^:async revoke [& _] nil)}
            finish (fn ^:async finish [browser-token]
                     (try (await (flow/finish! service :atproto browser-token query operations))
                          (catch :default cause {:error (ex-data cause)})))]
        (set! (.-fromIssuer (.-serverFactory sdk)) (fn ^:async issuer [& _] server))
        (await (.set (.-stateStore sdk) (:state query)
                     #js {:iss "https://issuer.example" :dpopKey key :authMethod #js {:method "none"}
                          :verifier "fixture-verifier" :appState app-state}))
        (is (not= app-state (:state query)))
        (is (= :invalid-challenge (get-in (await (finish (host/random-token))) [:error :code])))
        (is (= 0 @exchanges) "A foreign browser must fail before consuming the authorization code")
        (is (some? (await (.get (.-stateStore sdk) (:state query)))))
        (let [before (fs/readFileSync (str directory "/identity.edn") "utf8")
              substituted (assoc operations :callback!
                                 (fn ^:async substituted-state [_]
                                   {:state "another-browser-state"
                                    :identity {:issuer "atproto" :subject "did:plc:aaaaaaaaaaaaaaaaaaaaaaaa"}}))
              refusal (try (await (flow/finish! service :atproto browser query substituted)) nil
                           (catch :default cause (:code (ex-data cause))))]
          (is (= :invalid-callback refusal))
          (is (= before (fs/readFileSync (str directory "/identity.edn") "utf8")))
          (is (= 0 @exchanges)))
        (let [result (await (finish browser))]
          (is (:ok result) (pr-str result))
          (is (= 1 @exchanges))
          (when (:ok result)
            (is (= (:principal result) (identity/resolve-principal service (:token result))))))
        (is (= :invalid-challenge (get-in (await (finish browser)) [:error :code])))
        (is (= 1 @exchanges) "A replay cannot exchange the provider code again"))
      (finally (fs/rmSync directory #js {:recursive true :force true})))))
