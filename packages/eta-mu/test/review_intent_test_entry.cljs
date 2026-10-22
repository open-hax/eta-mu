;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.test.review-intent-entry
  "Load the registered repository test under eta-mu's fixed NBB config."
  (:require [cljs.test :as test]
            [nbb.core :as nbb]))

(nbb/await (nbb/load-file "../../.github/scripts/opencode_review_intent_test.cljs"))
(test/run-tests 'opencode-review-intent-test)
