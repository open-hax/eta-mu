;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.domain.review-archive
  "Portable admission of physically decoded ZIP facts; no supplied proof map
  or self-reported archive verdict can authorize the physical adapter."
  (:require [eta-mu.law.review-archive :as law]
            [eta-mu.shape.review-archive :as zip]
            [clojure.string :as str]))

(defn end-layout [ordinary locator zip64 size]
  (let [z64? (some? locator)
        end (if z64? zip64 ordinary)
        trailer (if z64? (:offset locator) (:offset ordinary))]
    (when (or (not= 0 (:disk ordinary) (:central-disk ordinary))
              (and (:zip64-required? ordinary) (not z64?))) (zip/refuse! :zip-multidisk-or-zip64))
    (when z64?
      (when-not (and (= 0 (:disk locator) (:disk zip64) (:central-disk zip64))
                     (= 1 (:disks locator)) (<= 44 (:record-size zip64)) (<= (:version zip64) 45)
                     (= (+ (:offset locator) 12 (:record-size zip64)) (- (:offset ordinary) 20)))
        (zip/refuse! :zip64-layout))
      (doseq [[key sentinel] [[:disk-count 65535] [:count 65535]
                              [:central-size 4294967295] [:central-offset 4294967295]]]
        (when-not (or (= sentinel (get ordinary key)) (= (get ordinary key) (get zip64 key)))
          (zip/refuse! :zip64-end-mismatch))))
    (when-not (and (= (:disk-count end) (:count end))
                   (= (+ (:central-offset end) (:central-size end)) trailer)
                   (<= 0 (:central-offset end) trailer size)) (zip/refuse! :zip-central-layout))
    (assoc end :trailer-offset trailer)))

(defn entries! [layout entries bounds required text-members]
  (when-not (and (= (:count layout) (count entries)) (<= (count entries) (:members bounds)))
    (zip/refuse! :zip-member-count))
  (doseq [{:keys [path flags method size compressed-size disk attributes version extra-ids name-bytes]} entries]
    (when-not (and (law/relative-path? path) (not (contains? extra-ids 28789))) (zip/refuse! :zip-path))
    (when (and (zero? (bit-and flags 2048)) (some #(> % 127) name-bytes)) (zip/refuse! :zip-name-encoding))
    (when-not (and (zero? disk) (<= 10 version 45)
                   (zero? (bit-and flags (bit-not 2062)))
                   (contains? #{0 8} method)
                   (or (= 8 method) (zero? (bit-and flags 6)))) (zip/refuse! :zip-feature))
    (let [type (bit-and (quot attributes 65536) 61440)
          directory? (str/ends-with? path "/")]
      (when-not (and (contains? #{0 32768 16384} type)
                     (if directory? (and (contains? #{0 16384} type) (zero? size) (zero? compressed-size))
                         (and (not= 16384 type) (zero? (bit-and attributes 16)))))
        (zip/refuse! :zip-member-type)))
    (when (> size (:member-bytes bounds)) (zip/refuse! :zip-member-bytes)))
  (when (> (reduce + 0 (map :size entries)) (:uncompressed-bytes bounds)) (zip/refuse! :zip-total-bytes))
  (let [aliases (map :alias entries)
        files (filterv #(not (str/ends-with? (:path %) "/")) entries)
        file-aliases (map :alias files)
        paths (set (map :path files))]
    (when-not (= (count aliases) (count (distinct aliases))) (zip/refuse! :zip-duplicate-path))
    (when (some (fn [alias] (some #(str/starts-with? alias (str % "/")) file-aliases)) aliases)
      (zip/refuse! :zip-file-directory-collision))
    (when-not (every? paths (concat required text-members)) (zip/refuse! :zip-required-members)))
  (let [ordered (vec (sort-by :local-offset entries))]
    (when (and (seq ordered) (not (zero? (:local-offset (first ordered))))) (zip/refuse! :zip-prefix))
    (mapv (fn [index entry]
            (assoc entry :next-offset (if (= (inc index) (count ordered))
                                        (:central-offset layout) (:local-offset (nth ordered (inc index))))))
          (range (count ordered)) ordered)))

(defn local! [central local descriptor]
  (when-not (= (select-keys central [:flags :method :time :date :name-bytes])
               (select-keys local [:flags :method :time :date :name-bytes])) (zip/refuse! :zip-local-mismatch))
  (when (or (> (:version local) 45) (contains? (:extra-ids local) 28789)) (zip/refuse! :zip-local-feature))
  (let [expected (select-keys central [:size :compressed-size :crc32])
        actual (select-keys local [:size :compressed-size :crc32])]
    (if (zero? (bit-and (:flags central) 8))
      (when (or descriptor (not= expected actual)) (zip/refuse! :zip-local-size-crc))
      (when-not (and (= expected descriptor)
                     (every? (fn [[k v]] (or (zero? v) (= v (get expected k)))) actual))
        (zip/refuse! :zip-descriptor-mismatch))))
  true)

(defn decoded! [entry decoded]
  (when-not (and (= (:size entry) (:size decoded))
                 (= (:compressed-size entry) (:consumed decoded))
                 (= (:crc32 entry) (:crc32 decoded)))
    (zip/refuse! :zip-decoded-size-crc))
  decoded)

(defn artifact! [expected actual now]
  (when-not (and (< now (:expires-at-ms expected))
                 (= (:size-bytes expected) (:size-bytes actual))
                 (= (:sha256 expected) (:sha256 actual)))
    (zip/refuse! :archive-native-binding)))

(defn time! [started now maximum]
  (when (or (< now started) (>= (- now started) maximum))
    (zip/refuse! :archive-operation-time)))
