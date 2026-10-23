;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.law.review-collection
  "Portable contracts for bounded read-only native review observations."
  (:require [eta-mu.law.review-publication :as publication]
            [clojure.string :as str]))

(def hard-bounds {:requests 160 :pages 64 :bytes 8000000 :page-size 100 :operation-ms 30000})
(def maximum-pull-files 3000)
(defn bounds? [x]
  (and (map? x)
       (every? (fn [[k maximum]]
                 (let [n (get x k)] (and (publication/positive? n) (<= n maximum))))
               hard-bounds)))

(defn native-repository? [x] (publication/repository? x))
(defn raw-repository? [x]
  (and (map? x) (publication/positive? (:id x))
       (publication/text? (:full_name x)) (boolean? (:private x))))
(defn complete-pages? [x]
  (and (map? x) (publication/positive? (:pages x))
       (= (:pages x) (:received x)) (false? (:next? x))))

(defn pagination-link?
  "Validate a GitHub Link target as data. The caller always rebuilds the next
  request from its local fixed route; a supplied URL is never fetched."
  [link repository-id route page page-size]
  (let [{:keys [scheme host port username password fragment path query-pairs] :as parsed}
        link
        base-route (str/replace route #"^https://api\.github\.com" "")
        suffix (second (re-matches #"/repos/[^/]+/[^/]+(.*)" base-route))
        id-route (when (and (publication/positive? repository-id) suffix)
                   (str "/repositories/" repository-id suffix))
        pairs (when (vector? query-pairs) query-pairs)
        keys (mapv first pairs)]
    (and parsed
         (= "https" (str/lower-case (or scheme "")))
         (= "api.github.com" (str/lower-case (or host "")))
         (or (nil? port) (= "" port))
         (or (nil? username) (= "" username))
         (or (nil? password) (= "" password))
         (or (nil? fragment) (= "" fragment))
         (or (= path base-route) (= path id-route))
         (= 2 (count pairs)) (= #{"page" "per_page"} (set keys))
         (= 1 (count (filter #(= "page" (first %)) pairs)))
         (= 1 (count (filter #(= "per_page" (first %)) pairs)))
         (= (str (inc page)) (second (first (filter #(= "page" (first %)) pairs))))
         (= (str page-size) (second (first (filter #(= "per_page" (first %)) pairs)))))))

(defn native-run? [x]
  (and (map? x) (publication/positive? (:id x))
       (publication/positive? (:attempt x)) (publication/positive? (:repository-id x))
       (publication/positive? (:workflow-id x)) (publication/text? (:workflow-path x))
       (publication/commit? (:head-sha x)) (publication/commit? (:base-sha x))
       (publication/commit? (:event-sha x)) (publication/positive? (:pr-number x))))

(defn raw-run? [x]
  (and (map? x) (publication/positive? (:id x))
       (publication/positive? (:run_attempt x))
       (raw-repository? (:repository x))
       (publication/positive? (:workflow_id x))
       (publication/commit? (:head_sha x))
       (string? (:status x)) (or (nil? (:conclusion x)) (string? (:conclusion x)))))

(defn raw-job? [x run-id attempt]
  (and (map? x) (publication/positive? (:id x))
       (= run-id (:run_id x)) (= attempt (:run_attempt x)) (publication/text? (:name x))
       (string? (:status x)) (string? (:conclusion x))))

(defn native-artifact? [x]
  (and (map? x) (publication/positive? (:id x)) (publication/positive? (:run-id x))
       (publication/positive? (:size-bytes x)) (publication/natural? (:expires-at-ms x))
       (publication/digest? (:sha256 x)) (false? (:expired? x))))

(defn raw-artifact? [x]
  (and (map? x) (publication/positive? (:id x))
       (publication/text? (:name x)) (publication/positive? (:size_in_bytes x))
       (string? (:created_at x)) (string? (:expires_at x))
       (boolean? (:expired x))
       (string? (:digest x))))

(def pull-file-statuses #{"added" "modified" "removed" "renamed" "copied" "changed" "unchanged"})
(defn raw-pull-file? [x]
  (and (map? x) (publication/commit? (:sha x))
       (publication/text? (:filename x))
       (contains? pull-file-statuses (:status x))
       (every? publication/natural? ((juxt :additions :changes :deletions) x))
       (every? publication/text? ((juxt :blob_url :contents_url :raw_url) x))
       (or (not (contains? x :patch)) (nil? (:patch x)) (string? (:patch x)))
       (or (not (contains? x :previous_filename))
           (and (publication/text? (:previous_filename x))
                (not= (:filename x) (:previous_filename x))))))

(defn changed-file-count? [x]
  (and (integer? x) (<= 0 x maximum-pull-files)))

(defn unique-pull-files? [files expected-count]
  (and (vector? files) (= expected-count (count files))
       (every? raw-pull-file? files)
       (= (count files) (count (set (map :filename files))))))

(defn request? [x]
  (and (map? x) (= :get (:method x))
       (string? (:url x))
       (boolean (re-matches
                 #"https://api\.github\.com/repos/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+(?:/(?:pulls/[1-9][0-9]*(?:/files\?per_page=(?:[1-9]|[1-9][0-9]|100)&page=[1-9][0-9]*|/reviews/[1-9][0-9]*(?:/comments\?per_page=(?:[1-9]|[1-9][0-9]|100)&page=[1-9][0-9]*)?)?|git/ref/(?:heads/[A-Za-z0-9_./-]+|pull/[1-9][0-9]*/merge)|commits/[0-9a-f]{40,64}(?:/statuses\?per_page=(?:[1-9]|[1-9][0-9]|100)&page=[1-9][0-9]*)?|compare/[0-9a-f]{40,64}\.\.\.[0-9a-f]{40,64}|actions/runs/[1-9][0-9]*(?:/(?:artifacts(?:\?per_page=(?:[1-9]|[1-9][0-9]|100)&page=[1-9][0-9]*)?|attempts/[1-9][0-9]*(?:/jobs(?:\?per_page=(?:[1-9]|[1-9][0-9]|100)&page=[1-9][0-9]*)?)?))?|actions/workflows/[1-9][0-9]*))?"
                 (:url x)))))

(defn registry-target [registry target-id]
  (when (and (publication/registry? registry)
             (publication/commit? (:source-sha registry)))
    (first (filter #(= target-id (get-in % [:repository :id])) (:targets registry)))))
