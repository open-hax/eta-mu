(ns eta-mu.coding.domain.session-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.coding.domain.session :as session]
            [eta-mu.coding.law.session :as session-law]
            [eta-mu.coding.shape.session :as session-shape]))

(def timestamp 1780099200000)

(def usage
  {:input 1 :output 1 :cache-read 0 :cache-write 0 :total-tokens 1
   :cost {:input 0 :output 0 :cache-read 0 :cache-write 0 :total 0}})

(defn- user-message
  ([id text]
   (user-message id text timestamp))
  ([id text ts]
   {:type :message
    :id id
    :parent-id nil
    :timestamp "2026-01-01T00:00:00Z"
    :message {:role :user
              :content [{:type :text :text text}]
              :timestamp ts}}))

(defn- assistant-message
  ([id parent-id provider model]
   (assistant-message id parent-id provider model timestamp))
  ([id parent-id provider model ts]
   {:type :message
    :id id
    :parent-id parent-id
    :timestamp "2026-01-01T00:00:00Z"
    :message {:role :assistant
              :content [{:type :text :text "ok"}]
              :api "test"
              :provider provider
              :model model
              :usage usage
              :stop-reason :stop
              :timestamp ts}}))

(deftest session-schema-validation-test
  (testing "valid entries pass schema validation"
    (is (session-law/valid-session-entry? (user-message "u1" "hello")))
    (is (session-law/valid-session-entry? {:type :thinking-level-change
                                           :id "t1"
                                           :parent-id nil
                                           :timestamp "2026-01-01T00:00:00Z"
                                           :thinking-level "on"}))
    (is (session-law/valid-session-entry? {:type :compaction
                                           :id "c1"
                                           :parent-id nil
                                           :timestamp "2026-01-01T00:00:00Z"
                                           :summary "summary"
                                           :first-kept-entry-id "u1"
                                           :tokens-before 100}))
    (is (session-law/valid-session-context? {:messages []
                                            :thinking-level "off"
                                            :model nil})))

  (testing "invalid entries fail schema validation"
    (is (not (session-law/valid-session-entry? {:type :message :id "m1"})))
    (is (not (session-law/valid-session-entry? {:type :thinking-level-change
                                                :id "t1"
                                                :parent-id nil
                                                :timestamp "2026-01-01T00:00:00Z"})))
    (is (not (session-law/valid-session-context? {:messages []
                                                  :thinking-level ""
                                                  :model nil})))))

(deftest build-session-context-test
  (testing "linear path produces messages and tracks model"
    (let [entries [(user-message "u1" "hello")
                    (assistant-message "a1" "u1" "openai" "gpt-test")]
          context (session/build-session-context entries)]
      (is (= 2 (count (:messages context))))
      (is (= "openai" (get-in context [:model :provider])))
      (is (= "gpt-test" (get-in context [:model :model-id])))
      (is (= "off" (:thinking-level context)))))

  (testing "thinking level and model changes are observed"
    (let [entries [(user-message "u1" "hello")
                   {:type :thinking-level-change
                    :id "t1"
                    :parent-id "u1"
                    :timestamp "2026-01-01T00:00:00Z"
                    :thinking-level "high"}
                   {:type :model-change
                    :id "m1"
                    :parent-id "t1"
                    :timestamp "2026-01-01T00:00:00Z"
                    :provider "anthropic"
                    :model-id "claude-test"}
                    (assoc (user-message "u2" "followup") :parent-id "m1")]
          context (session/build-session-context entries)]
      (is (= "high" (:thinking-level context)))
      (is (= "anthropic" (get-in context [:model :provider])))
      (is (= "claude-test" (get-in context [:model :model-id])))))

  (testing "compaction emits summary and kept messages"
    (let [entries [(user-message "u1" "first")
                    (assistant-message "a1" "u1" "openai" "gpt-test")
                   (user-message "u2" "second")
                   {:type :compaction
                    :id "c1"
                    :parent-id "u2"
                    :timestamp "2026-01-01T00:00:00Z"
                    :summary "old facts"
                    :first-kept-entry-id "u2"
                    :tokens-before 200}
                                       (assistant-message "a2" "c1" "openai" "gpt-test")]
          context (session/build-session-context entries)
          roles (mapv :role (:messages context))]
      (is (= 3 (count (:messages context))))
      (is (= [:compaction-summary :user :assistant] roles))
      (is (= "old facts" (-> context :messages first :summary)))))

  (testing "leaf-id limits context to a subtree"
    (let [entries [(user-message "u1" "first")
                    (assistant-message "a1" "u1" "openai" "gpt-test")
                   (user-message "u2" "second")]
          context (session/build-session-context entries "u1")]
      (is (= 1 (count (:messages context))))
      (is (= :user (-> context :messages first :role)))))

  (testing "nil leaf-id returns empty context"
    (let [entries [(user-message "u1" "hello")]
          context (session/build-session-context entries nil)]
      (is (= [] (:messages context)))
      (is (= "off" (:thinking-level context)))
      (is (nil? (:model context))))))

(deftest get-latest-compaction-entry-test
  (testing "returns the most recent compaction"
    (let [c1 {:type :compaction
              :id "c1"
              :parent-id nil
              :timestamp "2026-01-01T00:00:00Z"
              :summary "first"
              :first-kept-entry-id "u1"
              :tokens-before 100}
          c2 {:type :compaction
              :id "c2"
              :parent-id "c1"
              :timestamp "2026-01-01T00:00:01Z"
              :summary "second"
              :first-kept-entry-id "u1"
              :tokens-before 200}
          entries [(user-message "u1" "hello") c1 c2]]
      (is (= "c2" (:id (session/get-latest-compaction-entry entries))))))

  (testing "returns nil when no compaction exists"
    (is (nil? (session/get-latest-compaction-entry [(user-message "u1" "hello")])))))

(deftest migrate-session-entries-test
  (testing "v1 entries receive id/parent-id tree structure"
    (let [counter (atom 0)
          id-fn #(do (swap! counter inc) (str "uuid-" @counter))
          entries [{:type :session :id "s1" :timestamp "2026-01-01T00:00:00Z" :cwd "/tmp"}
                   {:type :message :message {:role :user :content "hi" :timestamp timestamp}}]
          migrated (session/migrate-session-entries entries id-fn)]
      (is (= 3 (get-in migrated [0 :version])))
      (is (string? (get-in migrated [1 :id])))
      (is (nil? (get-in migrated [1 :parent-id])))))

  (testing "v1 compaction first-kept-entry-index is converted to id"
    (let [counter (atom 0)
          id-fn #(do (swap! counter inc) (str "uuid-" @counter))
          entries [{:type :session :id "s1" :timestamp "2026-01-01T00:00:00Z" :cwd "/tmp"}
                   {:type :message :message {:role :user :content "keep" :timestamp timestamp}}
                   {:type :message :message {:role :assistant :content "ok" :provider "x" :model "y" :api "x" :usage usage :stop-reason :stop :timestamp timestamp}}
                   {:type :compaction
                    :summary "compact"
                    :first-kept-entry-index 1
                    :tokens-before 50}]
          migrated (session/migrate-session-entries entries id-fn)
          compaction (last migrated)]
      (is (= "uuid-1" (:first-kept-entry-id compaction)))
      (is (nil? (:first-kept-entry-index compaction)))))

  (testing "v2 hookMessage role is renamed to custom"
    (let [entries [{:type :session :version 2 :id "s1" :timestamp "2026-01-01T00:00:00Z" :cwd "/tmp"}
                   {:type :message
                    :id "m1"
                    :parent-id nil
                    :timestamp "2026-01-01T00:00:00Z"
                    :message {:role "hookMessage" :content "hi" :timestamp timestamp}}]
          migrated (session/migrate-session-entries entries)]
      (is (= :custom (get-in migrated [1 :message :role])))))

  (testing "current version entries pass through unchanged"
    (let [entries [{:type :session :version 3 :id "s1" :timestamp "2026-01-01T00:00:00Z" :cwd "/tmp"}
                   (user-message "u1" "hello")]]
      (is (= entries (session/migrate-session-entries entries))))))

(deftest parse-session-entries-test
  (testing "parses JSONL lines"
    (let [content "{\"type\":\"session\",\"id\":\"s1\",\"timestamp\":\"2026-01-01T00:00:00Z\",\"cwd\":\"/tmp\"}\n{\"type\":\"message\",\"id\":\"m1\",\"parentId\":null,\"timestamp\":\"2026-01-01T00:00:00Z\",\"message\":{\"role\":\"user\",\"content\":[{\"type\":\"text\",\"text\":\"hi\"}],\"timestamp\":1780099200000}}"
          parsed (session/parse-session-entries content)]
      (is (= 2 (count parsed)))
      (is (= :session (:type (first parsed))))
      (is (= :message (:type (second parsed))))))

  (testing "parses EDN lines"
    (let [content "{:type :session :id \"s1\" :timestamp \"2026-01-01T00:00:00Z\" :cwd \"/tmp\"}\n{:type :message :id \"m1\" :parent-id nil :timestamp \"2026-01-01T00:00:00Z\" :message {:role :user :content [{:type :text :text \"hi\"}] :timestamp 1780099200000}}"
          parsed (session/parse-session-entries content)]
      (is (= 2 (count parsed)))
      (is (= :session (:type (first parsed))))))

  (testing "skips malformed and blank lines"
    (let [content "{\"type\":\"session\",\"id\":\"s1\",\"timestamp\":\"2026-01-01T00:00:00Z\",\"cwd\":\"/tmp\"}\n\n{not valid\n"
          parsed (session/parse-session-entries content)]
      (is (= 1 (count parsed))))))

(deftest find-most-recent-session-test
  (testing "returns path with greatest mtime"
    (let [candidates [{:path "/tmp/a.jsonl" :mtime 100}
                      {:path "/tmp/b.jsonl" :mtime 200}
                      {:path "/tmp/c.jsonl" :mtime 50}]]
      (is (= "/tmp/b.jsonl" (session/find-most-recent-session candidates)))))

  (testing "returns nil for empty candidates"
    (is (nil? (session/find-most-recent-session [])))))

(deftest session-cwd-issue-test
  (testing "issue is reported only when cwd is missing"
    (is (nil? (session/get-missing-session-cwd-issue
               {:session-file "/tmp/session.jsonl"
                :session-cwd "/tmp"
                :fallback-cwd "/home"
                :cwd-exists? true})))
    (let [issue (session/get-missing-session-cwd-issue
                 {:session-file "/tmp/session.jsonl"
                  :session-cwd "/gone"
                  :fallback-cwd "/home"
                  :cwd-exists? false})]
      (is (= "/tmp/session.jsonl" (:session-file issue)))
      (is (= "/gone" (:session-cwd issue)))
      (is (= "/home" (:fallback-cwd issue)))
      (is (session-law/valid-session-cwd-issue? issue)))))

(deftest format-missing-session-cwd-test
  (testing "error and prompt formats match legacy text"
    (let [issue {:session-file "/tmp/session.jsonl"
                 :session-cwd "/gone"
                 :fallback-cwd "/home"}]
      (is (re-find #"Stored session working directory does not exist: /gone" (session/format-missing-session-cwd-error issue)))
      (is (re-find #"Session file: /tmp/session.jsonl" (session/format-missing-session-cwd-error issue)))
      (is (re-find #"Current working directory: /home" (session/format-missing-session-cwd-error issue)))
      (is (re-find #"cwd from session file does not exist" (session/format-missing-session-cwd-prompt issue)))
      (is (re-find #"continue in current cwd" (session/format-missing-session-cwd-prompt issue))))))

(deftest entry-dto-round-trip-test
  (testing "header round-trips through shape transforms"
    (let [header {:type :session
                  :version 3
                  :id "s1"
                  :timestamp "2026-01-01T00:00:00Z"
                  :cwd "/tmp"
                  :parent-session "/tmp/parent.jsonl"}
          external (session-shape/entry->external header)
          internal (session-shape/entry-from-external external)]
      (is (= header internal))))

  (testing "message entry round-trips"
    (let [entry (user-message "u1" "hello")
          external (session-shape/entry->external entry)
          internal (session-shape/entry-from-external external)]
      (is (= entry internal))))

  (testing "compaction entry round-trips"
    (let [entry {:type :compaction
                 :id "c1"
                 :parent-id "u1"
                 :timestamp "2026-01-01T00:00:00Z"
                 :summary "summary"
                 :first-kept-entry-id "u1"
                 :tokens-before 100
                 :details {:x 1}
                 :from-hook true}
          external (session-shape/entry->external entry)
          internal (session-shape/entry-from-external external)]
      (is (= entry internal))))

  (testing "tree node round-trips recursively"
    (let [node {:entry (user-message "u1" "hello")
                 :children [{:entry (assistant-message "a1" "u1" "openai" "gpt-test")
                            :children []
                            :label nil
                            :label-timestamp nil}]
                :label "root"
                :label-timestamp "2026-01-01T00:00:00Z"}
          external (session-shape/tree-node->external node)
          internal (session-shape/tree-node-from-external external)]
      (is (= node internal))))

  (testing "context round-trips"
    (let [context {:messages []
                   :thinking-level "high"
                   :model {:provider "openai" :model-id "gpt-test"}}
          external (session-shape/context->external context)
          internal (session-shape/context-from-external external)]
      (is (= context internal)))))
