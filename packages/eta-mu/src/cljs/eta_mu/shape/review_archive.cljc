;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.shape.review-archive
  "Portable ZIP record decoding over bounded byte vectors. Physical I/O and
  decompression are extern operations; publication policy is not inferred here.")

(def maximum-safe-integer 9007199254740991)
(defn refuse! [code] (throw (ex-info "Archive record refused" {:code code})))
(defn uint
  [bytes offset width]
  (when-not (and (integer? offset) (<= 0 offset) (<= (+ offset width) (count bytes)))
    (refuse! :zip-truncated))
  (let [n (reduce (fn [n i]
                    ;; Check each step before another multiplication can
                    ;; overflow a JVM long or lose JS integer precision.
                    (let [next (+ (* n 256) (nth bytes i))]
                      (when (> next maximum-safe-integer) (refuse! :zip-integer-range))
                      next))
                  0 (range (dec (+ offset width)) (dec offset) -1))]
    (when (> n maximum-safe-integer) (refuse! :zip-integer-range)) n))
(defn signature? [bytes offset signature]
  (and (<= (+ offset 4) (count bytes)) (= signature (uint bytes offset 4))))
(defn extra-fields [bytes]
  (loop [at 0 fields {}]
    (if (= at (count bytes)) fields
        (let [id (uint bytes at 2) size (uint bytes (+ at 2) 2) end (+ at 4 size)]
          (when (or (> end (count bytes)) (contains? fields id)) (refuse! :zip-extra-fields))
          (recur end (assoc fields id (subvec bytes (+ at 4) end)))))))
(defn- extended [fields raw fields-spec]
  (let [extra (get fields 1)]
    (loop [spec fields-spec at 0 out raw]
      (if-let [[key sentinel width] (first spec)]
        (if (= sentinel (get raw key))
          (do (when-not extra (refuse! :zip64-extra-missing))
              (recur (next spec) (+ at width) (assoc out key (uint extra at width))))
          (recur (next spec) at out))
        (do (when (and extra (not= at (count extra))) (refuse! :zip64-extra-layout)) out)))))
(defn end-record [tail archive-size]
  (let [base (- archive-size (count tail))
        matches (filterv (fn [at]
                           (and (signature? tail at 101010256)
                                (= (+ at 22 (uint tail (+ at 20) 2)) (count tail))))
                         (range (max 0 (inc (- (count tail) 22)))))]
    (when-not (= 1 (count matches)) (refuse! :zip-end-record))
    (let [at (first matches)
          result {:offset (+ base at) :disk (uint tail (+ at 4) 2)
                  :central-disk (uint tail (+ at 6) 2)
                  :disk-count (uint tail (+ at 8) 2) :count (uint tail (+ at 10) 2)
                  :central-size (uint tail (+ at 12) 4) :central-offset (uint tail (+ at 16) 4)}]
      (assoc result :zip64-required?
             (or (= 65535 (:disk-count result)) (= 65535 (:count result))
                 (= 4294967295 (:central-size result)) (= 4294967295 (:central-offset result)))))))
(defn zip64-locator [bytes]
  (when-not (and (= 20 (count bytes)) (signature? bytes 0 117853008)) (refuse! :zip64-locator))
  {:disk (uint bytes 4 4) :offset (uint bytes 8 8) :disks (uint bytes 16 4)})
(defn zip64-end [bytes]
  (when-not (and (>= (count bytes) 56) (signature? bytes 0 101075792)) (refuse! :zip64-end))
  {:record-size (uint bytes 4 8) :version (uint bytes 14 2)
   :disk (uint bytes 16 4) :central-disk (uint bytes 20 4)
   :disk-count (uint bytes 24 8) :count (uint bytes 32 8)
   :central-size (uint bytes 40 8) :central-offset (uint bytes 48 8)})
(defn central-records [bytes max-members]
  (loop [at 0 records []]
    (if (= at (count bytes)) records
        (do
          (when (>= (count records) max-members) (refuse! :zip-member-count))
          (when-not (signature? bytes at 33639248) (refuse! :zip-central-header))
          (let [name-size (uint bytes (+ at 28) 2) extra-size (uint bytes (+ at 30) 2)
                comment-size (uint bytes (+ at 32) 2) name-at (+ at 46)
                extra-at (+ name-at name-size) end (+ extra-at extra-size comment-size)]
            (when (> end (count bytes)) (refuse! :zip-truncated))
            (let [fields (extra-fields (subvec bytes extra-at (+ extra-at extra-size)))
                  raw {:size (uint bytes (+ at 24) 4) :compressed-size (uint bytes (+ at 20) 4)
                       :local-offset (uint bytes (+ at 42) 4) :disk (uint bytes (+ at 34) 2)}
                  record (merge (extended fields raw [[:size 4294967295 8] [:compressed-size 4294967295 8]
                                                      [:local-offset 4294967295 8] [:disk 65535 4]])
                                {:version (uint bytes (+ at 6) 2) :flags (uint bytes (+ at 8) 2)
                                 :method (uint bytes (+ at 10) 2) :time (uint bytes (+ at 12) 2)
                                 :date (uint bytes (+ at 14) 2) :crc32 (uint bytes (+ at 16) 4)
                                 :attributes (uint bytes (+ at 38) 4) :extra-ids (set (keys fields))
                                 :name-bytes (subvec bytes name-at extra-at)})]
              (recur end (conj records record))))))))
(defn local-record [bytes]
  (when-not (signature? bytes 0 67324752) (refuse! :zip-local-header))
  (let [n (uint bytes 26 2) e (uint bytes 28 2) end (+ 30 n e)]
    (when-not (= end (count bytes)) (refuse! :zip-local-length))
    (let [fields (extra-fields (subvec bytes (+ 30 n) end))
          raw {:size (uint bytes 22 4) :compressed-size (uint bytes 18 4)}]
      (merge (extended fields raw [[:size 4294967295 8] [:compressed-size 4294967295 8]])
             {:version (uint bytes 4 2) :flags (uint bytes 6 2) :method (uint bytes 8 2)
              :time (uint bytes 10 2) :date (uint bytes 12 2) :crc32 (uint bytes 14 4)
              :header-size end :extra-ids (set (keys fields))
              :name-bytes (subvec bytes 30 (+ 30 n))}))))
(defn descriptor [bytes]
  (let [[offset width] (case (count bytes) 12 [0 4] 16 [4 4] 20 [0 8] 24 [4 8]
                           (refuse! :zip-descriptor-length))]
    (when (and (= 4 offset) (not (signature? bytes 0 134695760))) (refuse! :zip-descriptor-signature))
    {:crc32 (uint bytes offset 4) :compressed-size (uint bytes (+ offset 4) width)
     :size (uint bytes (+ offset 4 width) width)}))
