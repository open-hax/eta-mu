(ns open-hax.records.edn.services-test
  (:require [cljs.test :refer [deftest is]]
            [clio.extern.js.fs :as fs]
            [clio.infra.ledger :as ledger]
            [open-hax.openplanner-protocols :as p]
            [open-hax.records.edn.services :as edn]
            [open-hax.records.edn.event-admission :as legacy]
            [open-hax.services.infra.local :as local]
            [open-hax.services.infra.providers :as providers]
            [open-hax.services.extern.api :as api]
            [open-hax.services.extern.local :as host]
            ["node:fs" :as node-fs]
            ["node:os" :as os]
            ["node:path" :as path]))

(defn- directory [] (node-fs/mkdtempSync (path/join (os/tmpdir) "clio-services-")))
(defn- cleanup! [dir] (node-fs/rmSync dir #js {:recursive true :force true}))
(defn- rejected-type [f]
  (try (f) nil (catch :default cause (:services/error (ex-data cause)))))

(defn- ^:async observed? [predicate]
  (let [deadline (+ (js/Date.now) 3000)]
    (loop []
      (cond
        (predicate) true
        (> (js/Date.now) deadline) false
        :else (do
                (await (js/Promise. (fn [resolve _] (js/setTimeout resolve 20))))
                (recur))))))

(deftest ^:async durable-protocol-state-test
  (let [dir (directory)]
    (try
      (let [services (providers/create-provider {:provider :edn :directory dir})
            session (await (p/create-session services {:actor-id "researcher"}))
            doc (await (p/store-document services {:id "d1" :content "inspectable"}))]
        (is (= "d1" (:id doc)))
        (is (= "researcher" (:actor-id (await (p/get-session services (:id session))))))
        (await (p/update-session services (:id session) {:topic "providers"}))
        (await (p/archive-document services "d1"))
        (let [reopened (edn/create-edn-services dir)]
          (is (= "providers" (:topic (await (p/get-session reopened (:id session))))))
          (is (true? (:archived (await (p/get-document reopened "d1")))))
          (is (= ["d1"] (mapv :id (await (p/query-documents reopened {:content "inspectable"})))))
          (await (p/close-session reopened (:id session)))
          (is (nil? (await (p/get-session (edn/create-edn-services dir) (:id session)))))))
      (finally (cleanup! dir)))))

(deftest ^:async graph-label-and-translation-test
  (let [dir (directory)]
    (try
      (let [s (edn/create-edn-services dir)]
        (doseq [id ["a" "b" "c" "disconnected"]] (await (p/add-node s {:id id})))
        (await (p/add-edge s {:source "a" :target "b" :type "supports"}))
        (await (p/add-edge s {:source "b" :target "c" :type "supports"}))
        (await (p/add-edge s {:source "c" :target "a" :type "opposes"}))
        (is (= ["b"] (await (p/query-neighbors s "a" {:direction :out :edge-types ["supports"]}))))
        (is (= ["c"] (await (p/query-neighbors s "a" {:direction :in}))))
        (is (= ["a" "b" "c"] (mapv :id (await (p/traverse s "a" {:depth 2 :direction :out :edge-types ["supports"]})))))
        (is (= ["a"] (mapv :id (await (p/traverse s "a" {:depth 0})))))
        (await (p/create-label s {:id "review" :name "Review"}))
        (await (p/apply-label s "review" "a" "node"))
        (await (p/apply-label s "review" "a" "node"))
        (is (= [{:labelId "review" :targetId "a" :targetType "node"}]
               (await (p/query-by-label s "review" {:target-type ["node"]}))))
        (await (p/create-translation s {:id "segment" :source "bonjour" :target "hello"}))
        (is (= "accepted" (:label (await (p/label-translation s "segment" "accepted")))))
        (let [batch-id (await (p/batch-translate s [{:source "one"} {:source "two"}]))
              state (local/state (:store (edn/create-edn-services dir)))]
          (is (= 2 (count (filter #(= batch-id (:batch-id %)) (vals (:translations state))))))
          (is (= "hello" (get-in state [:translations "segment" :target])))))
      (finally (cleanup! dir)))))

(deftest ^:async credentials-are-local-durable-and-redacted-test
  (let [dir (directory)]
    (try
      (let [s (edn/create-edn-services dir)
            created (await (p/create-user s {:username "dev" :password "local-secret-fixture"}))
            id (get-in created [:payload :userId])]
        (is (= "user.create.success" (:event/type created)))
        (is (= "user.login.failure" (:event/type (await (p/authenticate s {:username "dev" :password "wrong"})))))
        (is (= id (get-in (await (p/authenticate (edn/create-edn-services dir)
                                                {:username "dev" :password "local-secret-fixture"})) [:payload :userId])))

        (let [user (await (p/get-user s id))]
          (is (nil? (:password user)))
          (is (nil? (:credentials user))))
        (is (not (.includes (fs/read-text (str dir "/services.edn")) "local-secret-fixture")))
        (await (p/update-user s id {:password "replacement-fixture" :display-name "Developer"}))
        (is (= "user.login.failure" (:event/type (await (p/authenticate s {:username "dev" :password "local-secret-fixture"})))))
        (is (= "user.login.success" (:event/type (await (p/authenticate s {:username "dev" :password "replacement-fixture"})))))
        (is (= "Developer" (:display-name (await (p/get-user (edn/create-edn-services dir) id))))))
      (finally (cleanup! dir)))))

(deftest ^:async event-admission-preserves-protocol-envelope-test
  (let [dir (directory)]
    (try
      (let [s (edn/create-edn-services dir)
            envelope {:event/id "caller-stable-id" :event/type "test.recorded" :payload {:answer 42}}
            first-event (await (p/append-event! s envelope))
            retry (await (p/append-event! s envelope))]
        (is (= first-event retry))
        (is (= 1 (count (:canonical/events (local/history (:store s))))))
        (is (= [first-event] (await (p/query-events (edn/create-edn-services dir) {:event/type "test.recorded"}))))
        (is (= :event-id-collision
               (try (await (p/append-event! s (assoc envelope :payload {:answer 43})))
                    nil (catch :default cause (:services/error (ex-data cause))))))
        (is (= :invalid-envelope
               (try (await (p/append-event! s {:payload {}}))
                    nil (catch :default cause (:services/error (ex-data cause))))))
        (is (vector? (await (p/append-events! s [(p/make-envelope "batch.one" {})
                                               (p/make-envelope "batch.two" {})])))))
      (finally (cleanup! dir)))))

(deftest ^:async authentication-refuses-concurrently-replaced-password-test
  (let [dir (directory)]
    (try
      (let [s (edn/create-edn-services dir)
            created (await (p/create-user s {:username "race" :password "old-fixture"}))
            id (get-in created [:payload :userId])
            competing (edn/create-edn-services dir)
            matches? host/password-matches?
            replacement (host/password-digest "new-fixture")]
        (with-redefs [host/password-matches?
                      (fn [password digest]
                        (let [matched? (matches? password digest)]
                          (local/transact! (:store competing)
                                           (fn [_] {:changes [{:op :patch :collection :users :id id
                                                              :value {:credentials replacement}}]}))
                          matched?))]
          (is (= :clio.ledger/concurrent-stream-write
                 (try (await (p/authenticate s {:username "race" :password "old-fixture"}))
                      nil (catch :default cause (:clio/error (ex-data cause)))))))
        (is (empty? (await (p/query-events s {:event/type "user.login.success"}))))
        (is (= "user.login.failure"
               (:event/type (await (p/authenticate s {:username "race" :password "old-fixture"})))))
        (is (= "user.login.success"
               (:event/type (await (p/authenticate s {:username "race" :password "new-fixture"}))))))
      (finally (cleanup! dir)))))

(deftest missing-and-corrupt-ledgers-fail-closed-test
  (let [dir (directory)]
    (try
      (edn/create-edn-services dir)
      (node-fs/unlinkSync (str dir "/services.edn"))
      (is (= :missing-ledger (rejected-type #(edn/create-edn-services dir))))
      (node-fs/writeFileSync (str dir "/services.edn") "{:invalid")
      (is (= :clio.ledger/invalid-edn
             (try (edn/create-edn-services dir) nil
                  (catch :default cause (:clio/error (ex-data cause))))))
      (finally (cleanup! dir)))))

(deftest ^:async stale-writer-refuses-lost-update-test
  (let [dir (directory)]
    (try
      (let [s (edn/create-edn-services dir)
            original-append ledger/append-event!
            competing (edn/create-edn-services dir)
            intercept? (atom true)]
        (with-redefs [ledger/append-event!
                      (fn [revisions file candidate]
                        (when (compare-and-set! intercept? true false)
                          (local/transact! (:store competing)
                                           (fn [_] {:changes [{:op :put :collection :documents :id "winner"
                                                              :value {:id "winner"}}]})))
                        (original-append revisions file candidate))]
          (is (= :clio.ledger/concurrent-stream-write
                 (try (await (p/store-document s {:id "loser"})) nil
                      (catch :default cause (:clio/error (ex-data cause)))))))
        (is (= ["winner"] (mapv :id (await (p/query-documents (edn/create-edn-services dir) {}))))))
      (finally (cleanup! dir)))))

(deftest ^:async subscriptions-deliver-bursts-and-close-test
  (let [dir (directory)
        s (edn/create-edn-services dir)
        events (atom [])
        rooms (atom [])
        event-watch (p/watch-events s {:event/type "watched"} #(swap! events conj %))
        room-watch (p/subscribe s "room" "changed" #(swap! rooms conj %))]
    (try
      (await (p/append-events! (edn/create-edn-services dir)
                               [(p/make-envelope "watched" {:n 1})
                                (p/make-envelope "ignored" {})
                                (p/make-envelope "watched" {:n 2})]))
      (await (p/emit-to-room s "other-room" "changed" {:n 0}))
      (await (p/emit-to-room s "room" "changed" {:n 1}))
      (is (await (observed? #(and (= 2 (count @events)) (= 1 (count @rooms))))))
      (is (= [1 2] (mapv #(get-in % [:payload :n]) @events)))
      (is (= [{:n 1}] @rooms))
      ((:close! event-watch))
      (p/unsubscribe s room-watch)
      (let [observed (atom false)
            probe (p/subscribe s "room" "changed" (fn [_] (reset! observed true)))]
        (try
          (await (p/append-event! s (p/make-envelope "watched" {:n 3})))
          (await (p/emit-to-room s "room" "changed" {:n 2}))
          (is (await (observed? #(deref observed))))
          (finally (p/unsubscribe s probe))))
      (is (= 2 (count @events)))
      (is (= 1 (count @rooms)))
      (finally
        ((:close! event-watch))
        (p/unsubscribe s room-watch)
        (cleanup! dir)))))

(deftest configuration-never-falls-back-test
  (is (= :unknown-provider (rejected-type #(providers/create-provider {:provider :unknown}))))
  (is (= :missing-directory (rejected-type #(providers/create-provider {:provider :edn}))))
  (is (= :missing-database (rejected-type #(providers/create-provider {:provider :mongo})))))

(deftest javascript-boundary-preserves-namespaced-wire-keys
  (is (= {:event/type "wire.recorded" :payload {:trace/id "stable"}}
         (js->clj (api/make-envelope "wire.recorded" #js {"trace/id" "stable"})
                  :keywordize-keys true))))

(deftest ^:async javascript-optional-protocol-arguments-test
  (let [dir (directory)]
    (try
      (let [s (edn/create-edn-services-js dir)]
        (is (string? (aget (await ((aget s "create-session"))) "id")))
        (await ((aget s "add-node") #js {:id "a"}))
        (await ((aget s "add-node") #js {:id "b"}))
        (await ((aget s "add-edge") #js {:source "a" :target "b"}))
        (is (= ["b"] (js->clj (await ((aget s "query-neighbors") "a")))))
        (is (= ["a" "b"] (mapv #(aget % "id") (await ((aget s "traverse") "a")))))
        (await ((aget s "create-label") #js {:id "review"}))
        (await ((aget s "apply-label") "review" "a" "node"))
        (is (= [{"labelId" "review" "targetId" "a" "targetType" "node"}]
               (js->clj (await ((aget s "query-by-label") "review"))))))
      (finally (cleanup! dir)))))

(deftest ^:async javascript-legacy-watch-has-immediate-close-handle-test
  (let [dir (directory)
        s (legacy/create-edn-event-admission-js dir)
        received (atom [])
        handle ((aget s "watch-events") #js {} #(swap! received conj %))]
    (try
      (is (nil? (aget handle "then")))
      (is (fn? (aget handle "close")))
      (await ((aget s "append-event!") #js {"event/type" "legacy.watched"}))
      (is (await (observed? #(seq @received))))
      (is (= "legacy.watched" (aget (first @received) "event/type")))
      (finally
        ;; Await also closes the pre-fix Promise handle in the regression run.
        (let [resolved (await handle)
              close (or (aget resolved "close") (aget resolved "close!"))]
          (when close (close)))
        (cleanup! dir)))))

(deftest ^:async subscription-ledger-failure-reports-and-closes-test
  (doseq [damage [:corrupt :deleted]]
    (let [dir (directory)
          s (edn/create-edn-services dir)
          file (str dir "/services.edn")
          original (fs/read-text file)
          failures (atom [])
          received (atom [])
          handle (p/watch-events s {} #(swap! received conj %))]
      (try
        (with-redefs [host/report-callback-error! #(swap! failures conj %)]
          (if (= damage :corrupt)
            (node-fs/writeFileSync file "{:invalid")
            (node-fs/unlinkSync file))
          (is (await (observed? #(seq @failures))) (name damage))
          (is (= (if (= damage :corrupt) :clio.ledger/invalid-edn :missing-ledger)
                 (let [data (ex-data (first @failures))]
                   (or (:clio/error data) (:services/error data)))))
          (node-fs/writeFileSync file original)
          (let [fresh-events (atom [])
                fresh-watch (p/watch-events s {} #(swap! fresh-events conj %))]
            (try
              (await (p/append-event! s (p/make-envelope "after.repair" {})))
              (is (await (observed? #(seq @fresh-events))))
              (is (empty? @received) "Failed subscription remains closed after repair")
              (is (= 1 (count @failures)))
              (finally ((:close! fresh-watch))))))
        (finally ((:close! handle)) (cleanup! dir))))))

(deftest ^:async javascript-graph-boundary-preserves-id-and-node-shapes
  (let [dir (directory)]
    (try
      (let [s (edn/create-edn-services-js dir)]
        (await ((aget s "add-node") #js {:id "a" :type "concept" :label "Alpha"}))
        (await ((aget s "add-node") #js {:id "b" :type "concept" :label "Beta"}))
        (await ((aget s "add-edge") #js {:source "a" :target "b" :type "supports"}))
        (let [reopened (edn/create-edn-services-js dir)
              ids (await ((aget reopened "query-neighbors") "a"
                          #js {:direction "out" :edge-types #js ["supports"]}))
              nodes (await ((aget reopened "traverse") "a" #js {:depth 1}))]
          (is (js/Array.isArray ids))
          (is (= ["b"] (js->clj ids)))
          (is (every? string? (array-seq ids)))
          (is (= [{:id "a" :type "concept" :label "Alpha"}
                  {:id "b" :type "concept" :label "Beta"}]
                 (mapv #(select-keys % [:id :type :label])
                       (js->clj nodes :keywordize-keys true))))))
      (finally (cleanup! dir)))))

(deftest ^:async query-validation-and-null-existence-test
  (let [dir (directory)]
    (try
      (let [s (edn/create-edn-services dir)]
        (is (= :unsupported-query
               (try (await (p/query-documents s {:field {:$unknown true}})) nil
                    (catch :default cause (:services/error (ex-data cause))))))
        (await (p/store-document s {:id "present" :nullable nil :nested {:value nil}}))
        (await (p/store-document s {:id "absent"}))
        (is (= ["present"] (mapv :id (await (p/query-documents s {:nullable {:$exists true}})))))
        (is (= ["absent"] (mapv :id (await (p/query-documents s {:nullable {:$exists false}})))))
        (is (= ["present"] (mapv :id (await (p/query-documents s {:nested.value {:$exists true}}))))))
      (finally (cleanup! dir)))))

(deftest ^:async independently-selectable-service-providers-test
  (let [base-dir (directory)
        documents-dir (directory)]
    (try
      (let [documents (edn/create-edn-services documents-dir)
            combined (providers/create-provider {:provider :edn :directory base-dir
                                                  :overrides {:documents documents}})]
        (await (p/store-document combined {:id "separate"}))
        (is (nil? (await (p/get-document (edn/create-edn-services base-dir) "separate"))))
        (is (= "separate" (:id (await (p/get-document documents "separate")))))
        (is (= :invalid-provider-contract
               (rejected-type #(providers/create-provider {:provider :edn :directory base-dir
                                                           :overrides {:documents nil}})))))
      (finally (cleanup! base-dir) (cleanup! documents-dir)))))
