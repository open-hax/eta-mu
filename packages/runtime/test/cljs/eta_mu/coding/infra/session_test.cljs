(ns eta-mu.coding.infra.session-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.coding.extern.fs :as fs]
            [eta-mu.coding.extern.path :as path]
            [eta-mu.coding.infra.session :as session]))

(defn- temp-dir
  "Create a temporary directory for testing."
  []
  (let [dir (path/path-join (.tmpdir (js/require "node:os"))
                            (str "session-test-" (subs (str (random-uuid)) 0 8)))]
    (fs/ensure-directory! dir)
    dir))

(defn- cleanup! [dir]
  (fs/delete-directory! dir))

(defn- user-msg [id text]
  {:role :user
   :content [{:type :text :text text}]
   :timestamp 1780099200000})

(defn- assistant-msg [id parent-id provider model]
  {:role :assistant
   :content [{:type :text :text "ok"}]
   :api "test"
   :provider provider
   :model model
   :usage {:input 1 :output 1 :cache-read 0 :cache-write 0 :total-tokens 1
           :cost {:input 0 :output 0 :cache-read 0 :cache-write 0 :total 0}}
   :stop-reason :stop
   :timestamp 1780099200000})

;; ---------------------------------------------------------------------------
;; In-memory session tests
;; ---------------------------------------------------------------------------

(deftest in-memory-session-test
  (testing "creates session with correct defaults"
    (let [s (session/in-memory "/tmp/test")]
      (is (some? (session/session-id s)))
      (is (= 8 (count (session/session-id s))))
      (is (not (session/persisted? s)))
      (is (nil? (session/leaf-id s)))
      (is (nil? (session/session-file s)))
      (is (= "/tmp/test" (session/cwd s)))))

  (testing "header is created automatically"
    (let [s (session/in-memory "/tmp/test")
          h (session/header s)]
      (is (= :session (:type h)))
      (is (= 3 (:version h)))
      (is (string? (:id h)))
      (is (string? (:timestamp h)))
      (is (= "/tmp/test" (:cwd h))))))

(deftest append-message-test
  (testing "appending a message updates state"
    (let [s (session/in-memory "/tmp/test")
          id (session/append-message! s (user-msg "u1" "hello"))]
      (is (string? id))
      (is (= id (session/leaf-id s)))
      (is (= 1 (count (session/entries s))))
      (is (= :message (:type (session/get-entry s id)))))))

(deftest append-thinking-level-change-test
  (testing "appending thinking level change"
    (let [s (session/in-memory "/tmp/test")
          _ (session/append-message! s (user-msg "u1" "hello"))
          id (session/append-thinking-level-change! s "high")]
      (is (string? id))
      (is (= 2 (count (session/entries s))))
      (is (= "high" (:thinking-level (session/get-entry s id)))))))

(deftest append-model-change-test
  (testing "appending model change"
    (let [s (session/in-memory "/tmp/test")
          id (session/append-model-change! s "anthropic" "claude-3")]
      (is (string? id))
      (is (= "anthropic" (:provider (session/get-entry s id))))
      (is (= "claude-3" (:model-id (session/get-entry s id)))))))

(deftest append-compaction-test
  (testing "appending compaction"
    (let [s (session/in-memory "/tmp/test")
          _ (session/append-message! s (user-msg "u1" "hello"))
          id (session/append-compaction! s "summary text" "u1" 100
                                         :details {:x 1} :from-hook true)]
      (is (string? id))
      (let [entry (session/get-entry s id)]
        (is (= :compaction (:type entry)))
        (is (= "summary text" (:summary entry)))
        (is (= "u1" (:first-kept-entry-id entry)))
        (is (= 100 (:tokens-before entry)))
        (is (= {:x 1} (:details entry)))
        (is (true? (:from-hook entry)))))))

(deftest append-label-change-test
  (testing "setting a label"
    (let [s (session/in-memory "/tmp/test")
          mid (session/append-message! s (user-msg "u1" "hello"))
          lid (session/append-label-change! s mid "my-label")]
      (is (= "my-label" (session/get-label s mid)))))

  (testing "clearing a label"
    (let [s (session/in-memory "/tmp/test")
          mid (session/append-message! s (user-msg "u1" "hello"))
          _ (session/append-label-change! s mid "my-label")
          _ (session/append-label-change! s mid nil)]
      (is (nil? (session/get-label s mid)))))

  (testing "throws on nonexistent entry"
    (let [s (session/in-memory "/tmp/test")]
      (is (thrown-with-msg? js/Error #"Entry nonexistent not found"
                           (session/append-label-change! s "nonexistent" "label"))))))

(deftest append-session-info-test
  (testing "appending session info with name"
    (let [s (session/in-memory "/tmp/test")
          id (session/append-session-info! s "My Session")]
      (is (string? id))
      (is (= "My Session" (session/session-name s)))))

  (testing "name trims whitespace"
    (let [s (session/in-memory "/tmp/test")
          _ (session/append-session-info! s "  trimmed  ")]
      (is (= "trimmed" (session/session-name s)))))

  (testing "latest name wins"
    (let [s (session/in-memory "/tmp/test")
          _ (session/append-session-info! s "first")
          _ (session/append-session-info! s "second")]
      (is (= "second" (session/session-name s))))))

(deftest append-custom-entry-test
  (testing "appending custom entry"
    (let [s (session/in-memory "/tmp/test")
          id (session/append-custom-entry! s "my-extension" :data {:key "val"})]
      (is (string? id))
      (let [entry (session/get-entry s id)]
        (is (= :custom (:type entry)))
        (is (= "my-extension" (:custom-type entry)))
        (is (= {:key "val"} (:data entry)))))))

(deftest append-custom-message-test
  (testing "appending custom message"
    (let [s (session/in-memory "/tmp/test")
          id (session/append-custom-message! s "my-ext" "hello" true
                                             :details {:x 1})]
      (is (string? id))
      (let [entry (session/get-entry s id)]
        (is (= :custom-message (:type entry)))
        (is (= "my-ext" (:custom-type entry)))
        (is (= "hello" (:content entry)))
        (is (true? (:display entry)))
        (is (= {:x 1} (:details entry)))))))

;; ---------------------------------------------------------------------------
;; Tree traversal tests
;; ---------------------------------------------------------------------------

(deftest branch-test
  (testing "branch walks from leaf to root"
    (let [s (session/in-memory "/tmp/test")
          u1 (session/append-message! s (user-msg "u1" "hello"))
          a1 (session/append-message! s (assistant-msg "a1" u1 "openai" "gpt"))
          u2 (session/append-message! s (user-msg "u2" "followup"))
          path (session/branch s)]
      (is (= 4 (count path)))  ; header + 3 entries
      (is (= :session (:type (first path))))
      (is (= :message (:type (last path))))
      (is (= u2 (:id (last path))))))

  (testing "branch from specific entry"
    (let [s (session/in-memory "/tmp/test")
          u1 (session/append-message! s (user-msg "u1" "hello"))
          _a1 (session/append-message! s (assistant-msg "a1" u1 "openai" "gpt"))
          path (session/branch s u1)]
      (is (= 2 (count path))))))  ; header + u1

(deftest tree-test
  (testing "tree builds correct structure"
    (let [s (session/in-memory "/tmp/test")
          u1 (session/append-message! s (user-msg "u1" "hello"))
          a1 (session/append-message! s (assistant-msg "a1" u1 "openai" "gpt"))
          u2 (session/append-message! s (user-msg "u2" "followup"))
          t (session/tree s)]
      (is (= 1 (count t)))  ; one root (the header)
      (is (= :session (:type (:entry (first t)))))
      (is (= 1 (count (:children (first t))))))))  ; u1 is child of header

(deftest get-children-test
  (testing "get-children returns direct children"
    (let [s (session/in-memory "/tmp/test")
          u1 (session/append-message! s (user-msg "u1" "hello"))
          a1 (session/append-message! s (assistant-msg "a1" u1 "openai" "gpt"))
          children (session/get-children s nil)]
      (is (= 1 (count children)))
      (is (= u1 (:id (first children)))))))

;; ---------------------------------------------------------------------------
;; Branching operations tests
;; ---------------------------------------------------------------------------

(deftest branch-from!-test
  (testing "branch-from! moves leaf pointer"
    (let [s (session/in-memory "/tmp/test")
          u1 (session/append-message! s (user-msg "u1" "hello"))
          _a1 (session/append-message! s (assistant-msg "a1" u1 "openai" "gpt"))
          u2 (session/append-message! s (user-msg "u2" "followup"))]
      (session/branch-from! s u1)
      (is (= u1 (session/leaf-id s)))
      ;; Next append becomes child of u1
      (let [u3 (session/append-message! s (user-msg "u3" "branched"))]
        (is (= u1 (:parent-id (session/get-entry s u3)))))))

  (testing "branch-from! throws on nonexistent entry"
    (let [s (session/in-memory "/tmp/test")]
      (is (thrown-with-msg? js/Error #"Entry nope not found"
                           (session/branch-from! s "nope"))))))

(deftest reset-leaf!-test
  (testing "reset-leaf! clears leaf pointer"
    (let [s (session/in-memory "/tmp/test")
          _u1 (session/append-message! s (user-msg "u1" "hello"))]
      (session/reset-leaf! s)
      (is (nil? (session/leaf-id s))))))

(deftest branch-with-summary!-test
  (testing "branch-with-summary! appends branch-summary entry"
    (let [s (session/in-memory "/tmp/test")
          u1 (session/append-message! s (user-msg "u1" "hello"))
          _a1 (session/append-message! s (assistant-msg "a1" u1 "openai" "gpt"))]
      (session/branch-with-summary! s u1 "abandoned context"
                                    :details {:reason :user-edit}
                                    :from-hook true)
      (is (= u1 (session/leaf-id s)))
      (let [entries (session/entries s)
            summary (last entries)]
        (is (= :branch-summary (:type summary)))
        (is (= "abandoned context" (:summary summary)))
        (is (= u1 (:from-id summary)))
        (is (= {:reason :user-edit} (:details summary)))
        (is (true? (:from-hook summary)))))))

;; ---------------------------------------------------------------------------
;; Build context tests
;; ---------------------------------------------------------------------------

(deftest build-context-test
  (testing "builds context from linear path"
    (let [s (session/in-memory "/tmp/test")
          u1 (session/append-message! s (user-msg "u1" "hello"))
          _a1 (session/append-message! s (assistant-msg "a1" u1 "openai" "gpt-test"))
          ctx (session/build-context s)]
      (is (= 2 (count (:messages ctx))))
      (is (= "off" (:thinking-level ctx)))
      (is (= "openai" (get-in ctx [:model :provider])))))

  (testing "builds context at specific leaf"
    (let [s (session/in-memory "/tmp/test")
          u1 (session/append-message! s (user-msg "u1" "hello"))
          _a1 (session/append-message! s (assistant-msg "a1" u1 "openai" "gpt"))
          ctx (session/build-context s u1)]
      (is (= 1 (count (:messages ctx)))))))

;; ---------------------------------------------------------------------------
;; File-backed session tests
;; ---------------------------------------------------------------------------

(deftest create-and-open-test
  (testing "create produces a file, open reads it back"
    (let [dir (temp-dir)]
      (try
        (let [s (session/create "/tmp/test" dir)
              _ (session/append-message! s (user-msg "u1" "hello"))
              _ (session/append-message! s (assistant-msg "a1" "u1" "openai" "gpt"))
              sf (session/session-file s)]
          (is (some? sf))
          (is (fs/file-exists? sf))
          ;; Open it back
          (let [s2 (session/open sf)]
            (is (= (session/session-id s) (session/session-id s2)))
            (is (= 2 (count (session/entries s2))))
            (is (= "hello" (-> (session/entries s2) first :message :content first :text)))))
        (finally (cleanup! dir)))))

  (testing "continue-recent finds existing session"
    (let [dir (temp-dir)]
      (try
        (let [s (session/create "/tmp/test" dir)
              _ (session/append-message! s (user-msg "u1" "first"))
              s2 (session/continue-recent "/tmp/test" dir)]
          (is (= (session/session-id s) (session/session-id s2))))
        (finally (cleanup! dir)))))

  (testing "continue-recent creates new when dir empty"
    (let [dir (temp-dir)]
      (try
        (let [s (session/continue-recent "/tmp/test" dir)]
          (is (some? (session/session-id s)))
          (is (= 0 (count (session/entries s)))))
        (finally (cleanup! dir))))))

(deftest list-sessions-test
  (testing "list-sessions finds all session files"
    (let [dir (temp-dir)]
      (try
        (let [_s1 (session/create "/tmp/test" dir)
              _s2 (session/create "/tmp/test" dir)
              sessions (session/list-sessions dir)]
          (is (>= (count sessions) 2)))
        (finally (cleanup! dir))))))
