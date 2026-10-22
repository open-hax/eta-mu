;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.law.review-intent
  "Portable laws for durable publication-intent transitions."
  (:require [clojure.string :as str]))

(def states #{:reserved :post-started :post-unknown :ambiguous-absence :observed})
(def active-states #{:reserved :post-started :post-unknown :ambiguous-absence})

(defn natural? [x] (and (integer? x) (<= 0 x 9007199254740991)))
(defn positive? [x] (and (natural? x) (pos? x)))
(defn text? [x] (and (string? x) (not (str/blank? x))))
(defn intent-key? [x] (and (vector? x) (= :review-publication/v1 (first x))))
(defn lock-key? [x]
  (and (vector? x) (= 3 (count x)) (positive? (first x))
       (string? (second x)) (re-matches #"(?:[0-9a-f]{40}|[0-9a-f]{64})" (second x))
       (text? (nth x 2))))

(defn binding? [x]
  (and (map? x) (intent-key? (:intent-key x)) (lock-key? (:lock-key x))))

(defn intent-event? [event]
  (let [data (:event/data event)]
    (and (map? event) (= :eta-mu.review-intent/transition (:event/type event))
         (text? (:event/stream event)) (positive? (:event/seq event))
         (vector? (:event/causes event))
         (map? data) (lock-key? (:lock-key data))
         (intent-key? (:intent-key data))
         (map? (:binding data)) (= (:lock-key data) (:lock-key (:binding data)))
         (= (:intent-key data) (:intent-key (:binding data)))
         (contains? states (:state data)) (natural? (:intent-version data))
         (or (nil? (:owner data)) (text? (:owner data)))
         (or (nil? (:claim-id data)) (text? (:claim-id data))))))
