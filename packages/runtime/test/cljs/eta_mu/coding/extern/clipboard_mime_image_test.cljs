(ns eta-mu.coding.extern.clipboard-mime-image-test
  (:require [cljs.test :refer-macros [deftest is testing]]
            [eta-mu.coding.extern.clipboard :as clip]
            [eta-mu.coding.extern.mime :as mime]
            [eta-mu.coding.extern.image :as img]))

;; ---------------------------------------------------------------------------
;; Clipboard — pure helpers
;; ---------------------------------------------------------------------------

(deftest extension-for-mime-type-test
  (testing "returns correct extensions for known image MIME types"
    (is (= "png" (clip/extension-for-mime-type "image/png")))
    (is (= "jpg" (clip/extension-for-mime-type "image/jpeg")))
    (is (= "webp" (clip/extension-for-mime-type "image/webp")))
    (is (= "gif" (clip/extension-for-mime-type "image/gif"))))
  (testing "normalizes parameters and case"
    (is (= "png" (clip/extension-for-mime-type "image/png; charset=binary")))
    (is (= "jpg" (clip/extension-for-mime-type "Image/JPEG"))))
  (testing "returns nil for unknown types"
    (is (nil? (clip/extension-for-mime-type "application/json")))
    (is (nil? (clip/extension-for-mime-type "text/plain")))))

(deftest platform-detection-test
  (testing "is-wayland? returns a boolean"
    (is (boolean? (clip/is-wayland?))))
  (testing "is-wsl? returns a boolean"
    (is (boolean? (clip/is-wsl?))))
  (testing "is-termux? returns a boolean"
    (is (boolean? (clip/is-termux?))))
  (testing "is-remote? returns a boolean"
    (is (boolean? (clip/is-remote?)))))

;; ---------------------------------------------------------------------------
;; MIME — pure helpers
;; ---------------------------------------------------------------------------

(deftest base-mime-type-test
  (testing "strips parameters and normalizes case"
    (is (= "image/png" (mime/base-mime-type "image/png")))
    (is (= "image/png" (mime/base-mime-type "image/png; charset=binary")))
    (is (= "image/jpeg" (mime/base-mime-type "Image/JPEG")))
    (is (= "audio/mpeg" (mime/base-mime-type "audio/mpeg; samplerate=44100")))))

(deftest image-mime-type?-test
  (testing "returns true for supported image MIME types"
    (is (mime/image-mime-type? "image/png"))
    (is (mime/image-mime-type? "image/jpeg"))
    (is (mime/image-mime-type? "image/gif"))
    (is (mime/image-mime-type? "image/webp"))
    (is (mime/image-mime-type? "Image/PNG")))
  (testing "returns false for non-image types"
    (is (not (mime/image-mime-type? "application/json")))
    (is (not (mime/image-mime-type? "text/plain")))
    (is (not (mime/image-mime-type? "audio/mpeg")))))

(deftest audio-mime-type?-test
  (testing "returns true for supported audio MIME types"
    (is (mime/audio-mime-type? "audio/mpeg"))
    (is (mime/audio-mime-type? "audio/wav"))
    (is (mime/audio-mime-type? "audio/flac"))
    (is (mime/audio-mime-type? "audio/ogg")))
  (testing "returns false for non-audio types"
    (is (not (mime/audio-mime-type? "image/png")))
    (is (not (mime/audio-mime-type? "application/pdf")))))

(deftest sniff-from-buffer-test
  (testing "returns nil when file-type-from-buffer is nil"
    (is (nil? (mime/sniff-from-buffer nil (js/Uint8Array. #js [0x89 0x50 0x4E 0x47])))))
  (testing "delegates to the supplied function"
    (let [fake-detect (fn [_] #js {:mime "image/png"})]
      (is (= "image/png" (mime/sniff-from-buffer fake-detect (js/Uint8Array. #js [0x89]))))))
  (testing "returns nil when detection returns nil"
    (let [fake-detect (fn [_] nil)]
      (is (nil? (mime/sniff-from-buffer fake-detect (js/Uint8Array. #js [0x00 0x01])))))))

(deftest sniff-from-file-test
  (testing "returns nil when file-type-from-buffer is nil"
    (is (nil? (mime/sniff-from-file nil "/nonexistent")))))

;; ---------------------------------------------------------------------------
;; Image — pure helpers (no photon required)
;; ---------------------------------------------------------------------------

(deftest format-dimension-note-test
  (testing "returns nil when image was not resized"
    (is (nil? (img/format-dimension-note {:was-resized false}))))
  (testing "formats a note with scale factor"
    (let [result {:was-resized true :original-width 4000 :original-height 3000 :width 2000 :height 1500}
          note (img/format-dimension-note result)]
      (is (string? note))
      (is (.includes note "4000x3000"))
      (is (.includes note "2000x1500"))
      (is (.includes note "2.00")))))
