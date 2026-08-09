(ns clio.infra.kernel-lock-test
  (:require [cljs.test :refer [async deftest is testing]]
            [clio.extern.js.fs :as fs]
            [clio.extern.js.process :as process]
            [clio.extern.js.runtime :as host]))

(deftest kernel-lock-excludes-hard-link-contenders
  (async done
    (let [directory (str "/tmp/clio-lock-" (host/random-uuid))
          ledger-file (str directory "/events.edn")
          ledger-alias (str directory "/events-hardlink.edn")
          ready-file (str directory "/holder-ready")
          holder-script (str (process/cwd) "/test/clio/infra/lock_holder.nbb")
          hold-ms 1500
          finish (fn []
                   (fs/remove-tree! directory)
                   (done))]
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
          (-> (fs/wait-for-exists! ready-file 10000)
              (.then
               (fn [_]
                 (let [started (process/now-ms)
                       contender (fs/acquire-lock! ledger-alias)
                       blocked-ms (- (process/now-ms) started)]
                   (try
                     (testing "a hard-link alias resolves to the same kernel lock"
                       (is (>= blocked-ms 1000)))
                     (finally
                       (fs/release-lock! contender)))
                   holder)))
              (.then
               (fn [holder-result]
                 (testing "the lock holder exits cleanly"
                   (is (zero? (:exit-code holder-result))))
                 (finish)))
              (.catch
               (fn [cause]
                 (is false (str "kernel lock probe failed: " cause))
                 (finish)))))
        (catch :default cause
          (is false (str "kernel lock setup failed: " cause))
          (finish))))))
