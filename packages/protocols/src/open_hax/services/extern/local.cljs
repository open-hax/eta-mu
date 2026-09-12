(ns open-hax.services.extern.local
  "Node-only filesystem notifications and development credential boundary."
  (:require ["node:crypto" :as crypto]
            ["node:fs" :as fs]
            ["node:path" :as path]))

(defn resolve-path [directory] (path/resolve directory))
(defn now [] (.toISOString (js/Date.)))
(defn id [] (str (random-uuid)))

(defn password-digest [password]
  (let [salt (.toString (crypto/randomBytes 16) "hex")]
    {:algorithm :scrypt
     :salt salt
     :digest (.toString (crypto/scryptSync password salt 32) "hex")}))

(defn password-matches? [password {:keys [algorithm salt digest]}]
  (and (= :scrypt algorithm) (string? password) (string? salt) (string? digest)
       (let [actual (crypto/scryptSync password salt 32)
             expected (js/Buffer.from digest "hex")]
         (and (= (.-length actual) (.-length expected))
              (crypto/timingSafeEqual actual expected)))))

(defn report-callback-error! [cause]
  (js/console.error "Local service subscription callback failed" cause))

(defn watch-file! [file notify!]
  (let [closed? (atom false)]
    (letfn [(close! []
              (when (compare-and-set! closed? false true)
                (fs/unwatchFile file listener)))
            (listener [_current _previous]
              (when-not @closed?
                (try (notify!)
                     (catch :default cause
                       (close!)
                       (report-callback-error! cause)))))]
      (fs/watchFile file #js {:interval 50 :persistent false} listener)
      close!)))
