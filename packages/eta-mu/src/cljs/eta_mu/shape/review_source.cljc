;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.shape.review-source
  "Pure projection of the Git source boundary into stable Clojure data.")

(defn observation [raw]
  (select-keys raw [:diff-base-sha :full-diff-base64 :full-diff :preview-base64 :preview
                    :native-provenance :git-provenance]))
