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

(defn- write-task!
  ([dir uuid title] (write-task! dir uuid title nil))
  ([dir uuid title dependency-line]
  (let [file-path (path/join dir (str uuid ".md"))
        raw (str "---\n"
                 "uuid: \"" uuid "\"\n"
                 "title: \"" title "\"\n"
                 "status: \"incoming\"\n"
                 "priority: \"P3\"\n"
                 (when dependency-line (str "dependency: " dependency-line "\n"))
                 "---\n\n# " title "\n\nBody")]
    (.writeFile fsp file-path raw "utf8"))))

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

(deftest ^:async update-frontmatter-with-no-updates-writes-nothing
  (testing "An empty update leaves the file byte-identical and emits no event"
    (let [dir (tmp-dir)
          _ (await (.mkdir fsp dir #js {:recursive true}))
          _ (await (write-task! dir "t1" "Task One"))
          project {:id "test" :title "Test" :tasks-dir dir :meta {}}
          task {:uuid "t1" :source-path (path/join dir "t1.md")
                :frontmatter {:uuid "t1" :priority "P3"}}
          before (await (.readFile fsp (:source-path task) "utf8"))
          captured (atom [])
          unsub (events/subscribe! #(swap! captured conj %))]
      (try
        (let [result (await (task-edit/update-frontmatter!
                             {:project project :task task :updates {} :source "test"}))
              after (await (.readFile fsp (:source-path task) "utf8"))]
          (is (:ok result))
          (is (:noop result) "an empty update reports itself as a no-op")
          (is (= before after) "the file is not rewritten with a fresh write-id")
          (is (empty? @captured) "and nothing is recorded that did not happen"))
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

(deftest ^:async append-comment-keeps-empty-dependency-empty
  (testing "the full-file comment rewrite cannot invent an empty-string dependency"
    (let [dir (tmp-dir)
          _ (await (.mkdir fsp dir #js {:recursive true}))
          _ (await (write-task! dir "t4" "Task Four" "[]"))
          project {:id "test" :title "Test" :tasks-dir dir :meta {}}
          task {:uuid "t4" :source-path (path/join dir "t4.md")}]
      (try
        (await (task-edit/append-comment!
                {:project project :task task :text "Still independent" :source "test"}))
        (let [raw (await (.readFile fsp (:source-path task) "utf8"))
              fm (:frontmatter (content-parser/parse-task-content raw))]
          (is (= [] (:dependency fm)))
          (is (re-find #"dependency: \[\]" raw))
          (is (not (re-find #"dependency: \[\"\"\]" raw))))
        (finally (await (.rm fsp dir #js {:recursive true :force true})))))))

(deftest ^:async update-frontmatter-validates-dependency-shape-before-writing
  (testing "structured dependency vectors set and clear; scalar input changes no bytes"
    (let [dir (tmp-dir)
          _ (await (.mkdir fsp dir #js {:recursive true}))
          _ (await (write-task! dir "t5" "Task Five" "[]"))
          project {:id "test" :title "Test" :tasks-dir dir :meta {}}
          task {:uuid "t5" :source-path (path/join dir "t5.md")}
          before (await (.readFile fsp (:source-path task) "utf8"))]
      (try
        (let [err (try
                    (await (task-edit/update-frontmatter!
                            {:project project :task task
                             :updates {"dependency" "dep-a"} :source "test"}))
                    nil (catch :default e e))
              after-refusal (await (.readFile fsp (:source-path task) "utf8"))]
          (is (= :usage (:kind (ex-data err))))
          (is (= before after-refusal)))
        (let [set-result (await (task-edit/update-frontmatter!
                                 {:project project :task task
                                  :updates {"dependency" ["dep-a" "dep-b"]}
                                  :source "test"}))]
          (is (= ["dep-a" "dep-b"] (get-in set-result [:frontmatter :dependency]))))
        (let [clear-result (await (task-edit/update-frontmatter!
                                   {:project project :task task
                                    :updates {"dependency" []} :source "test"}))]
          (is (= [] (get-in clear-result [:frontmatter :dependency]))))
        (finally (await (.rm fsp dir #js {:recursive true :force true})))))))
