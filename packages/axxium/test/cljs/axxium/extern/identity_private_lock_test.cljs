(ns axxium.extern.identity-private-lock-test
  "Native SDK refresh lock polling stays finite when wall time cannot advance."
  (:require [axxium.extern.identity-host :as host]
            [cljs.test :refer [deftest is]]
            ["fs-ext-extra-prebuilt" :as fs-ext]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]))

(deftest ^:async private-lock-polling-refuses-stalled-and-reversed-clocks
  (doseq [clock-change [0 -1000]]
    (let [directory (fs/mkdtempSync (path/join (os/tmpdir) "axxium-refresh-clock-"))
          key "did:plc:refresh-lock-fixture"
          locks (host/private-directory! (str directory "/locks"))
          file (str locks "/" (host/sha256 key))
          fd (fs/openSync file "wx" 384)
          release (atom #(fs/closeSync fd))
          unlock! (fn [] (when-let [run @release] (reset! release nil) (run)))
          clock (atom (host/now))
          delays (atom 0)
          calls (atom 0)
          timer (atom nil)]
      (try
        (fs-ext/flockSync fd "exnb")
        ;; Old code eventually acquires the lock and incorrectly succeeds; the
        ;; watchdog makes the behavioral RED finite instead of hanging the suite.
        (reset! timer (js/setTimeout unlock! 100))
        (with-redefs [host/private-lock-max-attempts 4
                      host/now (fn [] @clock)
                      host/delay! (fn ^:async move-clock [_]
                                    (swap! delays inc)
                                    (swap! clock + clock-change))]
          (let [failure (try
                          (await (host/with-private-lock!
                                  directory key (fn ^:async work [] (swap! calls inc))))
                          nil
                          (catch :default cause (ex-data cause)))]
            (is (= :provider-unavailable (:code failure)))
            (is (= 4 (:attempts failure)))
            (is (= 3 @delays))
            (is (zero? @calls))))
        (finally
          (when @timer (js/clearTimeout @timer))
          (unlock!)
          (fs/rmSync directory #js {:recursive true :force true}))))))
