(ns rheos.backend.infra.view-store-test
  (:require [cljs.test :refer [deftest testing is]]
            ["node:fs/promises" :as fsp]
            ["node:path" :as path]
            [rheos.backend.infra.view-store :as views]))

(deftest ^:async save-and-load-view
  (testing "Views persist and override via merge-preset"
    (let [tmp-dir (path/join (js/process.cwd) "target" "test-views")
          _ (await (.mkdir fsp tmp-dir #js {:recursive true}))
          store (await (views/load-view-store tmp-dir))]
      (try
        (await (views/save-view! store "infra" {:domain "infrastructure" :status "todo"}))
        (is (= {:domain "infrastructure" :status "todo"} (await (views/load-view store "infra"))))
        (is (= ["infra"] (await (views/list-views store))))
        (is (= {:domain "infrastructure" :status "done"}
               (views/merge-preset {:status "done"} (await (views/load-view store "infra")))))
        (finally
          (await (.rm fsp tmp-dir #js {:recursive true :force true})))))))
