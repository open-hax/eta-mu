#!/usr/bin/env bb
(ns inspect
  "Read-only, bounded inspection of a fixed lossless evidence bundle."
  (:require [cheshire.core :as json]
            [clojure.string :as str])
  (:import [java.io ByteArrayInputStream ByteArrayOutputStream StringReader]
           [java.nio.file Files Path Paths LinkOption OpenOption StandardOpenOption]
           [java.security MessageDigest]
           [java.util Base64]
           [java.util.zip GZIPInputStream]))

(def source-head "db99b1682c94ecdf9f8b239709dd44cb6101c7da")
(def limits {:index 2097152 :compressed 33554432 :decompressed 134217728
             :aggregate 67108864 :member 33554432 :members 4096 :path 4096 :external 33554432 :external-total 67108864})
(def script-path (.toAbsolutePath (Paths/get *file* (make-array String 0))))
(def fixed-root (.getParent script-path))
(defn reject! [reason] (throw (ex-info reason {:reason reason})))
(defn require! [pred reason] (when-not pred (reject! reason)))
(defn sha256 [data]
  (apply str (map #(format "%02x" (bit-and 255 %))
                  (.digest (MessageDigest/getInstance "SHA-256") data))))
(defn git-blob [data]
  (let [digest (MessageDigest/getInstance "SHA-1")]
    (.update digest (.getBytes (str "blob " (alength data) (char 0)) "UTF-8"))
    (.update digest data)
    (apply str (map #(format "%02x" (bit-and 255 %)) (.digest digest)))))
(defn valid-path? [p]
  (and (string? p) (<= (count (.getBytes p "UTF-8")) (:path limits))
       (str/starts-with? p ".ημ/review-evidence/")
       (not (str/includes? p "\\"))
       (not (re-find #"[\u0000-\u001f\u007f]" p))
       (every? #(not (contains? #{"" "." ".."} %)) (str/split p #"/" -1))))
(defn no-symlinks! [^Path path]
  (doseq [p (take-while some? (iterate #(.getParent ^Path %) (.toAbsolutePath path)))]
    (require! (not (Files/isSymbolicLink p)) "symlink")))
(defn bounded-read [stream cap]
  (with-open [in stream out (ByteArrayOutputStream.)]
    (let [buffer (byte-array 8192)]
      (loop [total 0]
        (let [n (.read in buffer)]
          (if (neg? n) (.toByteArray out)
              (let [next-total (+ total n)]
                (require! (<= next-total cap) "byte-bound")
                (.write out buffer 0 n)
                (recur next-total))))))))
(defn read-fixed [name cap]
  (require! (and (string? name) (re-matches #"[a-zA-Z0-9.-]+" name)) "filename")
  (let [path (.resolve fixed-root name)]
    (no-symlinks! script-path)
    (no-symlinks! path)
    (bounded-read (Files/newInputStream path
                                      (into-array OpenOption [StandardOpenOption/READ
                                                              LinkOption/NOFOLLOW_LINKS])) cap)))
(defn parse-json [data]
  (let [values (doall (json/parsed-seq (StringReader. (String. data "UTF-8")) true))]
    (require! (= 1 (count values)) "json-root")
    (first values)))
(defn bounded-int? [n cap] (and (integer? n) (<= 0 n cap)))
(defn digest? [s] (and (string? s) (boolean (re-matches #"[0-9a-f]{64}" s))))
(def metadata-keys [:path :bytes :sha256 :mode :git_blob :origin])
(defn validate-index! [index]
  (require! (= "eta-review-evidence-index-v1" (:schema index)) "index-schema")
  (require! (= source-head (:source_head index)) "source-head")
  (require! (digest? (:sha256 index)) "bundle-digest-shape")
  (require! (= (str "bundle." (:sha256 index) ".json.gz") (:bundle index)) "bundle-name")
  (require! (bounded-int? (:compressed_bytes index) (:compressed limits)) "compressed-bound")
  (require! (bounded-int? (:decompressed_bytes index) (:decompressed limits)) "decompressed-bound")
  (let [files (:files index)]
    (require! (and (vector? files) (<= 1 (count files) (:members limits))) "member-count")
    (require! (= (count files) (count (set (map :path files)))) "duplicate-path")
    (require! (= (map :path files) (sort (map :path files))) "member-order")
    (doseq [f files]
      (require! (valid-path? (:path f)) "member-path")
      (require! (contains? #{"100644" "100755"} (:mode f)) "member-mode")
      (require! (bounded-int? (:bytes f) (:member limits)) "member-bound")
      (require! (digest? (:sha256 f)) "member-digest-shape")
      (require! (or (nil? (:git_blob f))
                    (and (string? (:git_blob f)) (re-matches #"[0-9a-f]{40}" (:git_blob f)))) "git-blob-shape"))
    (require! (<= (reduce + (map :bytes files)) (:aggregate limits)) "aggregate-bound"))
  index)
(defn decode-member [f]
  (require! (and (vector? (:base64 f)) (<= 1 (count (:base64 f)) 1024)) "base64-shape")
  (with-open [out (ByteArrayOutputStream.)]
    (doseq [chunk (:base64 f)]
      (require! (and (string? chunk) (<= (count chunk) 1048576)) "base64-chunk-bound")
      (let [decoded (.decode (Base64/getDecoder) ^String chunk)]
        (require! (= chunk (.encodeToString (Base64/getEncoder) decoded)) "base64-canonical")
        (require! (<= (+ (.size out) (alength decoded)) (:bytes f)) "base64-bound")
        (.write out decoded)))
    (.toByteArray out)))
(defn verify-payload! [index compressed]
  (validate-index! index)
  (require! (= (:compressed_bytes index) (alength compressed)) "compressed-size")
  (require! (= (:sha256 index) (sha256 compressed)) "compressed-digest")
  (let [data (bounded-read (GZIPInputStream. (ByteArrayInputStream. compressed))
                           (:decompressed_bytes index))
        _ (require! (= (:decompressed_bytes index) (alength data)) "decompressed-size")
        payload (parse-json data)
        files (:files payload)]
    (require! (= "eta-review-evidence-bundle-v1" (:schema payload)) "bundle-schema")
    (require! (= source-head (:source_head payload)) "bundle-head")
    (require! (and (vector? files) (= (count (:files index)) (count files))) "bundle-member-count")
    (require! (= (:files index) (mapv #(select-keys % metadata-keys) files)) "bundle-index-members")
    (doseq [f files]
      (let [decoded (decode-member f)]
        (require! (= (:bytes f) (alength decoded)) "member-size")
        (require! (= (:sha256 f) (sha256 decoded)) "member-digest")
        (when (:git_blob f) (require! (= (:git_blob f) (git-blob decoded)) "member-git-blob"))))
    payload))
(defn verify-externals! [index]
  (let [external (:external_archives index [])]
    (require! (and (vector? external) (<= (count external) 2)) "external-count")
    (require! (= (count external) (count (set (map :path external)))) "external-duplicate")
    (require! (not-any? (set (map :path (:files index))) (map :path external)) "external-overlap")
    (require! (<= (reduce + (map :bytes external)) (:external-total limits)) "external-total-bound")
    (mapv
     (fn [f]
       (require! (valid-path? (:path f)) "external-path")
       (require! (contains? #{"100644" "100755"} (:mode f)) "external-mode")
       (require! (bounded-int? (:bytes f) (:external limits)) "external-bound")
       (require! (digest? (:sha256 f)) "external-digest-shape")
       (require! (= (str "failed." (:sha256 f) ".json.gz") (:file f)) "external-name")
       (let [data (read-fixed (:file f) (:external limits))]
         (require! (= (:bytes f) (alength data)) "external-size")
         (require! (= (:sha256 f) (sha256 data)) "external-digest")
         (require! (= (:git_blob f) (git-blob data)) "external-git-blob")
         ;; Keep the exact checked bytes for --show; reopening could race a
         ;; filesystem change after this verification.
         (assoc f :verified-bytes data)))
     external)))
(defn verify! []
  (let [index (validate-index! (parse-json (read-fixed "index.json" (:index limits))))]
    (assoc (verify-payload! index (read-fixed (:bundle index) (:compressed limits)))
           :external_archives (verify-externals! index))))
(defn main! [args]
  (require! (or (empty? args) (= ["--verify"] args)
                (and (= 2 (count args)) (= "--show" (first args)))) "usage")
  (when (= "--show" (first args)) (require! (valid-path? (second args)) "requested-path"))
  (let [payload (verify!)]
    (if (= "--show" (first args))
      (let [matches? #(= (second args) (:path %))
            member (first (filter matches? (:files payload)))
            external (first (filter matches? (:external_archives payload)))]
        (require! (or (some? member) (some? external)) "unknown-path")
        (.write System/out (if external
                            (:verified-bytes external)
                            (decode-member member)))
        (.flush System/out))
      (println (json/generate-string {:verified true :source_head source-head
                                      :members (+ (count (:files payload)) (count (:external_archives payload)))
                                      :bytes (reduce + (map :bytes (concat (:files payload) (:external_archives payload))))})))))
(when (= *file* (System/getProperty "babashka.file"))
  (try (main! *command-line-args*)
       (catch Exception e
         (binding [*out* *err*] (println "Evidence inspection refused:" (.getMessage e)))
         (System/exit 1))))
