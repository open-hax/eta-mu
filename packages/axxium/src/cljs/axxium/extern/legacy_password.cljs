(ns axxium.extern.legacy-password
  "Retained bcrypt credential boundary; new identities use the scrypt adapter."
  (:require ["bcryptjs" :default bcrypt]))

(defn hash-password [password rounds] (.hash bcrypt password rounds))
(defn verify-password [password hash] (.compare bcrypt password hash))
