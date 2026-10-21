;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.law.review-collection
  "Portable contracts for bounded read-only native review observations."
  (:require [eta-mu.law.review-publication :as publication]))

(def hard-bounds {:requests 160 :pages 64 :bytes 8000000 :page-size 100 :operation-ms 30000})
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

(defn request? [x]
  (and (map? x) (= :get (:method x))
       (string? (:url x))
       (boolean (re-matches
                 #"https://api\.github\.com/repos/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+(?:/(?:pulls/[1-9][0-9]*|git/ref/(?:heads/[A-Za-z0-9_./-]+|pull/[1-9][0-9]*/merge)|commits/[0-9a-f]{40,64}|compare/[0-9a-f]{40,64}\.\.\.[0-9a-f]{40,64}|actions/runs/[1-9][0-9]*(?:/(?:artifacts(?:\?per_page=(?:[1-9]|[1-9][0-9]|100)&page=[1-9][0-9]*)?|attempts/[1-9][0-9]*(?:/jobs(?:\?per_page=(?:[1-9]|[1-9][0-9]|100)&page=[1-9][0-9]*)?)?))?|actions/workflows/[1-9][0-9]*))?"
                 (:url x)))))

(defn registry-target [registry target-id]
  (when (and (publication/registry? registry)
             (publication/commit? (:source-sha registry)))
    (first (filter #(= target-id (get-in % [:repository :id])) (:targets registry)))))
