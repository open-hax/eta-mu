;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.review-intent-worker-barrier
  "Test-only wrapper that coordinates real Clio appends across two processes."
  (:require [clio.infra.runtime :as runtime]
            [clio.extern.js.fs :as clio-fs]
            [eta-mu.infra.review-intent-worker :as worker]
            [nbb.core :as nbb]
            ["node:fs" :as fs]
            ["node:path" :as path]
            ["node:perf_hooks" :refer [performance]]))

(defn- wait-at-test-barrier! [event-data]
  (when-let [raw-directory (aget (.-env js/process) "INTENT_TEST_BARRIER")]
    (let [worker-id (aget (.-env js/process) "INTENT_TEST_WORKER_ID")
          directory (.realpathSync fs raw-directory)
          ready (.resolve path directory (str "ready-" worker-id))
          release (.resolve path directory "release")
          deadline (+ (.now performance) 4000)
          wait-array (js/Int32Array. (js/SharedArrayBuffer. 4))]
      (when-not (and (.startsWith directory "/tmp/eta-mu-review-intent-")
                     (contains? #{"a" "b"} worker-id))
        (throw (ex-info "Invalid test-only barrier" {:test/error :barrier-path})))
      (.writeFileSync fs ready
                      (pr-str {:event-seq (:event/seq event-data)
                               :causes (:event/causes event-data)
                               :intent-version (get-in event-data [:event/data :intent-version])})
                      #js {:flag "wx"})
      (loop []
        (cond
          (.existsSync fs release) true
          (> (.now performance) deadline)
          (throw (ex-info "Test-only barrier timed out" {:test/error :barrier-timeout}))
          :else (do (js/Atomics.wait wait-array 0 0 10) (recur)))))))

(defn- append-with-directory-sync-fault! [append! runtime ledger-file schema-id event-data]
  (if-let [target-directory (aget (.-env js/process) "INTENT_TEST_FAIL_DIRECTORY_SYNC")]
    (let [append-locked-text! clio-fs/append-locked-text!]
      (with-redefs [clio.extern.js.fs/append-locked-text!
                    (fn [lock text]
                      (if (= target-directory (.dirname path (:lock/target-path lock)))
                        (do
                          (clio-fs/require-directory-sync-support! target-directory)
                          (.appendFileSync fs (:lock/fd lock) text "utf8")
                          (.fsyncSync fs (:lock/fd lock))
                          (throw (ex-info "test-only injected failure before parent-directory fence"
                                          {:clio/error :clio.fs/directory-sync-unavailable})))
                        (append-locked-text! lock text)))]
        (append! runtime ledger-file schema-id event-data)))
    (append! runtime ledger-file schema-id event-data)))

(let [append! runtime/append!]
  (with-redefs [runtime/append!
                (fn [runtime ledger-file schema-id event-data]
                  (wait-at-test-barrier! event-data)
                  (append-with-directory-sync-fault! append! runtime ledger-file
                                                      schema-id event-data))]
    (nbb/await (worker/entry))))
