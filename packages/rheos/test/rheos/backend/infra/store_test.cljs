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
      (try
        (is (empty? (await (store/-keys s))))
        (await (store/-put! s "infra" {:domain "infrastructure"}))
        (is (= ["infra"] (await (store/-keys s))))
        (is (= {:domain "infrastructure"} (await (store/-get s "infra"))))
        (let [reloaded (await (store/load-edn-store file-path))]
          (is (= ["infra"] (await (store/-keys reloaded))))
          (is (= {:domain "infrastructure"} (await (store/-get reloaded "infra")))))
        (finally
          (await (.rm fsp tmp-dir #js {:recursive true :force true})))))))

(deftest ^:async edn-store-serializes-concurrent-puts
  (testing "Concurrent -put! calls serialize instead of interleaving"
    (let [tmp-dir (path/join (js/process.cwd) "target" "test-store-concurrent")
          file-path (path/join tmp-dir "views.edn")
          _ (await (.mkdir fsp tmp-dir #js {:recursive true}))
          s (await (store/load-edn-store file-path))]
      (try
        (await (js/Promise.all
                #js [(store/-put! s "a" {:n 1})
                     (store/-put! s "b" {:n 2})
                     (store/-put! s "c" {:n 3})]))
        (let [reloaded (await (store/load-edn-store file-path))]
          (is (= {:n 1} (await (store/-get reloaded "a"))))
          (is (= {:n 2} (await (store/-get reloaded "b"))))
          (is (= {:n 3} (await (store/-get reloaded "c")))))
        (finally
          (await (.rm fsp tmp-dir #js {:recursive true :force true})))))))
