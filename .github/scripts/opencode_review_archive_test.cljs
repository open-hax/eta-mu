;; SPDX-License-Identifier: GPL-3.0-or-later
(ns opencode-review-archive-test
  "Actual physical ZIP bytes; no native collector, review or deployment credit."
  (:require [cljs.test :as test :refer [deftest is async]]
            [nbb.core :as nbb]
            [eta-mu.law.review-archive :as law]
            [eta-mu.shape.review-archive :as zip]
            [cljs.reader :as reader]
            ["node:child_process" :as cp]
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

(defn copied [bytes f]
  (let [copy (.from js/Buffer bytes)] (f copy) copy))
(defn central-offset [bytes] (.readUInt32LE bytes (- (.-length bytes) 6)))
(defn ^:async structural-controls [done]
  (try
    (let [valid (fixture-zip [{:name "submission.json" :text "Inert payload."}])
          cd (central-offset valid)
          payload (+ 30 (.-length (.from js/Buffer "submission.json")))
          descriptor (- cd 16)
          controls [(copied valid #(.writeUInt32LE % 0 (+ cd 16)))
                    (copied valid #(.writeUInt32LE % 0 (+ descriptor 4)))
                    (copied valid #(.writeUInt32LE % 1 (+ descriptor 8)))
                    (copied valid #(.writeUInt32LE % 1 (+ descriptor 12)))
                    (copied valid #(.writeUInt16LE % 0 6))
                    (copied valid #(.writeUInt16LE % 0 8))
                    (copied valid #(.writeUInt8 % 120 30))
                    (copied valid #(.writeUInt8 % 0 payload))
                    (copied valid #(.writeUInt32LE % 1 (+ cd 42)))
                    (copied valid #(.writeUInt16LE % 1 (- (.-length %) 18)))
                    (join-bytes valid (.from js/Buffer "trailing"))
                    (join-bytes valid valid)]]
      (doseq [bad controls]
        (await (with-file bad ^:async (fn [r] (is (= :refused (:status (await (admit r))))))))))
    (catch :default e (is false (str e)))
    (finally (done))))
(deftest crc-descriptor-local-central-and-trailer-controls (async done (structural-controls done)))

(defn ^:async deadline-and-cleanup-controls [done]
  (try
    (await (with-file (fixture-zip [{:name "submission.json" :text (apply str (repeat 10000 "a"))}])
             ^:async (fn [r]
               ;; A single let is deliberate: pinned SCI does not sequence
               ;; separate native-async function body forms across awaits.
               (let [decode-result (await (admit (assoc-in r [:bounds :decode-ms] 1)))
                     operation-result (await (admit (assoc-in r [:bounds :operation-ms] 1)))
                     resource-fn (resolve 'eta-mu.extern.review-archive/resources)]
                 (is (= :refused (:status decode-result)))
                 (is (= :refused (:status operation-result)))
                 (is (zero? (:workers (resource-fn))) "Parent observes admission-worker cleanup only")))))
    (catch :default e (is false (str e)))
    (finally (done))))
(deftest finite-deadline-terminates-admission-worker (async done (deadline-and-cleanup-controls done)))

(defn ^:async actual-file-controls [done]
  (try
    (await (with-file (fixture-zip [{:name "submission.json"}])
             ^:async (fn [r]
               (let [link (str (:path r) ".link")]
                 (.symlinkSync fs (:path r) link)
                 (try (is (= :refused (:status (await (admit (assoc r :path link))))))
                      (finally (.unlinkSync fs link)))))))
    (catch :default e (is false (str e)))
    (finally (done))))
(deftest supplied-file-symlink-refuses (async done (actual-file-controls done)))

(defn portable-result [operation args]
  (try {:value (apply (case operation :uint zip/uint :local zip/local-record
                            :central zip/central-records :end zip/end-record :descriptor zip/descriptor) args)}
       (catch :default e {:code (:code (ex-data e))})))
(deftest actual-babashka-and-nbb-shape-boundaries-match
  (let [archive (fixture-zip [{:name "submission.json" :method 0}])
        cd (central-offset archive) local-size (+ 30 (.-length (.from js/Buffer "submission.json")))
        rows [[:local [(vec (.subarray archive 0 local-size))]]
              [:central [(vec (.subarray archive cd (- (.-length archive) 22))) 16]]
              [:end [(vec (.subarray archive (- (.-length archive) 22))) (.-length archive)]]
              [:local [[1 2 3]]]
              [:uint [[255 255 255 255 255 255 31 0] 0 8]]
              [:uint [[0 0 0 0 0 0 32 0] 0 8]]
              [:uint [(vec (repeat 8 255)) 0 8]]
              [:uint [[0 0 0 0 0 0 0 128] 0 8]]
              [:descriptor [[1 2 3]]]]
        expected (mapv (fn [[operation args]] (portable-result operation args)) rows)
        script (str "(require '[clojure.edn :as edn] '[eta-mu.shape.review-archive :as zip])"
                    "(prn (mapv (fn [[operation args]] (try {:value (apply (case operation :uint zip/uint :local zip/local-record "
                    ":central zip/central-records :end zip/end-record :descriptor zip/descriptor) args)} "
                    "(catch Exception e {:code (:code (ex-data e))}))) (edn/read-string (slurp *in*))))")
        result (cp/spawnSync "bb" #js ["-cp" "packages/eta-mu/src/cljs" "-e" script]
                             #js {:encoding "utf8" :input (pr-str rows) :timeout 30000})]
    (is (= {:value 9007199254740991} (nth expected 4)))
    (doseq [index [5 6 7]] (is (= {:code :zip-integer-range} (nth expected index))))
    (is (= 0 (.-status result)) (str (.-stdout result) (.-stderr result)))
    (is (= "" (.-stderr result)))
    (when (= 0 (.-status result))
      (is (= expected (reader/read-string (.-stdout result))) "Complete malformed/boundary data parity"))))

(defn ^:async complete-operation-budget-control [done]
  (try
    (let [entries (mapv (fn [i] {:name (str "f" i ".txt") :method 0 :text ""}) (range 2000))]
      (await
       (with-file (fixture-zip entries)
         ^:async (fn [r]
           (let [request (-> r (assoc :required-members ["f0.txt"] :text-members [])
                             (assoc-in [:bounds :members] 3000)
                             (assoc-in [:bounds :operation-ms] 10))
                 started (.now js/performance)
                 result (await (admit request))
                 elapsed (- (.now js/performance) started)
                 resources ((resolve 'eta-mu.extern.review-archive/resources))]
             (is (= :refused (:status result)))
             (is (= :archive-operation-time (:code result)))
             (is (< elapsed 750) (str "Cancellation must bound parsing, not only detect it later: " elapsed "ms"))
             (is (zero? (:workers resources)) "Nested handles are not observable from the parent"))))))
    (catch :default e (is false (str e)))
    (finally (done))))
(deftest operation-budget-covers-many-member-metadata-work
  (async done (complete-operation-budget-control done)))

(defn ^:async declared-output-budget-controls [done]
  (try
    (let [valid (fixture-zip [{:name "submission.json" :text (apply str (repeat 65536 "a"))}])
          cd (central-offset valid)
          descriptor (- cd 16)
          lie (copied valid (fn [b] (.writeUInt32LE b 1 (+ cd 24))
                             (.writeUInt32LE b 1 (+ descriptor 12))))]
      (await
       (with-file lie
         ^:async (fn [r]
           (let [result (await (admit (-> r (assoc-in [:bounds :member-bytes] 100000)
                                          (assoc-in [:bounds :uncompressed-bytes] 1024))))]
             (is (= :refused (:status result)))
             (is (= :archive-decode (:code result)) "Output must hit the declared-size decoder cap before post-decode validation")))))
      (doseq [method [0 8]]
        (await
         (with-file (fixture-zip [{:name "submission.json" :text "" :method method}])
           ^:async (fn [r]
             (let [result (await (admit r))]
               (is (= :verified (:status result)))
               (is (= 0 (get-in result [:members "submission.json" :size])))
               (is (= "" (get-in result [:members "submission.json" :text])))))))))
    (catch :default e (is false (str e)))
    (finally (done))))
(deftest actual-decode-respects-declared-total-budget-and-empty-members
  (async done (declared-output-budget-controls done)))

(defn ^:async publication-clock-control [done]
  (try
    (await
     (with-file (fixture-zip [{:name "submission.json" :text "{}"}])
       ^:async (fn [r]
         (let [base ((resolve 'opencode-review-publish-test/fixture))
               now (.now js/Date)
               artifact (merge (get-in base [:snapshot :artifact]) (:artifact r)
                               {:id 71 :run-id 61 :attempt 2})
               context (-> base (assoc :now-ms now)
                           (assoc-in [:snapshot :observed-at-ms] now)
                           (assoc-in [:snapshot :verification :completed-at-ms] now)
                           (assoc-in [:snapshot :verification :artifact-sha256] (:sha256 artifact))
                           (assoc-in [:snapshot :artifact] artifact))
               compose (resolve 'eta-mu.infra.review-archive/admit-context!)
               admitted (await (compose context (assoc r :artifact artifact)))
               stale (await (compose (assoc-in context [:snapshot :verification :completed-at-ms]
                                                (- now 400000)) (assoc r :artifact artifact)))
               mismatch (await (compose context r))]
           (is (= :admitted (:status admitted)) (pr-str admitted))
           (is (= [] (:effects admitted)))
           (is (= :refused (:status stale)))
           (is (= :archive-context-binding (:code mismatch)))))))
    (catch :default e (is false (str e)))
    (finally (done))))
(deftest archive-composition-uses-fresh-host-time-without-refreshing-other-facts
  (async done (publication-clock-control done)))

(nbb/await (nbb/load-file ".github/scripts/opencode_review_publish_test.cljs"))

;; Even a future authored async-scoping error must not turn a late failed
;; assertion into a zero exit after cljs.test has already printed its summary.
(def original-failure-report (get-method test/report [::test/default :fail]))
(defmethod test/report [::test/default :fail] [result]
  (set! (.-exitCode js/process) 1)
  (original-failure-report result))

(defmethod test/report [::test/default :end-run-tests] [result]
  (when-not (test/successful? result) (set! (.-exitCode js/process) 1)))
(when (.existsSync fs "packages/eta-mu/src/cljs/eta_mu/infra/review_archive.cljs")
  (nbb/await (nbb/load-file "packages/eta-mu/src/cljs/eta_mu/infra/review_archive.cljs")))
(test/run-tests 'opencode-review-archive-test)
