(ns document-history.infra.store-test
  (:require [cljs.test :refer [async deftest is testing]]
            [clio.infra.event :as event]
            [clio.infra.ledger :as ledger]
            [clio.infra.projection :as projection]
            [clio.infra.runtime :as runtime]
            [clio.shape.edn :as edn]
            [document-history.extern.fs :as fs]
            [document-history.extern.process :as process]
            [document-history.infra.store :as store]))

(defn temporary-root [] (str "/tmp/document-history-" (fs/unique-name) "/.ημ/documents"))
(defn command
  ([id markdown] (command id markdown []))
  ([id markdown parents]
   {:document/id id :document/metadata {:title markdown :labels #{:a :b}}
    :document/markdown markdown :revision/parents parents :revision/actor "test:editor"}))
(defn error-type [f]
  (try (f) nil (catch :default error
                (or (:document-history/error (ex-data error))
                    (:clio/error (ex-data error)) :host-error))))
(defn logical [value] (dissoc value :commit/revision :seed/created?))
(defn accepted-events [db]
  (:canonical/events
   (ledger/canonicalize-files
    (:schema/revisions (runtime/refresh (:store/runtime db)))
    (fs/finalized-ledgers (:store/ledgers db)))))

(deftest finalized-clio-identities-remain-extendable-without-case-rewriting
  (let [root (temporary-root)]
    (try
      (let [db (store/open! root)
            rt (runtime/refresh (:store/runtime db))
            imported-id "ABCDEF01-2345-8ABC-BDEF-0123456789AB"
            imported (assoc (event/make-event
                             (:schema/current rt) :document-history/revision-recorded
                             {:event/stream "external:document-revision" :event/seq 1
                              :event/actor "test:external-editor" :event/subject "doc"
                              :event/data {:document/metadata {:title "external"}
                                           :document/markdown "external"}})
                            :event/id imported-id)
            partition (fs/join (:store/ledgers db) "external.edn")]
        (ledger/create-ledger! partition)
        (ledger/append-event! (:schema/revisions rt) partition imported)
        (is (= [imported-id] (:revision/heads (store/read! db "doc"))))
        (is (= "external" (:document/markdown (store/read-revision! db "doc" imported-id))))
        (let [sibling (store/commit! db (command "doc" "independent root"))
              child (try
                      (store/commit! db (command "doc" "extended imported root" [imported-id]))
                      (catch :default cause
                        {:test/error (:document-history/error (ex-data cause))}))]
          (is (:commit/revision child) (pr-str child))
          (when-let [child-id (:commit/revision child)]
            (let [branch (store/read-revision! db "doc" child-id)]
              (is (= #{(:commit/revision sibling) child-id} (set (:revision/heads child))))
              (is (:revision/conflicted? child))
              (is (= [imported-id child-id] (mapv :revision/id (:revision/history branch))))
              (is (= [imported-id] (:revision/parents (last (:revision/history branch)))))
              (is (= imported (first (filter #(= imported-id (:event/id %)) (accepted-events db)))))
              (let [resolved (store/commit! db (command "doc" "resolved" (:revision/heads child)))]
                (is (false? (:revision/conflicted? resolved)))
                (is (= 4 (count (:revision/history resolved))))
                (is (= (set (:revision/heads child))
                       (set (:revision/parents (last (:revision/history resolved))))))))))
        (let [before (accepted-events db)]
          (doseq [invalid-id ["aaaaaaaa-aaaa-0aaa-8aaa-aaaaaaaaaaaa"
                             "aaaaaaaa-aaaa-4aaa-0aaa-aaaaaaaaaaaa"]]
            (is (= :invalid-command
                   (error-type #(store/commit! db (command "doc" "invalid" [invalid-id])))))
            (is (= before (accepted-events db))))))
      (finally (fs/remove-tree! root)))))

(deftest revisions-preserve-both-siblings-and-explicit-resolution
  (let [root (temporary-root)]
    (try
      (let [db (store/open! root)
            base (store/commit! db (command "doc" "original"))
            parent (:commit/revision base)
            a (store/commit! db (command "doc" "first edit" [parent]))
            b (store/commit! db (command "doc" "second edit" [parent]))
            before (store/read! db "doc")]
        (is (= 3 (count (:revision/history before))))
        (is (= #{(:commit/revision a) (:commit/revision b)} (set (:revision/heads before))))
        (is (:revision/conflicted? before))
        (is (= #{"original" "first edit" "second edit"}
               (set (map :document/markdown (:revision/history before)))))
        (testing "each branch has its own causal snapshot"
          (doseq [[commit body] [[a "first edit"] [b "second edit"]]]
            (let [branch (store/read-revision! db "doc" (:commit/revision commit))]
              (is (= body (:document/markdown branch)))
              (is (= body (fs/read-text (:snapshot/markdown-path branch))))
              (is (= 2 (count (:revision/history branch))))
              (is (false? (:revision/conflicted? branch))))))
        (let [resolved (store/commit! db (command "doc" "merged deliberately" (:revision/heads before)))]
          (is (false? (:revision/conflicted? resolved)))
          (is (= [(:commit/revision resolved)] (:revision/heads resolved)))
          (is (= 4 (count (:revision/history resolved))))
          (is (= (set (:revision/heads before))
                 (set (:revision/parents (last (:revision/history resolved))))))))
      (finally (fs/remove-tree! root)))))

(deftest real-processes-keep-concurrent-writes-and-identical-timestamps
  (async done
    ((^:async fn []
       (try
  (let [root (temporary-root)]
    (try
      (let [db (store/open! root)
            base (store/commit! db (command "doc" "base"))
            parents [(:commit/revision base)]
            results (mapv edn/read-one
                          (await (process/writers! root [(command "doc" "worker A" parents)
                                                         (command "doc" "worker B" parents)] "commit")))
            value (store/read! db "doc")
            children (filterv #(seq (:revision/parents %)) (:revision/history value))]
        (is (every? :commit/revision results) (pr-str results))
        (is (= 2 (count (:revision/heads value))))
        (is (:revision/conflicted? value))
        (is (= #{"worker A" "worker B"} (set (map :document/markdown children))))
        (is (= ["2026-09-13T12:00:00.000Z"] (vec (distinct (map :revision/at children)))))
        (is (= (set parents) (set (mapcat :revision/parents children)))))
      (finally (fs/remove-tree! root))))
         (catch :default cause (is false (str cause)))
         (finally (done)))))))

(deftest concurrent-seeds-import-exactly-once
  (async done
    ((^:async fn []
       (try
  (let [root (temporary-root)]
    (try
      (let [db (store/open! root)
            results (mapv edn/read-one
                          (await (process/writers! root [(command "legacy" "migration")
                                                         (command "legacy" "migration")] "seed")))
            value (store/read! db "legacy")]
        (is (= #{true false} (set (map :seed/created? results))) (pr-str results))
        (is (= 1 (count (:revision/history value))))
        (is (= 1 (count (fs/finalized-ledgers (:store/ledgers db)))))
        (is (fs/exists? (fs/join (:store/seeds db) "legacy.lock"))))
      (finally (fs/remove-tree! root))))
         (catch :default cause (is false (str cause)))
         (finally (done)))))))

(deftest ledger-partitions-order-and-duplicates-do-not-change-state
  (let [root (temporary-root)]
    (try
      (let [db (store/open! root)
            first-write (store/commit! db (command "doc" "0"))
            _ (reduce (fn [prior n]
                        (store/commit! db (command "doc" (str n) [(:commit/revision prior)])))
                      first-write (range 1 10))
            expected (store/read! db "doc")
            events (accepted-events db)
            revisions (:schema/revisions (runtime/refresh (:store/runtime db)))]
        (doseq [partition-count [1 10 100]]
          (fs/remove-tree! (:store/ledgers db))
          (fs/directory! (:store/ledgers db))
          (let [files (mapv #(fs/join (:store/ledgers db) (str "partition-" % ".edn"))
                            (range partition-count))]
            (doseq [file files] (ledger/create-ledger! file))
            (doseq [[index event] (map-indexed vector (reverse events))]
              (ledger/append-event! revisions (nth files (mod index partition-count)) event))
            (is (= expected (store/read! db "doc")) (str partition-count " partitions"))
            ;; Duplicate events in a second physical file still denote one history.
            (let [duplicate (fs/join (:store/ledgers db) "duplicates.edn")]
              (ledger/create-ledger! duplicate)
              (doseq [event events] (ledger/append-event! revisions duplicate event))
              (is (= expected (store/read! db "doc")))))))
      (finally (fs/remove-tree! root)))))

(deftest snapshots-are-disposable-and-stale-writes-have-no-authority
  (let [root (temporary-root)]
    (try
      (let [db (store/open! root)
            old (store/commit! db (command "doc" "old"))
            current (store/commit! db (command "doc" "current" [(:commit/revision old)]))
            old-meta (:snapshot/metadata-path old)]
        (testing "an older projector can only write its immutable address"
          (projection/write! old-meta (:document/metadata old))
          (fs/write-text! (:snapshot/markdown-path old) (:document/markdown old))
          (is (= (logical current) (store/read! db "doc"))))
        (testing "removing every snapshot loses no accepted state"
          (fs/remove-tree! (:store/snapshots db))
          (is (= (logical current) (store/read! db "doc")))
          (is (= (:document/metadata current)
                 (edn/read-one (fs/read-text (:snapshot/metadata-path current)))))
          (is (= "current" (fs/read-text (:snapshot/markdown-path current))))))
      (finally (fs/remove-tree! root)))))

(deftest invalid-commands-and-parents-have-no-published-effects
  (let [root (temporary-root)]
    (try
      (let [db (store/open! root)
            other (store/commit! db (command "other" "outside"))
            before (accepted-events db)]
        (doseq [bad [(assoc (command "doc" "body") :document/id "../escape")
                     (assoc (command "doc" "body") :document/markdown 42)
                     (assoc (command "doc" "body") :document/metadata {:f (fn [] nil)})
                     (command "doc" "body" ["aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"])
                     (command "doc" "body" [(:commit/revision other)])]]
          (is (some? (error-type #(store/commit! db bad))))
          (is (= before (accepted-events db))))
        (is (= :cross-document-parent
               (error-type #(store/read-revision! db "doc" (:commit/revision other)))))
        (is (= :unknown-parent
               (error-type #(store/read-revision! db "doc" "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"))))
        (is (nil? (store/read! db "absent")))
        (is (= ["other"] (mapv :document/id (store/list! db)))))
      (finally (fs/remove-tree! root)))))

(deftest pending-files-are-not-accepted-partitions
  (let [root (temporary-root)]
    (try
      (let [db (store/open! root)
            pending (fs/join (:store/ledgers db) ".pending-interrupted")]
        (ledger/create-ledger! pending)
        (fs/write-text! pending "{:partial")
        (is (= [] (store/list! db)))
        (fs/write-text! (fs/join (:store/ledgers db) "corrupted.edn") "{:partial")
        (is (= :clio.ledger/invalid-edn (error-type #(store/list! db)))))
      (finally (fs/remove-tree! root)))))

(deftest storage-root-must-be-under-eta-mu
  (is (= :invalid-root (error-type #(store/open! "/tmp/not-eta-mu"))))
  (is (= :invalid-root (error-type #(store/open! "/tmp/.ημ/../outside")))))


(deftest seed-and-normal-genesis-have-linearizable-empty-checks
  (async done
    ((^:async fn []
       (let [root (temporary-root)]
         (try
           (let [db (store/open! root)
                 first-results (mapv edn/read-one
                                     (await (process/writers!
                                             root [(command "seed-first" "imported")
                                                   (command "seed-first" "independent normal root")]
                                             ["seed-first" "commit-after-seed"])))
                 first-value (store/read! db "seed-first")]
             (is (true? (:seed/created? (first first-results))) (pr-str first-results))
             (is (true? (:test/observed-publication? (second first-results))))
             (is (= #{"imported" "independent normal root"}
                    (set (map :document/markdown (:revision/history first-value)))))
             (is (:revision/conflicted? first-value))
             (let [second-results (mapv edn/read-one
                                       (await (process/writers!
                                               root [(command "commit-first" "normal creation")
                                                     (command "commit-first" "legacy import")]
                                               ["commit-first" "seed-after-commit"])))
                   second-value (store/read! db "commit-first")]
               (is (:commit/revision (first second-results)) (pr-str second-results))
               (is (false? (:seed/created? (second second-results))))
               (is (true? (:test/observed-publication? (second second-results))))
               (is (= ["normal creation"] (mapv :document/markdown (:revision/history second-value))))))
           (catch :default cause (is false (str cause)))
           (finally (fs/remove-tree! root) (done))))))))

(deftest escaped-root-is-refused-before-directory-creation
  (let [base (str "/tmp/document-history-root-" (fs/unique-name))
        outside (fs/join base "outside")
        alias (fs/join base ".ημ")]
    (try
      (fs/directory! outside)
      (process/symbolic-link! outside alias)
      (is (= :invalid-root (error-type #(store/open! (fs/join alias "must-not-exist" "documents")))))
      (is (= [] (process/directory-names outside)))
      (is (not (fs/exists? (fs/join outside "must-not-exist"))))
      (finally (fs/remove-tree! base)))))

(deftest worker-failures-complete-both-markers-promptly
  (async done
    ((^:async fn []
       (let [root (temporary-root)]
         (try
           (store/open! root)
           (doseq [[mode options] [["fail-before-ready" {}]
                                  ["commit" {:binary "document-history-command-that-does-not-exist"}]
                                  ["commit" {:worker-script "test/document_history/absent-worker.nbb"}]]]
             (let [started (process/now-ms)
                   values (mapv edn/read-one
                                (await (process/writers! root [(command "doc" "test")] mode options)))]
               (is (:error (first values)) (pr-str values))
               (is (< (- (process/now-ms) started) 10000))))
           (catch :default cause (is false (str cause)))
           (finally (fs/remove-tree! root) (done))))))))
