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
          (is (not (some #(= "file-changed" (:type %)) @captured))))
        (finally
          (unsub)
          (await (.rm fsp dir #js {:recursive true :force true})))))))

(deftest ^:async handle-file-event-detects-drift-without-write-id
  (testing "External edit with no write-id at all is drift"
    (let [dir (tmp-dir)
          _ (await (.mkdir fsp dir #js {:recursive true}))
          _ (await (write-task! dir "t3" "Task Three"))
          captured (atom [])
          unsub (events/subscribe! #(swap! captured conj %))]
      (try
        (let [file-path (path/join dir "t3.md")
              raw (await (.readFile fsp file-path "utf8"))
              edited (str raw "\n\nExternal edit")]
          (await (.writeFile fsp file-path edited "utf8"))
          (await (watcher/handle-file-event! "test" dir file-path "change"))
          (is (some #(and (= "drift-detected" (:type %))
                          (= "drift" (:correlation/status %))
                          (= "t3" (:task-id %)))
                    @captured)))
        (finally
          (unsub)
          (await (.rm fsp dir #js {:recursive true :force true})))))))
