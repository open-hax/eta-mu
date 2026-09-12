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
