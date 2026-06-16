(ns rheos.backend.infra.store-test
  (:require [cljs.test :refer [deftest testing is]]
            ["node:fs/promises" :as fsp]
            ["node:path" :as path]
            [rheos.backend.infra.store :as store]))

(deftest ^:async edn-store-roundtrip
  (testing "EdnStore persists and retrieves keyed documents"
    (let [tmp-dir (path/join (js/process.cwd) "target" "test-store")
          file-path (path/join tmp-dir "views.edn")
          _ (await (.mkdir fsp tmp-dir #js {:recursive true}))
          s (await (store/load-edn-store file-path))]
      (is (empty? (await (store/-keys s))))
      (await (store/-put! s "infra" {:domain "infrastructure"}))
      (is (= ["infra"] (await (store/-keys s))))
      (is (= {:domain "infrastructure"} (await (store/-get s "infra"))))
      (await (.rm fsp tmp-dir #js {:recursive true :force true})))))
