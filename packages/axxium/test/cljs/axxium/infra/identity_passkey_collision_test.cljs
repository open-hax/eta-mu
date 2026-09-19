(ns axxium.infra.identity-passkey-collision-test
  (:require [axxium.domain.identity :as domain]
            [axxium.extern.identity-host :as host]
            [axxium.extern.webauthn-fixture :as fixture]
            [axxium.infra.identity :as identity]
            [axxium.infra.identity-store :as store]
            [cljs.test :refer [deftest is]]))

(def actor
  {:principal/id "actor_passkey" :principal/entity-id "entity_passkey"
   :principal/kind :human :principal/username "passkey-user"
   :principal/display-name "Passkey user" :principal/status :active
   :principal/roles ["basic-user"] :principal/capabilities []})

(deftest ^:async real-passkey-proof-cannot-replace-an-existing-session
  (let [service (identity/open! {:provider :memory :public-base-url "http://localhost:8787" :rp-id "localhost"})
        generated (fixture/p256-credential)
        credential-id (get-in generated [:credential :id])
        credential-key (str "passkey:" credential-id)
        record {:principal-id "actor_passkey" :credential (:credential generated)}
        existing-token "existing-unrelated-session"
        session-hash (host/sha256 existing-token)
        existing-session {:principal-id "another-actor" :issued-at 1 :expires-at 9999999999999}
        _ (store/transact! (:store service)
                           (fn [_] {:operation :test-fixture
                                    :changes [(domain/put :principals "actor_passkey" actor)
                                              (domain/put :credentials credential-key record)
                                              (domain/put :sessions session-hash existing-session)]}))
        browser (host/random-token)
        challenge (await (identity/passkey-authentication-options! service browser))
        challenge-id (:challenge-id challenge)
        challenge-before (get-in (store/state (:store service)) [:challenges challenge-id])
        events-before (:canonical/events (store/history (:store service)))
        request {:challenge-id challenge-id
                 :response (fixture/authentication-response generated (get-in challenge [:options :challenge])
                                                            "http://localhost:8787" "localhost" 1 5)}
        error (with-redefs [host/random-token (fn [] existing-token)]
                (try (await (identity/passkey-authentication-verify! service browser request)) nil
                     (catch :default cause (:code (ex-data cause)))))
        after (store/state (:store service))]
    (is (= :login-session-collision error))
    (is (= existing-session (get-in after [:sessions session-hash])))
    (is (= record (get-in after [:credentials credential-key])))
    (is (= challenge-before (dissoc (get-in after [:challenges challenge-id]) :proof-attempts)))
    (is (= 1 (get-in after [:challenges challenge-id :proof-attempts])))
    (is (= events-before (:canonical/events (store/history (:store service)))))))
