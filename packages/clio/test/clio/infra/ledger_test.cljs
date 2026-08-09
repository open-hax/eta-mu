(ns clio.infra.ledger-test
  (:require [cljs.test :refer [deftest is testing]]
            [clio.extern.js.fs :as fs]
            [clio.extern.js.runtime :as host]
            [clio.infra.ledger :as ledger]
            [clio.infra.projection :as projection]
            [clio.infra.runtime :as runtime]
            [clio.law.schema :as schema-law]))

(def catalog
  {:counter/opened
   (schema-law/event-schema
    :counter/opened
    [:map {:closed true} [:amount :int]])
   :counter/added
   (schema-law/event-schema
    :counter/added
    [:map {:closed true} [:amount :int]])})

(defn apply-counter
  [state event]
  (case (:event/type event)
    :counter/opened (assoc state (:event/stream event)
                           (get-in event [:event/data :amount]))
    :counter/added (update state (:event/stream event) +
                           (get-in event [:event/data :amount]))
    state))

(defn error-code
  [f]
  (try
    (f)
    nil
    (catch :default cause
      (:clio/error (ex-data cause)))))

(deftest append-and-projection-are-idempotent
  (let [directory (str "/tmp/clio-" (host/random-uuid))
        schema-directory (str directory "/schemas")
        ledger-file (str directory "/events.edn")
        projection-file (str directory "/counter.edn")]
    (try
      (fs/ensure-dir! directory)
      (ledger/create-ledger! ledger-file)
      (let [rt (runtime/open schema-directory catalog)
            first-write
            (runtime/append!
             rt ledger-file :counter/opened
             {:event/stream "counter:a"
              :event/seq 1
              :event/actor "user:alice"
              :event/subject "counter:a"
              :event/data {:amount 10}})
            first-event (:event first-write)
            second-write
            (runtime/append!
             rt ledger-file :counter/added
             {:event/stream "counter:a"
              :event/seq 2
              :event/causes [(:event/id first-event)]
              :event/actor "user:alice"
              :event/subject "counter:a"
              :event/data {:amount 5}})
            refreshed (runtime/refresh rt)
            retry-result
            (ledger/append-event!
             (:schema/revisions refreshed)
             ledger-file
             (:event second-write))
            options
            {:revisions (:schema/revisions refreshed)
             :ledger-files [ledger-file]
             :output-file projection-file
             :initial {}
             :apply-event apply-counter}
            first-projection (projection/project-files! options)
            second-projection (projection/project-files! options)]
        (testing "schema revisions are persisted automatically"
          (is (= 1 (count (fs/list-files schema-directory)))))
        (testing "retrying an identical append does not duplicate history"
          (is (= :already-present retry-result))
          (is (= 2 (count (ledger/read-ledger ledger-file)))))
        (testing "projection extraction is a pure replay and atomic replacement"
          (is (= first-projection second-projection))
          (is (= {"counter:a" 15}
                 (:projection/state second-projection)))
          (is (fs/exists? projection-file))))
      (finally
        (fs/remove-tree! directory)))))

(deftest ledger-lines-accept-exactly-one-edn-form
  (let [directory (str "/tmp/clio-" (host/random-uuid))
        ledger-file (str directory "/events.edn")]
    (try
      (fs/ensure-dir! directory)
      (fs/write-text! ledger-file "{:a 1} {:b 2}\n")
      (is (= :clio.ledger/invalid-edn
             (error-code #(ledger/read-ledger ledger-file))))
      (finally
        (fs/remove-tree! directory)))))

(deftest append-repairs-a-missing-record-delimiter
  (let [directory (str "/tmp/clio-" (host/random-uuid))
        schema-directory (str directory "/schemas")
        ledger-file (str directory "/events.edn")]
    (try
      (fs/ensure-dir! directory)
      (ledger/create-ledger! ledger-file)
      (let [rt (runtime/open schema-directory catalog)
            first-write
            (runtime/append!
             rt ledger-file :counter/opened
             {:event/stream "counter:a"
              :event/seq 1
              :event/actor "user:alice"
              :event/subject "counter:a"
              :event/data {:amount 1}})
            first-event (:event first-write)
            without-newline
            (subs (fs/read-text ledger-file)
                  0
                  (dec (count (fs/read-text ledger-file))))]
        (fs/write-text! ledger-file without-newline)
        (runtime/append!
         rt ledger-file :counter/added
         {:event/stream "counter:a"
          :event/seq 2
          :event/causes [(:event/id first-event)]
          :event/actor "user:alice"
          :event/subject "counter:a"
          :event/data {:amount 2}})
        (is (= 2 (count (ledger/read-ledger ledger-file)))))
      (finally
        (fs/remove-tree! directory)))))

(deftest file-lock-is-exclusive
  (let [directory (str "/tmp/clio-" (host/random-uuid))
        ledger-file (str directory "/events.edn")]
    (try
      (fs/ensure-dir! directory)
      (let [lock (fs/acquire-lock! ledger-file)]
        (try
          (is (= :clio.extern.fs/lock-timeout
                 (error-code
                  #(fs/acquire-lock! ledger-file {:attempts 0 :delay-ms 0}))))
          (finally
            (fs/release-lock! lock))))
      (finally
        (fs/remove-tree! directory)))))

(def ^:private unreachable-pid
  "Beyond Linux's default pid_max; kill(pid, 0) against it always raises
   ESRCH, standing in for a writer that has actually crashed. Reclaim is now
   gated on liveness, not age, so a lock naming this process's own (live)
   pid — as a real fs/acquire-lock! call would write — could never be
   reclaimed no matter how stale-after-ms is tuned."
  2147483647)

(defn- plant-dead-lock!
  [ledger-file token]
  (fs/write-text! (str ledger-file ".lock")
                   (pr-str {:lock/pid unreachable-pid :lock/token token})))

(deftest orphaned-lock-is-reclaimed-once-stale
  (let [directory (str "/tmp/clio-" (host/random-uuid))
        ledger-file (str directory "/events.edn")]
    (try
      (fs/ensure-dir! directory)
      ;; Simulate a writer that crashed after creating the lock and never
      ;; reached its `finally` to release it.
      (plant-dead-lock! ledger-file "dead")
      (let [reclaimed
            (fs/acquire-lock! ledger-file {:attempts 20 :delay-ms 5 :stale-after-ms 5})]
        (is (some? reclaimed))
        (fs/release-lock! reclaimed))
      (finally
        (fs/remove-tree! directory)))))

(deftest reclaimed-owner-cannot-release-the-new-owners-lock
  (let [directory (str "/tmp/clio-" (host/random-uuid))
        ledger-file (str directory "/events.edn")]
    (try
      (fs/ensure-dir! directory)
      (plant-dead-lock! ledger-file "dead")
      (let [original {:lock/path (str ledger-file ".lock") :lock/token "dead"}
            reclaimed
            (fs/acquire-lock! ledger-file {:attempts 20 :delay-ms 5 :stale-after-ms 5})]
        (is (not (fs/lock-owned? original))
            "the original owner must observe that it no longer holds the lock")
        (is (fs/lock-owned? reclaimed))
        (fs/release-lock! original)
        (is (fs/exists? (:lock/path reclaimed))
            "releasing a reclaimed lock must not delete the new owner's lock")
        (fs/release-lock! reclaimed))
      (finally
        (fs/remove-tree! directory)))))

(deftest a-live-owners-lock-is-never-reclaimed-regardless-of-age
  (let [directory (str "/tmp/clio-" (host/random-uuid))
        ledger-file (str directory "/events.edn")]
    (try
      (fs/ensure-dir! directory)
      (let [lock (fs/acquire-lock! ledger-file)]
        (try
          ;; stale-after-ms 0 means every attempt sees the lock as "old
          ;; enough"; liveness must still refuse to reclaim it, since this
          ;; process (the real owner) is alive for the whole test.
          (is (= :clio.extern.fs/lock-timeout
                 (error-code
                  #(fs/acquire-lock! ledger-file
                                     {:attempts 3 :delay-ms 1 :stale-after-ms 0}))))
          (finally
            (fs/release-lock! lock))))
      (finally
        (fs/remove-tree! directory)))))
