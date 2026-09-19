(ns axxium.law.identity-credential-admission
  "Portable host facts shared by verified credential admission decisions."
  (:require [axxium.law.identity :as identity]
            [malli.core :as m]))

(def ChallengeRecord
  "Immutable ceremony identity; mutable proof-attempt accounting may also be present."
  [:map
   [:purpose :keyword]
   [:browser-hash [:string {:min 1}]]
   [:issued-at [:and :int [:>= 0]]]
   [:expires-at [:and :int [:> 0]]]
   [:private-ref [:string {:min 1}]]])

(def challenge-identity-keys
  "Only these fields bind the private proof data; attempt reservations may advance."
  [:purpose :browser-hash :issued-at :expires-at :private-ref])

(def challenge-fields
  "Explicit browser binding and the record captured with the verified private data."
  [[:challenge-id [:string {:min 1}]]
   [:browser-hash [:string {:min 1}]]
   [:expected-challenge ChallengeRecord]])

(def enrollment-fields
  "Authority captured before verification, rechecked against the transaction state."
  [[:actor-id [:string {:min 1}]]
   [:session-hash [:string {:min 1}]]
   [:expected-session [:map [:principal-id [:string {:min 1}]]
                       [:issued-at {:optional true} [:and :int [:>= 0]]]
                       [:expires-at [:and :int [:> 0]]]]]
   [:challenge-principal-id [:string {:min 1}]]
   [:now [:and :int [:>= 0]]]])

(def session-fields
  "Host-generated response token, its digest and the absolute session interval."
  [[:token [:string {:min 1}]]
   [:token-hash [:string {:min 1}]]
   [:issued-at [:and :int [:>= 0]]]
   [:expires-at [:and :int [:> 0]]]])

(defn validate!
  "Reject malformed admission facts without reading or modifying identity state."
  [schema input code]
  (identity/require! (m/validate schema input) code "Invalid credential admission inputs")
  input)
