;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.shape.review-verification
  "Native fields of an envelope already admitted by actual Muse validation.")
(defn native-payload [envelope]
  {:event (:event envelope) :body (:summary envelope)
   :comments (mapv #(select-keys % [:path :line :side :body]) (:comments envelope))})

(defn refused [code] {:status :refused :code code :effects []})
