(ns clio.infra.ledger
  (:require [clio.domain.canonicalize :as canonicalize]
            [clio.domain.schema :as schema]
            [clio.extern.js.fs :as fs]
            [clio.shape.edn :as edn]
            [clojure.string :as str]))

(defn- fail!
  [type message data]
  (throw (ex-info message (assoc data :clio/error type))))

(defn create-ledger!
  [path]
  (fs/create-exclusive! path))

(defn read-ledger
  [path]
  (if-not (fs/exists? path)
    []
    (->> (fs/read-text path)
         str/split-lines
         (map-indexed vector)
         (remove (fn [[_ line]] (str/blank? line)))
         (mapv
          (fn [[index line]]
            (try
              (edn/read-one line)
              (catch :default cause
                (fail! :clio.ledger/invalid-edn
                       "Ledger line must contain exactly one readable EDN form"
                       {:path path
                        :line (inc index)
                        :cause (str cause)}))))))))

(defn- append-record!
  [path existing-text event]
  (let [delimiter (if (or (str/blank? existing-text)
                          (str/ends-with? existing-text "\n"))
                    ""
                    "\n")]
    (fs/append-text! path (str delimiter (pr-str event) "\n"))))

(defn append-event!
  "Append one validated event under an inter-process per-ledger lock. Exact
   retries are idempotent. Causal parents may live in other physical ledger
   files; complete-history causality is checked when ledgers are unioned."
  [revisions path event]
  (let [lock (fs/acquire-lock! path)]
    (try
      (schema/validate-event! revisions event)
      (let [existing-text (if (fs/exists? path) (fs/read-text path) "")
            events (read-ledger path)]
        (doseq [existing events]
          (schema/validate-event! revisions existing))
        (let [old-by-id (some #(when (= (:event/id %) (:event/id event)) %) events)
              old-slot (some #(when (and (= (:event/stream %) (:event/stream event))
                                         (= (:event/seq %) (:event/seq event)))
                                %)
                             events)]
          (cond
            (= old-by-id event)
            :already-present

            old-by-id
            (fail! :clio.ledger/id-collision
                   "Ledger already contains different data for this event id"
                   {:old old-by-id :new event})

            old-slot
            (fail! :clio.ledger/concurrent-stream-write
                   "Ledger already contains a different event at this stream revision"
                   {:old old-slot :new event})

            :else
            (do
              (append-record! path existing-text event)
              :appended))))
      (finally
        (fs/release-lock! lock)))))

(defn read-ledgers
  [paths]
  (mapv read-ledger paths))

(defn canonicalize-files
  [revisions paths]
  (canonicalize/canonicalize revisions (read-ledgers paths)))
