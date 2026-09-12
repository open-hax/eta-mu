(ns axxium.server-health-test
  (:require [axxium.extern.identity-http :as http]
            [axxium.infra.identity :as identity]
            [axxium.server :as server]
            [cljs.test :refer [deftest is]]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]))

(deftest ^:async actual-standalone-health-detects-missing-or-corrupt-live-ledgers
  (let [directory (fs/mkdtempSync (path/join (os/tmpdir) "axxium-live-health-"))
        service (identity/open! {:provider :edn :directory directory :public-base-url "http://localhost"})
        app (await (server/create-app! service))
        file (str directory "/identity.edn")
        original (fs/readFileSync file "utf8")]
    (try
      (let [address (await (http/listen! app "127.0.0.1" 0))
            check (fn ^:async check-health []
                    (let [response (await (js/fetch (str address "/health")))]
                      {:status (.-status response)
                       :body (js->clj (await (.json response)) :keywordize-keys true)}))]
        (is (= 200 (:status (await (check)))))
        (doseq [failure [:missing :corrupt]]
          (if (= failure :missing) (fs/unlinkSync file)
              (fs/writeFileSync file "{:broken ["))
          (let [{:keys [status body]} (await (check))]
            (is (= 503 status) (name failure))
            (is (= {:ok false :service "axxium" :provider "edn"} body))))
        (fs/writeFileSync file original)
        (is (= 200 (:status (await (check))))))
      (finally
        (await (http/close! app))
        (fs/rmSync directory #js {:recursive true :force true})))))
