(ns axxium.extern.postgres-test
  (:require [axxium.db :as db]
            [axxium.extern.postgres :as postgres]
            [cljs.test :refer [deftest is]]))

(deftest ^:async postgres-result-and-lifecycle-boundary-test
  (let [calls (atom [])
        closed? (atom false)
        native-pool #js {:query (fn ^:async query-fixture [sql params]
                                 (swap! calls conj [sql (js->clj params)])
                                 #js {:rows #js [#js {:id "actor.test"
                                                     :created_at (js/Date. "2026-09-12T08:00:00Z")
                                                     :roles #js ["editor"]
                                                     :metadata #js {:enabled true :nested #js [nil 4]}
                                                     :bytes (js/Buffer.from #js [0 255])}]
                                      :rowCount 1 :command "SELECT"})
                         :end (fn ^:async end-fixture [] (reset! closed? true))}
        adapter (postgres/pool-adapter native-pool)]
    (with-redefs [db/pool (delay adapter)]
      (let [result (await (db/query "SELECT actor WHERE id = $1" ["actor.test"]))]
        (is (= {:rows [{:id "actor.test" :created_at "2026-09-12T08:00:00.000Z"
                       :roles ["editor"] :metadata {:enabled true :nested [nil 4]}
                       :bytes [0 255]}]
                :row-count 1 :command "SELECT"} result))
        (is (= [["SELECT actor WHERE id = $1" ["actor.test"]]] @calls))
        (is (= (first (:rows result)) (await (db/query-one "SELECT one" []))))
        (is (= (:rows result) (await (db/query-all "SELECT all" [])))))
      (is (nil? (await (db/close!)))))
    (is (true? @closed?))))

(deftest ^:async postgres-migration-empty-rows-and-errors-test
  (let [calls (atom [])
        native-pool #js {:query (fn ^:async query-fixture [sql params]
                                 (swap! calls conj [sql (js->clj params)])
                                 (cond
                                   (= sql db/schema-sql)
                                   #js [#js {:rows #js [] :rowCount nil :command "CREATE"}
                                        #js {:rows #js [] :rowCount nil :command "ALTER"}]
                                   (= sql "error")
                                   (throw (doto (js/Error. "constraint failed")
                                            (aset "code" "23514")
                                            (aset "constraint" "org_reference")))
                                   :else #js {:rows #js [] :rowCount 0 :command "SELECT"}))
                         :end (fn ^:async end-fixture [] nil)}]
    (with-redefs [db/pool (delay (postgres/pool-adapter native-pool))]
      (is (= [{:rows [] :row-count nil :command "CREATE"}
              {:rows [] :row-count nil :command "ALTER"}]
             (await (db/init-schema!))))
      (is (= [db/schema-sql []] (first @calls)))
      (is (nil? (await (db/query-one "empty" []))))
      (is (= [] (await (db/query-all "empty" []))))
      (try
        (await (db/query "error" []))
        (is false "database rejection must propagate")
        (catch :default error
          (is (= {:code "23514" :constraint "org_reference"} (ex-data error))))))))
