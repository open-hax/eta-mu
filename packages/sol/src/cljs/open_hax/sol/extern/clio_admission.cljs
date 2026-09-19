(ns open-hax.sol.extern.clio-admission
  "Kernel admission lock for Sol wire identities across all episode streams."
  (:require ["node:fs" :as native]
            [clio.extern.js.fs :as fs]))

(defonce ^:private held (atom #{}))

(defn- identity-key [path]
  (let [stat (native/statSync path #js {:bigint true})]
    (str (.-dev stat) ":" (.-ino stat))))

(defn with-lock!
  "Serialize the complete Sol wire-ID decision and Clio append on a separate inode.
   Reentrant same-process admission refuses before opening an alias descriptor."
  [path operation]
  (let [id (identity-key path)]
    (when (contains? @held id)
      (throw (ex-info "Sol admission is already active in this process"
                      {:sol/error :sol.clio/reentrant-admission})))
    (swap! held conj id)
    (try
      (let [lock (fs/acquire-lock! path)]
        (try (operation) (finally (fs/release-lock! lock))))
      (finally (swap! held disj id)))))
