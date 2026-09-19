(ns axxium.law.identity-oauth
  "The defined operation interface exported by the ATProto SDK adapter."
  (:require [axxium.law.identity :as identity]
            [malli.core :as m]))

(def ClientOperations
  [:map {:closed true}
   [:authorize! fn?]
   [:app-state! fn?]
   [:callback! fn?]
   [:metadata :map]
   [:jwks :map]])

(defn require-client! [operations]
  (identity/require! (m/validate ClientOperations operations) :invalid-provider-adapter
                    "ATProto adapter operations are invalid")
  operations)

(defn require-client-key-reference!
  "Refuse missing or malformed references instead of replacing an established signing key."
  [reference]
  (identity/require! (and (string? reference) (seq reference)) :invalid-client-key
                    "Persisted ATProto client key reference is invalid")
  reference)
