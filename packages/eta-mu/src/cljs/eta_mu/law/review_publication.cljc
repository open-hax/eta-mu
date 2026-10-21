;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.law.review-publication
  "Portable data contracts for the trusted publisher. These predicates do not
  collect native facts, verify archives/traces, acquire claims, or grant authority."
  (:require [clojure.string :as str]))

(def context "eta-mu/trusted-review-publication-v1")
(def publisher-app-id 3152464)
(def default-refresh-ms 86400000)
(def maximum-refresh-ms 518400000) ; Six days leaves a margin below seven.
(def maximum-safe-integer 9007199254740991)

(defn natural? [x]
  (and (integer? x) (<= 0 x maximum-safe-integer)))
(defn positive? [x] (and (natural? x) (pos? x)))
(defn text? [x] (and (string? x) (not (str/blank? x))))
(defn commit? [x] (and (string? x) (boolean (re-matches #"(?:[0-9a-f]{40}|[0-9a-f]{64})" x))))
(defn digest? [x] (and (string? x) (boolean (re-matches #"[0-9a-f]{64}" x))))
(defn https-url? [x]
  (and (string? x) (boolean (re-matches #"https://[^\s/@]+/[^\s]*" x))))
(defn repository? [x]
  (and (positive? (:id x)) (boolean? (:public? x))
       (string? (:full-name x))
       (boolean (re-matches #"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+" (:full-name x)))))
(defn actor? [x]
  (and (positive? (:id x)) (text? (:login x)) (= :bot (:type x))))
(defn publisher? [x]
  (and (= publisher-app-id (:app-id x)) (actor? (:actor x))))
(defn sources? [x]
  (and (every? #(commit? (get x %)) [:caller :eta :muse])
       (every? #(digest? (get x %)) [:verifier :build])))
(defn tuple? [x]
  (and (positive? (:pr-number x))
       (every? #(commit? (get x %))
               [:base-sha :head-sha :event-sha :merge-sha :head-tree :merge-tree])
       (vector? (:merge-parents x)) (= 2 (count (:merge-parents x)))
       (every? commit? (:merge-parents x))
       (contains? #{true false :unknown} (:mergeable? x))
       (boolean? (:base-ancestor? x))
       (contains? #{:open :closed} (:state x)) (boolean? (:draft? x))))
(defn commands? [xs]
  (and (vector? xs) (seq xs) (= (count xs) (count (distinct xs)))
       (every? #(and (vector? %) (seq %) (every? text? %)) xs)))
(defn workflow? [x]
  (and (positive? (:id x)) (text? (:path x)) (commit? (:source-sha x))
       (vector? (:required-jobs x)) (seq (:required-jobs x))
       (every? text? (:required-jobs x))
       (= (count (:required-jobs x)) (count (distinct (:required-jobs x))))
       (commands? (:commands x))))
(defn setup? [x]
  (and (positive? (:repository-id x)) (commit? (:default-sha x))
       (every? #(digest? (get x %)) [:proof :custody-proof :protection-proof])
       (= publisher-app-id (:app-id x))
       (set? (:permissions x))
       (every? (:permissions x) [:statuses-write :pull-requests-write])))
(defn proof? [x] (and (commit? (:source-sha x)) (digest? (:sha256 x))))
(defn status-policy? [x]
  (and (positive? (:max-writes x))
       (positive? (get x :refresh-ms default-refresh-ms))
       (<= (get x :refresh-ms default-refresh-ms) maximum-refresh-ms)))
(defn entry? [x]
  (and (repository? (:repository x)) (boolean? (:enabled? x))
       (boolean? (:fixture? x)) (workflow? (:producer x))
       (sources? (:sources x)) (publisher? (:publisher x)) (setup? (:setup x))
       (or (:fixture? x) (proof? (:hosted-proof x)))
       (status-policy? (:status-policy x))))
(defn registry? [x]
  (and (commit? (:source-sha x)) (vector? (:targets x))
       (every? entry? (:targets x))
       (= (count (:targets x)) (count (distinct (map #(get-in % [:repository :id]) (:targets x)))))))
(defn job? [x]
  (and (positive? (:id x)) (text? (:name x))
       (= :completed (:status x)) (= :success (:conclusion x))))
(defn run? [x]
  (and (positive? (:id x)) (positive? (:attempt x)) (positive? (:workflow-id x))
       (text? (:workflow-path x)) (commit? (:workflow-source-sha x))
       (every? #(commit? (get x %)) [:base-sha :head-sha :event-sha])
       (= :completed (:status x)) (= :success (:conclusion x))
       (vector? (:jobs x)) (seq (:jobs x)) (every? job? (:jobs x))
       (= (count (:jobs x)) (count (distinct (map :name (:jobs x)))))
       (= (count (:jobs x)) (count (distinct (map :id (:jobs x)))))
       (commands? (:commands x))))
(defn archive-proof? [x]
  (and (= :trusted-archive-verifier (:origin x)) (= :verified (:result x))
       (digest? (:sha256 x)) (positive? (:artifact-id x))
       (every? #(positive? (get-in x [:bounds %]))
               [:download-bytes :members :member-bytes :uncompressed-bytes :operation-ms :decode-ms])
       (natural? (:completed-at-ms x))))
(defn artifact? [x]
  (and (positive? (:id x)) (positive? (:run-id x)) (positive? (:attempt x))
       (positive? (:size-bytes x)) (digest? (:sha256 x))
       (natural? (:expires-at-ms x)) (archive-proof? (:archive-proof x))))
(defn comment? [x]
  (and (map? x) (text? (:path x)) (positive? (:line x))
       (contains? #{"LEFT" "RIGHT"} (:side x)) (text? (:body x))))
(defn submission? [x]
  (and (contains? #{"APPROVE" "COMMENT" "REQUEST_CHANGES"} (:event x))
       (text? (:body x)) (vector? (:comments x)) (every? comment? (:comments x))))
(defn verification? [x]
  (and (= :trusted-independent-verifier (:origin x)) (= :verified (:result x))
       (sources? (:sources x)) (tuple? (:tuple x))
       (positive? (:artifact-id x)) (digest? (:artifact-sha256 x))
       (positive? (:run-id x)) (positive? (:attempt x))
       (every? #(digest? (get x %))
               [:full-input :input-verification :trace :submission :invocation :discovery :context])
       (submission? (:submission-envelope x))
       (positive? (:page-count x)) (= (:page-count x) (:verified-page-count x))
       (natural? (:completed-at-ms x))))
(defn claim? [x]
  (and (= :trusted-durable-store (:origin x)) (= :won (:outcome x))
       (= :claim-review-post (:operation x))
       (vector? (:intent-key x)) (vector? (:lock-key x))
       (text? (:owner x)) (text? (:claim-id x))
       (positive? (:version x)) (natural? (:previous-version x))
       (= (:version x) (inc (:previous-version x)))))
(defn native-status? [x]
  (and (positive? (:id x)) (publisher? (:publisher x))
       (commit? (:sha x)) (text? (:context x))
       (contains? #{:pending :success :failure :error} (:state x))
       (https-url? (:receipt-url x)) (natural? (:created-at-ms x))))
(defn status-history? [x]
  (and (= :trusted-native-status-history (:origin x))
       (true? (:complete? x)) (natural? (:observed-at-ms x))
       (vector? (:statuses x)) (every? native-status? (:statuses x))
       (= (count (:statuses x)) (count (distinct (map :id (:statuses x)))))
       (contains? #{:none :observed :unknown} (:last-write-outcome x))))
