(ns axxium.extern.jwt
  "JOSE boundary. Configuration and claims enter as CLJS maps; signing returns
   a token string and verification returns a keyword-keyed claims map."
  (:require ["jose" :refer [SignJWT jwtVerify]]))

(defn- secret-bytes [secret]
  (.encode (js/TextEncoder.) secret))

(defn ^:async sign!
  [{:keys [secret issuer audience expiry-hours]} claims]
  (let [jwt (SignJWT. (clj->js claims))]
    (doto jwt
      (.setProtectedHeader #js {"alg" "HS256" "typ" "JWT"})
      (.setIssuedAt)
      (.setIssuer issuer)
      (.setAudience audience)
      (.setExpirationTime (str expiry-hours "h")))
    (await (.sign jwt (secret-bytes secret)))))

(defn ^:async verify!
  [{:keys [secret issuer audience]} token]
  (let [result (await (jwtVerify token (secret-bytes secret)
                                 #js {:issuer issuer :audience audience
                                      :clockTolerance 60}))]
    (js->clj (.-payload result) :keywordize-keys true)))
