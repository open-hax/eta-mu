(ns eta-mu.infra.session-test
  (:require [clojure.edn :as edn]
            [cljs.test :refer [deftest is testing use-fixtures]]
            [goog.object :as gobj]
            ["node:fs" :as node-fs]
            ["node:os" :as os]
            ["node:path" :as path]
            [eta-mu.extern.fs :as fs]
            [eta-mu.infra.session :as session]
            [eta-mu.law.session :as law]))

(def ^:private original-eta-mu-home (aget js/process.env "ETA_MU_HOME"))

(defn- fresh-home []
  (let [dir (path/join (os/tmpdir) (str "eta-mu-session-test-" (js/Date.now) "-"
                                        (.floor js/Math (* (.random js/Math) 1000000))))]
    (.mkdirSync node-fs dir #js {:recursive true})
    (aset js/process.env "ETA_MU_HOME" dir)
    dir))

(use-fixtures :each
  {:after #(if original-eta-mu-home
             (aset js/process.env "ETA_MU_HOME" original-eta-mu-home)
             (gobj/remove js/process.env "ETA_MU_HOME"))})

(def ^:private test-model {:id "gpt-4o-mini" :provider "openai"})

(deftest ^:async create-persists-artifact-test
  (testing "create! writes a valid EDN artifact under <home>/sessions"
    (let [home (fresh-home)
          state (await (session/create! {:model test-model :system-prompt "sys"}))
          artifact @state]
      (is (law/valid-artifact? artifact))
      (let [files (.readdirSync node-fs (path/join home "sessions"))]
        (is (= 1 (count files)))
        (is (= (str (:session-id artifact) ".edn") (first files))))
      (let [on-disk (edn/read-string (fs/read-file (path/join home "sessions"
                                                              (str (:session-id artifact) ".edn"))))]
        (is (= artifact on-disk))
        (is (law/valid-artifact? on-disk))))))

(deftest ^:async record-turn-appends-and-flushes-test
  (testing "record-turn! appends user + new messages and updates the file"
    (fresh-home)
    (let [state (await (session/create! {:model test-model :system-prompt "sys"}))
          user-message {:role :user :content "hi" :timestamp 1}
          assistant {:role :assistant :content [{:type :text :text "hello"}]
                     :api "a" :provider "openai" :model "gpt-4o-mini"
                     :usage {:input 0 :output 0 :cache-read 0 :cache-write 0 :total-tokens 0}
                     :stop-reason :stop :timestamp 2}]
      (await (session/record-turn! state user-message [assistant]))
      (is (= [user-message assistant] (:messages @state)))
      (let [reloaded (await (session/load-artifact (:session-id @state)))]
        (is (= @state reloaded))))))

(deftest ^:async resume-round-trip-test
  (testing "resume! by exact id and by unique prefix returns the stored session"
    (fresh-home)
    (let [state (await (session/create! {:model test-model :system-prompt "sys"}))
          session-id (:session-id @state)
          user-message {:role :user :content "remember" :timestamp 1}]
      (await (session/record-turn! state user-message []))
      (let [resumed (await (session/resume! session-id))]
        (is (= @state @resumed)))
      (let [resumed-by-prefix (await (session/resume! (subs session-id 0 12)))]
        (is (= session-id (:session-id @resumed-by-prefix)))))))

(deftest ^:async resume-unknown-id-throws-test
  (testing "resume! of an unknown id rejects with an informative error"
    (fresh-home)
    (let [error (try
                  (await (session/resume! "no-such-session"))
                  nil
                  (catch :default e e))]
      (is (some? error))
      (is (re-find #"No session" (.-message error))))))

(deftest ^:async ambiguous-prefix-throws-test
  (testing "resolve-session-id rejects a prefix matching multiple sessions"
    (let [home (fresh-home)
          dir (path/join home "sessions")]
      (.mkdirSync node-fs dir #js {:recursive true})
      (fs/write-file (path/join dir "shared-prefix-aaa.edn") "")
      (fs/write-file (path/join dir "shared-prefix-bbb.edn") "")
      (let [error (try
                    (await (session/resolve-session-id "shared-prefix"))
                    nil
                    (catch :default e e))]
        (is (some? error))
        (is (re-find #"Ambiguous" (.-message error)))))))

(deftest ^:async clear-empties-transcript-test
  (testing "clear! empties the transcript on disk"
    (fresh-home)
    (let [state (await (session/create! {:model test-model :system-prompt "sys"}))]
      (await (session/record-turn! state {:role :user :content "hi" :timestamp 1} []))
      (await (session/clear! state))
      (is (= [] (:messages @state)))
      (is (= [] (:messages (await (session/load-artifact (:session-id @state)))))))))

(deftest ^:async list-sessions-test
  (testing "list-sessions returns summaries newest-first and skips junk files"
    (let [home (fresh-home)
          dir (path/join home "sessions")
          base {:version 1 :cwd "/tmp" :model test-model :system-prompt "sys" :messages []}]
      (.mkdirSync node-fs dir #js {:recursive true})
      (fs/write-file (path/join dir "s-older.edn")
                     (str (pr-str (merge base {:session-id "s-older"
                                               :created-at "2026-07-15T00:00:00.000Z"
                                               :updated-at "2026-07-15T00:00:00.000Z"})) "\n"))
      (fs/write-file (path/join dir "s-newer.edn")
                     (str (pr-str (merge base {:session-id "s-newer"
                                               :created-at "2026-07-16T00:00:00.000Z"
                                               :updated-at "2026-07-16T00:00:00.000Z"})) "\n"))
      (fs/write-file (path/join dir "junk.edn") "not an artifact")
      (let [rows (await (session/list-sessions))]
        (is (= ["s-newer" "s-older"] (map :session-id rows)))
        (is (every? #(= 0 (:message-count %)) rows))))))
