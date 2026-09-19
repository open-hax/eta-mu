(ns axxium.config-test
  (:require [axxium.config :as config]
            [axxium.extern.environment :as environment]
            [cljs.test :refer [deftest is]]))

(deftest environment-defaults-and-parsing-test
  (with-redefs [environment/read-env (constantly nil)]
    (let [actual (config/read-config)]
      (is (= 8787 (:axxium/port actual)))
      (is (= 5432 (:db/port actual)))
      (is (= 168 (:jwt/expiry-hours actual)))
      (is (false? (:oauth/github-enabled actual)))
      (is (= "axxium" (:db/name actual)))))
  (with-redefs [environment/read-env
                (fn [key]
                  (get {"AXXIUM_PORT" "9123" "DB_PORT" " 6543suffix"
                        "JWT_EXPIRY_HOURS" "0" "GITHUB_OAUTH_ENABLED" "TRUE"
                        "SESSION_COOKIE_SECURE" "false" "DB_PASSWORD" ""} key))]
    (let [actual (config/read-config)]
      (is (= 9123 (:axxium/port actual)))
      (is (= 6543 (:db/port actual)) "legacy parseInt accepts a numeric prefix")
      (is (zero? (:jwt/expiry-hours actual)))
      (is (true? (:oauth/github-enabled actual)))
      (is (false? (:session/cookie-secure actual)))
      (is (= "" (:db/password actual))))))

(deftest configuration-lookup-and-database-url-test
  (with-redefs [config/config {:db/host "localhost" :db/port 5432 :db/name "identity"
                              :db/user "app" :db/password "password"
                              :nested {:value 42}}]
    (is (= "identity" (config/get-in-config :db/name)))
    (is (= "identity" (config/get-in-config [:db/name])))
    (is (= 42 (config/get-in-config [:nested :value])))
    (is (= "postgresql://app:password@localhost:5432/identity" (config/db-url))))
  (with-redefs [config/config {:db/host "localhost" :db/port 5432 :db/name "identity"
                              :db/user "app" :db/password ""}]
    (is (= "postgresql://app@localhost:5432/identity" (config/db-url)))))
