(ns axxium.infra.identity-ceremonies-test
  (:require [axxium.extern.identity-host :as host]
            [axxium.infra.identity :as identity]
            [axxium.infra.identity-ceremonies :as ceremonies]
            [axxium.infra.identity-store :as store]
            [cljs.test :refer [deftest is]]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]))

(defn- options [directory]
  {:provider :edn :directory directory :public-base-url "http://localhost:8787"})
(defn- failure [run] (try (run) nil (catch :default error (:code (ex-data error)))))
(defn- blob-count [directory]
  (count (array-seq (fs/readdirSync (str directory "/private/ceremonies")))))

(deftest abandoned-ceremonies-have-durable-volume-and-retention-bounds
  (let [directory (fs/mkdtempSync (path/join (os/tmpdir) "axxium-retention-"))
        clock (atom 1000000)]
    (try
      (with-redefs [host/now #(deref clock)]
        (let [service (identity/open! (options directory))
              issue #(identity/challenge! service (host/random-token) :oauth/github {:nonce "private-value"})]
          (dotimes [_ 64] (issue))
          (let [before (fs/readFileSync (str directory "/ceremonies.edn") "utf8")
                reopened (identity/open! (options directory))]
            (dotimes [_ 100]
              (is (= :ceremony-rate-limit
                     (failure #(identity/challenge! reopened (host/random-token) :oauth/github {})))))
            (is (= before (fs/readFileSync (str directory "/ceremonies.edn") "utf8"))
                "Rejected requests must not append or replace stored state")
            (is (= 64 (blob-count directory)))
            (is (empty? (:canonical/events (store/history (:store reopened)))))
            (is (not (.includes before "private-value"))))
          (swap! clock + (inc identity/challenge-ttl-ms))
          (let [id (issue)]
            (is (= 1 (blob-count directory)) "Expired blobs are actually collected")
            (is (= 1 (count (:challenges (store/state (:store service))))))
            (is (= id (first (keys (ceremonies/entries (:store service))))))
            (is (< (.-size (fs/statSync (str directory "/ceremonies.edn"))) 4096)
                "Checkpoint compaction removes old unauthenticated history"))))
      (finally (fs/rmSync directory #js {:recursive true :force true})))))

(deftest browser-limit-and-payload-limit-refuse-before-allocation
  (let [service (identity/open! {:provider :memory :public-base-url "http://localhost"})
        browser (host/random-token)]
    (dotimes [_ 8] (identity/challenge! service browser :passkey-login {}))
    (is (= :ceremony-rate-limit (failure #(identity/challenge! service browser :passkey-login {}))))
    (is (= :invalid-challenge
           (failure #(identity/challenge! service (host/random-token) :passkey-login {:data (apply str (repeat 65537 "x"))}))))
    (is (= 8 (count @(:private (:store service)))))
    (is (empty? (:canonical/events (store/history (:store service)))))))

(deftest ^:async consumed-challenges-stay-consumed-after-checkpoint-restart
  (let [directory (fs/mkdtempSync (path/join (os/tmpdir) "axxium-consumed-"))]
    (try
      (let [service (identity/open! (options directory))
            browser (host/random-token)
            id (identity/challenge! service browser :oauth/github {})
            result (identity/accept-external! service browser id :oauth/github
                                               {:issuer "https://github.com" :subject "bound-subject" :display-name "Alice"})
            reopened (identity/open! (options directory))]
        (is (= (:principal result) (identity/resolve-principal reopened (:token result))))
        (is (= :invalid-challenge (failure #(identity/read-challenge reopened browser id :oauth/github))))
        (is (= 1 (count (:canonical/events (store/history (:store reopened)))))
            "Acceptance and consumption are one durable identity fact"))
      (finally (fs/rmSync directory #js {:recursive true :force true})))))
