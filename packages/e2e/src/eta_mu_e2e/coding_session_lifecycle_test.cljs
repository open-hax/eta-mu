(ns eta-mu-e2e.coding-session-lifecycle-test
  "E2E tests for session domain lifecycle across coding layers.

   Exercises:
   - coding/shape/session.cljs entry parsing and conversion
   - coding/domain/session.cljs context building, compaction, migration
   - Cross-layer: session entries → context → LLM format"
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.coding.domain.session :as ds]
            [eta-mu.coding.shape.session :as ss]))

;; ── Fixtures ─────────────────────────────────────────────────────────────────

(defn make-external-entry
  "Create a minimal external session entry for testing (JS-compatible shape)."
  [id type & {:keys [content role message parent-id timestamp version
                     provider model model-id thinking-level
                     summary tokens-before first-kept-entry-id]
              :or {timestamp "2026-07-11T00:00:00Z"}}]
  (cond-> {:type (name type) :id id :timestamp timestamp}
    parent-id (assoc :parentId parent-id)
    version (assoc :version version)
    message (assoc :message message)
    content (assoc :content content)
    role (assoc :role role)
    provider (assoc :provider provider)
    model (assoc :model model)
    model-id (assoc :modelId model-id)
    thinking-level (assoc :thinkingLevel thinking-level)
    summary (assoc :summary summary)
    tokens-before (assoc :tokensBefore tokens-before)
    first-kept-entry-id (assoc :firstKeptEntryId first-kept-entry-id)))

(def sample-external-entries
  [(make-external-entry "h" :session :version 3)
   (make-external-entry "m1" :message
                        :message {:role "user" :content "Hello"}
                        :parentId "h")
   (make-external-entry "m2" :message
                        :message {:role "assistant" :content "Hi there"}
                        :parentId "m1")
   (make-external-entry "m3" :message
                        :message {:role "user" :content "Write a function"}
                        :parentId "m2")
   (make-external-entry "tc1" :message
                        :message {:role "assistant"
                                  :content [{:type "toolCall"
                                             :id "call-1"
                                             :name "write"
                                             :arguments {:path "/tmp/x.clj"}}]}
                        :parentId "m3")
   (make-external-entry "tr1" :message
                        :message {:role "toolResult"
                                  :toolCallId "call-1"
                                  :toolName "write"
                                  :content [{:type "text" :text "ok"}]
                                  :isError false}
                        :parentId "tc1")
   (make-external-entry "m4" :message
                        :message {:role "assistant" :content "Done!"}
                        :parentId "tr1")])

;; ── Session entry parsing via shape layer ────────────────────────────────────

(deftest parse-session-entries-jsonl-e2e
  (testing "parse JSONL session content into internal entries"
    (let [jsonl (str "{\"type\":\"session\",\"id\":\"h\",\"version\":3,\"timestamp\":\"2026-01-01T00:00:00Z\"}\n"
                     "{\"type\":\"message\",\"id\":\"m1\",\"message\":{\"role\":\"user\",\"content\":\"Hello\"},\"parentId\":\"h\",\"timestamp\":\"2026-01-01T00:00:01Z\"}\n")
          entries (ds/parse-session-entries jsonl)]
      (is (= 2 (count entries)))
      (is (= :session (:type (first entries))))
      (is (= "h" (:id (first entries))))
      (is (= :message (:type (second entries))))
      ;; Message is nested in :message key
      (is (= :user (:role (:message (second entries)))))
      (is (= "Hello" (:content (:message (second entries))))))))

(deftest parse-session-entries-empty-e2e
  (testing "empty content returns empty vector"
    (is (= [] (ds/parse-session-entries "")))
    (is (= [] (ds/parse-session-entries nil)))))

;; ── Shape layer entry conversion ─────────────────────────────────────────────

(deftest entry-roundtrip-e2e
  (testing "session entry survives external→internal→external round-trip"
    (let [ext-entry {:type "message" :id "m1" :parentId "h" :timestamp "2026-01-01T00:00:00Z"
                     :message {:role "user" :content "Hello"}}
          internal (ss/entry-from-external ext-entry)
          back (ss/entry->external internal)]
      (is (= :message (:type internal)))
      (is (= "m1" (:id internal)))
      (is (= :user (get-in internal [:message :role])))
      ;; Round-trip back to external
      (is (= "message" (:type back)))
      (is (= "m1" (:id back)))
      (is (= :user (get-in back [:message :role]))))))

(deftest entry-compaction-roundtrip-e2e
  (testing "compaction entry survives round-trip"
    (let [ext-entry {:type "compaction" :id "c1" :timestamp "2026-01-01T00:00:00Z"
                     :summary "Earlier compaction" :tokensBefore 5000}
          internal (ss/entry-from-external ext-entry)
          back (ss/entry->external internal)]
      (is (= :compaction (:type internal)))
      (is (= "Earlier compaction" (:summary internal)))
      (is (= 5000 (:tokens-before internal)))
      ;; Round-trip
      (is (= "compaction" (:type back)))
      (is (= "Earlier compaction" (:summary back)))
      (is (= 5000 (:tokensBefore back))))))

;; ── Session context building ─────────────────────────────────────────────────

(deftest build-session-context-e2e
  (testing "build-session-context extracts messages from external entries"
    (let [entries (mapv ss/entry-from-external sample-external-entries)
          ctx (ds/build-session-context entries)]
      ;; Messages are extracted from :message sub-maps
      (is (pos? (count (:messages ctx))))
      ;; Model info from last assistant message
      (is (some? (:model ctx))))))

(deftest build-session-context-thinking-level-e2e
  (testing "build-session-context picks up thinking-level changes"
    (let [;; Create entries directly to avoid helper function issues
          h-ext   {:type "session" :id "h" :version 3 :timestamp "2026-07-11T00:00:00Z"}
          m1-ext  {:type "message" :id "m1" :parentId "h" :timestamp "2026-07-11T00:00:01Z"
                   :message {:role "user" :content "Hello"}}
          tl1-ext {:type "thinking-level-change" :id "tl1" :parentId "m1"
                   :timestamp "2026-07-11T00:00:02Z" :thinkingLevel "high"}
          m2-ext  {:type "message" :id "m2" :parentId "tl1" :timestamp "2026-07-11T00:00:03Z"
                   :message {:role "assistant" :content "Hi"}}
          entries (mapv ss/entry-from-external [h-ext m1-ext tl1-ext m2-ext])
          ctx (ds/build-session-context entries)]
      (is (= "high" (:thinking-level ctx))))))

;; ── Session compaction ───────────────────────────────────────────────────────

(deftest get-latest-compaction-entry-e2e
  (testing "finds the most recent compaction entry"
    (let [entries (mapv ss/entry-from-external
                        [(make-external-entry "h" :session :version 3)
                         (make-external-entry "c1" :compaction
                                              :summary "Earlier compaction"
                                              :tokens-before 5000
                                              :timestamp "2026-01-01T00:00:00Z")
                         (make-external-entry "m1" :message
                                              :message {:role "user" :content "msg"})
                         (make-external-entry "c2" :compaction
                                              :summary "Later compaction"
                                              :tokens-before 10000
                                              :timestamp "2026-01-02T00:00:00Z")])
          compaction (ds/get-latest-compaction-entry entries)]
      (is (some? compaction))
      (is (= "Later compaction" (:summary compaction)))
      (is (= 10000 (:tokens-before compaction)))))

  (testing "returns nil when no compaction entries"
    (let [entries (mapv ss/entry-from-external
                        [(make-external-entry "h" :session :version 3)
                         (make-external-entry "m1" :message
                                              :message {:role "user" :content "msg"})])]
      (is (nil? (ds/get-latest-compaction-entry entries))))))

;; ── Session migration ────────────────────────────────────────────────────────

(deftest migrate-session-entries-e2e
  (testing "migration preserves entries with current version"
    (let [entries (mapv ss/entry-from-external
                        [(make-external-entry "h" :session :version 3)
                         (make-external-entry "m1" :message
                                              :message {:role "user" :content "Hello"})])
          migrated (ds/migrate-session-entries entries)]
      (is (= 2 (count migrated)))
      ;; Session entry should have version
      (is (= ds/current-session-version (:version (first migrated))))
      ;; Message entry preserved
      (is (= :message (:type (second migrated)))))))
