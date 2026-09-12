(ns axxium.extern.legacy-password-test
  (:require [axxium.extern.legacy-password :as password]
            [cljs.test :refer [deftest is]]))

(deftest ^:async retained-bcrypt-boundary-awaits-real-sdk-results-and-refusals
  (let [digest (await (password/hash-password "legacy-fixture" 4))]
    (is (string? digest))
    (is (true? (await (password/verify-password "legacy-fixture" digest))))
    (is (false? (await (password/verify-password "different-fixture" digest))))
    (try
      (await (password/hash-password nil 4))
      (is false "Malformed input must reject through the async adapter")
      (catch :default error (is (instance? js/Error error))))))

(deftest ^:async dummy-bcrypt-work-never-authenticates-an-unknown-identity
  (let [digest (await (password/hash-password "actual password" 4))]
    (is (true? (await (password/verify-password-or-dummy "actual password" digest))))
    (is (false? (await (password/verify-password-or-dummy "wrong password" digest))))
    (is (false? (await (password/verify-password-or-dummy "wrong password" nil))))
    (is (false? (await (password/verify-password-or-dummy
                       "Axxium fixed dummy comparison, not an account password" nil))))))
