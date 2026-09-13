(ns document-history.infra.store-test
  (:require [cljs.test :refer [deftest is testing]]
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
  (let [root (temporary-root)]
    (try
      (let [db (store/open! root)
            base (store/commit! db (command "doc" "base"))
            parents [(:commit/revision base)]
            results (mapv edn/read-one
                          (process/writers! root [(command "doc" "worker A" parents)
                                                  (command "doc" "worker B" parents)] "commit"))
            value (store/read! db "doc")
            children (filterv #(seq (:revision/parents %)) (:revision/history value))]
        (is (every? :commit/revision results) (pr-str results))
        (is (= 2 (count (:revision/heads value))))
        (is (:revision/conflicted? value))
        (is (= #{"worker A" "worker B"} (set (map :document/markdown children))))
        (is (= ["2026-09-13T12:00:00.000Z"] (vec (distinct (map :revision/at children)))))
        (is (= (set parents) (set (mapcat :revision/parents children)))))
      (finally (fs/remove-tree! root)))))

(deftest concurrent-seeds-import-exactly-once
  (let [root (temporary-root)]
    (try
      (let [db (store/open! root)
            results (mapv edn/read-one
                          (process/writers! root [(command "legacy" "migration")
                                                  (command "legacy" "migration")] "seed"))
            value (store/read! db "legacy")]
        (is (= #{true false} (set (map :seed/created? results))) (pr-str results))
        (is (= 1 (count (:revision/history value))))
        (is (= 1 (count (fs/finalized-ledgers (:store/ledgers db)))))
        (is (fs/exists? (fs/join (:store/seeds db) "legacy.lock"))))
      (finally (fs/remove-tree! root)))))

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
