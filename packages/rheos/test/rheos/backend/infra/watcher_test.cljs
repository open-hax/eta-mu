(ns rheos.backend.infra.watcher-test
  (:require ["node:fs/promises" :as fsp]
            ["node:os" :as os]
            ["node:path" :as path]
            [cljs.test :refer [deftest testing is]]
            [rheos.backend.infra.watcher :as watcher]
            [rheos.backend.domain.events :as events]
            [rheos.backend.shape.content-parser :as content-parser]))

(defn- tmp-dir []
  (path/join (.tmpdir os) (str "rheos-watcher-test-" (.now js/Date) "-" (rand-int 100000))))

(defn- write-task! [dir uuid title]
  (let [file-path (path/join dir (str uuid ".md"))
        raw (str "---\n"
                 "uuid: \"" uuid "\"\n"
                 "title: \"" title "\"\n"
                 "status: \"incoming\"\n"
                 "priority: \"P3\"\n"
                 "---\n\n# " title "\n\nBody")]
    (.writeFile fsp file-path raw "utf8")))

(deftest ^:async handle-file-event-correlates-known-write
  (testing "File event with a registered write-id is marked correlated"
    (let [dir (tmp-dir)
          _ (await (.mkdir fsp dir #js {:recursive true}))
          _ (await (write-task! dir "t1" "Task One"))
          captured (atom [])
          unsub (events/subscribe! #(swap! captured conj %))]
      (try
        (let [write-id "known-write-123"
              file-path (path/join dir "t1.md")
              raw (await (.readFile fsp file-path "utf8"))
              with-write-id (content-parser/inject-write-id raw write-id)]
          (watcher/expect-write! write-id "t1")
          (await (.writeFile fsp file-path with-write-id "utf8"))
          (await (watcher/handle-file-event! "test" dir file-path "change"))
          (is (some #(and (= "file-changed" (:type %))
                          (= write-id (:write-id %))
                          (= "correlated" (:correlation/status %))
                          (= "t1" (:task-id %)))
                    @captured))
          (is (not (some #(= "drift-detected" (:type %)) @captured))))
        (finally
          (unsub)
          (await (.rm fsp dir #js {:recursive true :force true})))))))

(deftest ^:async handle-file-event-detects-drift
  (testing "File event without a registered write-id is marked as drift"
    (let [dir (tmp-dir)
          _ (await (.mkdir fsp dir #js {:recursive true}))
          _ (await (write-task! dir "t2" "Task Two"))
          captured (atom [])
          unsub (events/subscribe! #(swap! captured conj %))]
      (try
        (let [file-path (path/join dir "t2.md")
              raw (await (.readFile fsp file-path "utf8"))
              with-write-id (content-parser/inject-write-id raw "unknown-write")]
          (await (.writeFile fsp file-path with-write-id "utf8"))
          (await (watcher/handle-file-event! "test" dir file-path "change"))
          (is (some #(and (= "drift-detected" (:type %))
                          (= "drift" (:correlation/status %))
                          (= "t2" (:task-id %)))
                    @captured))
          (is (some #(and (= "drift-protocol-rerun" (:type %))
                          (= "t2" (:task-id %))
                          (= "kanban.drift/fsm-status-check" (:protocol %))
                          (= "valid" (:result %)))
                    @captured))
          (is (not (some #(= "file-changed" (:type %)) @captured))))
        (finally
          (unsub)
          (await (.rm fsp dir #js {:recursive true :force true})))))))

(deftest ^:async handle-file-event-detects-cross-task-write-id
  (testing "Registered write-id for a different task is drift, not correlation"
    (let [dir (tmp-dir)
          _ (await (.mkdir fsp dir #js {:recursive true}))
          _ (await (write-task! dir "t4" "Task Four"))
          _ (await (write-task! dir "t5" "Task Five"))
          captured (atom [])
          unsub (events/subscribe! #(swap! captured conj %))]
      (try
        (let [t4-file-path (path/join dir "t4.md")
              t4-raw (await (.readFile fsp t4-file-path "utf8"))
              t5-write-id "t5-write-123"]
          (watcher/expect-write! t5-write-id "t5")
          (await (.writeFile fsp t4-file-path (content-parser/inject-write-id t4-raw t5-write-id) "utf8"))
          (await (watcher/handle-file-event! "test" dir t4-file-path "change"))
          (is (some #(and (= "drift-detected" (:type %))
                          (= "drift" (:correlation/status %))
                          (= "t4" (:task-id %)))
                    @captured))
          (is (some #(and (= "drift-protocol-rerun" (:type %))
                          (= "t4" (:task-id %))
                          (= "kanban.drift/fsm-status-check" (:protocol %)))
                    @captured))
          (is (not (some #(= "file-changed" (:type %)) @captured))))
        (finally
          (unsub)
          (await (.rm fsp dir #js {:recursive true :force true})))))))

(deftest ^:async handle-file-event-unlink-does-not-read
  (testing "Unlink events are handled without reading the deleted file"
    (let [dir (tmp-dir)
          _ (await (.mkdir fsp dir #js {:recursive true}))
          _ (await (write-task! dir "t6" "Task Six"))
          captured (atom [])
          unsub (events/subscribe! #(swap! captured conj %))]
      (try
        (let [file-path (path/join dir "t6.md")]
          (await (.unlink fsp file-path))
          (await (watcher/handle-file-event! "test" dir file-path "unlink"))
          (is (empty? @captured)))
        (finally
          (unsub)
          (await (.rm fsp dir #js {:recursive true :force true})))))))

(deftest projected-narrows-what-counts-as-a-card-file
  (let [root (path/resolve "/board")
        cards (path/join root "tasks")
        guides (path/join root "docs")]
    (testing "no projection means the whole task root is the board"
      (is (watcher/projected? nil (path/join guides "a-guide.md")))
      (is (watcher/projected? [] (path/join guides "a-guide.md"))))
    (testing "a file inside a projected root is a card file"
      (is (watcher/projected? [cards] (path/join cards "card.md")))
      (is (watcher/projected? [cards] (path/join cards "nested" "card.md"))))
    (testing "a file outside every projected root is not"
      ;; A design note quoting card frontmatter as an example still contains a
      ;; `uuid: "..."` line, and used to appear in the ledger as drift for a
      ;; card that was never on the board.
      (is (not (watcher/projected? [cards] (path/join guides "a-guide.md")))))
    (testing "a sibling whose name merely starts the same is not inside it"
      (is (not (watcher/projected? [cards] (str cards "-archive/card.md")))))
    (testing "any one of several projected roots is enough"
      (is (watcher/projected? [cards guides] (path/join guides "a-guide.md"))))))
