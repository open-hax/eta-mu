(ns clio.infra.ledger
  (:require [cljs.reader :as reader]
            [clio.domain.canonicalize :as canonicalize]
            [clio.domain.schema :as schema]
            [clio.external.js.fs :as fs]
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
              (reader/read-string line)
              (catch :default cause
                (fail! :clio.ledger/invalid-edn
                       "Ledger contains unreadable EDN"
                       {:path path
                        :line (inc index)
                        :cause (str cause)}))))))))

(defn append-event!
  "Append one validated event. Exact retries are idempotent. This local write
   gate validates every existing local record but intentionally does not require
   causal parents to share the same physical file; global completeness/conflicts
   are checked when ledgers are unioned."
  [revisions path event]
  (schema/validate-event! revisions event)
  (let [events (read-ledger path)]
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
          (fs/append-text! path (str (pr-str event) "\n"))
          :appended)))))

(defn read-ledgers
  [paths]
  (mapv read-ledger paths))

(defn canonicalize-files
  [revisions paths]
  (canonicalize/canonicalize revisions (read-ledgers paths)))
