(ns axxium.infra.identity-password-work-test
  (:require [axxium.domain.identity :as domain]
            [axxium.extern.credential-crypto :as crypto]
            [axxium.infra.identity :as identity]
            [axxium.infra.identity-store :as store]
            [cljs.test :refer [deftest is]]))

(deftest ^:async invalid-logins-perform-one-bounded-password-verification
  (let [service (identity/open! {:provider :memory :public-base-url "http://localhost:8787"})
        created (await (identity/signup! service {:username "alice" :email "alice@example.test"
                                                  :password "correct password fixture"}))
        actor (:principal created)
        actor-id (:principal/id actor)
        key (str "password:" actor-id)
        actual-record (store/unseal (:store service) (get-in (store/state (:store service)) [:credentials key :private-ref]))
        verify crypto/verify-password]
    (doseq [scenario [:wrong-password :missing :inactive :credentialless]]
      (when (= scenario :inactive)
        (store/transact! (:store service)
                         (fn [_] {:operation :fixture-suspend
                                  :changes [(domain/put :principals actor-id (assoc actor :principal/status :suspended))]})))
      (when (= scenario :credentialless)
        (store/transact! (:store service)
                         (fn [_] {:operation :fixture-remove-password
                                  :changes [(domain/put :principals actor-id actor)
                                            (domain/remove-entry :credentials key)]})))
      (let [attempts (atom [])]
        (with-redefs [crypto/verify-password
                      (fn [password record]
                        (swap! attempts conj record)
                        (verify password record))]
          (is (= :invalid-credentials
                 (try (await (identity/login! service {:identifier (if (= scenario :missing) "missing" "alice")
                                                       :password "incorrect password fixture"}))
                      nil (catch :default cause (:code (ex-data cause)))))))
        (is (= 1 (count @attempts)) (name scenario))
        (when (= scenario :wrong-password) (is (= actual-record (first @attempts))))
        (when (not= scenario :wrong-password)
          (is (= :scrypt (:scheme (first @attempts))))
          (is (= 1 (:version (first @attempts))))
          (is (= 22 (count (:salt (first @attempts)))))
          (is (= 86 (count (:hash (first @attempts))))))))))

(deftest ^:async successful-password-proof-still-rechecks-current-credentials
  (let [service (identity/open! {:provider :memory :public-base-url "http://localhost:8787"})
        password "correct password fixture"
        created (await (identity/signup! service {:username "alice" :email "alice@example.test" :password password}))
        actor-id (get-in created [:principal :principal/id])
        key (str "password:" actor-id)
        before (count (:sessions (store/state (:store service))))
        verify crypto/verify-password]
    (with-redefs [crypto/verify-password
                  (fn [input record]
                    (let [pending (verify input record)]
                      (store/transact! (:store service)
                                       (fn [_] {:operation :fixture-remove-password
                                                :changes [(domain/remove-entry :credentials key)]}))
                      pending))]
      (is (= :invalid-credentials
             (try (await (identity/login! service {:identifier "alice" :password password}))
                  nil (catch :default cause (:code (ex-data cause)))))))
    (is (= before (count (:sessions (store/state (:store service))))))))
