(ns axxium.law.identity-ceremonies
  "Finite admission contracts for expensive challenge completion."
  (:require [axxium.law.identity :as identity]
            [malli.core :as m]))

(def max-proof-attempts 3)
(def ProofAttemptCount [:and :int [:>= 0]])

(defn require-proof-slot!
  "Refuse corrupt counters and exhausted PGP completion budgets."
  [purpose attempts]
  (identity/require! (and (#{:pgp-login :pgp-enroll} purpose)
                           (m/validate ProofAttemptCount attempts))
                    :invalid-challenge "Invalid PGP completion admission")
  (identity/require! (< attempts max-proof-attempts) :ceremony-rate-limit
                    "Too many proof attempts; request a new authentication challenge"))
