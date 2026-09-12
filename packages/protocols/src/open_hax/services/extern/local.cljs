(ns open-hax.services.extern.local
  "Node-only filesystem notifications and development credential boundary."
  (:require ["node:crypto" :as crypto]
            ["node:path" :as path]))

(defn resolve-path [directory] (path/resolve directory))
(defn now [] (.toISOString (js/Date.)))
(defn id [] (str (random-uuid)))

(defn already-exists-error?
  "Only a native exclusive-create collision permits reopening a concurrent winner."
  [cause]
  (= "EEXIST" (.-code cause)))

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

(defn watch-file!
  "Poll the caller's canonical snapshot, including writes during subscription setup."
  [_file notify!]
  (let [closed? (atom false)
        timer (atom nil)]
    (letfn [(close! []
              (when (compare-and-set! closed? false true)
                (js/clearInterval @timer)))
            (poll! []
              (when-not @closed?
                (try (notify!)
                     (catch :default cause
                       (close!)
                       (report-callback-error! cause)))))]
      ;; Native watchFile establishes its first stat asynchronously. A write
      ;; before that baseline can disappear until another filesystem change.
      ;; Reading history on every tick also survives inode replacement.
      (let [interval (js/setInterval poll! 50)]
        (reset! timer interval)
        (.unref interval))
      close!)))
