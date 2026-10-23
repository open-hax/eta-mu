;; SPDX-License-Identifier: GPL-3.0-or-later
(ns review-intent-barrier-entry
  "Test-only entrypoint under the same fixed config as the production worker."
  (:require [nbb.core :as nbb]))

(nbb/await (nbb/load-file "../test/cljs/eta_mu/review_intent_worker_barrier.cljs"))
