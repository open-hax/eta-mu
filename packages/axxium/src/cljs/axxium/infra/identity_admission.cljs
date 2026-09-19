(ns axxium.infra.identity-admission
  "Bound retries of local identity writes without repeating external operations."
  (:require [axxium.extern.identity-host :as host]))

(def timeout-ms "Maximum elapsed wait for a local admission lock." 30000)
(def max-attempts "Finite attempt cap also bounds a stalled or reversed host clock." 1200)

(defn ^:async retry!
  "Retry native Clio contention only; preserve every other error and terminal refusal."
  [operation]
  (let [deadline (+ (host/now) timeout-ms)]
    (loop [attempt 1]
      (let [outcome (try {:result (operation)} (catch :default cause {:cause cause}))]
        (if-let [cause (:cause outcome)]
          (if (= :clio.ledger/concurrent-stream-write (:clio/error (ex-data cause)))
            (if (and (< attempt max-attempts) (< (host/now) deadline))
              (do (await (host/delay! 25)) (recur (inc attempt)))
              (throw (ex-info "Identity storage remained busy; restart authentication"
                              {:code :identity-store-busy
                               :clio/error :clio.ledger/concurrent-stream-write
                               :attempts attempt} cause)))
            (throw cause))
          (:result outcome))))))
