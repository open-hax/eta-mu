(ns axxium.extern.legacy-password
  "Retained bcrypt credential boundary; new identities use the scrypt adapter."
  (:require ["bcryptjs" :as bcrypt]))

(defn ^:async hash-password [password rounds] (await (.hash bcrypt password rounds)))
(defn ^:async verify-password [password hash] (await (.compare bcrypt password hash)))

(def ^:private dummy-hash
  "$2b$12$T5PDXuAs.V3WC9OjbQVApOVfYjMcAfhUBzFwvofgT7GreqLN4CIIO")

(defn ^:async verify-password-or-dummy
  "Perform bcrypt work for unknown identities without admitting the dummy credential."
  [password hash]
  (let [verified? (await (verify-password password (or hash dummy-hash)))]
    (boolean (and hash verified?))))
