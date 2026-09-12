(ns axxium.law.identity-http
  "Defined response data between identity orchestration and native HTTP transport."
  (:require [axxium.law.identity :as identity]
            [malli.core :as m]))

(def Response
  [:map {:closed true}
   [:status {:optional true} [:int {:min 200 :max 599}]]
   [:body {:optional true} :any]
   [:redirect {:optional true} :string]
   [:session-token {:optional true} :string]
   [:clear-session? {:optional true} :boolean]
   [:browser-token {:optional true} :string]])

(defn require-response! [response]
  (identity/require! (m/validate Response response) :invalid-response
                    "Identity handler returned invalid response data")
  response)
