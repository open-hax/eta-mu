(ns clio.infra.kernel-lock-test
  (:require [cljs.test :refer [deftest is testing]]
            [clio.extern.js.fs :as fs]
            [clio.extern.js.process :as process]
            [clio.extern.js.runtime :as host]))

(defn- wait-for-path!
  [path timeout-ms]
  (let [deadline (+ (process/now-ms) timeout-ms)]
    (loop []
      (cond
        (fs/exists? path) true
        (< (process/now-ms) deadline)
        (do
          (process/sleep-until! (+ (process/now-ms) 20))
          (recur))
        :else
        (throw (ex-info "Timed out waiting for lock-holder readiness"
                        {:path path :timeout-ms timeout-ms}))))))

(deftest ^:async kernel-lock-excludes-hard-link-contenders
  (let [directory (str "/tmp/clio-lock-" (host/random-uuid))
        ledger-file (str directory "/events.edn")
        ledger-alias (str directory "/events-hardlink.edn")
        ready-file (str directory "/holder-ready")
        holder-script (str (process/cwd) "/test/clio/infra/lock_holder.nbb")
        hold-ms 1500]
    (try
      (fs/ensure-dir! directory)
      (fs/create-exclusive! ledger-file)
      (fs/hard-link! ledger-file ledger-alias)
      (let [holder
            (process/run-command!
             {:command "pnpm"
              :cwd (process/cwd)
              :args ["dlx" "nbb@1.3.201"
                     holder-script ledger-file ready-file (pr-str hold-ms)]})]
        (wait-for-path! ready-file 10000)
        (let [started (process/now-ms)
              contender (fs/acquire-lock! ledger-alias)
              blocked-ms (- (process/now-ms) started)]
          (try
            (testing "a hard-link alias resolves to the same kernel lock"
              (is (>= blocked-ms 1000)))
            (finally
              (fs/release-lock! contender))))
        (let [holder-result (await holder)]
          (testing "the lock holder exits cleanly"
            (is (zero? (.-exit-code holder-result))))))
      (finally
        (fs/remove-tree! directory)))))
