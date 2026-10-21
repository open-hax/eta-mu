;; SPDX-License-Identifier: GPL-3.0-or-later
(ns opencode-review-collection-test
  "Causal inert controls for the read-only native metadata collector."
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.law.review-collection :as law]
            [eta-mu.infra.review-collection :as collection]))

(defn sha [c] (apply str (repeat 40 c)))
(def registry {:source-sha (sha "a") :targets [{:repository {:id 41 :full-name "owner/repo" :public? true}
                                                  :enabled? false :fixture? false}]})
(defn run!test [registry transport]
  (collection/collect-with! {:registry registry :target-id 41 :pr-number 7 :run-id 99
                             :mode :ordinary :event :schedule :bounds {:requests 50 :pages 20 :bytes 100000
                                                                       :page-size 100 :operation-ms 2000}}
                            transport))

(deftest disabled-target-refuses-before-any-native-read
  (let [calls (atom [])
        result (run!test registry (fn [request] (swap! calls conj request) {}))]
    (is (= :refused (:status result)))
    (is (= :enrollment (:reason result)))
    (is (empty? @calls))))

(deftest accepted-source-native-shapes-reject-incomplete-or-conflicting-facts
  (is (law/native-repository? {:id 41 :full-name "owner/repo" :public? true}))
  (is (not (law/native-repository? {:id 42 :full-name "owner/repo" :public? true})))
  (is (not (law/native-run? {:id 99 :attempt 1 :repository-id 42})))
  (is (not (law/complete-pages? {:pages 2 :received 1 :next? true})))
  (is (not (law/native-artifact? {:id 12 :run-id 99 :size-bytes 3 :expired? true}))))

(deftest source-preflight-refuses-malformed-registry-without-transport
  (let [calls (atom 0)
        result (run!test (assoc registry :targets [{:repository {:id 41}}])
                         (fn [_] (swap! calls inc) {}))]
    (is (= :refused (:status result)))
    (is (= :registry (:reason result)))
    (is (zero? @calls))))

(deftest transport-request-law-rejects-injected-url-and-non-get
  (is (law/request? {:method :get :url "https://api.github.com/repos/owner/repo/pulls/7"}))
  (is (not (law/request? {:method :post :url "https://api.github.com/repos/owner/repo/pulls/7"})))
  (is (not (law/request? {:method :get :url "https://evil.invalid/repos/owner/repo/pulls/7"})))
  (is (not (law/request? {:method :get :url "https://api.github.com/repos/owner/repo/pulls/7?redirect=https://evil.invalid"}))))
