;; SPDX-License-Identifier: GPL-3.0-or-later
(ns opencode-review-archive-test
  "Actual physical ZIP bytes; no native collector, review or deployment credit."
  (:require [cljs.test :as test :refer [deftest is async]]
            [nbb.core :as nbb]
            [eta-mu.law.review-archive :as law]
            ["node:fs" :as fs] ["node:path" :as path] ["node:os" :as os]
            ["node:crypto" :as crypto] ["node:zlib" :as zlib]))

(defn hash-bytes [b] (.digest (.update (.createHash crypto "sha256") b) "hex"))
(defn header [size fields]
  (let [b (.alloc js/Buffer size)]
    (doseq [[offset width value] fields]
      (case width 2 (.writeUInt16LE b value offset) 4 (.writeUInt32LE b value offset)))
    b))
(defn join-bytes [& chunks] (.concat js/Buffer (clj->js chunks)))
(defn fixture-zip
  "Independent ordinary ZIP32 fixture writer, including real data descriptors."
  [entries]
  (loop [entries entries offset 0 locals [] central []]
    (if-let [entry (first entries)]
      (let [name (.from js/Buffer (:name entry) "utf8")
            raw (.from js/Buffer (or (:text entry) "Inert payload.") "utf8")
            method (get entry :method 8)
            compressed (if (= 8 method) (.deflateRawSync zlib raw) raw)
            crc (.crc32 zlib raw)
            descriptor? (get entry :descriptor? (= 8 method))
            flags (get entry :flags (if descriptor? 8 0))
            csize (.-length compressed) size (.-length raw)
            local (header 30 [[0 4 67324752] [4 2 20] [6 2 flags] [8 2 method]
                              [14 4 (if descriptor? 0 crc)] [18 4 (if descriptor? 0 csize)]
                              [22 4 (if descriptor? 0 size)] [26 2 (.-length name)]])
            descriptor (if descriptor? (header 16 [[0 4 134695760] [4 4 crc] [8 4 csize] [12 4 size]]) (.alloc js/Buffer 0))
            block (join-bytes local name compressed descriptor)
            record (header 46 [[0 4 33639248] [4 2 788] [6 2 20] [8 2 flags] [10 2 method]
                               [16 4 crc] [20 4 csize] [24 4 size] [28 2 (.-length name)]
                               [38 4 (get entry :attributes 2175008768)] [42 4 offset]])]
        (recur (next entries) (+ offset (.-length block)) (conj locals block)
               (conj central (join-bytes record name))))
      (let [cd (apply join-bytes central)
            end (header 22 [[0 4 101010256] [8 2 (count central)] [10 2 (count central)]
                            [12 4 (.-length cd)] [16 4 offset]])]
        (apply join-bytes (concat locals [cd end]))))))
(defn request [file bytes]
  {:path file :artifact {:id 1 :run-id 2 :attempt 1 :size-bytes (.-length bytes)
                         :sha256 (hash-bytes bytes) :expires-at-ms (+ (.now js/Date) 3600000)}
   :bounds {:download-bytes 2000000 :members 16 :member-bytes 1000000
            :uncompressed-bytes 2000000 :operation-ms 10000 :decode-ms 5000}
   :required-members ["submission.json"] :text-members ["submission.json"]})
(defn ^:async admit [request]
  (if-let [f (resolve 'eta-mu.infra.review-archive/admit!)]
    (await (f request))
    {:status :unimplemented}))
(defn ^:async with-file [bytes f]
  (let [directory (.mkdtempSync fs (.join path (.tmpdir os) "eta-zip-test-"))
        file (.join path directory "artifact.zip")]
    (try (.writeFileSync fs file bytes)
         (await (f (request file bytes)))
         (finally (.rmSync fs directory #js {:recursive true :force true})))))
(defn ^:async positive-control [done]
  (try
    (doseq [method [0 8]]
      (let [bytes (fixture-zip [{:name "submission.json" :text "{\"inert\":true}" :method method}])]
        (await (with-file bytes
                 ^:async (fn [r]
                   (let [result (await (admit (assoc-in r [:artifact :archive-proof] {:result :forged})))]
                     (is (= :verified (:status result)))
                     (is (= "{\"inert\":true}" (get-in result [:members "submission.json" :text])))
                     (is (= (hash-bytes bytes) (get-in result [:artifact :archive-proof :sha256])))
                     (is (= :trusted-archive-verifier (get-in result [:artifact :archive-proof :origin])))
                     (is (= 1 (get-in result [:artifact :archive-proof :artifact-id])))))))))
    (catch :default e (is false (str e)))
    (finally (done))))
(deftest stored-and-deflated-descriptor-real-archives (async done (positive-control done)))

(defn ^:async refusal-controls [done]
  (try
    (doseq [entries [[{:name "../submission.json"}]
                     [{:name "/submission.json"}]
                     [{:name "dir\\submission.json"}]
                     [{:name "submission.json"} {:name "submission.json"}]
                     [{:name "submission.json" :attributes 2717843456}]
                     [{:name "submission.json" :flags 1}]
                     [{:name "submission.json" :method 99}]]]
      (await (with-file (fixture-zip entries)
               ^:async (fn [r] (is (= :refused (:status (await (admit r)))))))))
    (await (with-file (fixture-zip [{:name "submission.json" :text (apply str (repeat 2000 "a"))}])
             ^:async (fn [r]
               (doseq [bad [(assoc-in r [:artifact :sha256] (apply str (repeat 64 "f")))
                            (assoc-in r [:artifact :size-bytes] 1)
                            (assoc-in r [:artifact :expires-at-ms] 0)
                            (update r :bounds dissoc :decode-ms)
                            (assoc-in r [:bounds :download-bytes] 10)
                            (assoc-in r [:bounds :member-bytes] 10)
                            (assoc-in r [:bounds :uncompressed-bytes] 10)
                            (assoc r :required-members ["missing.json"])]]
                 (is (= :refused (:status (await (admit bad)))))))))
    (catch :default e (is false (str e)))
    (finally (done))))
(deftest physical-errors-and-finite-bounds-refuse (async done (refusal-controls done)))

(deftest actual-limit-law-has-no-unlimited-default
  (let [r (request "inert.zip" (.from js/Buffer "inert"))]
    (is (law/request? r))
    (doseq [key law/bound-keys] (is (not (law/request? (update r :bounds dissoc key)))))))

(defmethod test/report [::test/default :end-run-tests] [result]
  (when-not (test/successful? result) (set! (.-exitCode js/process) 1)))
(when (.existsSync fs "packages/eta-mu/src/cljs/eta_mu/infra/review_archive.cljs")
  (nbb/await (nbb/load-file "packages/eta-mu/src/cljs/eta_mu/infra/review_archive.cljs")))
(test/run-tests 'opencode-review-archive-test)
