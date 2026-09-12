(ns axxium.infra.identity-cleanup-test
  (:require [axxium.extern.identity-host :as host]
            [axxium.infra.identity :as identity]
            [axxium.infra.identity-ceremonies :as ceremonies]
            [axxium.infra.identity-store :as store]
            [cljs.reader :as edn]
            [cljs.test :refer [deftest is]]
            ["fs-ext-extra-prebuilt" :as fs-ext]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]))

(deftest ^:async cleanup-contention-cannot-mask-a-committed-signup-or-original-error
  (let [directory (fs/mkdtempSync (path/join (os/tmpdir) "axxium-cleanup-"))
        options {:provider :edn :directory directory :public-base-url "http://localhost"}
        service (identity/open! options)
        descriptor (atom nil)
        reports (atom [])
        acquire (fn []
                  (let [fd (fs/openSync (str directory "/identity-operation.lock") "r+")]
                    (reset! descriptor fd)
                    (fs-ext/flockSync fd "exnb")))
        release (fn [] (when-let [fd @descriptor] (fs/closeSync fd) (reset! descriptor nil)))]
    (try
      (is (= (:vault (:store service)) (edn/read-string (pr-str (:vault (:store service)))))
          "Private vault metadata is defined data, not a native Buffer")
      (with-redefs [host/report-deferred-cleanup! #(swap! reports conj (ex-data %))]
        (let [result (await (ceremonies/password-work!
                            (:store service) "first-client"
                            (fn ^:async work []
                              (let [result (await (identity/signup! service {:username "committed"
                                                                             :email "committed@example.test"
                                                                             :password "correct horse battery staple"}))]
                                (acquire)
                                result))))]
          (is (:ok result) "Cleanup contention must preserve the successful commit")
          (release)
          (is (= (:principal result) (identity/resolve-principal (identity/open! options) (:token result))))
          (is (= 1 (count (:canonical/events (store/history (:store service)))))))
        (let [original (ex-info "Original work error" {:code :deliberate-test-refusal})]
          (try
            (await (ceremonies/password-work! (:store service) "second-client"
                                              (fn [] (acquire) (throw original))))
            (is false "Work failure must still reject")
            (catch :default error (is (identical? original error)))
            (finally (release))))
        (is (= 2 (count @reports)))
        (is (every? #(= :clio.ledger/concurrent-stream-write (:clio/error %)) @reports))
        (is (= 2 (count (filter #(= :password/active (:purpose %))
                               (vals (ceremonies/entries (:store service))))))
            "Deferred cleanup retains bounded leases instead of admitting excess work")
        (with-redefs [host/now #(+ 300001 (apply max (map :issued-at (vals (ceremonies/entries (:store service))))))]
          (is (empty? (ceremonies/entries (:store (identity/open! options)))))))
      (finally (release) (fs/rmSync directory #js {:recursive true :force true})))))
