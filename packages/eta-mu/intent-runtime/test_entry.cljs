;; SPDX-License-Identifier: GPL-3.0-or-later
(ns test-entry
  "Load the registered repository test through the review-publication-intent suite."
  (:require [cljs.test :as test]
            [nbb.core :as nbb]))

(nbb/await (nbb/load-file "../../.github/scripts/opencode_review_intent_test.cljs"))
(test/run-tests 'opencode-review-intent-test)
