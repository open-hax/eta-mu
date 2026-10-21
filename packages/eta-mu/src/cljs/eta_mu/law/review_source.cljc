;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.law.review-source
  "Portable contracts for reconstructing the full immutable review input."
  (:require [eta-mu.law.review-publication :as publication]))

(def maximum-output-bytes 67108864)
(def maximum-operation-ms 120000)

(defn tuple? [x]
  (and (map? x)
       (every? #(publication/commit? (get x %)) [:base-sha :head-sha :merge-sha :head-tree :merge-tree])
       (vector? (:merge-parents x)) (= 2 (count (:merge-parents x)))
       (every? publication/commit? (:merge-parents x))
       (boolean? (:base-ancestor? x))
       (or (nil? (:event-sha x)) (publication/commit? (:event-sha x)))))

(defn bounds? [x]
  (and (map? x)
       (publication/positive? (:output-bytes x))
       (<= (:output-bytes x) maximum-output-bytes)
       (publication/positive? (:operation-ms x))
       (<= (:operation-ms x) maximum-operation-ms)))

(defn manifest? [x]
  (and (map? x)
       (= "open-hax.review-input/v1" (:schema x))
       (publication/commit? (:base_sha x))
       (publication/commit? (:head_sha x))
       (publication/commit? (:diff_base_sha x))
       (map? (:full_diff x))
       (= "basehead.diff" (get-in x [:full_diff :path]))
       (publication/natural? (get-in x [:full_diff :bytes]))
       (publication/digest? (get-in x [:full_diff :sha256]))
       (map? (:provenance x))))

(defn native-context? [x]
  (and (map? x)
       (publication/text? (:repository x))
       (publication/positive? (:pr-number x))
       (publication/positive? (:run-id x))
       (publication/positive? (:run-attempt x))))

(defn archive-diff? [x]
  (and (map? x)
       (string? (:base64 x))
       (publication/natural? (:size x))
       (publication/digest? (:sha256 x))))

(def archive-preview? archive-diff?)

(defn request? [x]
  (and (map? x)
       (publication/text? (:object-store x))
       (tuple? (:tuple x))
       (manifest? (:manifest x))
       (archive-diff? (:archive-diff x))
       (archive-preview? (:archive-preview x))
       (native-context? (:native-context x))
       (bounds? (:bounds x))))

(defn topology? [x]
  (and (tuple? x)
       (= [(:base-sha x) (:head-sha x)] (:merge-parents x))
       (= (:head-tree x) (:merge-tree x))
       (true? (:base-ancestor? x))))
