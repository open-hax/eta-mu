;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.infra.review-intent-worker
  "Fixed child entrypoint. It accepts one bounded EDN request and exposes only
  publisher transition/recovery operations over the exact Clio dependency."
  (:require [clio.infra.runtime :as clio-runtime]
            [clio.law.schema :as clio-schema-law]
            [clio.shape.edn :as clio-edn]
            [eta-mu.domain.review-intent :as intent]
            [eta-mu.domain.review-publication :as publication]
            [eta-mu.extern.review-intent :as host]
            [eta-mu.law.review-intent :as law]
            [eta-mu.shape.review-intent :as shape]
            [nbb.core :as nbb]
            ["node:fs" :as fs]
            ["node:path" :as path]
            ["node:perf_hooks" :refer [performance]]))

(def ^:private request-max-bytes 65536)
(def ^:private cas-attempts 4)
(def ^:private schema-id shape/event-type)
(def ^:private catalog
  {schema-id (clio-schema-law/event-schema schema-id shape/event-data-schema)})

(defn- fail [reason] {:status :refused :reason reason})

(defn- file-identity [filename]
  (when (and (string? filename) (.isAbsolute path filename))
    (let [stat (.statSync fs filename)]
      (when (.isFile stat) [(.-dev stat) (.-ino stat)]))))

(defn- store-valid? [{:keys [ledger-file partition-device partition-inode expected-lock-key]} lock-key]
  (try
    (and (= lock-key expected-lock-key)
         (= [partition-device partition-inode] (file-identity ledger-file)))
    (catch :default _ false)))

(defn- target-events [runtime store lock-key]
  (let [canonical (clio-runtime/canonicalize-files runtime [(:ledger-file store)])
        stream (shape/lock-stream lock-key)]
    (filterv #(= stream (:event/stream %)) (:canonical/events canonical))))

(defn- test-barrier! [request proposal]
  (when-let [{:keys [directory worker-id]} (:test/barrier request)]
    (when-not (and (string? directory) (.startsWith directory "/tmp/")
                   (contains? #{"a" "b"} worker-id))
      (throw (ex-info "Invalid test barrier" {:intent/error :test-barrier})))
    (let [ready (.resolve path directory (str "ready-" worker-id))
          release (.resolve path directory "release")
          deadline (+ (.now performance) 4000)
          wait-array (js/Int32Array. (js/SharedArrayBuffer. 4))]
      (.writeFileSync fs ready
                      (pr-str (select-keys proposal [:event-seq :causes :intent-version]))
                      #js {:flag "wx"})
      (loop []
        (cond
          (.existsSync fs release) true
          (> (.now performance) deadline)
          (throw (ex-info "Test barrier timed out" {:intent/error :test-barrier-timeout}))
          :else (do (js/Atomics.wait wait-array 0 0 10) (recur)))))))

(defn- append-transition [request]
  (let [{:keys [store binding command context]} request
        context (assoc context :now-ms (host/clock-ms))
        admission (publication/admit context)
        lock-key (get-in admission [:binding :lock-key])]
    (if-not (and (= :admitted (:status admission))
                 (= binding (:binding admission))
                 (law/binding? binding) (store-valid? store lock-key))
      (fail :installation-binding)
      (let [runtime (clio-runtime/open (:schema-directory store) catalog)
            stream (shape/lock-stream lock-key)]
        (loop [attempt 0]
          (if (>= attempt cas-attempts)
            {:status :refused :reason :cas-exhausted}
            (let [events (target-events runtime store lock-key)
                  projection (intent/replay lock-key events)
                  proposal (intent/transition {:status :admitted :binding binding}
                                              projection command)]
              (if-not (= :append (:status proposal))
                proposal
                (let [event-data {:event/stream stream
                                  :event/seq (:event-seq proposal)
                                  :event/causes (:causes proposal)
                                  :event/actor "eta-mu-review-intent-adapter"
                                  :event/subject stream
                                  :event/data (:event-data proposal)}
                      append-result (do
                                      (test-barrier! request proposal)
                                      (try
                                        {:result (clio-runtime/append! runtime (:ledger-file store)
                                                                       schema-id event-data)}
                                        (catch :default error
                                          {:error error})))]
                    (if-let [error (:error append-result)]
                      (if (= :clio.ledger/concurrent-stream-write
                             (:clio/error (ex-data error)))
                        (recur (inc attempt))
                        {:status :unknown :reason :append-outcome
                         :recovery (:clio/append-recovery (ex-data error))
                         :error (or (:clio/error (ex-data error)) :append-error)
                         :message (ex-message error)})
                      (let [result (:result append-result)]
                        {:status (if (= :appended (:append/result result)) :appended :replayed)
                         :append-result (:append/result result) :state (:state proposal)
                         :event-seq (:event-seq proposal)
                         :intent-version (:intent-version proposal)
                         :event-id (get-in result [:event :event/id])
                         :claim-id (get-in result [:event :event/data :claim-id])
                         :recovery {:ledger/path (:ledger-file store)
                                    :event (:event result)}})))))))))))

(defn- recover [request]
  (let [{:keys [store recovery]} request]
    (if-not (and (map? recovery)
                 (= (:ledger-file store) (:ledger/path recovery))
                 (store-valid? store (get-in recovery [:event :event/data :lock-key]))
                 (= schema-id (get-in recovery [:event :event/type]))
                 (law/intent-event? (:event recovery)))
      (fail :recovery-binding)
      (try
        (let [runtime (clio-runtime/open (:schema-directory store) catalog)
              result (clio-runtime/retry-append! runtime recovery)]
          {:status (if (= :appended (:append/result result)) :recovered :replayed)
           :append-result (:append/result result)
           :event-id (get-in result [:event :event/id])
           :capability-issued? false})
        (catch :default error
          {:status :unknown :reason :recovery-outcome
           :recovery (:clio/append-recovery (ex-data error))
           :error (or (:clio/error (ex-data error)) :recovery-error)})))))

(defn- run-request [request]
  (case (:operation request)
    :transition (append-transition request)
    :recover (recover request)
    (fail :operation)))

(defn entry []
  (try
    (let [input (.readFileSync fs 0 "utf8")
          byte-count (.byteLength js/Buffer input "utf8")
          response (if (> byte-count request-max-bytes)
                     (fail :input-bound)
                     (try (run-request (clio-edn/read-one input))
                          (catch :default error
                            {:status :refused :reason :request-invalid
                             :error (or (:intent/error (ex-data error))
                                        (:clio/error (ex-data error)))})))
          output (pr-str response)]
      (when (> (.byteLength js/Buffer output "utf8") 1048576)
        (throw (ex-info "Response exceeds fixed bound" {:intent/error :output-bound})))
      (.writeSync fs 1 output)
      response)
    (catch :default error
      (.writeSync fs 2 (str "review-intent worker refused: "
                            (or (:intent/error (ex-data error)) :worker-failure) "\n"))
      (.exit js/process 2))))

(nbb/await (entry))
