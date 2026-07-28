(ns rheos.backend.infra.task-store-test
  (:require ["node:fs/promises" :as fsp]
            ["node:os" :as os]
            ["node:path" :as path]
            [cljs.test :refer [deftest is]]
            [rheos.backend.infra.task-store :as task-store]))

(def card-markdown
  (str "---\n"
       "uuid: \"real-card\"\n"
       "title: \"Real Card\"\n"
       "status: incoming\n"
       "priority: P1\n"
       "---\n\n"
       "# Real Card\n"))

(deftest ^:async configured-projection-paths-ignore-neighboring-prose
  (let [root (await (.mkdtemp fsp (path/join (os/tmpdir) "rheos-projection-")))
        cards-dir (path/join root "tasks")
        prose-dir (path/join root "docs")]
    (try
      (await (.mkdir fsp cards-dir #js {:recursive true}))
      (await (.mkdir fsp prose-dir #js {:recursive true}))
      (await (.writeFile fsp (path/join root "README.md") "# Board Guide\n" "utf8"))
      (await (.writeFile fsp (path/join prose-dir "design.md") "# Design\n" "utf8"))
      (await (.writeFile fsp (path/join cards-dir "real-card.md") card-markdown "utf8"))
      (let [tasks (await (task-store/load-tasks
                          {:tasks-dir root
                           :card-projection {:paths [cards-dir]}}))]
        (is (= 1 (count tasks)))
        (is (= "real-card" (:uuid (first tasks))))
        (is (= (path/join cards-dir "real-card.md")
               (:source-path (first tasks)))))
      (finally
        (await (.rm fsp root #js {:recursive true :force true}))))))

(deftest ^:async projection-path-may-name-one-card-file
  (let [root (await (.mkdtemp fsp (path/join (os/tmpdir) "rheos-projection-file-")))
        card-path (path/join root "one-card.md")]
    (try
      (await (.writeFile fsp card-path card-markdown "utf8"))
      (let [tasks (await (task-store/load-tasks
                          {:tasks-dir root
                           :card-projection {:paths [card-path]}}))]
        (is (= ["real-card"] (mapv :uuid tasks))))
      (finally
        (await (.rm fsp root #js {:recursive true :force true}))))))
