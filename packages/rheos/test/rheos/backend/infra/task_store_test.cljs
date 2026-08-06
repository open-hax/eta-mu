(ns rheos.backend.infra.task-store-test
  (:require ["node:fs/promises" :as fsp]
            ["node:os" :as os]
            ["node:path" :as path]
            [cljs.test :refer [deftest testing is]]
            [rheos.backend.infra.task-store :as tasks]))

(defn- tmp-dir []
  (path/join (.tmpdir os) (str "rheos-store-test-" (.now js/Date) "-" (rand-int 100000))))

(defn- write-card! [dir uuid title]
  (.writeFile fsp (path/join dir (str uuid ".md"))
              (str "---\nuuid: \"" uuid "\"\ntitle: \"" title "\"\n"
                   "status: \"incoming\"\npriority: \"P3\"\n---\n\n# " title "\n\nBody")
              "utf8"))

(deftest ^:async load-tasks-refuses-anything-that-is-not-a-directory-path
  ;; A CLI verb passed the project map here. `readdir` threw, the collector
  ;; caught it and returned `[]`, and `rheos move` reported `unknown task` for
  ;; cards that were on disk. The failure has to surface at the seam.
  (testing "a project map is refused rather than read as an empty board"
    (let [e (try (await (tasks/load-tasks {:tasks-dir "/board" :id "kanban"}))
                 nil (catch :default err err))]
      (is (some? e) "passing a project map must throw, not return []")
      (is (= :usage (:kind (ex-data e))))))
  (testing "nil and blank are refused too"
    (doseq [bad [nil "" 42]]
      (is (= :usage
             (:kind (ex-data (try (await (tasks/load-tasks bad))
                                  nil (catch :default err err)))))
          (str "expected a usage refusal for " (pr-str bad))))))

(deftest ^:async load-tasks-reads-cards-from-a-directory-path
  (testing "the happy path still returns the cards on disk"
    (let [dir (tmp-dir)
          _ (await (.mkdir fsp dir #js {:recursive true}))
          _ (await (write-card! dir "alpha" "Alpha"))
          _ (await (write-card! dir "beta" "Beta"))]
      (try
        (let [loaded (await (tasks/load-tasks dir))]
          (is (= #{"alpha" "beta"} (set (map :uuid loaded)))))
        (finally
          (await (.rm fsp dir #js {:recursive true :force true})))))))
