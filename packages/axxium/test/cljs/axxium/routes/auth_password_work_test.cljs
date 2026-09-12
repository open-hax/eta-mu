(ns axxium.routes.auth-password-work-test
  (:require [axxium.db :as db]
            [axxium.extern.legacy-password :as password]
            [axxium.routes.auth :as auth]
            [cljs.test :refer [deftest is]]
            ["fastify" :as Fastify]))

(deftest ^:async retained-login-performs-real-bcrypt-work-for-unknown-identities
  (let [app (Fastify #js {:logger false})
        digest (await (password/hash-password "actual retained password" 4))
        compare! password/verify-password
        calls (atom [])]
    (try
      (auth/register-login-route! app)
      (with-redefs [db/query-one
                    (fn ^:async lookup [_sql [email]]
                      (when (= email "active@example.test")
                        {:id "active-actor" :status "active" :password_hash digest}))
                    password/verify-password
                    (fn ^:async actual-compare [secret hash]
                      (swap! calls conj hash)
                      (await (compare! secret hash)))]
        (doseq [email ["missing@example.test" "inactive@example.test" "active@example.test"]]
          (reset! calls [])
          (let [response (await (.inject app #js {:method "POST" :url "/api/auth/login"
                                                 :payload #js {:email email :password "wrong password"}}))]
            (is (= 401 (.-statusCode response)))
            (is (= "invalid_credentials" (aget (.json response) "code")))
            (is (= 1 (count @calls)) (str email " must perform one real bcrypt comparison"))
            (is (string? (first @calls)))
            (when (= email "active@example.test")
              (is (= digest (first @calls)))))))
      (finally (await (.close app))))))
