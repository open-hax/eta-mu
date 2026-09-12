(ns open-hax.sol.infra.agent.clio-store-test
  (:require ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]
            [cljs.test :refer [deftest is testing]]
            [clio.infra.ledger :as ledger]
            [clio.infra.runtime :as clio-runtime]
            [open-hax.sol.infra.agent.clio-store :as clio-store]
            [open-hax.sol.infra.agent.episode-ledger :as episode-ledger]
            [open-hax.sol.infra.agent.service :as service]
            [open-hax.sol.infra.config :as config]
            [open-hax.sol.shape.episode-event :as episode-event]))

(defn- temporary-directory []
  (fs/mkdtempSync (path/join (os/tmpdir) "sol-clio-test-")))

(defn- remove-directory! [directory]
  (fs/rmSync directory #js {:recursive true :force true}))

(def context
  (episode-event/episode-context
   {:run-id "run-1"
    :session-id "session-1"
    :turn-id "turn-1"
    :episode-id "episode-1"
    :causal-root "wire-event-1"
    :auth-context {:principal/actor-id "actor.research"
                   :principal/entity-id "entity.research"
                   :principal/kind "agent"}
    :agent-spec {:contract-id "agent/research" :contract-revision "git:abc"}}))

(def first-envelope
  (episode-event/envelope context "wire-event-1" "2026-09-11T00:00:00.000Z"
                          nil "sol.run.started" {:status "running"}))

(def second-envelope
  (episode-event/envelope context "wire-event-2" "2026-09-11T00:00:01.000Z"
                          "wire-event-1" "sol.turn.started" {:status "running"}))

(defn- append-with-overlap!
  "Preempt one already-planned append with a second store's real kernel write."
  [loser winner requested winning]
  (let [append! clio-runtime/append!
        pending (atom true)]
    (with-redefs [clio-runtime/append!
                  (fn [runtime file schema-id event]
                    (when (compare-and-set! pending true false)
                      (clio-store/append-envelope! winner winning))
                    (append! runtime file schema-id event))]
      (try {:value (clio-store/append-envelope! loser requested)}
           (catch :default error {:error (ex-data error)})))))

(deftest overlapping-identical-wire-retries-return-the-first-durable-fact
  (let [directory (temporary-directory)]
    (try
      (let [loser (clio-store/open-store directory)
            winner (clio-store/open-store directory)
            result (append-with-overlap! loser winner first-envelope first-envelope)
            events (clio-store/canonical-events winner)]
        (is (nil? (:error result)))
        (is (= first-envelope (:value result)))
        (is (= [first-envelope] (mapv :event/data events)))
        (clio-store/append-envelope! loser first-envelope)
        (is (= events (clio-store/canonical-events loser)) "Original UUID and timestamp stay unchanged"))
      (finally (remove-directory! directory)))))

(deftest overlapping-changed-or-different-wire-events-remain-conflicts
  (doseq [[winning refusal]
          [[(assoc first-envelope :payload {:changed true}) :sol.clio/id-collision]
           [(assoc first-envelope :event/id "another-wire" :causal/root "another-wire") :sol.clio/causal-conflict]]]
    (let [directory (temporary-directory)]
      (try
        (let [loser (clio-store/open-store directory)
              winner (clio-store/open-store directory)
              result (append-with-overlap! loser winner first-envelope winning)]
          (is (= refusal (get-in result [:error :sol/error])))
          (is (nil? (:value result)))
          (is (= [winning] (clio-store/read-envelopes loser))))
        (finally (remove-directory! directory))))))

(deftest restart-replay-and-wire-retry-test
  (let [directory (temporary-directory)]
    (try
      (let [store (clio-store/open-store directory)]
        (is (= first-envelope (clio-store/append-envelope! store first-envelope)))
        (is (= second-envelope (clio-store/append-envelope! store second-envelope)))
        (let [reopened (clio-store/open-store directory)
              events (clio-store/canonical-events reopened)]
          (is (= [first-envelope second-envelope] (clio-store/read-envelopes reopened)))
          (is (= [1 2] (mapv :event/seq events)))
          (is (= [[] [(:event/id (first events))]] (mapv :event/causes events)))
          (is (= "agent" (get-in events [0 :event/data :event/from
                                         :principal/binding :principal/kind])))
          (is (= first-envelope (clio-store/append-envelope! reopened first-envelope)))
          (is (= events (clio-store/canonical-events reopened)))))
      (finally (remove-directory! directory)))))

(deftest conflicts-never-mutate-history-test
  (let [directory (temporary-directory)]
    (try
      (let [store (clio-store/open-store directory)]
        (clio-store/append-envelope! store first-envelope)
        (testing "same wire id, different payload"
          (try
            (clio-store/append-envelope! store (assoc first-envelope :payload {:changed true}))
            (is false "changed duplicate must fail")
            (catch :default error
              (is (= :sol.clio/id-collision (:sol/error (ex-data error)))))))
        (testing "stale or absent causal parent"
          (try
            (clio-store/append-envelope! store (dissoc second-envelope :causal/parent))
            (is false "a missing predecessor must fail")
            (catch :default error
              (is (= :sol.clio/causal-conflict (:sol/error (ex-data error)))))))
        (is (= [first-envelope] (clio-store/read-envelopes store))))
      (finally (remove-directory! directory)))))

(deftest corrupted-ledger-and-missing-ledger-are-not-reset-test
  (let [directory (temporary-directory)]
    (try
      (let [store (clio-store/open-store directory)
            file (:ledger-file store)]
        (clio-store/append-envelope! store first-envelope)
        (fs/appendFileSync file "{:unfinished\n")
        (try
          (clio-store/open-store directory)
          (is false "corruption must fail on reopening")
          (catch :default error
            (is (= :clio.ledger/invalid-edn (:clio/error (ex-data error))))))
        (fs/unlinkSync file)
        (try
          (clio-store/open-store directory)
          (is false "missing initialized ledger must fail")
          (catch :default error
            (is (= :sol.clio/missing-ledger (:sol/error (ex-data error))))))
        (is (false? (fs/existsSync file))))
      (finally (remove-directory! directory)))))

(deftest missing-schema-history-is-not-ignored-test
  (let [directory (temporary-directory)]
    (try
      (let [store (clio-store/open-store directory)
            old-runtime (clio-runtime/open
                         (str directory "/schemas")
                         (assoc-in (get-in store [:clio-runtime :schema/current :schema/catalog])
                                   [:sol/episode-emitted 1 :description] "old catalog"))]
        (clio-store/append-envelope! (assoc store :clio-runtime old-runtime) first-envelope)
        (is (seq (ledger/read-ledger (:ledger-file store))))
        (is (not= (get-in old-runtime [:schema/current :schema/root])
                  (get-in store [:clio-runtime :schema/current :schema/root])))
        (fs/unlinkSync (str directory "/schemas/"
                            (get-in old-runtime [:schema/current :schema/root]) ".edn"))
        (try
          (clio-store/open-store directory)
          (is false "a current schema must not stand in for missing historical schema")
          (catch :default error
            (is (= :clio.schema/unknown-revision (:clio/error (ex-data error)))))))
      (finally (remove-directory! directory)))))

(deftest ^:async service-turn-persists-through-configured-clio-provider-test
  (let [directory (temporary-directory)
        cfg (assoc (config/cfg)
                   :clio-provider :edn
                   :clio-directory directory
                   :turn-executor!
                   (fn [_runtime _config request]
                     {:answer "local provider ran"
                      :run_id (:run-id request)
                      :session_id (:session-id request)
                      :model "local-test"}))]
    (try
      (is (fn? (episode-ledger/configured-appender cfg)))
      (let [result (await (service/send-agent-turn!
                          nil cfg {:run-id "run-1"
                                   :session-id "session-1"
                                   :model "local-test"}))
            events (clio-store/read-envelopes (clio-store/open-store directory))]
        (is (= "local provider ran" (:answer result)))
        (is (= ["sol.run.started" "sol.turn.started"
                "sol.turn.completed" "sol.run.completed"]
               (mapv :event/type events)))
        (is (= 1 (count (set (map :episode/id events)))))
        (is (= (:event/id (first events)) (:causal/root (last events)))))
      (finally (remove-directory! directory)))))
