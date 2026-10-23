;; SPDX-License-Identifier: GPL-3.0-or-later
(ns antigravity.shape.finish
  "The pinned CLI finish tool may append two descriptive transport fields.
   They grant no authority and never enter the semantic review contract."
  (:require [antigravity.law.review :as law]
            [clojure.set :as set]))

(def metadata-keys #{:toolAction :toolSummary})
(defn split-output [output]
  (let [keys-found (when (map? output) (set (keys output)))
        metadata (select-keys output metadata-keys)
        decorated? (= keys-found (set/union law/result-keys metadata-keys))
        bounded? (every? #(and (law/text? %) (<= (count %) 4096)) (vals metadata))]
    (if (or (= keys-found law/result-keys) (and decorated? bounded?))
      {:status :shaped :review (apply dissoc output metadata-keys) :metadata metadata}
      {:status :refused :reason :native-finish-shape})))
