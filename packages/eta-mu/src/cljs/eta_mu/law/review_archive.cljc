;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.law.review-archive
  "Physical artifact admission contracts. Configured limits come from trusted
  publication configuration; no missing limit has an unlimited default."
  (:require [eta-mu.law.review-publication :as publication]
            [clojure.string :as str]))

(def bound-keys
  [:download-bytes :members :member-bytes :uncompressed-bytes :operation-ms :decode-ms])

(defn bounds? [x]
  (and (map? x) (every? #(publication/positive? (get x %)) bound-keys)))

(defn native-artifact? [x]
  (and (every? #(publication/positive? (get x %)) [:id :run-id :attempt :size-bytes])
       (publication/digest? (:sha256 x)) (publication/natural? (:expires-at-ms x))))

(defn relative-path? [path]
  (and (publication/text? path)
       (not (str/starts-with? path "/"))
       (not (re-find #"[\\:\x00-\x1f\x7f]" path))
       (let [parts (str/split (str/replace path #"/$" "") #"/" -1)]
         (every? #(and (seq %) (not (contains? #{"." ".."} %))
                       (not (re-find #"[. ]$" %))) parts))))

(defn request? [x]
  (and (publication/text? (:path x)) (bounds? (:bounds x))
       (native-artifact? (:artifact x))
       (vector? (:required-members x)) (seq (:required-members x))
       (every? relative-path? (:required-members x))
       (= (count (:required-members x)) (count (distinct (:required-members x))))
       (vector? (:text-members x)) (every? relative-path? (:text-members x))
       (= (count (:text-members x)) (count (distinct (:text-members x))))))
