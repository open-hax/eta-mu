(ns eta-mu.domain.session-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.domain.session :as session]))

(deftest paths-test
  (testing "session paths resolve under the eta-mu home"
    (is (= "/home/u/.eta-mu/sessions" (session/sessions-dir "/home/u/.eta-mu")))
    (is (= "/home/u/.eta-mu/sessions/abc.edn" (session/session-file "/home/u/.eta-mu" "abc")))))

(deftest new-session-id-test
  (testing "id format is yyyyMMdd-HHmmss-<rand> in UTC"
    (let [date (js/Date. "2026-07-16T04:05:06Z")]
      (is (= "20260716-040506-a1b2c3" (session/new-session-id date "a1b2c3"))))))

(deftest new-artifact-test
  (testing "a fresh artifact starts at version 1 with an empty transcript"
    (let [artifact (session/new-artifact {:session-id "s1"
                                          :cwd "/tmp"
                                          :model {:id "m" :provider "p"}
                                          :system-prompt "sys"
                                          :now-iso "2026-07-16T00:00:00.000Z"})]
      (is (= 1 (:version artifact)))
      (is (= "s1" (:session-id artifact)))
      (is (= [] (:messages artifact)))
      (is (= (:created-at artifact) (:updated-at artifact))))))

(deftest append-turn-test
  (testing "appending a turn adds the user message then the new messages"
    (let [artifact (session/new-artifact {:session-id "s1" :cwd "/tmp"
                                          :model {:id "m" :provider "p"}
                                          :system-prompt "sys"
                                          :now-iso "t0"})
          user-message {:role :user :content "hi" :timestamp 1}
          assistant {:role :assistant :content [{:type :text :text "yo"}]
                     :api "a" :provider "p" :model "m"
                     :usage {:input 0 :output 0 :cache-read 0 :cache-write 0 :total-tokens 0}
                     :stop-reason :stop :timestamp 2}
          updated (session/append-turn artifact user-message [assistant] "t1")]
      (is (= [user-message assistant] (:messages updated)))
      (is (= "t1" (:updated-at updated)))
      (is (= "t0" (:created-at updated))))))

(deftest clear-messages-test
  (testing "clearing empties the transcript and bumps updated-at"
    (let [artifact {:messages [{:role :user :content "hi" :timestamp 1}] :updated-at "t0"}
          cleared (session/clear-messages artifact "t1")]
      (is (= [] (:messages cleared)))
      (is (= "t1" (:updated-at cleared))))))

(deftest artifact->context-test
  (testing "context rebuild keeps transcript and system prompt, attaches live tools"
    (let [artifact {:system-prompt "sys" :messages [{:role :user :content "hi" :timestamp 1}]}
          tools [{:name "read"}]
          ctx (session/artifact->context artifact tools)]
      (is (= "sys" (:system-prompt ctx)))
      (is (= 1 (count (:messages ctx))))
      (is (= tools (:tools ctx))))))

(deftest summary-test
  (testing "summary projects the listing row and previews the first user message"
    (let [artifact {:session-id "s1"
                    :updated-at "t1"
                    :model {:id "m" :provider "p"}
                    :cwd "/tmp"
                    :messages [{:role :user :content "remember this" :timestamp 1}]}
          row (session/summary artifact)]
      (is (= "s1" (:session-id row)))
      (is (= "m" (:model row)))
      (is (= 1 (:message-count row)))
      (is (= "remember this" (:preview row)))))
  (testing "long previews truncate at 60 characters"
    (let [long-content (apply str (repeat 100 "x"))
          artifact {:session-id "s1" :updated-at "t1" :model {:id "m"}
                    :cwd "/tmp" :messages [{:role :user :content long-content :timestamp 1}]}
          row (session/summary artifact)]
      (is (= 60 (count (:preview row)))))))
