(ns rheos.backend.infra.task-writeback-test
  (:require ["node:fs/promises" :as fsp]
            ["node:os" :as os]
            ["node:path" :as path]
            [cljs.test :refer [deftest testing is]]
            [rheos.backend.infra.task-writeback :as writeback]
            [rheos.backend.shape.content-parser :as content-parser]))

(defn- tmp-dir []
  (path/join (.tmpdir os) (str "rheos-writeback-test-" (.now js/Date) "-" (rand-int 100000))))

(defn- write-task! [dir uuid title]
  (let [file-path (path/join dir (str uuid ".md"))
        raw (str "---\n"
                 "uuid: \"" uuid "\"\n"
                 "title: \"" title "\"\n"
                 "status: \"incoming\"\n"
                 "priority: \"P3\"\n"
                 "---\n\n# " title "\n\nBody\n\n---\nstatus: should be preserved\n---")]
    (.writeFile fsp file-path raw "utf8")))

(deftest ^:async write-task-status-updates-frontmatter-only
  (testing "Status writeback only touches YAML frontmatter, not body/comment status lines"
    (let [dir (tmp-dir)
          _ (await (.mkdir fsp dir #js {:recursive true}))
          _ (await (write-task! dir "t1" "Task One"))
          file-path (path/join dir "t1.md")
          task {:uuid "t1" :source-path file-path :status "incoming"}]
      (try
        (let [updated (await (writeback/write-task-status task dir "in_progress" "wid-123"))
              raw (await (.readFile fsp file-path "utf8"))
              parsed (content-parser/parse-task-content raw)
              comments (filter #(= "comment" (:type %)) (:sections parsed))]
          (is (= "in_progress" (:status updated)))
          (is (= "in_progress" (get-in parsed [:frontmatter :status])))
          (is (= "wid-123" (get-in parsed [:frontmatter :write-id])))
          (is (= 1 (count comments)))
          (is (re-find #"status: should be preserved" (:content (first comments)))))
        (finally
          (await (.rm fsp dir #js {:recursive true :force true})))))))
