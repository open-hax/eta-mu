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

(def Routes
  [:map {:closed true}
   [:origin :string]
   [:routes [:vector [:map {:closed true}
                     [:method [:enum "GET" "POST"]]
                     [:path :string]
                     [:handler fn?]]]]])

(defn require-routes! [routes]
  (identity/require! (m/validate Routes routes) :invalid-routes
                    "Identity route descriptions are invalid")
  routes)
