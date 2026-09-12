(ns axxium.extern.legacy-password
  "Retained bcrypt credential boundary; new identities use the scrypt adapter."
  (:require ["bcryptjs" :as bcrypt]))

(defn ^:async hash-password [password rounds] (await (.hash bcrypt password rounds)))
(defn ^:async verify-password [password hash] (await (.compare bcrypt password hash)))
