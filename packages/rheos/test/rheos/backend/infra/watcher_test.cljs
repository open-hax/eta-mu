(ns rheos.backend.infra.watcher-test
  (:require ["node:fs/promises" :as fsp]
            ["node:os" :as os]
            ["node:path" :as path]
            [cljs.test :refer [deftest testing is]]
            [rheos.backend.infra.document-file-event :as document-file-event]
            [rheos.backend.infra.watcher :as watcher]
            [rheos.backend.domain.events :as events]
            [rheos.backend.law.fsm :as fsm]
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

(deftest ^:async typed-document-append-precedes-legacy-kanban-append
  (let [calls (atom [])]
    (with-redefs [document-file-event/handle-file-event!
                  (fn [& _]
                    (swap! calls conj :typed-document)
                    (js/Promise.resolve nil))
                  watcher/handle-file-event!
                  (fn [& _]
                    (swap! calls conj :legacy-kanban)
                    (js/Promise.resolve nil))]
      (await (watcher/handle-watched-markdown!
              "board" "/tasks" "/tasks/card.md" "change" nil))
      (is (= [:typed-document :legacy-kanban] @calls)))))

(deftest ^:async document-outside-card-projection-skips-only-legacy
  (let [calls (atom [])
        cards (path/resolve "/tasks/cards")
        document (path/resolve "/tasks/documents/translation.md")]
    (with-redefs [document-file-event/handle-file-event!
                  (fn [& _]
                    (swap! calls conj :typed-document)
                    (js/Promise.resolve nil))
                  watcher/handle-file-event!
                  (fn [& _]
                    (swap! calls conj :legacy-kanban)
                    (js/Promise.resolve nil))]
      (await (watcher/handle-watched-markdown!
              "board" "/tasks" document "change" [cards]))
      (is (= [:typed-document] @calls)))))

(deftest ^:async watcher-callback-contains-rejected-file-events
  (let [reported (atom [])]
    (with-redefs [watcher/handle-watched-markdown!
                  (fn [& _]
                    (js/Promise.reject (js/Error. "append failed")))
                  watcher/report-watcher-error!
                  (fn [file-path error]
                    (reset! reported [file-path (.-message error)]))]
      (is (nil? (await (watcher/handle-watched-markdown-safely!
                        "board" "/tasks" "/tasks/card.md" "change" nil))))
      (is (= ["/tasks/card.md" "append failed"]
             @reported)))))

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

;; A card the way git delivers one: plain YAML, no write-id. Nothing here is
;; malformed — `status: incoming` is the shape hand-authored and normalized
;; cards carry, and `write-task!` above (quoted, CLI-shaped) is the reason this
;; class of card went unnoticed by every test in this file.
(defn- write-git-delivered-task! [dir uuid status]
  (let [file-path (path/join dir (str uuid ".md"))
        raw (str "---\n"
                 "uuid: " uuid "\n"
                 "title: A card that arrived through git\n"
                 "status: " status "\n"
                 "priority: P1\n"
                 "---\n\n# A card that arrived through git\n\nBody")]
    (.writeFile fsp file-path raw "utf8")))

(deftest ^:async unquoted-frontmatter-status-is-read-not-rejected
  (testing "A git-delivered card with plain YAML frontmatter is valid, not invalid"
    (let [dir (tmp-dir)
          _ (await (.mkdir fsp dir #js {:recursive true}))
          _ (await (write-git-delivered-task! dir "g1" "incoming"))
          captured (atom [])
          unsub (events/subscribe! #(swap! captured conj %))]
      (try
        (await (watcher/handle-file-event! "test" dir (path/join dir "g1.md") "add"))
        (let [verdicts (filter #(= "drift-protocol-rerun" (:type %)) @captured)]
          (is (= 1 (count verdicts)))
          (is (= "incoming" (:status (first verdicts)))
              "the status is on the card in valid YAML; the watcher must read it")
          (is (= "valid" (:result (first verdicts))))
          (is (not (some #(= "invalid" (:result %)) verdicts))))
        (finally
          (unsub)
          (await (.rm fsp dir #js {:recursive true :force true})))))))

(deftest ^:async every-fsm-status-survives-git-delivery
  (testing "No FSM status is recorded as invalid when git lands the card"
    (let [dir (tmp-dir)
          _ (await (.mkdir fsp dir #js {:recursive true}))
          captured (atom [])
          unsub (events/subscribe! #(swap! captured conj %))]
      (try
        (doseq [status (:states fsm/promethean-fsm)]
          (await (write-git-delivered-task! dir (str "g-" status) status))
          (await (watcher/handle-file-event! "test" dir (path/join dir (str "g-" status ".md")) "add")))
        (let [verdicts (filter #(= "drift-protocol-rerun" (:type %)) @captured)]
          (is (= (count (:states fsm/promethean-fsm)) (count verdicts)))
          (is (every? #(= "valid" (:result %)) verdicts)
              (str "recorded non-valid verdicts: "
                   (pr-str (remove #(= "valid" (:result %)) verdicts)))))
        (finally
          (unsub)
          (await (.rm fsp dir #js {:recursive true :force true})))))))

(deftest ^:async unreadable-status-is-unknown-not-invalid
  (testing "A card with no status is an unknown, not an FSM violation"
    (let [dir (tmp-dir)
          _ (await (.mkdir fsp dir #js {:recursive true}))
          file-path (path/join dir "g2.md")
          _ (await (.writeFile fsp file-path
                               "---\nuuid: g2\ntitle: No status at all\n---\n\nBody" "utf8"))
          captured (atom [])
          unsub (events/subscribe! #(swap! captured conj %))]
      (try
        (await (watcher/handle-file-event! "test" dir file-path "add"))
        (let [verdicts (filter #(= "drift-protocol-rerun" (:type %)) @captured)]
          (is (= 1 (count verdicts)))
          (is (= "unknown" (:result (first verdicts)))
              "failing to read a status is not a claim about the card's contents"))
        (finally
          (unsub)
          (await (.rm fsp dir #js {:recursive true :force true})))))))

(deftest ^:async genuine-out-of-band-edit-still-drifts
  (testing "The fix does not silence real drift"
    (let [dir (tmp-dir)
          _ (await (.mkdir fsp dir #js {:recursive true}))
          file-path (path/join dir "g3.md")
          _ (await (.writeFile fsp file-path
                               (str "---\nuuid: g3\ntitle: Edited behind the tool\n"
                                    "status: not_a_real_state\n---\n\nBody") "utf8"))
          captured (atom [])
          unsub (events/subscribe! #(swap! captured conj %))]
      (try
        (await (watcher/handle-file-event! "test" dir file-path "change"))
        (is (some #(and (= "drift-detected" (:type %)) (= "g3" (:task-id %))) @captured)
            "an uncorrelated write is still drift")
        (is (some #(and (= "drift-protocol-rerun" (:type %))
                        (= "invalid" (:result %))
                        (= "not_a_real_state" (:status %)))
                  @captured)
            "a status outside the FSM is still a genuine violation")
        (finally
          (unsub)
          (await (.rm fsp dir #js {:recursive true :force true})))))))

(deftest ^:async status-quoted-in-prose-is-not-the-cards-status
  (testing "Frontmatter is the only place a status is read from"
    (let [dir (tmp-dir)
          _ (await (.mkdir fsp dir #js {:recursive true}))
          file-path (path/join dir "g4.md")
          ;; A card whose body documents FSM frontmatter — the old whole-file
          ;; regex reported the prose example as this card's status.
          _ (await (.writeFile fsp file-path
                               (str "---\nuuid: g4\ntitle: Card about cards\n"
                                    "status: incoming\n---\n\n"
                                    "Set the field like this:\n\n"
                                    "    status: \"done\"\n") "utf8"))
          captured (atom [])
          unsub (events/subscribe! #(swap! captured conj %))]
      (try
        (await (watcher/handle-file-event! "test" dir file-path "add"))
        (let [verdict (first (filter #(= "drift-protocol-rerun" (:type %)) @captured))]
          (is (= "incoming" (:status verdict))
              "a status quoted in the body must not be read as the card's status")
          (is (= "valid" (:result verdict))))
        (finally
          (unsub)
          (await (.rm fsp dir #js {:recursive true :force true})))))))

(deftest status-verdict-separates-unreadable-from-forbidden
  (testing "unknown, valid, and invalid are three distinct outcomes"
    (is (= "unknown" (watcher/status-verdict nil)))
    (is (= "unknown" (watcher/status-verdict "")))
    (is (= "unknown" (watcher/status-verdict "   ")))
    (is (= "invalid" (watcher/status-verdict "not_a_real_state")))
    (doseq [s (:states fsm/promethean-fsm)]
      (is (= "valid" (watcher/status-verdict s))))))

(deftest card-fields-reads-plain-and-quoted-yaml-alike
  (testing "Both frontmatter dialects on this board parse identically"
    (let [quoted "---\nuuid: \"a\"\nstatus: \"incoming\"\nwrite-id: \"w1\"\n---\n\nBody"
          plain "---\nuuid: a\nstatus: incoming\nwrite-id: w1\n---\n\nBody"]
      (is (= {:uuid "a" :status "incoming" :write-id "w1"} (watcher/card-fields quoted)))
      (is (= (watcher/card-fields quoted) (watcher/card-fields plain))))))

(deftest projected-narrows-what-counts-as-a-card-file
  (let [root (path/resolve "/board")
        cards (path/join root "tasks")
        guides (path/join root "docs")]
    (testing "no projection at all means the whole task root is the board"
      (is (watcher/projected? nil (path/join guides "a-guide.md"))))
    (testing "an explicit empty projection scans nothing, matching the loader"
      ;; `{:paths []}` is a board that projects no cards. The loader gives itself
      ;; no roots to walk in that case, so the watcher must not walk everything.
      (is (not (watcher/projected? [] (path/join guides "a-guide.md"))))
      (is (not (watcher/projected? [] (path/join cards "card.md")))))
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
