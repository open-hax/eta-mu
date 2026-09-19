(ns axxium.law.identity-grants
  "Explicit inputs for changing a principal's current grants."
  (:require [axxium.law.identity :as identity]
            [malli.core :as m]))

(def Request
  [:map {:closed true}
   [:token-hash [:string {:min 1}]]
   [:now [:and :int [:>= 0]]]
   [:principal-id [:string {:min 1}]]
   [:roles [:vector :string]]
   [:capabilities [:vector :string]]])

(defn validate!
  "Refuse malformed grant inputs without reading identity state."
  [request]
  (identity/require! (m/validate Request request) :invalid-grants
                    "Grant updates require a target and string vectors for roles and capabilities")
  request)

(defn delegated-target?
  "Grant changes require another identified principal, including for administrators."
  [requester-id target-id]
  (and (string? requester-id) (seq requester-id)
       (string? target-id) (seq target-id)
       (not= requester-id target-id)))
