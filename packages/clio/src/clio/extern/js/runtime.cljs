(ns clio.extern.js.runtime
  (:require ["node:crypto" :as crypto]))

(defn random-uuid
  []
  (crypto/randomUUID))

(defn now-iso
  []
  (.toISOString (js/Date.)))
