(ns rheos.backend.infra.task-store-test
  (:require ["node:fs/promises" :as fsp]
            ["node:os" :as os]
            ["node:path" :as path]
            [cljs.test :refer [deftest testing is]]
            [rheos.backend.infra.task-store :as task-store]))

(def card-markdown
  (str "---\n"
       "uuid: \"real-card\"\n"
       "title: \"Real Card\"\n"
       "status: incoming\n"
       "priority: P1\n"
       "---\n\n"
       "# Real Card\n"))

(defn- write-card! [dir uuid title]
  (.writeFile fsp (path/join dir (str uuid ".md"))
              (str "---\nuuid: \"" uuid "\"\ntitle: \"" title "\"\n"
                   "status: \"incoming\"\npriority: \"P3\"\n---\n\n# " title "\n\nBody")
              "utf8"))

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

(deftest ^:async explicit-empty-projection-scans-nothing
  (let [root (await (.mkdtemp fsp (path/join (os/tmpdir) "rheos-empty-projection-")))
        card-path (path/join root "would-be-legacy-card.md")]
    (try
      (await (.writeFile fsp card-path card-markdown "utf8"))
      (let [tasks (await (task-store/load-tasks
                          {:tasks-dir root
                           :card-projection {:paths []}}))]
        (is (empty? tasks)))
      (finally
        (await (.rm fsp root #js {:recursive true :force true}))))))

(deftest ^:async load-tasks-refuses-a-source-it-cannot-resolve
  ;; A CLI verb once passed the project map here. `readdir` threw, the collector
  ;; caught it and returned `[]`, and `rheos move` reported `unknown task` for
  ;; cards that were on disk. A project map is now a legitimate argument — but
  ;; the seam still has to fail loudly for anything it cannot resolve, because
  ;; the hazard was never the map, it was the silent `[]`.
  (testing "nil, blank, and non-path scalars are refused"
    (doseq [bad [nil "" 42]]
      (is (= :usage
             (:kind (ex-data (try (await (task-store/load-tasks bad))
                                  nil (catch :default err err)))))
          (str "expected a usage refusal for " (pr-str bad)))))
  (testing "a map that resolves no tasks-dir is refused rather than read as an empty board"
    (let [e (try (await (task-store/load-tasks {:id "kanban"}))
                 nil (catch :default err err))]
      (is (some? e) "a project map without a tasks-dir must throw, not return []")
      (is (= :usage (:kind (ex-data e)))))))

(deftest ^:async load-tasks-accepts-a-project-map-and-a-directory-path
  (testing "both argument forms return the cards on disk"
    (let [dir (await (.mkdtemp fsp (path/join (os/tmpdir) "rheos-store-test-")))]
      (try
        (await (write-card! dir "alpha" "Alpha"))
        (await (write-card! dir "beta" "Beta"))
        (is (= #{"alpha" "beta"} (set (map :uuid (await (task-store/load-tasks dir)))))
            "a bare tasks-dir string")
        (is (= #{"alpha" "beta"} (set (map :uuid (await (task-store/load-tasks {:tasks-dir dir})))))
            "a project map carrying the same tasks-dir")
        (finally
          (await (.rm fsp dir #js {:recursive true :force true})))))))
