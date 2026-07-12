(ns eta-mu.coding.extern.mime
  "MIME type detection helpers. Pure functions here; file-type integration
   is provided by the infra layer via a callback injection pattern."
  (:require [clojure.string :as str]))

(def ^:private fs (js/require "node:fs"))

(def ^:private sniff-bytes 4100)

(def ^:private image-mime-types
  #{"image/jpeg" "image/png" "image/gif" "image/webp"})

(def ^:private audio-mime-types
  #{"audio/wav" "audio/wave" "audio/x-wav" "audio/mpeg" "audio/mp3"
    "audio/flac" "audio/ogg" "audio/webm" "audio/mp4" "audio/x-m4a" "audio/aac"})

(defn base-mime-type
  "Strip parameters from a MIME type and normalize to lowercase."
  [mime-type]
  (-> (str/lower-case mime-type)
      (str/split ";")
      first
      str/trim))

(defn image-mime-type?
  "Return true when `mime-type` is a supported image type."
  [mime-type]
  (contains? image-mime-types (base-mime-type mime-type)))

(defn audio-mime-type?
  "Return true when `mime-type` is a supported audio type."
  [mime-type]
  (contains? audio-mime-types (base-mime-type mime-type)))

(defn sniff-from-buffer
  "Detect MIME type from a byte buffer using an externally-supplied
   `file-type-from-buffer` function (fn [buffer] -> {:mime string} or nil).
   Returns a string or nil."
  [file-type-from-buffer buffer]
  (when file-type-from-buffer
    (try
      (when-let [result (file-type-from-buffer buffer)]
        (.-mime result))
      (catch js/Error _ nil))))

(defn sniff-from-file
  "Detect MIME type from a file using an externally-supplied
   `file-type-from-buffer` function.
   Returns a string or nil."
  [file-type-from-buffer file-path]
  (when file-type-from-buffer
    (try
      (let [fd (.openSync fs file-path "r")
            buf (js/Buffer.alloc sniff-bytes)]
        (try
          (let [bytes-read (.readSync fs fd buf 0 sniff-bytes 0)]
            (when (pos? bytes-read)
              (when-let [result (file-type-from-buffer (.slice buf 0 bytes-read))]
                (.-mime result))))
          (finally
            (.closeSync fs fd))))
      (catch js/Error _ nil))))

(defn detect-image-mime-type-from-file
  "Detect a supported image MIME type from a file path using `file-type-from-buffer`.
   Returns a string or nil."
  [file-type-from-buffer file-path]
  (let [mime (sniff-from-file file-type-from-buffer file-path)]
    (when (and mime (image-mime-type? mime))
      mime)))

(defn detect-audio-mime-type-from-file
  "Detect a supported audio MIME type from a file path using `file-type-from-buffer`.
   Returns a string or nil."
  [file-type-from-buffer file-path]
  (let [mime (sniff-from-file file-type-from-buffer file-path)]
    (when (and mime (audio-mime-type? mime))
      mime)))
