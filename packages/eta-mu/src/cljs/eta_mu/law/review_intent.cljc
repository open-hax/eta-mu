;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.law.review-intent
  "Portable laws for durable publication-intent transitions."
  (:require [clojure.string :as str]))

(def states #{:reserved :post-started :post-unknown :ambiguous-absence :observed})
(def active-states #{:reserved :post-started :post-unknown :ambiguous-absence})

(defn natural? [x]
  (and #?(:cljs (and (number? x) (js/Number.isSafeInteger x))
          :clj (and (number? x)
                    (or (integer? x)
                        (and (float? x)
                             (Double/isFinite (double x))
                             (= x (Math/floor (double x)))))))
       (<= 0 x 9007199254740991)))
(defn positive? [x] (and (natural? x) (pos? x)))
(defn canonical-natural [x]
  (when (natural? x)
    #?(:cljs (js/Math.trunc x) :clj (long x))))
(defn text? [x] (and (string? x) (not (str/blank? x))))
(defn portable-equal?
  "Compare portable values with cross-runtime numeric equality. JVM `=` distinguishes
  integral doubles from integers while ClojureScript uses one numeric type; publisher
  identity and replay therefore compare numeric leaves with `==` recursively."
  [a b]
  (cond
    (and (number? a) (number? b)) (== a b)
    (and (map? a) (map? b))
    (and (= (count a) (count b))
         (loop [left (seq a), unmatched (vec b)]
           (if-let [[key value] (first left)]
             (if-let [index (first (keep-indexed
                                   (fn [i [other-key other-value]]
                                     (when (and (portable-equal? key other-key)
                                                (portable-equal? value other-value)) i))
                                   unmatched))]
               (recur (next left) (into (subvec unmatched 0 index)
                                        (subvec unmatched (inc index))))
               false)
             (empty? unmatched))))
    (and (set? a) (set? b))
    (and (= (count a) (count b))
         (loop [left (seq a), unmatched (vec b)]
           (if-let [value (first left)]
             (if-let [index (first (keep-indexed
                                   (fn [i other]
                                     (when (portable-equal? value other) i))
                                   unmatched))]
               (recur (next left) (into (subvec unmatched 0 index)
                                        (subvec unmatched (inc index))))
               false)
             (empty? unmatched))))
    (and (sequential? a) (sequential? b))
    (and (= (count a) (count b)) (every? true? (map portable-equal? a b)))
    :else (= a b)))

(defn intent-key? [x] (and (vector? x) (= :review-publication/v1 (first x))))
(defn lock-key? [x]
  (and (vector? x) (= 3 (count x)) (positive? (first x))
       (string? (second x)) (re-matches #"^(?:[0-9a-f]{40}|[0-9a-f]{64})$" (second x))
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
         (map? (:binding data)) (portable-equal? (:lock-key data) (:lock-key (:binding data)))
         (portable-equal? (:intent-key data) (:intent-key (:binding data)))
         (contains? states (:state data)) (natural? (:intent-version data))
         (or (nil? (:owner data)) (text? (:owner data)))
         (or (nil? (:claim-id data)) (text? (:claim-id data))))))
