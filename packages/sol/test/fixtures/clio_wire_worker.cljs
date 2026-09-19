(ns clio-wire-worker
  (:require ["node:fs" :as fs]
            [open-hax.sol.infra.agent.clio-store :as store]
            [open-hax.sol.shape.episode-event :as event]))

(defn -main [directory episode]
  (let [provider (store/open-store directory)
        context (event/episode-context {:run-id "run" :session-id "session" :turn-id "turn"
                                        :episode-id episode :causal-root "shared-wire"})
        envelope (event/envelope context "shared-wire" "2026-09-12T12:00:00.000Z"
                                 nil "sol.run.started" {:episode episode})]
    (fs/writeFileSync (str directory "/ready-" episode) "ready")
    (while (not (fs/existsSync (str directory "/go")))
      (js/Atomics.wait (js/Int32Array. (js/SharedArrayBuffer. 4)) 0 0 10))
    (try
      (store/append-envelope! provider envelope)
      (println (js/JSON.stringify #js {:status "accepted" :episode episode}))
      (catch :default error
        (println (js/JSON.stringify #js {:status "refused" :episode episode
                                         :code (str (:sol/error (ex-data error)))}))))))
