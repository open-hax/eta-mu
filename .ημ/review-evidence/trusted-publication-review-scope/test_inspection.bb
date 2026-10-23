#!/usr/bin/env bb
(ns test-inspection
  {:clj-kondo/config '{:linters {:unresolved-namespace {:exclude [inspect]}}}}
  (:require [babashka.fs :as fs]
            [babashka.process :as process]
            [cheshire.core :as json]
            [clojure.test :as test :refer [deftest is testing]])
  (:import [java.io ByteArrayOutputStream]
           [java.util Base64]
           [java.util.zip GZIPOutputStream]))
(def helper (.resolve (.getParent (.toAbsolutePath (java.nio.file.Paths/get *file* (make-array String 0)))) "inspect.bb"))
(load-file (str helper))
(def sample-path ".ημ/review-evidence/fixture/raw.bin")
(def raw (byte-array [0 1 2 10 -1]))
(def member {:path sample-path :bytes (alength raw) :sha256 (inspect/sha256 raw)
             :mode "100755" :git_blob (inspect/git-blob raw) :origin "inspection-control"
             :base64 [(.encodeToString (Base64/getEncoder) raw)]})
(defn pack [files]
  (let [data (.getBytes (json/generate-string {:schema "eta-review-evidence-bundle-v1"
                                              :source_head inspect/source-head :files files}) "UTF-8")
        out (ByteArrayOutputStream.)
        _ (with-open [gz (GZIPOutputStream. out)] (.write gz data))
        compressed (.toByteArray out)
        digest (inspect/sha256 compressed)]
    [{:schema "eta-review-evidence-index-v1" :source_head inspect/source-head
      :bundle (str "bundle." digest ".json.gz") :sha256 digest
      :compressed_bytes (alength compressed) :decompressed_bytes (alength data)
      :files (mapv #(select-keys % inspect/metadata-keys) files)} compressed]))
(defn refused? [f] (try (f) false (catch Exception _ true)))
(deftest bytes-and-modes
  (let [[index compressed] (pack [member])
        payload (inspect/verify-payload! index compressed)]
    (is (= "100755" (get-in payload [:files 0 :mode])))
    (is (= (seq raw) (seq (inspect/decode-member (get-in payload [:files 0])))))))
(deftest external-show-emits-verified-bytes
  ;; The filesystem may change after verification. Emit the byte array whose
  ;; identity was checked rather than reopening a mutable external artifact.
  (let [legacy ".ημ/review-evidence/fixture/failed.json.gz"
        file (str "failed." (inspect/sha256 raw) ".json.gz")
        external (assoc (dissoc member :base64) :path legacy :file file)
        changed (.getBytes "changed-after-verification" "UTF-8")
        capture (ByteArrayOutputStream.)
        original-out System/out
        reads (atom 0)
        index {:external_archives [external]}]
    (try
      (System/setOut (java.io.PrintStream. capture))
      (with-redefs [inspect/verify! (fn [] {:files []
                                          :external_archives (inspect/verify-externals! index)})
                    inspect/read-fixed (fn [_ _] (if (= 1 (swap! reads inc)) raw changed))]
        (inspect/main! ["--show" legacy]))
      (finally (System/setOut original-out)))
    (is (= (seq raw) (seq (.toByteArray capture))))
    (is (= 1 @reads))))
(deftest malformed-controls
  (doseq [[label change] [["absolute" #(assoc % :path "/etc/passwd")]
                          ["traversal" #(assoc % :path ".ημ/review-evidence/../escape")]
                          ["empty component" #(assoc % :path ".ημ/review-evidence//raw")]
                          ["backslash" #(assoc % :path ".ημ/review-evidence/a\\b")]
                          ["unknown mode" #(assoc % :mode "120000")]
                          ["negative size" #(assoc % :bytes -1)]
                          ["member bound" #(assoc % :bytes (inc (:member inspect/limits)))]
                          ["git blob" #(assoc % :git_blob (apply str (repeat 40 "0")))]
                          ["digest" #(assoc % :sha256 (apply str (repeat 64 "0")))]
                          ["size" #(assoc % :bytes 4)]
                          ["base64 garbage" #(assoc % :base64 ["?==="])]
                          ["base64 noncanonical" #(assoc % :base64 ["AAECAv8"])]]]
    (testing label
      (let [[index compressed] (pack [(change member)])]
        (is (refused? #(inspect/verify-payload! index compressed))))))
  (let [[index compressed] (pack [member])]
    (doseq [changed [(assoc index :source_head "forged")
                     (assoc index :bundle "../bundle.gz")
                     (update index :compressed_bytes inc)
                     (assoc index :sha256 (apply str (repeat 64 "0")))
                     (update index :decompressed_bytes dec)
                     (assoc index :compressed_bytes (inc (:compressed inspect/limits)))
                     (assoc index :decompressed_bytes (inc (:decompressed inspect/limits)))
                     (assoc index :files [])]]
      (is (refused? #(inspect/verify-payload! changed compressed))))
    (is (refused? #(inspect/verify-payload! index (byte-array [1 2 3])))))
  (let [[index compressed] (pack [member member])]
    (is (refused? #(inspect/verify-payload! index compressed))))
  (let [[index compressed] (pack [(assoc member :base64 ["AA=="] :bytes 1)])]
    (is (refused? #(inspect/verify-payload! index compressed))))
  (let [[index compressed] (pack [member])]
    (with-redefs [inspect/limits (assoc inspect/limits :aggregate 4)]
      (is (refused? #(inspect/verify-payload! index compressed))))
    (with-redefs [inspect/limits (assoc inspect/limits :members 0)]
      (is (refused? #(inspect/verify-payload! index compressed))))))
(deftest actual-fixed-entrypoint
  ;; Tiny fixtures live beneath the durable capture directory until bundled.
  (let [root (fs/create-temp-dir {:prefix "eta-evidence-inspection-"})
        _ (fs/create-dirs root)
        _ (fs/copy helper (fs/path root "inspect.bb") {:replace-existing true})
        [index compressed] (pack [member])
        bundle (fs/path root (:bundle index))
        run (fn [& args] (apply process/shell {:continue true :out :bytes :err :string}
                                "bb" (str (fs/path root "inspect.bb")) args))]
    (spit (str (fs/path root "index.json")) (json/generate-string index))
    (java.nio.file.Files/write (fs/path bundle) compressed (make-array java.nio.file.OpenOption 0))
    (let [result (run)]
      (is (zero? (:exit result)))
      (is (= true (:verified (json/parse-string (String. ^bytes (:out result) "UTF-8") true)))))
    (let [result (run "--show" sample-path)]
      (is (zero? (:exit result)))
      (is (= (seq raw) (seq (:out result)))))
    (doseq [args [["--show" "../escape"] ["--show" ".ημ/review-evidence/missing"] ["--extract"]]]
      (let [result (apply run args)]
        (is (not (zero? (:exit result))))
        (is (empty? (:out result)))))
    (let [external (assoc (dissoc member :base64) :path ".ημ/review-evidence/fixture/failed.gz"
                          :file (str "failed." (:sha256 member) ".json.gz"))
          external-file (fs/path root (:file external))
          external-index (assoc index :external_archives [external])]
      (java.nio.file.Files/write external-file raw (make-array java.nio.file.OpenOption 0))
      (spit (str (fs/path root "index.json")) (json/generate-string external-index))
      (is (zero? (:exit (run))))
      (is (= (seq raw) (seq (:out (run "--show" (:path external))))))
      (doseq [changed [(assoc external :mode "120000")
                       (assoc external :path "../escape")
                       (assoc external :file "../elsewhere")
                       (update external :bytes inc)
                       (assoc external :git_blob (apply str (repeat 40 "0")))]]
        (spit (str (fs/path root "index.json"))
              (json/generate-string (assoc index :external_archives [changed])))
        (is (not (zero? (:exit (run))))))
      (spit (str external-file) "tampered")
      (spit (str (fs/path root "index.json")) (json/generate-string external-index))
      (is (not (zero? (:exit (run)))))
      (spit (str (fs/path root "index.json")) (json/generate-string index)))
    (fs/move bundle (fs/path root "original.gz") {:replace-existing true})
    (fs/create-sym-link bundle (fs/path root "original.gz"))
    (is (not (zero? (:exit (run)))))
    (fs/delete bundle)
    (fs/move (fs/path root "original.gz") bundle)
    (spit (str (fs/path root "index.json")) "{} {}")
    (is (not (zero? (:exit (run)))))
    (spit (str (fs/path root "index.json")) (json/generate-string index))
    (let [alias (fs/path root "ancestor-alias")]
      (when (fs/exists? alias) (fs/delete alias))
      (fs/create-sym-link alias (.getParent (fs/path root)))
      (let [result (process/shell {:continue true :out :string :err :string}
                                  "bb" (str (fs/path alias (str (fs/file-name root)) "inspect.bb")))]
        (is (not (zero? (:exit result)))))
      (fs/delete alias))
    (fs/delete-tree root)))
(deftest symlinked-default-temp-parent-keeps-positive-fixtures-usable
  (let [parent (fs/create-temp-dir {:dir (fs/real-path (fs/temp-dir))
                                    :prefix "eta-inspection-parent-"})
        physical (fs/path parent "physical")
        alias (fs/path parent "alias")
        create-temp fs/create-temp-dir]
    (try
      (fs/create-dirs physical)
      (fs/create-sym-link alias physical)
      ;; Model a platform's symlinked default temporary parent. An explicit
      ;; canonical :dir must win; all entrypoint/ancestor-negative controls run.
      (with-redefs [fs/temp-dir (constantly alias)
                    fs/create-temp-dir (fn [opts]
                                         (create-temp (if (:dir opts) opts
                                                        (assoc opts :dir alias))))]
        (actual-fixed-entrypoint))
      (finally (fs/delete-tree parent)))))
(let [result (test/run-tests 'test-inspection)]
  (System/exit (if (zero? (+ (:fail result) (:error result))) 0 1)))
