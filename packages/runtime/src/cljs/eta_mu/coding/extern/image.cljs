(ns eta-mu.coding.extern.image
  "Image processing via the photon (Rust/WASM) npm module. All JS interop is local to this extern namespace.")

(def ^:private fs (js/require "node:fs"))
(def ^:private node-path (js/require "node:path"))

(def ^:private wasm-filename "photon_rs_bg.wasm")

(def ^:private photon-module
  "Lazily loaded photon WASM module."
  (delay
    (let [exec-dir (.-dirname (.-execPath js/process))
          fallback-paths [(node-path.join exec-dir wasm-filename)
                          (node-path.join exec-dir "photon" wasm-filename)
                          (node-path.join (.-cwd js/process) wasm-filename)]
          orig-read (.-readSync fs)]
      (set! (.-readSync fs)
            (fn [& args]
              (try
                (apply orig-read args)
                (catch js/Error e
                  (if (and (.-message e)
                           (.includes (str (.-message e)) wasm-filename))
                    (let [path-arg (first args)]
                      (if (string? path-arg)
                        (if-let [found (first (filter #(.existsSync fs %) fallback-paths))]
                          (apply orig-read (cons found (rest args)))
                          (throw e))
                        (throw e)))
                    (throw e))))))
      (try
        (js/require "@silvia-odwyer/photon-node")
        (catch js/Error _ nil)))))

(defn- exif-header-at?
  "Return true when bytes at `offset` match 'Exif\\0\\0'."
  [bytes offset]
  (and (>= (+ offset 6) (.-length bytes))
       (= (aget bytes offset) 0x45)
       (= (aget bytes (+ offset 1)) 0x78)
       (= (aget bytes (+ offset 2)) 0x69)
       (= (aget bytes (+ offset 3)) 0x66)
       (= (aget bytes (+ offset 4)) 0x00)
       (= (aget bytes (+ offset 5)) 0x00)))

(defn- read16
  "Read a 16-bit value at `pos` from `bytes`."
  [bytes pos le]
  (if le
    (bit-or (aget bytes pos) (bit-shift-left (aget bytes (+ pos 1)) 8))
    (bit-or (bit-shift-left (aget bytes pos) 8) (aget bytes (+ pos 1)))))

(defn- read32
  "Read a 32-bit value at `pos` from `bytes`."
  [bytes pos le]
  (if le
    (bit-or (aget bytes pos)
            (bit-shift-left (aget bytes (+ pos 1)) 8)
            (bit-shift-left (aget bytes (+ pos 2)) 16)
            (bit-shift-left (aget bytes (+ pos 3)) 24))
    (unchecked-add
      (bit-shift-left (aget bytes pos) 24)
      (bit-shift-left (aget bytes (+ pos 1)) 16)
      (bit-shift-left (aget bytes (+ pos 2)) 8)
      (aget bytes (+ pos 3)))))

(defn- read-orientation-from-tiff
  "Read EXIF orientation from a TIFF header starting at `tiff-start`."
  [bytes tiff-start]
  (if (> (+ tiff-start 8) (.-length bytes))
    1
    (let [byte-order (read16 bytes tiff-start false)
          le (= byte-order 0x4949)
          ifd-offset (read32 bytes (+ tiff-start 4) le)
          ifd-start (+ tiff-start ifd-offset)]
      (if (> (+ ifd-start 2) (.-length bytes))
        1
        (let [entry-count (read16 bytes ifd-start le)]
          (loop [i 0]
            (if (>= i entry-count)
              1
              (let [entry-pos (+ ifd-start 2 (* i 12))]
                (if (> (+ entry-pos 12) (.-length bytes))
                  1
                  (if (= (read16 bytes entry-pos le) 0x0112)
                    (let [value (read16 bytes (+ entry-pos 8) le)]
                      (if (and (>= value 1) (<= value 8)) value 1))
                    (recur (inc i))))))))))))

(defn- find-jpeg-tiff-offset
  "Find the TIFF data offset in a JPEG byte array."
  [bytes]
  (loop [offset 2]
    (if (>= offset (- (.-length bytes) 1))
      -1
      (if (not= (aget bytes offset) 0xff)
        -1
        (let [marker (aget bytes (+ offset 1))]
          (cond
            (= marker 0xff)
            (recur (inc offset))

            (= marker 0xe1)
            (if (>= (+ offset 4) (.-length bytes))
              -1
              (let [segment-start (+ offset 4)]
                (if (> (+ segment-start 6) (.-length bytes))
                  -1
                  (if-not (exif-header-at? bytes segment-start)
                    -1
                    (+ segment-start 6)))))

            :else
            (if (< (+ offset 4) (.-length bytes))
              (let [length (bit-or (bit-shift-left (aget bytes (+ offset 2)) 8)
                                   (aget bytes (+ offset 3)))]
                (recur (+ offset 2 length)))
              -1)))))))

(defn- find-webp-tiff-offset
  "Find the TIFF data offset in a WebP byte array."
  [bytes]
  (loop [offset 12]
    (if (> (+ offset 8) (.-length bytes))
      -1
      (let [chunk-id (str (char (aget bytes offset))
                          (char (aget bytes (+ offset 1)))
                          (char (aget bytes (+ offset 2)))
                          (char (aget bytes (+ offset 3))))
            chunk-size (bit-or (aget bytes (+ offset 4))
                               (bit-shift-left (aget bytes (+ offset 5)) 8)
                               (bit-shift-left (aget bytes (+ offset 6)) 16)
                               (bit-shift-left (aget bytes (+ offset 7)) 24))
            data-start (+ offset 8)]
        (if (= chunk-id "EXIF")
          (if (> (+ data-start chunk-size) (.-length bytes))
            -1
            (if (and (>= chunk-size 6) (exif-header-at? bytes data-start))
              (+ data-start 6)
              data-start))
          (recur (+ data-start chunk-size (mod chunk-size 2))))))))

(defn- get-exif-orientation
  "Read the EXIF orientation tag from a JPEG or WebP byte array."
  [bytes]
  (let [tiff-offset (cond
                      (and (>= (.-length bytes) 2)
                           (= (aget bytes 0) 0xff)
                           (= (aget bytes 1) 0xd8))
                      (find-jpeg-tiff-offset bytes)

                      (and (>= (.-length bytes) 12)
                           (= (aget bytes 0) 0x52) (= (aget bytes 1) 0x49)
                           (= (aget bytes 2) 0x46) (= (aget bytes 3) 0x46)
                           (= (aget bytes 8) 0x57) (= (aget bytes 9) 0x45)
                           (= (aget bytes 10) 0x42) (= (aget bytes 11) 0x50))
                      (find-webp-tiff-offset bytes)

                      :else -1)]
    (if (= tiff-offset -1)
      1
      (read-orientation-from-tiff bytes tiff-offset))))

(defn apply-exif-orientation
  "Apply EXIF orientation correction. Returns the (possibly new) image.
   The caller must free the original image if different from the result."
  [photon image original-bytes]
  (let [orientation (get-exif-orientation original-bytes)]
    (cond
      (= orientation 1) image
      (= orientation 2) (do (.fliph photon image) image)
      (= orientation 3) (do (.fliph photon image) (.flipv photon image) image)
      (= orientation 4) (do (.flipv photon image) image)
      :else image)))

(def ^:private default-max-width 2000)
(def ^:private default-max-height 2000)
(def ^:private default-max-bytes (long (* 4.5 1024 1024)))
(def ^:private default-jpeg-quality 80)

(defn- encode-candidate
  "Encode a photon image to base64 with the given mime-type."
  [image mime-type]
  (let [bytes (if (= mime-type "image/jpeg")
                (.get_bytes_jpeg image default-jpeg-quality)
                (.get_bytes image))
        data (.toString (js/Buffer.from bytes) "base64")
        encoded-size (.-length data)]
    {:data data
     :encoded-size encoded-size
     :mime-type mime-type}))

(defn resize-image
  "Resize an image to fit within the specified max dimensions and encoded size.
   Returns {:data base64 :mime-type :original-width :original-height :width :height :was-resized} or nil."
  ([image-base64 mime-type]
   (resize-image image-base64 mime-type {}))
  ([image-base64 mime-type opts]
   (let [{:keys [max-width max-height max-bytes jpeg-quality]
          :or {max-width default-max-width
               max-height default-max-height
               max-bytes default-max-bytes
               jpeg-quality default-jpeg-quality}} opts
         photon @photon-module]
     (when-not photon nil)
     (when photon
       (try
         (let [input-buffer (js/Buffer.from image-base64 "base64")
               input-bytes (js/Uint8Array. input-buffer)
               raw-image (.new_from_byteslice photon input-bytes)
               image (apply-exif-orientation photon raw-image input-bytes)]
           (when (not= image raw-image)
             (.free raw-image))
           (try
             (let [original-width (.get_width image)
                   original-height (.get_height image)
                   base64-byte-count (.-length (js/Buffer.from image-base64 "utf-8"))
                   already-ok? (and (<= original-width max-width)
                                    (<= original-height max-height)
                                    (< base64-byte-count max-bytes))]
               (if already-ok?
                 {:data image-base64
                  :mime-type (or mime-type "image/png")
                  :original-width original-width
                  :original-height original-height
                  :width original-width
                  :height original-height
                  :was-resized false}
                 (let [scale-w (if (> original-width max-width) (/ max-width original-width) 1.0)
                       scale-h (if (> original-height max-height) (/ max-height original-height) 1.0)
                       scale (min scale-w scale-h)
                       target-w (max 1 (js/Math.round (* original-width scale)))
                       target-h (max 1 (js/Math.round (* original-height scale)))
                       quality-steps (distinct [jpeg-quality 85 70 55 40])]
                   (loop [cur-w target-w
                          cur-h target-h]
                     (let [resized (.resize photon image cur-w cur-h (.-Lanczos3 photon))
                           candidates (try
                                        (conj
                                          (mapv #(encode-candidate resized
                                                  (if (= % 0) "image/png" "image/jpeg"))
                                                (cons 0 quality-steps))
                                          (encode-candidate resized "image/png"))
                                        (finally (.free resized)))
                           fit (first (filter #(< (:encoded-size %) max-bytes) candidates))]
                       (if fit
                         {:data (:data fit)
                          :mime-type (:mime-type fit)
                          :original-width original-width
                          :original-height original-height
                          :width cur-w
                          :height cur-h
                          :was-resized true}
                         (let [next-w (if (= cur-w 1) 1 (max 1 (js/Math.floor (* cur-w 0.75))))
                               next-h (if (= cur-h 1) 1 (max 1 (js/Math.floor (* cur-h 0.75))))]
                           (if (and (= next-w cur-w) (= next-h cur-h))
                             nil
                             (recur next-w next-h)))))))))
             (finally
               (.free image))))
         (catch js/Error _ nil))))))

(defn convert-to-png
  "Convert an image to PNG format. Returns {:data base64 :mime-type \"image/png\"} or nil."
  [image-base64 mime-type]
  (if (= mime-type "image/png")
    {:data image-base64 :mime-type "image/png"}
    (let [photon @photon-module]
      (when-not photon nil)
      (when photon
        (try
          (let [bytes (js/Uint8Array. (js/Buffer.from image-base64 "base64"))
                raw-image (.new_from_byteslice photon bytes)
                image (apply-exif-orientation photon raw-image bytes)]
            (when (not= image raw-image)
              (.free raw-image))
            (try
              (let [png-bytes (.get_bytes image)]
                {:data (.toString (js/Buffer.from png-bytes) "base64")
                 :mime-type "image/png"})
              (finally
                (.free image))))
          (catch js/Error _ nil))))))

(defn format-dimension-note
  "Format a dimension note for resized images."
  [result]
  (when (:was-resized result)
    (let [scale (/ (:original-width result) (:width result))]
      (str "[Image: original " (:original-width result) "x" (:original-height result)
           ", displayed at " (:width result) "x" (:height result)
           ". Multiply coordinates by " (.toFixed scale 2) " to map to original image.]"))))
