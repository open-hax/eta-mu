(ns rheos.backend.infra.task-edit-test
  (:require ["node:fs/promises" :as fsp]
            ["node:os" :as os]
            ["node:path" :as path]
            [cljs.test :refer [deftest testing is]]
            [rheos.backend.domain.events :as events]
            [rheos.backend.infra.task-edit :as task-edit]
            [rheos.backend.shape.content-parser :as content-parser]
            [rheos.backend.infra.watcher :as watcher]))

(defn- tmp-dir []
  (path/join (.tmpdir os) (str "rheos-test-" (.now js/Date) "-" (rand-int 100000))))

(defn- write-task! [dir uuid title]
  (let [file-path (path/join dir (str uuid ".md"))
        raw (str "---\n"
                 "uuid: \"" uuid "\"\n"
                 "title: \"" title "\"\n"
                 "status: \"incoming\"\n"
                 "priority: \"P3\"\n"
                 "---\n\n# " title "\n\nBody")]
    (.writeFile fsp file-path raw "utf8")))

(deftest ^:async update-frontmatter-emits-events
  (testing "Updating frontmatter writes the file and records events"
    (let [dir (tmp-dir)
          _ (await (.mkdir fsp dir #js {:recursive true}))
          _ (await (write-task! dir "t1" "Task One"))
          project {:id "test" :title "Test" :tasks-dir dir :meta {}}
          task {:uuid "t1" :source-path (path/join dir "t1.md")}
          captured (atom [])
          unsub (events/subscribe! #(swap! captured conj %))]
      (try
        (let [result (await (task-edit/update-frontmatter!
                             {:project project :task task
                              :updates {"priority" "P0"}
                              :source "test"}))
              raw (await (.readFile fsp (:source-path task) "utf8"))]
          (is (:ok result))
          (is (= "P0" (get-in result [:frontmatter :priority])))
          (is (re-find #"priority: \"P0\"" raw))
          (is (pos? (count (filter #(= "frontmatter" (:type %)) @captured))))
          (is (some #(= "P0" (:new-value %)) @captured)))
        (finally
          (unsub)
          (await (.rm fsp dir #js {:recursive true :force true})))))))

(deftest ^:async update-frontmatter-injects-write-id
  (testing "Frontmatter update injects write-id and watcher can correlate"
    (let [dir (tmp-dir)
          _ (await (.mkdir fsp dir #js {:recursive true}))
          _ (await (write-task! dir "t1" "Task One"))
          project {:id "test" :title "Test" :tasks-dir dir :meta {}}
          task {:uuid "t1" :source-path (path/join dir "t1.md")}
          captured (atom [])
          unsub (events/subscribe! #(swap! captured conj %))]
      (try
        (let [result (await (task-edit/update-frontmatter!
                             {:project project :task task
                              :updates {"priority" "P0"}
                              :source "test"}))
              raw (await (.readFile fsp (:source-path task) "utf8"))
              frontmatter (:frontmatter (content-parser/parse-task-content raw))]
          (is (:ok result))
          (is (string? (:write-id frontmatter)))
          (is (pos? (count (:write-id frontmatter))))
          (let [write-id (:write-id frontmatter)]
            (await (watcher/handle-file-event! "test" dir (:source-path task) "change"))
            (is (some #(and (= "file-changed" (:type %))
                            (= write-id (:write-id %))
                            (= "correlated" (:correlation/status %)))
                      @captured))))
        (finally
          (unsub)
          (await (.rm fsp dir #js {:recursive true :force true})))))))

(deftest ^:async append-comment-emits-event
  (testing "Appending a comment writes the file and records a comment event"
    (let [dir (tmp-dir)
          _ (await (.mkdir fsp dir #js {:recursive true}))
          _ (await (write-task! dir "t2" "Task Two"))
          project {:id "test" :title "Test" :tasks-dir dir :meta {}}
          task {:uuid "t2" :source-path (path/join dir "t2.md")}
          captured (atom [])
          unsub (events/subscribe! #(swap! captured conj %))]
      (try
        (let [result (await (task-edit/append-comment!
                             {:project project :task task
                              :text "Looks good"
                              :source "test"}))
              raw (await (.readFile fsp (:source-path task) "utf8"))]
          (is (:ok result))
          (is (= "Looks good" (:text result)))
          (is (re-find #"Looks good" raw))
          (is (pos? (count (filter #(= "comment" (:type %)) @captured))))
          (is (some #(= "Looks good" (:text %)) @captured)))
        (finally
          (unsub)
          (await (.rm fsp dir #js {:recursive true :force true})))))))

(deftest ^:async append-comment-injects-write-id
  (testing "Comment append injects write-id into frontmatter"
    (let [dir (tmp-dir)
          _ (await (.mkdir fsp dir #js {:recursive true}))
          _ (await (write-task! dir "t3" "Task Three"))
          project {:id "test" :title "Test" :tasks-dir dir :meta {}}
          task {:uuid "t3" :source-path (path/join dir "t3.md")}
          captured (atom [])
          unsub (events/subscribe! #(swap! captured conj %))]
      (try
        (let [result (await (task-edit/append-comment!
                             {:project project :task task
                              :text "Looks good"
                              :source "test"}))
              raw (await (.readFile fsp (:source-path task) "utf8"))
              frontmatter (:frontmatter (content-parser/parse-task-content raw))]
          (is (:ok result))
          (is (string? (:write-id frontmatter)))
          (is (pos? (count (:write-id frontmatter)))))
        (finally
          (unsub)
          (await (.rm fsp dir #js {:recursive true :force true})))))))
